// Run after `npm run build`: node --test test/
// Guards the validation that keeps user input out of the worker's tool commands.
require('reflect-metadata');
const test = require('node:test');
const assert = require('node:assert');
const { plainToInstance } = require('class-transformer');
const { validate } = require('class-validator');
const D = require('../dist/common/dto/job.dto');

const U = '3f2b8c1e-4d5a-4b6c-8d7e-9f0a1b2c3d4e';
const isValid = async (Cls, body) =>
  (await validate(plainToInstance(Cls, body, { enableImplicitConversion: true }), { whitelist: true })).length === 0;

test('accepts what the web and mobile clients send', async () => {
  assert.ok(await isValid(D.SplitJobDto, { fileId: U, pages: '1-3, 5, 7-z' }));
  assert.ok(await isValid(D.RotateJobDto, { fileId: U, degrees: 180, pages: [1, 2] }));
  assert.ok(await isValid(D.ProtectJobDto, { fileId: U, userPassword: '$(id) "quoted" pw' }));
  assert.ok(await isValid(D.PagesJobDto, { fileId: U, operation: 'extract', pages: [3, 1] }));
  assert.ok(await isValid(D.EditJobDto, { fileId: U, instructions: [{ type: 'text', page: 1, x: 10.5, y: 20, content: 'hi', fontSize: 14, color: '#000000' }] }));
  assert.ok(await isValid(D.PdfToImgJobDto, { fileId: U, format: 'png', dpi: 300 }));
  assert.ok(await isValid(D.InsertPagesJobDto, { baseFileId: U, insertFileId: U, afterPage: 0 }));
  assert.ok(await isValid(D.CropJobDto, { fileId: U, top: 36, bottom: 36, left: 36, right: 36 }));
});

test('rejects shell and script injection payloads', async () => {
  assert.ok(!(await isValid(D.SplitJobDto, { fileId: U, pages: '1; rm -rf /' })));
  assert.ok(!(await isValid(D.SplitJobDto, { fileId: U, pages: '1$(id)' })));
  assert.ok(!(await isValid(D.RotateJobDto, { fileId: U, pages: ['1;id'] })));
  assert.ok(!(await isValid(D.PagesJobDto, { fileId: U, operation: 'extract', pages: ['1;id'] })));
  assert.ok(!(await isValid(D.EditJobDto, { fileId: U, instructions: [{ type: 'text', page: 1, x: '0;evil()', content: 'a' }] })));
  assert.ok(!(await isValid(D.EditJobDto, { fileId: U, instructions: [{ type: 'text', page: 1, content: 'a', color: 'red");x("' }] })));
});

test('rejects out-of-range and malformed values', async () => {
  assert.ok(!(await isValid(D.PdfToImgJobDto, { fileId: U, dpi: 100000 })));
  assert.ok(!(await isValid(D.RotateJobDto, { fileId: U, degrees: 45 })));
  assert.ok(!(await isValid(D.ProtectJobDto, { fileId: U, userPassword: 'x'.repeat(200) })));
  assert.ok(!(await isValid(D.CompressJobDto, { fileId: '../../etc/passwd' })));
});
