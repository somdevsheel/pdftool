import { errorFromResponse } from './apiErrors';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// ─── Shared types ──────────────────────────────────────────────────────────

export interface JobResponse {
  id: string;
  type?: string;
  status: string;
  progress?: number;
  error?: string;
}

// ─── Shared fetch helper ───────────────────────────────────────────────────

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw await errorFromResponse(res);
  const json = await res.json();
  return json.data ?? json;
}

// ─── Upload ────────────────────────────────────────────────────────────────

export async function uploadFile(file: File): Promise<{ id: string; originalName: string; size: number }> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: form });
  if (!res.ok) throw await errorFromResponse(res);
  const json = await res.json();
  return json.data ?? json;
}

// ─── Download ──────────────────────────────────────────────────────────────

export function getDownloadUrl(jobId: string): string {
  return `${API_BASE}/download/${jobId}`;
}

// ─── Job status ────────────────────────────────────────────────────────────

export async function getJob(jobId: string): Promise<JobResponse> {
  const res = await fetch(`${API_BASE}/jobs/${jobId}`);
  if (!res.ok) throw await errorFromResponse(res);
  const json = await res.json();
  return json.data ?? json;
}

// ─── Job creators ──────────────────────────────────────────────────────────

export async function createMergeJob(fileIds: string[]): Promise<JobResponse> {
  return post<JobResponse>('jobs/merge', { fileIds });
}

export async function createSplitJob(fileId: string, pages?: string): Promise<JobResponse> {
  return post<JobResponse>('jobs/split', { fileId, pages });
}

export async function createCompressJob(fileId: string, quality: 'low' | 'medium' | 'high' = 'medium'): Promise<JobResponse> {
  return post<JobResponse>('jobs/compress', { fileId, quality });
}

export async function createRotateJob(fileId: string, degrees: 90 | 180 | 270 = 90, pages?: number[]): Promise<JobResponse> {
  return post<JobResponse>('jobs/rotate', { fileId, degrees, pages });
}

export async function createConvertJob(fileIds: string | string[]): Promise<JobResponse> {
  const ids = Array.isArray(fileIds) ? fileIds : [fileIds];
  return post<JobResponse>('jobs/convert', { fileIds: ids });
}

export async function createEditJob(fileId: string, instructions: unknown[] = []): Promise<JobResponse> {
  return post<JobResponse>('jobs/edit', { fileId, instructions });
}

export async function createPagesJob(
  fileId: string,
  operation: 'delete' | 'extract' | 'reorder' | 'organize',
  pages: number[],
): Promise<JobResponse> {
  return post<JobResponse>('jobs/pages', { fileId, operation, pages });
}

export async function createPdfToImgJob(
  fileId: string,
  format: 'jpg' | 'png' = 'jpg',
  dpi: 150 | 200 | 300 = 150,
): Promise<JobResponse> {
  return post<JobResponse>('jobs/pdf-to-img', { fileId, format, dpi });
}

export async function createOfficeToPdfJob(fileId: string): Promise<JobResponse> {
  return post<JobResponse>('jobs/office-to-pdf', { fileId });
}

export async function createPdfToOfficeJob(fileId: string, format: 'docx' | 'pptx' | 'xlsx'): Promise<JobResponse> {
  return post<JobResponse>('jobs/pdf-to-office', { fileId, format });
}

export async function createProtectJob(fileId: string, userPassword: string, ownerPassword?: string): Promise<JobResponse> {
  return post<JobResponse>('jobs/protect', { fileId, userPassword, ownerPassword });
}

export async function createInsertPagesJob(baseFileId: string, insertFileId: string, afterPage: number): Promise<JobResponse> {
  return post<JobResponse>('jobs/insert-pages', { baseFileId, insertFileId, afterPage });
}

export async function createNumberPagesJob(
  fileId: string,
  position: string,
  startNumber: number,
  fontSize: number,
): Promise<JobResponse> {
  return post<JobResponse>('jobs/number-pages', { fileId, position, startNumber, fontSize });
}

export async function createCropJob(
  fileId: string,
  margins: { top: number; bottom: number; left: number; right: number },
): Promise<JobResponse> {
  return post<JobResponse>('jobs/crop', { fileId, ...margins });
}
