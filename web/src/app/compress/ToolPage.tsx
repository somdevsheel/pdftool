'use client';

import { useState, useEffect, useRef } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { UploadBox } from '../../components/UploadBox';
import { ProgressBar } from '../../components/ProgressBar';
import { ResultDownload } from '../../components/ResultDownload';
import { useUpload } from '../../hooks/useUpload';
import { useJobStatus } from '../../hooks/useJobStatus';
import { createCompressJob } from '../../lib/jobsClient';
import { UploadedFile, CompressQuality } from '../../types/web.types';
import { PdfViewerModal, PreviewButton, loadPdfJs, FileThumbnailCard } from '../../components/PdfViewer';

type Phase = 'upload' | 'configure' | 'processing' | 'done' | 'error';

const QUALITY_OPTIONS = [
  {
    value: 'low',
    label: 'Small file',
    desc: 'Maximum compression · Screen quality · ~72 dpi',
    icon: '📉',
    saving: '~70% smaller' },
  {
    value: 'medium',
    label: 'Balanced',
    desc: 'Good compression · eBook quality · ~150 dpi',
    icon: '⚖️',
    saving: '~50% smaller',
    recommended: true },
  {
    value: 'high',
    label: 'High quality',
    desc: 'Light compression · Print quality · ~300 dpi',
    icon: '🖨️',
    saving: '~20% smaller' },
];

/* ── Inline file header with thumbnail + preview button ────── */

export default function CompressPage() {
  const [file, setFile]       = useState<UploadedFile | null>(null);
  const [rawFile, setRawFile] = useState<File | null>(null);
  const [viewerFile, setViewerFile] = useState<File | null>(null);
  const [phase, setPhase]     = useState<Phase>('upload');
  const [quality, setQuality] = useState<CompressQuality>('medium');
  const [error, setError]     = useState<string | null>(null);
  const { state: uploadState, progress: uploadProgress, upload } = useUpload();
  const { job, poll, reset: resetJob } = useJobStatus();

  async function handleDrop(raw: File[]) {
    const uploaded = await upload(raw);
    if (uploaded?.[0]) { setFile(uploaded[0]); setRawFile(raw[0]); setPhase('configure'); }
  }

  async function handleCompress() {
    if (!file) return;
    setPhase('processing');
    try {
      const j = await createCompressJob(file.id, quality);
      poll(j.id, (done) => {
        if (done.status === 'COMPLETED') setPhase('done');
        if (done.status === 'FAILED') {
          setError(done.error || 'Compression failed');
          setPhase('error');
        }
      });
    } catch (err: any) {
      setError(err.message);
      setPhase('error');
    }
  }

  function handleReset() {
    setFile(null); setRawFile(null); setViewerFile(null);
    setPhase('upload'); setQuality('medium'); setError(null); resetJob();
  }

  return (
    <ToolLayout
      title="Compress PDF"
      tagline="Reduce PDF file size using Ghostscript. Choose your quality level."
      icon="🗜️"
      accentColor="var(--accent-gold)"
    >
      {viewerFile && <PdfViewerModal file={viewerFile} onClose={() => setViewerFile(null)} />}

      {phase === 'upload' && (
        <div className="space-y-4">
          <UploadBox onFiles={handleDrop} maxFiles={1} label="Drop a PDF to compress" />
          {uploadState === 'uploading' && <ProgressBar uploadProgress={uploadProgress} />}
        </div>
      )}

      {phase === 'configure' && file && rawFile && (
        <div className="space-y-6 max-w-lg">
          <FileThumbnailCard file={rawFile!} uploadedFile={file} onPreview={() => setViewerFile(rawFile!)} />

          <div className="space-y-3">
            <h3 className="font-display font-bold text-ink">Compression level</h3>
            <div className="space-y-2">
              {QUALITY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setQuality(opt.value as CompressQuality)}
                  className={`w-full text-left p-4 rounded-md border transition-all duration-150 ${
                    quality === opt.value
                      ? 'border-[var(--accent-gold)] bg-[rgba(184,134,11,0.05)] shadow-paper'
                      : 'border-paper-mid bg-paper hover:bg-paper-warm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{opt.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-ink">{opt.label}</span>
                          {opt.recommended && (
                            <span className="stamp text-[10px]">Recommended</span>
                          )}
                        </div>
                        <p className="text-xs text-ink-muted">{opt.desc}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-ink-muted">{opt.saving}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCompress}
              className="flex-1 sm:flex-none px-8 py-3 rounded-md bg-[var(--ink)] text-paper
                font-medium text-sm hover:bg-[var(--ink-soft)] transition-colors shadow-paper"
            >
              Compress PDF →
            </button>
            <button onClick={handleReset}
              className="px-4 py-3 rounded-md border border-paper-mid text-sm
                text-ink-muted hover:bg-paper-warm transition-colors">
              Start over
            </button>
          </div>
        </div>
      )}

      {phase === 'processing' && (
        <div className="py-12 max-w-md mx-auto">
          <ProgressBar job={job} />
          <p className="text-sm text-center text-ink-muted mt-4">
            Compressing with Ghostscript ({quality} quality)…
          </p>
        </div>
      )}

      {phase === 'done' && job && (
        <ResultDownload jobId={job.id} filename="compressed.pdf" onReset={handleReset} />
      )}

      {phase === 'error' && (
        <div className="py-12 text-center space-y-4">
          <p className="text-red-500">{error}</p>
          <button onClick={handleReset} className="text-sm underline text-ink-muted">Try again</button>
        </div>
      )}
    </ToolLayout>
  );
}
