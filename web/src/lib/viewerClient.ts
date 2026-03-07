'use client';

let pdfjsLib: any = null;

export async function getPdfJs() {
  if (pdfjsLib) return pdfjsLib;
  // Dynamic import to avoid SSR issues
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
  pdfjsLib = pdfjs;
  return pdfjs;
}

export async function loadPdfFromUrl(url: string) {
  const pdfjs = await getPdfJs();
  return pdfjs.getDocument(url).promise;
}

export async function renderPageToCanvas(
  pdf: any,
  pageNum: number,
  canvas: HTMLCanvasElement,
  scale = 1.5,
) {
  const page = await pdf.getPage(pageNum);
  const viewport = page.getViewport({ scale });
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext('2d')!;
  await page.render({ canvasContext: ctx, viewport }).promise;
}
