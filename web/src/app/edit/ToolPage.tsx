// 'use client';

// import { useState, useRef, useCallback, useEffect } from 'react';
// import { ToolLayout } from '../../components/ToolLayout';
// import { UploadBox } from '../../components/UploadBox';
// import { ProgressBar } from '../../components/ProgressBar';
// import { ResultDownload } from '../../components/ResultDownload';
// import { useUpload } from '../../hooks/useUpload';
// import { useJobStatus } from '../../hooks/useJobStatus';
// import { createEditJob } from '../../lib/jobsClient';
// import { UploadedFile, EditInstruction } from '../../types/web.types';

// type Phase = 'upload' | 'edit' | 'processing' | 'done' | 'error';

// interface TextItem {
//   id: string;
//   page: number;
//   x: number; y: number;
//   pdfX: number; pdfY: number;
//   text: string;
//   fontSize: number;
//   color: string;
//   fontFamily: string;
//   bold: boolean;
//   italic: boolean;
// }

// const accent = '#c2410c';
// const FONTS = ['Helvetica', 'Times-Roman', 'Courier'];
// const PRESET_COLORS = ['#000000','#ffffff','#eb1000','#0070f3','#16a085','#f59e0b','#8e44ad','#e67e22','#2c3e50','#1abc9c'];
// const FONT_SIZES = [8, 10, 12, 14, 18, 24, 36, 48];
// function genId() { return Math.random().toString(36).slice(2, 9); }

// export default function EditPage() {
//   const [file, setFile]               = useState<UploadedFile | null>(null);
//   const [rawFile, setRawFile]         = useState<File | null>(null);
//   const [phase, setPhase]             = useState<Phase>('upload');
//   const [items, setItems]             = useState<TextItem[]>([]);
//   const [selectedId, setSelectedId]   = useState<string | null>(null);
//   const [editingId, setEditingId]     = useState<string | null>(null);
//   const [editingText, setEditingText] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [numPages, setNumPages]       = useState(0);
//   const [canvasSize, setCanvasSize]   = useState({ w: 0, h: 0 });
//   const [pdfRendering, setPdfRendering] = useState(false);
//   const [error, setError]             = useState<string | null>(null);
//   const [zoom, setZoom]               = useState(1);
//   const [fontSize, setFontSize]       = useState(14);
//   const [color, setColor]             = useState('#000000');
//   const [fontFamily, setFontFamily]   = useState('Helvetica');
//   const [bold, setBold]               = useState(false);
//   const [italic, setItalic]           = useState(false);
//   const [activeTool, setActiveTool]   = useState<'select'|'text'>('text');
//   const [sideTab, setSideTab]         = useState<'text'|'pages'>('text');

//   const canvasRef    = useRef<HTMLCanvasElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const pdfRef       = useRef<any>(null);
//   const renderTask   = useRef<any>(null);
//   const dragRef      = useRef<{ id: string; ox: number; oy: number } | null>(null);

//   const { state: uploadState, progress: uploadProgress, upload } = useUpload();
//   const { job, poll, reset: resetJob } = useJobStatus();

//   // ── PDF.js ────────────────────────────────────────────────────────────────
//   const renderPage = useCallback(async (pageNum: number, scale: number) => {
//     if (!pdfRef.current || !canvasRef.current) return;
//     if (renderTask.current) { try { renderTask.current.cancel(); } catch {} }
//     setPdfRendering(true);
//     try {
//       const page = await pdfRef.current.getPage(pageNum);
//       const vp = page.getViewport({ scale });
//       const canvas = canvasRef.current;
//       canvas.width = vp.width;
//       canvas.height = vp.height;
//       setCanvasSize({ w: vp.width, h: vp.height });
//       renderTask.current = page.render({ canvasContext: canvas.getContext('2d')!, viewport: vp });
//       await renderTask.current.promise;
//     } catch (e: any) {
//       if (e?.name !== 'RenderingCancelledException') console.error(e);
//     } finally { setPdfRendering(false); }
//   }, []);

//   const loadPdf = useCallback(async (f: File) => {
//     // @ts-ignore
//     if (!window.pdfjsLib) {
//       await new Promise<void>((res, rej) => {
//         const s = document.createElement('script');
//         s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
//         s.onload = () => res(); s.onerror = rej;
//         document.head.appendChild(s);
//       });
//       // @ts-ignore
//       window.pdfjsLib.GlobalWorkerOptions.workerSrc =
//         'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
//     }
//     // @ts-ignore
//     const pdf = await window.pdfjsLib.getDocument({ data: await f.arrayBuffer() }).promise;
//     pdfRef.current = pdf;
//     setNumPages(pdf.numPages);
//     setCurrentPage(1);

//     // Compute fit-to-width scale BEFORE first render
//     const firstPage = await pdf.getPage(1);
//     const naturalW = firstPage.getViewport({ scale: 1 }).width;
//     // containerRef may not be mounted yet for the editor; use window width minus sidebar
//     const availW = window.innerWidth - 220 - 56;
//     const fitScale = Math.max(0.5, Math.floor((availW / naturalW) * 100) / 100);
//     setZoom(fitScale);
//     await renderPage(1, fitScale);
//   }, [renderPage]);

//   useEffect(() => { if (rawFile && phase === 'edit') loadPdf(rawFile); }, [rawFile, phase]);
//   useEffect(() => {
//     if (pdfRef.current && canvasSize.w > 0) renderPage(currentPage, zoom);
//   }, [currentPage, zoom]);

//   async function handleDrop(raw: File[]) {
//     const uploaded = await upload(raw);
//     if (uploaded?.[0]) { setFile(uploaded[0]); setRawFile(raw[0]); setPhase('edit'); }
//   }

//   // ── Canvas click ──────────────────────────────────────────────────────────
//   function handleCanvasClick(e: React.MouseEvent<HTMLCanvasElement>) {
//     if (activeTool !== 'text') return;
//     const canvas = canvasRef.current!;
//     const rect = canvas.getBoundingClientRect();
//     const scaleX = canvas.width / rect.width;
//     const scaleY = canvas.height / rect.height;
//     const cx = (e.clientX - rect.left) * scaleX;
//     const cy = (e.clientY - rect.top) * scaleY;
//     const item: TextItem = {
//       id: genId(), page: currentPage,
//       x: cx, y: cy,
//       pdfX: Math.round((cx / canvas.width) * 595),
//       pdfY: Math.round((1 - cy / canvas.height) * 842),
//       text: '', fontSize, color, fontFamily, bold, italic,
//     };
//     setItems(prev => [...prev, item]);
//     setSelectedId(item.id);
//     setEditingId(item.id);
//     setEditingText('');
//   }

//   // ── Drag ──────────────────────────────────────────────────────────────────
//   function handleItemMouseDown(e: React.MouseEvent, id: string) {
//     if (editingId === id) return;
//     e.stopPropagation();
//     setSelectedId(id);
//     dragRef.current = { id, ox: e.clientX, oy: e.clientY };
//     window.addEventListener('mousemove', onDragMove);
//     window.addEventListener('mouseup', onDragEnd);
//   }
//   function onDragMove(e: MouseEvent) {
//     if (!dragRef.current || !canvasRef.current) return;
//     const { id } = dragRef.current;
//     const canvas = canvasRef.current;
//     const rect = canvas.getBoundingClientRect();
//     const scaleX = canvas.width / rect.width;
//     const scaleY = canvas.height / rect.height;
//     const dx = (e.clientX - dragRef.current.ox) * scaleX;
//     const dy = (e.clientY - dragRef.current.oy) * scaleY;
//     dragRef.current.ox = e.clientX; dragRef.current.oy = e.clientY;
//     setItems(prev => prev.map(it => {
//       if (it.id !== id) return it;
//       const nx = Math.max(0, Math.min(canvas.width, it.x + dx));
//       const ny = Math.max(0, Math.min(canvas.height, it.y + dy));
//       return { ...it, x: nx, y: ny,
//         pdfX: Math.round((nx / canvas.width) * 595),
//         pdfY: Math.round((1 - ny / canvas.height) * 842) };
//     }));
//   }
//   function onDragEnd() {
//     dragRef.current = null;
//     window.removeEventListener('mousemove', onDragMove);
//     window.removeEventListener('mouseup', onDragEnd);
//   }

//   function commitEdit(id: string) {
//     if (!editingText.trim()) setItems(prev => prev.filter(it => it.id !== id));
//     else setItems(prev => prev.map(it => it.id === id ? { ...it, text: editingText } : it));
//     setEditingId(null);
//   }

//   function updateSelected(patch: Partial<TextItem>) {
//     if (!selectedId) return;
//     setItems(prev => prev.map(it => it.id === selectedId ? { ...it, ...patch } : it));
//   }

//   const selected = items.find(it => it.id === selectedId);
//   const pageItems = items.filter(it => it.page === currentPage);
//   const validItems = items.filter(it => it.text.trim());

//   async function handleSave() {
//     if (!file || validItems.length === 0) { setError('Add at least one text item first.'); return; }
//     setError(null); setPhase('processing');
//     const instructions: EditInstruction[] = validItems.map(it => ({
//       type: 'text' as const, page: it.page,
//       x: it.pdfX, y: it.pdfY,
//       content: it.text, fontSize: it.fontSize, color: it.color,
//     }));
//     try {
//       const j = await createEditJob((file as any).id, instructions);
//       poll((j as any).id, (done: any) => {
//         if (done.status === 'COMPLETED') setPhase('done');
//         if (done.status === 'FAILED') { setError(done.error || 'Failed'); setPhase('error'); }
//       });
//     } catch (err: any) { setError(err.message); setPhase('error'); }
//   }

//   function handleReset() {
//     setFile(null); setRawFile(null); setPhase('upload');
//     setItems([]); setSelectedId(null); setEditingId(null);
//     setNumPages(0); setCurrentPage(1); setZoom(1);
//     setError(null); pdfRef.current = null; resetJob();
//   }

//   // ── Style helpers ─────────────────────────────────────────────────────────
//   const topBtn = (active: boolean): React.CSSProperties => ({
//     padding: '3px 10px', borderRadius: 4,
//     border: `1px solid ${active ? accent : '#3a3a3a'}`,
//     background: active ? `rgba(194,65,12,0.18)` : 'transparent',
//     color: active ? '#fff' : '#bbb',
//     fontWeight: active ? 700 : 400,
//     fontSize: 13, cursor: 'pointer', transition: 'all 0.12s',
//   });
//   const sideLabel: React.CSSProperties = {
//     fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
//     letterSpacing: '0.07em', color: '#666', marginBottom: 4,
//   };

//   // ── UPLOAD phase — use ToolLayout so header/footer/SEO content stays ──────
//   if (phase === 'upload') return (
//     <ToolLayout toolTag="Edit PDF" title="Edit PDF" tagline="Add text to your PDF — click to place, drag to reposition." icon="✏️" accentColor={accent}>
//       <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
//         <UploadBox
//           onFiles={handleDrop}
//           maxFiles={1}
//           label="Drop a PDF to edit"
//           accept={{ 'application/pdf': ['.pdf'] }}
//         />
//         {uploadState === 'uploading' && <ProgressBar uploadProgress={uploadProgress} />}
//       </div>
//     </ToolLayout>
//   );

//   // ── PROCESSING ────────────────────────────────────────────────────────────
//   if (phase === 'processing') return (
//     <ToolLayout title="Edit PDF" tagline="Saving your edits…" icon="✏️" accentColor={accent}>
//       <div style={{ padding: '48px 0', maxWidth: 440, margin: '0 auto', textAlign: 'center' }}>
//         <ProgressBar job={job} />
//         <p style={{ marginTop: 16, fontSize: 13, color: 'var(--text-muted)' }}>Applying edits to PDF…</p>
//       </div>
//     </ToolLayout>
//   );

//   // ── DONE ─────────────────────────────────────────────────────────────────
//   if (phase === 'done' && job) return (
//     <ToolLayout title="Edit PDF" tagline="Your edited PDF is ready." icon="✏️" accentColor={accent}>
//       <ResultDownload jobId={(job as any).id} filename="edited.pdf" onReset={handleReset} />
//     </ToolLayout>
//   );

//   // ── ERROR ────────────────────────────────────────────────────────────────
//   if (phase === 'error') return (
//     <ToolLayout title="Edit PDF" tagline="" icon="✏️" accentColor={accent}>
//       <div style={{ padding: '40px 0', textAlign: 'center' }}>
//         <p style={{ color: '#eb1000', marginBottom: 16 }}>{error}</p>
//         <button onClick={handleReset} style={{ fontSize: 13, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
//           Try again
//         </button>
//       </div>
//     </ToolLayout>
//   );

//   // ── EDITOR — full-screen overlay on top of the page ──────────────────────
//   return (
//     <div style={{
//       position: 'fixed', inset: 0, zIndex: 1000,
//       display: 'flex', flexDirection: 'column',
//       background: '#1a1a1a', color: '#e8e8e8',
//       fontFamily: 'system-ui, sans-serif',
//       overflow: 'hidden',
//     }}>

//       {/* ── TOP BAR ── */}
//       <div style={{
//         height: 46, background: '#252525',
//         borderBottom: '1px solid #333',
//         display: 'flex', alignItems: 'center',
//         gap: 6, padding: '0 12px', flexShrink: 0, zIndex: 30,
//       }}>
//         <button onClick={handleReset} title="Close editor"
//           style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: '#3a3a3a', color: '#aaa', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
//           ×
//         </button>
//         <div style={{ width: 1, height: 22, background: '#3a3a3a', margin: '0 4px' }} />
//         <span style={{ fontSize: 13, fontWeight: 600, color: '#ccc', marginRight: 4 }}>Edit PDF</span>
//         <div style={{ width: 1, height: 22, background: '#3a3a3a', margin: '0 4px' }} />

//         {/* Tool toggle */}
//         <button style={topBtn(activeTool === 'select')} onClick={() => setActiveTool('select')}>▲ Select</button>
//         <button style={topBtn(activeTool === 'text')} onClick={() => setActiveTool('text')}>T Add Text</button>
//         <div style={{ width: 1, height: 22, background: '#3a3a3a', margin: '0 4px' }} />

//         {/* Font family */}
//         <select value={selected ? selected.fontFamily : fontFamily}
//           onChange={e => { const v = e.target.value; if (selected) updateSelected({ fontFamily: v }); else setFontFamily(v); }}
//           style={{ background: '#333', border: '1px solid #444', color: '#e8e8e8', borderRadius: 4, padding: '3px 6px', fontSize: 12, cursor: 'pointer', width: 126 }}>
//           {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
//         </select>

//         {/* Font size */}
//         <input type="number" min={6} max={144}
//           value={selected ? selected.fontSize : fontSize}
//           onChange={e => { const v = Number(e.target.value); if (selected) updateSelected({ fontSize: v }); else setFontSize(v); }}
//           style={{ width: 46, background: '#333', border: '1px solid #444', color: '#e8e8e8', borderRadius: 4, padding: '3px 6px', fontSize: 12, textAlign: 'center' }} />

//         {/* Bold / Italic */}
//         <button style={topBtn(selected ? selected.bold : bold)}
//           onClick={() => { if (selected) updateSelected({ bold: !selected.bold }); else setBold(b => !b); }}>
//           <strong>B</strong>
//         </button>
//         <button style={{ ...topBtn(selected ? selected.italic : italic), fontStyle: 'italic' }}
//           onClick={() => { if (selected) updateSelected({ italic: !selected.italic }); else setItalic(it => !it); }}>
//           <em>I</em>
//         </button>

//         {/* Color swatch */}
//         <div title="Text color" style={{ width: 24, height: 24, borderRadius: 4, background: selected ? selected.color : color, border: '2px solid #555', overflow: 'hidden', position: 'relative', cursor: 'pointer', flexShrink: 0 }}>
//           <input type="color" value={selected ? selected.color : color}
//             onChange={e => { if (selected) updateSelected({ color: e.target.value }); else setColor(e.target.value); }}
//             style={{ position: 'absolute', inset: -2, width: '150%', height: '150%', opacity: 0, cursor: 'pointer' }} />
//         </div>

//         <div style={{ flex: 1 }} />

//         {/* Zoom controls */}
//         <button onClick={() => setZoom(z => Math.max(0.3, parseFloat((z - 0.1).toFixed(1))))}
//           style={{ ...topBtn(false), padding: '3px 9px' }}>−</button>
//         <span style={{ fontSize: 12, color: '#888', minWidth: 44, textAlign: 'center' }}>{Math.round(zoom * 100)}%</span>
//         <button onClick={() => setZoom(z => Math.min(3, parseFloat((z + 0.1).toFixed(1))))}
//           style={{ ...topBtn(false), padding: '3px 9px' }}>+</button>
//         <button onClick={async () => {
//           if (!pdfRef.current) return;
//           const page = await pdfRef.current.getPage(currentPage);
//           const naturalW = page.getViewport({ scale: 1 }).width;
//           const availW = (containerRef.current?.clientWidth ?? window.innerWidth - 220) - 56;
//           setZoom(Math.max(0.5, Math.floor((availW / naturalW) * 100) / 100));
//         }} style={{ ...topBtn(false), padding: '3px 9px', fontSize: 11 }}>Fit</button>

//         <div style={{ width: 1, height: 22, background: '#3a3a3a', margin: '0 4px' }} />

//         {/* Page navigation */}
//         <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage <= 1}
//           style={{ ...topBtn(false), opacity: currentPage <= 1 ? 0.35 : 1, padding: '3px 9px' }}>‹</button>
//         <span style={{ fontSize: 12, color: '#999', minWidth: 68, textAlign: 'center' }}>
//           {pdfRendering ? '…' : `${currentPage} / ${numPages || '?'}`}
//         </span>
//         <button onClick={() => setCurrentPage(p => numPages ? Math.min(numPages, p + 1) : p + 1)}
//           disabled={numPages > 0 && currentPage >= numPages}
//           style={{ ...topBtn(false), opacity: (numPages > 0 && currentPage >= numPages) ? 0.35 : 1, padding: '3px 9px' }}>›</button>

//         <div style={{ width: 1, height: 22, background: '#3a3a3a', margin: '0 4px' }} />

//         {/* Save */}
//         <button onClick={handleSave} disabled={validItems.length === 0}
//           style={{ padding: '5px 20px', borderRadius: 6, border: 'none', background: validItems.length > 0 ? accent : '#383838', color: validItems.length > 0 ? '#fff' : '#555', fontWeight: 700, fontSize: 13, cursor: validItems.length > 0 ? 'pointer' : 'not-allowed', transition: 'background 0.15s' }}>
//           Save{validItems.length > 0 ? ` (${validItems.length})` : ''}
//         </button>
//       </div>

//       {/* ── BODY ── */}
//       <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

//         {/* ── LEFT SIDEBAR ── */}
//         <div style={{ width: 220, background: '#222', borderRight: '1px solid #2e2e2e', display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden' }}>
//           {/* Tab strip */}
//           <div style={{ display: 'flex', borderBottom: '1px solid #2e2e2e', flexShrink: 0 }}>
//             {(['text', 'pages'] as const).map(tab => (
//               <button key={tab} onClick={() => setSideTab(tab)} style={{
//                 flex: 1, padding: '10px 0', border: 'none', background: 'transparent',
//                 color: sideTab === tab ? '#fff' : '#555',
//                 fontSize: 12, fontWeight: 600, cursor: 'pointer',
//                 borderBottom: `2px solid ${sideTab === tab ? accent : 'transparent'}`,
//                 textTransform: 'capitalize', transition: 'all 0.15s',
//               }}>{tab === 'text' ? 'Text' : 'Pages'}</button>
//             ))}
//           </div>

//           <div style={{ flex: 1, overflowY: 'auto', padding: 14 }}>
//             {sideTab === 'text' && (
//               <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

//                 {/* Tool hint */}
//                 <div style={{ padding: '10px 12px', borderRadius: 8, background: activeTool === 'text' ? 'rgba(194,65,12,0.1)' : '#2a2a2a', border: `1px solid ${activeTool === 'text' ? 'rgba(194,65,12,0.35)' : '#333'}`, fontSize: 12, color: '#888', lineHeight: 1.55 }}>
//                   {activeTool === 'text'
//                     ? <><span style={{ color: accent, fontWeight: 700 }}>✏ Text tool active</span><br />Click on the PDF to place a text box</>
//                     : <><span style={{ color: '#bbb', fontWeight: 600 }}>▲ Select tool active</span><br />Click a text item to select &amp; drag</>}
//                 </div>

//                 {/* Font */}
//                 <div>
//                   <div style={sideLabel}>Font Family</div>
//                   <select value={selected ? selected.fontFamily : fontFamily}
//                     onChange={e => { const v = e.target.value; if (selected) updateSelected({ fontFamily: v }); else setFontFamily(v); }}
//                     style={{ width: '100%', background: '#2a2a2a', border: '1px solid #3a3a3a', color: '#e8e8e8', borderRadius: 6, padding: '7px 10px', fontSize: 13 }}>
//                     {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
//                   </select>
//                 </div>

//                 {/* Size */}
//                 <div>
//                   <div style={sideLabel}>Size: {selected ? selected.fontSize : fontSize}pt</div>
//                   <input type="range" min={6} max={96} value={selected ? selected.fontSize : fontSize}
//                     onChange={e => { const v = Number(e.target.value); if (selected) updateSelected({ fontSize: v }); else setFontSize(v); }}
//                     style={{ width: '100%', accentColor: accent, marginBottom: 8 }} />
//                   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 4 }}>
//                     {FONT_SIZES.map(s => (
//                       <button key={s} onClick={() => { if (selected) updateSelected({ fontSize: s }); else setFontSize(s); }}
//                         style={{ padding: '4px 0', borderRadius: 5, border: `1px solid ${(selected ? selected.fontSize : fontSize) === s ? accent : '#3a3a3a'}`, background: (selected ? selected.fontSize : fontSize) === s ? 'rgba(194,65,12,0.15)' : '#2a2a2a', color: (selected ? selected.fontSize : fontSize) === s ? accent : '#888', fontSize: 11, cursor: 'pointer' }}>
//                         {s}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Style */}
//                 <div>
//                   <div style={sideLabel}>Style</div>
//                   <div style={{ display: 'flex', gap: 8 }}>
//                     <button style={{ ...topBtn(selected ? selected.bold : bold), flex: 1, padding: '7px 0' }}
//                       onClick={() => { if (selected) updateSelected({ bold: !selected.bold }); else setBold(b => !b); }}>
//                       <strong>Bold</strong>
//                     </button>
//                     <button style={{ ...topBtn(selected ? selected.italic : italic), flex: 1, padding: '7px 0', fontStyle: 'italic' }}
//                       onClick={() => { if (selected) updateSelected({ italic: !selected.italic }); else setItalic(it => !it); }}>
//                       <em>Italic</em>
//                     </button>
//                   </div>
//                 </div>

//                 {/* Color */}
//                 <div>
//                   <div style={sideLabel}>Color</div>
//                   <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
//                     {PRESET_COLORS.map(c => (
//                       <button key={c} onClick={() => { if (selected) updateSelected({ color: c }); else setColor(c); }}
//                         style={{ width: 24, height: 24, borderRadius: '50%', background: c, cursor: 'pointer', border: `2.5px solid ${(selected ? selected.color : color) === c ? accent : 'transparent'}`, boxShadow: '0 0 0 1px rgba(255,255,255,0.08)', transition: 'border-color 0.1s', flexShrink: 0 }} />
//                     ))}
//                     <div style={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid #555', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
//                       <input type="color" value={selected ? selected.color : color}
//                         onChange={e => { if (selected) updateSelected({ color: e.target.value }); else setColor(e.target.value); }}
//                         style={{ position: 'absolute', inset: -3, width: '150%', height: '150%', cursor: 'pointer' }} />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Items on this page */}
//                 {pageItems.filter(it => it.text.trim()).length > 0 && (
//                   <div>
//                     <div style={sideLabel}>On page {currentPage} ({pageItems.filter(it => it.text.trim()).length})</div>
//                     <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
//                       {pageItems.filter(it => it.text.trim()).map(it => (
//                         <div key={it.id} onClick={() => { setSelectedId(it.id); setActiveTool('select'); }}
//                           style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 8px', borderRadius: 6, background: selectedId === it.id ? 'rgba(194,65,12,0.15)' : '#2a2a2a', border: `1px solid ${selectedId === it.id ? accent : '#333'}`, cursor: 'pointer' }}>
//                           <div style={{ width: 8, height: 8, borderRadius: '50%', background: it.color, flexShrink: 0, boxShadow: '0 0 0 1px rgba(255,255,255,0.1)' }} />
//                           <span style={{ flex: 1, fontSize: 12, color: '#ccc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.text}</span>
//                           <span style={{ fontSize: 10, color: '#555', flexShrink: 0 }}>{it.fontSize}pt</span>
//                           <button onMouseDown={e => e.stopPropagation()}
//                             onClick={e => { e.stopPropagation(); setItems(prev => prev.filter(x => x.id !== it.id)); if (selectedId === it.id) setSelectedId(null); }}
//                             style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 14, lineHeight: 1, padding: 0, flexShrink: 0 }}>×</button>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Delete selected */}
//                 {selected && (
//                   <button onClick={() => { setItems(prev => prev.filter(it => it.id !== selectedId)); setSelectedId(null); }}
//                     style={{ padding: '8px 0', borderRadius: 6, border: '1px solid #c0392b', background: 'rgba(192,57,43,0.1)', color: '#e74c3c', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
//                     Delete selected
//                   </button>
//                 )}

//                 {/* How-to */}
//                 <div style={{ padding: '10px 12px', borderRadius: 8, background: '#2a2a2a', border: '1px solid #333', fontSize: 11, color: '#555', lineHeight: 1.7 }}>
//                   <strong style={{ color: '#777' }}>How to use</strong><br />
//                   1. Select <em>Add Text</em> tool above<br />
//                   2. Click on the PDF to place text<br />
//                   3. Type and press Enter to confirm<br />
//                   4. Switch to <em>Select</em> to drag<br />
//                   5. Double-click to re-edit text<br />
//                   6. Click Save when done
//                 </div>
//               </div>
//             )}

//             {sideTab === 'pages' && (
//               <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
//                 <div style={{ fontSize: 11, color: '#555', marginBottom: 4 }}>{numPages} page{numPages !== 1 ? 's' : ''}</div>
//                 {Array.from({ length: numPages }, (_, i) => i + 1).map(p => (
//                   <button key={p} onClick={() => setCurrentPage(p)}
//                     style={{ padding: '8px 12px', borderRadius: 6, border: `1px solid ${currentPage === p ? accent : '#333'}`, background: currentPage === p ? 'rgba(194,65,12,0.12)' : '#2a2a2a', color: currentPage === p ? '#fff' : '#888', fontSize: 12, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8 }}>
//                     <span style={{ width: 22, height: 22, borderRadius: 4, background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, flexShrink: 0, color: '#aaa' }}>{p}</span>
//                     Page {p}
//                     {items.filter(it => it.page === p && it.text.trim()).length > 0 && (
//                       <span style={{ marginLeft: 'auto', fontSize: 10, color: accent }}>
//                         {items.filter(it => it.page === p && it.text.trim()).length} edit{items.filter(it => it.page === p && it.text.trim()).length !== 1 ? 's' : ''}
//                       </span>
//                     )}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* ── PDF CANVAS AREA ── */}
//         <div ref={containerRef}
//           style={{ flex: 1, overflow: 'auto', background: '#3d3d3d', display: 'flex', justifyContent: 'center', padding: '28px 28px 60px', cursor: activeTool === 'text' ? 'text' : 'default' }}
//           onClick={() => { if (activeTool === 'select') setSelectedId(null); }}>

//           <div style={{ position: 'relative', boxShadow: '0 8px 48px rgba(0,0,0,0.6)', lineHeight: 0, alignSelf: 'flex-start' }}>
//             <canvas ref={canvasRef} style={{ display: 'block', cursor: activeTool === 'text' ? 'text' : 'default' }}
//               onClick={handleCanvasClick} />

//             {/* Text overlays */}
//             {canvasSize.w > 0 && pageItems.map(item => {
//               const isSelected = item.id === selectedId;
//               const isEditing = item.id === editingId;
//               const dispX = (item.x / canvasSize.w) * 100;
//               const dispY = (item.y / canvasSize.h) * 100;
//               return (
//                 <div key={item.id}
//                   style={{ position: 'absolute', left: `${dispX}%`, top: `${dispY}%`, transform: 'translateY(-50%)', zIndex: isSelected ? 20 : 10, userSelect: 'none', pointerEvents: 'all' }}
//                   onMouseDown={e => handleItemMouseDown(e, item.id)}
//                   onDoubleClick={e => { e.stopPropagation(); setEditingId(item.id); setEditingText(item.text); }}
//                   onClick={e => e.stopPropagation()}>

//                   {isEditing ? (
//                     <input autoFocus value={editingText}
//                       onChange={e => setEditingText(e.target.value)}
//                       onBlur={() => commitEdit(item.id)}
//                       onKeyDown={e => { if (e.key === 'Enter') commitEdit(item.id); if (e.key === 'Escape') { setEditingId(null); if (!item.text) setItems(prev => prev.filter(it => it.id !== item.id)); } }}
//                       style={{ fontSize: `${item.fontSize * zoom}px`, color: item.color, fontFamily: item.fontFamily, fontWeight: item.bold ? 'bold' : 'normal', fontStyle: item.italic ? 'italic' : 'normal', background: 'rgba(255,255,255,0.96)', border: `2px solid ${accent}`, borderRadius: 2, outline: 'none', padding: '1px 6px', minWidth: 80, cursor: 'text', lineHeight: 1.3, boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }} />
//                   ) : (
//                     <span style={{ fontSize: `${item.fontSize * zoom}px`, color: item.color, fontFamily: item.fontFamily, fontWeight: item.bold ? 'bold' : 'normal', fontStyle: item.italic ? 'italic' : 'normal', display: 'inline-block', whiteSpace: 'nowrap', lineHeight: 1.3, cursor: activeTool === 'select' || isSelected ? 'move' : 'text', padding: '0 3px', background: isSelected ? 'rgba(194,65,12,0.1)' : 'transparent', outline: isSelected ? `2px dashed ${accent}` : item.text ? 'none' : `2px dashed rgba(194,65,12,0.4)`, outlineOffset: 2, borderRadius: 2, minWidth: item.text ? undefined : 60 }}>
//                       {item.text || <span style={{ color: 'rgba(194,65,12,0.55)', fontStyle: 'italic', fontSize: `${Math.min(item.fontSize * zoom, 13)}px` }}>Click to type…</span>}
//                     </span>
//                   )}

//                   {isSelected && !isEditing && item.text && (
//                     <button onMouseDown={e => e.stopPropagation()}
//                       onClick={e => { e.stopPropagation(); setItems(prev => prev.filter(it => it.id !== item.id)); setSelectedId(null); }}
//                       style={{ position: 'absolute', top: -8, right: -8, width: 18, height: 18, borderRadius: '50%', background: '#eb1000', border: '2px solid #fff', color: '#fff', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, zIndex: 30, boxShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
//                       ×
//                     </button>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       {/* ── STATUS BAR ── */}
//       <div style={{ height: 26, background: '#1e1e1e', borderTop: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', padding: '0 14px', gap: 16, flexShrink: 0 }}>
//         <span style={{ fontSize: 11, color: activeTool === 'text' ? accent : '#555', fontWeight: activeTool === 'text' ? 600 : 400 }}>
//           {activeTool === 'text' ? '✏ Text tool — click PDF to add text' : '▲ Select — click text to select, drag to move'}
//         </span>
//         <span style={{ fontSize: 11, color: '#444', marginLeft: 'auto' }}>
//           {validItems.length} edit{validItems.length !== 1 ? 's' : ''} · page {currentPage}/{numPages || '?'} · {Math.round(zoom * 100)}%
//         </span>
//         {error && <span style={{ fontSize: 11, color: '#eb1000' }}>{error}</span>}
//       </div>
//     </div>
//   );
// }







'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { UploadBox } from '../../components/UploadBox';
import { ProgressBar } from '../../components/ProgressBar';
import { ResultDownload } from '../../components/ResultDownload';
import { useUpload } from '../../hooks/useUpload';
import { useJobStatus } from '../../hooks/useJobStatus';
import { createEditJob } from '../../lib/jobsClient';
import { UploadedFile, EditInstruction } from '../../types/web.types';

type Phase = 'upload' | 'edit' | 'processing' | 'done' | 'error';

interface TextItem {
  id: string;
  page: number;
  // canvas px coords (top-left origin)
  x: number;
  y: number;
  // PDF unit coords (bottom-left origin, 0-595 / 0-842)
  pdfX: number;
  pdfY: number;
  text: string;
  fontSize: number;
  color: string;
  fontFamily: string;
  bold: boolean;
  italic: boolean;
  /** true = came from existing PDF text extraction */
  fromPdf: boolean;
  /** original extracted text (for display purposes) */
  originalText?: string;
}

const accent = '#c2410c';
const FONTS = ['Helvetica', 'Times-Roman', 'Courier'];
const PRESET_COLORS = ['#000000','#333333','#ffffff','#eb1000','#0070f3','#16a085','#f59e0b','#8e44ad','#e67e22','#2c3e50'];
const FONT_SIZES = [8, 10, 12, 14, 18, 24, 36, 48];
function genId() { return Math.random().toString(36).slice(2, 9); }

export default function EditPage() {
  const [file, setFile]               = useState<UploadedFile | null>(null);
  const [rawFile, setRawFile]         = useState<File | null>(null);
  const [phase, setPhase]             = useState<Phase>('upload');
  const [items, setItems]             = useState<TextItem[]>([]);
  const [selectedId, setSelectedId]   = useState<string | null>(null);
  const [editingId, setEditingId]     = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages]       = useState(0);
  const [canvasSize, setCanvasSize]   = useState({ w: 0, h: 0 });
  const [pdfRendering, setPdfRendering] = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [zoom, setZoom]               = useState(1);
  const [fontSize, setFontSize]       = useState(14);
  const [color, setColor]             = useState('#000000');
  const [fontFamily, setFontFamily]   = useState('Helvetica');
  const [bold, setBold]               = useState(false);
  const [italic, setItalic]           = useState(false);
  const [activeTool, setActiveTool]   = useState<'select'|'text'>('select');
  const [sideTab, setSideTab]         = useState<'text'|'pages'>('text');
  // extracted PDF text blocks for the current page
  const [pdfTextBlocks, setPdfTextBlocks] = useState<any[]>([]);

  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pdfRef       = useRef<any>(null);
  const renderTask   = useRef<any>(null);
  const dragRef      = useRef<{ id: string; ox: number; oy: number } | null>(null);
  // store viewport scale so we can map text coords
  const viewportRef  = useRef<any>(null);

  const { state: uploadState, progress: uploadProgress, upload } = useUpload();
  const { job, poll, reset: resetJob } = useJobStatus();

  // ── Load PDF.js ───────────────────────────────────────────────────────────
  async function ensurePdfJs() {
    // @ts-ignore
    if (window.pdfjsLib) return;
    await new Promise<void>((res, rej) => {
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      s.onload = () => res(); s.onerror = rej;
      document.head.appendChild(s);
    });
    // @ts-ignore
    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }

  // ── Render a page ─────────────────────────────────────────────────────────
  const renderPage = useCallback(async (pageNum: number, scale: number) => {
    if (!pdfRef.current || !canvasRef.current) return;
    if (renderTask.current) { try { renderTask.current.cancel(); } catch {} }
    setPdfRendering(true);
    try {
      const page = await pdfRef.current.getPage(pageNum);
      const vp = page.getViewport({ scale });
      viewportRef.current = vp;
      const canvas = canvasRef.current;
      canvas.width = vp.width;
      canvas.height = vp.height;
      setCanvasSize({ w: vp.width, h: vp.height });
      renderTask.current = page.render({ canvasContext: canvas.getContext('2d')!, viewport: vp });
      await renderTask.current.promise;

      // ── Extract text content for click-to-edit ──
      const tc = await page.getTextContent();
      setPdfTextBlocks(tc.items.map((item: any) => {
        // transform: [scaleX, skewX, skewY, scaleY, tx, ty]  (PDF units, bottom-left origin)
        const [sx, , , sy, tx, ty] = item.transform;
        // Convert PDF coords → canvas px using the viewport transform
        const [cx, cy] = vp.convertToViewportPoint(tx, ty);
        return {
          id: genId(),
          text: item.str,
          // canvas position (top-left corner of text baseline)
          cx, cy,
          // PDF coords
          pdfX: Math.round(tx),
          pdfY: Math.round(ty),
          // approximate font size in canvas px
          fontSizePx: Math.abs(sy) * scale,
          // approximate width
          widthPx: item.width * scale,
        };
      }).filter((b: any) => b.text.trim()));

    } catch (e: any) {
      if (e?.name !== 'RenderingCancelledException') console.error(e);
    } finally { setPdfRendering(false); }
  }, []);

  // ── Load PDF file ─────────────────────────────────────────────────────────
  const loadPdf = useCallback(async (f: File) => {
    await ensurePdfJs();
    // @ts-ignore
    const pdf = await window.pdfjsLib.getDocument({ data: await f.arrayBuffer() }).promise;
    pdfRef.current = pdf;
    setNumPages(pdf.numPages);
    setCurrentPage(1);
    setItems([]);

    const firstPage = await pdf.getPage(1);
    const naturalW = firstPage.getViewport({ scale: 1 }).width;
    const availW = window.innerWidth - 220 - 56;
    const fitScale = Math.max(0.4, Math.floor((availW / naturalW) * 100) / 100);
    setZoom(fitScale);
    await renderPage(1, fitScale);
  }, [renderPage]);

  useEffect(() => { if (rawFile && phase === 'edit') loadPdf(rawFile); }, [rawFile, phase]);
  useEffect(() => {
    if (pdfRef.current && canvasSize.w > 0) renderPage(currentPage, zoom);
  }, [currentPage, zoom]);

  async function handleDrop(raw: File[]) {
    const uploaded = await upload(raw);
    if (uploaded?.[0]) { setFile(uploaded[0]); setRawFile(raw[0]); setPhase('edit'); }
  }

  // ── Click on canvas ───────────────────────────────────────────────────────
  function handleCanvasClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const cx = (e.clientX - rect.left) * scaleX;
    const cy = (e.clientY - rect.top) * scaleY;

    // ── Try to hit an existing PDF text block ──
    const hitBlock = pdfTextBlocks.find(b => {
      const bx = b.cx;
      const by = b.cy - b.fontSizePx; // top of text (cy is baseline)
      const bw = Math.max(b.widthPx, 30);
      const bh = b.fontSizePx * 1.4;
      return cx >= bx - 4 && cx <= bx + bw + 4 && cy >= by - 4 && cy <= by + bh + 4;
    });

    if (hitBlock) {
      // Check if we already have an edit item for this block
      const existing = items.find(it =>
        it.fromPdf && it.pdfX === hitBlock.pdfX && it.pdfY === hitBlock.pdfY && it.page === currentPage
      );
      if (existing) {
        // Re-edit existing item
        setSelectedId(existing.id);
        setEditingId(existing.id);
        setEditingText(existing.text);
        return;
      }
      // Create new edit item from this PDF text block
      const item: TextItem = {
        id: genId(),
        page: currentPage,
        x: hitBlock.cx, y: hitBlock.cy,
        pdfX: hitBlock.pdfX, pdfY: hitBlock.pdfY,
        text: hitBlock.text,
        fontSize: Math.round(hitBlock.fontSizePx / zoom),
        color: '#000000',
        fontFamily: 'Helvetica',
        bold: false, italic: false,
        fromPdf: true,
        originalText: hitBlock.text,
      };
      setItems(prev => [...prev, item]);
      setSelectedId(item.id);
      setEditingId(item.id);
      setEditingText(hitBlock.text);
      return;
    }

    // ── No PDF text hit — place new text if text tool active ──
    if (activeTool === 'text') {
      const item: TextItem = {
        id: genId(), page: currentPage,
        x: cx, y: cy,
        pdfX: Math.round((cx / canvas.width) * 595),
        pdfY: Math.round((1 - cy / canvas.height) * 842),
        text: '', fontSize, color, fontFamily, bold, italic,
        fromPdf: false,
      };
      setItems(prev => [...prev, item]);
      setSelectedId(item.id);
      setEditingId(item.id);
      setEditingText('');
    } else {
      // deselect
      setSelectedId(null);
    }
  }

  // ── Drag ──────────────────────────────────────────────────────────────────
  function handleItemMouseDown(e: React.MouseEvent, id: string) {
    if (editingId === id) return;
    e.stopPropagation();
    setSelectedId(id);
    dragRef.current = { id, ox: e.clientX, oy: e.clientY };
    window.addEventListener('mousemove', onDragMove);
    window.addEventListener('mouseup', onDragEnd);
  }
  function onDragMove(e: MouseEvent) {
    if (!dragRef.current || !canvasRef.current) return;
    const { id } = dragRef.current;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const dx = (e.clientX - dragRef.current.ox) * scaleX;
    const dy = (e.clientY - dragRef.current.oy) * scaleY;
    dragRef.current.ox = e.clientX; dragRef.current.oy = e.clientY;
    setItems(prev => prev.map(it => {
      if (it.id !== id) return it;
      const nx = Math.max(0, Math.min(canvas.width, it.x + dx));
      const ny = Math.max(0, Math.min(canvas.height, it.y + dy));
      return { ...it, x: nx, y: ny,
        pdfX: Math.round((nx / canvas.width) * 595),
        pdfY: Math.round((1 - ny / canvas.height) * 842) };
    }));
  }
  function onDragEnd() {
    dragRef.current = null;
    window.removeEventListener('mousemove', onDragMove);
    window.removeEventListener('mouseup', onDragEnd);
  }

  function commitEdit(id: string) {
    if (!editingText.trim()) {
      setItems(prev => prev.filter(it => it.id !== id));
    } else {
      setItems(prev => prev.map(it => it.id === id ? { ...it, text: editingText } : it));
    }
    setEditingId(null);
  }

  function updateSelected(patch: Partial<TextItem>) {
    if (!selectedId) return;
    setItems(prev => prev.map(it => it.id === selectedId ? { ...it, ...patch } : it));
  }

  const selected = items.find(it => it.id === selectedId);
  const pageItems = items.filter(it => it.page === currentPage);
  const validItems = items.filter(it => it.text.trim());

  async function handleSave() {
    if (!file || validItems.length === 0) { setError('Edit at least one text item first.'); return; }
    setError(null); setPhase('processing');
    const instructions: EditInstruction[] = validItems.map(it => ({
      type: 'text' as const,
      page: it.page, x: it.pdfX, y: it.pdfY,
      content: it.text, fontSize: it.fontSize, color: it.color,
    }));
    try {
      const j = await createEditJob((file as any).id, instructions);
      poll((j as any).id, (done: any) => {
        if (done.status === 'COMPLETED') setPhase('done');
        if (done.status === 'FAILED') { setError(done.error || 'Failed'); setPhase('error'); }
      });
    } catch (err: any) { setError(err.message); setPhase('error'); }
  }

  function handleReset() {
    setFile(null); setRawFile(null); setPhase('upload');
    setItems([]); setSelectedId(null); setEditingId(null);
    setNumPages(0); setCurrentPage(1); setZoom(1);
    setError(null); pdfRef.current = null; resetJob();
  }

  // ── Style helpers ──────────────────────────────────────────────────────────
  const topBtn = (active: boolean): React.CSSProperties => ({
    padding: '3px 10px', borderRadius: 4,
    border: `1px solid ${active ? accent : '#3a3a3a'}`,
    background: active ? `rgba(194,65,12,0.18)` : 'transparent',
    color: active ? '#fff' : '#bbb',
    fontWeight: active ? 700 : 400,
    fontSize: 13, cursor: 'pointer', transition: 'all 0.12s',
    whiteSpace: 'nowrap' as const,
  });
  const sideLabel: React.CSSProperties = {
    fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
    letterSpacing: '0.07em', color: '#666', marginBottom: 4,
  };

  // ── UPLOAD phase ──────────────────────────────────────────────────────────
  if (phase === 'upload') return (
    <ToolLayout title="Edit PDF" tagline="Click any text on your PDF to edit it, or add new text anywhere." icon="✏️" accentColor={accent}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <UploadBox onFiles={handleDrop} maxFiles={1} label="Drop a PDF to edit" accept={{ 'application/pdf': ['.pdf'] }} />
        {uploadState === 'uploading' && <ProgressBar uploadProgress={uploadProgress} />}
      </div>
    </ToolLayout>
  );

  if (phase === 'processing') return (
    <ToolLayout title="Edit PDF" tagline="Saving your edits…" icon="✏️" accentColor={accent}>
      <div style={{ padding: '48px 0', maxWidth: 440, margin: '0 auto', textAlign: 'center' }}>
        <ProgressBar job={job} />
        <p style={{ marginTop: 16, fontSize: 13, color: 'var(--text-muted)' }}>Applying edits…</p>
      </div>
    </ToolLayout>
  );

  if (phase === 'done' && job) return (
    <ToolLayout title="Edit PDF" tagline="Your edited PDF is ready." icon="✏️" accentColor={accent}>
      <ResultDownload jobId={(job as any).id} filename="edited.pdf" onReset={handleReset} />
    </ToolLayout>
  );

  if (phase === 'error') return (
    <ToolLayout title="Edit PDF" tagline="" icon="✏️" accentColor={accent}>
      <div style={{ padding: '40px 0', textAlign: 'center' }}>
        <p style={{ color: '#eb1000', marginBottom: 16 }}>{error}</p>
        <button onClick={handleReset} style={{ fontSize: 13, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Try again</button>
      </div>
    </ToolLayout>
  );

  // ── EDITOR — full-screen fixed overlay ────────────────────────────────────
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', flexDirection: 'column', background: '#1a1a1a', color: '#e8e8e8', fontFamily: 'system-ui, sans-serif', overflow: 'hidden' }}>

      {/* ── TOP BAR ── */}
      <div style={{ height: 46, background: '#252525', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', gap: 6, padding: '0 12px', flexShrink: 0, zIndex: 30 }}>
        <button onClick={handleReset} title="Close"
          style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: '#3a3a3a', color: '#aaa', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>×</button>
        <div style={{ width: 1, height: 22, background: '#333', margin: '0 4px' }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: '#ccc' }}>Edit PDF</span>
        <div style={{ width: 1, height: 22, background: '#333', margin: '0 4px' }} />

        <button style={topBtn(activeTool === 'select')} onClick={() => setActiveTool('select')}>▲ Select / Edit</button>
        <button style={topBtn(activeTool === 'text')} onClick={() => setActiveTool('text')}>T Add Text</button>
        <div style={{ width: 1, height: 22, background: '#333', margin: '0 4px' }} />

        {/* Font */}
        <select value={selected ? selected.fontFamily : fontFamily}
          onChange={e => { const v = e.target.value; if (selected) updateSelected({ fontFamily: v }); else setFontFamily(v); }}
          style={{ background: '#333', border: '1px solid #444', color: '#e8e8e8', borderRadius: 4, padding: '3px 6px', fontSize: 12, width: 120 }}>
          {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
        </select>

        <input type="number" min={6} max={144}
          value={selected ? selected.fontSize : fontSize}
          onChange={e => { const v = Number(e.target.value); if (selected) updateSelected({ fontSize: v }); else setFontSize(v); }}
          style={{ width: 44, background: '#333', border: '1px solid #444', color: '#e8e8e8', borderRadius: 4, padding: '3px 6px', fontSize: 12, textAlign: 'center' }} />

        <button style={topBtn(selected ? selected.bold : bold)}
          onClick={() => { if (selected) updateSelected({ bold: !selected.bold }); else setBold(b => !b); }}><strong>B</strong></button>
        <button style={{ ...topBtn(selected ? selected.italic : italic), fontStyle: 'italic' }}
          onClick={() => { if (selected) updateSelected({ italic: !selected.italic }); else setItalic(it => !it); }}><em>I</em></button>

        {/* Color */}
        <div style={{ width: 24, height: 24, borderRadius: 4, background: selected ? selected.color : color, border: '2px solid #555', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
          <input type="color" value={selected ? selected.color : color}
            onChange={e => { if (selected) updateSelected({ color: e.target.value }); else setColor(e.target.value); }}
            style={{ position: 'absolute', inset: -2, width: '150%', height: '150%', opacity: 0, cursor: 'pointer' }} />
        </div>

        <div style={{ flex: 1 }} />

        {/* Zoom */}
        <button onClick={() => setZoom(z => Math.max(0.3, parseFloat((z - 0.1).toFixed(1))))} style={{ ...topBtn(false), padding: '3px 9px' }}>−</button>
        <span style={{ fontSize: 12, color: '#888', minWidth: 44, textAlign: 'center' }}>{Math.round(zoom * 100)}%</span>
        <button onClick={() => setZoom(z => Math.min(3, parseFloat((z + 0.1).toFixed(1))))} style={{ ...topBtn(false), padding: '3px 9px' }}>+</button>
        <button onClick={async () => {
          if (!pdfRef.current) return;
          const p = await pdfRef.current.getPage(currentPage);
          const nw = p.getViewport({ scale: 1 }).width;
          const aw = (containerRef.current?.clientWidth ?? window.innerWidth - 220) - 56;
          setZoom(Math.max(0.4, Math.floor((aw / nw) * 100) / 100));
        }} style={{ ...topBtn(false), padding: '3px 9px', fontSize: 11 }}>Fit</button>

        <div style={{ width: 1, height: 22, background: '#333', margin: '0 4px' }} />

        {/* Page nav */}
        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage <= 1}
          style={{ ...topBtn(false), padding: '3px 9px', opacity: currentPage <= 1 ? 0.35 : 1 }}>‹</button>
        <span style={{ fontSize: 12, color: '#999', minWidth: 66, textAlign: 'center' }}>
          {pdfRendering ? '…' : `${currentPage} / ${numPages || '?'}`}
        </span>
        <button onClick={() => setCurrentPage(p => numPages ? Math.min(numPages, p + 1) : p + 1)}
          disabled={numPages > 0 && currentPage >= numPages}
          style={{ ...topBtn(false), padding: '3px 9px', opacity: (numPages > 0 && currentPage >= numPages) ? 0.35 : 1 }}>›</button>

        <div style={{ width: 1, height: 22, background: '#333', margin: '0 4px' }} />

        <button onClick={handleSave} disabled={validItems.length === 0}
          style={{ padding: '5px 20px', borderRadius: 6, border: 'none', background: validItems.length > 0 ? accent : '#383838', color: validItems.length > 0 ? '#fff' : '#555', fontWeight: 700, fontSize: 13, cursor: validItems.length > 0 ? 'pointer' : 'not-allowed' }}>
          Save{validItems.length > 0 ? ` (${validItems.length})` : ''}
        </button>
      </div>

      {/* ── BODY ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── LEFT SIDEBAR ── */}
        <div style={{ width: 220, background: '#222', borderRight: '1px solid #2e2e2e', display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #2e2e2e', flexShrink: 0 }}>
            {(['text', 'pages'] as const).map(tab => (
              <button key={tab} onClick={() => setSideTab(tab)} style={{ flex: 1, padding: '10px 0', border: 'none', background: 'transparent', color: sideTab === tab ? '#fff' : '#555', fontSize: 12, fontWeight: 600, cursor: 'pointer', borderBottom: `2px solid ${sideTab === tab ? accent : 'transparent'}`, textTransform: 'capitalize' }}>
                {tab === 'text' ? 'Text' : 'Pages'}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: 14 }}>
            {sideTab === 'text' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Mode hint */}
                <div style={{ padding: '10px 12px', borderRadius: 8, background: '#2a2a2a', border: `1px solid ${activeTool === 'text' ? 'rgba(194,65,12,0.4)' : '#333'}`, fontSize: 12, color: '#888', lineHeight: 1.6 }}>
                  {activeTool === 'select'
                    ? <><span style={{ color: '#ccc', fontWeight: 700 }}>Select / Edit mode</span><br /><span style={{ color: accent }}>Click any text on the PDF</span> to edit it in place. Drag to reposition.</>
                    : <><span style={{ color: accent, fontWeight: 700 }}>Add Text mode</span><br />Click a blank area on the PDF to insert new text.</>
                  }
                </div>

                {/* Font */}
                <div>
                  <div style={sideLabel}>Font Family</div>
                  <select value={selected ? selected.fontFamily : fontFamily}
                    onChange={e => { const v = e.target.value; if (selected) updateSelected({ fontFamily: v }); else setFontFamily(v); }}
                    style={{ width: '100%', background: '#2a2a2a', border: '1px solid #3a3a3a', color: '#e8e8e8', borderRadius: 6, padding: '7px 10px', fontSize: 13 }}>
                    {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>

                {/* Size */}
                <div>
                  <div style={sideLabel}>Size: {selected ? selected.fontSize : fontSize}pt</div>
                  <input type="range" min={6} max={96} value={selected ? selected.fontSize : fontSize}
                    onChange={e => { const v = Number(e.target.value); if (selected) updateSelected({ fontSize: v }); else setFontSize(v); }}
                    style={{ width: '100%', accentColor: accent, marginBottom: 8 }} />
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 4 }}>
                    {FONT_SIZES.map(s => (
                      <button key={s} onClick={() => { if (selected) updateSelected({ fontSize: s }); else setFontSize(s); }}
                        style={{ padding: '4px 0', borderRadius: 5, border: `1px solid ${(selected ? selected.fontSize : fontSize) === s ? accent : '#3a3a3a'}`, background: (selected ? selected.fontSize : fontSize) === s ? 'rgba(194,65,12,0.15)' : '#2a2a2a', color: (selected ? selected.fontSize : fontSize) === s ? accent : '#888', fontSize: 11, cursor: 'pointer' }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Style */}
                <div>
                  <div style={sideLabel}>Style</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={{ ...topBtn(selected ? selected.bold : bold), flex: 1, padding: '7px 0' }}
                      onClick={() => { if (selected) updateSelected({ bold: !selected.bold }); else setBold(b => !b); }}><strong>Bold</strong></button>
                    <button style={{ ...topBtn(selected ? selected.italic : italic), flex: 1, padding: '7px 0', fontStyle: 'italic' }}
                      onClick={() => { if (selected) updateSelected({ italic: !selected.italic }); else setItalic(it => !it); }}><em>Italic</em></button>
                  </div>
                </div>

                {/* Color */}
                <div>
                  <div style={sideLabel}>Color</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {PRESET_COLORS.map(c => (
                      <button key={c} onClick={() => { if (selected) updateSelected({ color: c }); else setColor(c); }}
                        style={{ width: 24, height: 24, borderRadius: '50%', background: c, cursor: 'pointer', border: `2.5px solid ${(selected ? selected.color : color) === c ? accent : 'transparent'}`, boxShadow: '0 0 0 1px rgba(255,255,255,0.08)', flexShrink: 0 }} />
                    ))}
                    <div style={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid #555', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                      <input type="color" value={selected ? selected.color : color}
                        onChange={e => { if (selected) updateSelected({ color: e.target.value }); else setColor(e.target.value); }}
                        style={{ position: 'absolute', inset: -3, width: '150%', height: '150%', cursor: 'pointer' }} />
                    </div>
                  </div>
                </div>

                {/* Edits list */}
                {pageItems.filter(it => it.text.trim()).length > 0 && (
                  <div>
                    <div style={sideLabel}>Edits on page {currentPage}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {pageItems.filter(it => it.text.trim()).map(it => (
                        <div key={it.id} onClick={() => { setSelectedId(it.id); setActiveTool('select'); }}
                          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 8px', borderRadius: 6, background: selectedId === it.id ? 'rgba(194,65,12,0.15)' : '#2a2a2a', border: `1px solid ${selectedId === it.id ? accent : '#333'}`, cursor: 'pointer' }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: it.fromPdf ? '#0070f3' : accent, flexShrink: 0 }} title={it.fromPdf ? 'Edited PDF text' : 'New text'} />
                          <span style={{ flex: 1, fontSize: 11, color: '#ccc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.text}</span>
                          <span style={{ fontSize: 10, color: '#555', flexShrink: 0 }}>{it.fontSize}pt</span>
                          <button onMouseDown={e => e.stopPropagation()}
                            onClick={e => { e.stopPropagation(); setItems(prev => prev.filter(x => x.id !== it.id)); if (selectedId === it.id) setSelectedId(null); }}
                            style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 14, lineHeight: 1, padding: 0, flexShrink: 0 }}>×</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selected && (
                  <button onClick={() => { setItems(prev => prev.filter(it => it.id !== selectedId)); setSelectedId(null); }}
                    style={{ padding: '8px 0', borderRadius: 6, border: '1px solid #c0392b', background: 'rgba(192,57,43,0.1)', color: '#e74c3c', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    Delete selected
                  </button>
                )}

                {/* Legend */}
                <div style={{ display: 'flex', gap: 10, fontSize: 11, color: '#555' }}>
                  <span><span style={{ color: '#0070f3' }}>●</span> Edited PDF text</span>
                  <span><span style={{ color: accent }}>●</span> New text</span>
                </div>
              </div>
            )}

            {sideTab === 'pages' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ fontSize: 11, color: '#555', marginBottom: 4 }}>{numPages} page{numPages !== 1 ? 's' : ''}</div>
                {Array.from({ length: numPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setCurrentPage(p)}
                    style={{ padding: '8px 12px', borderRadius: 6, border: `1px solid ${currentPage === p ? accent : '#333'}`, background: currentPage === p ? 'rgba(194,65,12,0.12)' : '#2a2a2a', color: currentPage === p ? '#fff' : '#888', fontSize: 12, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 22, height: 22, borderRadius: 4, background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#aaa', flexShrink: 0 }}>{p}</span>
                    Page {p}
                    {items.filter(it => it.page === p && it.text.trim()).length > 0 && (
                      <span style={{ marginLeft: 'auto', fontSize: 10, color: accent }}>
                        {items.filter(it => it.page === p && it.text.trim()).length} edit{items.filter(it => it.page === p && it.text.trim()).length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── PDF CANVAS ── */}
        <div ref={containerRef}
          style={{ flex: 1, overflow: 'auto', background: '#3d3d3d', display: 'flex', justifyContent: 'center', padding: '28px 28px 60px' }}
          onClick={() => { if (!editingId) setSelectedId(null); }}>

          <div style={{ position: 'relative', boxShadow: '0 8px 48px rgba(0,0,0,0.6)', lineHeight: 0, alignSelf: 'flex-start' }}>

            {/* PDF canvas */}
            <canvas ref={canvasRef}
              style={{ display: 'block', cursor: activeTool === 'text' ? 'text' : 'default' }}
              onClick={handleCanvasClick} />

            {/* ── Invisible hit-targets over existing PDF text ── */}
            {canvasSize.w > 0 && activeTool === 'select' && pdfTextBlocks.map(b => {
              // Check if already being edited
              const hasEdit = items.some(it =>
                it.fromPdf && it.pdfX === b.pdfX && it.pdfY === b.pdfY && it.page === currentPage
              );
              if (hasEdit) return null;
              const dispX = (b.cx / canvasSize.w) * 100;
              const dispY = ((b.cy - b.fontSizePx) / canvasSize.h) * 100;
              const dispW = (Math.max(b.widthPx, 30) / canvasSize.w) * 100;
              const dispH = (b.fontSizePx * 1.4 / canvasSize.h) * 100;
              return (
                <div key={b.id}
                  title={`Click to edit: "${b.text}"`}
                  style={{
                    position: 'absolute',
                    left: `${dispX}%`, top: `${dispY}%`,
                    width: `${dispW}%`, height: `${dispH}%`,
                    cursor: 'text',
                    zIndex: 4,
                    // show a subtle hover highlight
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,112,243,0.12)'; (e.currentTarget as HTMLDivElement).style.outline = '1px solid rgba(0,112,243,0.4)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = ''; (e.currentTarget as HTMLDivElement).style.outline = ''; }}
                  onClick={e => {
                    e.stopPropagation();
                    const item: TextItem = {
                      id: genId(), page: currentPage,
                      x: b.cx, y: b.cy,
                      pdfX: b.pdfX, pdfY: b.pdfY,
                      text: b.text,
                      fontSize: Math.round(b.fontSizePx / zoom),
                      color: '#000000', fontFamily: 'Helvetica',
                      bold: false, italic: false,
                      fromPdf: true, originalText: b.text,
                    };
                    setItems(prev => [...prev, item]);
                    setSelectedId(item.id);
                    setEditingId(item.id);
                    setEditingText(b.text);
                  }}
                />
              );
            })}

            {/* ── Edit overlays ── */}
            {canvasSize.w > 0 && pageItems.map(item => {
              const isSelected = item.id === selectedId;
              const isEditing = item.id === editingId;
              const dispX = (item.x / canvasSize.w) * 100;
              const dispY = (item.y / canvasSize.h) * 100;

              return (
                <div key={item.id}
                  style={{ position: 'absolute', left: `${dispX}%`, top: `${dispY}%`, transform: 'translateY(-50%)', zIndex: isSelected ? 20 : 10, userSelect: 'none', pointerEvents: 'all' }}
                  onMouseDown={e => handleItemMouseDown(e, item.id)}
                  onDoubleClick={e => { e.stopPropagation(); setEditingId(item.id); setEditingText(item.text); }}
                  onClick={e => e.stopPropagation()}>

                  {isEditing ? (
                    <input autoFocus value={editingText}
                      onChange={e => setEditingText(e.target.value)}
                      onBlur={() => commitEdit(item.id)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') commitEdit(item.id);
                        if (e.key === 'Escape') { setEditingId(null); if (!item.text) setItems(prev => prev.filter(it => it.id !== item.id)); }
                      }}
                      style={{ fontSize: `${item.fontSize * zoom}px`, color: '#000', fontFamily: item.fontFamily, fontWeight: item.bold ? 'bold' : 'normal', fontStyle: item.italic ? 'italic' : 'normal', background: 'rgba(255,255,255,0.97)', border: `2px solid ${accent}`, borderRadius: 2, outline: 'none', padding: '0 6px', minWidth: 80, cursor: 'text', lineHeight: 1.3, boxShadow: '0 2px 16px rgba(0,0,0,0.35)' }} />
                  ) : (
                    <span style={{ fontSize: `${item.fontSize * zoom}px`, color: item.color, fontFamily: item.fontFamily, fontWeight: item.bold ? 'bold' : 'normal', fontStyle: item.italic ? 'italic' : 'normal', display: 'inline-block', whiteSpace: 'nowrap', lineHeight: 1.3, cursor: 'move', padding: '0 3px', background: isSelected ? 'rgba(194,65,12,0.1)' : item.fromPdf ? 'rgba(0,112,243,0.08)' : 'rgba(255,255,255,0.7)', outline: isSelected ? `2px dashed ${accent}` : item.fromPdf ? '1.5px dashed rgba(0,112,243,0.5)' : 'none', outlineOffset: 2, borderRadius: 2 }}>
                      {item.text}
                    </span>
                  )}

                  {isSelected && !isEditing && (
                    <button onMouseDown={e => e.stopPropagation()}
                      onClick={e => { e.stopPropagation(); setItems(prev => prev.filter(it => it.id !== item.id)); setSelectedId(null); }}
                      style={{ position: 'absolute', top: -8, right: -8, width: 18, height: 18, borderRadius: '50%', background: '#eb1000', border: '2px solid #fff', color: '#fff', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, zIndex: 30, boxShadow: '0 1px 6px rgba(0,0,0,0.5)' }}>×</button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── STATUS BAR ── */}
      <div style={{ height: 26, background: '#1e1e1e', borderTop: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', padding: '0 14px', gap: 16, flexShrink: 0 }}>
        <span style={{ fontSize: 11, color: activeTool === 'text' ? accent : '#2980b9' }}>
          {activeTool === 'text' ? '✏ Add Text — click blank area to insert' : '↖ Select/Edit — hover text to highlight, click to edit'}
        </span>
        <span style={{ fontSize: 11, color: '#444', marginLeft: 'auto' }}>
          {pdfTextBlocks.length} text blocks · {validItems.length} edit{validItems.length !== 1 ? 's' : ''} · page {currentPage}/{numPages || '?'} · {Math.round(zoom * 100)}%
        </span>
        {error && <span style={{ fontSize: 11, color: '#eb1000' }}>{error}</span>}
      </div>
    </div>
  );
}