// Run after `npm run build`: node --test test/   (needs qpdf on PATH)
// Feeds injection payloads to the real tool wrappers and checks no shell ever runs them.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { PDFDocument } = require('pdf-lib');
const { CommandService } = require('../dist/services/command.service');

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cmd-safety-'));
const marker = path.join(dir, 'PWNED');
const input = path.join(dir, 'in.pdf');
const svc = new CommandService();

test.before(async () => {
  const doc = await PDFDocument.create();
  doc.addPage(); doc.addPage(); doc.addPage();
  fs.writeFileSync(input, await doc.save());
});
test.after(() => fs.rmSync(dir, { recursive: true, force: true }));

test('split rejects a page range carrying shell syntax', async () => {
  await assert.rejects(svc.splitPdf({ inputPath: input, outputPath: path.join(dir, 's.pdf'), pages: `1; touch ${marker}` }));
  assert.ok(!fs.existsSync(marker));
});

test('rotate rejects non-numeric page entries', async () => {
  await assert.rejects(svc.rotatePdf({ inputPath: input, outputPath: path.join(dir, 'r.pdf'), degrees: 90, pages: [`1;touch ${marker}`] }));
  assert.ok(!fs.existsSync(marker));
});

test('protect treats $(…) in a password as literal text', async () => {
  const out = path.join(dir, 'p.pdf');
  await svc.protectPdf({ inputPath: input, outputPath: out, userPassword: `$(touch ${marker})` });
  assert.ok(fs.existsSync(out));
  assert.ok(!fs.existsSync(marker));
});

test('valid operations still work', async () => {
  await svc.splitPdf({ inputPath: input, outputPath: path.join(dir, 's2.pdf'), pages: '1-2, 3' });
  await svc.rotatePdf({ inputPath: input, outputPath: path.join(dir, 'r2.pdf'), degrees: 180, pages: [1, 3] });
  await svc.mergePdfs({ inputPaths: [input, input], outputPath: path.join(dir, 'm.pdf') });
  for (const f of ['s2', 'r2', 'm']) assert.ok(fs.existsSync(path.join(dir, `${f}.pdf`)), f);
});
