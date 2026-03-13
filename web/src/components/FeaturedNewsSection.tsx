'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'https://admin.freenoo.com';

interface Article {
  _id: string;
  title: string;
  summary: string;
  slug: string;
  tag: string;
  tagColor: string;
  imageUrl?: string;
  source?: string;
  readTime: number;
  createdAt: string;
}

export default function FeaturedNewsSection() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/news?featured=true&limit=3`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data.articles)) setArticles(data.articles);
      })
      .catch(() => {});
  }, []);

  if (articles.length === 0) return null;

  return (
    <div style={{ marginTop: '48px', borderTop: '1px solid var(--border)', paddingTop: '32px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <span style={{ fontSize: '16px' }}>⚡</span>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
          Featured Tech News
        </h2>
        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        <Link href="/tech-news"
          style={{ fontSize: '12px', color: 'var(--accent)', textDecoration: 'none', whiteSpace: 'nowrap' }}>
          All news →
        </Link>
      </div>

      {/* Articles */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {articles.map((article, i) => (
          <Link key={article._id} href={`/tech-news/${article.slug}`} style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'flex', gap: '14px', alignItems: 'flex-start',
              padding: '14px 16px', borderRadius: '10px',
              background: 'var(--surface)', border: '1px solid var(--border)',
              transition: 'border-color 0.15s', cursor: 'pointer',
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              {/* Image */}
              {article.imageUrl && !article.imageUrl.includes('placehold.co') && (
                <div style={{
                  width: '64px', height: '48px', borderRadius: '6px',
                  overflow: 'hidden', flexShrink: 0, background: '#1a1a1a',
                }}>
                  <img src={article.imageUrl} alt={article.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{
                    fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px',
                    background: `${article.tagColor}22`, color: article.tagColor,
                  }}>
                    {article.tag}
                  </span>
                  {i === 0 && (
                    <span style={{
                      fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px',
                      background: 'rgba(235,16,0,0.15)', color: 'var(--accent)',
                    }}>
                      FEATURED
                    </span>
                  )}
                </div>
                <p style={{
                  fontSize: '13px', fontWeight: 500, color: 'var(--text)',
                  margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {article.title}
                </p>
                <p style={{
                  fontSize: '11px', color: 'var(--text-muted)', margin: 0,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {article.summary}
                </p>
              </div>

              {/* Meta */}
              <div style={{ flexShrink: 0, textAlign: 'right' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {article.readTime} min
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}