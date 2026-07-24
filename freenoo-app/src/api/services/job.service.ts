import { ENDPOINTS } from '../endpoints';
import { fetchWithRetry } from '../client/fetchRetry';
import { JobStatus } from '../../types';
import { friendlyErrorMessage } from '../../utils/errors';

export async function pollJob(
  jobId: string,
  maxAttempts = 60,
  onProgress?: (progress: number) => void
): Promise<void> {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(r => setTimeout(r, 2000));
    const res = await fetchWithRetry(ENDPOINTS.job(jobId));
    const json = await res.json();
    const data: JobStatus = json.data || json;

    if (onProgress) onProgress(data.progress || 0);
    if (data.status === 'COMPLETED') return;
    if (data.status === 'FAILED') throw new Error(friendlyErrorMessage(data.error, 'Job failed'));
  }
  throw new Error('Timeout — job took too long');
}

export async function createJob(endpoint: string, body: object): Promise<string> {
  const res = await fetchWithRetry(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Job failed: ${err}`);
  }
  const json = await res.json();
  return json.data?.id || json.id;
}
