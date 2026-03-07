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

export function getFileAge(filePath: string): number {
  if (!fileExists(filePath)) return Infinity;
  const stats = fs.statSync(filePath);
  return (Date.now() - stats.mtimeMs) / 1000 / 60; // minutes
}
