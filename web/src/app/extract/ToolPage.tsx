// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { ToolLayout } from '../../components/ToolLayout';
// import { UploadBox } from '../../components/UploadBox';
// import { ProgressBar } from '../../components/ProgressBar';
// import { ResultDownload } from '../../components/ResultDownload';
// import { PageGrid } from '../../components/PageGrid';
// import { useUpload } from '../../hooks/useUpload';
// import { useJobStatus } from '../../hooks/useJobStatus';
// import { usePdfPageCount } from '../../hooks/usePdfPageCount';
// import { createPagesJob } from '../../lib/jobsClient';
// import { UploadedFile } from '../../types/web.types';
// import { PdfViewerModal, PreviewButton } from '../../components/PdfViewer';

// type Phase = 'upload' | 'select' | 'processing' | 'done' | 'error';

// /* ── Inline file header with thumbnail + preview button ────── */

// export default function ExtractPagesPage() {
//   const [file, setFile]       = useState<UploadedFile | null>(null);
//   const [rawFile, setRawFile] = useState<File | null>(null);
//   const [viewerFile, setViewerFile] = useState<File | null>(null);
//   const [phase, setPhase]     = useState<Phase>('upload');
//   const [error, setError]     = useState<string | null>(null);
//   const [selected, setSelected]   = useState<Set<number>>(new Set());
//   const [pageOrder, setPageOrder] = useState<number[]>([]);

//   const { state: uploadState, progress: uploadProgress, upload } = useUpload();
//   const { job, poll, reset: resetJob } = useJobStatus();
//   const { pageCount, loading: countLoading } = usePdfPageCount(rawFile);

//   if (pageCount && pageOrder.length === 0)
//     setPageOrder(Array.from({ length: pageCount }, (_, i) => i + 1));

//   async function handleDrop(files: File[]) {
//     const uploaded = await upload(files);
//     if (uploaded?.[0]) { setFile(uploaded[0]); setRawFile(files[0]); setPhase('select'); }
//   }

//   async function handleProcess() {
//     if (!file || selected.size === 0) return;
//     setError(null); setPhase('processing');
//     try {
//       const j = await createPagesJob(file.id, 'extract', Array.from(selected).sort((a, b) => a - b));
//       poll(j.id, (done) => {
//         if (done.status === 'COMPLETED') setPhase('done');
//         if (done.status === 'FAILED') { setError(done.error || 'Failed'); setPhase('error'); }
//       });
//     } catch (e: any) { setError(e.message); setPhase('error'); }
//   }

//   function handleReset() {
//     setFile(null); setRawFile(null); setViewerFile(null); setPhase('upload');
//     setError(null); setSelected(new Set()); setPageOrder([]); resetJob();
//   }

//   const accent = '#5BB8F5';

//   return (
//     <ToolLayout title="Extract Pages" tagline="Select the pages you want to keep and save them as a new PDF." icon="📤" accentColor={accent}>
//       {viewerFile && <PdfViewerModal file={viewerFile} onClose={() => setViewerFile(null)} />}

//       {phase === 'upload' && (
//         <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
//           <UploadBox onFiles={handleDrop} maxFiles={1} label="Drop a PDF to extract pages from" />
//           {uploadState === 'uploading' && <ProgressBar uploadProgress={uploadProgress} />}
//         </div>
//       )}

//       {phase === 'select' && rawFile && (
//         <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
//           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
//             <div>
//               <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>{file?.originalName}</p>
//               <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
//                 {countLoading ? 'Counting pages…' : `${pageCount} pages total`}
//               </p>
//             </div>
//             <div style={{ display: 'flex', gap: 8 }}>
//               <button onClick={handleReset} style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer' }}>← Back</button>
//               <PreviewButton onClick={() => setViewerFile(rawFile!)} />
//               <button onClick={handleProcess} disabled={selected.size === 0}
//                 style={{ padding: '8px 20px', borderRadius: 6, border: 'none', fontSize: 13, fontWeight: 600,
//                   cursor: selected.size === 0 ? 'not-allowed' : 'pointer',
//                   background: selected.size === 0 ? 'var(--surface-3)' : accent,
//                   color: selected.size === 0 ? 'var(--text-muted)' : '#fff' }}>
//                 Extract {selected.size > 0 ? `${selected.size} page${selected.size !== 1 ? 's' : ''}` : 'pages'} →
//               </button>
//             </div>
//           </div>
//           <div style={{ padding: '10px 14px', borderRadius: 6, fontSize: 12, background: 'rgba(91,184,245,0.1)', border: '1px solid rgba(91,184,245,0.25)', color: 'var(--text-soft)' }}>
//             Click pages to select them — only selected pages will appear in the output PDF.
//           </div>
//           {pageCount && <PageGrid file={rawFile} totalPages={pageCount} mode="extract" selectedPages={selected} pageOrder={pageOrder} onSelectedChange={setSelected} onOrderChange={setPageOrder} />}
//           {error && <div style={{ padding: '10px 14px', borderRadius: 6, fontSize: 13, background: 'rgba(235,16,0,0.1)', border: '1px solid rgba(235,16,0,0.3)', color: 'var(--accent)' }}>{error}</div>}
//         </div>
//       )}

//       {phase === 'processing' && (
//         <div style={{ padding: '64px 0', maxWidth: 440, margin: '0 auto', textAlign: 'center' }}>
//           <ProgressBar job={job} />
//           <p style={{ marginTop: 16, fontSize: 13, color: 'var(--text-muted)' }}>Extracting {selected.size} pages with qpdf…</p>
//         </div>
//       )}

//       {phase === 'done' && job && <ResultDownload jobId={job.id} filename="extracted-pages.pdf" onReset={handleReset} />}

//       {phase === 'error' && (
//         <div style={{ padding: '64px 0', textAlign: 'center' }}>
//           <p style={{ color: 'var(--accent)' }}>{error}</p>
//           <button onClick={handleReset} style={{ marginTop: 16, fontSize: 13, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Try again</button>
//         </div>
//       )}
//     </ToolLayout>
//   );
// }





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

type Phase = 'upload' | 'select' | 'processing' | 'done' | 'error';

export default function ExtractPagesPage() {
  const [file, setFile]       = useState<UploadedFile | null>(null);
  const [rawFile, setRawFile] = useState<File | null>(null);
  const [viewerFile, setViewerFile] = useState<File | null>(null);
  const [phase, setPhase]     = useState<Phase>('upload');
  const [error, setError]     = useState<string | null>(null);
  const [selected, setSelected]   = useState<Set<number>>(new Set());
  const [pageOrder, setPageOrder] = useState<number[]>([]);

  const { state: uploadState, progress: uploadProgress, upload } = useUpload();
  const { job, poll, reset: resetJob } = useJobStatus();
  const { pageCount, loading: countLoading } = usePdfPageCount(rawFile);

  if (pageCount && pageOrder.length === 0)
    setPageOrder(Array.from({ length: pageCount }, (_, i) => i + 1));

  async function handleDrop(files: File[]) {
    const uploaded = await upload(files);
    if (uploaded?.[0]) { setFile(uploaded[0]); setRawFile(files[0]); setPhase('select'); }
  }

  async function handleProcess() {
    if (!file || selected.size === 0) return;
    setError(null); setPhase('processing');
    try {
      const j = await createPagesJob(file.id, 'extract', Array.from(selected).sort((a, b) => a - b)) as any;
      poll((j as any).id, (done: any) => {
        if (done.status === 'COMPLETED') setPhase('done');
        if (done.status === 'FAILED') { setError(done.error || 'Failed'); setPhase('error'); }
      });
    } catch (e: any) { setError(e.message); setPhase('error'); }
  }

  function handleReset() {
    setFile(null); setRawFile(null); setViewerFile(null); setPhase('upload');
    setError(null); setSelected(new Set()); setPageOrder([]); resetJob();
  }

  const accent = '#5BB8F5';

  return (
    <ToolLayout title="Extract Pages" tagline="Select the pages you want to keep and save them as a new PDF." icon="📤" accentColor={accent}>
      {viewerFile && <PdfViewerModal file={viewerFile} onClose={() => setViewerFile(null)} />}

      {phase === 'upload' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <UploadBox onFiles={handleDrop} maxFiles={1} label="Drop a PDF to extract pages from" />
          {uploadState === 'uploading' && <ProgressBar uploadProgress={uploadProgress} />}
        </div>
      )}

      {phase === 'select' && rawFile && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>{file?.originalName}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {countLoading ? 'Counting pages…' : `${pageCount} pages total`}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleReset} style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer' }}>← Back</button>
              <PreviewButton onClick={() => setViewerFile(rawFile!)} />
              <button onClick={handleProcess} disabled={selected.size === 0}
                style={{ padding: '8px 20px', borderRadius: 6, border: 'none', fontSize: 13, fontWeight: 600,
                  cursor: selected.size === 0 ? 'not-allowed' : 'pointer',
                  background: selected.size === 0 ? 'var(--surface-3)' : accent,
                  color: selected.size === 0 ? 'var(--text-muted)' : '#fff' }}>
                Extract {selected.size > 0 ? `${selected.size} page${selected.size !== 1 ? 's' : ''}` : 'pages'} →
              </button>
            </div>
          </div>
          <div style={{ padding: '10px 14px', borderRadius: 6, fontSize: 12, background: 'rgba(91,184,245,0.1)', border: '1px solid rgba(91,184,245,0.25)', color: 'var(--text-soft)' }}>
            Click pages to select them — only selected pages will appear in the output PDF.
          </div>
          {pageCount && <PageGrid file={rawFile} totalPages={pageCount} mode="extract" selectedPages={selected} pageOrder={pageOrder} onSelectedChange={setSelected} onOrderChange={setPageOrder} />}
          {error && <div style={{ padding: '10px 14px', borderRadius: 6, fontSize: 13, background: 'rgba(235,16,0,0.1)', border: '1px solid rgba(235,16,0,0.3)', color: 'var(--accent)' }}>{error}</div>}
        </div>
      )}

      {phase === 'processing' && (
        <div style={{ padding: '64px 0', maxWidth: 440, margin: '0 auto', textAlign: 'center' }}>
          <ProgressBar job={job} />
          <p style={{ marginTop: 16, fontSize: 13, color: 'var(--text-muted)' }}>Extracting {selected.size} pages with qpdf…</p>
        </div>
      )}

      {phase === 'done' && job && <ResultDownload jobId={(job as any).id} filename="extracted-pages.pdf" onReset={handleReset} />}

      {phase === 'error' && (
        <div style={{ padding: '64px 0', textAlign: 'center' }}>
          <p style={{ color: 'var(--accent)' }}>{error}</p>
          <button onClick={handleReset} style={{ marginTop: 16, fontSize: 13, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Try again</button>
        </div>
      )}
    </ToolLayout>
  );
}