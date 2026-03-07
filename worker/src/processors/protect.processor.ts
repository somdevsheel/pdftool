import { Job } from 'bullmq';
import { CommandService } from '../services/command.service';
import { FileService } from '../services/file.service';

export interface ProtectJobData {
  jobId: string;
  type: 'protect';
  inputPath: string;
  outputPath: string;
  userPassword: string;
  ownerPassword?: string;
}

export async function processProtect(
  job: Job<ProtectJobData>,
  commandService: CommandService,
  fileService: FileService,
): Promise<{ outputPath: string }> {
  const { jobId, inputPath, outputPath, userPassword, ownerPassword } = job.data;
  console.log(`[Protect] job=${jobId}`);

  if (!fileService.fileExists(inputPath)) throw new Error(`Input not found: ${inputPath}`);
  await job.updateProgress(10);

  const finalOutput = outputPath + '.pdf';
  await commandService.protectPdf({ inputPath, outputPath: finalOutput, userPassword, ownerPassword });
  await job.updateProgress(90);

  if (!fileService.fileExists(finalOutput)) throw new Error('Protect produced no output');
  await job.updateProgress(100);
  console.log(`[Protect] Done: ${finalOutput}`);
  return { outputPath: finalOutput };
}
