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
const accent = '#6366f1';

export default function ProtectToolPage() {
  const [file, setFile]           = useState<any>(null);
  const [rawFile, setRawFile]     = useState<File | null>(null);
  const [viewerFile, setViewerFile] = useState<File | null>(null);
  const [phase, setPhase]         = useState<Phase>('upload');
  const [userPw, setUserPw]       = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw]       = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const { state: uploadState, progress: uploadProgress, upload } = useUpload();
  const { job, poll, reset: resetJob } = useJobStatus();

  async function handleDrop(raw: File[]) {
    const uploaded = await upload(raw);
    if (uploaded?.[0]) { setFile(uploaded[0]); setRawFile(raw[0]); setPhase('configure'); }
  }

  async function handleProtect() {
    if (!file) return;
    if (!userPw) { setError('Please enter a password'); return; }
    if (userPw !== confirmPw) { setError('Passwords do not match'); return; }
    setError(null); setPhase('processing');
    try {
      const res = await fetch('http://localhost:3001/api/v1/jobs/protect', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId: file.id, userPassword: userPw }),
      });
      const j = await res.json().then(d => d.data ?? d);
      poll(j.id, (done: any) => {
        if (done.status === 'COMPLETED') setPhase('done');
        if (done.status === 'FAILED') { setError(done.error || 'Failed'); setPhase('error'); }
      });
    } catch (e: any) { setError(e.message); setPhase('error'); }
  }

  function handleReset() { setFile(null); setRawFile(null); setPhase('upload'); setUserPw(''); setConfirmPw(''); setError(null); resetJob(); }

  const inp: React.CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: 8, background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: 14, outline: 'none', boxSizing: 'border-box' };

  return (
    <ToolLayout title="Protect PDF" tagline="Lock your PDF with a password." icon="🔒" accentColor={accent}>
      {viewerFile && <PdfViewerModal file={viewerFile} onClose={() => setViewerFile(null)} />}

      {phase === 'upload' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <UploadBox onFiles={handleDrop} maxFiles={1} label="Drop a PDF to protect" accept={{ 'application/pdf': ['.pdf'] }} />
          {uploadState === 'uploading' && <ProgressBar uploadProgress={uploadProgress} />}
        </div>
      )}

      {phase === 'configure' && file && rawFile && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 440 }}>
          <FileThumbnailCard file={rawFile} uploadedFile={file} onPreview={() => setViewerFile(rawFile)} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPw ? 'text' : 'password'} value={userPw} onChange={e => setUserPw(e.target.value)} placeholder="Enter password" style={inp} />
                <button onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 13 }}>
                  {showPw ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Confirm password</label>
              <input type={showPw ? 'text' : 'password'} value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="Re-enter password" style={inp} />
            </div>
            {confirmPw && userPw !== confirmPw && <p style={{ fontSize: 12, color: '#eb1000', margin: 0 }}>Passwords do not match</p>}
          </div>

          {error && <p style={{ fontSize: 13, color: '#eb1000', background: 'rgba(235,16,0,0.08)', padding: '10px 14px', borderRadius: 6, margin: 0 }}>{error}</p>}

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleProtect} disabled={!userPw || userPw !== confirmPw} style={{ flex: 1, padding: '12px 0', borderRadius: 8, border: 'none', background: userPw && userPw === confirmPw ? accent : 'var(--surface-2)', color: userPw && userPw === confirmPw ? '#fff' : 'var(--text-muted)', fontWeight: 600, fontSize: 14, cursor: userPw && userPw === confirmPw ? 'pointer' : 'not-allowed' }}>
              🔒 Protect PDF →
            </button>
            <button onClick={handleReset} style={{ padding: '12px 20px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer' }}>Back</button>
          </div>
        </div>
      )}

      {phase === 'processing' && <div style={{ padding: '64px 0', maxWidth: 440, margin: '0 auto', textAlign: 'center' }}><ProgressBar job={job} /><p style={{ marginTop: 16, fontSize: 13, color: 'var(--text-muted)' }}>Encrypting PDF…</p></div>}
      {phase === 'done' && job && <ResultDownload jobId={(job as any).id} filename="protected.pdf" onReset={handleReset} />}
      {phase === 'error' && <div style={{ padding: '64px 0', textAlign: 'center' }}><p style={{ color: '#eb1000' }}>{error}</p><button onClick={handleReset} style={{ marginTop: 16, fontSize: 13, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Try again</button></div>}
    </ToolLayout>
  );
}
