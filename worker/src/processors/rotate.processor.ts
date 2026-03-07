import { Job } from 'bullmq';
import { CommandService } from '../services/command.service';
import { FileService } from '../services/file.service';

export interface RotateJobData {
  jobId: string;
  type: 'rotate';
  inputPath: string;
  outputPath: string;
  degrees: 90 | 180 | 270;
  pages?: number[];
}

export async function processRotate(
  job: Job<RotateJobData>,
  commandService: CommandService,
  fileService: FileService,
): Promise<{ outputPath: string }> {
  const { jobId, inputPath, outputPath, degrees, pages } = job.data;

  console.log(`[Rotate] Processing job ${jobId} degrees=${degrees}`);

  if (!fileService.fileExists(inputPath)) {
    throw new Error(`Input file not found: ${inputPath}`);
  }

  await job.updateProgress(10);

  await commandService.rotatePdf({ inputPath, outputPath, degrees, pages });

  await job.updateProgress(90);

  if (!fileService.fileExists(outputPath)) {
    throw new Error(`Rotate produced no output`);
  }

  console.log(`[Rotate] Done: ${outputPath}`);
  await job.updateProgress(100);
  return { outputPath };
}
