'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import clsx from 'clsx';

interface UploadBoxProps {
  onFiles: (files: File[]) => void;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  loading?: boolean;
  label?: string;
  sublabel?: string;
  className?: string;
}

export function UploadBox({
  onFiles,
  accept = { 'application/pdf': ['.pdf'] },
  maxFiles = 20,
  loading = false,
  label = 'Drop your PDF here',
  sublabel = 'or click to browse files',
  className,
}: UploadBoxProps) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted.length > 0) onFiles(accepted);
    },
    [onFiles],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    disabled: loading,
  });

  return (
    <div
      {...getRootProps()}
      className={clsx(
        'upload-zone rounded-lg cursor-pointer select-none',
        'flex flex-col items-center justify-center text-center',
        'min-h-[220px] p-10 gap-4',
        isDragActive && !isDragReject && 'dragging',
        loading && 'opacity-50 cursor-not-allowed',
        className,
      )}
      style={{
        background: isDragReject ? 'rgba(235,16,0,0.08)' : 'var(--surface)',
        borderColor: isDragReject ? 'var(--accent)' : undefined,
      }}
    >
      <input {...getInputProps()} />

      {/* Icon */}
      <div className="relative">
        <div className={clsx(
          'w-16 h-16 rounded-xl flex items-center justify-center transition-transform duration-200',
          isDragActive && 'scale-110',
        )}
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border-light)' }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none"
            style={{ color: isDragActive ? 'var(--accent)' : 'var(--text-muted)' }}>
            <path d="M8 26h16a2 2 0 002-2V12l-6-6H8a2 2 0 00-2 2v16a2 2 0 002 2z"
              stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <path d="M18 6v6h6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <path d="M16 14v8M12 18l4-4 4 4" stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </div>
        {isDragActive && !isDragReject && (
          <div className="absolute inset-0 rounded-xl animate-ping"
            style={{ background: 'var(--accent)', opacity: 0.15 }} />
        )}
      </div>

      {/* Text */}
      <div>
        <p className="font-semibold text-base mb-1" style={{ color: 'var(--text)' }}>
          {isDragReject ? 'That file type is not supported'
            : isDragActive ? 'Release to upload'
            : label}
        </p>
        {!isDragActive && !isDragReject && (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{sublabel}</p>
        )}
      </div>

      {maxFiles > 1 && (
        <div className="stamp mt-2">Up to {maxFiles} files · PDF only</div>
      )}
    </div>
  );
}
