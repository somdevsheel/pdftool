'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import SubscribePopup from '@/components/subscribe/SubscribePopup';
import type { NewsArticle } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'https://pdftooladmin.arutechconsultancy.com';

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const articleRef = useRef<HTMLDivElement>(null);
  const popupShown = useRef(false);


  useEffect(() => {
    if (!slug) return;
    fetch(`${API_BASE}/api/news/slug/${slug}`)
      .then(r => r.json())
      .then(data => {
        if (data.article) setArticle(data.article);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);


  // Show popup at 50% scroll
  useEffect(() => {
    const handleScroll = () => {
      if (popupShown.current) return;
      const el = articleRef.current;
      if (!el) return;
      const scrolled = -el.getBoundingClientRect().top;
      if (scrolled > el.offsetHeight * 0.5) {
        setShowPopup(true);
        popupShown.current = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
    </div>
  );

  if (notFound) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: 'var(--bg)' }}>
      <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Article not found</h1>
      <Link href="/tech-news" style={{ color: 'var(--accent)' }}>← Back to Tech News</Link>
    </div>
  );

  if (!article) return null;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>

      {showPopup && <SubscribePopup onClose={() => setShowPopup(false)} source="popup" />}


      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur-sm"
        style={{ background: 'rgba(28,28,28,0.92)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-lg text-white"
              style={{ background: 'var(--accent)' }}>P</div>
            <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--text)' }}>
              PDF<span style={{ color: 'var(--accent)' }}>.tools</span>
            </span>
          </Link>
          <Link href="/tech-news"
            className="text-sm px-4 py-1.5 rounded-lg transition-all"
            style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
            ← Tech News
          </Link>
        </div>
      </header>

      <article className="max-w-4xl mx-auto px-6 py-10" ref={articleRef}>

        {/* Tag + meta */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-semibold px-3 py-1 rounded-full"
            style={{ background: `${article.tagColor}22`, color: article.tagColor }}>
            {article.tag}
          </span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{article.readTime} min read</span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {new Date(article.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-bold text-3xl leading-tight mb-4" style={{ color: 'var(--text)' }}>
          {article.title}
        </h1>

        {/* Summary */}
        <p className="text-lg leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
          {article.summary}
        </p>

        {/* Author + source */}
        <div className="flex items-center justify-between mb-8 pb-6"
          style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
              style={{ background: 'var(--accent)' }}>
              {article.author?.name?.[0] || 'A'}
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{article.author?.name || 'Admin'}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>via {article.source}</p>
            </div>
          </div>
          {article.sourceUrl && (
            <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 rounded-lg transition-all"
              style={{ color: 'var(--accent)', border: '1px solid var(--accent)' }}>
              Read original ↗
            </a>
          )}
        </div>

        {/* Featured Image */}
        <div className="relative w-full h-72 md:h-96 rounded-2xl overflow-hidden mb-10">
          <Image src={article.imageUrl} alt={article.title} fill className="object-cover" />
        </div>

        {/* Markdown Content */}
        <div className="markdown-body">
          <ReactMarkdown
            components={{
              h1: ({children}) => <h1 style={{ color: 'var(--text)', fontSize: '1.875rem', fontWeight: 700, marginBottom: '1rem', marginTop: '2rem' }}>{children}</h1>,
              h2: ({children}) => <h2 style={{ color: 'var(--text)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', marginTop: '1.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>{children}</h2>,
              h3: ({children}) => <h3 style={{ color: 'var(--text)', fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', marginTop: '1.5rem' }}>{children}</h3>,
              p: ({children}) => <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '1.25rem', fontSize: '1rem' }}>{children}</p>,
              strong: ({children}) => <strong style={{ color: 'var(--text)', fontWeight: 700 }}>{children}</strong>,
              em: ({children}) => <em style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>{children}</em>,
              ul: ({children}) => <ul style={{ color: 'var(--text-muted)', paddingLeft: '1.5rem', marginBottom: '1.25rem', listStyleType: 'disc' }}>{children}</ul>,
              ol: ({children}) => <ol style={{ color: 'var(--text-muted)', paddingLeft: '1.5rem', marginBottom: '1.25rem', listStyleType: 'decimal' }}>{children}</ol>,
              li: ({children}) => <li style={{ marginBottom: '0.4rem', lineHeight: '1.7' }}>{children}</li>,
              blockquote: ({children}) => (
                <blockquote style={{ borderLeft: '4px solid var(--accent)', paddingLeft: '1rem', marginBottom: '1.25rem', opacity: 0.85 }}>
                  {children}
                </blockquote>
              ),
              code: ({children, className}) => {
                const isBlock = className?.includes('language-');
                return isBlock
                  ? <pre style={{ background: 'var(--surface)', borderRadius: '0.5rem', padding: '1rem', overflowX: 'auto', marginBottom: '1.25rem' }}>
                      <code style={{ color: '#eb1000', fontSize: '0.875rem', fontFamily: 'monospace' }}>{children}</code>
                    </pre>
                  : <code style={{ background: 'var(--surface)', color: '#eb1000', padding: '0.15rem 0.4rem', borderRadius: '0.25rem', fontSize: '0.875rem', fontFamily: 'monospace' }}>{children}</code>;
              },
              a: ({href, children}) => (
                <a href={href} target="_blank" rel="noopener noreferrer"
                  style={{ color: 'var(--accent)', textDecoration: 'underline' }}>
                  {children}
                </a>
              ),
              hr: () => <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '2rem 0' }} />,
              img: ({src, alt}) => (
                <span className="block my-6 rounded-xl overflow-hidden">
                  <img src={src} alt={alt} style={{ width: '100%', borderRadius: '0.75rem' }} />
                </span>
              ),
            }}
          >
            {article.content}
          </ReactMarkdown>
        </div>

        {/* Bottom nav */}
        <div className="mt-12 pt-8 flex items-center justify-between"
          style={{ borderTop: '1px solid var(--border)' }}>
          <Link href="/tech-news"
            className="text-sm px-4 py-2 rounded-lg transition-all"
            style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
            ← All Articles
          </Link>
          {article.sourceUrl && (
            <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer"
              className="text-sm px-4 py-2 rounded-lg font-medium text-white transition-all"
              style={{ background: 'var(--accent)' }}>
              Read original ↗
            </a>
          )}
        </div>
      </article>
    </div>
  );
}