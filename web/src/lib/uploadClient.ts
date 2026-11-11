import { apiClient } from './apiClient';
import { UploadedFile } from '../types/web.types';

const UPLOAD_TIMEOUT_MS = 10 * 60_000;

export async function uploadFile(
  file: File,
  onProgress?: (pct: number) => void,
): Promise<UploadedFile> {
  const form = new FormData();
  form.append('file', file);

  const res = await apiClient.post('/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    // Large files on slow connections take minutes; the client's default 30 s would cut them off.
    timeout: UPLOAD_TIMEOUT_MS,
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        onProgress(Math.round((e.loaded * 100) / e.total));
      }
    },
  });

  return res.data.data as UploadedFile;
}

export async function uploadFiles(
  files: File[],
  onProgress?: (pct: number) => void,
): Promise<UploadedFile[]> {
  const form = new FormData();
  files.forEach((f) => form.append('files', f));

  const res = await apiClient.post('/upload/multiple', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    // Large files on slow connections take minutes; the client's default 30 s would cut them off.
    timeout: UPLOAD_TIMEOUT_MS,
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        onProgress(Math.round((e.loaded * 100) / e.total));
      }
    },
  });

  return res.data.data as UploadedFile[];
}
