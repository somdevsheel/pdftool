import { Job } from 'bullmq';
import * as fs from 'fs';
import { CommandService } from '../services/command.service';
import { FileService } from '../services/file.service';

export interface PdfToOfficeJobData {
  jobId: string;
  type: 'pdf-to-office';
  inputPath: string;
  outputPath: string;
  format: 'docx' | 'pptx' | 'xlsx';
}

export async function processPdfToOffice(
  job: Job<PdfToOfficeJobData>,
  commandService: CommandService,
  fileService: FileService,
): Promise<{ outputPath: string }> {
  const { jobId, inputPath, outputPath, format } = job.data;
  console.log(`[PdfToOffice] job ${jobId} format=${format}`);

  if (!fileService.fileExists(inputPath)) throw new Error(`Input not found: ${inputPath}`);
  await job.updateProgress(10);

  const tmpDir = outputPath + '_lo';
  fs.mkdirSync(tmpDir, { recursive: true });

  const resultPath = await commandService.pdfToOffice({ inputPath, outputDir: tmpDir, format });
  await job.updateProgress(80);

  const finalPath = outputPath + '.' + format;
  fs.copyFileSync(resultPath, finalPath);
  fs.rmSync(tmpDir, { recursive: true, force: true });

  if (!fileService.fileExists(finalPath)) throw new Error(`PdfToOffice produced no ${format} output`);
  await job.updateProgress(100);
  console.log(`[PdfToOffice] Done: ${finalPath}`);
  return { outputPath: finalPath };
}
