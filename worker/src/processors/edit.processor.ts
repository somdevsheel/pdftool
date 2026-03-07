// import { Job } from 'bullmq';
// import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
// import * as fs from 'fs';
// import { FileService } from '../services/file.service';

// export interface EditInstruction {
//   type: 'text' | 'annotation' | 'rotate';
//   page: number; // 1-indexed
//   x?: number;
//   y?: number;
//   content?: string;
//   fontSize?: number;
//   color?: string;
//   degrees?: number;
// }

// export interface EditJobData {
//   jobId: string;
//   type: 'edit';
//   inputPath: string;
//   outputPath: string;
//   instructions: EditInstruction[];
// }

// function hexToRgb(hex: string): { r: number; g: number; b: number } {
//   const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
//   return result
//     ? {
//         r: parseInt(result[1], 16) / 255,
//         g: parseInt(result[2], 16) / 255,
//         b: parseInt(result[3], 16) / 255,
//       }
//     : { r: 0, g: 0, b: 0 };
// }

// export async function processEdit(
//   job: Job<EditJobData>,
//   fileService: FileService,
// ): Promise<{ outputPath: string }> {
//   const { jobId, inputPath, outputPath, instructions } = job.data;

//   console.log(`[Edit] Processing job ${jobId} with ${instructions.length} instructions`);

//   if (!fileService.fileExists(inputPath)) {
//     throw new Error(`Input file not found: ${inputPath}`);
//   }

//   await job.updateProgress(10);

//   const pdfBytes = fs.readFileSync(inputPath);
//   const pdfDoc = await PDFDocument.load(pdfBytes);
//   const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
//   const pages = pdfDoc.getPages();

//   await job.updateProgress(30);

//   for (const instruction of instructions) {
//     const pageIndex = (instruction.page || 1) - 1;
//     if (pageIndex < 0 || pageIndex >= pages.length) continue;

//     const page = pages[pageIndex];

//     if (instruction.type === 'text') {
//       const colorHex = instruction.color || '#000000';
//       const { r, g, b } = hexToRgb(colorHex);
//       page.drawText(instruction.content || '', {
//         x: instruction.x || 50,
//         y: instruction.y || 50,
//         size: instruction.fontSize || 12,
//         font,
//         color: rgb(r, g, b),
//       });
//     }

//     if (instruction.type === 'annotation') {
//       const { r, g, b } = hexToRgb(instruction.color || '#FF0000');
//       // Draw a simple rectangle annotation
//       page.drawRectangle({
//         x: instruction.x || 50,
//         y: instruction.y || 50,
//         width: 100,
//         height: 20,
//         borderColor: rgb(r, g, b),
//         borderWidth: 1.5,
//       });
//       if (instruction.content) {
//         page.drawText(instruction.content, {
//           x: (instruction.x || 50) + 4,
//           y: (instruction.y || 50) + 4,
//           size: 10,
//           font,
//           color: rgb(r, g, b),
//         });
//       }
//     }

//     if (instruction.type === 'rotate') {
//       page.setRotation(degrees(instruction.degrees || 90));
//     }
//   }

//   await job.updateProgress(80);

//   const modifiedBytes = await pdfDoc.save();
//   fs.writeFileSync(outputPath, modifiedBytes);

//   await job.updateProgress(100);
//   console.log(`[Edit] Done: ${outputPath}`);
//   return { outputPath };
// }






// import { Job } from 'bullmq';
// import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
// import * as fs from 'fs';
// import * as path from 'path';
// import { runCommand } from '../utils/exec.util';
// import { FileService } from '../services/file.service';

// export interface EditInstruction {
//   type: 'text' | 'annotation' | 'rotate';
//   page: number; // 1-indexed
//   x?: number;
//   y?: number;
//   content?: string;
//   fontSize?: number;
//   color?: string;
//   degrees?: number;
// }

// export interface EditJobData {
//   jobId: string;
//   type: 'edit';
//   inputPath: string;
//   outputPath: string;
//   instructions: EditInstruction[];
// }

// function hexToRgb(hex: string): { r: number; g: number; b: number } {
//   const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
//   return result
//     ? { r: parseInt(result[1], 16) / 255, g: parseInt(result[2], 16) / 255, b: parseInt(result[3], 16) / 255 }
//     : { r: 0, g: 0, b: 0 };
// }

// // Apply edits using pdf-lib (primary method)
// async function applyPdfEdits(
//   inputPath: string,
//   outputPath: string,
//   instructions: EditInstruction[],
// ): Promise<void> {
//   const pdfBytes = fs.readFileSync(inputPath);
//   const pdfDoc = await PDFDocument.load(pdfBytes);
//   const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
//   const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
//   const pages = pdfDoc.getPages();

//   for (const instruction of instructions) {
//     const pageIndex = (instruction.page || 1) - 1;
//     if (pageIndex < 0 || pageIndex >= pages.length) continue;
//     const page = pages[pageIndex];
//     const { width, height } = page.getSize();

//     if (instruction.type === 'text') {
//       const { r, g, b } = hexToRgb(instruction.color || '#000000');
//       const fs_ = instruction.fontSize || 12;
//       // x/y come from frontend in PDF units (0-595 / 0-842 normalized)
//       // scale to actual page size
//       const x = ((instruction.x || 50) / 595) * width;
//       const y = ((instruction.y || 50) / 842) * height;
//       page.drawText(instruction.content || '', {
//         x, y, size: fs_, font, color: rgb(r, g, b),
//       });
//     }

//     if (instruction.type === 'annotation') {
//       const { r, g, b } = hexToRgb(instruction.color || '#FF0000');
//       const x = ((instruction.x || 50) / 595) * width;
//       const y = ((instruction.y || 50) / 842) * height;
//       page.drawRectangle({
//         x, y, width: 120, height: 24,
//         borderColor: rgb(r, g, b), borderWidth: 1.5,
//       });
//       if (instruction.content) {
//         page.drawText(instruction.content, {
//           x: x + 4, y: y + 6, size: 10, font, color: rgb(r, g, b),
//         });
//       }
//     }

//     if (instruction.type === 'rotate') {
//       page.setRotation(degrees(instruction.degrees || 90));
//     }
//   }

//   const modifiedBytes = await pdfDoc.save();
//   fs.writeFileSync(outputPath, modifiedBytes);
// }

// // Apply text edits using MuPDF mutool (fallback for complex PDFs)
// async function applyPdfEditsMuPdf(
//   inputPath: string,
//   outputPath: string,
//   instructions: EditInstruction[],
// ): Promise<void> {
//   const workDir = outputPath + '_mupdf_work';
//   fs.mkdirSync(workDir, { recursive: true });
//   try {
//     // Use mutool to draw/stamp text via a PostScript-like approach
//     // mutool run lets us execute JS against the PDF
//     const textInstructions = instructions.filter(i => i.type === 'text');
//     if (textInstructions.length === 0) {
//       // No text — just copy
//       fs.copyFileSync(inputPath, outputPath);
//       return;
//     }

//     const script = textInstructions.map(ins => {
//       const page = (ins.page || 1) - 1;
//       const x = ins.x || 50;
//       const y = ins.y || 50;
//       const size = ins.fontSize || 12;
//       const text = (ins.content || '').replace(/'/g, "\\'");
//       const color = ins.color || '#000000';
//       const hex = color.replace('#', '');
//       const r = parseInt(hex.slice(0,2), 16) / 255;
//       const g = parseInt(hex.slice(2,4), 16) / 255;
//       const b = parseInt(hex.slice(4,6), 16) / 255;
//       return `
// var page = doc.loadPage(${page});
// var device = new DrawDevice(new Matrix(1,0,0,1,0,0));
// page.run(device, Matrix.identity);
// var annot = page.createAnnotation("FreeText");
// annot.setRect([${x}, ${y}, ${x + text.length * size * 0.6}, ${y + size + 4}]);
// annot.setContents('${text}');
// annot.setDefaultAppearance('Helv ${size} Tf ${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg');
// annot.update();
// `.trim();
//     }).join('\n');

//     const jsFile = path.join(workDir, 'edit.js');
//     const fullScript = `
// var doc = Document.openDocument("${inputPath}");
// ${script}
// doc.save("${outputPath}", "incremental");
// `;
//     fs.writeFileSync(jsFile, fullScript);
//     await runCommand(`mutool run "${jsFile}"`);
//     if (!fs.existsSync(outputPath)) throw new Error('mutool produced no output');
//   } finally {
//     try { fs.rmSync(workDir, { recursive: true, force: true }); } catch {}
//   }
// }

// export async function processEdit(
//   job: Job<EditJobData>,
//   fileService: FileService,
// ): Promise<{ outputPath: string }> {
//   const { jobId, inputPath, outputPath, instructions } = job.data;
//   console.log(`[Edit] job=${jobId} instructions=${instructions.length}`);

//   if (!fileService.fileExists(inputPath)) throw new Error(`Input file not found: ${inputPath}`);
//   await job.updateProgress(10);

//   // Primary: pdf-lib
//   try {
//     await applyPdfEdits(inputPath, outputPath, instructions);
//     await job.updateProgress(100);
//     console.log(`[Edit] Done (pdf-lib): ${outputPath}`);
//     return { outputPath };
//   } catch (e: any) {
//     console.warn(`[Edit] pdf-lib failed (${e.message}), trying MuPDF fallback…`);
//   }

//   await job.updateProgress(50);

//   // Fallback: MuPDF mutool
//   try {
//     await applyPdfEditsMuPdf(inputPath, outputPath, instructions);
//     await job.updateProgress(100);
//     console.log(`[Edit] Done (mutool): ${outputPath}`);
//     return { outputPath };
//   } catch (e: any) {
//     throw new Error(`Edit failed with both pdf-lib and mutool: ${e.message}`);
//   }
// }






import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function run(cmd: string, timeoutMs = 120_000): Promise<{ stdout: string; stderr: string }> {
  try {
    return await execAsync(cmd, { timeout: timeoutMs });
  } catch (err: any) {
    if (err.code === 3) return { stdout: err.stdout || '', stderr: err.stderr || '' };
    throw new Error((err.stderr || err.stdout || err.message || 'Command failed').trim());
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   applyPdfEdits()
   Uses MuPDF (mutool run) to insert text annotations into a PDF.
   Falls back to pdf-lib if mutool is unavailable.
───────────────────────────────────────────────────────────────────────────── */

export interface PdfEditInstruction {
  type: 'text' | 'annotation' | 'rotate';
  page: number;       // 1-indexed
  x: number;          // PDF units (0–595)
  y: number;          // PDF units (0–842)
  content: string;
  fontSize?: number;
  color?: string;     // hex e.g. "#ff0000"
}

function hexToRgbFloat(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
}

export async function applyPdfEdits(
  inputPath: string,
  outputPath: string,
  instructions: PdfEditInstruction[],
): Promise<void> {
  const workDir = outputPath + '_edit_work';
  fs.mkdirSync(workDir, { recursive: true });

  try {
    // Build MuPDF JavaScript for mutool run
    const jsLines: string[] = [`var doc = Document.openDocument(${JSON.stringify(inputPath)});`];

    for (const ins of instructions) {
      if (!ins.content?.trim()) continue;
      const pageIdx = (ins.page || 1) - 1;
      const fs_ = ins.fontSize || 12;
      const [r, g, b] = hexToRgbFloat(ins.color || '#000000');
      const txt = ins.content.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

      jsLines.push(`
(function() {
  var page = doc.loadPage(${pageIdx});
  var annot = page.createAnnotation("FreeText");
  annot.setRect([${ins.x}, ${ins.y - fs_}, ${ins.x + txt.length * fs_ * 0.6 + 8}, ${ins.y + 4}]);
  annot.setContents("${txt}");
  annot.setDefaultAppearance("Helv ${fs_} Tf ${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg");
  annot.update();
})();`);
    }

    jsLines.push(`doc.save(${JSON.stringify(outputPath)}, "incremental");`);
    jsLines.push(`print("done");`);

    const jsFile = path.join(workDir, 'edit.js');
    fs.writeFileSync(jsFile, jsLines.join('\n'));

    try {
      await run(`mutool run "${jsFile}"`);
      if (!fs.existsSync(outputPath)) throw new Error('mutool produced no output');
      return;
    } catch (mutoolErr: any) {
      console.warn(`[applyPdfEdits] mutool failed (${mutoolErr.message}), falling back to pdf-lib`);
    }

    // ── Fallback: pdf-lib ──
    const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');
    const pdfBytes = fs.readFileSync(inputPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfDoc.getPages();

    for (const ins of instructions) {
      if (!ins.content?.trim()) continue;
      const pageIdx = (ins.page || 1) - 1;
      if (pageIdx < 0 || pageIdx >= pages.length) continue;
      const page = pages[pageIdx];
      const { width, height } = page.getSize();
      const [r, g, b] = hexToRgbFloat(ins.color || '#000000');
      page.drawText(ins.content, {
        x: (ins.x / 595) * width,
        y: (ins.y / 842) * height,
        size: ins.fontSize || 12,
        font,
        color: rgb(r, g, b),
      });
    }

    fs.writeFileSync(outputPath, await pdfDoc.save());

  } finally {
    try { fs.rmSync(workDir, { recursive: true, force: true }); } catch {}
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   convertPdfToDocx()
   Step 1: PDF → HTML  using MuPDF  (mutool convert -o output.html input.pdf)
   Step 2: HTML → DOCX using LibreOffice  (soffice --convert-to docx)
───────────────────────────────────────────────────────────────────────────── */

export async function convertPdfToDocx(
  inputPath: string,
  outputPath: string,
): Promise<string> {
  const workDir = outputPath + '_docx_work';
  fs.mkdirSync(workDir, { recursive: true });

  try {
    // Step 1 — PDF → HTML via MuPDF
    const htmlOut = path.join(workDir, 'output.html');
    console.log('[convertPdfToDocx] Step 1: mutool convert PDF → HTML');
    try {
      await run(`mutool convert -o "${htmlOut}" "${inputPath}"`);
    } catch (e: any) {
      // mutool may produce numbered files like output001.html
      console.warn(`[convertPdfToDocx] mutool direct failed: ${e.message}, trying wildcard`);
    }

    // Find any HTML file mutool produced
    let htmlFile = fs.readdirSync(workDir).find(f => f.endsWith('.html'));
    if (!htmlFile) {
      // Last resort: try LibreOffice direct PDF→DOCX (writer_pdf_import)
      console.warn('[convertPdfToDocx] No HTML from mutool, falling back to LibreOffice direct');
      await run(`soffice --headless --infilter="writer_pdf_import" --convert-to docx --outdir "${workDir}" "${inputPath}"`);
      const docxFallback = fs.readdirSync(workDir).find(f => f.endsWith('.docx'));
      if (!docxFallback) throw new Error('All PDF→DOCX conversion methods failed');
      const finalPath = outputPath + '.docx';
      fs.copyFileSync(path.join(workDir, docxFallback), finalPath);
      return finalPath;
    }

    // Step 2 — HTML → DOCX via LibreOffice
    const htmlFullPath = path.join(workDir, htmlFile);
    console.log(`[convertPdfToDocx] Step 2: LibreOffice HTML → DOCX (${htmlFile})`);
    await run(`soffice --headless --convert-to docx --outdir "${workDir}" "${htmlFullPath}"`);

    const docxFile = fs.readdirSync(workDir).find(f => f.endsWith('.docx'));
    if (!docxFile) throw new Error('LibreOffice produced no DOCX output');

    const finalPath = outputPath + '.docx';
    fs.copyFileSync(path.join(workDir, docxFile), finalPath);
    console.log(`[convertPdfToDocx] Done: ${finalPath}`);
    return finalPath;

  } finally {
    try { fs.rmSync(workDir, { recursive: true, force: true }); } catch {}
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   performOcr()
   Step 1: PDF pages → PNG images using ImageMagick (convert -density 300)
   Step 2: Each image → text using Tesseract OCR
   Returns path to combined .txt file
───────────────────────────────────────────────────────────────────────────── */

export async function performOcr(
  inputPath: string,
  outputPath: string,
  language = 'eng',
): Promise<string> {
  const workDir = outputPath + '_ocr_work';
  fs.mkdirSync(workDir, { recursive: true });

  try {
    // Step 1 — PDF → images via ImageMagick
    console.log('[performOcr] Step 1: ImageMagick PDF → PNG pages');
    const imgPattern = path.join(workDir, 'page-%04d.png');
    await run(`convert -density 300 -quality 100 "${inputPath}" "${imgPattern}"`);

    const images = fs.readdirSync(workDir)
      .filter(f => f.match(/^page-\d+\.png$/))
      .sort()
      .map(f => path.join(workDir, f));

    if (images.length === 0) throw new Error('ImageMagick produced no page images — is it installed?');
    console.log(`[performOcr] Got ${images.length} page image(s)`);

    // Step 2 — Tesseract OCR each page
    const textParts: string[] = [];
    for (let i = 0; i < images.length; i++) {
      const imgPath = images[i];
      const outBase = path.join(workDir, `ocr-${i}`);
      console.log(`[performOcr] OCR page ${i + 1}/${images.length}`);
      await run(`tesseract "${imgPath}" "${outBase}" -l ${language} txt`);
      const txtFile = outBase + '.txt';
      if (fs.existsSync(txtFile)) {
        const text = fs.readFileSync(txtFile, 'utf8').trim();
        if (text) textParts.push(`--- Page ${i + 1} ---\n${text}`);
      }
    }

    if (textParts.length === 0) throw new Error('Tesseract produced no text output');

    const finalPath = outputPath + '.txt';
    fs.writeFileSync(finalPath, textParts.join('\n\n'), 'utf8');
    console.log(`[performOcr] Done: ${finalPath} (${textParts.length} pages)`);
    return finalPath;

  } finally {
    try { fs.rmSync(workDir, { recursive: true, force: true }); } catch {}
  }
}