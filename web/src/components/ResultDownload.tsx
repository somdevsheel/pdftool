'use client';

import clsx from 'clsx';
import { getDownloadUrl } from '../lib/jobsClient';

interface ResultDownloadProps {
  jobId: string;
  filename?: string;
  isZip?: boolean;
  pageCount?: number;
  onReset?: () => void;
  className?: string;
}

export function ResultDownload({
  jobId,
  filename = 'result.pdf',
  isZip = false,
  pageCount,
  onReset,
  className,
}: ResultDownloadProps) {
  const downloadUrl = getDownloadUrl(jobId);

  return (
    <div className={clsx(
      'flex flex-col items-center gap-6 py-10 text-center',
      'animate-fade-up opacity-0',
      className,
    )}
    style={{ animationFillMode: 'forwards' }}
    >
      {/* Success icon */}
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-[var(--accent-teal)] bg-opacity-10 flex items-center justify-center">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none"
            className="text-[var(--accent-teal)]">
            <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" />
            <path d="M12 20l6 6 10-12" stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="absolute inset-0 rounded-full border-2 border-[var(--accent-teal)] opacity-30 animate-ping" />
      </div>

      <div>
        <h3 className="font-display font-bold text-xl text-ink mb-1">Your file is ready!</h3>
        {isZip && pageCount && (
          <p className="text-sm font-mono text-[var(--accent-teal)] mb-1">
            {pageCount} pages split into individual PDFs
          </p>
        )}
        <p className="text-sm text-ink-muted">
          Files are automatically deleted after 60 minutes.
        </p>
      </div>

      {/* Download button */}
      <a
        href={downloadUrl}
        download={filename}
        // className={clsx(
        //   'flex items-center gap-3 px-8 py-4 rounded-md',
        //   'bg-[var(--ink)] text-paper font-medium text-sm',
        //   'hover:bg-[var(--ink-soft)] transition-colors duration-200',
        //   'shadow-paper-lg',
        // )}
        className={clsx(
          'flex items-center gap-3 px-8 py-4 rounded-md',
          'font-medium text-sm transition-colors duration-200',
        )}
        style={{ background: '#eb1000', color: '#ffffff' }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M9 3v9M5 8l4 4 4-4" stroke="currentColor" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3 14h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        {isZip ? `Download ZIP (${pageCount ?? ''} PDFs)` : 'Download PDF'}
      </a>

      {/* Process another */}
      {onReset && (
        <button
          onClick={onReset}
          className="text-sm text-ink-muted hover:text-ink underline underline-offset-2 transition-colors"
        >
          Process another file
        </button>
      )}
    </div>
  );
}
