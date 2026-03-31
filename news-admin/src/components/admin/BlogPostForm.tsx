'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploader from './ImageUploader';

const BLOG_TAGS = [
  // General
  'PDF Tips', 'Tutorials', 'How-To',
  // Edit tools
  'Merge PDF', 'Split PDF', 'Compress PDF', 'Rotate PDF', 'Organize PDF',
  'Delete Pages', 'Extract Pages', 'Insert Pages', 'Reorder Pages', 'Crop PDF',
  'Number Pages', 'Protect PDF', 'Edit PDF',
  // Convert tools
  'Convert PDF', 'PDF to Word', 'PDF to Image', 'PDF to Excel', 'PDF to PPT',
  'Word to PDF', 'Image to PDF', 'Excel to PDF', 'PPT to PDF',
  // Sign tools
  'Sign PDF', 'Fill & Sign', 'E-Sign',
  // Other
  'OCR',
];

interface Step { title: string; body: string; }
interface Faq { q: string; a: string; }
interface BlogPostFormProps { initialData?: any; postId?: string; }

function buildMarkdown(intro: string, steps: Step[], faqs: Faq[], conclusion: string): string {
  let md = '';
  if (intro) md += `## Introduction\n\n${intro}\n\n`;
  steps.forEach((s, i) => {
    if (s.title) {
      md += `## Step ${i + 1}: ${s.title}\n\n`;
      if (s.body) md += `${s.body}\n\n`;
    }
  });
  if (conclusion) md += `## Conclusion\n\n${conclusion}\n\n`;
  if (faqs.some(f => f.q)) {
    md += `## FAQ\n\n`;
    faqs.forEach(f => {
      if (f.q) md += `### ${f.q}\n\n${f.a}\n\n`;
    });
  }
  return md.trim();
}

export default function BlogPostForm({ initialData, postId }: BlogPostFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: initialData?.title || '',
    summary: initialData?.summary || '',
    tag: initialData?.tag || 'PDF Tips',
    readTime: initialData?.readTime || 5,
    featured: initialData?.featured || false,
    published: initialData?.published || false,
    imageUrl: initialData?.imageUrl || '',
    imageKey: initialData?.imageKey || '',
  });
  const [intro, setIntro] = useState('');
  const [conclusion, setConclusion] = useState('');
  const [steps, setSteps] = useState<Step[]>([{ title: '', body: '' }, { title: '', body: '' }, { title: '', body: '' }]);
  const [faqs, setFaqs] = useState<Faq[]>([{ q: '', a: '' }, { q: '', a: '' }, { q: '', a: '' }]);
  const [mode, setMode] = useState<'structured' | 'markdown'>('structured');
  const [rawMarkdown, setRawMarkdown] = useState(initialData?.content || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k: string, v: unknown) => setForm(prev => ({ ...prev, [k]: v }));

  const updateStep = (i: number, k: keyof Step, v: string) =>
    setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, [k]: v } : s));

  const updateFaq = (i: number, k: keyof Faq, v: string) =>
    setFaqs(prev => prev.map((f, idx) => idx === i ? { ...f, [k]: v } : f));

  const addStep = () => setSteps(prev => [...prev, { title: '', body: '' }]);
  const removeStep = (i: number) => setSteps(prev => prev.filter((_, idx) => idx !== i));
  const addFaq = () => setFaqs(prev => [...prev, { q: '', a: '' }]);
  const removeFaq = (i: number) => setFaqs(prev => prev.filter((_, idx) => idx !== i));

  async function handleSubmit() {
    if (!form.title || !form.summary) {
      setError('Title and summary are required');
      return;
    }
    const content = mode === 'structured' ? buildMarkdown(intro, steps, faqs, conclusion) : rawMarkdown;
    if (!content.trim()) {
      setError('Please add some content');
      return;
    }
    setSaving(true); setError('');
    try {
      const url = postId ? `/api/news/${postId}` : '/api/blog';
      const method = postId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          content,
          imageUrl: form.imageUrl || 'https://placehold.co/800x400/1c1c1c/444?text=Blog+Post',
          imageKey: form.imageKey || 'blog-placeholder',
          source: 'Freenoo',
          contentType: 'blog',
        }),
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

  const inp: React.CSSProperties = {
    background: '#111', border: '1px solid #2a2a2a', borderRadius: '8px',
    color: '#fff', padding: '10px 14px', width: '100%', fontSize: '14px',
    boxSizing: 'border-box',
  };
  const lbl: React.CSSProperties = { color: '#888', fontSize: '13px', marginBottom: '6px', display: 'block' };
  const card: React.CSSProperties = { background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '20px' };
  const sectionTitle: React.CSSProperties = { fontSize: '15px', fontWeight: 600, color: '#fff', marginBottom: '16px' };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* LEFT — Main */}
      <div className="lg:col-span-2 flex flex-col gap-5">

        {/* Title */}
        <div style={card}>
          <label style={lbl}>Title *</label>
          <input value={form.title} onChange={e => set('title', e.target.value)}
            placeholder="How to Compress a PDF Without Losing Quality" style={inp} />
        </div>

        {/* Summary */}
        <div style={card}>
          <label style={lbl}>Summary * <span style={{ color: '#555' }}>({form.summary.length}/500)</span></label>
          <textarea value={form.summary} onChange={e => set('summary', e.target.value)}
            rows={3} placeholder="A brief description shown in cards and search results..."
            style={{ ...inp, resize: 'vertical' }} />
        </div>

        {/* Content Mode Toggle */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <p style={sectionTitle}>Content</p>
            <div style={{ display: 'flex', gap: '4px', background: '#1a1a1a', padding: '4px', borderRadius: '8px' }}>
              {(['structured', 'markdown'] as const).map(m => (
                <button key={m} onClick={() => setMode(m)}
                  style={{
                    padding: '5px 12px', borderRadius: '6px', fontSize: '12px', border: 'none', cursor: 'pointer',
                    background: mode === m ? '#eb1000' : 'transparent',
                    color: mode === m ? '#fff' : '#888',
                  }}>
                  {m === 'structured' ? '⚡ Structured' : '</> Markdown'}
                </button>
              ))}
            </div>
          </div>

          {mode === 'structured' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

              {/* Introduction */}
              <div>
                <label style={lbl}>Introduction</label>
                <textarea value={intro} onChange={e => setIntro(e.target.value)}
                  rows={3} placeholder="Briefly introduce what this guide covers..."
                  style={{ ...inp, resize: 'vertical' }} />
              </div>

              {/* Steps */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <label style={{ ...lbl, marginBottom: 0 }}>Steps</label>
                  <button onClick={addStep} style={{ fontSize: '12px', color: '#eb1000', background: 'none', border: 'none', cursor: 'pointer' }}>
                    + Add step
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {steps.map((step, i) => (
                    <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <div style={{
                        width: '28px', height: '28px', borderRadius: '50%', background: '#eb1000',
                        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '12px', fontWeight: 700, flexShrink: 0, marginTop: '8px',
                      }}>{i + 1}</div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <input value={step.title} onChange={e => updateStep(i, 'title', e.target.value)}
                          placeholder={`Step ${i + 1} title (e.g. Upload your PDF)`}
                          style={{ ...inp, fontSize: '13px' }} />
                        <textarea value={step.body} onChange={e => updateStep(i, 'body', e.target.value)}
                          rows={2} placeholder="Explain this step in detail..."
                          style={{ ...inp, resize: 'vertical', fontSize: '13px' }} />
                      </div>
                      {steps.length > 1 && (
                        <button onClick={() => removeStep(i)}
                          style={{ color: '#555', background: 'none', border: 'none', cursor: 'pointer', marginTop: '8px', fontSize: '16px' }}>
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Conclusion */}
              <div>
                <label style={lbl}>Conclusion</label>
                <textarea value={conclusion} onChange={e => setConclusion(e.target.value)}
                  rows={2} placeholder="Summarize the key takeaways..."
                  style={{ ...inp, resize: 'vertical' }} />
              </div>

              {/* FAQ */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <label style={{ ...lbl, marginBottom: 0 }}>FAQ</label>
                  <button onClick={addFaq} style={{ fontSize: '12px', color: '#eb1000', background: 'none', border: 'none', cursor: 'pointer' }}>
                    + Add question
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {faqs.map((faq, i) => (
                    <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <span style={{ color: '#555', fontSize: '12px', marginTop: '10px', flexShrink: 0 }}>Q{i + 1}</span>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <input value={faq.q} onChange={e => updateFaq(i, 'q', e.target.value)}
                          placeholder="Question (e.g. Is it free to use?)"
                          style={{ ...inp, fontSize: '13px' }} />
                        <textarea value={faq.a} onChange={e => updateFaq(i, 'a', e.target.value)}
                          rows={2} placeholder="Answer..."
                          style={{ ...inp, resize: 'vertical', fontSize: '13px' }} />
                      </div>
                      {faqs.length > 1 && (
                        <button onClick={() => removeFaq(i)}
                          style={{ color: '#555', background: 'none', border: 'none', cursor: 'pointer', marginTop: '8px', fontSize: '16px' }}>
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div>
              <textarea value={rawMarkdown} onChange={e => setRawMarkdown(e.target.value)}
                rows={24} placeholder={`## Introduction\n\nWrite your content here...\n\n## Step 1: Title\n\nExplain step.\n\n## FAQ\n\n### Question?\n\nAnswer.`}
                style={{ ...inp, resize: 'vertical', fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.7' }} />
              <p style={{ color: '##444', fontSize: '11px', marginTop: '8px' }}>
                ## Heading · **bold** · *italic* · - list · [link](url) · `code` · --- divider
              </p>
            </div>
          )}
        </div>

        {/* Image — optional */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <label style={{ ...lbl, marginBottom: 0 }}>Featured Image</label>
            <span style={{ fontSize: '11px', color: '#555', background: '#1a1a1a', padding: '2px 8px', borderRadius: '20px' }}>Optional</span>
          </div>
          <ImageUploader
            value={form.imageUrl}
            onChange={({ imageUrl, key }) => { set('imageUrl', imageUrl); set('imageKey', key); }}
          />
          {!form.imageUrl && (
            <p style={{ color: '#444', fontSize: '11px', marginTop: '8px' }}>No image? A dark placeholder will be used.</p>
          )}
        </div>

        {error && (
          <p style={{ background: '#eb100011', color: '#eb1000', border: '1px solid #eb100033', borderRadius: '8px', padding: '12px 16px', fontSize: '13px' }}>
            {error}
          </p>
        )}
      </div>

      {/* RIGHT — Sidebar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Publish */}
        <div style={card}>
          <p style={sectionTitle}>Publish</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
            {[
              { label: 'Published', key: 'published', desc: 'Visible on tool pages' },
              { label: 'Featured', key: 'featured', desc: 'Show in featured section' },
            ].map(({ label, key, desc }) => (
              <label key={key} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                <div onClick={() => set(key, !form[key as keyof typeof form])}
                  style={{
                    width: '40px', height: '20px', borderRadius: '10px', flexShrink: 0,
                    background: form[key as keyof typeof form] ? '#eb1000' : '#2a2a2a',
                    position: 'relative', cursor: 'pointer', transition: 'background 0.2s',
                  }}>
                  <div style={{
                    position: 'absolute', top: '2px', width: '16px', height: '16px',
                    borderRadius: '50%', background: '#fff', transition: 'left 0.2s',
                    left: form[key as keyof typeof form] ? '22px' : '2px',
                  }} />
                </div>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 500, color: '#fff', margin: 0 }}>{label}</p>
                  <p style={{ fontSize: '11px', color: '#555', margin: 0 }}>{desc}</p>
                </div>
              </label>
            ))}
          </div>
          <button onClick={handleSubmit} disabled={saving}
            style={{
              width: '100%', padding: '10px', borderRadius: '8px', border: 'none',
              background: saving ? '#555' : '#eb1000', color: '#fff',
              fontSize: '14px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer',
            }}>
            {saving ? 'Saving...' : postId ? 'Update Post' : 'Publish Post'}
          </button>
        </div>

        {/* Tool / Category */}
        <div style={card}>
          <p style={sectionTitle}>Tool Category</p>
          <p style={{ fontSize: '12px', color: '#555', marginBottom: '12px' }}>
            Selects which tool page this guide appears on
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {BLOG_TAGS.map(tag => (
              <button key={tag} onClick={() => set('tag', tag)}
                style={{
                  fontSize: '12px', padding: '6px 12px', borderRadius: '20px', cursor: 'pointer', border: 'none',
                  background: form.tag === tag ? '#eb1000' : '#1a1a1a',
                  color: form.tag === tag ? '#fff' : '#888',
                  outline: form.tag === tag ? 'none' : '1px solid #2a2a2a',
                }}>
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Meta */}
        <div style={card}>
          <p style={sectionTitle}>Meta</p>
          <label style={lbl}>Read Time (minutes)</label>
          <input type="number" value={form.readTime}
            onChange={e => set('readTime', parseInt(e.target.value))}
            min={1} max={60} style={inp} />
        </div>

        {/* Preview of generated markdown */}
        {mode === 'structured' && (
          <div style={{ ...card, background: '#0a0a0a' }}>
            <p style={{ fontSize: '11px', fontWeight: 600, color: '#555', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Generated Markdown Preview
            </p>
            <pre style={{
              fontSize: '11px', color: '#444', fontFamily: 'monospace',
              whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0, lineHeight: 1.6,
              maxHeight: '200px', overflowY: 'auto',
            }}>
              {buildMarkdown(intro, steps, faqs, conclusion) || '(fill in the fields above)'}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}