import { Job } from 'bullmq';
import { FileService } from '../services/file.service';
import { convertPdfToDocx } from '../utils/pdf-tools';

export interface PdfToDocxJobData {
  jobId: string;
  type: 'pdf-to-docx';
  inputPath: string;
  outputPath: string;
}

export async function processPdfToDocx(
  job: Job<PdfToDocxJobData>,
  fileService: FileService,
): Promise<{ outputPath: string }> {
  const { jobId, inputPath, outputPath } = job.data;
  console.log(`[PdfToDocx] job=${jobId}`);

  if (!fileService.fileExists(inputPath)) throw new Error(`Input not found: ${inputPath}`);
  await job.updateProgress(10);

  const finalOutput = await convertPdfToDocx(inputPath, outputPath);

  await job.updateProgress(100);
  console.log(`[PdfToDocx] Done: ${finalOutput}`);
  return { outputPath: finalOutput };
}