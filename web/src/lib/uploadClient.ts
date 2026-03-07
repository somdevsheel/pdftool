import { apiClient } from './apiClient';
import { UploadedFile } from '../types/web.types';

export async function uploadFile(
  file: File,
  onProgress?: (pct: number) => void,
): Promise<UploadedFile> {
  const form = new FormData();
  form.append('file', file);

  const res = await apiClient.post('/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
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
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        onProgress(Math.round((e.loaded * 100) / e.total));
      }
    },
  });

  return res.data.data as UploadedFile[];
}
