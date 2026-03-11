'use client';
import { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { UploadBox } from '../../components/UploadBox';
import { ProgressBar } from '../../components/ProgressBar';
import { ResultDownload } from '../../components/ResultDownload';
import { useUpload } from '../../hooks/useUpload';
import { useJobStatus } from '../../hooks/useJobStatus';
import { createOfficeToPdfJob } from '../../lib/jobsClient';

type Phase = 'upload' | 'processing' | 'done' | 'error';

export default function ExcelToPdfToolPage() {
  const [phase, setPhase] = useState<Phase>('upload');
  const [error, setError] = useState<string | null>(null);
  const { state: uploadState, progress: uploadProgress, upload } = useUpload();
  const { job, poll, reset: resetJob } = useJobStatus();

  async function handleDrop(raw: File[]) {
    const uploaded = await upload(raw);
    if (!uploaded?.[0]) return;
    setError(null); setPhase('processing');
    try {
      const j = await createOfficeToPdfJob(uploaded[0].id) as any;
      poll(j.id, (done: any) => {
        if (done.status === 'COMPLETED') setPhase('done');
        if (done.status === 'FAILED') { setError(done.error || 'Conversion failed'); setPhase('error'); }
      });
    } catch (e: any) { setError(e.message); setPhase('error'); }
  }
  function handleReset() { setPhase('upload'); setError(null); resetJob(); }

  return (
    <ToolLayout title="Excel to PDF" tagline="Convert XLS and XLSX spreadsheets to PDF — tables and formatting preserved." icon="📈" accentColor="#1E7E34">
      {phase === 'upload' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <UploadBox onFiles={handleDrop} maxFiles={1} label="Drop an Excel file (.xls, .xlsx)" accept={{ 'application/vnd.ms-excel': ['.xls'], 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] }} />
          {uploadState === 'uploading' && <ProgressBar uploadProgress={uploadProgress} />}
          {error && <p style={{ fontSize: 13, color: '#eb1000' }}>{error}</p>}
        </div>
      )}
      {phase === 'processing' && (
        <div style={{ padding: '64px 0', maxWidth: 440, margin: '0 auto', textAlign: 'center' }}>
          <ProgressBar job={job} />
          <p style={{ marginTop: 16, fontSize: 13, color: 'var(--text-muted)' }}>Converting Excel spreadsheet to PDF with LibreOffice…</p>
        </div>
      )}
      {phase === 'done' && job && <ResultDownload jobId={(job as any).id} filename="converted.pdf" onReset={handleReset} />}
      {phase === 'error' && (
        <div style={{ padding: '64px 0', textAlign: 'center' }}>
          <p style={{ color: '#eb1000' }}>{error}</p>
          <button onClick={handleReset} style={{ marginTop: 16, fontSize: 13, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Try again</button>
        </div>
      )}
    </ToolLayout>
  );
}