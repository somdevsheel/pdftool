// 'use client';
// import { useState, useEffect, useRef, useCallback } from 'react';
// import type { NewsArticle } from '@/types';

// // const API_BASE = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'https://pdftooladmin.arutechconsultancy.com';
// const API_BASE = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:3002';

// export function useInfiniteNews(tag: string) {
//   const [articles, setArticles] = useState<NewsArticle[]>([]);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [initialLoading, setInitialLoading] = useState(true);
//   const loaderRef = useRef<HTMLDivElement>(null);

//   const fetchArticles = useCallback(async (pageNum: number, reset = false) => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams({
//         page: pageNum.toString(),
//         limit: '12',
//         ...(tag && tag !== 'All' ? { tag } : {}),
//       });

//       const res = await fetch(`${API_BASE}/api/news?${params}`);
//       const data = await res.json();

//       setArticles(prev => reset ? data.articles : [...prev, ...data.articles]);
//       setHasMore(data.hasMore);
//       setPage(pageNum);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//       setInitialLoading(false);
//     }
//   }, [tag]);

//   // Reset when tag changes
//   useEffect(() => {
//     setArticles([]);
//     setPage(1);
//     setHasMore(true);
//     setInitialLoading(true);
//     fetchArticles(1, true);
//   }, [tag]);

//   // Intersection Observer for infinite scroll
//   useEffect(() => {
//     const el = loaderRef.current;
//     if (!el) return;

//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting && hasMore && !loading) {
//           fetchArticles(page + 1);
//         }
//       },
//       { threshold: 0.1 }
//     );

//     observer.observe(el);
//     return () => observer.disconnect();
//   }, [hasMore, loading, page, fetchArticles]);

//   return { articles, loading, initialLoading, hasMore, loaderRef };
// }





'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import type { NewsArticle } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:3002';

export function useInfiniteNews(tag: string) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);

  const fetchArticles = useCallback(async (pageNum: number, reset = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '12',
        ...(tag && tag !== 'All' ? { tag } : {}),
      });

      const res = await fetch(`${API_BASE}/api/news?${params}`);
      const data = await res.json();

      // Guard: ensure articles is always an array
      const incoming: NewsArticle[] = Array.isArray(data.articles) ? data.articles : [];

      setArticles(prev => reset ? incoming : [...prev, ...incoming]);
      setHasMore(data.hasMore ?? false);
      setPage(pageNum);
    } catch (err) {
      console.error('News fetch error:', err);
      // On error keep articles as-is, just stop loading
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [tag]);

  // Reset when tag changes
  useEffect(() => {
    setArticles([]);
    setPage(1);
    setHasMore(true);
    setInitialLoading(true);
    fetchArticles(1, true);
  }, [tag]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchArticles(page + 1);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loading, page, fetchArticles]);

  return { articles, loading, initialLoading, hasMore, loaderRef };
}