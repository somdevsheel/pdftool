import { Job } from 'bullmq';
import * as fs from 'fs';
import { CommandService } from '../services/command.service';
import { FileService } from '../services/file.service';

export interface OfficeToPdfJobData {
  jobId: string;
  type: 'office-to-pdf';
  inputPath: string;
  outputPath: string;
}

export async function processOfficeToPdf(
  job: Job<OfficeToPdfJobData>,
  commandService: CommandService,
  fileService: FileService,
): Promise<{ outputPath: string }> {
  const { jobId, inputPath, outputPath } = job.data;
  console.log(`[OfficeToPdf] job ${jobId}`);

  if (!fileService.fileExists(inputPath)) throw new Error(`Input not found: ${inputPath}`);
  await job.updateProgress(10);

  const tmpDir = outputPath + '_lo';
  fs.mkdirSync(tmpDir, { recursive: true });

  const resultPath = await commandService.officeToPdf({ inputPath, outputDir: tmpDir });
  await job.updateProgress(80);

  fs.copyFileSync(resultPath, outputPath);
  fs.rmSync(tmpDir, { recursive: true, force: true });

  if (!fileService.fileExists(outputPath)) throw new Error('OfficeToPdf produced no output');
  await job.updateProgress(100);
  console.log(`[OfficeToPdf] Done: ${outputPath}`);
  return { outputPath };
}
