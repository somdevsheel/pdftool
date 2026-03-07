import { Job, JobCreateResponse, JobStatusResponse } from '../types/job.types';
import { getApiBase } from './config';

async function post(path: string, body: any): Promise<any> {
  const res = await fetch(`${getApiBase()}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(err.message || `Request failed: ${res.status}`);
  }
  return res.json();
}

async function get(path: string): Promise<any> {
  const res = await fetch(`${getApiBase()}${path}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(err.message || `Request failed: ${res.status}`);
  }
  return res.json();
}

export async function createMergeJob(fileIds: string[]): Promise<JobCreateResponse> {
  return post('/jobs/merge', { fileIds });
}

export async function createSplitJob(fileId: string, pages?: string): Promise<JobCreateResponse> {
  return post('/jobs/split', { fileId, pages });
}

export async function createCompressJob(
  fileId: string,
  quality?: 'low' | 'medium' | 'high',
): Promise<JobCreateResponse> {
  return post('/jobs/compress', { fileId, quality });
}

export async function createRotateJob(
  fileId: string,
  degrees?: 90 | 180 | 270,
  pages?: number[],
): Promise<JobCreateResponse> {
  return post('/jobs/rotate', { fileId, degrees, pages });
}

export async function createEditJob(
  fileId: string,
  instructions: any[],
): Promise<JobCreateResponse> {
  return post('/jobs/edit', { fileId, instructions });
}

export async function getJobStatus(jobId: string): Promise<JobStatusResponse> {
  return get(`/jobs/${jobId}`);
}

export async function getDownloadUrl(jobId: string): Promise<string> {
  return `${getApiBase()}/download/${jobId}`;
}

export async function pollJobUntilDone(
  jobId: string,
  onProgress?: (job: Job) => void,
  intervalMs = 1500,
  timeoutMs = 300_000,
): Promise<Job> {
  const start = Date.now();

  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      if (Date.now() - start > timeoutMs) {
        clearInterval(interval);
        reject(new Error('Job timed out'));
        return;
      }

      try {
        const response = await getJobStatus(jobId);
        const job = response.data;

        if (onProgress) onProgress(job);

        if (job.status === 'COMPLETED') {
          clearInterval(interval);
          resolve(job);
        } else if (job.status === 'FAILED') {
          clearInterval(interval);
          reject(new Error(job.error || 'Job failed'));
        }
      } catch (err) {
        clearInterval(interval);
        reject(err);
      }
    }, intervalMs);
  });
}
