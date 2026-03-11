'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useInfiniteNews } from '@/hooks/useInfiniteNews';
import { FeaturedCard, NewsCard, SkeletonCard } from '@/components/news/NewsCard';
import AdPlaceholder from '@/components/news/AdPlaceholder';
import { TopAd } from '@/components/ads/TopAd';
import { BottomAd } from '@/components/ads/BottomAd';
import { SidebarAd } from '@/components/ads/SidebarAd';
import SubscribeSidebar from '@/components/subscribe/SubscribeSidebar';

const CATEGORIES = ['All', 'AI', 'Security', 'Cloud', 'Tools', 'Web', 'Mobile', 'Open Source', 'Startups'];

const AD_EVERY = 6;

export default function TechNewsPage() {
  const [activeTag, setActiveTag] = useState('All');
  const { articles, loading, initialLoading, hasMore, loaderRef } = useInfiniteNews(activeTag);

  const featured = articles.filter(a => a.featured).slice(0, 2);
  const regular = articles.filter(a => !a.featured);

  function buildFeed() {
    const rows: ('ad' | number)[] = [];
    regular.forEach((_, i) => {
      rows.push(i);
      if ((i + 1) % AD_EVERY === 0) rows.push('ad');
    });
    return rows;
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>

      {/* Top leaderboard ad */}
      <TopAd />

      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur-sm"
        style={{ background: 'rgba(28,28,28,0.92)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-lg text-white"
              style={{ background: 'var(--accent)' }}>P</div>
            <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--text)' }}>
              PDF<span style={{ color: 'var(--accent)' }}>.tools</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1 text-sm">
            {[['Edit', '/#edit'], ['Convert', '/#convert'], ['E-Sign', '/#esign'], ['Tech News', '/tech-news']].map(([label, href]) => (
              <a key={href} href={href}
                className="nav-link px-4 py-2 rounded text-sm transition-all duration-150"
                style={label === 'Tech News' ? { color: 'var(--accent)' } : {}}>
                {label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">⚡</span>
            <h1 className="font-bold text-3xl" style={{ color: 'var(--text)' }}>Tech News</h1>
            <span className="text-xs px-2 py-1 rounded font-mono"
              style={{ background: 'rgba(235,16,0,0.15)', color: 'var(--accent)' }}>LIVE</span>
          </div>
          <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
            AI, security, cloud, developer tools and document technology — updated continuously.
          </p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveTag(cat)}
                className="text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-150"
                style={{
                  background: activeTag === cat ? 'var(--accent)' : 'var(--surface-2)',
                  color: activeTag === cat ? '#fff' : 'var(--text-muted)',
                  border: `1px solid ${activeTag === cat ? 'var(--accent)' : 'var(--border)'}`,
                  cursor: 'pointer',
                }}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main layout: feed + sidebar */}
      <div className="max-w-7xl mx-auto w-full px-6 py-8 flex gap-8">

        {/* Feed */}
        <div className="flex-1 min-w-0 flex flex-col gap-8">

          {/* Featured */}
          {(initialLoading || featured.length > 0) && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-semibold px-2 py-1 rounded"
                  style={{ background: 'rgba(235,16,0,0.15)', color: 'var(--accent)' }}>Featured</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                {initialLoading
                  ? [0, 1].map(i => <SkeletonCard key={i} featured />)
                  : featured.map(a => <FeaturedCard key={a._id} article={a} />)
                }
              </div>
            </section>
          )}

          {/* Inline ad after featured */}
          <AdPlaceholder size="inline" />

          {/* Latest section header */}
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold whitespace-nowrap" style={{ color: 'var(--text)' }}>Latest Stories</h2>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{articles.length} articles</span>
          </div>

          {/* Articles with ad injections */}
          <div className="flex flex-col gap-3">
            {initialLoading
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
              : buildFeed().map((item, idx) =>
                  item === 'ad'
                    ? <AdPlaceholder key={`ad-${idx}`} size="inline" className="my-2" />
                    : <NewsCard key={regular[item]._id} article={regular[item]} />
                )
            }
          </div>

          {/* Load more */}
          <div ref={loaderRef} className="flex justify-center py-6">
            {loading && !initialLoading && (
              <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
            )}
            {!hasMore && !initialLoading && articles.length > 0 && (
              <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                — You've reached the end —
              </p>
            )}
          </div>

          {/* Bottom feed ad */}
          <AdPlaceholder size="leaderboard" />
        </div>

        {/* Sidebar */}
        <aside className="hidden xl:flex flex-col gap-6 w-72 flex-shrink-0">

          {/* Sidebar ad — uses SidebarAd which respects ADS_ENABLED */}
          <SidebarAd />

          <SubscribeSidebar />

          {/* Rectangle ad */}
          <AdPlaceholder size="rectangle" />

          <div className="p-4 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text)' }}>PDF Tools</h3>
            <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>Free online tools — no signup needed</p>
            <Link href="/"
              className="block w-full text-center py-2 rounded-lg text-sm font-medium text-white transition-all"
              style={{ background: 'var(--accent)' }}>
              Browse Tools →
            </Link>
          </div>

          <AdPlaceholder size="rectangle" />
        </aside>
      </div>

      {/* Bottom leaderboard ad */}
      <BottomAd />

      <footer style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-bold" style={{ color: 'var(--text)' }}>
            PDF<span style={{ color: 'var(--accent)' }}>.tools</span>
          </span>
          <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>Free · Anonymous · Open source</p>
        </div>
      </footer>
    </div>
  );
}