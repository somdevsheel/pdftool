import { Job } from 'bullmq';
import { CommandService } from '../services/command.service';
import { FileService } from '../services/file.service';

export interface CropJobData {
  jobId: string;
  type: 'crop';
  inputPath: string;
  outputPath: string;
  // margins to remove in points (1pt = 1/72 inch)
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export async function processCrop(
  job: Job<CropJobData>,
  commandService: CommandService,
  fileService: FileService,
): Promise<{ outputPath: string }> {
  const { jobId, inputPath, outputPath, top, bottom, left, right } = job.data;
  console.log(`[Crop] job=${jobId} margins: t=${top} b=${bottom} l=${left} r=${right}`);

  if (!fileService.fileExists(inputPath)) throw new Error(`Input not found: ${inputPath}`);
  await job.updateProgress(10);

  const finalOutput = outputPath + '.pdf';
  await commandService.cropPdf({ inputPath, outputPath: finalOutput, top, bottom, left, right });
  await job.updateProgress(90);

  if (!fileService.fileExists(finalOutput)) throw new Error('Crop produced no output');
  await job.updateProgress(100);
  console.log(`[Crop] Done: ${finalOutput}`);
  return { outputPath: finalOutput };
}
