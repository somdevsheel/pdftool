import { Job } from 'bullmq';
import { CommandService } from '../services/command.service';
import { FileService } from '../services/file.service';

export interface NumberPagesJobData {
  jobId: string;
  type: 'number-pages';
  inputPath: string;
  outputPath: string;
  position: 'bottom-center' | 'bottom-right' | 'bottom-left' | 'top-center' | 'top-right' | 'top-left';
  startNumber: number;
  fontSize: number;
}

export async function processNumberPages(
  job: Job<NumberPagesJobData>,
  commandService: CommandService,
  fileService: FileService,
): Promise<{ outputPath: string }> {
  const { jobId, inputPath, outputPath, position, startNumber, fontSize } = job.data;
  console.log(`[NumberPages] job=${jobId} position=${position} start=${startNumber}`);

  if (!fileService.fileExists(inputPath)) throw new Error(`Input not found: ${inputPath}`);
  await job.updateProgress(10);

  const finalOutput = outputPath + '.pdf';
  await commandService.numberPages({ inputPath, outputPath: finalOutput, position, startNumber, fontSize });
  await job.updateProgress(90);

  if (!fileService.fileExists(finalOutput)) throw new Error('Number pages produced no output');
  await job.updateProgress(100);
  console.log(`[NumberPages] Done: ${finalOutput}`);
  return { outputPath: finalOutput };
}
