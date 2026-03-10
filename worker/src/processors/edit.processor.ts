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






// import * as fs from 'fs';
// import * as path from 'path';
// import { exec } from 'child_process';
// import { promisify } from 'util';

// const execAsync = promisify(exec);

// async function run(cmd: string, timeoutMs = 120_000): Promise<{ stdout: string; stderr: string }> {
//   try {
//     return await execAsync(cmd, { timeout: timeoutMs });
//   } catch (err: any) {
//     if (err.code === 3) return { stdout: err.stdout || '', stderr: err.stderr || '' };
//     throw new Error((err.stderr || err.stdout || err.message || 'Command failed').trim());
//   }
// }

// /* ─────────────────────────────────────────────────────────────────────────────
//    applyPdfEdits()
//    Uses MuPDF (mutool run) to insert text annotations into a PDF.
//    Falls back to pdf-lib if mutool is unavailable.
// ───────────────────────────────────────────────────────────────────────────── */

// export interface PdfEditInstruction {
//   type: 'text' | 'annotation' | 'rotate';
//   page: number;       // 1-indexed
//   x: number;          // PDF units (0–595)
//   y: number;          // PDF units (0–842)
//   content: string;
//   fontSize?: number;
//   color?: string;     // hex e.g. "#ff0000"
// }

// function hexToRgbFloat(hex: string): [number, number, number] {
//   const h = hex.replace('#', '');
//   return [
//     parseInt(h.slice(0, 2), 16) / 255,
//     parseInt(h.slice(2, 4), 16) / 255,
//     parseInt(h.slice(4, 6), 16) / 255,
//   ];
// }

// export async function applyPdfEdits(
//   inputPath: string,
//   outputPath: string,
//   instructions: PdfEditInstruction[],
// ): Promise<void> {
//   const workDir = outputPath + '_edit_work';
//   fs.mkdirSync(workDir, { recursive: true });

//   try {
//     // Build MuPDF JavaScript for mutool run
//     const jsLines: string[] = [`var doc = Document.openDocument(${JSON.stringify(inputPath)});`];

//     for (const ins of instructions) {
//       if (!ins.content?.trim()) continue;
//       const pageIdx = (ins.page || 1) - 1;
//       const fs_ = ins.fontSize || 12;
//       const [r, g, b] = hexToRgbFloat(ins.color || '#000000');
//       const txt = ins.content.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

//       jsLines.push(`
// (function() {
//   var page = doc.loadPage(${pageIdx});
//   var annot = page.createAnnotation("FreeText");
//   annot.setRect([${ins.x}, ${ins.y - fs_}, ${ins.x + txt.length * fs_ * 0.6 + 8}, ${ins.y + 4}]);
//   annot.setContents("${txt}");
//   annot.setDefaultAppearance("Helv ${fs_} Tf ${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg");
//   annot.update();
// })();`);
//     }

//     jsLines.push(`doc.save(${JSON.stringify(outputPath)}, "incremental");`);
//     jsLines.push(`print("done");`);

//     const jsFile = path.join(workDir, 'edit.js');
//     fs.writeFileSync(jsFile, jsLines.join('\n'));

//     try {
//       await run(`mutool run "${jsFile}"`);
//       if (!fs.existsSync(outputPath)) throw new Error('mutool produced no output');
//       return;
//     } catch (mutoolErr: any) {
//       console.warn(`[applyPdfEdits] mutool failed (${mutoolErr.message}), falling back to pdf-lib`);
//     }

//     // ── Fallback: pdf-lib ──
//     const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');
//     const pdfBytes = fs.readFileSync(inputPath);
//     const pdfDoc = await PDFDocument.load(pdfBytes);
//     const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
//     const pages = pdfDoc.getPages();

//     for (const ins of instructions) {
//       if (!ins.content?.trim()) continue;
//       const pageIdx = (ins.page || 1) - 1;
//       if (pageIdx < 0 || pageIdx >= pages.length) continue;
//       const page = pages[pageIdx];
//       const { width, height } = page.getSize();
//       const [r, g, b] = hexToRgbFloat(ins.color || '#000000');
//       page.drawText(ins.content, {
//         x: (ins.x / 595) * width,
//         y: (ins.y / 842) * height,
//         size: ins.fontSize || 12,
//         font,
//         color: rgb(r, g, b),
//       });
//     }

//     fs.writeFileSync(outputPath, await pdfDoc.save());

//   } finally {
//     try { fs.rmSync(workDir, { recursive: true, force: true }); } catch {}
//   }
// }

// /* ─────────────────────────────────────────────────────────────────────────────
//    convertPdfToDocx()
//    Step 1: PDF → HTML  using MuPDF  (mutool convert -o output.html input.pdf)
//    Step 2: HTML → DOCX using LibreOffice  (soffice --convert-to docx)
// ───────────────────────────────────────────────────────────────────────────── */

// export async function convertPdfToDocx(
//   inputPath: string,
//   outputPath: string,
// ): Promise<string> {
//   const workDir = outputPath + '_docx_work';
//   fs.mkdirSync(workDir, { recursive: true });

//   try {
//     // Step 1 — PDF → HTML via MuPDF
//     const htmlOut = path.join(workDir, 'output.html');
//     console.log('[convertPdfToDocx] Step 1: mutool convert PDF → HTML');
//     try {
//       await run(`mutool convert -o "${htmlOut}" "${inputPath}"`);
//     } catch (e: any) {
//       // mutool may produce numbered files like output001.html
//       console.warn(`[convertPdfToDocx] mutool direct failed: ${e.message}, trying wildcard`);
//     }

//     // Find any HTML file mutool produced
//     let htmlFile = fs.readdirSync(workDir).find(f => f.endsWith('.html'));
//     if (!htmlFile) {
//       // Last resort: try LibreOffice direct PDF→DOCX (writer_pdf_import)
//       console.warn('[convertPdfToDocx] No HTML from mutool, falling back to LibreOffice direct');
//       await run(`soffice --headless --infilter="writer_pdf_import" --convert-to docx --outdir "${workDir}" "${inputPath}"`);
//       const docxFallback = fs.readdirSync(workDir).find(f => f.endsWith('.docx'));
//       if (!docxFallback) throw new Error('All PDF→DOCX conversion methods failed');
//       const finalPath = outputPath + '.docx';
//       fs.copyFileSync(path.join(workDir, docxFallback), finalPath);
//       return finalPath;
//     }

//     // Step 2 — HTML → DOCX via LibreOffice
//     const htmlFullPath = path.join(workDir, htmlFile);
//     console.log(`[convertPdfToDocx] Step 2: LibreOffice HTML → DOCX (${htmlFile})`);
//     await run(`soffice --headless --convert-to docx --outdir "${workDir}" "${htmlFullPath}"`);

//     const docxFile = fs.readdirSync(workDir).find(f => f.endsWith('.docx'));
//     if (!docxFile) throw new Error('LibreOffice produced no DOCX output');

//     const finalPath = outputPath + '.docx';
//     fs.copyFileSync(path.join(workDir, docxFile), finalPath);
//     console.log(`[convertPdfToDocx] Done: ${finalPath}`);
//     return finalPath;

//   } finally {
//     try { fs.rmSync(workDir, { recursive: true, force: true }); } catch {}
//   }
// }

// /* ─────────────────────────────────────────────────────────────────────────────
//    performOcr()
//    Step 1: PDF pages → PNG images using ImageMagick (convert -density 300)
//    Step 2: Each image → text using Tesseract OCR
//    Returns path to combined .txt file
// ───────────────────────────────────────────────────────────────────────────── */

// export async function performOcr(
//   inputPath: string,
//   outputPath: string,
//   language = 'eng',
// ): Promise<string> {
//   const workDir = outputPath + '_ocr_work';
//   fs.mkdirSync(workDir, { recursive: true });

//   try {
//     // Step 1 — PDF → images via ImageMagick
//     console.log('[performOcr] Step 1: ImageMagick PDF → PNG pages');
//     const imgPattern = path.join(workDir, 'page-%04d.png');
//     await run(`convert -density 300 -quality 100 "${inputPath}" "${imgPattern}"`);

//     const images = fs.readdirSync(workDir)
//       .filter(f => f.match(/^page-\d+\.png$/))
//       .sort()
//       .map(f => path.join(workDir, f));

//     if (images.length === 0) throw new Error('ImageMagick produced no page images — is it installed?');
//     console.log(`[performOcr] Got ${images.length} page image(s)`);

//     // Step 2 — Tesseract OCR each page
//     const textParts: string[] = [];
//     for (let i = 0; i < images.length; i++) {
//       const imgPath = images[i];
//       const outBase = path.join(workDir, `ocr-${i}`);
//       console.log(`[performOcr] OCR page ${i + 1}/${images.length}`);
//       await run(`tesseract "${imgPath}" "${outBase}" -l ${language} txt`);
//       const txtFile = outBase + '.txt';
//       if (fs.existsSync(txtFile)) {
//         const text = fs.readFileSync(txtFile, 'utf8').trim();
//         if (text) textParts.push(`--- Page ${i + 1} ---\n${text}`);
//       }
//     }

//     if (textParts.length === 0) throw new Error('Tesseract produced no text output');

//     const finalPath = outputPath + '.txt';
//     fs.writeFileSync(finalPath, textParts.join('\n\n'), 'utf8');
//     console.log(`[performOcr] Done: ${finalPath} (${textParts.length} pages)`);
//     return finalPath;

//   } finally {
//     try { fs.rmSync(workDir, { recursive: true, force: true }); } catch {}
//   }
// }



// import * as fs from 'fs';
// import * as path from 'path';
// import { exec } from 'child_process';
// import { promisify } from 'util';

// const execAsync = promisify(exec);

// async function run(cmd: string, timeoutMs = 120_000): Promise<{ stdout: string; stderr: string }> {
//   try {
//     return await execAsync(cmd, { timeout: timeoutMs });
//   } catch (err: any) {
//     if (err.code === 3) return { stdout: err.stdout || '', stderr: err.stderr || '' };
//     throw new Error((err.stderr || err.stdout || err.message || 'Command failed').trim());
//   }
// }

// export interface PdfEditInstruction {
//   type: 'text' | 'annotation' | 'rotate';
//   page: number;        // 1-indexed
//   x: number;           // PDF units, left-origin,   0–595 reference
//   y: number;           // PDF units, bottom-origin, 0–842 reference
//   content: string;
//   fontSize?: number;
//   color?: string;      // hex "#rrggbb"
//   originalText?: string;
// }

// function hexToRgb(hex: string): [number, number, number] {
//   const h = (hex || '#000000').replace('#', '').padEnd(6, '0');
//   return [
//     parseInt(h.slice(0, 2), 16) / 255,
//     parseInt(h.slice(2, 4), 16) / 255,
//     parseInt(h.slice(4, 6), 16) / 255,
//   ];
// }

// export async function applyPdfEdits(
//   inputPath: string,
//   outputPath: string,
//   instructions: PdfEditInstruction[],
// ): Promise<void> {
//   const workDir = outputPath + '_edit_work';
//   fs.mkdirSync(workDir, { recursive: true });

//   try {
//     // Build MuPDF JS script
//     // Strategy:
//     //   1. For each instruction, search for originalText on the page
//     //      If found → use exact bbox from search result
//     //      If not found → use x,y coords from frontend
//     //   2. Create a "Redact" annotation over the original text bbox (erases it)
//     //   3. Apply all redactions (permanently removes original text)
//     //   4. Create a "FreeText" annotation with the new text at same position
//     //   5. Save

//     const jsLines: string[] = [];

//     jsLines.push(`var doc = new PDFDocument(${JSON.stringify(inputPath)});`);

//     // Group by page (1-indexed)
//     const byPage = new Map<number, PdfEditInstruction[]>();
//     for (const ins of instructions) {
//       if (!ins.content?.trim()) continue;
//       if (!byPage.has(ins.page)) byPage.set(ins.page, []);
//       byPage.get(ins.page)!.push(ins);
//     }

//     for (const [pageNum, pageInstructions] of byPage) {
//       jsLines.push(`
// (function() {
//   var page = doc.loadPage(${pageNum - 1});
//   var pageBounds = page.bound();
//   var pageW = pageBounds[2] - pageBounds[0];
//   var pageH = pageBounds[3] - pageBounds[1];`);

//       for (const ins of pageInstructions) {
//         const fontSize = ins.fontSize || 12;
//         const [r, g, b] = hexToRgb(ins.color || '#000000');
//         const originalText = (ins.originalText || ins.content)
//           .replace(/\\/g, '\\\\').replace(/"/g, '\\"');
//         const newText = ins.content
//           .replace(/\\/g, '\\\\').replace(/"/g, '\\"');

//         // Scale ref coords (0-595, 0-842) to actual page size
//         // pdfY is bottom-origin — convert to MuPDF top-origin
//         jsLines.push(`
//   (function() {
//     var scaleX = pageW / 595;
//     var scaleY = pageH / 842;
//     var refX = ${ins.x};
//     var refY = ${ins.y};
//     var fs = ${fontSize};

//     // Scale to actual page coords
//     var px = refX * scaleX;
//     // MuPDF uses top-left origin, input y is bottom-origin → flip
//     var py = pageH - (refY * scaleY);

//     // Estimate text width for bbox
//     var approxW = "${originalText}".length * fs * 0.62 * scaleX + fs * scaleX;
//     var approxH = fs * 1.4 * scaleY;

//     // Try to find exact bbox via search
//     var searchStr = "${originalText}";
//     var bbox = null;
//     if (searchStr.trim()) {
//       try {
//         var hits = page.search(searchStr);
//         if (hits && hits.length > 0) {
//           // hits is array of quads [x0,y0,x1,y1,x2,y2,x3,y3]
//           // take first hit — it's the closest match
//           var q = hits[0];
//           // quad coords: ul, ur, ll, lr
//           var x0 = Math.min(q[0], q[2], q[4], q[6]);
//           var y0 = Math.min(q[1], q[3], q[5], q[7]);
//           var x1 = Math.max(q[0], q[2], q[4], q[6]);
//           var y1 = Math.max(q[1], q[3], q[5], q[7]);
//           bbox = [x0 - 1, y0 - 1, x1 + 1, y1 + 1];
//           print("[edit] p${pageNum} found '" + searchStr.slice(0,20) + "' at " + JSON.stringify(bbox));
//         }
//       } catch(e) {
//         print("[edit] search error: " + e);
//       }
//     }

//     // Fall back to coordinate-based bbox
//     if (!bbox) {
//       bbox = [px - 1, py - approxH, px + approxW, py + fs * 0.3 * scaleY];
//       print("[edit] p${pageNum} using coords bbox: " + JSON.stringify(bbox));
//     }

//     // Step 1: Redact annotation erases original text
//     var redact = page.createAnnotation("Redact");
//     redact.setRect(bbox);
//     redact.update();

//     // Step 2: FreeText annotation draws new text
//     // Position: use search bbox x, or fallback px
//     var textX = bbox[0] + 1;
//     var textY = bbox[0] ? bbox[1] : py - approxH;
//     var textRect = [textX, bbox[1], textX + approxW + fs * scaleX * 2, bbox[3]];

//     var freeText = page.createAnnotation("FreeText");
//     freeText.setRect(textRect);
//     freeText.setContents("${newText}");
//     freeText.setDefaultAppearance("Helv " + (fs * Math.min(scaleX, scaleY)).toFixed(1) + " Tf " + ${r.toFixed(4)} + " " + ${g.toFixed(4)} + " " + ${b.toFixed(4)} + " rg");
//     freeText.update();
//   })();`);
//       }

//       jsLines.push(`
//   // Apply all redactions on this page — permanently removes original text
//   page.applyRedactions();
// })();`);
//     }

//     jsLines.push(`doc.save(${JSON.stringify(outputPath)}, "incremental");`);
//     jsLines.push(`print("[edit] saved: " + ${JSON.stringify(outputPath)});`);

//     const jsFile = path.join(workDir, 'edit.js');
//     fs.writeFileSync(jsFile, jsLines.join('\n'));

//     console.log(`[applyPdfEdits] Running mutool script: ${jsFile}`);
//     const result = await run(`mutool run "${jsFile}"`);
//     if (result.stdout) console.log(result.stdout);
//     if (result.stderr) console.warn(result.stderr);

//     if (!fs.existsSync(outputPath)) {
//       throw new Error('mutool produced no output file');
//     }

//     console.log(`[applyPdfEdits] Done → ${outputPath}`);

//   } finally {
//     try { fs.rmSync(workDir, { recursive: true, force: true }); } catch {}
//   }
// }

// /* ─────────────────────────────────────────────────────────────────────────────
//    processEdit() — BullMQ job entry point
// ───────────────────────────────────────────────────────────────────────────── */
// import { Job } from 'bullmq';
// import { FileService } from '../services/file.service';

// export interface EditJobData {
//   jobId: string;
//   type: 'edit';
//   inputPath: string;
//   outputPath: string;
//   instructions: PdfEditInstruction[];
// }

// export async function processEdit(
//   job: Job<EditJobData>,
//   fileService: FileService,
// ): Promise<{ outputPath: string }> {
//   const { jobId, inputPath, outputPath, instructions } = job.data;
//   console.log(`[Edit] job=${jobId} instructions=${instructions?.length ?? 0}`);
//   if (!fileService.fileExists(inputPath)) throw new Error(`Input not found: ${inputPath}`);
//   await job.updateProgress(10);
//   await applyPdfEdits(inputPath, outputPath, instructions || []);
//   await job.updateProgress(100);
//   return { outputPath };
// }

// /* ─────────────────────────────────────────────────────────────────────────────
//    convertPdfToDocx()
// ───────────────────────────────────────────────────────────────────────────── */
// export async function convertPdfToDocx(inputPath: string, outputPath: string): Promise<string> {
//   const workDir = outputPath + '_docx_work';
//   fs.mkdirSync(workDir, { recursive: true });
//   try {
//     try { await run(`mutool convert -o "${path.join(workDir, 'output.html')}" "${inputPath}"`); } catch {}
//     let htmlFile = fs.readdirSync(workDir).find(f => f.endsWith('.html'));
//     if (!htmlFile) {
//       await run(`soffice --headless --infilter="writer_pdf_import" --convert-to docx --outdir "${workDir}" "${inputPath}"`);
//       const fb = fs.readdirSync(workDir).find(f => f.endsWith('.docx'));
//       if (!fb) throw new Error('All PDF→DOCX methods failed');
//       const out = outputPath + '.docx'; fs.copyFileSync(path.join(workDir, fb), out); return out;
//     }
//     await run(`soffice --headless --convert-to docx --outdir "${workDir}" "${path.join(workDir, htmlFile)}"`);
//     const docxFile = fs.readdirSync(workDir).find(f => f.endsWith('.docx'));
//     if (!docxFile) throw new Error('LibreOffice produced no DOCX');
//     const out = outputPath + '.docx'; fs.copyFileSync(path.join(workDir, docxFile), out); return out;
//   } finally { try { fs.rmSync(workDir, { recursive: true, force: true }); } catch {} }
// }

// /* ─────────────────────────────────────────────────────────────────────────────
//    performOcr()
// ───────────────────────────────────────────────────────────────────────────── */
// export async function performOcr(inputPath: string, outputPath: string, language = 'eng'): Promise<string> {
//   const workDir = outputPath + '_ocr_work';
//   fs.mkdirSync(workDir, { recursive: true });
//   try {
//     await run(`convert -density 300 -quality 100 "${inputPath}" "${path.join(workDir, 'page-%04d.png')}"`);
//     const images = fs.readdirSync(workDir).filter(f => f.match(/^page-\d+\.png$/)).sort().map(f => path.join(workDir, f));
//     if (!images.length) throw new Error('ImageMagick produced no images');
//     const textParts: string[] = [];
//     for (let i = 0; i < images.length; i++) {
//       const outBase = path.join(workDir, `ocr-${i}`);
//       await run(`tesseract "${images[i]}" "${outBase}" -l ${language} txt`);
//       const txt = outBase + '.txt';
//       if (fs.existsSync(txt)) { const t = fs.readFileSync(txt, 'utf8').trim(); if (t) textParts.push(`--- Page ${i + 1} ---\n${t}`); }
//     }
//     if (!textParts.length) throw new Error('Tesseract produced no output');
//     const out = outputPath + '.txt'; fs.writeFileSync(out, textParts.join('\n\n'), 'utf8'); return out;
//   } finally { try { fs.rmSync(workDir, { recursive: true, force: true }); } catch {} }
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

export interface PdfEditInstruction {
  type: 'text' | 'annotation' | 'rotate';
  page: number;       // 1-indexed
  x: number;          // 0–595 reference, left-origin
  y: number;          // 0–842 reference, bottom-origin (flipped by frontend)
  content: string;
  fontSize?: number;
  color?: string;     // hex "#rrggbb"
  originalText?: string;
}

function hexToRgbArray(hex: string): [number, number, number] {
  const h = (hex || '#000000').replace('#', '').padEnd(6, '0');
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
    // ── Build MuPDF JS script ────────────────────────────────────────────
    // Tested working approach:
    //   1. page.search(originalText) → exact bbox quad
    //   2. createAnnotation("Redact") → permanently removes original text
    //   3. page.applyRedactions()
    //   4. createAnnotation("FreeText") with setDefaultAppearance(font, size, [r,g,b])
    //   5. doc.save()

    const lines: string[] = [];
    lines.push(`var doc = new PDFDocument(${JSON.stringify(inputPath)});`);

    // Group by page
    const byPage = new Map<number, PdfEditInstruction[]>();
    for (const ins of instructions) {
      if (!ins.content?.trim()) continue;
      if (!byPage.has(ins.page)) byPage.set(ins.page, []);
      byPage.get(ins.page)!.push(ins);
    }

    for (const [pageNum, pageInstructions] of byPage) {
      lines.push(`(function() {`);
      lines.push(`  var page = doc.loadPage(${pageNum - 1});`);
      lines.push(`  var b = page.bound();`);
      lines.push(`  var pageW = b[2] - b[0];`);
      lines.push(`  var pageH = b[3] - b[1];`);

      for (const ins of pageInstructions) {
        const fontSize = ins.fontSize || 12;
        const [r, g, bVal] = hexToRgbArray(ins.color || '#000000');

        // Escape strings for JS embedding
        const searchText = (ins.originalText || ins.content)
          .replace(/\\/g, '\\\\').replace(/"/g, '\\"');
        const newText = ins.content
          .replace(/\\/g, '\\\\').replace(/"/g, '\\"');

        // Scale font size from 595×842 reference to actual page
        const scaledFsExpr = `(${fontSize} * Math.min(pageW/595, pageH/842))`;

        lines.push(`  (function() {`);
        lines.push(`    var fs = ${scaledFsExpr};`);
        lines.push(`    var scaleX = pageW / 595;`);
        lines.push(`    var scaleY = pageH / 842;`);

        // Fallback coords: pdfY is bottom-origin → flip to MuPDF top-origin
        lines.push(`    var fbX = ${ins.x} * scaleX;`);
        lines.push(`    var fbY = pageH - (${ins.y} * scaleY) - fs;`);
        lines.push(`    var fbW = "${searchText}".length * fs * 0.65 + fs;`);
        lines.push(`    var fbH = fs * 1.4;`);
        lines.push(`    var bbox = [fbX, fbY, fbX + fbW, fbY + fbH];`);

        // Search for exact position
        lines.push(`    try {`);
        lines.push(`      var hits = page.search("${searchText}");`);
        lines.push(`      if (hits && hits.length > 0) {`);
        lines.push(`        var q = hits[0];`);
        lines.push(`        var x0 = Math.min(q[0],q[2],q[4],q[6]);`);
        lines.push(`        var y0 = Math.min(q[1],q[3],q[5],q[7]);`);
        lines.push(`        var x1 = Math.max(q[0],q[2],q[4],q[6]);`);
        lines.push(`        var y1 = Math.max(q[1],q[3],q[5],q[7]);`);
        lines.push(`        bbox = [x0 - 1, y0 - 1, x1 + 1, y1 + 1];`);
        lines.push(`        print("[edit] p${pageNum} found: " + JSON.stringify(bbox));`);
        lines.push(`      } else {`);
        lines.push(`        print("[edit] p${pageNum} not found, using coords: " + JSON.stringify(bbox));`);
        lines.push(`      }`);
        lines.push(`    } catch(e) {`);
        lines.push(`      print("[edit] search error: " + e + ", using coords");`);
        lines.push(`    }`);

        // Redact original text
        lines.push(`    var redact = page.createAnnotation("Redact");`);
        lines.push(`    redact.setRect(bbox);`);
        lines.push(`    redact.update();`);

        // FreeText replacement — use tested 3-arg setDefaultAppearance
        lines.push(`    var newW = "${newText}".length * fs * 0.65 + fs;`);
        lines.push(`    var ft = page.createAnnotation("FreeText");`);
        lines.push(`    ft.setRect([bbox[0], bbox[1], bbox[0] + newW, bbox[3]]);`);
        lines.push(`    ft.setContents("${newText}");`);
        lines.push(`    ft.setDefaultAppearance("Helvetica", fs, [${r.toFixed(4)}, ${g.toFixed(4)}, ${bVal.toFixed(4)}]);`);
        lines.push(`    ft.update();`);
        lines.push(`  })();`);
      }

      // Apply all redactions for this page after all annotations added
      lines.push(`  page.applyRedactions();`);
      lines.push(`})();`);
    }

    lines.push(`doc.save(${JSON.stringify(outputPath)}, "incremental");`);
    lines.push(`print("[edit] saved: ${outputPath}");`);

    const jsFile = path.join(workDir, 'edit.js');
    fs.writeFileSync(jsFile, lines.join('\n'));

    console.log(`[applyPdfEdits] Running mutool run "${jsFile}"`);
    const result = await run(`mutool run "${jsFile}"`);
    if (result.stdout) console.log(result.stdout);
    if (result.stderr) console.warn(result.stderr);

    if (!fs.existsSync(outputPath)) {
      throw new Error('mutool produced no output file');
    }

  } finally {
    try { fs.rmSync(workDir, { recursive: true, force: true }); } catch {}
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   processEdit() — BullMQ job entry point
───────────────────────────────────────────────────────────────────────────── */
import { Job } from 'bullmq';
import { FileService } from '../services/file.service';

export interface EditJobData {
  jobId: string;
  type: 'edit';
  inputPath: string;
  outputPath: string;
  instructions: PdfEditInstruction[];
}

export async function processEdit(
  job: Job<EditJobData>,
  fileService: FileService,
): Promise<{ outputPath: string }> {
  const { jobId, inputPath, outputPath, instructions } = job.data;
  console.log(`[Edit] job=${jobId} instructions=${instructions?.length ?? 0}`);
  if (!fileService.fileExists(inputPath)) throw new Error(`Input not found: ${inputPath}`);
  await job.updateProgress(10);
  await applyPdfEdits(inputPath, outputPath, instructions || []);
  await job.updateProgress(100);
  return { outputPath };
}

/* ─────────────────────────────────────────────────────────────────────────────
   convertPdfToDocx()
───────────────────────────────────────────────────────────────────────────── */
export async function convertPdfToDocx(inputPath: string, outputPath: string): Promise<string> {
  const workDir = outputPath + '_docx_work';
  fs.mkdirSync(workDir, { recursive: true });
  try {
    try { await run(`mutool convert -o "${path.join(workDir, 'output.html')}" "${inputPath}"`); } catch {}
    let htmlFile = fs.readdirSync(workDir).find(f => f.endsWith('.html'));
    if (!htmlFile) {
      await run(`soffice --headless --infilter="writer_pdf_import" --convert-to docx --outdir "${workDir}" "${inputPath}"`);
      const fb = fs.readdirSync(workDir).find(f => f.endsWith('.docx'));
      if (!fb) throw new Error('All PDF→DOCX methods failed');
      const out = outputPath + '.docx';
      fs.copyFileSync(path.join(workDir, fb), out);
      return out;
    }
    await run(`soffice --headless --convert-to docx --outdir "${workDir}" "${path.join(workDir, htmlFile)}"`);
    const docxFile = fs.readdirSync(workDir).find(f => f.endsWith('.docx'));
    if (!docxFile) throw new Error('LibreOffice produced no DOCX');
    const out = outputPath + '.docx';
    fs.copyFileSync(path.join(workDir, docxFile), out);
    return out;
  } finally { try { fs.rmSync(workDir, { recursive: true, force: true }); } catch {} }
}

/* ─────────────────────────────────────────────────────────────────────────────
   performOcr()
───────────────────────────────────────────────────────────────────────────── */
export async function performOcr(inputPath: string, outputPath: string, language = 'eng'): Promise<string> {
  const workDir = outputPath + '_ocr_work';
  fs.mkdirSync(workDir, { recursive: true });
  try {
    await run(`convert -density 300 -quality 100 "${inputPath}" "${path.join(workDir, 'page-%04d.png')}"`);
    const images = fs.readdirSync(workDir)
      .filter(f => f.match(/^page-\d+\.png$/)).sort()
      .map(f => path.join(workDir, f));
    if (!images.length) throw new Error('ImageMagick produced no images');
    const textParts: string[] = [];
    for (let i = 0; i < images.length; i++) {
      const outBase = path.join(workDir, `ocr-${i}`);
      await run(`tesseract "${images[i]}" "${outBase}" -l ${language} txt`);
      const txt = outBase + '.txt';
      if (fs.existsSync(txt)) {
        const t = fs.readFileSync(txt, 'utf8').trim();
        if (t) textParts.push(`--- Page ${i + 1} ---\n${t}`);
      }
    }
    if (!textParts.length) throw new Error('Tesseract produced no output');
    const out = outputPath + '.txt';
    fs.writeFileSync(out, textParts.join('\n\n'), 'utf8');
    return out;
  } finally { try { fs.rmSync(workDir, { recursive: true, force: true }); } catch {} }
}