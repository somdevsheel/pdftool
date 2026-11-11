import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { deleteFile, getFileAge, UPLOAD_TYPES } from '../../common/utils/file.util';

export interface FileRecord {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  createdAt: Date;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Uploads are tracked on disk, not in memory: each file is stored as `<id><ext>` next
// to a `<id>.meta.json` sidecar. An API restart or a second API instance therefore
// still finds every upload, and cleanup can't miss files the process never saw.
@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);

  constructor(private readonly configService: ConfigService) {}

  private get uploadDir(): string {
    return this.configService.get<string>('storage.uploadDir');
  }

  private metaPath(id: string): string {
    return path.join(this.uploadDir, `${id}.meta.json`);
  }

  registerFile(record: FileRecord): FileRecord {
    fs.writeFileSync(this.metaPath(record.id), JSON.stringify(record));
    return record;
  }

  getFile(fileId: string): FileRecord {
    if (!UUID.test(fileId)) throw new NotFoundException(`File not found: ${fileId}`);
    try {
      const record = JSON.parse(fs.readFileSync(this.metaPath(fileId), 'utf8')) as FileRecord;
      const ext = UPLOAD_TYPES[record.mimeType]?.ext;
      const filePath = ext && path.join(this.uploadDir, `${fileId}${ext}`);
      if (filePath && fs.existsSync(filePath)) return { ...record, path: filePath };
    } catch {
      /* missing or unreadable sidecar → not found */
    }
    throw new NotFoundException(`File not found or expired: ${fileId}. Please upload it again.`);
  }

  deleteFileRecord(fileId: string): void {
    if (!UUID.test(fileId)) return;
    try {
      const { mimeType } = JSON.parse(fs.readFileSync(this.metaPath(fileId), 'utf8'));
      const ext = UPLOAD_TYPES[mimeType]?.ext;
      if (ext) deleteFile(path.join(this.uploadDir, `${fileId}${ext}`));
    } catch { /* nothing to delete */ }
    deleteFile(this.metaPath(fileId));
  }

  // ─── Cleanup ─────────────────────────────────────────────────────────────

  /** Deletes uploads and job outputs older than the configured expiry. */
  cleanExpiredFiles(): { deletedFiles: number } {
    const expiryMinutes = this.configService.get<number>('storage.fileExpiryMinutes') || 60;
    const dirs = [this.uploadDir, this.configService.get<string>('storage.outputDir')];
    let deletedFiles = 0;

    for (const dir of dirs) {
      if (!dir || !fs.existsSync(dir)) continue;
      for (const name of fs.readdirSync(dir)) {
        const full = path.join(dir, name);
        try {
          if (getFileAge(full) <= expiryMinutes) continue;
          fs.rmSync(full, { recursive: true, force: true });
          deletedFiles++;
        } catch (err) {
          this.logger.warn(`Failed to delete ${full}: ${err.message}`);
        }
      }
    }
    return { deletedFiles };
  }
}
