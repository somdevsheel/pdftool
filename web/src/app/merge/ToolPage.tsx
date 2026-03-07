'use client';

import { useState, useEffect, useRef } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { UploadBox } from '../../components/UploadBox';
import { ProgressBar } from '../../components/ProgressBar';
import { ResultDownload } from '../../components/ResultDownload';
import { useUpload } from '../../hooks/useUpload';
import { useJobStatus } from '../../hooks/useJobStatus';
import { useFiles } from '../../hooks/useFiles';
import { createMergeJob } from '../../lib/jobsClient';
import { UploadedFile } from '../../types/web.types';
import { PdfViewerModal, loadPdfJs } from '../../components/PdfViewer';

type Phase = 'upload' | 'processing' | 'done' | 'error';

/* ─────────────────────────────────────────────────────────────
   Shared button style helpers
───────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────
   PDF Thumbnail (card preview)
───────────────────────────────────────────────────────────── */
function PdfThumbnail({ file, width = 130 }: { file: File; width?: number }) {
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

/* ─────────────────────────────────────────────────────────────
   FileCard — draggable card with click-to-open
───────────────────────────────────────────────────────────── */
function FileCard({
  file, rawFile, index, total, isDragging, isDragOver,
  onDragStart, onDragOver, onDragEnd, onDrop,
  onRemove, onMoveLeft, onMoveRight, onOpen,
}: {
  file: UploadedFile; rawFile: File; index: number; total: number;
  isDragging: boolean; isDragOver: boolean;
  onDragStart: () => void; onDragOver: (e: React.DragEvent) => void;
  onDragEnd: () => void; onDrop: () => void;
  onRemove: () => void; onMoveLeft: () => void; onMoveRight: () => void;
  onOpen: () => void;
}) {
  const fmtBytes = (b: number) =>
    b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(2)} MB`;

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={e => { e.preventDefault(); onDragOver(e); }}
      onDragEnd={onDragEnd}
      onDrop={e => { e.preventDefault(); onDrop(); }}
      style={{
        width: 155, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8,
        padding: 10, borderRadius: 10, cursor: 'grab',
        background: isDragOver ? 'var(--surface-3)' : 'var(--surface-2)',
        border: `2px solid ${isDragOver ? 'var(--accent)' : isDragging ? 'var(--border-light)' : 'transparent'}`,
        opacity: isDragging ? 0.4 : 1,
        transition: 'border-color 0.12s, opacity 0.12s, background 0.12s',
        userSelect: 'none', position: 'relative',
      }}
    >
      {/* Order badge */}
      <div style={{
        position: 'absolute', top: 8, left: 8, zIndex: 2,
        background: 'var(--accent)', color: '#fff', borderRadius: 4,
        padding: '1px 7px', fontSize: 10, fontWeight: 700, fontFamily: 'monospace',
      }}>{index + 1}</div>

      {/* Remove */}
      <button onClick={e => { e.stopPropagation(); onRemove(); }} title="Remove"
        style={{
          position: 'absolute', top: 6, right: 6, zIndex: 2,
          width: 22, height: 22, borderRadius: 5, border: 'none',
          background: 'rgba(0,0,0,0.5)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', padding: 0,
        }}>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Thumbnail — click to open viewer */}
      <div
        onClick={onOpen}
        title="Click to preview"
        style={{
          borderRadius: 4, overflow: 'hidden', cursor: 'pointer',
          position: 'relative',
        }}
      >
        <PdfThumbnail file={rawFile} width={135} />

        {/* Hover overlay hint */}
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
          title={file.originalName}>{file.originalName}</p>
        <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2, fontFamily: 'monospace' }}>
          {fmtBytes(file.size)}
        </p>
      </div>

      {/* Move L/R */}
      <div style={{ display: 'flex', gap: 4 }}>
        {[
          { label: '◀', disabled: index === 0, fn: onMoveLeft, title: 'Move left' },
          { label: '▶', disabled: index === total - 1, fn: onMoveRight, title: 'Move right' },
        ].map(({ label, disabled, fn, title }) => (
          <button key={label} onClick={fn} disabled={disabled} title={title}
            style={{
              flex: 1, padding: '4px 0', borderRadius: 5, fontSize: 11,
              background: 'var(--surface-3)', border: '1px solid var(--border)',
              color: disabled ? 'var(--border)' : 'var(--text-muted)',
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}>{label}</button>
        ))}
      </div>

      <p style={{ fontSize: 9, color: 'var(--text-muted)', textAlign: 'center', opacity: 0.5, marginTop: -4 }}>
        ⠿ drag to reorder
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main Merge Page
───────────────────────────────────────────────────────────── */
export default function MergePage() {
  const { files: uploadedFiles, add, remove, reorder, clear } = useFiles(20);
  const { state: uploadState, progress: uploadProgress, upload } = useUpload();
  const { job, poll, reset: resetJob } = useJobStatus();
  const [phase,    setPhase]    = useState<Phase>('upload');
  const [error,    setError]    = useState<string | null>(null);
  const [rawFiles, setRawFiles] = useState<Map<string, File>>(new Map());
  const [dragIdx,  setDragIdx]  = useState<number | null>(null);
  const [overIdx,  setOverIdx]  = useState<number | null>(null);

  // Viewer state
  const [viewerFile, setViewerFile] = useState<File | null>(null);

  async function handleDrop(files: File[]) {
    const uploaded = await upload(files);
    if (!uploaded) return;
    add(uploaded);
    setRawFiles(prev => {
      const next = new Map(prev);
      uploaded.forEach((u, i) => {
        const match = files.find(f => f.name === u.originalName && f.size === u.size) ?? files[i];
        if (match) next.set(u.id, match);
      });
      return next;
    });
  }

  function handleRemove(id: string) {
    remove(id);
    setRawFiles(prev => { const m = new Map(prev); m.delete(id); return m; });
  }

  function handleDropCard(dropIdx: number) {
    if (dragIdx !== null && dragIdx !== dropIdx) reorder(dragIdx, dropIdx);
    setDragIdx(null); setOverIdx(null);
  }

  async function handleMerge() {
    if (uploadedFiles.length < 2) { setError('Please upload at least 2 PDF files.'); return; }
    setError(null); setPhase('processing');
    try {
      const j = await createMergeJob(uploadedFiles.map(f => f.id)) as any;
        poll((j as any).id, (done: any) => {
        if (done.status === 'COMPLETED') setPhase('done');
        if (done.status === 'FAILED') { setError(done.error || 'Merge failed'); setPhase('error'); }
      });
    } catch (e: any) { setError(e.message); setPhase('error'); }
  }

  function handleReset() {
    clear(); resetJob(); setPhase('upload');
    setError(null); setRawFiles(new Map()); setViewerFile(null);
  }

  return (
    <ToolLayout
      title="Merge PDF"
      tagline="Combine multiple PDFs into one. Click any thumbnail to preview — drag to reorder."
      icon="📎"
      accentColor="var(--accent)"
    >
      {/* ── Full-screen PDF viewer modal ── */}
      {viewerFile && (
        <PdfViewerModal file={viewerFile} onClose={() => setViewerFile(null)} />
      )}

      {phase === 'upload' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <UploadBox onFiles={handleDrop} maxFiles={20}
            label="Drop PDFs here to merge"
            sublabel="Click any thumbnail to preview · Drag cards to reorder" />

          {uploadState === 'uploading' && <ProgressBar uploadProgress={uploadProgress} />}

          {uploadedFiles.length > 0 && (
            <div>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>Merge order</span>
                  <span className="stamp">{uploadedFiles.length} files</span>
                </div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  Click thumbnail to preview · Drag or use ◀▶ to reorder
                </span>
              </div>

              {/* Card strip */}
              <div style={{
                display: 'flex', gap: 12, overflowX: 'auto',
                paddingBottom: 14, paddingTop: 4, scrollbarWidth: 'thin',
              }}>
                {uploadedFiles.map((file, idx) => {
                  const raw = rawFiles.get(file.id);
                  if (!raw) return null;
                  return (
                    <FileCard
                      key={file.id}
                      file={file} rawFile={raw} index={idx} total={uploadedFiles.length}
                      isDragging={dragIdx === idx}
                      isDragOver={overIdx === idx && dragIdx !== idx}
                      onDragStart={() => setDragIdx(idx)}
                      onDragOver={() => setOverIdx(idx)}
                      onDragEnd={() => { setDragIdx(null); setOverIdx(null); }}
                      onDrop={() => handleDropCard(idx)}
                      onRemove={() => handleRemove(file.id)}
                      onMoveLeft={() => reorder(idx, idx - 1)}
                      onMoveRight={() => reorder(idx, idx + 1)}
                      onOpen={() => setViewerFile(raw)}
                    />
                  );
                })}

                {/* Add more */}
                <label style={{
                  width: 155, minHeight: 240, flexShrink: 0,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: 8,
                  border: '2px dashed var(--border)', borderRadius: 10,
                  cursor: 'pointer', color: 'var(--text-muted)', transition: 'border-color 0.15s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-light)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                >
                  <input type="file" accept={{ 'application/pdf': ['.pdf'] }} multiple style={{ display: 'none' }}
                    onChange={async e => {
                      const files = Array.from(e.target.files ?? []);
                      if (files.length) await handleDrop(files);
                      e.target.value = '';
                    }} />
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%', background: 'var(--surface-3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M9 4v10M4 9h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <span style={{ fontSize: 12, textAlign: 'center', lineHeight: 1.5 }}>Add more PDFs</span>
                </label>
              </div>

              {error && (
                <div style={{
                  marginTop: 8, padding: '10px 16px', borderRadius: 6, fontSize: 13,
                  background: 'rgba(235,16,0,0.1)', border: '1px solid rgba(235,16,0,0.3)',
                  color: 'var(--accent)',
                }}>{error}</div>
              )}

              <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                <button onClick={handleMerge} disabled={uploadedFiles.length < 2}
                  style={{
                    padding: '11px 32px', borderRadius: 7, border: 'none', fontWeight: 600,
                    fontSize: 14, cursor: uploadedFiles.length < 2 ? 'not-allowed' : 'pointer',
                    background: uploadedFiles.length < 2 ? 'var(--surface-3)' : 'var(--accent)',
                    color: uploadedFiles.length < 2 ? 'var(--text-muted)' : '#fff',
                  }}>
                  Merge {uploadedFiles.length} PDF{uploadedFiles.length !== 1 ? 's' : ''} →
                </button>
                <button onClick={handleReset}
                  style={{
                    padding: '11px 22px', borderRadius: 7,
                    border: '1px solid var(--border)', background: 'transparent',
                    color: 'var(--text-muted)', fontSize: 14, cursor: 'pointer',
                  }}>
                  Clear all
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {phase === 'processing' && (
        <div style={{ padding: '64px 0', maxWidth: 440, margin: '0 auto', textAlign: 'center' }}>
          <ProgressBar job={job} />
          <p style={{ marginTop: 18, fontSize: 13, color: 'var(--text-muted)' }}>
            Merging {uploadedFiles.length} PDF files with qpdf…
          </p>
        </div>
      )}

      {phase === 'done' && job && (
        <ResultDownload jobId={job.id} filename="merged.pdf" onReset={handleReset} />
      )}

      {phase === 'error' && (
        <div style={{ padding: '64px 0', textAlign: 'center' }}>
          <p style={{ color: 'var(--accent)', fontWeight: 500 }}>{error || 'An error occurred'}</p>
          <button onClick={handleReset}
            style={{ marginTop: 16, fontSize: 13, color: 'var(--text-muted)',
              background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
            Try again
          </button>
        </div>
      )}
    </ToolLayout>
  );
}
