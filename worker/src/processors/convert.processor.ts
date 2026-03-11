import { Job } from 'bullmq';
import { CommandService } from '../services/command.service';
import { FileService } from '../services/file.service';

export interface ConvertJobData {
  jobId: string;
  type: 'convert';
  inputPaths: string[];
  outputPath: string;
}

export async function processConvert(
  job: Job<ConvertJobData>,
  commandService: CommandService,
  fileService: FileService,
): Promise<{ outputPath: string }> {
  const { jobId, outputPath } = job.data;

  // Support both inputPaths (array) and legacy inputPath (single)
  const inputPaths: string[] = job.data.inputPaths?.length
    ? job.data.inputPaths
    : [(job.data as any).inputPath].filter(Boolean);

  console.log(`[Convert] job=${jobId} files=${inputPaths.length}`);

  if (!inputPaths.length) throw new Error('No input files provided');

  for (const p of inputPaths) {
    if (!fileService.fileExists(p)) throw new Error(`Input file not found: ${p}`);
  }

  await job.updateProgress(10);

  const finalOutput = outputPath.endsWith('.pdf') ? outputPath : outputPath + '.pdf';

  await commandService.imageToPdf(inputPaths, finalOutput);

  await job.updateProgress(90);

  if (!fileService.fileExists(finalOutput)) throw new Error('Convert produced no output');

  console.log(`[Convert] Done: ${finalOutput}`);
  await job.updateProgress(100);
  return { outputPath: finalOutput };
}