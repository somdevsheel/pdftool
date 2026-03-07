'use client';

import clsx from 'clsx';

interface FilePreviewProps {
  name: string;
  size: number;
  className?: string;
}

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(2)} MB`;
}

export function FilePreview({ name, size, className }: FilePreviewProps) {
  return (
    <div className={clsx(
      'flex items-center gap-3 p-4 rounded-md bg-paper-warm border border-paper-mid',
      className,
    )}>
      {/* PDF icon */}
      <div className="w-10 h-12 flex-shrink-0 flex flex-col items-center justify-center
        bg-paper border border-paper-mid rounded-sm shadow-stamp relative">
        <span className="text-[8px] font-mono font-bold tracking-widest text-[var(--accent-red)]">
          PDF
        </span>
        <div className="absolute top-0 right-0 w-3 h-3 overflow-hidden">
          <div className="w-4 h-4 bg-paper-mid rotate-45 translate-x-1 -translate-y-1" />
        </div>
      </div>

      <div className="min-w-0">
        <p className="text-sm font-medium text-ink truncate">{name}</p>
        <p className="text-xs text-ink-muted font-mono">{formatBytes(size)}</p>
      </div>
    </div>
  );
}
