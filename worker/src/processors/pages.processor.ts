import { Job } from 'bullmq';
import { runCommand } from '../utils/exec.util';
import { CommandService } from '../services/command.service';
import { FileService } from '../services/file.service';

export type PagesOperation = 'delete' | 'extract' | 'reorder' | 'organize';

export interface PagesJobData {
  jobId: string;
  type: 'pages';
  operation: PagesOperation;
  inputPath: string;
  outputPath: string;
  pages: number[];
}

function pagesToRange(pages: number[]): string {
  return pages.join(',');
}

async function getTotalPages(inputPath: string): Promise<number> {
  const { stdout } = await runCommand(`qpdf --show-npages "${inputPath}"`);
  const n = parseInt(stdout.trim(), 10);
  if (isNaN(n)) throw new Error(`Could not determine page count for ${inputPath}`);
  return n;
}

export async function processPages(
  job: Job<PagesJobData>,
  _commandService: CommandService,
  fileService: FileService,
): Promise<{ outputPath: string; pageCount: number }> {
  const { jobId, operation, inputPath, outputPath, pages } = job.data;

  console.log(`[Pages/${operation}] Job ${jobId}, pages=[${pages}]`);

  if (!fileService.fileExists(inputPath)) {
    throw new Error(`Input file not found: ${inputPath}`);
  }

  await job.updateProgress(10);

  // DELETE: keep all pages EXCEPT the listed ones
  if (operation === 'delete') {
    const total = await getTotalPages(inputPath);
    await job.updateProgress(25);

    const deleteSet = new Set(pages);
    const keepPages = Array.from({ length: total }, (_, i) => i + 1)
      .filter((p) => !deleteSet.has(p));

    if (keepPages.length === 0) {
      throw new Error('Cannot delete all pages from a PDF.');
    }

    const cmd = `qpdf "${inputPath}" --pages . ${pagesToRange(keepPages)} -- "${outputPath}"`;
    await runCommand(cmd);
    await job.updateProgress(90);

    if (!fileService.fileExists(outputPath)) throw new Error('Delete pages produced no output');
    console.log(`[Pages/delete] Done: kept ${keepPages.length}/${total} pages`);
    await job.updateProgress(100);
    return { outputPath, pageCount: keepPages.length };
  }

  // EXTRACT: keep ONLY the listed pages
  if (operation === 'extract') {
    if (pages.length === 0) throw new Error('No pages specified for extraction.');

    const sorted = [...pages].sort((a, b) => a - b);
    const cmd = `qpdf "${inputPath}" --pages . ${pagesToRange(sorted)} -- "${outputPath}"`;
    await runCommand(cmd);
    await job.updateProgress(90);

    if (!fileService.fileExists(outputPath)) throw new Error('Extract pages produced no output');
    console.log(`[Pages/extract] Done: ${sorted.length} pages extracted`);
    await job.updateProgress(100);
    return { outputPath, pageCount: sorted.length };
  }

  // REORDER / ORGANIZE: output pages in the specified order
  if (operation === 'reorder' || operation === 'organize') {
    if (pages.length === 0) throw new Error('No page order specified.');

    const cmd = `qpdf "${inputPath}" --pages . ${pagesToRange(pages)} -- "${outputPath}"`;
    await runCommand(cmd);
    await job.updateProgress(90);

    if (!fileService.fileExists(outputPath)) throw new Error('Reorder pages produced no output');
    console.log(`[Pages/${operation}] Done: ${pages.length} pages`);
    await job.updateProgress(100);
    return { outputPath, pageCount: pages.length };
  }

  throw new Error(`Unknown pages operation: ${operation}`);
}
