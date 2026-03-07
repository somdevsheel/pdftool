'use client';

import clsx from 'clsx';
import { Job } from '../types/web.types';

interface ProgressBarProps {
  job?: Job | null;
  uploadProgress?: number;
  className?: string;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING:    'Waiting in queue…',
  PROCESSING: 'Processing your file…',
  COMPLETED:  'Done!',
  FAILED:     'Processing failed',
};

export function ProgressBar({ job, uploadProgress, className }: ProgressBarProps) {
  const isUploading = uploadProgress !== undefined && uploadProgress < 100 && !job;
  const percent     = isUploading
    ? uploadProgress
    : job?.progress ?? (job?.status === 'PROCESSING' ? 40 : job?.status === 'COMPLETED' ? 100 : 0);

  const label = isUploading
    ? `Uploading… ${uploadProgress}%`
    : job
    ? STATUS_LABELS[job.status] || job.status
    : '';

  const isFailed = job?.status === 'FAILED';

  return (
    <div className={clsx('space-y-3', className)}>
      {/* Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {(isUploading || job?.status === 'PROCESSING' || job?.status === 'PENDING') && (
            <span className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-[var(--accent-red)]"
                  style={{ animation: `dotPulse 1.4s ease-in-out ${i * 0.2}s infinite` }}
                />
              ))}
            </span>
          )}
          {job?.status === 'COMPLETED' && (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
              className="text-[var(--accent-teal)]">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
              <path d="M5 8l2.5 2.5L11 5.5" stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {isFailed && (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
              className="text-red-500">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
              <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" />
            </svg>
          )}
          <span className={clsx(
            'text-sm font-medium',
            isFailed ? 'text-red-500' : 'text-ink',
          )}>
            {label}
          </span>
        </div>
        <span className="text-xs font-mono text-ink-muted">{percent}%</span>
      </div>

      {/* Bar */}
      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{
            width: `${percent}%`,
            background: isFailed
              ? '#ef4444'
              : 'linear-gradient(90deg, var(--accent-red), var(--accent-gold))',
          }}
        />
      </div>

      {/* Error detail */}
      {isFailed && job?.error && (
        <p className="text-xs text-red-500 font-mono bg-red-50 px-3 py-2 rounded">
          {job.error}
        </p>
      )}
    </div>
  );
}
