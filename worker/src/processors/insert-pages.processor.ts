import { Job } from 'bullmq';
import { CommandService } from '../services/command.service';
import { FileService } from '../services/file.service';

export interface InsertPagesJobData {
  jobId: string;
  type: 'insert-pages';
  basePath: string;       // original PDF
  insertPath: string;     // PDF to insert
  outputPath: string;
  afterPage: number;      // 0 = prepend before page 1
}

export async function processInsertPages(
  job: Job<InsertPagesJobData>,
  commandService: CommandService,
  fileService: FileService,
): Promise<{ outputPath: string }> {
  const { jobId, basePath, insertPath, outputPath, afterPage } = job.data;
  console.log(`[InsertPages] job=${jobId} afterPage=${afterPage}`);

  if (!fileService.fileExists(basePath)) throw new Error(`Base PDF not found: ${basePath}`);
  if (!fileService.fileExists(insertPath)) throw new Error(`Insert PDF not found: ${insertPath}`);
  await job.updateProgress(10);

  const finalOutput = outputPath + '.pdf';
  await commandService.insertPages({ basePath, insertPath, outputPath: finalOutput, afterPage });
  await job.updateProgress(90);

  if (!fileService.fileExists(finalOutput)) throw new Error('Insert pages produced no output');
  await job.updateProgress(100);
  console.log(`[InsertPages] Done: ${finalOutput}`);
  return { outputPath: finalOutput };
}
