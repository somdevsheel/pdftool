import { Job } from 'bullmq';
import * as fs from 'fs';
import * as path from 'path';
import * as archiver from 'archiver';
import { CommandService } from '../services/command.service';
import { FileService } from '../services/file.service';

export interface SplitJobData {
  jobId: string;
  type: 'split';
  inputPath: string;
  outputPath: string; // Base path — will become .zip for split-all, .pdf for range
  pages?: string;     // e.g. "1-3,5" — if set, produces a single PDF
}

// Zip all files in a directory into a zip archive
async function zipFiles(files: string[], zipPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver.default('zip', { zlib: { level: 9 } });

    output.on('close', resolve);
    archive.on('error', reject);

    archive.pipe(output);
    for (const file of files) {
      archive.file(file, { name: path.basename(file) });
    }
    archive.finalize();
  });
}

export async function processSplit(
  job: Job<SplitJobData>,
  commandService: CommandService,
  fileService: FileService,
): Promise<{ outputPath: string; pageCount?: number }> {
  const { jobId, inputPath, outputPath, pages } = job.data;

  console.log(`[Split] Processing job ${jobId}, pages="${pages || 'all'}"`);

  if (!fileService.fileExists(inputPath)) {
    throw new Error(`Input file not found: ${inputPath}`);
  }

  await job.updateProgress(10);

  // ─── Case 1: Extract specific page range → single PDF ────────────────────
  if (pages) {
    await commandService.splitPdf({ inputPath, outputPath, pages });
    await job.updateProgress(90);

    if (!fileService.fileExists(outputPath)) {
      throw new Error(`Split produced no output at ${outputPath}`);
    }

    console.log(`[Split] Done (range): ${outputPath}`);
    await job.updateProgress(100);
    return { outputPath, pageCount: 1 };
  }

  // ─── Case 2: Split ALL pages → numbered PDFs → ZIP ───────────────────────

  // qpdf --split-pages writes: <base>-1.pdf, <base>-2.pdf, ...
  // We use outputPath as the pattern base (without .pdf)
  const outputBase = outputPath.replace(/\.pdf$/i, '');
  const splitPattern = `${outputBase}-%d.pdf`;

  await commandService.splitPdf({ inputPath, outputPath, pages: undefined });
  await job.updateProgress(50);

  // Collect all generated page files
  const outputDir = path.dirname(outputPath);
  const baseName  = path.basename(outputBase);
  const allFiles  = fs.readdirSync(outputDir);
  const pageFiles = allFiles
    .filter((f) => f.startsWith(baseName) && f.endsWith('.pdf'))
    .sort((a, b) => {
      // Sort numerically: base-1.pdf, base-2.pdf ... base-10.pdf
      const numA = parseInt(a.replace(baseName + '-', '').replace('.pdf', ''), 10);
      const numB = parseInt(b.replace(baseName + '-', '').replace('.pdf', ''), 10);
      return numA - numB;
    })
    .map((f) => path.join(outputDir, f));

  if (pageFiles.length === 0) {
    throw new Error(`Split produced no page files. Pattern: ${baseName}-*.pdf in ${outputDir}`);
  }

  console.log(`[Split] Found ${pageFiles.length} page files, zipping...`);
  await job.updateProgress(70);

  // Write ZIP alongside the page files
  const zipPath = `${outputBase}.zip`;
  await zipFiles(pageFiles, zipPath);

  await job.updateProgress(90);

  // Clean up individual page PDFs now that they're in the ZIP
  for (const f of pageFiles) {
    try { fs.unlinkSync(f); } catch { /* ignore */ }
  }

  if (!fileService.fileExists(zipPath)) {
    throw new Error(`Failed to create ZIP at ${zipPath}`);
  }

  const zipSize = fileService.getFileSize(zipPath);
  console.log(`[Split] Done: ${zipPath} (${pageFiles.length} pages, ${zipSize} bytes)`);

  await job.updateProgress(100);
  return { outputPath: zipPath, pageCount: pageFiles.length };
}

