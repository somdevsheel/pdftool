import { registerAs } from '@nestjs/config';
import * as path from 'path';

export default registerAs('storage', () => ({
  uploadDir: process.env.UPLOAD_DIR
    ? path.resolve(process.env.UPLOAD_DIR)
    : path.resolve(__dirname, '../../../storage/uploads'),
  processingDir: process.env.PROCESSING_DIR
    ? path.resolve(process.env.PROCESSING_DIR)
    : path.resolve(__dirname, '../../../storage/processing'),
  outputDir: process.env.OUTPUT_DIR
    ? path.resolve(process.env.OUTPUT_DIR)
    : path.resolve(__dirname, '../../../storage/output'),
  maxFileSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 100,
  fileExpiryMinutes: parseInt(process.env.FILE_EXPIRY_MINUTES, 10) || 60,
}));
