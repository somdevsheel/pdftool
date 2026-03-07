import * as fs from 'fs';
import * as path from 'path';
import { ensureDir } from '../utils/path.util';

export class FileService {
  constructor(
    private readonly uploadDir: string,
    private readonly processingDir: string,
    private readonly outputDir: string,
  ) {
    ensureDir(uploadDir);
    ensureDir(processingDir);
    ensureDir(outputDir);
  }

  copyToProcessing(sourcePath: string, jobId: string): string {
    ensureDir(this.processingDir);
    const ext = path.extname(sourcePath);
    const destPath = path.join(this.processingDir, `${jobId}${ext}`);
    fs.copyFileSync(sourcePath, destPath);
    return destPath;
  }

  getOutputPath(jobId: string, ext = '.pdf'): string {
    return path.join(this.outputDir, `${jobId}${ext}`);
  }

  fileExists(filePath: string): boolean {
    return fs.existsSync(filePath);
  }

  deleteFile(filePath: string): void {
    if (this.fileExists(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  getFileSize(filePath: string): number {
    if (!this.fileExists(filePath)) return 0;
    return fs.statSync(filePath).size;
  }

  listFiles(dir: string): string[] {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir).map((f) => path.join(dir, f));
  }
}
