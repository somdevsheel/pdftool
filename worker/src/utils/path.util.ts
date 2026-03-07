import * as path from 'path';
import * as fs from 'fs';

export function resolvePath(...parts: string[]): string {
  return path.resolve(...parts);
}

export function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function getTempPath(dir: string, prefix: string, ext = '.pdf'): string {
  const name = `${prefix}-${Date.now()}${ext}`;
  return path.join(dir, name);
}

export function fileExists(p: string): boolean {
  return fs.existsSync(p);
}
