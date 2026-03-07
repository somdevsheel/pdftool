'use client';

/**
 * PdfViewer.tsx — Shared PDF preview components used across all tools.
 *
 * Exports:
 *   loadPdfJs()            — lazy-loads PDF.js from CDN
 *   PdfViewerModal         — full-screen overlay: page nav, zoom, thumbnail strip
 *   FileThumbnailCard      — large card with thumbnail + hover "Preview" overlay (merge-style)
 *                              (split, compress, rotate, edit)
 */

import { useState, useEffect, useRef } from 'react';

/* ─────────────────────────────────────────────────────────────
   PDF.js lazy loader
───────────────────────────────────────────────────────────── */
export async function loadPdfJs(): Promise<any> {
  if ((window as any).pdfjsLib) return (window as any).pdfjsLib;
  await new Promise<void>((resolve, reject) => {
    if (document.getElementById('pdfjs-cdn')) { resolve(); return; }
    const s = document.createElement('script');
    s.id  = 'pdfjs-cdn';
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    s.onload  = () => resolve();
    s.onerror = reject;
    document.head.appendChild(s);
  });
  (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  return (window as any).pdfjsLib;
}

/* ─────────────────────────────────────────────────────────────
   Internal style helpers
───────────────────────────────────────────────────────────── */
function navBtnStyle(disabled: boolean): React.CSSProperties {
  return {
    padding: '5px 12px', borderRadius: 5,
    border: '1px solid var(--border)',
    background: 'var(--surface-2)',
    color: disabled ? 'var(--border)' : 'var(--text-soft)',
    fontSize: 12,
    cursor: disabled ? 'not-allowed' : 'pointer',
  };
}

function iconBtnStyle(): React.CSSProperties {
  return {
    width: 28, height: 28, borderRadius: 5,
    border: '1px solid var(--border)',
    background: 'var(--surface-2)',
    color: 'var(--text-soft)',
    fontSize: 16, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  };
}

/* ─────────────────────────────────────────────────────────────
   StripThumb — one page in the bottom thumbnail strip
───────────────────────────────────────────────────────────── */
function StripThumb({
  file, pageNum, active, onClick,
}: {
  file: File; pageNum: number; active: boolean; onClick: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const lib = await loadPdfJs();
        const buf = await file.arrayBuffer();
        const doc = await lib.getDocument({ data: buf }).promise;
        const page = await doc.getPage(pageNum);
        const vp0 = page.getViewport({ scale: 1 });
        const vp  = page.getViewport({ scale: 56 / vp0.width });
        if (cancelled) return;
        const canvas = canvasRef.current; if (!canvas) return;
        canvas.width = vp.width; canvas.height = vp.height;
        await page.render({ canvasContext: canvas.getContext('2d')!, viewport: vp }).promise;
        if (!cancelled) setReady(true);
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [file, pageNum]);

  return (
    <div
      onClick={onClick}
      style={{
        flexShrink: 0, cursor: 'pointer', borderRadius: 4, overflow: 'hidden',
        border: `2px solid ${active ? 'var(--accent)' : 'transparent'}`,
        background: 'var(--surface-3)', position: 'relative',
        transition: 'border-color 0.12s',
      }}
    >
      <div style={{
        position: 'absolute', bottom: 2, left: 0, right: 0, textAlign: 'center',
        fontSize: 9, fontFamily: 'monospace', padding: '1px 0',
        color: active ? 'var(--accent)' : 'var(--text-muted)',
        background: 'rgba(0,0,0,0.5)',
      }}>{pageNum}</div>
      {!ready && <div style={{ width: 56, height: 72, background: 'var(--surface-3)' }} />}
      <canvas ref={canvasRef} style={{ display: ready ? 'block' : 'none', width: 56 }} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PageStrip — horizontal thumbnail row at bottom of viewer
───────────────────────────────────────────────────────────── */
function PageStrip({
  file, numPages, curPage, onSelect,
}: {
  file: File; numPages: number; curPage: number; onSelect: (n: number) => void;
}) {
  return (
    <div
      onClick={e => e.stopPropagation()}
      style={{
        display: 'flex', gap: 8, overflowX: 'auto',
        padding: '10px 16px',
        background: 'var(--surface)', borderTop: '1px solid var(--border)',
        flexShrink: 0, scrollbarWidth: 'thin',
      }}
    >
      {Array.from({ length: numPages }, (_, i) => i + 1).map(n => (
        <StripThumb key={n} file={file} pageNum={n} active={n === curPage} onClick={() => onSelect(n)} />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PdfViewerModal — full-screen overlay
   Props:
     file     — the raw File object to render
     onClose  — called when user clicks backdrop, × button, or presses Escape
───────────────────────────────────────────────────────────── */
export function PdfViewerModal({
  file, onClose,
}: {
  file: File; onClose: () => void;
}) {
  const [numPages, setNumPages] = useState(0);
  const [curPage,  setCurPage]  = useState(1);
  const [zoom,     setZoom]     = useState(1.2);
  const [loading,  setLoading]  = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pdfRef    = useRef<any>(null);
  const renderRef = useRef<any>(null);

  /* Load document once */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const lib = await loadPdfJs();
        const buf = await file.arrayBuffer();
        const doc = await lib.getDocument({ data: buf }).promise;
        if (cancelled) return;
        pdfRef.current = doc;
        setNumPages(doc.numPages);
        setLoading(false);
      } catch { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [file]);

  /* Re-render page whenever curPage or zoom changes */
  useEffect(() => {
    if (!pdfRef.current || loading) return;
    let cancelled = false;
    (async () => {
      try {
        if (renderRef.current) { renderRef.current.cancel(); renderRef.current = null; }
        const page   = await pdfRef.current.getPage(curPage);
        const vp     = page.getViewport({ scale: zoom });
        const canvas = canvasRef.current; if (!canvas || cancelled) return;
        canvas.width = vp.width; canvas.height = vp.height;
        const ctx = canvas.getContext('2d')!;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const task = page.render({ canvasContext: ctx, viewport: vp });
        renderRef.current = task;
        await task.promise;
        renderRef.current = null;
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [curPage, zoom, loading]);

  /* Keyboard shortcuts */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') setCurPage(p => Math.min(p + 1, numPages));
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   setCurPage(p => Math.max(p - 1, 1));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [numPages, onClose]);

  return (
    /* Backdrop — click to close */
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.85)',
        display: 'flex', flexDirection: 'column',
        backdropFilter: 'blur(4px)',
      }}
    >
      {/* ── Top bar ── */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 20px',
          background: 'var(--surface)', borderBottom: '1px solid var(--border)',
          flexShrink: 0, gap: 16,
        }}
      >
        {/* File name */}
        <span style={{
          fontSize: 13, color: 'var(--text)', fontWeight: 500,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 300,
        }}>{file.name}</span>

        {/* Page navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <button onClick={() => setCurPage(p => Math.max(p - 1, 1))} disabled={curPage <= 1} style={navBtnStyle(curPage <= 1)}>‹ Prev</button>
          <span style={{ fontSize: 12, color: 'var(--text-soft)', fontFamily: 'monospace', minWidth: 70, textAlign: 'center' }}>
            {loading ? '…' : `${curPage} / ${numPages}`}
          </span>
          <button onClick={() => setCurPage(p => Math.min(p + 1, numPages))} disabled={curPage >= numPages} style={navBtnStyle(curPage >= numPages)}>Next ›</button>
        </div>

        {/* Zoom */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <button onClick={() => setZoom(z => Math.max(0.4, +(z - 0.2).toFixed(1)))} style={iconBtnStyle()}>−</button>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace', minWidth: 40, textAlign: 'center' }}>{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(3, +(z + 0.2).toFixed(1)))} style={iconBtnStyle()}>+</button>
          <button onClick={() => setZoom(1.2)} style={{ ...iconBtnStyle(), fontSize: 10, padding: '4px 8px', marginLeft: 4 }}>Reset</button>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            width: 30, height: 30, borderRadius: 6, border: 'none',
            background: 'var(--surface-3)', color: 'var(--text-muted)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* ── Canvas area ── */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          flex: 1, overflow: 'auto', display: 'flex',
          alignItems: 'flex-start', justifyContent: 'center',
          padding: '32px 24px', background: '#141414',
        }}
      >
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400, color: 'var(--text-muted)', fontSize: 14 }}>
            Loading PDF…
          </div>
        ) : (
          <div style={{ background: '#fff', boxShadow: '0 8px 48px rgba(0,0,0,0.6)', borderRadius: 4, lineHeight: 0 }}>
            <canvas ref={canvasRef} style={{ display: 'block', maxWidth: '100%' }} />
          </div>
        )}
      </div>

      {/* ── Bottom thumbnail strip ── */}
      {!loading && numPages > 1 && (
        <PageStrip file={file} numPages={numPages} curPage={curPage} onSelect={setCurPage} />
      )}
    </div>
  );
}


/* ─────────────────────────────────────────────────────────────
   FileThumbnailCard
   Large card with page-1 thumbnail + hover "Preview" overlay.
   IDENTICAL visual pattern to merge tool's FileCard.
   Used by: split, compress, rotate, edit
───────────────────────────────────────────────────────────── */
function PdfThumbnail({ file, width = 135 }: { file: File; width?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded,  setLoaded]  = useState(false);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoaded(false); setErrored(false);
    (async () => {
      try {
        const lib  = await loadPdfJs();
        const data = await file.arrayBuffer();
        const doc  = await lib.getDocument({ data }).promise;
        const page = await doc.getPage(1);
        const vp0  = page.getViewport({ scale: 1 });
        const vp   = page.getViewport({ scale: width / vp0.width });
        if (cancelled) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width  = vp.width;
        canvas.height = vp.height;
        await page.render({ canvasContext: canvas.getContext('2d')!, viewport: vp }).promise;
        if (!cancelled) setLoaded(true);
      } catch { if (!cancelled) setErrored(true); }
    })();
    return () => { cancelled = true; };
  }, [file, width]);

  const h = Math.round(width * 1.414);

  if (errored) return (
    <div style={{ width, height: h, background: 'var(--surface-3)', borderRadius: 4,
      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="28" height="34" viewBox="0 0 28 34" fill="none">
        <path d="M2 2h16l8 8v20a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2z"
          stroke="var(--text-muted)" strokeWidth="1.2" fill="var(--surface-2)"/>
        <path d="M18 2v8h8" stroke="var(--text-muted)" strokeWidth="1.2" fill="none"/>
        <text x="5" y="28" fontSize="7" fontFamily="monospace" fontWeight="bold" fill="var(--accent)">PDF</text>
      </svg>
    </div>
  );

  return (
    <div style={{ width, height: h, background: 'var(--surface-3)', borderRadius: 4,
      overflow: 'hidden', position: 'relative' }}>
      {!loaded && <div className="skeleton" style={{ position: 'absolute', inset: 0 }} />}
      <canvas ref={canvasRef} style={{ display: loaded ? 'block' : 'none', width: '100%', height: 'auto' }} />
    </div>
  );
}

export function FileThumbnailCard({
  file, uploadedFile, onPreview,
}: {
  file: File;
  uploadedFile: { originalName: string; size: number };
  onPreview: () => void;
}) {
  const fmtBytes = (b: number) =>
    b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(2)} MB`;

  return (
    <div style={{
      width: 155, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8,
      padding: 10, borderRadius: 10,
      background: 'var(--surface-2)',
      border: '2px solid transparent',
      userSelect: 'none',
    }}>
      {/* Thumbnail — click to open viewer */}
      <div
        onClick={onPreview}
        title="Click to preview"
        style={{
          borderRadius: 4, overflow: 'hidden', cursor: 'pointer',
          position: 'relative',
        }}
      >
        <PdfThumbnail file={file} width={135} />

        {/* Hover overlay — IDENTICAL to merge FileCard */}
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.15s',
          borderRadius: 4,
        }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.35)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0)')}
        >
          <div style={{
            background: 'rgba(0,0,0,0.7)', borderRadius: 6,
            padding: '5px 10px', fontSize: 11, color: '#fff',
            display: 'flex', alignItems: 'center', gap: 5,
            pointerEvents: 'none',
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/>
              <circle cx="6" cy="6" r="2" fill="currentColor"/>
            </svg>
            Preview
          </div>
        </div>
      </div>

      {/* Name + size */}
      <div style={{ padding: '0 2px' }}>
        <p style={{ fontSize: 11, fontWeight: 500, color: 'var(--text)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          title={uploadedFile.originalName}>{uploadedFile.originalName}</p>
        <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2, fontFamily: 'monospace' }}>
          {fmtBytes(uploadedFile.size)}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PreviewButton — lightweight trigger for page-grid tools
   (delete-pages, extract, reorder, organize)
   Shown in the action bar header, opens viewer for rawFile.
───────────────────────────────────────────────────────────── */
export function PreviewButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 14px', borderRadius: 6,
        border: '1px solid var(--border)',
        background: 'var(--surface-3)', color: 'var(--text-soft)',
        fontSize: 12, cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 6,
      }}
    >
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
        <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
        <circle cx="6.5" cy="6.5" r="2.2" fill="currentColor"/>
      </svg>
      Preview PDF
    </button>
  );
}
