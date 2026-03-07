'use client';

import clsx from 'clsx';
import { UploadedFile } from '../types/web.types';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

interface FileListProps {
  files: UploadedFile[];
  onRemove?: (id: string) => void;
  onMoveUp?: (idx: number) => void;
  onMoveDown?: (idx: number) => void;
  showOrder?: boolean;
  className?: string;
}

export function FileList({
  files,
  onRemove,
  onMoveUp,
  onMoveDown,
  showOrder = false,
  className,
}: FileListProps) {
  if (!files.length) return null;

  return (
    <ul className={clsx('space-y-2', className)}>
      {files.map((file, idx) => (
        <li
          key={file.id}
          className={clsx(
            'flex items-center gap-3 p-3 rounded-md',
            'bg-paper-warm border border-paper-mid',
            'animate-fade-up opacity-0',
          )}
          style={{ animationDelay: `${idx * 50}ms`, animationFillMode: 'forwards' }}
        >
          {/* Order badge */}
          {showOrder && (
            <span className="stamp w-6 h-6 flex items-center justify-center text-xs font-mono">
              {idx + 1}
            </span>
          )}

          {/* PDF icon */}
          <div className="w-8 h-10 flex-shrink-0 flex items-center justify-center">
            <svg width="24" height="28" viewBox="0 0 24 28" fill="none">
              <path d="M4 0h11l5 5v20a2 2 0 01-2 2H4a2 2 0 01-2-2V2a2 2 0 012-2z"
                fill="var(--paper)" stroke="var(--paper-mid)" strokeWidth="1" />
              <path d="M15 0v5h5" stroke="var(--paper-mid)" strokeWidth="1" fill="none" />
              <text x="4" y="22" fontSize="6" fontFamily="serif" fontWeight="bold"
                fill="var(--accent-red)">PDF</text>
            </svg>
          </div>

          {/* Name + size */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-ink truncate">{file.originalName}</p>
            <p className="text-xs text-ink-muted font-mono">{formatBytes(file.size)}</p>
          </div>

          {/* Reorder */}
          {(onMoveUp || onMoveDown) && (
            <div className="flex flex-col gap-0.5">
              <button
                onClick={() => onMoveUp?.(idx)}
                disabled={idx === 0}
                className="p-0.5 rounded hover:bg-paper-mid disabled:opacity-30 transition-colors"
                title="Move up"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 8l4-4 4 4" stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                onClick={() => onMoveDown?.(idx)}
                disabled={idx === files.length - 1}
                className="p-0.5 rounded hover:bg-paper-mid disabled:opacity-30 transition-colors"
                title="Move down"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}

          {/* Remove */}
          {onRemove && (
            <button
              onClick={() => onRemove(file.id)}
              className="p-1.5 rounded-sm hover:bg-red-50 hover:text-red-500 text-ink-muted transition-colors"
              title="Remove file"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" />
              </svg>
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
