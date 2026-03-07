import { Job } from 'bullmq';
import { CommandService } from '../services/command.service';
import { FileService } from '../services/file.service';

export interface MergeJobData {
  jobId: string;
  type: 'merge';
  inputPaths: string[];
  outputPath: string;
}

export async function processMerge(
  job: Job<MergeJobData>,
  commandService: CommandService,
  fileService: FileService,
): Promise<{ outputPath: string }> {
  const { jobId, inputPaths, outputPath } = job.data;

  console.log(`[Merge] Processing job ${jobId} with ${inputPaths.length} files`);

  // Validate all input files exist
  for (const inputPath of inputPaths) {
    if (!fileService.fileExists(inputPath)) {
      throw new Error(`Input file not found: ${inputPath}`);
    }
  }

  await job.updateProgress(10);

  await commandService.mergePdfs({ inputPaths, outputPath });

  await job.updateProgress(90);

  if (!fileService.fileExists(outputPath)) {
    throw new Error(`Merge produced no output at ${outputPath}`);
  }

  const size = fileService.getFileSize(outputPath);
  console.log(`[Merge] Done: ${outputPath} (${size} bytes)`);

  await job.updateProgress(100);
  return { outputPath };
}
