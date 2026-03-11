'use client';

import { useState, useEffect, useRef } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { UploadBox } from '../../components/UploadBox';
import { ProgressBar } from '../../components/ProgressBar';
import { ResultDownload } from '../../components/ResultDownload';
import { useUpload } from '../../hooks/useUpload';
import { useJobStatus } from '../../hooks/useJobStatus';
import { createRotateJob } from '../../lib/jobsClient';
import { UploadedFile } from '../../types/web.types';
import { PdfViewerModal, PreviewButton, loadPdfJs, FileThumbnailCard } from '../../components/PdfViewer';

type Phase = 'upload' | 'configure' | 'processing' | 'done' | 'error';

/* ── Inline file header with thumbnail + preview button ────── */

export default function RotatePage() {
  const [file, setFile]       = useState<UploadedFile | null>(null);
  const [rawFile, setRawFile] = useState<File | null>(null);
  const [viewerFile, setViewerFile] = useState<File | null>(null);
  const [phase, setPhase]     = useState<Phase>('upload');
  const [degrees, setDegrees] = useState<90 | 180 | 270>(90);
  const [scope, setScope]     = useState<'all' | 'specific'>('all');
  const [pagesInput, setPages] = useState('');
  const [error, setError]     = useState<string | null>(null);
  const { state: uploadState, progress: uploadProgress, upload } = useUpload();
  const { job, poll, reset: resetJob } = useJobStatus();

  async function handleDrop(raw: File[]) {
    const uploaded = await upload(raw);
    if (uploaded?.[0]) { setFile(uploaded[0]); setRawFile(raw[0]); setPhase('configure'); }
  }

  async function handleRotate() {
    if (!file) return;
    setPhase('processing');
    try {
      const pageNums = scope === 'specific'
        ? pagesInput.split(',').map((p) => parseInt(p.trim(), 10)).filter(Boolean)
        : undefined;
      const j = await createRotateJob(file.id, degrees, pageNums);
      poll(j.id, (done) => {
        if (done.status === 'COMPLETED') setPhase('done');
        if (done.status === 'FAILED') {
          setError(done.error || 'Rotation failed');
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
    setPhase('upload'); setDegrees(90); setScope('all'); setPages(''); setError(null); resetJob();
  }

  return (
    <ToolLayout toolTag="Rotate PDF"
      title="Rotate PDF"
      tagline="Fix page orientation by rotating all pages or specific ones."
      icon="🔄"
      accentColor="#7c3aed"
    >
      {viewerFile && <PdfViewerModal file={viewerFile} onClose={() => setViewerFile(null)} />}

      {phase === 'upload' && (
        <div className="space-y-4">
          <UploadBox onFiles={handleDrop} maxFiles={1} label="Drop a PDF to rotate" />
          {uploadState === 'uploading' && <ProgressBar uploadProgress={uploadProgress} />}
        </div>
      )}

      {phase === 'configure' && file && rawFile && (
        <div className="space-y-6 max-w-lg">
          <FileThumbnailCard file={rawFile!} uploadedFile={file} onPreview={() => setViewerFile(rawFile!)} />

          {/* Degrees */}
          <div className="space-y-3">
            <h3 className="font-display font-bold text-ink">Rotation angle</h3>
            <div className="flex gap-3">
              {([90, 180, 270] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDegrees(d)}
                  className={`flex-1 py-4 rounded-md border flex flex-col items-center gap-2
                    transition-all duration-150 ${
                    degrees === d
                      ? 'border-[#7c3aed] bg-[rgba(124,58,237,0.06)]'
                      : 'border-paper-mid bg-paper hover:bg-paper-warm'
                  }`}
                >
                  <span
                    className="text-xl transition-transform"
                    style={{ transform: `rotate(${d}deg)` }}
                  >↑</span>
                  <span className="text-sm font-medium text-ink">{d}°</span>
                </button>
              ))}
            </div>
          </div>

          {/* Scope */}
          <div className="space-y-3">
            <h3 className="font-display font-bold text-ink">Apply to</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'all', label: 'All pages' },
                { value: 'specific', label: 'Specific pages' },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setScope(value as 'all' | 'specific')}
                  className={`py-3 px-4 rounded-md border text-sm font-medium transition-all ${
                    scope === value
                      ? 'border-[#7c3aed] bg-[rgba(124,58,237,0.06)] text-ink'
                      : 'border-paper-mid text-ink-muted hover:bg-paper-warm'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {scope === 'specific' && (
              <input
                type="text"
                value={pagesInput}
                onChange={(e) => setPages(e.target.value)}
                placeholder="e.g. 1, 3, 5-8"
                className="w-full px-3 py-2.5 rounded-md border border-paper-mid bg-paper
                  text-sm font-mono focus:outline-none focus:border-[#7c3aed]"
              />
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleRotate}
              className="flex-1 sm:flex-none px-8 py-3 rounded-md bg-[var(--ink)] text-paper
                font-medium text-sm hover:bg-[var(--ink-soft)] transition-colors shadow-paper"
            >
              Rotate PDF →
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
        </div>
      )}

      {phase === 'done' && job && (
        <ResultDownload jobId={job.id} filename="rotated.pdf" onReset={handleReset} />
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
