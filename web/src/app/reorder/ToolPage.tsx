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
import { PdfViewerModal, PreviewButton } from '../../components/PdfViewer';

type Phase = 'upload' | 'reorder' | 'processing' | 'done' | 'error';

/* ── Inline file header with thumbnail + preview button ────── */

export default function ReorderPagesPage() {
  const [file, setFile]       = useState<UploadedFile | null>(null);
  const [rawFile, setRawFile] = useState<File | null>(null);
  const [viewerFile, setViewerFile] = useState<File | null>(null);
  const [phase, setPhase]     = useState<Phase>('upload');
  const [error, setError]     = useState<string | null>(null);
  const [pageOrder, setPageOrder] = useState<number[]>([]);

  const { state: uploadState, progress: uploadProgress, upload } = useUpload();
  const { job, poll, reset: resetJob } = useJobStatus();
  const { pageCount, loading: countLoading } = usePdfPageCount(rawFile);

  if (pageCount && pageOrder.length === 0)
    setPageOrder(Array.from({ length: pageCount }, (_, i) => i + 1));

  async function handleDrop(files: File[]) {
    const uploaded = await upload(files);
    if (uploaded?.[0]) { setFile(uploaded[0]); setRawFile(files[0]); setPhase('reorder'); }
  }

  async function handleProcess() {
    if (!file || pageOrder.length === 0) return;
    setError(null); setPhase('processing');
    try {
      const j = await createPagesJob(file.id, 'reorder', pageOrder);
      poll(j.id, (done) => {
        if (done.status === 'COMPLETED') setPhase('done');
        if (done.status === 'FAILED') { setError(done.error || 'Failed'); setPhase('error'); }
      });
    } catch (e: any) { setError(e.message); setPhase('error'); }
  }

  function resetOrder() {
    if (pageCount) setPageOrder(Array.from({ length: pageCount }, (_, i) => i + 1));
  }

  function handleReset() {
    setFile(null); setRawFile(null); setViewerFile(null); setPhase('upload');
    setError(null); setPageOrder([]); resetJob();
  }

  const accent = '#E87CF3';

  return (
    <ToolLayout toolTag="Reorder Pages" title="Reorder Pages" tagline="Drag and drop pages into the order you want." icon="↕️" accentColor={accent}>
      {viewerFile && <PdfViewerModal file={viewerFile} onClose={() => setViewerFile(null)} />}

      {phase === 'upload' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <UploadBox onFiles={handleDrop} maxFiles={1} label="Drop a PDF to reorder its pages" />
          {uploadState === 'uploading' && <ProgressBar uploadProgress={uploadProgress} />}
        </div>
      )}

      {phase === 'reorder' && rawFile && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>{file?.originalName}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {countLoading ? 'Counting pages…' : `${pageCount} pages`}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={resetOrder} style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer' }}>Reset order</button>
              <button onClick={handleReset} style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer' }}>← Back</button>
              <PreviewButton onClick={() => setViewerFile(rawFile!)} />
              <button onClick={handleProcess} disabled={pageOrder.length === 0}
                style={{ padding: '8px 20px', borderRadius: 6, border: 'none', fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', background: accent, color: '#fff' }}>
                Save reordered PDF →
              </button>
            </div>
          </div>
          <div style={{ padding: '10px 14px', borderRadius: 6, fontSize: 12, background: 'rgba(232,124,243,0.1)', border: '1px solid rgba(232,124,243,0.25)', color: 'var(--text-soft)' }}>
            Drag the page thumbnails into the order you want. The number badge shows the new position.
          </div>
          {pageCount && <PageGrid file={rawFile} totalPages={pageCount} mode="reorder" selectedPages={new Set()} pageOrder={pageOrder} onSelectedChange={() => {}} onOrderChange={setPageOrder} />}
          {error && <div style={{ padding: '10px 14px', borderRadius: 6, fontSize: 13, background: 'rgba(235,16,0,0.1)', border: '1px solid rgba(235,16,0,0.3)', color: 'var(--accent)' }}>{error}</div>}
        </div>
      )}

      {phase === 'processing' && (
        <div style={{ padding: '64px 0', maxWidth: 440, margin: '0 auto', textAlign: 'center' }}>
          <ProgressBar job={job} />
          <p style={{ marginTop: 16, fontSize: 13, color: 'var(--text-muted)' }}>Reordering pages with qpdf…</p>
        </div>
      )}

      {phase === 'done' && job && <ResultDownload jobId={job.id} filename="reordered.pdf" onReset={handleReset} />}

      {phase === 'error' && (
        <div style={{ padding: '64px 0', textAlign: 'center' }}>
          <p style={{ color: 'var(--accent)' }}>{error}</p>
          <button onClick={handleReset} style={{ marginTop: 16, fontSize: 13, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Try again</button>
        </div>
      )}
    </ToolLayout>
  );
}
