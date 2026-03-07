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
const accent = '#f59e0b';

const PRESETS = [
  { label: 'Remove margins', top: 36, bottom: 36, left: 36, right: 36 },
  { label: 'Trim top/bottom', top: 54, bottom: 54, left: 0, right: 0 },
  { label: 'Trim sides', top: 0, bottom: 0, left: 54, right: 54 },
  { label: 'Custom', top: 0, bottom: 0, left: 0, right: 0 },
];

export default function CropToolPage() {
  const [file, setFile]           = useState<any>(null);
  const [rawFile, setRawFile]     = useState<File | null>(null);
  const [viewerFile, setViewerFile] = useState<File | null>(null);
  const [phase, setPhase]         = useState<Phase>('upload');
  const [top, setTop]             = useState(36);
  const [bottom, setBottom]       = useState(36);
  const [left, setLeft]           = useState(36);
  const [right, setRight]         = useState(36);
  const [error, setError]         = useState<string | null>(null);
  const { state: uploadState, progress: uploadProgress, upload } = useUpload();
  const { job, poll, reset: resetJob } = useJobStatus();

  async function handleDrop(raw: File[]) {
    const uploaded = await upload(raw);
    if (uploaded?.[0]) { setFile(uploaded[0]); setRawFile(raw[0]); setPhase('configure'); }
  }

  async function handleCrop() {
    if (!file) return;
    setError(null); setPhase('processing');
    try {
      const res = await fetch('http://localhost:3001/api/v1/jobs/crop', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId: file.id, top, bottom, left, right }),
      });
      const j = await res.json().then(d => d.data ?? d);
      poll(j.id, (done: any) => {
        if (done.status === 'COMPLETED') setPhase('done');
        if (done.status === 'FAILED') { setError(done.error || 'Failed'); setPhase('error'); }
      });
    } catch (e: any) { setError(e.message); setPhase('error'); }
  }

  function applyPreset(p: typeof PRESETS[0]) { setTop(p.top); setBottom(p.bottom); setLeft(p.left); setRight(p.right); }
  function handleReset() { setFile(null); setRawFile(null); setPhase('upload'); setError(null); resetJob(); }

  const numInput = (val: number, setter: (n: number) => void): React.CSSProperties => ({
    width: '100%', padding: '9px 10px', borderRadius: 8,
    background: 'var(--surface-2)', border: '1px solid var(--border)',
    color: 'var(--text)', fontSize: 14, outline: 'none', textAlign: 'center' as any, boxSizing: 'border-box' as any,
  });

  return (
    <ToolLayout title="Crop Pages" tagline="Trim margins and resize PDF pages." icon="✂️" accentColor={accent}>
      {viewerFile && <PdfViewerModal file={viewerFile} onClose={() => setViewerFile(null)} />}

      {phase === 'upload' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <UploadBox onFiles={handleDrop} maxFiles={1} label="Drop a PDF to crop" accept={{ 'application/pdf': ['.pdf'] }} />
          {uploadState === 'uploading' && <ProgressBar uploadProgress={uploadProgress} />}
        </div>
      )}

      {phase === 'configure' && file && rawFile && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 480 }}>
          <FileThumbnailCard file={rawFile} uploadedFile={file} onPreview={() => setViewerFile(rawFile)} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Presets</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {PRESETS.map(p => (
                <button key={p.label} onClick={() => applyPreset(p)} style={{ padding: '7px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: `1px solid var(--border)`, background: 'var(--surface-2)', color: 'var(--text-muted)' }}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Margins to remove (points, 72pt = 1 inch)</label>
            {/* Visual crop diagram */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, alignItems: 'center' }}>
              <div />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                <label style={{ fontSize: 11, color: 'var(--text-muted)' }}>Top</label>
                <input type="number" min={0} value={top} onChange={e => setTop(Number(e.target.value))} style={numInput(top, setTop)} />
              </div>
              <div />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                <label style={{ fontSize: 11, color: 'var(--text-muted)' }}>Left</label>
                <input type="number" min={0} value={left} onChange={e => setLeft(Number(e.target.value))} style={numInput(left, setLeft)} />
              </div>
              <div style={{ aspectRatio: '1', background: 'var(--surface-2)', border: `2px dashed ${accent}`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'var(--text-muted)' }}>PDF</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                <label style={{ fontSize: 11, color: 'var(--text-muted)' }}>Right</label>
                <input type="number" min={0} value={right} onChange={e => setRight(Number(e.target.value))} style={numInput(right, setRight)} />
              </div>
              <div />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                <label style={{ fontSize: 11, color: 'var(--text-muted)' }}>Bottom</label>
                <input type="number" min={0} value={bottom} onChange={e => setBottom(Number(e.target.value))} style={numInput(bottom, setBottom)} />
              </div>
              <div />
            </div>
          </div>

          {error && <p style={{ fontSize: 13, color: '#eb1000', background: 'rgba(235,16,0,0.08)', padding: '10px 14px', borderRadius: 6, margin: 0 }}>{error}</p>}

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleCrop} style={{ flex: 1, padding: '12px 0', borderRadius: 8, border: 'none', background: accent, color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
              Crop PDF →
            </button>
            <button onClick={handleReset} style={{ padding: '12px 20px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer' }}>Back</button>
          </div>
        </div>
      )}

      {phase === 'processing' && <div style={{ padding: '64px 0', maxWidth: 440, margin: '0 auto', textAlign: 'center' }}><ProgressBar job={job} /><p style={{ marginTop: 16, fontSize: 13, color: 'var(--text-muted)' }}>Cropping pages…</p></div>}
      {phase === 'done' && job && <ResultDownload jobId={(job as any).id} filename="cropped.pdf" onReset={handleReset} />}
      {phase === 'error' && <div style={{ padding: '64px 0', textAlign: 'center' }}><p style={{ color: '#eb1000' }}>{error}</p><button onClick={handleReset} style={{ marginTop: 16, fontSize: 13, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Try again</button></div>}
    </ToolLayout>
  );
}
