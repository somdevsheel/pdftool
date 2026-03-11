'use client';

import { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { UploadBox } from '../../components/UploadBox';
import { FileList } from '../../components/FileList';
import { ProgressBar } from '../../components/ProgressBar';
import { ResultDownload } from '../../components/ResultDownload';
import { useUpload } from '../../hooks/useUpload';
import { useJobStatus } from '../../hooks/useJobStatus';
import { useFiles } from '../../hooks/useFiles';
import { createConvertJob } from '../../lib/jobsClient';

type Phase = 'upload' | 'processing' | 'done' | 'error';

export default function ConvertPage() {
  const { files, add, remove, clear } = useFiles(10);
  const { state: uploadState, progress: uploadProgress, upload } = useUpload();
  const { job, poll, reset: resetJob } = useJobStatus();
  const [phase, setPhase] = useState<Phase>('upload');
  const [error, setError] = useState<string | null>(null);

  async function handleDrop(raw: File[]) {
    const uploaded = await upload(raw);
    if (uploaded) add(uploaded);
  }

  async function handleConvert() {
    if (!files[0]) return;
    setPhase('processing');
    try {
      const fileIds = files.map((f: any) => f.id);
      const j = await createConvertJob(fileIds);
      poll((j as any).id, (done: any) => {
        if (done.status === 'COMPLETED') setPhase('done');
        if (done.status === 'FAILED') {
          setError(done.error || 'Conversion failed');
          setPhase('error');
        }
      });
    } catch (err: any) {
      setError(err.message);
      setPhase('error');
    }
  }

  function handleReset() {
    clear();
    resetJob();
    setPhase('upload');
    setError(null);
  }

  return (
    <ToolLayout
      title="Image to PDF"
      tagline="Convert JPG, PNG, and TIFF images to PDF format."
      icon="🖼️"
      accentColor="#0369a1"
    >
      {phase === 'upload' && (
        <div className="space-y-6">
          <UploadBox
            onFiles={handleDrop}
            accept={{
              'image/jpeg': ['.jpg', '.jpeg'],
              'image/png': ['.png'],
              'image/tiff': ['.tiff', '.tif'],
            }}
            maxFiles={10}
            label="Drop images to convert"
            sublabel="JPG, PNG, TIFF supported"
          />

          {uploadState === 'uploading' && <ProgressBar uploadProgress={uploadProgress} />}

          {files.length > 0 && (
            <div className="space-y-4">
              <FileList files={files} onRemove={remove} />
              <div className="flex gap-3">
                <button
                  onClick={handleConvert}
                  className="px-8 py-3 rounded-md bg-[var(--ink)] text-paper font-medium text-sm
                    hover:bg-[var(--ink-soft)] transition-colors shadow-paper"
                >
                  Convert to PDF →
                </button>
                <button onClick={handleReset}
                  className="px-4 py-3 rounded-md border border-paper-mid text-sm
                    text-ink-muted hover:bg-paper-warm transition-colors">
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {phase === 'processing' && (
        <div className="py-12 max-w-md mx-auto">
          <ProgressBar job={job} />
        </div>
      )}

      {phase === 'done' && job && (
        <ResultDownload jobId={(job as any).id} filename="converted.pdf" onReset={handleReset} />
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