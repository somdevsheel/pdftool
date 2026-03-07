'use client';
import { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { UploadBox } from '../../components/UploadBox';
import { ProgressBar } from '../../components/ProgressBar';
import { ResultDownload } from '../../components/ResultDownload';
import { FileThumbnailCard, PdfViewerModal } from '../../components/PdfViewer';
import { useUpload } from '../../hooks/useUpload';
import { useJobStatus } from '../../hooks/useJobStatus';
import { createPdfToOfficeJob } from '../../lib/jobsClient';
import { UploadedFile } from '../../types/web.types';

type Phase = 'upload' | 'configure' | 'processing' | 'done' | 'error';

export default function PdfToPptToolPage() {
  const [file, setFile]             = useState<UploadedFile | null>(null);
  const [rawFile, setRawFile]       = useState<File | null>(null);
  const [viewerFile, setViewerFile] = useState<File | null>(null);
  const [phase, setPhase]           = useState<Phase>('upload');
  const [error, setError]           = useState<string | null>(null);
  const { state: uploadState, progress: uploadProgress, upload } = useUpload();
  const { job, poll, reset: resetJob } = useJobStatus();

  async function handleDrop(raw: File[]) {
    const uploaded = await upload(raw);
    if (uploaded?.[0]) { setFile(uploaded[0]); setRawFile(raw[0]); setPhase('configure'); }
  }
  async function handleConvert() {
    if (!file) return;
    setError(null); setPhase('processing');
    try {
      const j = await createPdfToOfficeJob(file.id, 'pptx');
      poll(j.id, (done) => {
        if (done.status === 'COMPLETED') setPhase('done');
        if (done.status === 'FAILED') { setError(done.error || 'Conversion failed'); setPhase('error'); }
      });
    } catch (e: any) { setError(e.message); setPhase('error'); }
  }
  function handleReset() { setFile(null); setRawFile(null); setViewerFile(null); setPhase('upload'); setError(null); resetJob(); }

  return (
    <ToolLayout title="PDF to PPT" tagline="Convert PDF documents to editable PowerPoint presentations (.pptx)." icon="📊" accentColor="#E8522A">
      {viewerFile && <PdfViewerModal file={viewerFile} onClose={() => setViewerFile(null)} />}

      {phase === 'upload' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <UploadBox onFiles={handleDrop} maxFiles={1} label="Drop a PDF to convert to PowerPoint" accept={{ 'application/pdf': ['.pdf'] }} />
          {uploadState === 'uploading' && <ProgressBar uploadProgress={uploadProgress} />}
        </div>
      )}
      {phase === 'configure' && file && rawFile && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 480 }}>
          <FileThumbnailCard file={rawFile} uploadedFile={file} onPreview={() => setViewerFile(rawFile)} />
          <div style={{ padding: '12px 16px', borderRadius: 8, fontSize: 13, background: 'rgba(232,82,42,0.07)', border: '1px solid rgba(232,82,42,0.2)', color: 'var(--text-muted)' }}>
            ℹ️ Each PDF page becomes one slide. Best results with presentation-style PDFs.
          </div>
          {error && <p style={{ fontSize: 13, color: '#eb1000' }}>{error}</p>}
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleConvert} style={{ flex: 1, padding: '12px 0', borderRadius: 8, border: 'none', background: '#E8522A', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
              Convert to PowerPoint →
            </button>
            <button onClick={handleReset} style={{ padding: '12px 20px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer' }}>Back</button>
          </div>
        </div>
      )}
      {phase === 'processing' && (
        <div style={{ padding: '64px 0', maxWidth: 440, margin: '0 auto', textAlign: 'center' }}>
          <ProgressBar job={job} />
          <p style={{ marginTop: 16, fontSize: 13, color: 'var(--text-muted)' }}>Converting PDF to PowerPoint with LibreOffice…</p>
        </div>
      )}
      {phase === 'done' && job && <ResultDownload jobId={job.id} filename="converted.pptx" onReset={handleReset} />}
      {phase === 'error' && (
        <div style={{ padding: '64px 0', textAlign: 'center' }}>
          <p style={{ color: '#eb1000' }}>{error}</p>
          <button onClick={handleReset} style={{ marginTop: 16, fontSize: 13, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Try again</button>
        </div>
      )}
    </ToolLayout>
  );
}
