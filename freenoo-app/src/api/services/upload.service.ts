import { apiClient, API_BASE } from '../client/axios';
import { fetchWithRetry } from '../client/fetchRetry';
import { UploadedFile } from '../../types';
import { friendlyErrorMessage } from '../../utils/errors';

export async function uploadFile(
  uri: string,
  fileName: string,
  mimeType: string = 'application/pdf',
  onProgress?: (progress: number) => void
): Promise<string> {
  const formData = new FormData();
  formData.append('file', { uri, name: fileName, type: mimeType } as any);

  const res = await fetchWithRetry(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(friendlyErrorMessage(err, 'Upload failed'));
  }

  const data = await res.json();
  return data.data?.id || data.id;
}

export async function uploadMultipleFiles(
  files: { uri: string; name: string; mimeType?: string }[],
  onProgress?: (current: number, total: number) => void
): Promise<string[]> {
  const ids: string[] = [];
  for (let i = 0; i < files.length; i++) {
    if (onProgress) onProgress(i + 1, files.length);
    const id = await uploadFile(files[i].uri, files[i].name, files[i].mimeType);
    ids.push(id);
  }
  return ids;
}
