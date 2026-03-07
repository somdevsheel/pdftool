'use client';

import { useEffect, useState } from 'react';

async function loadPdfJs(): Promise<any> {
  if ((window as any).pdfjsLib) return (window as any).pdfjsLib;
  await new Promise<void>((resolve, reject) => {
    if (document.getElementById('pdfjs-cdn')) { resolve(); return; }
    const s = document.createElement('script');
    s.id = 'pdfjs-cdn';
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    s.onload = () => resolve();
    s.onerror = reject;
    document.head.appendChild(s);
  });
  (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  return (window as any).pdfjsLib;
}

export function usePdfPageCount(file: File | null) {
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!file) { setPageCount(null); return; }
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const lib = await loadPdfJs();
        const buf = await file.arrayBuffer();
        const doc = await lib.getDocument({ data: buf }).promise;
        if (!cancelled) { setPageCount(doc.numPages); setLoading(false); }
      } catch {
        if (!cancelled) { setPageCount(null); setLoading(false); }
      }
    })();
    return () => { cancelled = true; };
  }, [file]);

  return { pageCount, loading };
}
