'use client';
import { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { UploadBox } from '../../components/UploadBox';
import { ProgressBar } from '../../components/ProgressBar';
import { ResultDownload } from '../../components/ResultDownload';
import { FileThumbnailCard, PdfViewerModal } from '../../components/PdfViewer';
import { useUpload } from '../../hooks/useUpload';
import { useJobStatus } from '../../hooks/useJobStatus';
import { createPdfToImgJob } from '../../lib/jobsClient';
import { UploadedFile } from '../../types/web.types';

type Phase = 'upload' | 'configure' | 'processing' | 'done' | 'error';

export default function PdfToJpgToolPage() {
  const [file, setFile]               = useState<UploadedFile | null>(null);
  const [rawFile, setRawFile]         = useState<File | null>(null);
  const [viewerFile, setViewerFile]   = useState<File | null>(null);
  const [phase, setPhase]             = useState<Phase>('upload');
  const [format, setFormat]           = useState<'jpg' | 'png'>('jpg');
  const [dpi, setDpi]                 = useState<150 | 200 | 300>(150);
  const [error, setError]             = useState<string | null>(null);
  const [singleImage, setSingleImage] = useState(false);

  const { state: uploadState, progress: uploadProgress, upload } = useUpload();
  const { job, poll, reset: resetJob } = useJobStatus();

  async function handleDrop(raw: File[]) {
    const uploaded = await upload(raw);
    if (uploaded?.[0]) {
      setFile(uploaded[0]);
      setRawFile(raw[0]);
      setPhase('configure');
    }
  }

  async function handleConvert() {
    if (!file) return;
    setError(null);
    setPhase('processing');
    try {
      const j = await createPdfToImgJob(file.id, format, dpi) as any;
      poll(j.id, (done: any) => {
        if (done.status === 'COMPLETED') {
          const rv = done.returnValue ?? done.returnvalue;
          setSingleImage(rv?.singleImage === true);
          setPhase('done');
        }
        if (done.status === 'FAILED') {
          setError(done.error || 'Conversion failed');
          setPhase('error');
        }
      });
    } catch (e: any) {
      setError(e.message);
      setPhase('error');
    }
  }

  function handleReset() {
    setFile(null); setRawFile(null); setViewerFile(null);
    setPhase('upload'); setError(null); setSingleImage(false); resetJob();
  }

  const accent = '#C17EE8';
  const btnStyle = (active: boolean): React.CSSProperties => ({
    flex: 1, padding: '10px 0', borderRadius: 8, fontSize: 13, fontWeight: 600,
    cursor: 'pointer', transition: 'all 0.15s',
    border: `2px solid ${active ? accent : 'var(--border)'}`,
    background: active ? 'rgba(193,126,232,0.1)' : 'var(--surface-2)',
    color: active ? accent : 'var(--text-muted)',
  });

  const downloadFilename = singleImage ? `page.${format}` : 'pdf-images.zip';

  return (
    <ToolLayout
      title="PDF to JPG"
      tagline="Convert every PDF page to a JPG or PNG image."
      icon="🖼️"
      accentColor={accent}
    >
      {viewerFile && <PdfViewerModal file={viewerFile} onClose={() => setViewerFile(null)} />}

      {/* Upload */}
      {phase === 'upload' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <UploadBox
            onFiles={handleDrop}
            maxFiles={1}
            label="Drop a PDF to convert to images"
            accept={{ 'application/pdf': ['.pdf'] }}
          />
          {uploadState === 'uploading' && <ProgressBar uploadProgress={uploadProgress} />}
        </div>
      )}

      {/* Configure */}
      {phase === 'configure' && file && rawFile && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 480 }}>
          <FileThumbnailCard file={rawFile} uploadedFile={file} onPreview={() => setViewerFile(rawFile)} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Format selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Output format</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {(['jpg', 'png'] as const).map(f => (
                  <button key={f} onClick={() => setFormat(f)} style={btnStyle(format === f)}>
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* DPI selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Resolution</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {([150, 200, 300] as const).map(d => (
                  <button key={d} onClick={() => setDpi(d)} style={btnStyle(dpi === d)}>
                    {d} DPI{d === 150 ? ' · Fast' : d === 300 ? ' · HQ' : ''}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ padding: '10px 14px', borderRadius: 6, fontSize: 12, background: 'rgba(193,126,232,0.08)', border: '1px solid rgba(193,126,232,0.2)', color: 'var(--text-muted)' }}>
              📦 Multi-page PDFs download as a ZIP. Single-page PDFs download as a direct image.
            </div>
          </div>

          {error && (
            <p style={{ fontSize: 13, color: '#eb1000', background: 'rgba(235,16,0,0.08)', padding: '10px 14px', borderRadius: 6 }}>
              {error}
            </p>
          )}

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleConvert} style={{ flex: 1, padding: '12px 0', borderRadius: 8, border: 'none', background: accent, color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
              Convert to {format.toUpperCase()} →
            </button>
            <button onClick={handleReset} style={{ padding: '12px 20px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer' }}>
              Back
            </button>
          </div>
        </div>
      )}

      {/* Processing */}
      {phase === 'processing' && (
        <div style={{ padding: '64px 0', maxWidth: 440, margin: '0 auto', textAlign: 'center' }}>
          <ProgressBar job={job} />
          <p style={{ marginTop: 16, fontSize: 13, color: 'var(--text-muted)' }}>
            Converting PDF pages to {format.toUpperCase()} at {dpi} DPI…
          </p>
        </div>
      )}

      {/* Done */}
      {phase === 'done' && job && (
        <ResultDownload
          jobId={job.id}
          filename={downloadFilename}
          isZip={!singleImage}
          onReset={handleReset}
        />
      )}

      {/* Error */}
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