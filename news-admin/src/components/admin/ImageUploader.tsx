'use client';
import { useState, useRef } from 'react';

interface UploadResult { imageUrl: string; key: string; }

export default function ImageUploader({
  value, onChange,
}: {
  value?: string;
  onChange: (result: UploadResult) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || '');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) { setError('Images only'); return; }
    if (file.size > 5 * 1024 * 1024) { setError('Max 5MB'); return; }

    setUploading(true); setError('');

    try {
      // Get presigned URL from our API
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileType: file.type, folder: 'news' }),
      });
      const { uploadUrl, key, imageUrl } = await res.json();

      // Upload directly to S3
      await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      setPreview(imageUrl);
      onChange({ imageUrl, key });
    } catch {
      setError('Upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        className="relative rounded-xl overflow-hidden cursor-pointer transition-all"
        style={{
          border: `2px dashed ${preview ? '#2a2a2a' : '#333'}`,
          background: '#111',
          minHeight: '180px',
        }}>
        {preview ? (
          <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
        ) : (
          <div className="flex flex-col items-center justify-center h-48 gap-2">
            <span className="text-3xl">{uploading ? '⏳' : '🖼️'}</span>
            <p className="text-sm font-medium text-white">
              {uploading ? 'Uploading to S3...' : 'Drop image or click to upload'}
            </p>
            <p className="text-xs" style={{ color: '#555' }}>JPG, PNG, WebP up to 5MB</p>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.7)' }}>
            <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: '#eb1000', borderTopColor: 'transparent' }} />
          </div>
        )}

        {preview && !uploading && (
          <button
            onClick={e => { e.stopPropagation(); setPreview(''); onChange({ imageUrl: '', key: '' }); }}
            className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: 'rgba(0,0,0,0.7)', color: '#fff' }}>
            ✕
          </button>
        )}
      </div>

      {error && <p className="text-xs mt-1.5" style={{ color: '#eb1000' }}>{error}</p>}

      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
    </div>
  );
}
