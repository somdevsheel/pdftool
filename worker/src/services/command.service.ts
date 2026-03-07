// import * as path from 'path';
// import * as fs from 'fs';
// import { runCommand, checkToolAvailable } from '../utils/exec.util';

// export interface MergeOptions {
//   inputPaths: string[];
//   outputPath: string;
// }

// export interface SplitOptions {
//   inputPath: string;
//   outputPath: string;
//   pages?: string;
// }

// export interface CompressOptions {
//   inputPath: string;
//   outputPath: string;
//   quality: 'low' | 'medium' | 'high';
// }

// export interface RotateOptions {
//   inputPath: string;
//   outputPath: string;
//   degrees: 90 | 180 | 270;
//   pages?: number[];
// }

// export interface PdfToImgOptions {
//   inputPath: string;
//   outputDir: string;
//   format: 'jpg' | 'png';
//   dpi: number;
// }

// export interface OfficeToPdfOptions {
//   inputPath: string;
//   outputDir: string;
// }

// export interface PdfToOfficeOptions {
//   inputPath: string;
//   outputDir: string;
//   format: 'docx' | 'pptx' | 'xlsx';
// }

// const GS_QUALITY_MAP = {
//   low: '/screen',
//   medium: '/ebook',
//   high: '/printer',
// };

// export class CommandService {
//   // ─── Merge (qpdf) ─────────────────────────────────────────────────────────

//   async mergePdfs(opts: MergeOptions): Promise<void> {
//     const inputs = opts.inputPaths.map((p) => `"${p}"`).join(' ');
//     await runCommand(`qpdf --empty --pages ${inputs} -- "${opts.outputPath}"`);
//   }

//   // ─── Split (qpdf) ─────────────────────────────────────────────────────────

//   async splitPdf(opts: SplitOptions): Promise<void> {
//     if (opts.pages) {
//       await runCommand(`qpdf "${opts.inputPath}" --pages . ${opts.pages} -- "${opts.outputPath}"`);
//     } else {
//       await runCommand(`qpdf "${opts.inputPath}" --split-pages "${opts.outputPath}"`);
//     }
//   }

//   // ─── Compress (Ghostscript) ───────────────────────────────────────────────

//   async compressPdf(opts: CompressOptions): Promise<void> {
//     const setting = GS_QUALITY_MAP[opts.quality];
//     const cmd = [
//       'gs', '-sDEVICE=pdfwrite', '-dCompatibilityLevel=1.4',
//       `-dPDFSETTINGS=${setting}`, '-dNOPAUSE', '-dQUIET', '-dBATCH',
//       `-sOutputFile="${opts.outputPath}"`, `"${opts.inputPath}"`,
//     ].join(' ');
//     await runCommand(cmd);
//   }

//   // ─── Rotate (qpdf) ────────────────────────────────────────────────────────

//   async rotatePdf(opts: RotateOptions): Promise<void> {
//     const pageSpec = opts.pages && opts.pages.length > 0 ? opts.pages.join(',') : '1-z';
//     await runCommand(`qpdf "${opts.inputPath}" --rotate=+${opts.degrees}:${pageSpec} "${opts.outputPath}"`);
//   }

//   // ─── Image → PDF (img2pdf) ────────────────────────────────────────────────

//   async imageToPdf(inputPath: string, outputPath: string): Promise<void> {
//     const candidates = [
//       'img2pdf', '/usr/bin/img2pdf', '/usr/local/bin/img2pdf',
//       `${process.env.HOME}/.local/bin/img2pdf`,
//     ];
//     let lastErr: Error | null = null;
//     for (const bin of candidates) {
//       try { await runCommand(`"${bin}" "${inputPath}" -o "${outputPath}"`); return; }
//       catch (e: any) { lastErr = e; }
//     }
//     try { await runCommand(`python3 -m img2pdf "${inputPath}" -o "${outputPath}"`); return; } catch {}
//     throw new Error(`img2pdf not found. Install: pip3 install img2pdf\nLast error: ${lastErr?.message}`);
//   }

//   // ─── PDF → Images (pdftoppm) ──────────────────────────────────────────────

//   async pdfToImages(opts: PdfToImgOptions): Promise<string[]> {
//     const fmt = opts.format === 'jpg' ? '-jpeg' : '-png';
//     const prefix = path.join(opts.outputDir, 'page');
//     await runCommand(`pdftoppm ${fmt} -r ${opts.dpi} "${opts.inputPath}" "${prefix}"`);
//     return fs.readdirSync(opts.outputDir)
//       .filter((f) => f.match(/^page[-_]?\d+\.(jpg|jpeg|png)$/i))
//       .sort()
//       .map((f) => path.join(opts.outputDir, f));
//   }

//   // ─── Office → PDF (LibreOffice) ───────────────────────────────────────────

//   async officeToPdf(opts: OfficeToPdfOptions): Promise<string> {
//     await runCommand(`soffice --headless --convert-to pdf --outdir "${opts.outputDir}" "${opts.inputPath}"`);
//     const files = fs.readdirSync(opts.outputDir).filter((f) => f.endsWith('.pdf'));
//     if (!files.length) throw new Error('LibreOffice produced no PDF output');
//     return path.join(opts.outputDir, files[0]);
//   }

//   // ─── PDF → Office (LibreOffice) ───────────────────────────────────────────

//   async pdfToOffice(opts: PdfToOfficeOptions): Promise<string> {
//     const { inputPath, outputDir, format } = opts;

//     // PDF import filters by format:
//     //   docx → writer_pdf_import  → odt  → docx
//     //   pptx → impress_pdf_import → odp  → pptx  (Impress handles PDF as draw)
//     //   xlsx → writer_pdf_import  → odt  → xlsx  (no perfect path; best effort)
//     const filterMap: Record<string, string> = {
//       docx: 'writer_pdf_import',
//       pptx: 'impress_pdf_import',
//       xlsx: 'writer_pdf_import',
//     };
//     const intermediateMap: Record<string, string> = {
//       docx: 'odt',
//       pptx: 'odp',
//       xlsx: 'odt',
//     };

//     const infilter  = filterMap[format] || 'writer_pdf_import';
//     const intermediate = intermediateMap[format] || 'odt';

//     // Step 1: PDF → ODF intermediate
//     const step1Cmd = `soffice --headless --infilter="${infilter}" --convert-to ${intermediate} --outdir "${outputDir}" "${inputPath}"`;
//     console.log(`[PdfToOffice] step1: ${step1Cmd}`);
//     await runCommand(step1Cmd);

//     let midFiles = fs.readdirSync(outputDir).filter((f) => f.endsWith(`.${intermediate}`));

//     // Fallback: try without infilter
//     if (!midFiles.length) {
//       console.log(`[PdfToOffice] step1 fallback without infilter`);
//       await runCommand(`soffice --headless --convert-to ${intermediate} --outdir "${outputDir}" "${inputPath}"`);
//       midFiles = fs.readdirSync(outputDir).filter((f) => f.endsWith(`.${intermediate}`));
//     }

//     if (!midFiles.length) throw new Error(`LibreOffice failed to convert PDF to ${intermediate} (step 1)`);
//     const midPath = path.join(outputDir, midFiles[0]);
//     console.log(`[PdfToOffice] step1 done: ${midPath}`);

//     // Step 2: ODF intermediate → target format
//     const step2Cmd = `soffice --headless --convert-to ${format} --outdir "${outputDir}" "${midPath}"`;
//     console.log(`[PdfToOffice] step2: ${step2Cmd}`);
//     await runCommand(step2Cmd);

//     const outFiles = fs.readdirSync(outputDir).filter((f) => f.endsWith(`.${format}`));
//     if (!outFiles.length) throw new Error(`LibreOffice produced no ${format} output (step 2)`);
//     return path.join(outputDir, outFiles[0]);
//   }

//   // ─── Tool availability ────────────────────────────────────────────────────

//   async checkAvailability(): Promise<Record<string, boolean>> {
//     const tools = ['qpdf', 'gs', 'img2pdf', 'pdftoppm', 'soffice'];
//     const results: Record<string, boolean> = {};
//     for (const tool of tools) {
//       results[tool] = await checkToolAvailable(tool);
//     }
//     return results;
//   }
// }






// import * as path from 'path';
// import * as fs from 'fs';
// import { runCommand, checkToolAvailable } from '../utils/exec.util';

// export interface MergeOptions {
//   inputPaths: string[];
//   outputPath: string;
// }

// export interface SplitOptions {
//   inputPath: string;
//   outputPath: string;
//   pages?: string;
// }

// export interface CompressOptions {
//   inputPath: string;
//   outputPath: string;
//   quality: 'low' | 'medium' | 'high';
// }

// export interface RotateOptions {
//   inputPath: string;
//   outputPath: string;
//   degrees: 90 | 180 | 270;
//   pages?: number[];
// }

// export interface PdfToImgOptions {
//   inputPath: string;
//   outputDir: string;
//   format: 'jpg' | 'png';
//   dpi: number;
// }

// export interface OfficeToPdfOptions {
//   inputPath: string;
//   outputDir: string;
// }

// export interface PdfToOfficeOptions {
//   inputPath: string;
//   outputDir: string;
//   format: 'docx' | 'pptx' | 'xlsx';
// }

// const GS_QUALITY_MAP = {
//   low: '/screen',
//   medium: '/ebook',
//   high: '/printer',
// };

// export class CommandService {
//   // ─── Merge (qpdf) ─────────────────────────────────────────────────────────

//   async mergePdfs(opts: MergeOptions): Promise<void> {
//     const inputs = opts.inputPaths.map((p) => `"${p}"`).join(' ');
//     await runCommand(`qpdf --empty --pages ${inputs} -- "${opts.outputPath}"`);
//   }

//   // ─── Split (qpdf) ─────────────────────────────────────────────────────────

//   async splitPdf(opts: SplitOptions): Promise<void> {
//     if (opts.pages) {
//       await runCommand(`qpdf "${opts.inputPath}" --pages . ${opts.pages} -- "${opts.outputPath}"`);
//     } else {
//       await runCommand(`qpdf "${opts.inputPath}" --split-pages "${opts.outputPath}"`);
//     }
//   }

//   // ─── Compress (Ghostscript) ───────────────────────────────────────────────

//   async compressPdf(opts: CompressOptions): Promise<void> {
//     const setting = GS_QUALITY_MAP[opts.quality];
//     const cmd = [
//       'gs', '-sDEVICE=pdfwrite', '-dCompatibilityLevel=1.4',
//       `-dPDFSETTINGS=${setting}`, '-dNOPAUSE', '-dQUIET', '-dBATCH',
//       `-sOutputFile="${opts.outputPath}"`, `"${opts.inputPath}"`,
//     ].join(' ');
//     await runCommand(cmd);
//   }

//   // ─── Rotate (qpdf) ────────────────────────────────────────────────────────

//   async rotatePdf(opts: RotateOptions): Promise<void> {
//     const pageSpec = opts.pages && opts.pages.length > 0 ? opts.pages.join(',') : '1-z';
//     await runCommand(`qpdf "${opts.inputPath}" --rotate=+${opts.degrees}:${pageSpec} "${opts.outputPath}"`);
//   }

//   // ─── Image → PDF (img2pdf) ────────────────────────────────────────────────

//   async imageToPdf(inputPaths: string | string[], outputPath: string): Promise<void> {
//     const paths = Array.isArray(inputPaths) ? inputPaths : [inputPaths];
//     // Quote each path and join with space — img2pdf accepts multiple inputs in order
//     const inputs = paths.map((p) => `"${p}"`).join(' ');
//     const candidates = [
//       'img2pdf', '/usr/bin/img2pdf', '/usr/local/bin/img2pdf',
//       `${process.env.HOME}/.local/bin/img2pdf`,
//     ];
//     let lastErr: Error | null = null;
//     for (const bin of candidates) {
//       try { await runCommand(`"${bin}" ${inputs} -o "${outputPath}"`); return; }
//       catch (e: any) { lastErr = e; }
//     }
//     try { await runCommand(`python3 -m img2pdf ${inputs} -o "${outputPath}"`); return; } catch {}
//     throw new Error(`img2pdf not found. Install: pip3 install img2pdf\nLast error: ${lastErr?.message}`);
//   }

//   // ─── PDF → Images (pdftoppm) ──────────────────────────────────────────────

//   async pdfToImages(opts: PdfToImgOptions): Promise<string[]> {
//     const fmt = opts.format === 'jpg' ? '-jpeg' : '-png';
//     const prefix = path.join(opts.outputDir, 'page');
//     await runCommand(`pdftoppm ${fmt} -r ${opts.dpi} "${opts.inputPath}" "${prefix}"`);
//     return fs.readdirSync(opts.outputDir)
//       .filter((f) => f.match(/^page[-_]?\d+\.(jpg|jpeg|png)$/i))
//       .sort()
//       .map((f) => path.join(opts.outputDir, f));
//   }

//   // ─── Office → PDF (LibreOffice) ───────────────────────────────────────────

//   async officeToPdf(opts: OfficeToPdfOptions): Promise<string> {
//     await runCommand(`soffice --headless --convert-to pdf --outdir "${opts.outputDir}" "${opts.inputPath}"`);
//     const files = fs.readdirSync(opts.outputDir).filter((f) => f.endsWith('.pdf'));
//     if (!files.length) throw new Error('LibreOffice produced no PDF output');
//     return path.join(opts.outputDir, files[0]);
//   }

//   // ─── PDF → Office (LibreOffice) ───────────────────────────────────────────

//   async pdfToOffice(opts: PdfToOfficeOptions): Promise<string> {
//     const { inputPath, outputDir, format } = opts;
//     const filterMap: Record<string, string> = {
//       docx: 'writer_pdf_import',
//       pptx: 'impress_pdf_import',
//       xlsx: 'writer_pdf_import',
//     };
//     const intermediateMap: Record<string, string> = {
//       docx: 'odt', pptx: 'odp', xlsx: 'odt',
//     };
//     const infilter = filterMap[format] || 'writer_pdf_import';
//     const intermediate = intermediateMap[format] || 'odt';

//     // Step 1: PDF → ODF
//     await runCommand(`soffice --headless --infilter="${infilter}" --convert-to ${intermediate} --outdir "${outputDir}" "${inputPath}"`);
//     let midFiles = fs.readdirSync(outputDir).filter((f) => f.endsWith(`.${intermediate}`));
//     if (!midFiles.length) {
//       await runCommand(`soffice --headless --convert-to ${intermediate} --outdir "${outputDir}" "${inputPath}"`);
//       midFiles = fs.readdirSync(outputDir).filter((f) => f.endsWith(`.${intermediate}`));
//     }
//     if (!midFiles.length) throw new Error(`LibreOffice failed to convert PDF to ${intermediate} (step 1)`);
//     const midPath = path.join(outputDir, midFiles[0]);

//     // Step 2: ODF → target
//     await runCommand(`soffice --headless --convert-to ${format} --outdir "${outputDir}" "${midPath}"`);
//     const outFiles = fs.readdirSync(outputDir).filter((f) => f.endsWith(`.${format}`));
//     if (!outFiles.length) throw new Error(`LibreOffice produced no ${format} output (step 2)`);
//     return path.join(outputDir, outFiles[0]);
//   }

//   // ─── Tool availability ────────────────────────────────────────────────────

//   async checkAvailability(): Promise<Record<string, boolean>> {
//     const tools = ['qpdf', 'gs', 'img2pdf', 'pdftoppm', 'soffice'];
//     const results: Record<string, boolean> = {};
//     for (const tool of tools) {
//       results[tool] = await checkToolAvailable(tool);
//     }
//     return results;
//   }
// }






// import * as path from 'path';
// import * as fs from 'fs';
// import { runCommand, checkToolAvailable } from '../utils/exec.util';

// export interface MergeOptions {
//   inputPaths: string[];
//   outputPath: string;
// }

// export interface SplitOptions {
//   inputPath: string;
//   outputPath: string;
//   pages?: string;
// }

// export interface CompressOptions {
//   inputPath: string;
//   outputPath: string;
//   quality: 'low' | 'medium' | 'high';
// }

// export interface RotateOptions {
//   inputPath: string;
//   outputPath: string;
//   degrees: 90 | 180 | 270;
//   pages?: number[];
// }

// export interface PdfToImgOptions {
//   inputPath: string;
//   outputDir: string;
//   format: 'jpg' | 'png';
//   dpi: number;
// }

// export interface OfficeToPdfOptions {
//   inputPath: string;
//   outputDir: string;
// }

// export interface PdfToOfficeOptions {
//   inputPath: string;
//   outputDir: string;
//   format: 'docx' | 'pptx' | 'xlsx';
// }

// const GS_QUALITY_MAP = {
//   low: '/screen',
//   medium: '/ebook',
//   high: '/printer',
// };

// export class CommandService {
//   // ─── Merge (qpdf) ─────────────────────────────────────────────────────────

//   async mergePdfs(opts: MergeOptions): Promise<void> {
//     const inputs = opts.inputPaths.map((p) => `"${p}"`).join(' ');
//     await runCommand(`qpdf --empty --pages ${inputs} -- "${opts.outputPath}"`);
//   }

//   // ─── Split (qpdf) ─────────────────────────────────────────────────────────

//   async splitPdf(opts: SplitOptions): Promise<void> {
//     if (opts.pages) {
//       await runCommand(`qpdf "${opts.inputPath}" --pages . ${opts.pages} -- "${opts.outputPath}"`);
//     } else {
//       await runCommand(`qpdf "${opts.inputPath}" --split-pages "${opts.outputPath}"`);
//     }
//   }

//   // ─── Compress (Ghostscript) ───────────────────────────────────────────────

//   async compressPdf(opts: CompressOptions): Promise<void> {
//     const setting = GS_QUALITY_MAP[opts.quality];
//     const cmd = [
//       'gs', '-sDEVICE=pdfwrite', '-dCompatibilityLevel=1.4',
//       `-dPDFSETTINGS=${setting}`, '-dNOPAUSE', '-dQUIET', '-dBATCH',
//       `-sOutputFile="${opts.outputPath}"`, `"${opts.inputPath}"`,
//     ].join(' ');
//     await runCommand(cmd);
//   }

//   // ─── Rotate (qpdf) ────────────────────────────────────────────────────────

//   async rotatePdf(opts: RotateOptions): Promise<void> {
//     const pageSpec = opts.pages && opts.pages.length > 0 ? opts.pages.join(',') : '1-z';
//     await runCommand(`qpdf "${opts.inputPath}" --rotate=+${opts.degrees}:${pageSpec} "${opts.outputPath}"`);
//   }

//   // ─── Image → PDF (img2pdf) ────────────────────────────────────────────────

//   async imageToPdf(inputPaths: string | string[], outputPath: string): Promise<void> {
//     const paths = Array.isArray(inputPaths) ? inputPaths : [inputPaths];
//     const inputs = paths.map((p) => `"${p}"`).join(' ');
//     const candidates = [
//       'img2pdf', '/usr/bin/img2pdf', '/usr/local/bin/img2pdf',
//       `${process.env.HOME}/.local/bin/img2pdf`,
//     ];
//     let lastErr: Error | null = null;
//     for (const bin of candidates) {
//       try { await runCommand(`"${bin}" ${inputs} -o "${outputPath}"`); return; }
//       catch (e: any) { lastErr = e; }
//     }
//     try { await runCommand(`python3 -m img2pdf ${inputs} -o "${outputPath}"`); return; } catch {}
//     throw new Error(`img2pdf not found. Install: pip3 install img2pdf\nLast error: ${lastErr?.message}`);
//   }

//   // ─── PDF → Images (pdftoppm) ──────────────────────────────────────────────

//   async pdfToImages(opts: PdfToImgOptions): Promise<string[]> {
//     const fmt = opts.format === 'jpg' ? '-jpeg' : '-png';
//     const prefix = path.join(opts.outputDir, 'page');
//     await runCommand(`pdftoppm ${fmt} -r ${opts.dpi} "${opts.inputPath}" "${prefix}"`);
//     return fs.readdirSync(opts.outputDir)
//       .filter((f) => f.match(/^page[-_]?\d+\.(jpg|jpeg|png)$/i))
//       .sort()
//       .map((f) => path.join(opts.outputDir, f));
//   }

//   // ─── Office → PDF (LibreOffice) ───────────────────────────────────────────

//   async officeToPdf(opts: OfficeToPdfOptions): Promise<string> {
//     await runCommand(`soffice --headless --convert-to pdf --outdir "${opts.outputDir}" "${opts.inputPath}"`);
//     const files = fs.readdirSync(opts.outputDir).filter((f) => f.endsWith('.pdf'));
//     if (!files.length) throw new Error('LibreOffice produced no PDF output');
//     return path.join(opts.outputDir, files[0]);
//   }

//   // ─── PDF → Office (LibreOffice two-step) ─────────────────────────────────

//   async pdfToOffice(opts: PdfToOfficeOptions): Promise<string> {
//     const { inputPath, outputDir, format } = opts;
//     const filterMap: Record<string, string> = {
//       docx: 'writer_pdf_import',
//       pptx: 'impress_pdf_import',
//       xlsx: 'writer_pdf_import',
//     };
//     const intermediateMap: Record<string, string> = {
//       docx: 'odt', pptx: 'odp', xlsx: 'odt',
//     };
//     const infilter = filterMap[format] || 'writer_pdf_import';
//     const intermediate = intermediateMap[format] || 'odt';

//     await runCommand(`soffice --headless --infilter="${infilter}" --convert-to ${intermediate} --outdir "${outputDir}" "${inputPath}"`);
//     let midFiles = fs.readdirSync(outputDir).filter((f) => f.endsWith(`.${intermediate}`));
//     if (!midFiles.length) {
//       await runCommand(`soffice --headless --convert-to ${intermediate} --outdir "${outputDir}" "${inputPath}"`);
//       midFiles = fs.readdirSync(outputDir).filter((f) => f.endsWith(`.${intermediate}`));
//     }
//     if (!midFiles.length) throw new Error(`LibreOffice failed to convert PDF to ${intermediate} (step 1)`);
//     const midPath = path.join(outputDir, midFiles[0]);

//     await runCommand(`soffice --headless --convert-to ${format} --outdir "${outputDir}" "${midPath}"`);
//     const outFiles = fs.readdirSync(outputDir).filter((f) => f.endsWith(`.${format}`));
//     if (!outFiles.length) throw new Error(`LibreOffice produced no ${format} output (step 2)`);
//     return path.join(outputDir, outFiles[0]);
//   }

//   // ─── Protect PDF (qpdf) ───────────────────────────────────────────────────

//   async protectPdf(opts: {
//     inputPath: string; outputPath: string;
//     userPassword: string; ownerPassword?: string;
//   }): Promise<void> {
//     const owner = opts.ownerPassword || opts.userPassword;
//     await runCommand(
//       `qpdf --encrypt "${opts.userPassword}" "${owner}" 128 -- "${opts.inputPath}" "${opts.outputPath}"`
//     );
//   }

//   // ─── Insert Pages (qpdf) ─────────────────────────────────────────────────

//   async insertPages(opts: {
//     basePath: string; insertPath: string;
//     outputPath: string; afterPage: number;
//   }): Promise<void> {
//     const { basePath, insertPath, outputPath, afterPage } = opts;
//     if (afterPage === 0) {
//       await runCommand(`qpdf --empty --pages "${insertPath}" 1-z "${basePath}" 1-z -- "${outputPath}"`);
//     } else {
//       await runCommand(
//         `qpdf --empty --pages "${basePath}" 1-${afterPage} "${insertPath}" 1-z "${basePath}" ${afterPage + 1}-z -- "${outputPath}"`
//       ).catch(async () => {
//         // fallback: append if afterPage >= total pages
//         await runCommand(`qpdf --empty --pages "${basePath}" 1-z "${insertPath}" 1-z -- "${outputPath}"`);
//       });
//     }
//   }

//   // ─── Number Pages (Ghostscript) ───────────────────────────────────────────

//   async numberPages(opts: {
//     inputPath: string; outputPath: string;
//     position: string; startNumber: number; fontSize: number;
//   }): Promise<void> {
//     const { inputPath, outputPath, position, startNumber, fontSize } = opts;

//     // Position → (x_expr, y_expr) in PostScript using pageWidth/pageHeight
//     const posMap: Record<string, [string, string]> = {
//       'bottom-left':   ['margin',                'margin'],
//       'bottom-center': ['pageWidth 2 div',       'margin'],
//       'bottom-right':  ['pageWidth margin sub',  'margin'],
//       'top-left':      ['margin',                'pageHeight margin sub fontSize sub'],
//       'top-center':    ['pageWidth 2 div',       'pageHeight margin sub fontSize sub'],
//       'top-right':     ['pageWidth margin sub',  'pageHeight margin sub fontSize sub'],
//     };
//     const [xExpr, yExpr] = posMap[position] || posMap['bottom-center'];
//     const margin = 30;

//     const psContent = `
// /margin ${margin} def
// /fontSize ${fontSize} def
// /pageNum ${startNumber} def
// /Helvetica findfont fontSize scalefont setfont
// {
//   dup /MediaBox get aload pop
//   /pageHeight exch def /pageWidth exch def pop pop
//   gsave
//   ${xExpr} ${yExpr} moveto
//   pageNum 10 string cvs
//   dup stringwidth pop 2 div neg 0 rmoveto
//   show
//   grestore
//   /pageNum pageNum 1 add def
// } forall
// `;

//     const psFile = outputPath + '_num.ps';
//     fs.writeFileSync(psFile, psContent);
//     try {
//       await runCommand(
//         `gs -dBATCH -dNOPAUSE -sDEVICE=pdfwrite -sOutputFile="${outputPath}" "${inputPath}" "${psFile}"`
//       );
//     } finally {
//       try { fs.unlinkSync(psFile); } catch {}
//     }
//   }

//   // ─── Crop PDF (pypdf CropBox) ─────────────────────────────────────────────

//   async cropPdf(opts: {
//     inputPath: string; outputPath: string;
//     top: number; bottom: number; left: number; right: number;
//   }): Promise<void> {
//     const { inputPath, outputPath, top, bottom, left, right } = opts;
//     const script = `
// import sys
// try:
//     from pypdf import PdfReader, PdfWriter
// except ImportError:
//     from PyPDF2 import PdfReader, PdfWriter
// reader = PdfReader("${inputPath}")
// writer = PdfWriter()
// for page in reader.pages:
//     mb = page.mediabox
//     page.cropbox.lower_left  = (float(mb.left) + ${left},  float(mb.bottom) + ${bottom})
//     page.cropbox.upper_right = (float(mb.right) - ${right}, float(mb.top) - ${top})
//     writer.add_page(page)
// with open("${outputPath}", "wb") as f:
//     writer.write(f)
// print("done")
// `;
//     const scriptFile = outputPath + '_crop.py';
//     fs.writeFileSync(scriptFile, script);
//     try {
//       await runCommand(`python3 "${scriptFile}"`);
//     } finally {
//       try { fs.unlinkSync(scriptFile); } catch {}
//     }
//   }

//   // ─── Tool availability ────────────────────────────────────────────────────

//   async checkAvailability(): Promise<Record<string, boolean>> {
//     const tools = ['qpdf', 'gs', 'img2pdf', 'pdftoppm', 'soffice'];
//     const results: Record<string, boolean> = {};
//     for (const tool of tools) {
//       results[tool] = await checkToolAvailable(tool);
//     }
//     return results;
//   }
// }





// import * as path from 'path';
// import * as fs from 'fs';
// import { runCommand, checkToolAvailable } from '../utils/exec.util';

// export interface MergeOptions {
//   inputPaths: string[];
//   outputPath: string;
// }

// export interface SplitOptions {
//   inputPath: string;
//   outputPath: string;
//   pages?: string;
// }

// export interface CompressOptions {
//   inputPath: string;
//   outputPath: string;
//   quality: 'low' | 'medium' | 'high';
// }

// export interface RotateOptions {
//   inputPath: string;
//   outputPath: string;
//   degrees: 90 | 180 | 270;
//   pages?: number[];
// }

// export interface PdfToImgOptions {
//   inputPath: string;
//   outputDir: string;
//   format: 'jpg' | 'png';
//   dpi: number;
// }

// export interface OfficeToPdfOptions {
//   inputPath: string;
//   outputDir: string;
// }

// export interface PdfToOfficeOptions {
//   inputPath: string;
//   outputDir: string;
//   format: 'docx' | 'pptx' | 'xlsx';
// }

// const GS_QUALITY_MAP = {
//   low: '/screen',
//   medium: '/ebook',
//   high: '/printer',
// };

// export class CommandService {
//   // ─── Merge (qpdf) ─────────────────────────────────────────────────────────

//   async mergePdfs(opts: MergeOptions): Promise<void> {
//     const inputs = opts.inputPaths.map((p) => `"${p}"`).join(' ');
//     await runCommand(`qpdf --empty --pages ${inputs} -- "${opts.outputPath}"`);
//   }

//   // ─── Split (qpdf) ─────────────────────────────────────────────────────────

//   async splitPdf(opts: SplitOptions): Promise<void> {
//     if (opts.pages) {
//       await runCommand(`qpdf "${opts.inputPath}" --pages . ${opts.pages} -- "${opts.outputPath}"`);
//     } else {
//       await runCommand(`qpdf "${opts.inputPath}" --split-pages "${opts.outputPath}"`);
//     }
//   }

//   // ─── Compress (Ghostscript) ───────────────────────────────────────────────

//   async compressPdf(opts: CompressOptions): Promise<void> {
//     const setting = GS_QUALITY_MAP[opts.quality];
//     const cmd = [
//       'gs', '-sDEVICE=pdfwrite', '-dCompatibilityLevel=1.4',
//       `-dPDFSETTINGS=${setting}`, '-dNOPAUSE', '-dQUIET', '-dBATCH',
//       `-sOutputFile="${opts.outputPath}"`, `"${opts.inputPath}"`,
//     ].join(' ');
//     await runCommand(cmd);
//   }

//   // ─── Rotate (qpdf) ────────────────────────────────────────────────────────

//   async rotatePdf(opts: RotateOptions): Promise<void> {
//     const pageSpec = opts.pages && opts.pages.length > 0 ? opts.pages.join(',') : '1-z';
//     await runCommand(`qpdf "${opts.inputPath}" --rotate=+${opts.degrees}:${pageSpec} "${opts.outputPath}"`);
//   }

//   // ─── Image → PDF (img2pdf) ────────────────────────────────────────────────

//   async imageToPdf(inputPaths: string | string[], outputPath: string): Promise<void> {
//     const paths = Array.isArray(inputPaths) ? inputPaths : [inputPaths];
//     const inputs = paths.map((p) => `"${p}"`).join(' ');
//     const candidates = [
//       'img2pdf', '/usr/bin/img2pdf', '/usr/local/bin/img2pdf',
//       `${process.env.HOME}/.local/bin/img2pdf`,
//     ];
//     let lastErr: Error | null = null;
//     for (const bin of candidates) {
//       try { await runCommand(`"${bin}" ${inputs} -o "${outputPath}"`); return; }
//       catch (e: any) { lastErr = e; }
//     }
//     try { await runCommand(`python3 -m img2pdf ${inputs} -o "${outputPath}"`); return; } catch {}
//     throw new Error(`img2pdf not found. Install: pip3 install img2pdf\nLast error: ${lastErr?.message}`);
//   }

//   // ─── PDF → Images (pdftoppm) ──────────────────────────────────────────────

//   async pdfToImages(opts: PdfToImgOptions): Promise<string[]> {
//     const fmt = opts.format === 'jpg' ? '-jpeg' : '-png';
//     const prefix = path.join(opts.outputDir, 'page');
//     await runCommand(`pdftoppm ${fmt} -r ${opts.dpi} "${opts.inputPath}" "${prefix}"`);
//     return fs.readdirSync(opts.outputDir)
//       .filter((f) => f.match(/^page[-_]?\d+\.(jpg|jpeg|png)$/i))
//       .sort()
//       .map((f) => path.join(opts.outputDir, f));
//   }

//   // ─── Office → PDF (LibreOffice) ───────────────────────────────────────────

//   async officeToPdf(opts: OfficeToPdfOptions): Promise<string> {
//     await runCommand(`soffice --headless --convert-to pdf --outdir "${opts.outputDir}" "${opts.inputPath}"`);
//     const files = fs.readdirSync(opts.outputDir).filter((f) => f.endsWith('.pdf'));
//     if (!files.length) throw new Error('LibreOffice produced no PDF output');
//     return path.join(opts.outputDir, files[0]);
//   }

//   // ─── PDF → Office (LibreOffice two-step) ─────────────────────────────────

//   async pdfToOffice(opts: PdfToOfficeOptions): Promise<string> {
//     const { inputPath, outputDir, format } = opts;
//     const filterMap: Record<string, string> = {
//       docx: 'writer_pdf_import',
//       pptx: 'impress_pdf_import',
//       xlsx: 'writer_pdf_import',
//     };
//     const intermediateMap: Record<string, string> = {
//       docx: 'odt', pptx: 'odp', xlsx: 'odt',
//     };
//     const infilter = filterMap[format] || 'writer_pdf_import';
//     const intermediate = intermediateMap[format] || 'odt';

//     await runCommand(`soffice --headless --infilter="${infilter}" --convert-to ${intermediate} --outdir "${outputDir}" "${inputPath}"`);
//     let midFiles = fs.readdirSync(outputDir).filter((f) => f.endsWith(`.${intermediate}`));
//     if (!midFiles.length) {
//       await runCommand(`soffice --headless --convert-to ${intermediate} --outdir "${outputDir}" "${inputPath}"`);
//       midFiles = fs.readdirSync(outputDir).filter((f) => f.endsWith(`.${intermediate}`));
//     }
//     if (!midFiles.length) throw new Error(`LibreOffice failed to convert PDF to ${intermediate} (step 1)`);
//     const midPath = path.join(outputDir, midFiles[0]);

//     await runCommand(`soffice --headless --convert-to ${format} --outdir "${outputDir}" "${midPath}"`);
//     const outFiles = fs.readdirSync(outputDir).filter((f) => f.endsWith(`.${format}`));
//     if (!outFiles.length) throw new Error(`LibreOffice produced no ${format} output (step 2)`);
//     return path.join(outputDir, outFiles[0]);
//   }

//   // ─── Protect PDF (qpdf) ───────────────────────────────────────────────────

//   async protectPdf(opts: {
//     inputPath: string; outputPath: string;
//     userPassword: string; ownerPassword?: string;
//   }): Promise<void> {
//     const owner = opts.ownerPassword || opts.userPassword;
//     await runCommand(
//       `qpdf --encrypt "${opts.userPassword}" "${owner}" 128 -- "${opts.inputPath}" "${opts.outputPath}"`
//     );
//   }

//   // ─── Insert Pages (qpdf) ─────────────────────────────────────────────────

//   async insertPages(opts: {
//     basePath: string; insertPath: string;
//     outputPath: string; afterPage: number;
//   }): Promise<void> {
//     const { basePath, insertPath, outputPath, afterPage } = opts;
//     if (afterPage === 0) {
//       await runCommand(`qpdf --empty --pages "${insertPath}" 1-z "${basePath}" 1-z -- "${outputPath}"`);
//     } else {
//       await runCommand(
//         `qpdf --empty --pages "${basePath}" 1-${afterPage} "${insertPath}" 1-z "${basePath}" ${afterPage + 1}-z -- "${outputPath}"`
//       ).catch(async () => {
//         await runCommand(`qpdf --empty --pages "${basePath}" 1-z "${insertPath}" 1-z -- "${outputPath}"`);
//       });
//     }
//   }

//   // ─── Number Pages (pypdf + reportlab) ────────────────────────────────────

//   async numberPages(opts: {
//     inputPath: string; outputPath: string;
//     position: string; startNumber: number; fontSize: number;
//   }): Promise<void> {
//     const { inputPath, outputPath, position, startNumber, fontSize } = opts;

//     const script = `
// import sys, io

// # Try reportlab first
// try:
//     from reportlab.pdfgen import canvas as rl_canvas
//     HAS_REPORTLAB = True
// except ImportError:
//     HAS_REPORTLAB = False

// try:
//     from pypdf import PdfReader, PdfWriter
// except ImportError:
//     from PyPDF2 import PdfReader, PdfWriter

// reader = PdfReader("${inputPath}")
// writer = PdfWriter()

// for i, page in enumerate(reader.pages):
//     mb = page.mediabox
//     pw = float(mb.width)
//     ph = float(mb.height)
//     num = ${startNumber} + i
//     margin = 30
//     fs = ${fontSize}
//     pos = "${position}"
//     label = str(num)

//     if HAS_REPORTLAB:
//         packet = io.BytesIO()
//         c = rl_canvas.Canvas(packet, pagesize=(pw, ph))
//         c.setFont("Helvetica", fs)
//         tw = c.stringWidth(label, "Helvetica", fs)
//         if pos == "bottom-center":   x, y = pw/2 - tw/2, margin
//         elif pos == "bottom-left":   x, y = margin, margin
//         elif pos == "bottom-right":  x, y = pw - margin - tw, margin
//         elif pos == "top-center":    x, y = pw/2 - tw/2, ph - margin - fs
//         elif pos == "top-left":      x, y = margin, ph - margin - fs
//         elif pos == "top-right":     x, y = pw - margin - tw, ph - margin - fs
//         else:                        x, y = pw/2 - tw/2, margin
//         c.drawString(x, y, label)
//         c.save()
//         packet.seek(0)
//         try:
//             from pypdf import PdfReader as PR
//         except ImportError:
//             from PyPDF2 import PdfReader as PR
//         overlay = PR(packet).pages[0]
//         page.merge_page(overlay)
//     # if no reportlab, pages are copied as-is (no numbers — fail gracefully)

//     writer.add_page(page)

// if not HAS_REPORTLAB:
//     sys.exit("reportlab_missing")

// with open("${outputPath}", "wb") as f:
//     writer.write(f)
// print("done")
// `;

//     const scriptFile = outputPath + '_num.py';
//     fs.writeFileSync(scriptFile, script);
//     try {
//       const { stdout } = await runCommand(`python3 "${scriptFile}"`);
//       if (stdout.includes('reportlab_missing')) {
//         // try conda/pip locations
//         const pyBins = ['python3', 'python', '/usr/bin/python3', `${process.env.HOME}/anaconda3/bin/python3`, `${process.env.HOME}/miniconda3/bin/python3`];
//         for (const py of pyBins) {
//           try {
//             const { stdout: out } = await runCommand(`${py} -c "import reportlab; print('ok')"`);
//             if (out.includes('ok')) {
//               await runCommand(`${py} "${scriptFile}"`);
//               return;
//             }
//           } catch {}
//         }
//         throw new Error('reportlab not found in any Python. Run: pip3 install reportlab --break-system-packages');
//       }
//     } finally {
//       try { fs.unlinkSync(scriptFile); } catch {}
//     }
//   }

//   // ─── Crop PDF (pypdf CropBox) ─────────────────────────────────────────────

//   async cropPdf(opts: {
//     inputPath: string; outputPath: string;
//     top: number; bottom: number; left: number; right: number;
//   }): Promise<void> {
//     const { inputPath, outputPath, top, bottom, left, right } = opts;
//     const script = `
// import sys
// try:
//     from pypdf import PdfReader, PdfWriter
// except ImportError:
//     from PyPDF2 import PdfReader, PdfWriter
// reader = PdfReader("${inputPath}")
// writer = PdfWriter()
// for page in reader.pages:
//     mb = page.mediabox
//     page.cropbox.lower_left  = (float(mb.left) + ${left},  float(mb.bottom) + ${bottom})
//     page.cropbox.upper_right = (float(mb.right) - ${right}, float(mb.top) - ${top})
//     writer.add_page(page)
// with open("${outputPath}", "wb") as f:
//     writer.write(f)
// print("done")
// `;
//     const scriptFile = outputPath + '_crop.py';
//     fs.writeFileSync(scriptFile, script);
//     try {
//       await runCommand(`python3 "${scriptFile}"`);
//     } finally {
//       try { fs.unlinkSync(scriptFile); } catch {}
//     }
//   }

//   // ─── Tool availability ────────────────────────────────────────────────────

//   async checkAvailability(): Promise<Record<string, boolean>> {
//     const tools = ['qpdf', 'gs', 'img2pdf', 'pdftoppm', 'soffice'];
//     const results: Record<string, boolean> = {};
//     for (const tool of tools) {
//       results[tool] = await checkToolAvailable(tool);
//     }
//     return results;
//   }
// }








import * as path from 'path';
import * as fs from 'fs';
import { runCommand, checkToolAvailable } from '../utils/exec.util';

export interface MergeOptions { inputPaths: string[]; outputPath: string; }
export interface SplitOptions { inputPath: string; outputPath: string; pages?: string; }
export interface CompressOptions { inputPath: string; outputPath: string; quality: 'low' | 'medium' | 'high'; }
export interface RotateOptions { inputPath: string; outputPath: string; degrees: 90 | 180 | 270; pages?: number[]; }
export interface PdfToImgOptions { inputPath: string; outputDir: string; format: 'jpg' | 'png'; dpi: number; }
export interface OfficeToPdfOptions { inputPath: string; outputDir: string; }
export interface PdfToOfficeOptions { inputPath: string; outputDir: string; format: 'docx' | 'pptx' | 'xlsx'; }

const GS_QUALITY_MAP = { low: '/screen', medium: '/ebook', high: '/printer' };

export class CommandService {
  async mergePdfs(opts: MergeOptions): Promise<void> {
    const inputs = opts.inputPaths.map((p) => `"${p}"`).join(' ');
    await runCommand(`qpdf --empty --pages ${inputs} -- "${opts.outputPath}"`);
  }

  async splitPdf(opts: SplitOptions): Promise<void> {
    if (opts.pages) {
      await runCommand(`qpdf "${opts.inputPath}" --pages . ${opts.pages} -- "${opts.outputPath}"`);
    } else {
      await runCommand(`qpdf "${opts.inputPath}" --split-pages "${opts.outputPath}"`);
    }
  }

  async compressPdf(opts: CompressOptions): Promise<void> {
    const setting = GS_QUALITY_MAP[opts.quality];
    await runCommand(['gs', '-sDEVICE=pdfwrite', '-dCompatibilityLevel=1.4',
      `-dPDFSETTINGS=${setting}`, '-dNOPAUSE', '-dQUIET', '-dBATCH',
      `-sOutputFile="${opts.outputPath}"`, `"${opts.inputPath}"`].join(' '));
  }

  async rotatePdf(opts: RotateOptions): Promise<void> {
    const pageSpec = opts.pages && opts.pages.length > 0 ? opts.pages.join(',') : '1-z';
    await runCommand(`qpdf "${opts.inputPath}" --rotate=+${opts.degrees}:${pageSpec} "${opts.outputPath}"`);
  }

  async imageToPdf(inputPaths: string | string[], outputPath: string): Promise<void> {
    const paths = Array.isArray(inputPaths) ? inputPaths : [inputPaths];
    const inputs = paths.map((p) => `"${p}"`).join(' ');
    const candidates = ['img2pdf', '/usr/bin/img2pdf', '/usr/local/bin/img2pdf', `${process.env.HOME}/.local/bin/img2pdf`];
    let lastErr: Error | null = null;
    for (const bin of candidates) {
      try { await runCommand(`"${bin}" ${inputs} -o "${outputPath}"`); return; } catch (e: any) { lastErr = e; }
    }
    try { await runCommand(`python3 -m img2pdf ${inputs} -o "${outputPath}"`); return; } catch {}
    throw new Error(`img2pdf not found. Install: pip3 install img2pdf\nLast error: ${lastErr?.message}`);
  }

  async pdfToImages(opts: PdfToImgOptions): Promise<string[]> {
    const fmt = opts.format === 'jpg' ? '-jpeg' : '-png';
    const prefix = path.join(opts.outputDir, 'page');
    await runCommand(`pdftoppm ${fmt} -r ${opts.dpi} "${opts.inputPath}" "${prefix}"`);
    return fs.readdirSync(opts.outputDir)
      .filter((f) => f.match(/^page[-_]?\d+\.(jpg|jpeg|png)$/i))
      .sort().map((f) => path.join(opts.outputDir, f));
  }

  async officeToPdf(opts: OfficeToPdfOptions): Promise<string> {
    await runCommand(`soffice --headless --convert-to pdf --outdir "${opts.outputDir}" "${opts.inputPath}"`);
    const files = fs.readdirSync(opts.outputDir).filter((f) => f.endsWith('.pdf'));
    if (!files.length) throw new Error('LibreOffice produced no PDF output');
    return path.join(opts.outputDir, files[0]);
  }

  async pdfToOffice(opts: PdfToOfficeOptions): Promise<string> {
    const { inputPath, outputDir, format } = opts;
    const filterMap: Record<string, string> = { docx: 'writer_pdf_import', pptx: 'impress_pdf_import', xlsx: 'writer_pdf_import' };
    const intermediateMap: Record<string, string> = { docx: 'odt', pptx: 'odp', xlsx: 'odt' };
    const infilter = filterMap[format] || 'writer_pdf_import';
    const intermediate = intermediateMap[format] || 'odt';
    await runCommand(`soffice --headless --infilter="${infilter}" --convert-to ${intermediate} --outdir "${outputDir}" "${inputPath}"`);
    let midFiles = fs.readdirSync(outputDir).filter((f) => f.endsWith(`.${intermediate}`));
    if (!midFiles.length) {
      await runCommand(`soffice --headless --convert-to ${intermediate} --outdir "${outputDir}" "${inputPath}"`);
      midFiles = fs.readdirSync(outputDir).filter((f) => f.endsWith(`.${intermediate}`));
    }
    if (!midFiles.length) throw new Error(`LibreOffice failed to convert PDF to ${intermediate} (step 1)`);
    const midPath = path.join(outputDir, midFiles[0]);
    await runCommand(`soffice --headless --convert-to ${format} --outdir "${outputDir}" "${midPath}"`);
    const outFiles = fs.readdirSync(outputDir).filter((f) => f.endsWith(`.${format}`));
    if (!outFiles.length) throw new Error(`LibreOffice produced no ${format} output (step 2)`);
    return path.join(outputDir, outFiles[0]);
  }

  async protectPdf(opts: { inputPath: string; outputPath: string; userPassword: string; ownerPassword?: string; }): Promise<void> {
    const owner = opts.ownerPassword || opts.userPassword;
    await runCommand(`qpdf --encrypt "${opts.userPassword}" "${owner}" 128 -- "${opts.inputPath}" "${opts.outputPath}"`);
  }

  async insertPages(opts: { basePath: string; insertPath: string; outputPath: string; afterPage: number; }): Promise<void> {
    const { basePath, insertPath, outputPath, afterPage } = opts;
    if (afterPage === 0) {
      await runCommand(`qpdf --empty --pages "${insertPath}" 1-z "${basePath}" 1-z -- "${outputPath}"`);
    } else {
      await runCommand(`qpdf --empty --pages "${basePath}" 1-${afterPage} "${insertPath}" 1-z "${basePath}" ${afterPage + 1}-z -- "${outputPath}"`)
        .catch(async () => {
          await runCommand(`qpdf --empty --pages "${basePath}" 1-z "${insertPath}" 1-z -- "${outputPath}"`);
        });
    }
  }

  // ─── Number Pages (pypdf + reportlab overlay) ─────────────────────────────

  async numberPages(opts: {
    inputPath: string; outputPath: string;
    position: string; startNumber: number; fontSize: number;
  }): Promise<void> {
    const { inputPath, outputPath, position, startNumber, fontSize } = opts;

    const script = `
import sys, io

try:
    from reportlab.pdfgen import canvas as rl_canvas
    from reportlab.lib.colors import black
except ImportError:
    sys.exit("ERR_NO_REPORTLAB")

try:
    from pypdf import PdfReader, PdfWriter, PageObject
    from pypdf.generic import ArrayObject, FloatObject
except ImportError:
    from PyPDF2 import PdfReader, PdfWriter

reader = PdfReader("${inputPath}")
writer = PdfWriter()

for i, page in enumerate(reader.pages):
    mb = page.mediabox
    pw = float(mb.width)
    ph = float(mb.height)
    num = ${startNumber} + i
    fs = max(${fontSize}, 8)
    pos = "${position}"
    label = str(num)
    margin = max(fs + 4, 20)

    # Build overlay with exact page size
    packet = io.BytesIO()
    c = rl_canvas.Canvas(packet, pagesize=(pw, ph))
    c.setFont("Helvetica-Bold", fs)
    c.setFillColor(black)
    tw = c.stringWidth(label, "Helvetica-Bold", fs)

    # Calculate position
    if pos == "bottom-center":   x, y = (pw - tw) / 2,        margin
    elif pos == "bottom-left":   x, y = margin,                margin
    elif pos == "bottom-right":  x, y = pw - margin - tw,      margin
    elif pos == "top-center":    x, y = (pw - tw) / 2,         ph - margin - fs
    elif pos == "top-left":      x, y = margin,                ph - margin - fs
    elif pos == "top-right":     x, y = pw - margin - tw,      ph - margin - fs
    else:                        x, y = (pw - tw) / 2,         margin

    c.drawString(x, y, label)
    c.save()
    packet.seek(0)

    try:
        from pypdf import PdfReader as PR2
    except ImportError:
        from PyPDF2 import PdfReader as PR2

    overlay_page = PR2(packet).pages[0]
    page.merge_page(overlay_page)
    writer.add_page(page)

with open("${outputPath}", "wb") as f:
    writer.write(f)
print("done")
`;

    const scriptFile = outputPath + '_num.py';
    fs.writeFileSync(scriptFile, script);
    try {
      const { stdout, stderr } = await runCommand(`python3 "${scriptFile}"`);
      if (stdout.includes('ERR_NO_REPORTLAB') || stderr.includes('ERR_NO_REPORTLAB')) {
        throw new Error('reportlab not installed. Run: pip3 install reportlab --break-system-packages');
      }
    } finally {
      try { fs.unlinkSync(scriptFile); } catch {}
    }
  }

  // ─── Crop PDF (pypdf CropBox) ─────────────────────────────────────────────

  async cropPdf(opts: { inputPath: string; outputPath: string; top: number; bottom: number; left: number; right: number; }): Promise<void> {
    const { inputPath, outputPath, top, bottom, left, right } = opts;
    const script = `
try:
    from pypdf import PdfReader, PdfWriter
except ImportError:
    from PyPDF2 import PdfReader, PdfWriter
reader = PdfReader("${inputPath}")
writer = PdfWriter()
for page in reader.pages:
    mb = page.mediabox
    page.cropbox.lower_left  = (float(mb.left) + ${left},  float(mb.bottom) + ${bottom})
    page.cropbox.upper_right = (float(mb.right) - ${right}, float(mb.top) - ${top})
    writer.add_page(page)
with open("${outputPath}", "wb") as f:
    writer.write(f)
print("done")
`;
    const scriptFile = outputPath + '_crop.py';
    fs.writeFileSync(scriptFile, script);
    try {
      await runCommand(`python3 "${scriptFile}"`);
    } finally {
      try { fs.unlinkSync(scriptFile); } catch {}
    }
  }

  // ─── Tool availability ────────────────────────────────────────────────────

  async checkAvailability(): Promise<Record<string, boolean>> {
    const tools = ['qpdf', 'gs', 'img2pdf', 'pdftoppm', 'soffice'];
    const results: Record<string, boolean> = {};
    for (const tool of tools) { results[tool] = await checkToolAvailable(tool); }
    return results;
  }
}