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