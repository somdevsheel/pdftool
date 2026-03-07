import { UploadResponse, MultiUploadResponse } from '../types/document.types';
import { getApiBase } from './config';

export async function uploadFile(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${getApiBase()}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Upload failed' }));
    throw new Error(err.message || `Upload failed: ${res.status}`);
  }

  return res.json();
}

export async function uploadFiles(files: File[]): Promise<MultiUploadResponse> {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  const res = await fetch(`${getApiBase()}/upload/multiple`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Upload failed' }));
    throw new Error(err.message || `Upload failed: ${res.status}`);
  }

  return res.json();
}
