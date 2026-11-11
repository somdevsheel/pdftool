import * as path from 'path';
import * as fs from 'fs';
import { randomUUID } from 'crypto';

export function generateFileId(): string {
  return randomUUID();
}

export function getFileExtension(filename: string): string {
  return path.extname(filename).toLowerCase();
}

export function buildFilePath(dir: string, fileId: string, ext = '.pdf'): string {
  return path.join(dir, `${fileId}${ext}`);
}

export function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

export function getFileSizeBytes(filePath: string): number {
  if (!fileExists(filePath)) return 0;
  return fs.statSync(filePath).size;
}

export function deleteFile(filePath: string): void {
  if (fileExists(filePath)) {
    fs.unlinkSync(filePath);
  }
}

// A PDF's cross-reference table and trailer (containing /Root) live at the very end of
// the file, so a connection dropped mid-upload produces a file with a valid header but a
// missing/truncated tail — this is the cheapest way to catch that without shelling out to
// qpdf, which isn't installed on every service that accepts uploads.
export function isPdfStructurallyComplete(filePath: string): boolean {
  const fd = fs.openSync(filePath, 'r');
  try {
    const size = fs.fstatSync(fd).size;
    if (size < 8) return false;

    const header = Buffer.alloc(5);
    fs.readSync(fd, header, 0, 5, 0);
    if (header.toString('ascii') !== '%PDF-') return false;

    const tailSize = Math.min(2048, size);
    const tail = Buffer.alloc(tailSize);
    fs.readSync(fd, tail, 0, tailSize, size - tailSize);
    return tail.toString('latin1').includes('%%EOF');
  } finally {
    fs.closeSync(fd);
  }
}

// Expected leading bytes ("magic numbers") for each accepted upload type, keyed by the
// MIME type the client claims, with the extension the file is stored under. The claim
// alone comes from the browser and can't be trusted.
const OLE = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]; // legacy .doc/.ppt/.xls
const ZIP = [0x50, 0x4b, 0x03, 0x04];                          // .docx/.pptx/.xlsx
export const UPLOAD_TYPES: Record<string, { ext: string; magic: number[][] }> = {
  'application/pdf': { ext: '.pdf', magic: [[0x25, 0x50, 0x44, 0x46, 0x2d]] },
  'image/jpeg': { ext: '.jpg', magic: [[0xff, 0xd8, 0xff]] },
  'image/png': { ext: '.png', magic: [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]] },
  'image/tiff': { ext: '.tiff', magic: [[0x49, 0x49, 0x2a, 0x00], [0x4d, 0x4d, 0x00, 0x2a]] },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { ext: '.docx', magic: [ZIP] },
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': { ext: '.pptx', magic: [ZIP] },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { ext: '.xlsx', magic: [ZIP] },
  'application/msword': { ext: '.doc', magic: [OLE] },
  'application/vnd.ms-powerpoint': { ext: '.ppt', magic: [OLE] },
  'application/vnd.ms-excel': { ext: '.xls', magic: [OLE] },
};

/** True when the file's first bytes match one of the signatures for `mimeType`. */
export function contentMatchesMimeType(filePath: string, mimeType: string): boolean {
  const type = UPLOAD_TYPES[mimeType];
  if (!type) return false;
  const fd = fs.openSync(filePath, 'r');
  try {
    // PDFs may have a little junk before the header; readers accept it within 1 KB.
    const head = Buffer.alloc(1024);
    const n = fs.readSync(fd, head, 0, head.length, 0);
    if (mimeType === 'application/pdf') return head.subarray(0, n).includes('%PDF-');
    return type.magic.some((sig) => n >= sig.length && sig.every((b, i) => head[i] === b));
  } finally {
    fs.closeSync(fd);
  }
}

export function getFileAge(filePath: string): number {
  if (!fileExists(filePath)) return Infinity;
  const stats = fs.statSync(filePath);
  return (Date.now() - stats.mtimeMs) / 1000 / 60; // minutes
}
