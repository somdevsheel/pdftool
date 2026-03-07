import {
  Injectable,
  Logger,
  BadRequestException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentsService, FileRecord } from '../documents/documents.service';
import { generateFileId, buildFilePath, ensureDirectoryExists } from '../../common/utils/file.util';
import { ALLOWED_MIME_TYPES } from '../../common/constants';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly documentsService: DocumentsService,
  ) {}

  async handleUpload(file: Express.Multer.File): Promise<FileRecord> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype as any)) {
      throw new UnsupportedMediaTypeException(
        `File type ${file.mimetype} is not allowed. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}`,
      );
    }

    const maxSizeMb = this.configService.get<number>('storage.maxFileSizeMb') || 100;
    if (file.size > maxSizeMb * 1024 * 1024) {
      throw new BadRequestException(`File exceeds maximum size of ${maxSizeMb}MB`);
    }

    const uploadDir = this.configService.get<string>('storage.uploadDir');
    ensureDirectoryExists(uploadDir);

    const fileId = generateFileId();
    const ext = path.extname(file.originalname) || '.pdf';
    const destPath = buildFilePath(uploadDir, fileId, ext);

    // Copy then delete — handles cross-device/cross-filesystem moves.
    // fs.renameSync fails when /tmp and storage are on different partitions/drives.
    fs.copyFileSync(file.path, destPath);
    try { fs.unlinkSync(file.path); } catch { /* ignore cleanup failure */ }

    const record = this.documentsService.registerFile({
      id: fileId,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: destPath,
      createdAt: new Date(),
    });

    this.logger.log(`Upload complete: ${fileId} → ${file.originalname} (${file.size} bytes)`);
    return record;
  }

  async handleMultiUpload(files: Express.Multer.File[]): Promise<FileRecord[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }
    return Promise.all(files.map((f) => this.handleUpload(f)));
  }
}
