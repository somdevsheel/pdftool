import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import * as os from 'os';
import { UploadService } from './upload.service';
import { FileRecord } from '../documents/documents.service';
import { successResponse } from '../../common/utils/response.util';

// Temp names carry no user-controlled part; the real extension is decided later
// from the file's verified contents.
const tempStorage = diskStorage({
  destination: os.tmpdir(),
  filename: (_req, _file, cb) => cb(null, `upload-${randomUUID()}`),
});

const MAX_FILE_SIZE_BYTES = (parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 100) * 1024 * 1024;
const MAX_FILES = 20;

// Multer enforces the size limit while streaming, so an oversized upload is cut off
// (413) before it can fill the disk, and the partial temp file is removed.
const uploadLimits = { fileSize: MAX_FILE_SIZE_BYTES, fields: 10, parts: MAX_FILES + 10 };
// Browsers send UTF-8 file names; multer otherwise decodes them as Latin-1 ("ü" → "Ã¼").
const multerOptions = { storage: tempStorage, defParamCharset: 'utf8' } as const;

// The stored path is server-internal and must not be sent to clients.
function toPublicFile({ path: _path, ...rest }: FileRecord) {
  return rest;
}

@Controller('upload')
@Throttle({ default: { limit: 30, ttl: 60_000 } })
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file', { ...multerOptions, limits: { ...uploadLimits, files: 1 } }))
  async uploadSingle(@UploadedFile() file: Express.Multer.File) {
    const record = await this.uploadService.handleUpload(file);
    return successResponse(toPublicFile(record), 'File uploaded successfully');
  }

  @Post('multiple')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor('files', MAX_FILES, { ...multerOptions, limits: { ...uploadLimits, files: MAX_FILES } }))
  async uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
    const records = await this.uploadService.handleMultiUpload(files);
    return successResponse(records.map(toPublicFile), `${records.length} files uploaded successfully`);
  }
}
