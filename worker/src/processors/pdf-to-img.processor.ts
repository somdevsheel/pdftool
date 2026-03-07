import { Job } from 'bullmq';
import * as path from 'path';
import * as fs from 'fs';
import archiver from 'archiver';
import { CommandService } from '../services/command.service';
import { FileService } from '../services/file.service';

export interface PdfToImgJobData {
  jobId: string;
  type: 'pdf-to-img';
  inputPath: string;
  outputPath: string;
  format: 'jpg' | 'png';
  dpi: number;
}

export async function processPdfToImg(
  job: Job<PdfToImgJobData>,
  commandService: CommandService,
  fileService: FileService,
): Promise<{ outputPath: string; singleImage: boolean }> {
  const { jobId, inputPath, outputPath, format = 'jpg', dpi = 150 } = job.data;
  console.log(`[PdfToImg] job=${jobId} format=${format} dpi=${dpi} input=${inputPath}`);

  if (!fileService.fileExists(inputPath)) throw new Error(`Input not found: ${inputPath}`);
  await job.updateProgress(10);

  const tmpDir = outputPath + '_pages';
  fs.mkdirSync(tmpDir, { recursive: true });

  const imageFiles = await commandService.pdfToImages({ inputPath, outputDir: tmpDir, format, dpi });
  await job.updateProgress(60);
  console.log(`[PdfToImg] rendered ${imageFiles.length} page(s):`, imageFiles);

  if (!imageFiles.length) throw new Error('No images rendered from PDF');

  // Single page → return image directly, no ZIP
  if (imageFiles.length === 1) {
    const imgPath = outputPath + '.' + format;
    fs.copyFileSync(imageFiles[0], imgPath);
    fs.rmSync(tmpDir, { recursive: true, force: true });
    await job.updateProgress(100);
    console.log(`[PdfToImg] single page done: ${imgPath} exists=${fs.existsSync(imgPath)}`);
    return { outputPath: imgPath, singleImage: true };
  }

  // Multi-page → ZIP
  const zipPath = outputPath + '.zip';
  await new Promise<void>((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 6 } });
    output.on('close', resolve);
    archive.on('error', reject);
    archive.pipe(output);
    imageFiles.forEach((f, i) =>
      archive.file(f, { name: `page-${String(i + 1).padStart(3, '0')}.${format}` })
    );
    archive.finalize();
  });

  fs.rmSync(tmpDir, { recursive: true, force: true });
  await job.updateProgress(100);
  console.log(`[PdfToImg] ${imageFiles.length} pages zipped: ${zipPath}`);
  return { outputPath: zipPath, singleImage: false };
}
