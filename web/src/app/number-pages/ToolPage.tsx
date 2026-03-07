'use client';
import { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { UploadBox } from '../../components/UploadBox';
import { ProgressBar } from '../../components/ProgressBar';
import { ResultDownload } from '../../components/ResultDownload';
import { FileThumbnailCard, PdfViewerModal } from '../../components/PdfViewer';
import { useUpload } from '../../hooks/useUpload';
import { useJobStatus } from '../../hooks/useJobStatus';

type Phase = 'upload' | 'configure' | 'processing' | 'done' | 'error';
type Position = 'bottom-center'|'bottom-right'|'bottom-left'|'top-center'|'top-right'|'top-left';
const accent = '#0ea5e9';

const POSITIONS: { value: Position; label: string; icon: string }[] = [
  { value: 'bottom-left',   label: 'Bottom Left',   icon: '↙' },
  { value: 'bottom-center', label: 'Bottom Center', icon: '↓' },
  { value: 'bottom-right',  label: 'Bottom Right',  icon: '↘' },
  { value: 'top-left',      label: 'Top Left',      icon: '↖' },
  { value: 'top-center',    label: 'Top Center',    icon: '↑' },
  { value: 'top-right',     label: 'Top Right',     icon: '↗' },
];

export default function NumberPagesToolPage() {
  const [file, setFile]           = useState<any>(null);
  const [rawFile, setRawFile]     = useState<File | null>(null);
  const [viewerFile, setViewerFile] = useState<File | null>(null);
  const [phase, setPhase]         = useState<Phase>('upload');
  const [position, setPosition]   = useState<Position>('bottom-center');
  const [startNumber, setStartNumber] = useState(1);
  const [fontSize, setFontSize]   = useState(12);
  const [error, setError]         = useState<string | null>(null);
  const { state: uploadState, progress: uploadProgress, upload } = useUpload();
  const { job, poll, reset: resetJob } = useJobStatus();

  async function handleDrop(raw: File[]) {
    const uploaded = await upload(raw);
    if (uploaded?.[0]) { setFile(uploaded[0]); setRawFile(raw[0]); setPhase('configure'); }
  }

  async function handleNumber() {
    if (!file) return;
    setError(null); setPhase('processing');
    try {
      const res = await fetch('http://localhost:3001/api/v1/jobs/number-pages', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId: file.id, position, startNumber, fontSize }),
      });
      const j = await res.json().then(d => d.data ?? d);
      poll(j.id, (done: any) => {
        if (done.status === 'COMPLETED') setPhase('done');
        if (done.status === 'FAILED') { setError(done.error || 'Failed'); setPhase('error'); }
      });
    } catch (e: any) { setError(e.message); setPhase('error'); }
  }

  function handleReset() { setFile(null); setRawFile(null); setPhase('upload'); setError(null); resetJob(); }

  const btnStyle = (active: boolean): React.CSSProperties => ({
    flex: 1, padding: '8px 4px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
    border: `2px solid ${active ? accent : 'var(--border)'}`,
    background: active ? `rgba(14,165,233,0.1)` : 'var(--surface-2)',
    color: active ? accent : 'var(--text-muted)', transition: 'all 0.15s',
  });

  return (
    <ToolLayout title="Number Pages" tagline="Stamp page numbers onto your PDF." icon="🔢" accentColor={accent}>
      {viewerFile && <PdfViewerModal file={viewerFile} onClose={() => setViewerFile(null)} />}

      {phase === 'upload' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <UploadBox onFiles={handleDrop} maxFiles={1} label="Drop a PDF to number" accept={{ 'application/pdf': ['.pdf'] }} />
          {uploadState === 'uploading' && <ProgressBar uploadProgress={uploadProgress} />}
        </div>
      )}

      {phase === 'configure' && file && rawFile && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 480 }}>
          <FileThumbnailCard file={rawFile} uploadedFile={file} onPreview={() => setViewerFile(rawFile)} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Position</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {POSITIONS.map(p => (
                  <button key={p.value} onClick={() => setPosition(p.value)} style={btnStyle(position === p.value)}>
                    <div style={{ fontSize: 16 }}>{p.icon}</div>
                    <div style={{ fontSize: 11, marginTop: 2 }}>{p.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Start from</label>
                <input type="number" min={1} value={startNumber} onChange={e => setStartNumber(Number(e.target.value))} style={{ padding: '9px 12px', borderRadius: 8, background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: 14, outline: 'none' }} />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Font size</label>
                <input type="number" min={8} max={24} value={fontSize} onChange={e => setFontSize(Number(e.target.value))} style={{ padding: '9px 12px', borderRadius: 8, background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: 14, outline: 'none' }} />
              </div>
            </div>
          </div>

          {error && <p style={{ fontSize: 13, color: '#eb1000', background: 'rgba(235,16,0,0.08)', padding: '10px 14px', borderRadius: 6, margin: 0 }}>{error}</p>}

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleNumber} style={{ flex: 1, padding: '12px 0', borderRadius: 8, border: 'none', background: accent, color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
              Add Page Numbers →
            </button>
            <button onClick={handleReset} style={{ padding: '12px 20px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer' }}>Back</button>
          </div>
        </div>
      )}

      {phase === 'processing' && <div style={{ padding: '64px 0', maxWidth: 440, margin: '0 auto', textAlign: 'center' }}><ProgressBar job={job} /><p style={{ marginTop: 16, fontSize: 13, color: 'var(--text-muted)' }}>Adding page numbers…</p></div>}
      {phase === 'done' && job && <ResultDownload jobId={(job as any).id} filename="numbered.pdf" onReset={handleReset} />}
      {phase === 'error' && <div style={{ padding: '64px 0', textAlign: 'center' }}><p style={{ color: '#eb1000' }}>{error}</p><button onClick={handleReset} style={{ marginTop: 16, fontSize: 13, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Try again</button></div>}
    </ToolLayout>
  );
}
