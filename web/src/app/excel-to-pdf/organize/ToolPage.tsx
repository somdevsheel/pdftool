'use client';

import { useState, useEffect, useRef } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { UploadBox } from '../../components/UploadBox';
import { ProgressBar } from '../../components/ProgressBar';
import { ResultDownload } from '../../components/ResultDownload';
import { PageGrid } from '../../components/PageGrid';
import { useUpload } from '../../hooks/useUpload';
import { useJobStatus } from '../../hooks/useJobStatus';
import { usePdfPageCount } from '../../hooks/usePdfPageCount';
import { createPagesJob } from '../../lib/jobsClient';
import { UploadedFile } from '../../types/web.types';
import { PdfViewerModal, PreviewButton, loadPdfJs } from '../../components/PdfViewer';

type Phase = 'upload' | 'organize' | 'processing' | 'done' | 'error';

export default function OrganizePagesPage() {
  const [file, setFile]       = useState<UploadedFile | null>(null);
  const [rawFile, setRawFile] = useState<File | null>(null);
  const [phase, setPhase]     = useState<Phase>('upload');
  const [error, setError]     = useState<string | null>(null);
  // "deleted" pages are removed from pageOrder entirely
  const [pageOrder, setPageOrder] = useState<number[]>([]);

  const { state: uploadState, progress: uploadProgress, upload } = useUpload();
  const { job, poll, reset: resetJob } = useJobStatus();
  const { pageCount, loading: countLoading } = usePdfPageCount(rawFile);

  if (pageCount && pageOrder.length === 0)
    setPageOrder(Array.from({ length: pageCount }, (_, i) => i + 1));

  async function handleDrop(files: File[]) {
    const uploaded = await upload(files);
    if (uploaded?.[0]) { setFile(uploaded[0]); setRawFile(files[0]); setPhase('organize'); }
  }

  // In organize mode, clicking a page REMOVES it from the order
  function handleRemovePage(pageNum: number) {
    setPageOrder((prev) => prev.filter((p) => p !== pageNum));
  }

  function resetOrder() {
    if (pageCount) setPageOrder(Array.from({ length: pageCount }, (_, i) => i + 1));
  }

  async function handleProcess() {
    if (!file || pageOrder.length === 0) return;
    setError(null); setPhase('processing');
    try {
      const j = await createPagesJob(file.id, 'organize', pageOrder);
      poll(j.id, (done) => {
        if (done.status === 'COMPLETED') setPhase('done');
        if (done.status === 'FAILED') { setError(done.error || 'Failed'); setPhase('error'); }
      });
    } catch (e: any) { setError(e.message); setPhase('error'); }
  }

  function handleReset() {
    setFile(null); setRawFile(null); setViewerFile(null); setPhase('upload');
    setError(null); setPageOrder([]); resetJob();
  }

  const accent = '#3FC87A';
  const removedCount = pageCount ? pageCount - pageOrder.length : 0;

  return (
    <ToolLayout title="Organize Pages" tagline="Drag pages to reorder, click × to remove, then save." icon="📋" accentColor={accent}>
      {viewerFile && <PdfViewerModal file={viewerFile} onClose={() => setViewerFile(null)} />}

            {phase === 'upload' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <UploadBox onFiles={handleDrop} maxFiles={1} label="Drop a PDF to organize" />
          {uploadState === 'uploading' && <ProgressBar uploadProgress={uploadProgress} />}
        </div>
      )}

      {phase === 'organize' && rawFile && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>{file?.originalName}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {countLoading ? 'Counting…' : `${pageOrder.length} of ${pageCount} pages`}
                {removedCount > 0 && <span style={{ color: 'var(--accent)', marginLeft: 6 }}>· {removedCount} removed</span>}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={resetOrder} style={{ padding: '8px 14px', borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer' }}>Reset</button>
              <button onClick={handleReset} style={{ padding: '8px 14px', borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer' }}>← Back</button>
              <PreviewButton onClick={() => setViewerFile(rawFile!)} />
              <button onClick={handleProcess} disabled={pageOrder.length === 0}
                style={{ padding: '8px 20px', borderRadius: 6, border: 'none', fontSize: 13, fontWeight: 600,
                  cursor: pageOrder.length === 0 ? 'not-allowed' : 'pointer',
                  background: pageOrder.length === 0 ? 'var(--surface-3)' : accent,
                  color: pageOrder.length === 0 ? 'var(--text-muted)' : '#fff' }}>
                Save PDF →
              </button>
            </div>
          </div>

          <div style={{ padding: '10px 14px', borderRadius: 6, fontSize: 12, background: 'rgba(63,200,122,0.1)', border: '1px solid rgba(63,200,122,0.25)', color: 'var(--text-soft)' }}>
            <strong>Drag</strong> pages to reorder · <strong>Click ×</strong> on any page card to remove it
          </div>

          {/* Organize grid with per-card delete buttons */}
          {pageCount && (
            <OrganizeGrid
              file={rawFile}
              pageOrder={pageOrder}
              onOrderChange={setPageOrder}
              onRemove={handleRemovePage}
            />
          )}

          {error && <div style={{ padding: '10px 14px', borderRadius: 6, fontSize: 13, background: 'rgba(235,16,0,0.1)', border: '1px solid rgba(235,16,0,0.3)', color: 'var(--accent)' }}>{error}</div>}
        </div>
      )}

      {phase === 'processing' && (
        <div style={{ padding: '64px 0', maxWidth: 440, margin: '0 auto', textAlign: 'center' }}>
          <ProgressBar job={job} />
          <p style={{ marginTop: 16, fontSize: 13, color: 'var(--text-muted)' }}>Organizing pages with qpdf…</p>
        </div>
      )}

      {phase === 'done' && job && <ResultDownload jobId={job.id} filename="organized.pdf" onReset={handleReset} />}

      {phase === 'error' && (
        <div style={{ padding: '64px 0', textAlign: 'center' }}>
          <p style={{ color: 'var(--accent)' }}>{error}</p>
          <button onClick={handleReset} style={{ marginTop: 16, fontSize: 13, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Try again</button>
        </div>
      )}
    </ToolLayout>
  );
}

/* ── Organize-specific grid with drag + per-card × remove ─────────────── */

function MiniThumb({ file, pageNum }: { file: File; pageNum: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let c = false;
    (async () => {
      try {
        const lib = await loadPdfJs();
        const buf = await file.arrayBuffer();
        const doc = await lib.getDocument({ data: buf }).promise;
        const page = await doc.getPage(pageNum);
        const vp0 = page.getViewport({ scale: 1 });
        const vp = page.getViewport({ scale: 110 / vp0.width });
        if (c) return;
        const cv = ref.current; if (!cv) return;
        cv.width = vp.width; cv.height = vp.height;
        await page.render({ canvasContext: cv.getContext('2d')!, viewport: vp }).promise;
        if (!c) setReady(true);
      } catch {}
    })();
    return () => { c = true; };
  }, [file, pageNum]);
  return (
    <div style={{ width: 110, height: Math.round(110 * 1.414), background: 'var(--surface-3)', borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
      {!ready && <div style={{ position: 'absolute', inset: 0, background: 'var(--surface-2)' }} />}
      <canvas ref={ref} style={{ display: ready ? 'block' : 'none', width: '100%', background: '#fff' }} />
    </div>
  );
}

function OrganizeGrid({ file, pageOrder, onOrderChange, onRemove }: {
  file: File; pageOrder: number[];
  onOrderChange: (o: number[]) => void;
  onRemove: (p: number) => void;
}) {
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  function drop(dropIdx: number) {
    if (dragIdx === null || dragIdx === dropIdx) { setDragIdx(null); setOverIdx(null); return; }
    const next = [...pageOrder];
    const [item] = next.splice(dragIdx, 1);
    next.splice(dropIdx, 0, item);
    onOrderChange(next);
    setDragIdx(null); setOverIdx(null);
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, maxHeight: 500, overflowY: 'auto', padding: 4, scrollbarWidth: 'thin' }}>
      {pageOrder.map((pageNum, idx) => (
        <div key={`${pageNum}-${idx}`}
          draggable
          onDragStart={() => setDragIdx(idx)}
          onDragOver={e => { e.preventDefault(); setOverIdx(idx); }}
          onDragEnd={() => { setDragIdx(null); setOverIdx(null); }}
          onDrop={e => { e.preventDefault(); drop(idx); }}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            padding: 8, borderRadius: 8, cursor: 'grab', position: 'relative',
            background: overIdx === idx && dragIdx !== idx ? 'var(--surface-3)' : 'var(--surface-2)',
            border: `2px solid ${overIdx === idx && dragIdx !== idx ? 'var(--accent)' : 'transparent'}`,
            opacity: dragIdx === idx ? 0.35 : 1,
            transition: 'border-color 0.1s, opacity 0.1s',
            userSelect: 'none',
          }}>
          {/* Remove × button */}
          <button onClick={() => onRemove(pageNum)}
            title="Remove this page"
            style={{
              position: 'absolute', top: 5, right: 5, zIndex: 2,
              width: 20, height: 20, borderRadius: 4, border: 'none',
              background: 'rgba(0,0,0,0.55)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', padding: 0, fontSize: 11,
            }}>
            ×
          </button>
          <MiniThumb file={file} pageNum={pageNum} />
          <div style={{ fontSize: 11, fontWeight: 600, fontFamily: 'monospace', padding: '2px 8px', borderRadius: 4, background: 'var(--surface-3)', color: 'var(--text-muted)' }}>
            {idx + 1}
          </div>
          <div style={{ fontSize: 9, color: 'var(--text-muted)', opacity: 0.5 }}>⠿ drag</div>
        </div>
      ))}
    </div>
  );
}
