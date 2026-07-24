import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

export function generateFileId(): string {
  return uuidv4();
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

export function getFileAge(filePath: string): number {
  if (!fileExists(filePath)) return Infinity;
  const stats = fs.statSync(filePath);
  return (Date.now() - stats.mtimeMs) / 1000 / 60; // minutes
}
