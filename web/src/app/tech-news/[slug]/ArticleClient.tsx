/**
 * web/src/app/tech-news/[slug]/ArticleClient.tsx
 * CLIENT component — all interactive behaviour (scroll popup, markdown render)
 * Receives pre-fetched article from server page so no loading flash
 */

'use client';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import SubscribePopup from '@/components/subscribe/SubscribePopup';
import type { NewsArticle } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'https://admin.freenoo.com';

interface Props {
  slug:           string;
  initialArticle: NewsArticle | null;
}

export default function ArticleClient({ slug, initialArticle }: Props) {
  const [article,   setArticle]   = useState<NewsArticle | null>(initialArticle);
  const [loading,   setLoading]   = useState(!initialArticle);
  const [notFound,  setNotFound]  = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const articleRef  = useRef<HTMLDivElement>(null);
  const popupShown  = useRef(false);

  // Only fetch if server didn't pre-fetch (fallback)
  useEffect(() => {
    if (initialArticle) return;
    fetch(`${API_BASE}/api/news/slug/${slug}`)
      .then(r => r.json())
      .then(data => {
        if (data.article) setArticle(data.article);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug, initialArticle]);

  // Subscribe popup on 50% scroll
  useEffect(() => {
    const handleScroll = () => {
      if (popupShown.current) return;
      const el = articleRef.current;
      if (!el) return;
      if (-el.getBoundingClientRect().top > el.offsetHeight * 0.5) {
        setShowPopup(true);
        popupShown.current = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="w-10 h-10 rounded-full border-2 animate-spin"
        style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
    </div>
  );

  if (notFound || !article) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: 'var(--bg)' }}>
      <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Article not found</h1>
      <Link href="/tech-news" style={{ color: 'var(--accent)' }}>← Back to Tech News</Link>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {showPopup && <SubscribePopup onClose={() => setShowPopup(false)} source="popup" />}

      {/* ── Header ── */}
      <header className="sticky top-0 z-20 backdrop-blur-sm"
        style={{ background: 'rgba(28,28,28,0.95)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3" style={{ textDecoration: 'none' }}>
            {/* <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-lg text-white"
              style={{ background: 'var(--accent)' }}>F</div>
            <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--text)' }}>
              <Image src="/logo.png" alt="Freenoo" width={100} height={30} style={{ height: '30px', width: 'auto' }} />
            </span> */}

          <Image
              src="/logo.png"
              alt="Freenoo"
              width={120}
              height={36}
              style={{ height: '86px', width: 'auto' }}
            />
          </Link>
          <Link href="/tech-news"
            className="text-sm px-4 py-1.5 rounded-lg transition-all"
            style={{ color: 'var(--text-muted)', border: '1px solid var(--border)', textDecoration: 'none' }}>
            ← Tech News
          </Link>
        </div>
      </header>

      {/* ── Article ── */}
      <article className="max-w-3xl mx-auto px-6 py-12" ref={articleRef}>

        {/* Tag + meta */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <span className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide"
            style={{ background: `${article.tagColor}22`, color: article.tagColor, letterSpacing: '0.06em' }}>
            {article.tag}
          </span>
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {new Date(article.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
          <span style={{ color: 'var(--border)' }}>·</span>
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{article.readTime} min read</span>
        </div>

        {/* Title */}
        <h1 style={{
          color: 'var(--text)',
          fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
          fontWeight: 800,
          lineHeight: 1.25,
          letterSpacing: '-0.02em',
          marginBottom: '1.25rem',
        }}>
          {article.title}
        </h1>

        {/* Summary */}
        <p style={{
          color: '#a0a0a0',
          fontSize: '1.2rem',
          lineHeight: 1.75,
          marginBottom: '2rem',
          fontWeight: 400,
          borderLeft: '3px solid var(--accent)',
          paddingLeft: '1rem',
        }}>
          {article.summary}
        </p>

        {/* Author + source */}
        <div className="flex items-center justify-between mb-8 pb-6 flex-wrap gap-3"
          style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
              style={{ background: 'var(--accent)' }}>
              {article.author?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                {article.author?.name || 'Admin'}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>via {article.source}</p>
            </div>
          </div>
          {article.sourceUrl && (
            <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer"
              className="text-xs px-4 py-2 rounded-lg font-semibold transition-all"
              style={{ color: 'var(--accent)', border: '1px solid var(--accent)', textDecoration: 'none' }}>
              Read original ↗
            </a>
          )}
        </div>

        {/* Featured image */}
        <div className="relative w-full rounded-2xl overflow-hidden mb-10"
          style={{ aspectRatio: '16/9' }}>
          <Image src={article.imageUrl} alt={article.title} fill className="object-cover"
            priority sizes="(max-width: 768px) 100vw, 768px" />
        </div>

        {/* Markdown body */}
        <div style={{ maxWidth: '100%' }}>
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 style={{ color: 'var(--text)', fontSize: '2rem', fontWeight: 800, lineHeight: 1.3, margin: '2.5rem 0 1rem', letterSpacing: '-0.02em' }}>{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 style={{ color: 'var(--text)', fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.35, margin: '2.5rem 0 1rem', paddingBottom: '0.5rem', borderBottom: '2px solid var(--border)', letterSpacing: '-0.01em' }}>{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 style={{ color: 'var(--text)', fontSize: '1.2rem', fontWeight: 700, lineHeight: 1.4, margin: '2rem 0 0.75rem' }}>{children}</h3>
              ),
              p: ({ children }) => (
                <p style={{ color: '#c8c8c8', fontSize: '1.0625rem', lineHeight: 1.85, marginBottom: '1.5rem', fontWeight: 400 }}>{children}</p>
              ),
              strong: ({ children }) => (
                <strong style={{ color: '#ffffff', fontWeight: 700 }}>{children}</strong>
              ),
              em: ({ children }) => (
                <em style={{ color: '#aaa', fontStyle: 'italic' }}>{children}</em>
              ),
              ul: ({ children }) => (
                <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', listStyleType: 'disc' }}>{children}</ul>
              ),
              ol: ({ children }) => (
                <ol style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', listStyleType: 'decimal' }}>{children}</ol>
              ),
              li: ({ children }) => (
                <li style={{ color: '#c8c8c8', fontSize: '1.0625rem', lineHeight: 1.8, marginBottom: '0.5rem' }}>{children}</li>
              ),
              blockquote: ({ children }) => (
                <blockquote style={{ borderLeft: '4px solid var(--accent)', paddingLeft: '1.25rem', marginBottom: '1.5rem', marginLeft: 0, background: 'rgba(235,16,0,0.05)', borderRadius: '0 8px 8px 0', padding: '1rem 1.25rem' }}>{children}</blockquote>
              ),
              code: ({ children, className }) => {
                const isBlock = className?.includes('language-');
                return isBlock ? (
                  <pre style={{ background: '#111', borderRadius: '10px', padding: '1.25rem', overflowX: 'auto', marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
                    <code style={{ color: '#3FC87A', fontSize: '0.9rem', fontFamily: "'JetBrains Mono', 'Fira Code', monospace", lineHeight: 1.7 }}>{children}</code>
                  </pre>
                ) : (
                  <code style={{ background: '#1e1e1e', color: '#eb1000', padding: '0.2rem 0.45rem', borderRadius: '5px', fontSize: '0.9em', fontFamily: 'monospace', border: '1px solid #2a2a2a' }}>{children}</code>
                );
              },
              a: ({ href, children }) => (
                <a href={href} target="_blank" rel="noopener noreferrer"
                  style={{ color: 'var(--accent)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                  {children}
                </a>
              ),
              hr: () => (
                <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '2.5rem 0' }} />
              ),
              img: ({ src, alt }) => (
                <span style={{ display: 'block', margin: '2rem 0' }}>
                  <img src={src} alt={alt} style={{ width: '100%', borderRadius: '12px', display: 'block' }} />
                  {alt && <span style={{ display: 'block', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>{alt}</span>}
                </span>
              ),
            }}
          >
            {article.content}
          </ReactMarkdown>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 flex items-center justify-between flex-wrap gap-4"
          style={{ borderTop: '1px solid var(--border)' }}>
          <Link href="/tech-news"
            className="text-sm px-5 py-2.5 rounded-xl transition-all font-medium"
            style={{ color: 'var(--text-muted)', border: '1px solid var(--border)', textDecoration: 'none' }}>
            ← All Articles
          </Link>
          {article.sourceUrl && (
            <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer"
              className="text-sm px-5 py-2.5 rounded-xl font-semibold text-white transition-all"
              style={{ background: 'var(--accent)', textDecoration: 'none' }}>
              Read original ↗
            </a>
          )}
        </div>
      </article>

      {/* Footer */}
      <footer className="max-w-3xl mx-auto px-6 py-8" style={{ borderTop: '1px solid var(--border)' }}>
        <p className="text-sm text-center" style={{ color: 'var(--text-muted)' }}>
          © Freenoo · <Link href="/tech-news" style={{ color: 'var(--accent)' }}>Tech News</Link>
        </p>
      </footer>
    </div>
  );
}