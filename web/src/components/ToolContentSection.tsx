'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'https://admin.freenoo.com';

interface BlogPost {
  _id: string;
  title: string;
  summary: string;
  slug: string;
  tag: string;
  tagColor: string;
  readTime: number;
  content: string;
}

function parseContentSections(content: string) {
  const steps: { title: string; body: string }[] = [];
  const faqs: { q: string; a: string }[] = [];

  const lines = content.split('\n');
  let inFaq = false;
  let currentStep: { title: string; body: string } | null = null;
  let currentFaq: { q: string; a: string } | null = null;

  for (const line of lines) {
    const trimmed = line.trim();

    // Detect FAQ section
    if (/^#{1,3}\s*(faq|frequently asked)/i.test(trimmed)) {
      inFaq = true;
      if (currentStep) { steps.push(currentStep); currentStep = null; }
      if (currentFaq) { faqs.push(currentFaq); currentFaq = null; }
      continue;
    }

    if (inFaq) {
      if (/^#{1,4}\s+/.test(trimmed) || trimmed.startsWith('**')) {
        if (currentFaq) faqs.push(currentFaq);
        currentFaq = { q: trimmed.replace(/^#{1,4}\s+/, '').replace(/\*\*/g, ''), a: '' };
      } else if (currentFaq && trimmed) {
        currentFaq.a += (currentFaq.a ? ' ' : '') + trimmed.replace(/\*\*/g, '');
      }
    } else {
      if (/^#{1,3}\s+/.test(trimmed) && !/introduction|overview/i.test(trimmed)) {
        if (currentStep) steps.push(currentStep);
        currentStep = { title: trimmed.replace(/^#{1,3}\s+/, ''), body: '' };
      } else if (currentStep && trimmed && !trimmed.startsWith('#')) {
        if (currentStep.body.length < 200)
          currentStep.body += (currentStep.body ? ' ' : '') + trimmed.replace(/\*\*/g, '').replace(/^[-*]\s+/, '');
      }
    }
  }

  if (currentStep) steps.push(currentStep);
  if (currentFaq) faqs.push(currentFaq);

  return { steps: steps.slice(0, 6), faqs: faqs.slice(0, 6) };
}

export default function ToolContentSection({ tag, toolTitle }: { tag: string; toolTitle: string }) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/blog?tag=${encodeURIComponent(tag)}&limit=5`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data.posts)) setPosts(data.posts.filter((p: BlogPost) => p.slug && p.content));
      })
      .catch(() => {});
  }, [tag]);

  if (posts.length === 0) return null;

  // Collect all steps and FAQs from all posts
  const allSteps: { title: string; body: string; postTitle: string; slug: string }[] = [];
  const allFaqs: { q: string; a: string }[] = [];

  posts.forEach(post => {
    const { steps, faqs } = parseContentSections(post.content);
    steps.forEach(s => allSteps.push({ ...s, postTitle: post.title, slug: post.slug }));
    faqs.forEach(f => allFaqs.push(f));
  });

  const showSteps = allSteps.slice(0, 5);
  const showFaqs = allFaqs.slice(0, 6);

  return (
    <div style={{ marginTop: '56px' }}>

      {/* How to Section */}
      {showSteps.length > 0 && (
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{
            fontSize: '22px', fontWeight: 700, color: 'var(--text)',
            marginBottom: '24px', paddingBottom: '12px',
            borderBottom: '1px solid var(--border)'
          }}>
            How to {toolTitle}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {showSteps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: '16px', paddingBottom: '24px' }}>
                {/* Step number */}
                <div style={{ flexShrink: 0 }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: 'var(--accent)', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', fontWeight: 700,
                  }}>
                    {i + 1}
                  </div>
                  {i < showSteps.length - 1 && (
                    <div style={{ width: '1px', background: 'var(--border)', margin: '4px auto 0', height: '100%', minHeight: '20px' }} />
                  )}
                </div>
                {/* Step content */}
                <div style={{ paddingTop: '4px', flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text)', margin: '0 0 6px' }}>
                    {step.title}
                  </p>
                  {step.body && (
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
                      {step.body}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {showFaqs.length > 0 && (
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{
            fontSize: '22px', fontWeight: 700, color: 'var(--text)',
            marginBottom: '20px', paddingBottom: '12px',
            borderBottom: '1px solid var(--border)'
          }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {showFaqs.map((faq, i) => (
              <div key={i}
                style={{
                  borderRadius: '10px', overflow: 'hidden',
                  border: '1px solid var(--border)',
                  background: openFaq === i ? 'var(--surface)' : 'transparent',
                }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: '100%', textAlign: 'left', padding: '14px 16px',
                    background: 'none', border: 'none', cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px',
                  }}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)' }}>
                    {faq.q}
                  </span>
                  <span style={{
                    fontSize: '18px', color: 'var(--accent)', flexShrink: 0,
                    transform: openFaq === i ? 'rotate(45deg)' : 'none',
                    transition: 'transform 0.2s',
                  }}>+</span>
                </button>
                {openFaq === i && faq.a && (
                  <div style={{ padding: '0 16px 14px' }}>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.7 }}>
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Articles */}
      <section>
        <h2 style={{
          fontSize: '22px', fontWeight: 700, color: 'var(--text)',
          marginBottom: '20px', paddingBottom: '12px',
          borderBottom: '1px solid var(--border)'
        }}>
          {tag} Guides &amp; Articles
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {posts.map(post => (
            <Link key={post._id} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
                padding: '14px 16px', borderRadius: '10px',
                background: 'var(--surface)', border: '1px solid var(--border)',
                transition: 'border-color 0.15s', cursor: 'pointer',
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)', margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {post.title}
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {post.summary}
                  </p>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {post.readTime} min →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}