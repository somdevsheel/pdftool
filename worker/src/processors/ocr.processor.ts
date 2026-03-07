import { Job } from 'bullmq';
import { FileService } from '../services/file.service';
import { performOcr } from '../utils/pdf-tools';

export interface OcrJobData {
  jobId: string;
  type: 'ocr';
  inputPath: string;
  outputPath: string;
  language: string; // e.g. 'eng', 'hin+eng'
}

export async function processOcr(
  job: Job<OcrJobData>,
  fileService: FileService,
): Promise<{ outputPath: string }> {
  const { jobId, inputPath, outputPath, language = 'eng' } = job.data;
  console.log(`[OCR] job=${jobId} lang=${language}`);

  if (!fileService.fileExists(inputPath)) throw new Error(`Input not found: ${inputPath}`);
  await job.updateProgress(5);

  const finalOutput = await performOcr(inputPath, outputPath, language);

  await job.updateProgress(100);
  console.log(`[OCR] Done: ${finalOutput}`);
  return { outputPath: finalOutput };
}