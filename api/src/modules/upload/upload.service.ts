import {
  Injectable,
  Logger,
  BadRequestException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentsService, FileRecord } from '../documents/documents.service';
import {
  generateFileId,
  buildFilePath,
  ensureDirectoryExists,
  isPdfStructurallyComplete,
  contentMatchesMimeType,
  deleteFile,
  UPLOAD_TYPES,
} from '../../common/utils/file.util';
import * as fs from 'fs';

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

    // The multer temp file must go away whatever happens below — a rejected upload
    // used to stay in /tmp forever.
    try {
      return this.storeUpload(file);
    } finally {
      try { fs.unlinkSync(file.path); } catch { /* already moved or gone */ }
    }
  }

  private storeUpload(file: Express.Multer.File): FileRecord {
    const type = UPLOAD_TYPES[file.mimetype];
    if (!type) {
      throw new UnsupportedMediaTypeException(
        `File type ${file.mimetype} is not supported. Upload a PDF, image (JPG, PNG, TIFF) or Office document.`,
      );
    }

    const maxSizeMb = this.configService.get<number>('storage.maxFileSizeMb') || 100;
    if (file.size > maxSizeMb * 1024 * 1024) {
      throw new BadRequestException(`File exceeds maximum size of ${maxSizeMb}MB`);
    }

    if (!contentMatchesMimeType(file.path, file.mimetype)) {
      throw new UnsupportedMediaTypeException(
        "This file's contents don't match its type. Please upload a valid PDF, image or Office document.",
      );
    }

    // A flaky mobile connection can drop mid-upload; Multer still reports a clean
    // "finish" for whatever bytes arrived, so this is the only place that catches it —
    // otherwise the truncated file sits silently until a later job fails on it with a
    // cryptic qpdf error.
    if (file.mimetype === 'application/pdf' && !isPdfStructurallyComplete(file.path)) {
      throw new BadRequestException(
        'This PDF looks incomplete, likely cut off during upload. Please check your connection and try again.',
      );
    }

    const uploadDir = this.configService.get<string>('storage.uploadDir');
    ensureDirectoryExists(uploadDir);

    // The stored extension comes from the verified type, never from the user's file name.
    const fileId = generateFileId();
    const destPath = buildFilePath(uploadDir, fileId, type.ext);

    // Copy rather than rename — /tmp and storage may be on different filesystems.
    fs.copyFileSync(file.path, destPath);

    const record = this.documentsService.registerFile({
      id: fileId,
      originalName: file.originalname.slice(0, 255),
      mimeType: file.mimetype,
      size: file.size,
      path: destPath,
      createdAt: new Date(),
    });

    this.logger.log(`Upload complete: ${fileId} (${file.mimetype}, ${file.size} bytes)`);
    return record;
  }

  async handleMultiUpload(files: Express.Multer.File[]): Promise<FileRecord[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    // All or nothing: if one file is rejected, drop the ones already stored and the
    // remaining temp files, rather than leaving half a batch behind.
    const stored: FileRecord[] = [];
    try {
      for (const f of files) stored.push(await this.handleUpload(f));
      return stored;
    } catch (err) {
      for (const r of stored) this.documentsService.deleteFileRecord(r.id);
      for (const f of files) deleteFile(f.path);
      throw err;
    }
  }
}
