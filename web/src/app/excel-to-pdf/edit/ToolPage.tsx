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
import { PdfViewerModal, FileHeaderWithPreview, PreviewButton, loadPdfJs } from '../../components/PdfViewer';

type Phase = 'upload' | 'edit' | 'processing' | 'done' | 'error';
type EditTool = 'text' | 'annotation';

/* ── Inline file header with thumbnail + preview button ────── */

export default function EditPage() {
  const [file, setFile]               = useState<UploadedFile | null>(null);
  const [rawFile, setRawFile]         = useState<File | null>(null);
  const [viewerFile, setViewerFile]   = useState<File | null>(null);
  const [phase, setPhase]             = useState<Phase>('upload');
  const [tool, setTool]               = useState<EditTool>('text');
  const [instructions, setInstructions] = useState<EditInstruction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [textContent, setTextContent] = useState('');
  const [fontSize, setFontSize]       = useState(14);
  const [color, setColor]             = useState('#000000');
  const [pdfLoaded, setPdfLoaded]     = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const canvasRef                      = useRef<HTMLCanvasElement>(null);
  const pdfRef                         = useRef<any>(null);
  const numPagesRef                    = useRef(0);

  const { state: uploadState, progress: uploadProgress, upload } = useUpload();
  const { job, poll, reset: resetJob } = useJobStatus();

  // Load PDF preview when file uploaded
  const loadPreview = useCallback(async (uploadedFile: UploadedFile) => {
    // We'd need the actual file blob for preview; use a placeholder state
    setPdfLoaded(true);
  }, []);

  async function handleDrop(raw: File[]) {
    const uploaded = await upload(raw);
    if (uploaded?.[0]) { setFile(uploaded[0]); setRawFile(raw[0]); setPhase('edit'); await loadPreview(uploaded[0]); }
  }

  function addInstruction(x: number, y: number) {
    if (!textContent.trim() && tool === 'text') return;

    const instruction: EditInstruction = {
      type: tool,
      page: currentPage,
      x,
      y,
      content: textContent || undefined,
      fontSize: tool === 'text' ? fontSize : undefined,
      color,
    };
    setInstructions((prev) => [...prev, instruction]);
    if (tool === 'text') setTextContent('');
  }

  function handleCanvasClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 595; // normalize to PDF units
    const y = ((1 - (e.clientY - rect.top) / rect.height) * 842); // flip Y
    addInstruction(Math.round(x), Math.round(y));
  }

  function removeInstruction(idx: number) {
    setInstructions((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmitEdit() {
    if (!file || instructions.length === 0) {
      setError('Please add at least one annotation or text before saving.');
      return;
    }
    setError(null);
    setPhase('processing');
    try {
      const j = await createEditJob(file.id, instructions);
      poll(j.id, (done) => {
        if (done.status === 'COMPLETED') setPhase('done');
        if (done.status === 'FAILED') {
          setError(done.error || 'Edit failed');
          setPhase('error');
        }
      });
    } catch (err: any) {
      setError(err.message);
      setPhase('error');
    }
  }

  function handleReset() {
    setFile(null); setRawFile(null); setViewerFile(null);
    setPhase('upload'); setInstructions([]); setTextContent(''); setPdfLoaded(false); setError(null); resetJob();
  }

  return (
    <ToolLayout
      title="Edit PDF"
      tagline="Add text and annotations to your PDF. All editing happens on the server — nothing modified in browser."
      icon="✏️"
      accentColor="#c2410c"
    >
      {viewerFile && <PdfViewerModal file={viewerFile} onClose={() => setViewerFile(null)} />}

      {phase === 'upload' && (
        <div className="space-y-4">
          <UploadBox onFiles={handleDrop} maxFiles={1} label="Drop a PDF to edit" />
          {uploadState === 'uploading' && <ProgressBar uploadProgress={uploadProgress} />}
        </div>
      )}

      {phase === 'edit' && file && (
        <div className="space-y-6">
          <FileHeaderWithPreview file={rawFile!} uploadedFile={file} onPreview={() => setViewerFile(rawFile)} />

          <div className="grid md:grid-cols-5 gap-6">
            {/* Left: PDF canvas placeholder */}
            <div className="md:col-span-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-ink">
                  Page {currentPage}
                  {numPagesRef.current > 0 && ` / ${numPagesRef.current}`}
                </span>
                <div className="stamp">
                  Click on the PDF to place {tool}
                </div>
              </div>

              {/* Canvas / preview area */}
              <div
                className="relative border border-paper-mid rounded-md overflow-hidden
                  bg-white shadow-paper cursor-crosshair"
                style={{ aspectRatio: '1 / 1.414' }}
              >
                <canvas
                  ref={canvasRef}
                  className="w-full h-full"
                  onClick={handleCanvasClick}
                />
                {/* Placeholder when no PDF.js preview */}
                {!pdfLoaded && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-paper">
                    <svg width="48" height="60" viewBox="0 0 48 60" fill="none">
                      <path d="M4 0h29l11 11v45a4 4 0 01-4 4H4a4 4 0 01-4-4V4a4 4 0 014-4z"
                        fill="var(--paper-warm)" stroke="var(--paper-mid)" strokeWidth="1.5" />
                      <path d="M33 0v11h11" stroke="var(--paper-mid)" strokeWidth="1.5" fill="none" />
                    </svg>
                    <div className="space-y-1.5 w-4/5">
                      {[1, 0.8, 0.95, 0.7, 0.9].map((w, i) => (
                        <div key={i} className="h-1.5 rounded bg-paper-mid"
                          style={{ width: `${w * 100}%` }} />
                      ))}
                    </div>
                    <p className="text-xs text-ink-muted text-center max-w-[180px]">
                      Click anywhere to place {tool} at that position (coordinates sent to server)
                    </p>
                  </div>
                )}

                {/* Placed instruction indicators */}
                {instructions
                  .filter((ins) => ins.page === currentPage)
                  .map((ins, i) => (
                    <div
                      key={i}
                      className="absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2"
                      style={{
                        left: `${(ins.x! / 595) * 100}%`,
                        top: `${(1 - ins.y! / 842) * 100}%`,
                      }}
                    >
                      <div
                        className="w-3 h-3 rounded-full border-2 border-white shadow"
                        style={{ background: ins.color || '#000' }}
                      />
                    </div>
                  ))}
              </div>
            </div>

            {/* Right: Controls */}
            <div className="md:col-span-2 space-y-5">
              {/* Tool switcher */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-ink-muted">
                  Tool
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'text', label: '✏️ Text', desc: 'Add text overlay' },
                    { value: 'annotation', label: '🔲 Box', desc: 'Draw rectangle' },
                  ].map(({ value, label, desc }) => (
                    <button
                      key={value}
                      onClick={() => setTool(value as EditTool)}
                      className={`py-2 px-3 rounded-md border text-sm transition-all ${
                        tool === value
                          ? 'border-[#c2410c] bg-[rgba(194,65,12,0.06)] text-ink'
                          : 'border-paper-mid text-ink-muted hover:bg-paper-warm'
                      }`}
                    >
                      <p className="font-medium">{label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Text input */}
              {tool === 'text' && (
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-ink-muted">
                    Text content
                  </label>
                  <input
                    type="text"
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder="Type text to place…"
                    className="w-full px-3 py-2 rounded-md border border-paper-mid bg-paper text-sm
                      focus:outline-none focus:border-[#c2410c]"
                  />
                </div>
              )}

              {/* Font size */}
              {tool === 'text' && (
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-ink-muted">
                    Font size: {fontSize}px
                  </label>
                  <input
                    type="range"
                    min={8} max={48} value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="w-full accent-[#c2410c]"
                  />
                </div>
              )}

              {/* Color */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-ink-muted">
                  Color
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-9 h-9 rounded border border-paper-mid cursor-pointer"
                  />
                  <div className="flex gap-1.5">
                    {['#000000', '#c0392b', '#16a085', '#2980b9', '#8e44ad'].map((c) => (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        className="w-7 h-7 rounded-full border-2 transition-all"
                        style={{
                          background: c,
                          borderColor: color === c ? '#fff' : 'transparent',
                          boxShadow: color === c ? `0 0 0 2px ${c}` : 'none',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Page selector */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-ink-muted">
                  Page
                </label>
                <input
                  type="number"
                  min={1}
                  value={currentPage}
                  onChange={(e) => setCurrentPage(parseInt(e.target.value) || 1)}
                  className="w-20 px-3 py-2 rounded-md border border-paper-mid bg-paper text-sm
                    font-mono focus:outline-none focus:border-[#c2410c]"
                />
              </div>

              {/* Placed instructions */}
              {instructions.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-ink-muted">
                    Placed items ({instructions.length})
                  </label>
                  <ul className="space-y-1 max-h-36 overflow-y-auto">
                    {instructions.map((ins, i) => (
                      <li key={i}
                        className="flex items-center justify-between text-xs px-2 py-1.5
                          rounded bg-paper-warm border border-paper-mid gap-2">
                        <span className="text-ink-muted truncate">
                          {ins.type === 'text' ? `"${ins.content}" ` : 'Box '}
                          <span className="font-mono">p{ins.page}</span>
                        </span>
                        <div className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ background: ins.color || '#000' }} />
                        <button onClick={() => removeInstruction(i)}
                          className="text-ink-muted hover:text-red-500 flex-shrink-0">×</button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-md">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSubmitEdit}
              disabled={instructions.length === 0}
              className="px-8 py-3 rounded-md bg-[var(--ink)] text-paper font-medium text-sm
                hover:bg-[var(--ink-soft)] disabled:opacity-40 disabled:cursor-not-allowed
                transition-colors shadow-paper"
            >
              Save edits ({instructions.length}) →
            </button>
            <button onClick={handleReset}
              className="px-4 py-3 rounded-md border border-paper-mid text-sm
                text-ink-muted hover:bg-paper-warm transition-colors">
              Start over
            </button>
          </div>
        </div>
      )}

      {phase === 'processing' && (
        <div className="py-12 max-w-md mx-auto">
          <ProgressBar job={job} />
          <p className="text-sm text-center text-ink-muted mt-4">
            Applying {instructions.length} edits with pdf-lib…
          </p>
        </div>
      )}

      {phase === 'done' && job && (
        <ResultDownload jobId={job.id} filename="edited.pdf" onReset={handleReset} />
      )}

      {phase === 'error' && (
        <div className="py-12 text-center space-y-4">
          <p className="text-red-500">{error}</p>
          <button onClick={handleReset} className="text-sm underline text-ink-muted">Try again</button>
        </div>
      )}
    </ToolLayout>
  );
}
