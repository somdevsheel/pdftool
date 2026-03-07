'use client';

import { useState, useEffect, useRef } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { UploadBox } from '../../components/UploadBox';
import { ProgressBar } from '../../components/ProgressBar';
import { ResultDownload } from '../../components/ResultDownload';
import { useUpload } from '../../hooks/useUpload';
import { useJobStatus } from '../../hooks/useJobStatus';
import { createSplitJob } from '../../lib/jobsClient';
import { UploadedFile } from '../../types/web.types';
import { PdfViewerModal, FileHeaderWithPreview, PreviewButton, loadPdfJs } from '../../components/PdfViewer';

type Phase = 'upload' | 'configure' | 'processing' | 'done' | 'error';
type SplitMode = 'all' | 'range';

/* ── Inline file header with thumbnail + preview button ────── */

export default function SplitPage() {
  const [file, setFile]           = useState<UploadedFile | null>(null);
  const [rawFile, setRawFile]     = useState<File | null>(null);
  const [viewerFile, setViewerFile] = useState<File | null>(null);
  const [phase, setPhase]         = useState<Phase>('upload');
  const [mode, setMode]           = useState<SplitMode>('all');
  const [pages, setPages]         = useState('');
  const [error, setError]         = useState<string | null>(null);
  const [pageCount, setPageCount] = useState<number | undefined>();
  const { state: uploadState, progress: uploadProgress, upload } = useUpload();
  const { job, poll, reset: resetJob } = useJobStatus();

  async function handleDrop(raw: File[]) {
    const uploaded = await upload(raw);
    if (uploaded?.[0]) { setFile(uploaded[0]); setRawFile(raw[0]); setPhase('configure'); }
  }

  async function handleSplit() {
    if (!file) return;
    setError(null);
    setPhase('processing');
    try {
      const j = await createSplitJob(file.id, mode === 'range' ? pages || undefined : undefined);
      poll(j.id, (done) => {
        if (done.status === 'COMPLETED') {
          // pageCount comes back in job metadata from worker returnvalue
          setPageCount((done as any).metadata?.pageCount);
          setPhase('done');
        }
        if (done.status === 'FAILED') {
          setError(done.error || 'Split failed');
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
    setPhase('upload'); setMode('all'); setPages(''); setError(null); setPageCount(undefined); resetJob();
  }

  const isZip = mode === 'all';

  return (
    <ToolLayout
      title="Split PDF"
      tagline="Extract specific pages or split every page into separate PDFs — downloaded as a ZIP."
      icon="✂️"
      accentColor="var(--accent-teal)"
    >
      {viewerFile && <PdfViewerModal file={viewerFile} onClose={() => setViewerFile(null)} />}

      {phase === 'upload' && (
        <div className="space-y-4">
          <UploadBox onFiles={handleDrop} maxFiles={1} label="Drop a PDF to split" />
          {uploadState === 'uploading' && <ProgressBar uploadProgress={uploadProgress} />}
        </div>
      )}

      {phase === 'configure' && file && rawFile && (
        <div className="space-y-6 max-w-lg">
          <FileHeaderWithPreview file={rawFile!} uploadedFile={file} onPreview={() => setViewerFile(rawFile)} />

          <div className="space-y-3">
            <h3 className="font-display font-bold text-ink">Split mode</h3>

            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  value: 'all',
                  label: 'Split all pages',
                  desc: 'Every page becomes a separate PDF — downloaded as ZIP',
                  badge: 'ZIP',
                },
                {
                  value: 'range',
                  label: 'Extract range',
                  desc: 'Choose specific pages — downloaded as single PDF',
                  badge: 'PDF',
                },
              ].map(({ value, label, desc, badge }) => (
                <button
                  key={value}
                  onClick={() => setMode(value as SplitMode)}
                  className={`text-left p-4 rounded-md border transition-all duration-150 ${
                    mode === value
                      ? 'border-[var(--accent-teal)] bg-[rgba(22,160,133,0.06)] shadow-paper'
                      : 'border-paper-mid bg-paper hover:bg-paper-warm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-sm text-ink">{label}</p>
                    <span className="stamp text-[10px]">{badge}</span>
                  </div>
                  <p className="text-xs text-ink-muted">{desc}</p>
                </button>
              ))}
            </div>

            {mode === 'range' && (
              <div className="space-y-2">
                <label className="text-sm text-ink-soft font-medium">Page range</label>
                <input
                  type="text"
                  value={pages}
                  onChange={(e) => setPages(e.target.value)}
                  placeholder="e.g. 1-3, 5, 8-10"
                  className="w-full px-3 py-2.5 rounded-md border border-paper-mid bg-paper
                    text-sm text-ink font-mono focus:outline-none
                    focus:border-[var(--accent-teal)] focus:ring-1 focus:ring-[var(--accent-teal)]"
                />
                <p className="text-xs text-ink-muted">
                  Separate pages with commas. Use hyphens for ranges.
                </p>
              </div>
            )}

            {/* Output hint */}
            <div className="flex items-center gap-2 p-3 rounded-md bg-paper-warm border border-paper-mid text-xs text-ink-muted">
              <span>{mode === 'all' ? '📦' : '📄'}</span>
              <span>
                {mode === 'all'
                  ? 'Each page will be saved as page-1.pdf, page-2.pdf… and bundled into a ZIP file.'
                  : 'Selected pages will be extracted into a single PDF file.'}
              </span>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-md">{error}</p>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleSplit}
              className="flex-1 sm:flex-none px-8 py-3 rounded-md bg-[var(--ink)] text-paper
                font-medium text-sm hover:bg-[var(--ink-soft)] transition-colors shadow-paper"
            >
              Split PDF →
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-3 rounded-md border border-paper-mid text-sm
                text-ink-muted hover:bg-paper-warm transition-colors"
            >
              Start over
            </button>
          </div>
        </div>
      )}

      {phase === 'processing' && (
        <div className="py-12 max-w-md mx-auto space-y-4">
          <ProgressBar job={job} />
          <p className="text-sm text-center text-ink-muted">
            {mode === 'all'
              ? 'Splitting pages with qpdf and creating ZIP…'
              : 'Extracting page range with qpdf…'}
          </p>
        </div>
      )}

      {phase === 'done' && job && (
        <ResultDownload
          jobId={job.id}
          filename={isZip ? 'split-pages.zip' : 'split.pdf'}
          isZip={isZip}
          pageCount={pageCount}
          onReset={handleReset}
        />
      )}

      {phase === 'error' && (
        <div className="py-12 text-center space-y-4">
          <p className="text-red-500">{error}</p>
          <button onClick={handleReset} className="text-sm underline text-ink-muted">
            Try again
          </button>
        </div>
      )}
    </ToolLayout>
  );
}
