import type { Metadata } from 'next';

export const metadata: Metadata = { robots: { index: false, follow: false } };

'use client';

import { useState, useRef, useCallback } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { UploadBox } from '../../components/UploadBox';

export default function ViewerPage() {
  const [pdfUrl, setPdfUrl]       = useState<string | null>(null);
  const [numPages, setNumPages]   = useState(0);
  const [currentPage, setPage]    = useState(1);
  const [scale, setScale]         = useState(1.4);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const canvasRef                  = useRef<HTMLCanvasElement>(null);
  const pdfRef                     = useRef<any>(null);

  const renderPage = useCallback(async (pdf: any, pageNum: number, sc: number) => {
    if (!canvasRef.current) return;
    const page     = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: sc });
    const canvas   = canvasRef.current;
    canvas.width   = viewport.width;
    canvas.height  = viewport.height;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport }).promise;
  }, []);

  async function handleFiles(raw: File[]) {
    const file = raw[0];
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const url = URL.createObjectURL(file);
      setPdfUrl(url);

      const { default: pdfjs } = await import('pdfjs-dist') as any;
      pdfjs.GlobalWorkerOptions.workerSrc =
        `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

      const pdf = await pdfjs.getDocument(url).promise;
      pdfRef.current = pdf;
      setNumPages(pdf.numPages);
      setPage(1);
      await renderPage(pdf, 1, scale);
    } catch (err: any) {
      setError(`Could not load PDF: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function goToPage(p: number) {
    if (!pdfRef.current) return;
    const clamped = Math.max(1, Math.min(p, numPages));
    setPage(clamped);
    await renderPage(pdfRef.current, clamped, scale);
  }

  async function changeScale(s: number) {
    setScale(s);
    if (pdfRef.current) await renderPage(pdfRef.current, currentPage, s);
  }

  function handleReset() {
    setPdfUrl(null);
    pdfRef.current = null;
    setNumPages(0);
    setPage(1);
    setError(null);
  }

  return (
    <ToolLayout
      title="PDF Viewer"
      tagline="View any PDF file in your browser — no download required."
      icon="👁️"
      accentColor="var(--ink)"
    >
      {!pdfUrl && (
        <div className="space-y-4">
          <UploadBox
            onFiles={handleFiles}
            maxFiles={1}
            label="Drop a PDF to view"
            sublabel="Rendered with PDF.js — stays in your browser"
            loading={loading}
          />
        </div>
      )}

      {pdfUrl && (
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex items-center gap-4 p-3 rounded-md bg-paper-warm border border-paper-mid flex-wrap">
            {/* Page nav */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="w-8 h-8 flex items-center justify-center rounded border border-paper-mid
                  hover:bg-paper disabled:opacity-30 transition-colors"
              >
                ‹
              </button>
              <div className="flex items-center gap-1.5 text-sm">
                <input
                  type="number"
                  min={1}
                  max={numPages}
                  value={currentPage}
                  onChange={(e) => goToPage(parseInt(e.target.value, 10))}
                  className="w-12 text-center border border-paper-mid rounded px-1 py-1
                    text-sm font-mono bg-paper focus:outline-none"
                />
                <span className="text-ink-muted">/ {numPages}</span>
              </div>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= numPages}
                className="w-8 h-8 flex items-center justify-center rounded border border-paper-mid
                  hover:bg-paper disabled:opacity-30 transition-colors"
              >
                ›
              </button>
            </div>

            <div className="w-px h-6 bg-paper-mid" />

            {/* Zoom */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => changeScale(Math.max(0.5, scale - 0.2))}
                className="w-8 h-8 flex items-center justify-center rounded border border-paper-mid
                  hover:bg-paper text-lg transition-colors"
              >−</button>
              <span className="text-sm font-mono w-12 text-center">{Math.round(scale * 100)}%</span>
              <button
                onClick={() => changeScale(Math.min(3, scale + 0.2))}
                className="w-8 h-8 flex items-center justify-center rounded border border-paper-mid
                  hover:bg-paper text-lg transition-colors"
              >+</button>
            </div>

            <button
              onClick={handleReset}
              className="ml-auto text-xs text-ink-muted underline underline-offset-2 hover:text-ink"
            >
              Close
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-md">{error}</p>
          )}

          {/* Canvas */}
          <div className="overflow-auto rounded-lg border border-paper-mid bg-[#888] shadow-paper-lg">
            <div className="flex justify-center p-6">
              <canvas
                ref={canvasRef}
                className="shadow-paper-lg bg-white max-w-full"
              />
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
