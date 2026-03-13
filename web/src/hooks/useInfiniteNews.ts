'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import type { NewsArticle } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'https://admin.freenoo.com';

export function useInfiniteNews(tag: string) {
  const [articles,        setArticles]        = useState<NewsArticle[]>([]);
  const [featured,        setFeatured]        = useState<NewsArticle[]>([]);
  const [page,            setPage]            = useState(1);
  const [hasMore,         setHasMore]         = useState(true);
  const [loading,         setLoading]         = useState(false);
  const [initialLoading,  setInitialLoading]  = useState(true);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);

  // ── 1. Fetch featured articles FIRST — fires immediately, never waits for scroll ──
  useEffect(() => {
    setFeaturedLoading(true);
    setFeatured([]);
    const params = new URLSearchParams({ featured: 'true', limit: '4' });
    if (tag && tag !== 'All') params.set('tag', tag);

    fetch(`${API_BASE}/api/news?${params}`)
      .then(r => r.json())
      .then(data => setFeatured(Array.isArray(data.articles) ? data.articles : []))
      .catch(() => setFeatured([]))
      .finally(() => setFeaturedLoading(false));
  }, [tag]);

  // ── 2. Fetch regular paginated feed ──────────────────────────────────────────
  const fetchArticles = useCallback(async (pageNum: number, reset = false) => {
    setLoading(true);
    if (reset) setInitialLoading(true);
    try {
      const params = new URLSearchParams({
        page:  pageNum.toString(),
        limit: '12',
        ...(tag && tag !== 'All' ? { tag } : {}),
      });

      const res  = await fetch(`${API_BASE}/api/news?${params}`);
      const data = await res.json();
      const incoming: NewsArticle[] = Array.isArray(data.articles) ? data.articles : [];

      setArticles(prev => reset ? incoming : [...prev, ...incoming]);
      setHasMore(data.hasMore ?? false);
      setPage(pageNum);
    } catch (err) {
      console.error('News fetch error:', err);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [tag]);

  // Reset + initial load when tag changes
  useEffect(() => {
    setArticles([]);
    setPage(1);
    setHasMore(true);
    setInitialLoading(true);
    fetchArticles(1, true);
  }, [tag]);

  // ── 3. Infinite scroll observer ──────────────────────────────────────────────
  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading)
          fetchArticles(page + 1);
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loading, page, fetchArticles]);

  return { articles, featured, featuredLoading, loading, initialLoading, hasMore, loaderRef };
}