'use client';

import { useState, useCallback } from 'react';
import { uploadFile, uploadFiles } from '../lib/uploadClient';
import { UploadedFile } from '../types/web.types';

export type UploadState = 'idle' | 'uploading' | 'done' | 'error';

export function useUpload() {
  const [files, setFiles]       = useState<UploadedFile[]>([]);
  const [state, setState]       = useState<UploadState>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError]       = useState<string | null>(null);

  const upload = useCallback(async (rawFiles: File[]) => {
    if (!rawFiles.length) return;
    setState('uploading');
    setProgress(0);
    setError(null);

    try {
      let uploaded: UploadedFile[];
      if (rawFiles.length === 1) {
        const f = await uploadFile(rawFiles[0], setProgress);
        uploaded = [f];
      } else {
        uploaded = await uploadFiles(rawFiles, setProgress);
      }
      setFiles(uploaded);
      setState('done');
      setProgress(100);
      return uploaded;
    } catch (err: any) {
      setError(err.message);
      setState('error');
    }
  }, []);

  const reset = useCallback(() => {
    setFiles([]);
    setState('idle');
    setProgress(0);
    setError(null);
  }, []);

  return { files, state, progress, error, upload, reset };
}
