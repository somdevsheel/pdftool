import { API_BASE } from '../client/axios';
import { friendlyErrorMessage } from '../../utils/errors';

// Large files on slow mobile data can take minutes.
const UPLOAD_TIMEOUT_MS = 10 * 60_000;
const NETWORK_RETRIES = 2;

class HttpError extends Error {}

// Uploads go through XMLHttpRequest (React Native's own networking), not fetch.
// Since Expo SDK 55 the global fetch is expo/fetch, which rejects React Native's
// `{ uri, name, type }` FormData file parts with "Unsupported FormDataPart
// implementation" — that broke every upload. XHR still streams the file straight from
// its uri, and also reports real upload progress.
function postFile(
  uri: string,
  fileName: string,
  mimeType: string,
  onProgress?: (progress: number) => void,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', { uri, name: fileName, type: mimeType } as any);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE}/upload`);
    xhr.timeout = UPLOAD_TIMEOUT_MS;
    xhr.setRequestHeader('Accept', 'application/json');

    if (onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && e.total > 0) onProgress(Math.round((e.loaded / e.total) * 100));
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          const id = data.data?.id || data.id;
          if (id) return resolve(id);
        } catch {
          /* fall through */
        }
        return reject(new HttpError('Upload failed: unexpected server response'));
      }
      reject(new HttpError(friendlyErrorMessage(xhr.responseText, uploadErrorFallback(xhr.status))));
    };
    xhr.onerror = () => reject(new Error('Network error while uploading. Check your connection and try again.'));
    xhr.ontimeout = () => reject(new Error('Upload timed out. Try again on a faster connection.'));

    xhr.send(formData);
  });
}

function uploadErrorFallback(status: number): string {
  if (status === 413) return 'This file is too large. The maximum size is 100 MB.';
  if (status === 415) return 'This file type is not supported.';
  if (status === 429) return 'Too many uploads. Please wait a minute and try again.';
  return 'Upload failed';
}

export async function uploadFile(
  uri: string,
  fileName: string,
  mimeType: string = 'application/pdf',
  onProgress?: (progress: number) => void,
): Promise<string> {
  // Retry only network failures, never a server rejection (bad file, too large, …).
  for (let attempt = 0; ; attempt++) {
    try {
      return await postFile(uri, fileName, mimeType, onProgress);
    } catch (e) {
      if (e instanceof HttpError || attempt >= NETWORK_RETRIES) throw e;
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
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
