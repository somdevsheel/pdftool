'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploader from './ImageUploader';
import { TAG_COLORS, type NewsTag } from '@/types';
import type { NewsArticle } from '@/types';

const TAGS = Object.keys(TAG_COLORS) as NewsTag[];

interface ArticleFormProps {
  article?: NewsArticle;
  mode: 'create' | 'edit';
}

export default function ArticleForm({ article, mode }: ArticleFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: article?.title || '',
    summary: article?.summary || '',
    content: article?.content || '',
    tag: article?.tag || 'AI',
    source: article?.source || '',
    sourceUrl: article?.sourceUrl || '',
    readTime: article?.readTime || 3,
    featured: article?.featured || false,
    published: article?.published || false,
    imageUrl: article?.imageUrl || '',
    imageKey: article?.imageKey || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function set(key: string, val: unknown) {
    setForm(f => ({ ...f, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.imageUrl) { setError('Please upload an image'); return; }
    setSaving(true); setError(''); setSuccess('');

    try {
      const url = mode === 'create' ? '/api/news' : `/api/news/${article?._id}`;
      const method = mode === 'create' ? 'POST' : 'PATCH';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }

      setSuccess(mode === 'create' ? 'Article created!' : 'Article updated!');
      if (mode === 'create') router.push('/admin/news');
    } catch {
      setError('Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this article permanently?')) return;
    await fetch(`/api/news/${article?._id}`, { method: 'DELETE' });
    router.push('/admin/news');
  }

  const inputClass = "w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all";
  const inputStyle = { background: '#111', border: '1px solid #2a2a2a', color: '#fff' };
  const labelClass = "block text-xs font-medium mb-1.5";
  const labelStyle = { color: '#888' };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-4 p-3 rounded-lg text-sm" style={{ background: 'rgba(235,16,0,0.1)', color: '#eb1000', border: '1px solid rgba(235,16,0,0.2)' }}>
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 rounded-lg text-sm" style={{ background: 'rgba(63,200,122,0.1)', color: '#3FC87A', border: '1px solid rgba(63,200,122,0.2)' }}>
          {success}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Main content */}
        <div className="lg:col-span-2 flex flex-col gap-5">

          <div className="p-5 rounded-xl" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
            <h3 className="text-sm font-semibold text-white mb-4">Article Content</h3>

            <div className="flex flex-col gap-4">
              <div>
                <label className={labelClass} style={labelStyle}>Title *</label>
                <input type="text" required value={form.title} onChange={e => set('title', e.target.value)}
                  className={inputClass} style={inputStyle} placeholder="Enter article title..." />
              </div>

              <div>
                <label className={labelClass} style={labelStyle}>Summary * <span style={{ color: '#555' }}>({form.summary.length}/300)</span></label>
                <textarea required value={form.summary} onChange={e => set('summary', e.target.value)}
                  maxLength={300} rows={3}
                  className={inputClass} style={{ ...inputStyle, resize: 'vertical' }}
                  placeholder="Brief summary shown on news cards..." />
              </div>

              <div>
                <label className={labelClass} style={labelStyle}>Full Content *</label>
                <textarea required value={form.content} onChange={e => set('content', e.target.value)}
                  rows={14}
                  className={inputClass} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace', fontSize: '13px' }}
                  placeholder="Full article content. Markdown supported." />
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="p-5 rounded-xl" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
            <h3 className="text-sm font-semibold text-white mb-4">Featured Image</h3>
            <ImageUploader
              value={form.imageUrl}
              onChange={({ imageUrl, key }) => { set('imageUrl', imageUrl); set('imageKey', key); }}
            />
            {form.imageUrl && (
              <p className="text-xs mt-2 font-mono truncate" style={{ color: '#555' }}>{form.imageUrl}</p>
            )}
          </div>
        </div>

        {/* Right: Metadata */}
        <div className="flex flex-col gap-5">

          {/* Publish settings */}
          <div className="p-5 rounded-xl" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
            <h3 className="text-sm font-semibold text-white mb-4">Publish</h3>
            <div className="flex flex-col gap-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm" style={{ color: '#ccc' }}>Published</span>
                <div onClick={() => set('published', !form.published)}
                  className="w-10 h-5 rounded-full relative transition-all cursor-pointer"
                  style={{ background: form.published ? '#3FC87A' : '#333' }}>
                  <div className="w-4 h-4 rounded-full absolute top-0.5 transition-all"
                    style={{ background: '#fff', left: form.published ? '22px' : '2px' }} />
                </div>
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm" style={{ color: '#ccc' }}>Featured</span>
                <div onClick={() => set('featured', !form.featured)}
                  className="w-10 h-5 rounded-full relative transition-all cursor-pointer"
                  style={{ background: form.featured ? '#E87CF3' : '#333' }}>
                  <div className="w-4 h-4 rounded-full absolute top-0.5 transition-all"
                    style={{ background: '#fff', left: form.featured ? '22px' : '2px' }} />
                </div>
              </label>
            </div>

            <div className="flex flex-col gap-3 mt-4">
              <button type="submit" disabled={saving}
                className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-all"
                style={{ background: saving ? '#666' : '#eb1000', cursor: saving ? 'not-allowed' : 'pointer' }}>
                {saving ? 'Saving...' : mode === 'create' ? 'Publish Article' : 'Save Changes'}
              </button>

              {mode === 'edit' && (
                <button type="button" onClick={handleDelete}
                  className="w-full py-2 rounded-lg text-sm font-medium transition-all"
                  style={{ background: 'rgba(235,16,0,0.1)', color: '#eb1000', border: '1px solid rgba(235,16,0,0.2)' }}>
                  Delete Article
                </button>
              )}
            </div>
          </div>

          {/* Tag & Category */}
          <div className="p-5 rounded-xl" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
            <h3 className="text-sm font-semibold text-white mb-4">Category</h3>
            <div className="grid grid-cols-2 gap-2">
              {TAGS.map(tag => (
                <button key={tag} type="button" onClick={() => set('tag', tag)}
                  className="py-2 px-3 rounded-lg text-xs font-medium transition-all text-left"
                  style={{
                    background: form.tag === tag ? `${TAG_COLORS[tag]}22` : '#111',
                    color: form.tag === tag ? TAG_COLORS[tag] : '#666',
                    border: `1px solid ${form.tag === tag ? TAG_COLORS[tag] + '55' : '#222'}`,
                  }}>
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Source */}
          <div className="p-5 rounded-xl" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
            <h3 className="text-sm font-semibold text-white mb-4">Source</h3>
            <div className="flex flex-col gap-3">
              <div>
                <label className={labelClass} style={labelStyle}>Source Name *</label>
                <input type="text" required value={form.source} onChange={e => set('source', e.target.value)}
                  className={inputClass} style={inputStyle} placeholder="TechCrunch" />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Source URL</label>
                <input type="url" value={form.sourceUrl} onChange={e => set('sourceUrl', e.target.value)}
                  className={inputClass} style={inputStyle} placeholder="https://techcrunch.com/..." />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Read Time (minutes)</label>
                <input type="number" min={1} max={30} value={form.readTime} onChange={e => set('readTime', parseInt(e.target.value))}
                  className={inputClass} style={inputStyle} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
