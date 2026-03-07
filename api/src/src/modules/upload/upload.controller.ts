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
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as os from 'os';
import { UploadService } from './upload.service';
import { successResponse } from '../../common/utils/response.util';

const tempStorage = diskStorage({
  destination: os.tmpdir(),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file', { storage: tempStorage }))
  async uploadSingle(@UploadedFile() file: Express.Multer.File) {
    const record = await this.uploadService.handleUpload(file);
    return successResponse(record, 'File uploaded successfully');
  }

  @Post('multiple')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor('files', 20, { storage: tempStorage }))
  async uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
    const records = await this.uploadService.handleMultiUpload(files);
    return successResponse(records, `${records.length} files uploaded successfully`);
  }
}
