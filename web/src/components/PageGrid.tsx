'use client';

import { useEffect, useRef, useState } from 'react';

/* ─── PDF.js loader ─────────────────────────────────────────────────────── */
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

/* ─── Single page thumbnail ─────────────────────────────────────────────── */
function PageThumb({
  file, pageNum, thumbWidth = 120,
}: { file: File; pageNum: number; thumbWidth?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const lib = await loadPdfJs();
        const buf = await file.arrayBuffer();
        const doc = await lib.getDocument({ data: buf }).promise;
        const page = await doc.getPage(pageNum);
        const vp0 = page.getViewport({ scale: 1 });
        const vp = page.getViewport({ scale: thumbWidth / vp0.width });
        if (cancelled) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = vp.width;
        canvas.height = vp.height;
        await page.render({ canvasContext: canvas.getContext('2d')!, viewport: vp }).promise;
        if (!cancelled) setReady(true);
      } catch { /* skip */ }
    })();
    return () => { cancelled = true; };
  }, [file, pageNum, thumbWidth]);

  const h = Math.round(thumbWidth * 1.414);
  return (
    <div style={{
      width: thumbWidth, height: h,
      background: 'var(--surface-3)', borderRadius: 4,
      overflow: 'hidden', position: 'relative',
    }}>
      {!ready && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg,var(--surface-3) 25%,var(--surface-2) 50%,var(--surface-3) 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.4s infinite',
        }} />
      )}
      <canvas
        ref={canvasRef}
        style={{ display: ready ? 'block' : 'none', width: '100%', background: '#fff' }}
      />
    </div>
  );
}

/* ─── PageCard — one cell in the grid ──────────────────────────────────── */
export interface PageCardProps {
  file: File;
  pageNum: number;
  displayNum: number;     // number shown in badge (position in output)
  selected: boolean;      // highlighted/checked
  dimmed: boolean;        // grayed out (marked for deletion)
  dragging: boolean;
  dragOver: boolean;
  mode: PageGridMode;
  onToggle: () => void;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  onDrop: () => void;
}

function PageCard({
  file, pageNum, displayNum, selected, dimmed, dragging, dragOver,
  mode, onToggle, onDragStart, onDragOver, onDragEnd, onDrop,
}: PageCardProps) {
  const isDraggable = mode === 'reorder' || mode === 'organize';

  // Badge color
  const badgeBg = selected
    ? 'var(--accent)'
    : dimmed
      ? '#555'
      : 'var(--surface-3)';
  const badgeColor = selected || dimmed ? '#fff' : 'var(--text-muted)';

  return (
    <div
      draggable={isDraggable}
      onDragStart={onDragStart}
      onDragOver={e => { e.preventDefault(); onDragOver(e); }}
      onDragEnd={onDragEnd}
      onDrop={e => { e.preventDefault(); onDrop(); }}
      onClick={onToggle}
      title={`Page ${pageNum}`}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        padding: 8, borderRadius: 8, cursor: isDraggable ? 'grab' : 'pointer',
        background: dragOver ? 'var(--surface-3)' : 'var(--surface-2)',
        border: `2px solid ${
          dragOver ? 'var(--accent)' :
          selected ? 'var(--accent)' :
          dimmed   ? 'var(--border)' :
                     'transparent'
        }`,
        opacity: dragging ? 0.35 : dimmed ? 0.45 : 1,
        transition: 'border-color 0.12s, opacity 0.12s, background 0.12s',
        userSelect: 'none', position: 'relative',
      }}
    >
      {/* Checkmark overlay for select modes */}
      {(mode === 'delete' || mode === 'extract') && selected && (
        <div style={{
          position: 'absolute', top: 6, right: 6, zIndex: 2,
          width: 18, height: 18, borderRadius: '50%',
          background: 'var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}

      <PageThumb file={file} pageNum={pageNum} thumbWidth={110} />

      {/* Page number badge */}
      <div style={{
        fontSize: 11, fontWeight: 600, fontFamily: 'monospace',
        padding: '2px 8px', borderRadius: 4,
        background: badgeBg, color: badgeColor,
        minWidth: 28, textAlign: 'center',
      }}>
        {displayNum}
      </div>

      {/* Drag hint for reorder */}
      {isDraggable && (
        <div style={{ fontSize: 9, color: 'var(--text-muted)', opacity: 0.5 }}>⠿ drag</div>
      )}
    </div>
  );
}

/* ─── PageGrid modes ────────────────────────────────────────────────────── */
export type PageGridMode = 'delete' | 'extract' | 'reorder' | 'organize';

export interface PageGridProps {
  file: File;
  totalPages: number;
  mode: PageGridMode;
  // Controlled state
  selectedPages: Set<number>;   // for delete/extract: which pages are ticked
  pageOrder: number[];          // for reorder/organize: current order array
  onSelectedChange: (s: Set<number>) => void;
  onOrderChange: (order: number[]) => void;
}

export function PageGrid({
  file, totalPages, mode,
  selectedPages, pageOrder,
  onSelectedChange, onOrderChange,
}: PageGridProps) {
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  /* ── Select / deselect a page ── */
  function togglePage(pageNum: number) {
    if (mode === 'reorder') return; // reorder uses drag only
    const next = new Set(selectedPages);
    if (next.has(pageNum)) next.delete(pageNum);
    else next.add(pageNum);
    onSelectedChange(next);
  }

  /* ── Drag-to-reorder ── */
  function handleDrop(dropIdx: number) {
    if (dragIdx === null || dragIdx === dropIdx) {
      setDragIdx(null); setOverIdx(null); return;
    }
    const next = [...pageOrder];
    const [item] = next.splice(dragIdx, 1);
    next.splice(dropIdx, 0, item);
    onOrderChange(next);
    setDragIdx(null); setOverIdx(null);
  }

  /* ── Select all / none helpers ── */
  function selectAll() { onSelectedChange(new Set(pageOrder)); }
  function selectNone() { onSelectedChange(new Set()); }
  function invertSelection() {
    const next = new Set(pageOrder.filter(p => !selectedPages.has(p)));
    onSelectedChange(next);
  }

  const isSelectMode = mode === 'delete' || mode === 'extract';

  return (
    <div>
      {/* Toolbar */}
      {isSelectMode && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {selectedPages.size} of {totalPages} selected
          </span>
          <div style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
            {[
              { label: 'All', fn: selectAll },
              { label: 'None', fn: selectNone },
              { label: 'Invert', fn: invertSelection },
            ].map(({ label, fn }) => (
              <button key={label} onClick={fn}
                style={{
                  padding: '4px 10px', borderRadius: 5, fontSize: 11,
                  border: '1px solid var(--border)', background: 'var(--surface-2)',
                  color: 'var(--text-soft)', cursor: 'pointer',
                }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {mode === 'reorder' && (
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
          Drag pages to change their order in the output PDF.
        </p>
      )}

      {/* Grid */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 10,
        maxHeight: 480, overflowY: 'auto',
        padding: 4, scrollbarWidth: 'thin',
      }}>
        {pageOrder.map((pageNum, idx) => (
          <PageCard
            key={`${pageNum}-${idx}`}
            file={file}
            pageNum={pageNum}
            displayNum={idx + 1}
            selected={selectedPages.has(pageNum)}
            dimmed={mode === 'delete' && selectedPages.has(pageNum)}
            dragging={dragIdx === idx}
            dragOver={overIdx === idx && dragIdx !== idx}
            mode={mode}
            onToggle={() => togglePage(pageNum)}
            onDragStart={() => setDragIdx(idx)}
            onDragOver={() => setOverIdx(idx)}
            onDragEnd={() => { setDragIdx(null); setOverIdx(null); }}
            onDrop={() => handleDrop(idx)}
          />
        ))}
      </div>

      {/* shimmer keyframe */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}
