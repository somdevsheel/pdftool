'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploader from './ImageUploader';

const BLOG_TAGS = ['PDF Tips', 'Tutorials', 'How-To', 'Merge PDF', 'Split PDF', 'Compress PDF', 'Convert PDF', 'Edit PDF', 'Sign PDF', 'OCR'];

interface BlogPostFormProps {
  initialData?: any;
  postId?: string;
}

export default function BlogPostForm({ initialData, postId }: BlogPostFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: initialData?.title || '',
    summary: initialData?.summary || '',
    content: initialData?.content || '',
    tag: initialData?.tag || 'PDF Tips',
    source: initialData?.source || 'PDF.tools',
    sourceUrl: initialData?.sourceUrl || '',
    readTime: initialData?.readTime || 5,
    featured: initialData?.featured || false,
    published: initialData?.published || false,
    imageUrl: initialData?.imageUrl || '',
    imageKey: initialData?.imageKey || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k: string, v: unknown) => setForm(prev => ({ ...prev, [k]: v }));

  async function handleSubmit() {
    if (!form.title || !form.summary || !form.content || !form.imageUrl) {
      setError('Title, summary, content and image are required');
      return;
    }
    setSaving(true); setError('');
    try {
      const url = postId ? `/api/news/${postId}` : '/api/blog';
      const method = postId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to save'); return; }
      router.push('/admin/blog');
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  }

  const inputStyle = {
    background: '#111', border: '1px solid #2a2a2a', borderRadius: '8px',
    color: '#fff', padding: '10px 14px', width: '100%', fontSize: '14px',
  };
  const labelStyle = { color: '#888', fontSize: '13px', marginBottom: '6px', display: 'block' };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main */}
      <div className="lg:col-span-2 flex flex-col gap-5">
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '20px' }}>
          <label style={labelStyle}>Title *</label>
          <input value={form.title} onChange={e => set('title', e.target.value)}
            placeholder="How to Compress a PDF Without Losing Quality"
            style={inputStyle} />
        </div>

        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '20px' }}>
          <label style={labelStyle}>Summary * <span style={{ color: '#555' }}>({form.summary.length}/500)</span></label>
          <textarea value={form.summary} onChange={e => set('summary', e.target.value)}
            rows={3} placeholder="A brief description of what this post covers..."
            style={{ ...inputStyle, resize: 'vertical' }} />
        </div>

        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '20px' }}>
          <label style={labelStyle}>Content * <span style={{ color: '#555' }}>(Markdown supported)</span></label>
          <textarea value={form.content} onChange={e => set('content', e.target.value)}
            rows={18} placeholder={`## Introduction\n\nWrite your blog post here...\n\n## Step 1\n\nExplain the first step.\n\n## Conclusion\n\nSummarize what you covered.`}
            style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.6' }} />
        </div>

        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '20px' }}>
          <label style={labelStyle}>Featured Image *</label>
          <ImageUploader
            value={form.imageUrl}
            onChange={({ imageUrl, key }) => { set('imageUrl', imageUrl); set('imageKey', key); }}
          />
        </div>

        {error && (
          <p className="text-sm px-4 py-3 rounded-lg" style={{ background: '#eb100011', color: '#eb1000', border: '1px solid #eb100033' }}>
            {error}
          </p>
        )}
      </div>

      {/* Sidebar */}
      <div className="flex flex-col gap-4">
        {/* Publish */}
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '20px' }}>
          <h3 className="font-semibold text-white mb-4">Publish</h3>
          <div className="flex flex-col gap-3 mb-5">
            {[
              { label: 'Published', key: 'published', desc: 'Visible on /blog' },
              { label: 'Featured', key: 'featured', desc: 'Show in featured section' },
            ].map(({ label, key, desc }) => (
              <label key={key} className="flex items-start gap-3 cursor-pointer">
                <div onClick={() => set(key, !form[key as keyof typeof form])}
                  className="w-10 h-5 rounded-full flex-shrink-0 relative transition-all mt-0.5"
                  style={{ background: form[key as keyof typeof form] ? '#eb1000' : '#2a2a2a', cursor: 'pointer' }}>
                  <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                    style={{ left: form[key as keyof typeof form] ? '22px' : '2px' }} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{label}</p>
                  <p className="text-xs" style={{ color: '#555' }}>{desc}</p>
                </div>
              </label>
            ))}
          </div>
          <button onClick={handleSubmit} disabled={saving}
            className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-all"
            style={{ background: saving ? '#555' : '#eb1000', cursor: saving ? 'not-allowed' : 'pointer' }}>
            {saving ? 'Saving...' : postId ? 'Update Post' : 'Publish Post'}
          </button>
        </div>

        {/* Tag */}
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '20px' }}>
          <h3 className="font-semibold text-white mb-3">Category</h3>
          <div className="flex flex-wrap gap-2">
            {BLOG_TAGS.map(tag => (
              <button key={tag} onClick={() => set('tag', tag)}
                className="text-xs px-3 py-1.5 rounded-full transition-all"
                style={{
                  background: form.tag === tag ? '#eb1000' : '#1a1a1a',
                  color: form.tag === tag ? '#fff' : '#888',
                  border: `1px solid ${form.tag === tag ? '#eb1000' : '#2a2a2a'}`,
                }}>
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Meta */}
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '20px' }}>
          <h3 className="font-semibold text-white mb-4">Meta</h3>
          <div className="flex flex-col gap-3">
            <div>
              <label style={labelStyle}>Read Time (minutes)</label>
              <input type="number" value={form.readTime} onChange={e => set('readTime', parseInt(e.target.value))}
                min={1} max={60} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Source URL (optional)</label>
              <input value={form.sourceUrl} onChange={e => set('sourceUrl', e.target.value)}
                placeholder="https://..." style={inputStyle} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
