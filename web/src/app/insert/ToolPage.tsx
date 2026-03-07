// 'use client';
// import { useState } from 'react';
// import { ToolLayout } from '../../components/ToolLayout';
// import { UploadBox } from '../../components/UploadBox';
// import { ProgressBar } from '../../components/ProgressBar';
// import { ResultDownload } from '../../components/ResultDownload';
// import { FileThumbnailCard, PdfViewerModal } from '../../components/PdfViewer';
// import { useUpload } from '../../hooks/useUpload';
// import { useJobStatus } from '../../hooks/useJobStatus';

// type Phase = 'upload-base' | 'upload-insert' | 'configure' | 'processing' | 'done' | 'error';
// const accent = '#10b981';

// export default function InsertPagesToolPage() {
//   const [baseFile, setBaseFile]       = useState<any>(null);
//   const [baseRaw, setBaseRaw]         = useState<File | null>(null);
//   const [insertFile, setInsertFile]   = useState<any>(null);
//   const [insertRaw, setInsertRaw]     = useState<File | null>(null);
//   const [viewerFile, setViewerFile]   = useState<File | null>(null);
//   const [phase, setPhase]             = useState<Phase>('upload-base');
//   const [afterPage, setAfterPage]     = useState<number | ''>(0);
//   const [error, setError]             = useState<string | null>(null);
//   const { state: uploadState, progress: uploadProgress, upload } = useUpload();
//   const { job, poll, reset: resetJob } = useJobStatus();

//   async function handleBaseDrop(raw: File[]) {
//     const uploaded = await upload(raw);
//     if (uploaded?.[0]) { setBaseFile(uploaded[0]); setBaseRaw(raw[0]); setPhase('upload-insert'); }
//   }
//   async function handleInsertDrop(raw: File[]) {
//     const uploaded = await upload(raw);
//     if (uploaded?.[0]) { setInsertFile(uploaded[0]); setInsertRaw(raw[0]); setPhase('configure'); }
//   }

//   async function handleInsert() {
//     if (!baseFile || !insertFile) return;
//     setError(null); setPhase('processing');
//     try {
//       const res = await fetch('http://localhost:3001/api/v1/jobs/insert-pages', {
//         method: 'POST', headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ baseFileId: baseFile.id, insertFileId: insertFile.id, afterPage: afterPage === '' ? 0 : Number(afterPage) }),
//       });
//       const j = await res.json().then(d => d.data ?? d);
//       poll(j.id, (done: any) => {
//         if (done.status === 'COMPLETED') setPhase('done');
//         if (done.status === 'FAILED') { setError(done.error || 'Failed'); setPhase('error'); }
//       });
//     } catch (e: any) { setError(e.message); setPhase('error'); }
//   }

//   function handleReset() { setBaseFile(null); setBaseRaw(null); setInsertFile(null); setInsertRaw(null); setPhase('upload-base'); setError(null); resetJob(); }

//   return (
//     <ToolLayout title="Insert Pages" tagline="Add pages into an existing PDF." icon="➕" accentColor={accent}>
//       {viewerFile && <PdfViewerModal file={viewerFile} onClose={() => setViewerFile(null)} />}

//       {phase === 'upload-base' && (
//         <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
//           <div style={{ padding: '12px 16px', borderRadius: 8, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', fontSize: 13, color: 'var(--text-muted)' }}>
//             Step 1 of 2 — Upload the <strong style={{ color: 'var(--text)' }}>base PDF</strong> (the one to insert pages into)
//           </div>
//           <UploadBox onFiles={handleBaseDrop} maxFiles={1} label="Drop base PDF" accept={{ 'application/pdf': ['.pdf'] }} />
//           {uploadState === 'uploading' && <ProgressBar uploadProgress={uploadProgress} />}
//         </div>
//       )}

//       {phase === 'upload-insert' && (
//         <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
//           {baseRaw && <FileThumbnailCard file={baseRaw} uploadedFile={baseFile} onPreview={() => setViewerFile(baseRaw)} />}
//           <div style={{ padding: '12px 16px', borderRadius: 8, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', fontSize: 13, color: 'var(--text-muted)' }}>
//             Step 2 of 2 — Upload the <strong style={{ color: 'var(--text)' }}>PDF to insert</strong>
//           </div>
//           <UploadBox onFiles={handleInsertDrop} maxFiles={1} label="Drop PDF to insert" accept={{ 'application/pdf': ['.pdf'] }} />
//           {uploadState === 'uploading' && <ProgressBar uploadProgress={uploadProgress} />}
//         </div>
//       )}

//       {phase === 'configure' && baseFile && insertFile && baseRaw && insertRaw && (
//         <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 480 }}>
//           <div style={{ display: 'flex', gap: 12 }}>
//             <div style={{ flex: 1 }}>
//               <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 6px' }}>Base PDF</p>
//               <FileThumbnailCard file={baseRaw} uploadedFile={baseFile} onPreview={() => setViewerFile(baseRaw)} />
//             </div>
//             <div style={{ flex: 1 }}>
//               <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 6px' }}>Insert PDF</p>
//               <FileThumbnailCard file={insertRaw} uploadedFile={insertFile} onPreview={() => setViewerFile(insertRaw)} />
//             </div>
//           </div>

//           <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
//             <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Insert after page</label>
//             <input
//               type="number" min={0} value={afterPage}
//               onChange={e => setAfterPage(e.target.value === '' ? '' : Number(e.target.value))}
//               placeholder="0 = prepend at beginning"
//               style={{ padding: '10px 12px', borderRadius: 8, background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: 14, outline: 'none' }}
//             />
//             <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>Enter 0 to prepend at the beginning</p>
//           </div>

//           {error && <p style={{ fontSize: 13, color: '#eb1000', background: 'rgba(235,16,0,0.08)', padding: '10px 14px', borderRadius: 6, margin: 0 }}>{error}</p>}

//           <div style={{ display: 'flex', gap: 10 }}>
//             <button onClick={handleInsert} style={{ flex: 1, padding: '12px 0', borderRadius: 8, border: 'none', background: accent, color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
//               Insert Pages →
//             </button>
//             <button onClick={handleReset} style={{ padding: '12px 20px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer' }}>Back</button>
//           </div>
//         </div>
//       )}

//       {phase === 'processing' && <div style={{ padding: '64px 0', maxWidth: 440, margin: '0 auto', textAlign: 'center' }}><ProgressBar job={job} /><p style={{ marginTop: 16, fontSize: 13, color: 'var(--text-muted)' }}>Inserting pages…</p></div>}
//       {phase === 'done' && job && <ResultDownload jobId={(job as any).id} filename="inserted.pdf" onReset={handleReset} />}
//       {phase === 'error' && <div style={{ padding: '64px 0', textAlign: 'center' }}><p style={{ color: '#eb1000' }}>{error}</p><button onClick={handleReset} style={{ marginTop: 16, fontSize: 13, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Try again</button></div>}
//     </ToolLayout>
//   );
// }












'use client';
import { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { UploadBox } from '../../components/UploadBox';
import { ProgressBar } from '../../components/ProgressBar';
import { ResultDownload } from '../../components/ResultDownload';
import { FileThumbnailCard, PdfViewerModal } from '../../components/PdfViewer';
import { useUpload } from '../../hooks/useUpload';
import { useJobStatus } from '../../hooks/useJobStatus';

type Phase = 'upload-base' | 'upload-insert' | 'configure' | 'processing' | 'done' | 'error';
const accent = '#10b981';

export default function InsertPagesToolPage() {
  const [baseFile, setBaseFile]     = useState<any>(null);
  const [baseRaw, setBaseRaw]       = useState<File | null>(null);
  const [insertFile, setInsertFile] = useState<any>(null);
  const [insertRaw, setInsertRaw]   = useState<File | null>(null);
  const [viewerFile, setViewerFile] = useState<File | null>(null);
  const [phase, setPhase]           = useState<Phase>('upload-base');
  const [afterPage, setAfterPage]   = useState<number | ''>(0);
  const [error, setError]           = useState<string | null>(null);
  const { state: uploadState, progress: uploadProgress, upload } = useUpload();
  const { job, poll, reset: resetJob } = useJobStatus();

  async function handleBaseDrop(raw: File[]) {
    const uploaded = await upload(raw);
    if (uploaded?.[0]) { setBaseFile(uploaded[0]); setBaseRaw(raw[0]); setPhase('upload-insert'); }
  }

  async function handleInsertDrop(raw: File[]) {
    const uploaded = await upload(raw);
    if (uploaded?.[0]) { setInsertFile(uploaded[0]); setInsertRaw(raw[0]); setPhase('configure'); }
  }

  async function handleInsert() {
    if (!baseFile || !insertFile) return;
    setError(null);
    setPhase('processing');
    try {
      const res = await fetch('http://localhost:3001/api/v1/jobs/insert-pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseFileId: baseFile.id,
          insertFileId: insertFile.id,
          afterPage: afterPage === '' ? 0 : Number(afterPage),
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server error: ${text}`);
      }
      const json = await res.json();
      // handle { success, data: { id } } or { id } directly
      const jobData = json.data ?? json;
      const jobId = jobData.id;
      if (!jobId) throw new Error('No job ID returned from server');
      poll(jobId, (done: any) => {
        if (done.status === 'COMPLETED') setPhase('done');
        if (done.status === 'FAILED') { setError(done.error || 'Failed'); setPhase('error'); }
      });
    } catch (e: any) {
      setError(e.message);
      setPhase('error');
    }
  }

  function handleReset() {
    setBaseFile(null); setBaseRaw(null);
    setInsertFile(null); setInsertRaw(null);
    setPhase('upload-base'); setError(null); resetJob();
  }

  return (
    <ToolLayout title="Insert Pages" tagline="Add pages into an existing PDF." icon="➕" accentColor={accent}>
      {viewerFile && <PdfViewerModal file={viewerFile} onClose={() => setViewerFile(null)} />}

      {phase === 'upload-base' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ padding: '12px 16px', borderRadius: 8, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', fontSize: 13, color: 'var(--text-muted)' }}>
            Step 1 of 2 — Upload the <strong style={{ color: 'var(--text)' }}>base PDF</strong> (the one to insert pages into)
          </div>
          <UploadBox onFiles={handleBaseDrop} maxFiles={1} label="Drop base PDF" accept={{ 'application/pdf': ['.pdf'] }} />
          {uploadState === 'uploading' && <ProgressBar uploadProgress={uploadProgress} />}
        </div>
      )}

      {phase === 'upload-insert' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {baseRaw && <FileThumbnailCard file={baseRaw} uploadedFile={baseFile} onPreview={() => setViewerFile(baseRaw)} />}
          <div style={{ padding: '12px 16px', borderRadius: 8, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', fontSize: 13, color: 'var(--text-muted)' }}>
            Step 2 of 2 — Upload the <strong style={{ color: 'var(--text)' }}>PDF to insert</strong>
          </div>
          <UploadBox onFiles={handleInsertDrop} maxFiles={1} label="Drop PDF to insert" accept={{ 'application/pdf': ['.pdf'] }} />
          {uploadState === 'uploading' && <ProgressBar uploadProgress={uploadProgress} />}
        </div>
      )}

      {phase === 'configure' && baseFile && insertFile && baseRaw && insertRaw && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 480 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 6px' }}>Base PDF</p>
              <FileThumbnailCard file={baseRaw} uploadedFile={baseFile} onPreview={() => setViewerFile(baseRaw)} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 6px' }}>Insert PDF</p>
              <FileThumbnailCard file={insertRaw} uploadedFile={insertFile} onPreview={() => setViewerFile(insertRaw)} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Insert after page</label>
            <input
              type="number" min={0} value={afterPage}
              onChange={e => setAfterPage(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="0 = prepend at beginning"
              style={{ padding: '10px 12px', borderRadius: 8, background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: 14, outline: 'none' }}
            />
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>Enter 0 to prepend at the beginning</p>
          </div>

          {error && <p style={{ fontSize: 13, color: '#eb1000', background: 'rgba(235,16,0,0.08)', padding: '10px 14px', borderRadius: 6, margin: 0 }}>{error}</p>}

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleInsert} style={{ flex: 1, padding: '12px 0', borderRadius: 8, border: 'none', background: accent, color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
              Insert Pages →
            </button>
            <button onClick={handleReset} style={{ padding: '12px 20px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer' }}>
              Back
            </button>
          </div>
        </div>
      )}

      {phase === 'processing' && (
        <div style={{ padding: '64px 0', maxWidth: 440, margin: '0 auto', textAlign: 'center' }}>
          <ProgressBar job={job} />
          <p style={{ marginTop: 16, fontSize: 13, color: 'var(--text-muted)' }}>Inserting pages…</p>
        </div>
      )}

      {phase === 'done' && job && (
        <ResultDownload jobId={(job as any).id} filename="inserted.pdf" onReset={handleReset} />
      )}

      {phase === 'error' && (
        <div style={{ padding: '64px 0', textAlign: 'center' }}>
          <p style={{ color: '#eb1000' }}>{error}</p>
          <button onClick={handleReset} style={{ marginTop: 16, fontSize: 13, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
            Try again
          </button>
        </div>
      )}
    </ToolLayout>
  );
}