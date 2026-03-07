import { Job } from 'bullmq';
import { CommandService } from '../services/command.service';
import { FileService } from '../services/file.service';

export interface CompressJobData {
  jobId: string;
  type: 'compress';
  inputPath: string;
  outputPath: string;
  quality: 'low' | 'medium' | 'high';
}

export async function processCompress(
  job: Job<CompressJobData>,
  commandService: CommandService,
  fileService: FileService,
): Promise<{ outputPath: string }> {
  const { jobId, inputPath, outputPath, quality } = job.data;

  console.log(`[Compress] Processing job ${jobId} quality=${quality}`);

  if (!fileService.fileExists(inputPath)) {
    throw new Error(`Input file not found: ${inputPath}`);
  }

  const inputSize = fileService.getFileSize(inputPath);
  await job.updateProgress(10);

  await commandService.compressPdf({ inputPath, outputPath, quality });

  await job.updateProgress(90);

  if (!fileService.fileExists(outputPath)) {
    throw new Error(`Compress produced no output`);
  }

  const outputSize = fileService.getFileSize(outputPath);
  const reduction = (((inputSize - outputSize) / inputSize) * 100).toFixed(1);
  console.log(`[Compress] Done: ${outputPath} (saved ${reduction}%)`);

  await job.updateProgress(100);
  return { outputPath };
}
