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
  let succeeded = false;
  try {
    await commandService.protectPdf({ inputPath, outputPath: finalOutput, userPassword, ownerPassword });
    succeeded = true;
  } finally {
    // The job record stays in Redis after it finishes, so don't leave the user's
    // password sitting there in plaintext. Keep it only while a retry may still need it.
    const lastAttempt = job.attemptsMade + 1 >= (job.opts.attempts ?? 1);
    if (succeeded || lastAttempt) {
      await job.updateData({ ...job.data, userPassword: '', ownerPassword: undefined }).catch(() => {});
    }
  }
  await job.updateProgress(90);

  if (!fileService.fileExists(finalOutput)) throw new Error('Protect produced no output');
  await job.updateProgress(100);
  console.log(`[Protect] Done: ${finalOutput}`);
  return { outputPath: finalOutput };
}
