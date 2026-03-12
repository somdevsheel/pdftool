// 'use client';
// import { useState, useEffect, useRef, useCallback } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { useInfiniteNews } from '@/hooks/useInfiniteNews';
// import { FeaturedCard, NewsCard, SkeletonCard } from '@/components/news/NewsCard';
// import AdPlaceholder from '@/components/news/AdPlaceholder';
// import SubscribeSidebar from '@/components/subscribe/SubscribeSidebar';
// import type { NewsArticle } from '@/types';

// // ─── Helper ───────────────────────────────────────────────────────────────────
// function timeAgo(date: string | Date) {
//   const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
//   if (s < 60) return `${s}s ago`;
//   if (s < 3600) return `${Math.floor(s / 60)}m ago`;
//   if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
//   return `${Math.floor(s / 86400)}d ago`;
// }

// // ─── Big Card (2× FeaturedCard) ───────────────────────────────────────────────
// function BigCard({ article }: { article: NewsArticle }) {
//   return (
//     <Link
//       href={`/tech-news/${article.slug}`}
//       className="group rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 block hover:scale-[1.005]"
//       style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
//     >
//       <div className="relative overflow-hidden" style={{ height: '26rem' }}>
//         <Image
//           src={article.imageUrl}
//           alt={article.title}
//           fill
//           className="object-cover group-hover:scale-105 transition-transform duration-500"
//         />
//         <div
//           className="absolute inset-0"
//           style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 55%, transparent 100%)' }}
//         />
//         <span
//           className="absolute top-5 left-5 text-sm font-semibold px-3 py-1.5 rounded-full"
//           style={{ background: `${article.tagColor}dd`, color: '#fff' }}
//         >
//           {article.tag}
//         </span>
//       </div>
//       <div className="p-10">
//         <h2
//           className="font-bold text-2xl leading-snug mb-4 group-hover:opacity-80 transition-opacity"
//           style={{ color: 'var(--text)' }}
//         >
//           {article.title}
//         </h2>
//         <p
//           className="text-base leading-relaxed mb-8 line-clamp-3"
//           style={{ color: 'var(--text-muted)' }}
//         >
//           {article.summary}
//         </p>
//         <div className="flex items-center justify-between">
//           <span className="text-sm font-mono" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
//             via {article.source}
//           </span>
//           <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
//             <span>{article.readTime} min read</span>
//             <span>·</span>
//             <span>{timeAgo(article.createdAt)}</span>
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// }

// // ─── Big Card Skeleton ─────────────────────────────────────────────────────────
// function BigCardSkeleton() {
//   return (
//     <div className="rounded-2xl overflow-hidden animate-pulse" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
//       <div style={{ height: '26rem', background: 'var(--surface-2)' }} />
//       <div className="p-10 flex flex-col gap-4">
//         <div className="h-5 w-20 rounded" style={{ background: 'var(--surface-2)' }} />
//         <div className="h-7 w-full rounded" style={{ background: 'var(--surface-2)' }} />
//         <div className="h-7 w-4/5 rounded" style={{ background: 'var(--surface-2)' }} />
//         <div className="h-5 w-1/2 rounded mt-4" style={{ background: 'var(--surface-2)' }} />
//       </div>
//     </div>
//   );
// }

// // ─── Infinite Big Card Feed ────────────────────────────────────────────────────
// const BIG_PAGE = 4;

// function BigCardFeed({ source }: { source: NewsArticle[] }) {
//   const [visible, setVisible] = useState<NewsArticle[]>([]);
//   const [cursor, setCursor] = useState(0);
//   const [ready, setReady] = useState(false);
//   const sentinelRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (source.length === 0) return;
//     setVisible(source.slice(0, BIG_PAGE));
//     setCursor(BIG_PAGE % source.length);
//     setReady(true);
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [source.length]);

//   const loadMore = useCallback(() => {
//     if (source.length === 0) return;
//     setVisible(prev => {
//       const next: NewsArticle[] = [];
//       for (let i = 0; i < BIG_PAGE; i++) {
//         next.push(source[(cursor + i) % source.length]);
//       }
//       setCursor(c => (c + BIG_PAGE) % source.length);
//       return [...prev, ...next];
//     });
//   }, [source, cursor]);

//   useEffect(() => {
//     if (!sentinelRef.current || !ready) return;
//     const obs = new IntersectionObserver(
//       entries => { if (entries[0].isIntersecting) loadMore(); },
//       { rootMargin: '400px' }
//     );
//     obs.observe(sentinelRef.current);
//     return () => obs.disconnect();
//   }, [loadMore, ready]);

//   if (!ready) {
//     return (
//       <div className="flex flex-col gap-8">
//         {[0, 1, 2].map(i => <BigCardSkeleton key={i} />)}
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col gap-8">
//       {visible.map((article, idx) => (
//         <BigCard key={`${article._id}-${idx}`} article={article} />
//       ))}
//       <div ref={sentinelRef} className="flex justify-center py-4">
//         <div
//           className="w-8 h-8 rounded-full border-2 animate-spin"
//           style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
//         />
//       </div>
//     </div>
//   );
// }

// const CATEGORIES = ['All', 'AI', 'Security', 'Cloud', 'Tools', 'Web', 'Mobile', 'Open Source', 'Startups'];

// // Inject an ad every N articles
// const AD_EVERY = 6;

// export default function TechNewsPage() {
//   const [activeTag, setActiveTag] = useState('All');
//   const { articles, loading, initialLoading, hasMore, loaderRef } = useInfiniteNews(activeTag);

//   const featured = articles.filter(a => a.featured).slice(0, 2);
//   const regular = articles.filter(a => !a.featured);

//   // Build feed rows with ad injections
//   function buildFeed() {
//     const rows: ('ad' | number)[] = [];
//     regular.forEach((_, i) => {
//       rows.push(i);
//       if ((i + 1) % AD_EVERY === 0) rows.push('ad');
//     });
//     return rows;
//   }

//   return (
//     <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>

//       {/* Top leaderboard ad */}
//       <div className="w-full px-4 py-2 flex justify-center" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
//         <AdPlaceholder size="leaderboard" className="max-w-4xl" />
//       </div>

//       {/* Header */}
//       <header className="sticky top-0 z-20 backdrop-blur-sm"
//         style={{ background: 'rgba(28,28,28,0.92)', borderBottom: '1px solid var(--border)' }}>
//         <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
//           <Link href="/" className="flex items-center gap-3">
//             <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-lg text-white"
//               style={{ background: 'var(--accent)' }}>P</div>
//             <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--text)' }}>
//               PDF<span style={{ color: 'var(--accent)' }}>.tools</span>
//             </span>
//           </Link>
//           <nav className="hidden md:flex items-center gap-1 text-sm">
//             {[['Edit', '/#edit'], ['Convert', '/#convert'], ['E-Sign', '/#esign'], ['Tech News', '/tech-news'], ['Blog', '/blog']].map(([label, href]) => (
//               <a key={href} href={href}
//                 className="nav-link px-4 py-2 rounded text-sm transition-all duration-150"
//                 style={(label === 'Tech News' || label === 'Blog') ? { color: 'var(--accent)' } : {}}>
//                 {label}
//               </a>
//             ))}
//           </nav>
//           <div className="stamp hidden sm:flex">Free · No account · Files auto-deleted</div>
//         </div>
//       </header>

//       {/* Hero */}
//       <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
//         <div className="max-w-7xl mx-auto px-6 py-8">
//           <div className="flex items-center gap-3 mb-2">
//             <span className="text-2xl">⚡</span>
//             <h1 className="font-bold text-3xl" style={{ color: 'var(--text)' }}>Tech News</h1>
//             <span className="text-xs px-2 py-1 rounded font-mono"
//               style={{ background: 'rgba(235,16,0,0.15)', color: 'var(--accent)' }}>
//               LIVE
//             </span>
//           </div>
//           <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
//             AI, security, cloud, developer tools and document technology — updated continuously.
//           </p>

//           {/* Category tabs */}
//           <div className="flex flex-wrap gap-2">
//             {CATEGORIES.map(cat => (
//               <button key={cat} onClick={() => setActiveTag(cat)}
//                 className="text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-150"
//                 style={{
//                   background: activeTag === cat ? 'var(--accent)' : 'var(--surface-2)',
//                   color: activeTag === cat ? '#fff' : 'var(--text-muted)',
//                   border: `1px solid ${activeTag === cat ? 'var(--accent)' : 'var(--border)'}`,
//                   cursor: 'pointer',
//                 }}>
//                 {cat}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Main layout: feed + sidebar */}
//       <div className="max-w-7xl mx-auto w-full px-6 py-8 flex gap-8">

//         {/* Feed */}
//         <div className="flex-1 min-w-0 flex flex-col gap-8">

//           {/* Featured */}
//           {(initialLoading || featured.length > 0) && (
//             <section>
//               <div className="flex items-center gap-3 mb-4">
//                 <span className="text-xs font-semibold px-2 py-1 rounded"
//                   style={{ background: 'rgba(235,16,0,0.15)', color: 'var(--accent)' }}>Featured</span>
//                 <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
//               </div>
//               <div className="grid md:grid-cols-2 gap-5">
//                 {initialLoading
//                   ? [0, 1].map(i => <SkeletonCard key={i} featured />)
//                   : featured.map(a => <FeaturedCard key={a._id} article={a} />)
//                 }
//               </div>
//             </section>
//           )}

//           {/* Inline ad after featured */}
//           <AdPlaceholder size="inline" />

//           {/* Latest section header */}
//           <div className="flex items-center gap-3">
//             <h2 className="text-sm font-semibold whitespace-nowrap" style={{ color: 'var(--text)' }}>Latest Stories</h2>
//             <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
//             <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{articles.length} articles</span>
//           </div>

//           {/* Articles with ad injections */}
//           <div className="flex flex-col gap-3">
//             {initialLoading
//               ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
//               : buildFeed().map((item, idx) =>
//                   item === 'ad'
//                     ? <AdPlaceholder key={`ad-${idx}`} size="inline" className="my-2" />
//                     : <NewsCard key={regular[item]._id} article={regular[item]} />
//                 )
//             }
//           </div>

//           {/* Load more spinner / end message */}
//           <div ref={loaderRef} className="flex justify-center py-6">
//             {loading && !initialLoading && (
//               <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
//                 style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
//             )}
//             {!hasMore && !initialLoading && articles.length > 0 && (
//               <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
//                 — You've reached the end —
//               </p>
//             )}
//           </div>

//           {/* ── Big Card Infinite Feed ───────────────────────────── */}
//           {!initialLoading && articles.length > 0 && (
//             <section>
//               <div className="flex items-center gap-3 mb-6 mt-4">
//                 <span className="text-xs font-semibold px-2 py-1 rounded"
//                   style={{ background: 'rgba(235,16,0,0.15)', color: 'var(--accent)' }}>More Stories</span>
//                 <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
//               </div>
//               <BigCardFeed source={articles} />
//             </section>
//           )}

//           {/* Bottom section ad */}
//           <AdPlaceholder size="leaderboard" />
//         </div>

//         {/* Sidebar */}
//         <aside className="hidden xl:flex flex-col gap-6 w-72 flex-shrink-0">
//           <AdPlaceholder size="sidebar" />

//           <SubscribeSidebar />

//           <div className="p-4 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
//             <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>Browse by Topic</h3>
//             <div className="flex flex-col gap-1">
//               {CATEGORIES.filter(c => c !== 'All').map(cat => (
//                 <button key={cat} onClick={() => setActiveTag(cat)}
//                   className="text-sm text-left px-3 py-2 rounded-lg transition-all"
//                   style={{
//                     background: activeTag === cat ? 'var(--surface-2)' : 'transparent',
//                     color: activeTag === cat ? 'var(--text)' : 'var(--text-muted)',
//                   }}>
//                   {cat}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <AdPlaceholder size="rectangle" />

//           <div className="p-4 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
//             <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text)' }}>PDF Tools</h3>
//             <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>Free online tools — no signup needed</p>
//             <Link href="/"
//               className="block w-full text-center py-2 rounded-lg text-sm font-medium text-white transition-all"
//               style={{ background: 'var(--accent)' }}>
//               Browse Tools →
//             </Link>
//           </div>

//           <AdPlaceholder size="rectangle" />
//         </aside>
//       </div>

//       {/* Footer ad */}
//       <div className="w-full px-4 py-4 flex justify-center" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
//         <AdPlaceholder size="leaderboard" className="max-w-4xl" />
//       </div>

//       <footer style={{ borderTop: '1px solid var(--border)' }}>
//         <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
//           <span className="font-bold" style={{ color: 'var(--text)' }}>
//             PDF<span style={{ color: 'var(--accent)' }}>.tools</span>
//           </span>
//           <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>Free · Anonymous · Open source</p>
//         </div>
//       </footer>
//     </div>
//   );
// }




// 'use client';
// import { useState, useEffect, useRef, useCallback } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { useInfiniteNews } from '@/hooks/useInfiniteNews';
// import { FeaturedCard, NewsCard, SkeletonCard } from '@/components/news/NewsCard';
// import AdPlaceholder from '@/components/news/AdPlaceholder';
// import SubscribeSidebar from '@/components/subscribe/SubscribeSidebar';
// import type { NewsArticle } from '@/types';

// // ─── Helper ───────────────────────────────────────────────────────────────────
// function timeAgo(date: string | Date) {
//   const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
//   if (s < 60) return `${s}s ago`;
//   if (s < 3600) return `${Math.floor(s / 60)}m ago`;
//   if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
//   return `${Math.floor(s / 86400)}d ago`;
// }

// // ─── Big Card (2× FeaturedCard) ───────────────────────────────────────────────
// function BigCard({ article }: { article: NewsArticle }) {
//   return (
//     <Link
//       href={`/tech-news/${article.slug}`}
//       className="group rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 block hover:scale-[1.005]"
//       style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
//     >
//       <div className="relative overflow-hidden" style={{ height: '26rem' }}>
//         <Image
//           src={article.imageUrl}
//           alt={article.title}
//           fill
//           className="object-cover group-hover:scale-105 transition-transform duration-500"
//         />
//         <div
//           className="absolute inset-0"
//           style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 55%, transparent 100%)' }}
//         />
//         <span
//           className="absolute top-5 left-5 text-sm font-semibold px-3 py-1.5 rounded-full"
//           style={{ background: `${article.tagColor}dd`, color: '#fff' }}
//         >
//           {article.tag}
//         </span>
//       </div>
//       <div className="p-10">
//         <h2
//           className="font-bold text-2xl leading-snug mb-4 group-hover:opacity-80 transition-opacity"
//           style={{ color: 'var(--text)' }}
//         >
//           {article.title}
//         </h2>
//         <p
//           className="text-base leading-relaxed mb-8 line-clamp-3"
//           style={{ color: 'var(--text-muted)' }}
//         >
//           {article.summary}
//         </p>
//         <div className="flex items-center justify-between">
//           <span className="text-sm font-mono" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
//             via {article.source}
//           </span>
//           <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
//             <span>{article.readTime} min read</span>
//             <span>·</span>
//             <span>{timeAgo(article.createdAt)}</span>
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// }

// // ─── Big Card Skeleton ─────────────────────────────────────────────────────────
// function BigCardSkeleton() {
//   return (
//     <div className="rounded-2xl overflow-hidden animate-pulse" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
//       <div style={{ height: '26rem', background: 'var(--surface-2)' }} />
//       <div className="p-10 flex flex-col gap-4">
//         <div className="h-5 w-20 rounded" style={{ background: 'var(--surface-2)' }} />
//         <div className="h-7 w-full rounded" style={{ background: 'var(--surface-2)' }} />
//         <div className="h-7 w-4/5 rounded" style={{ background: 'var(--surface-2)' }} />
//         <div className="h-5 w-1/2 rounded mt-4" style={{ background: 'var(--surface-2)' }} />
//       </div>
//     </div>
//   );
// }

// // ─── Infinite Big Card Feed ────────────────────────────────────────────────────
// const BIG_PAGE = 4;

// function BigCardFeed({ source }: { source: NewsArticle[] }) {
//   const [visible, setVisible] = useState<NewsArticle[]>([]);
//   const [cursor, setCursor] = useState(0);
//   const [ready, setReady] = useState(false);
//   const sentinelRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (source.length === 0) return;
//     setVisible(source.slice(0, BIG_PAGE));
//     setCursor(BIG_PAGE % source.length);
//     setReady(true);
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [source.length]);

//   const loadMore = useCallback(() => {
//     if (source.length === 0) return;
//     setVisible(prev => {
//       const next: NewsArticle[] = [];
//       for (let i = 0; i < BIG_PAGE; i++) {
//         next.push(source[(cursor + i) % source.length]);
//       }
//       setCursor(c => (c + BIG_PAGE) % source.length);
//       return [...prev, ...next];
//     });
//   }, [source, cursor]);

//   useEffect(() => {
//     if (!sentinelRef.current || !ready) return;
//     const obs = new IntersectionObserver(
//       entries => { if (entries[0].isIntersecting) loadMore(); },
//       { rootMargin: '400px' }
//     );
//     obs.observe(sentinelRef.current);
//     return () => obs.disconnect();
//   }, [loadMore, ready]);

//   if (!ready) {
//     return (
//       <div className="flex flex-col gap-8">
//         {[0, 1, 2].map(i => <BigCardSkeleton key={i} />)}
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col gap-8">
//       {visible.map((article, idx) => (
//         <BigCard key={`${article._id}-${idx}`} article={article} />
//       ))}
//       <div ref={sentinelRef} className="flex justify-center py-4">
//         <div
//           className="w-8 h-8 rounded-full border-2 animate-spin"
//           style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
//         />
//       </div>
//     </div>
//   );
// }

// const CATEGORIES = ['All', 'AI', 'Security', 'Cloud', 'Tools', 'Web', 'Mobile', 'Open Source', 'Startups'];

// // Inject an ad every N articles
// const AD_EVERY = 6;

// export default function TechNewsPage() {
//   const [activeTag, setActiveTag] = useState('All');
//   const { articles, loading, initialLoading, hasMore, loaderRef } = useInfiniteNews(activeTag);

//   const featured = articles.filter(a => a.featured).slice(0, 2);
//   const regular = articles.filter(a => !a.featured);

//   function buildFeed() {
//     const rows: ('ad' | number)[] = [];
//     regular.forEach((_, i) => {
//       rows.push(i);
//       if ((i + 1) % AD_EVERY === 0) rows.push('ad');
//     });
//     return rows;
//   }

//   return (
//     <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>

//       {/* Top leaderboard ad */}
//       <div className="w-full px-4 py-2 flex justify-center" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
//         <AdPlaceholder size="leaderboard" className="max-w-4xl" />
//       </div>

//       {/* Header */}
//       <header className="sticky top-0 z-20 backdrop-blur-sm"
//         style={{ background: 'rgba(28,28,28,0.92)', borderBottom: '1px solid var(--border)' }}>
//         <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
//           <Link href="/" className="flex items-center gap-3">
//             <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-lg text-white"
//               style={{ background: 'var(--accent)' }}>P</div>
//             <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--text)' }}>
//               PDF<span style={{ color: 'var(--accent)' }}>.tools</span>
//             </span>
//           </Link>
//           <nav className="hidden md:flex items-center gap-1 text-sm">
//             {[['Edit', '/#edit'], ['Convert', '/#convert'], ['E-Sign', '/#esign'], ['Tech News', '/tech-news']].map(([label, href]) => (
//               <a key={href} href={href}
//                 className="nav-link px-4 py-2 rounded text-sm transition-all duration-150"
//                 style={label === 'Tech News' ? { color: 'var(--accent)' } : {}}>
//                 {label}
//               </a>
//             ))}
//           </nav>
//           {/* <div className="stamp hidden sm:flex">Free · No account · Files auto-deleted</div> */}
//         </div>
//       </header>

//       {/* Hero */}
//       <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
//         <div className="max-w-7xl mx-auto px-6 py-8">
//           <div className="flex items-center gap-3 mb-2">
//             <span className="text-2xl">⚡</span>
//             <h1 className="font-bold text-3xl" style={{ color: 'var(--text)' }}>Tech News</h1>
//             <span className="text-xs px-2 py-1 rounded font-mono"
//               style={{ background: 'rgba(235,16,0,0.15)', color: 'var(--accent)' }}>
//               LIVE
//             </span>
//           </div>
//           <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
//             AI, security, cloud, developer tools and document technology — updated continuously.
//           </p>
//           <div className="flex flex-wrap gap-2">
//             {CATEGORIES.map(cat => (
//               <button key={cat} onClick={() => setActiveTag(cat)}
//                 className="text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-150"
//                 style={{
//                   background: activeTag === cat ? 'var(--accent)' : 'var(--surface-2)',
//                   color: activeTag === cat ? '#fff' : 'var(--text-muted)',
//                   border: `1px solid ${activeTag === cat ? 'var(--accent)' : 'var(--border)'}`,
//                   cursor: 'pointer',
//                 }}>
//                 {cat}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Main layout: feed + sidebar */}
//       <div className="max-w-7xl mx-auto w-full px-6 py-8 flex gap-8">

//         {/* Feed */}
//         <div className="flex-1 min-w-0 flex flex-col gap-8">

//           {/* Featured */}
//           {(initialLoading || featured.length > 0) && (
//             <section>
//               <div className="flex items-center gap-3 mb-4">
//                 <span className="text-xs font-semibold px-2 py-1 rounded"
//                   style={{ background: 'rgba(235,16,0,0.15)', color: 'var(--accent)' }}>Featured</span>
//                 <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
//               </div>
//               <div className="grid md:grid-cols-2 gap-5">
//                 {initialLoading
//                   ? [0, 1].map(i => <SkeletonCard key={i} featured />)
//                   : featured.map(a => <FeaturedCard key={a._id} article={a} />)
//                 }
//               </div>
//             </section>
//           )}

//           {/* Inline ad after featured */}
//           <AdPlaceholder size="inline" />

//           {/* Latest section header */}
//           <div className="flex items-center gap-3">
//             <h2 className="text-sm font-semibold whitespace-nowrap" style={{ color: 'var(--text)' }}>Latest Stories</h2>
//             <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
//             <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{articles.length} articles</span>
//           </div>

//           {/* Articles with ad injections */}
//           <div className="flex flex-col gap-3">
//             {initialLoading
//               ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
//               : buildFeed().map((item, idx) =>
//                   item === 'ad'
//                     ? <AdPlaceholder key={`ad-${idx}`} size="inline" className="my-2" />
//                     : <NewsCard key={regular[item]._id} article={regular[item]} />
//                 )
//             }
//           </div>

//           {/* Load more spinner / end message */}
//           <div ref={loaderRef} className="flex justify-center py-6">
//             {loading && !initialLoading && (
//               <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
//                 style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
//             )}
//             {!hasMore && !initialLoading && articles.length > 0 && (
//               <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
//                 — You've reached the end —
//               </p>
//             )}
//           </div>

//           {/* ── Big Card Infinite Feed ───────────────────────────── */}
//           {!initialLoading && articles.length > 0 && (
//             <section>
//               <div className="flex items-center gap-3 mb-6 mt-4">
//                 <span className="text-xs font-semibold px-2 py-1 rounded"
//                   style={{ background: 'rgba(235,16,0,0.15)', color: 'var(--accent)' }}>More Stories</span>
//                 <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
//               </div>
//               <BigCardFeed source={articles} />
//             </section>
//           )}

//           {/* Bottom section ad */}
//           <AdPlaceholder size="leaderboard" />
//         </div>

//         {/* Sidebar */}
//         <aside className="hidden xl:flex flex-col gap-6 w-72 flex-shrink-0">
//           <AdPlaceholder size="sidebar" />

//           <SubscribeSidebar />

//           <div className="p-4 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
//             <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>Browse by Topic</h3>
//             <div className="flex flex-col gap-1">
//               {CATEGORIES.filter(c => c !== 'All').map(cat => (
//                 <button key={cat} onClick={() => setActiveTag(cat)}
//                   className="text-sm text-left px-3 py-2 rounded-lg transition-all"
//                   style={{
//                     background: activeTag === cat ? 'var(--surface-2)' : 'transparent',
//                     color: activeTag === cat ? 'var(--text)' : 'var(--text-muted)',
//                   }}>
//                   {cat}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <AdPlaceholder size="rectangle" />

//           <div className="p-4 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
//             <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text)' }}>PDF Tools</h3>
//             <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>Free online tools — no signup needed</p>
//             <Link href="/"
//               className="block w-full text-center py-2 rounded-lg text-sm font-medium text-white transition-all"
//               style={{ background: 'var(--accent)' }}>
//               Browse Tools →
//             </Link>
//           </div>

//           <AdPlaceholder size="rectangle" />
//         </aside>
//       </div>

//       {/* Footer ad */}
//       <div className="w-full px-4 py-4 flex justify-center" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
//         <AdPlaceholder size="leaderboard" className="max-w-4xl" />
//       </div>

//       <footer style={{ borderTop: '1px solid var(--border)' }}>
//         <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
//           <span className="font-bold" style={{ color: 'var(--text)' }}>
//             PDF<span style={{ color: 'var(--accent)' }}>.tools</span>
//           </span>
//           <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>Free · Anonymous · Open source</p>
//         </div>
//       </footer>
//     </div>
//   );
// }






// 'use client';
// import { useState, useEffect, useRef, useCallback } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { useInfiniteNews } from '@/hooks/useInfiniteNews';
// import { FeaturedCard, NewsCard, SkeletonCard } from '@/components/news/NewsCard';
// import AdPlaceholder from '@/components/news/AdPlaceholder';
// import SubscribeSidebar from '@/components/subscribe/SubscribeSidebar';
// import type { NewsArticle } from '@/types';

// // ─── Helper ───────────────────────────────────────────────────────────────────
// function timeAgo(date: string | Date) {
//   const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
//   if (s < 60) return `${s}s ago`;
//   if (s < 3600) return `${Math.floor(s / 60)}m ago`;
//   if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
//   return `${Math.floor(s / 86400)}d ago`;
// }

// // ─── Big Card (2× FeaturedCard) ───────────────────────────────────────────────
// function BigCard({ article }: { article: NewsArticle }) {
//   return (
//     <Link
//       href={`/tech-news/${article.slug}`}
//       className="group rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 block hover:scale-[1.005]"
//       style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
//     >
//       <div className="relative overflow-hidden" style={{ height: '26rem' }}>
//         <Image
//           src={article.imageUrl}
//           alt={article.title}
//           fill
//           className="object-cover group-hover:scale-105 transition-transform duration-500"
//         />
//         <div
//           className="absolute inset-0"
//           style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 55%, transparent 100%)' }}
//         />
//         <span
//           className="absolute top-5 left-5 text-sm font-semibold px-3 py-1.5 rounded-full"
//           style={{ background: `${article.tagColor}dd`, color: '#fff' }}
//         >
//           {article.tag}
//         </span>
//       </div>
//       <div className="p-10">
//         <h2
//           className="font-bold text-2xl leading-snug mb-4 group-hover:opacity-80 transition-opacity"
//           style={{ color: 'var(--text)' }}
//         >
//           {article.title}
//         </h2>
//         <p
//           className="text-base leading-relaxed mb-8 line-clamp-3"
//           style={{ color: 'var(--text-muted)' }}
//         >
//           {article.summary}
//         </p>
//         <div className="flex items-center justify-between">
//           <span className="text-sm font-mono" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
//             via {article.source}
//           </span>
//           <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
//             <span>{article.readTime} min read</span>
//             <span>·</span>
//             <span>{timeAgo(article.createdAt)}</span>
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// }

// // ─── Big Card Skeleton ─────────────────────────────────────────────────────────
// function BigCardSkeleton() {
//   return (
//     <div className="rounded-2xl overflow-hidden animate-pulse" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
//       <div style={{ height: '26rem', background: 'var(--surface-2)' }} />
//       <div className="p-10 flex flex-col gap-4">
//         <div className="h-5 w-20 rounded" style={{ background: 'var(--surface-2)' }} />
//         <div className="h-7 w-full rounded" style={{ background: 'var(--surface-2)' }} />
//         <div className="h-7 w-4/5 rounded" style={{ background: 'var(--surface-2)' }} />
//         <div className="h-5 w-1/2 rounded mt-4" style={{ background: 'var(--surface-2)' }} />
//       </div>
//     </div>
//   );
// }

// // ─── Infinite Big Card Feed ────────────────────────────────────────────────────
// const BIG_PAGE = 4;

// function BigCardFeed({ source }: { source: NewsArticle[] }) {
//   const [visible, setVisible] = useState<NewsArticle[]>([]);
//   const [cursor, setCursor] = useState(0);
//   const [ready, setReady] = useState(false);
//   const sentinelRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (source.length === 0) return;
//     setVisible(source.slice(0, BIG_PAGE));
//     setCursor(BIG_PAGE % source.length);
//     setReady(true);
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [source.length]);

//   const loadMore = useCallback(() => {
//     if (source.length === 0) return;
//     setCursor(prev => {
//       const next: NewsArticle[] = [];
//       for (let i = 0; i < BIG_PAGE; i++) {
//         next.push(source[(prev + i) % source.length]);
//       }
//       setVisible(v => [...v, ...next]);
//       return (prev + BIG_PAGE) % source.length;
//     });
//   }, [source]);

//   useEffect(() => {
//     if (!sentinelRef.current || !ready) return;
//     const obs = new IntersectionObserver(
//       entries => { if (entries[0].isIntersecting) loadMore(); },
//       { rootMargin: '400px' }
//     );
//     obs.observe(sentinelRef.current);
//     return () => obs.disconnect();
//   }, [loadMore, ready]);

//   if (!ready) {
//     return (
//       <div className="flex flex-col gap-8">
//         {[0, 1, 2].map(i => <BigCardSkeleton key={i} />)}
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col gap-8">
//       {visible.map((article, idx) => (
//         <BigCard key={`${article._id}-${idx}`} article={article} />
//       ))}
//       <div ref={sentinelRef} className="flex justify-center py-4">
//         <div
//           className="w-8 h-8 rounded-full border-2 animate-spin"
//           style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
//         />
//       </div>
//     </div>
//   );
// }

// const CATEGORIES = ['All', 'AI', 'Security', 'Cloud', 'Tools', 'Web', 'Mobile', 'Open Source', 'Startups'];

// // Inject an ad every N articles
// const AD_EVERY = 6;

// export default function TechNewsPage() {
//   const [activeTag, setActiveTag] = useState('All');
//   const { articles, loading, initialLoading, hasMore, loaderRef } = useInfiniteNews(activeTag);

//   const featured = articles.filter(a => a.featured).slice(0, 2);
//   const regular = articles.filter(a => !a.featured);

//   function buildFeed() {
//     const rows: ('ad' | number)[] = [];
//     regular.forEach((_, i) => {
//       rows.push(i);
//       if ((i + 1) % AD_EVERY === 0) rows.push('ad');
//     });
//     return rows;
//   }

//   return (
//     <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>

//       {/* Top leaderboard ad */}
//       <div className="w-full px-4 py-2 flex justify-center" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
//         <AdPlaceholder size="leaderboard" className="max-w-4xl" />
//       </div>

//       {/* Header */}
//       <header className="sticky top-0 z-20 backdrop-blur-sm"
//         style={{ background: 'rgba(28,28,28,0.92)', borderBottom: '1px solid var(--border)' }}>
//         <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
//           <Link href="/" className="flex items-center gap-3">
//             <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-lg text-white"
//               style={{ background: 'var(--accent)' }}>P</div>
//             <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--text)' }}>
//               PDF<span style={{ color: 'var(--accent)' }}>.tools</span>
//             </span>
//           </Link>
//           <nav className="hidden md:flex items-center gap-1 text-sm">
//             {[['Edit', '/#edit'], ['Convert', '/#convert'], ['E-Sign', '/#esign'], ['Tech News', '/tech-news']].map(([label, href]) => (
//               <a key={href} href={href}
//                 className="nav-link px-4 py-2 rounded text-sm transition-all duration-150"
//                 style={label === 'Tech News' ? { color: 'var(--accent)' } : {}}>
//                 {label}
//               </a>
//             ))}
//           </nav>
//           {/* <div className="stamp hidden sm:flex">Free · No account · Files auto-deleted</div> */}
//         </div>
//       </header>

//       {/* Hero */}
//       <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
//         <div className="max-w-7xl mx-auto px-6 py-8">
//           <div className="flex items-center gap-3 mb-2">
//             <span className="text-2xl">⚡</span>
//             <h1 className="font-bold text-3xl" style={{ color: 'var(--text)' }}>Tech News</h1>
//             <span className="text-xs px-2 py-1 rounded font-mono"
//               style={{ background: 'rgba(235,16,0,0.15)', color: 'var(--accent)' }}>
//               LIVE
//             </span>
//           </div>
//           <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
//             AI, security, cloud, developer tools and document technology — updated continuously.
//           </p>
//           <div className="flex flex-wrap gap-2">
//             {CATEGORIES.map(cat => (
//               <button key={cat} onClick={() => setActiveTag(cat)}
//                 className="text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-150"
//                 style={{
//                   background: activeTag === cat ? 'var(--accent)' : 'var(--surface-2)',
//                   color: activeTag === cat ? '#fff' : 'var(--text-muted)',
//                   border: `1px solid ${activeTag === cat ? 'var(--accent)' : 'var(--border)'}`,
//                   cursor: 'pointer',
//                 }}>
//                 {cat}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Main layout: feed + sidebar */}
//       <div className="max-w-7xl mx-auto w-full px-6 py-8 flex gap-8">

//         {/* Feed */}
//         <div className="flex-1 min-w-0 flex flex-col gap-8">

//           {/* Featured */}
//           {(initialLoading || featured.length > 0) && (
//             <section>
//               <div className="flex items-center gap-3 mb-4">
//                 <span className="text-xs font-semibold px-2 py-1 rounded"
//                   style={{ background: 'rgba(235,16,0,0.15)', color: 'var(--accent)' }}>Featured</span>
//                 <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
//               </div>
//               <div className="grid md:grid-cols-2 gap-5">
//                 {initialLoading
//                   ? [0, 1].map(i => <SkeletonCard key={i} featured />)
//                   : featured.map(a => <FeaturedCard key={a._id} article={a} />)
//                 }
//               </div>
//             </section>
//           )}

//           {/* Inline ad after featured */}
//           <AdPlaceholder size="inline" />

//           {/* Latest section header */}
//           <div className="flex items-center gap-3">
//             <h2 className="text-sm font-semibold whitespace-nowrap" style={{ color: 'var(--text)' }}>Latest Stories</h2>
//             <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
//             <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{articles.length} articles</span>
//           </div>

//           {/* Articles with ad injections */}
//           <div className="flex flex-col gap-3">
//             {initialLoading
//               ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
//               : buildFeed().map((item, idx) =>
//                   item === 'ad'
//                     ? <AdPlaceholder key={`ad-${idx}`} size="inline" className="my-2" />
//                     : <NewsCard key={regular[item]._id} article={regular[item]} />
//                 )
//             }
//           </div>

//           {/* Load more spinner / end message */}
//           <div ref={loaderRef} className="flex justify-center py-6">
//             {loading && !initialLoading && (
//               <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
//                 style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
//             )}
//             {!hasMore && !initialLoading && articles.length > 0 && (
//               <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
//                 — You've reached the end —
//               </p>
//             )}
//           </div>

//           {/* ── Big Card Infinite Feed ───────────────────────────── */}
//           {!initialLoading && articles.length > 0 && (
//             <section>
//               <div className="flex items-center gap-3 mb-6 mt-4">
//                 <span className="text-xs font-semibold px-2 py-1 rounded"
//                   style={{ background: 'rgba(235,16,0,0.15)', color: 'var(--accent)' }}>More Stories</span>
//                 <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
//               </div>
//               <BigCardFeed source={articles} />
//             </section>
//           )}

//           {/* Bottom section ad */}
//           <AdPlaceholder size="leaderboard" />
//         </div>

//         {/* Sidebar */}
//         <aside className="hidden xl:flex flex-col gap-6 w-72 flex-shrink-0">
//           <AdPlaceholder size="sidebar" />

//           <SubscribeSidebar />

//           <div className="p-4 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
//             <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>Browse by Topic</h3>
//             <div className="flex flex-col gap-1">
//               {CATEGORIES.filter(c => c !== 'All').map(cat => (
//                 <button key={cat} onClick={() => setActiveTag(cat)}
//                   className="text-sm text-left px-3 py-2 rounded-lg transition-all"
//                   style={{
//                     background: activeTag === cat ? 'var(--surface-2)' : 'transparent',
//                     color: activeTag === cat ? 'var(--text)' : 'var(--text-muted)',
//                   }}>
//                   {cat}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <AdPlaceholder size="rectangle" />

//           <div className="p-4 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
//             <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text)' }}>PDF Tools</h3>
//             <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>Free online tools — no signup needed</p>
//             <Link href="/"
//               className="block w-full text-center py-2 rounded-lg text-sm font-medium text-white transition-all"
//               style={{ background: 'var(--accent)' }}>
//               Browse Tools →
//             </Link>
//           </div>

//           <AdPlaceholder size="rectangle" />
//         </aside>
//       </div>

//       {/* Footer ad */}
//       <div className="w-full px-4 py-4 flex justify-center" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
//         <AdPlaceholder size="leaderboard" className="max-w-4xl" />
//       </div>

//       <footer style={{ borderTop: '1px solid var(--border)' }}>
//         <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
//           <span className="font-bold" style={{ color: 'var(--text)' }}>
//             PDF<span style={{ color: 'var(--accent)' }}>.tools</span>
//           </span>
//           <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>Free · Anonymous · Open source</p>
//         </div>
//       </footer>
//     </div>
//   );
// }






// 'use client';
// import { useState, useEffect, useRef, useCallback } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { useInfiniteNews } from '@/hooks/useInfiniteNews';
// import { FeaturedCard, NewsCard, SkeletonCard } from '@/components/news/NewsCard';
// import AdPlaceholder from '@/components/news/AdPlaceholder';
// import SubscribeSidebar from '@/components/subscribe/SubscribeSidebar';
// import type { NewsArticle } from '@/types';

// // ─── Helper ───────────────────────────────────────────────────────────────────
// function timeAgo(date: string | Date) {
//   const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
//   if (s < 60) return `${s}s ago`;
//   if (s < 3600) return `${Math.floor(s / 60)}m ago`;
//   if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
//   return `${Math.floor(s / 86400)}d ago`;
// }

// // ─── Big Card (2× FeaturedCard) ───────────────────────────────────────────────
// function BigCard({ article }: { article: NewsArticle }) {
//   return (
//     <Link
//       href={`/tech-news/${article.slug}`}
//       className="group rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 block hover:scale-[1.005]"
//       style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
//     >
//       <div className="relative overflow-hidden" style={{ height: '26rem' }}>
//         <Image
//           src={article.imageUrl}
//           alt={article.title}
//           fill
//           className="object-cover group-hover:scale-105 transition-transform duration-500"
//         />
//         <div
//           className="absolute inset-0"
//           style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 55%, transparent 100%)' }}
//         />
//         <span
//           className="absolute top-5 left-5 text-sm font-semibold px-3 py-1.5 rounded-full"
//           style={{ background: `${article.tagColor}dd`, color: '#fff' }}
//         >
//           {article.tag}
//         </span>
//       </div>
//       <div className="p-10">
//         <h2
//           className="font-bold text-2xl leading-snug mb-4 group-hover:opacity-80 transition-opacity"
//           style={{ color: 'var(--text)' }}
//         >
//           {article.title}
//         </h2>
//         <p
//           className="text-base leading-relaxed mb-8 line-clamp-3"
//           style={{ color: 'var(--text-muted)' }}
//         >
//           {article.summary}
//         </p>
//         <div className="flex items-center justify-between">
//           <span className="text-sm font-mono" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
//             via {article.source}
//           </span>
//           <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
//             <span>{article.readTime} min read</span>
//             <span>·</span>
//             <span>{timeAgo(article.createdAt)}</span>
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// }

// // ─── Big Card Skeleton ─────────────────────────────────────────────────────────
// function BigCardSkeleton() {
//   return (
//     <div className="rounded-2xl overflow-hidden animate-pulse" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
//       <div style={{ height: '26rem', background: 'var(--surface-2)' }} />
//       <div className="p-10 flex flex-col gap-4">
//         <div className="h-5 w-20 rounded" style={{ background: 'var(--surface-2)' }} />
//         <div className="h-7 w-full rounded" style={{ background: 'var(--surface-2)' }} />
//         <div className="h-7 w-4/5 rounded" style={{ background: 'var(--surface-2)' }} />
//         <div className="h-5 w-1/2 rounded mt-4" style={{ background: 'var(--surface-2)' }} />
//       </div>
//     </div>
//   );
// }

// // ─── Infinite Big Card Feed ────────────────────────────────────────────────────
// const BIG_PAGE = 4;

// function BigCardFeed({ source }: { source: NewsArticle[] }) {
//   const [visible, setVisible] = useState<NewsArticle[]>([]);
//   const [cursor, setCursor] = useState(0);
//   const [ready, setReady] = useState(false);
//   const sentinelRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (source.length === 0) return;
//     setVisible(source.slice(0, BIG_PAGE));
//     setCursor(BIG_PAGE % source.length);
//     setReady(true);
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [source.length]);

//   const loadMore = useCallback(() => {
//     if (source.length === 0) return;
//     setCursor(prev => {
//       const next: NewsArticle[] = [];
//       for (let i = 0; i < BIG_PAGE; i++) {
//         next.push(source[(prev + i) % source.length]);
//       }
//       setVisible(v => [...v, ...next]);
//       return (prev + BIG_PAGE) % source.length;
//     });
//   }, [source]);

//   useEffect(() => {
//     if (!sentinelRef.current || !ready) return;
//     const obs = new IntersectionObserver(
//       entries => { if (entries[0].isIntersecting) loadMore(); },
//       { rootMargin: '400px' }
//     );
//     obs.observe(sentinelRef.current);
//     return () => obs.disconnect();
//   }, [loadMore, ready]);

//   if (!ready) {
//     return (
//       <div className="flex flex-col gap-8">
//         {[0, 1, 2].map(i => <BigCardSkeleton key={i} />)}
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col gap-8">
//       {visible.map((article, idx) => (
//         <BigCard key={`${article._id}-${idx}`} article={article} />
//       ))}
//       <div ref={sentinelRef} className="flex justify-center py-4">
//         <div
//           className="w-8 h-8 rounded-full border-2 animate-spin"
//           style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
//         />
//       </div>
//     </div>
//   );
// }

// const CATEGORIES = ['All', 'AI', 'Security', 'Cloud', 'Tools', 'Web', 'Mobile', 'Open Source', 'Startups'];

// // Inject an ad every N articles
// const AD_EVERY = 6;

// export default function TechNewsPage() {
//   const [activeTag, setActiveTag] = useState('All');
//   const { articles, loading, initialLoading, hasMore, loaderRef } = useInfiniteNews(activeTag);

//   const featured = articles.filter(a => a.featured).slice(0, 2);
//   const regular = articles.filter(a => !a.featured);

//   function buildFeed() {
//     const rows: ('ad' | number)[] = [];
//     regular.forEach((_, i) => {
//       rows.push(i);
//       if ((i + 1) % AD_EVERY === 0) rows.push('ad');
//     });
//     return rows;
//   }

//   return (
//     <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>

//       {/* Top leaderboard ad */}
//       <div className="w-full px-4 py-2 flex justify-center" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
//         <AdPlaceholder size="leaderboard" className="max-w-4xl" />
//       </div>

//       {/* Header */}
//       <header className="sticky top-0 z-20 backdrop-blur-sm"
//         style={{ background: 'rgba(28,28,28,0.92)', borderBottom: '1px solid var(--border)' }}>
//         <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
//           <Link href="/" className="flex items-center gap-3">
//             <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-lg text-white"
//               style={{ background: 'var(--accent)' }}>P</div>
//             <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--text)' }}>
//               PDF<span style={{ color: 'var(--accent)' }}>.tools</span>
//             </span>
//           </Link>
//           <nav className="hidden md:flex items-center gap-1 text-sm">
//             {[['Edit', '/#edit'], ['Convert', '/#convert'], ['E-Sign', '/#esign'], ['Tech News', '/tech-news']].map(([label, href]) => (
//               <a key={href} href={href}
//                 className="nav-link px-4 py-2 rounded text-sm transition-all duration-150"
//                 style={label === 'Tech News' ? { color: 'var(--accent)' } : {}}>
//                 {label}
//               </a>
//             ))}
//           </nav>
//           {/* <div className="stamp hidden sm:flex">Free · No account · Files auto-deleted</div> */}
//         </div>
//       </header>

//       {/* Hero */}
//       <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
//         <div className="max-w-7xl mx-auto px-6 py-8">
//           <div className="flex items-center gap-3 mb-2">
//             <span className="text-2xl">⚡</span>
//             <h1 className="font-bold text-3xl" style={{ color: 'var(--text)' }}>Tech News</h1>
//             <span className="text-xs px-2 py-1 rounded font-mono"
//               style={{ background: 'rgba(235,16,0,0.15)', color: 'var(--accent)' }}>
//               LIVE
//             </span>
//           </div>
//           <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
//             AI, security, cloud, developer tools and document technology — updated continuously.
//           </p>
//           <div className="flex flex-wrap gap-2">
//             {CATEGORIES.map(cat => (
//               <button key={cat} onClick={() => setActiveTag(cat)}
//                 className="text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-150"
//                 style={{
//                   background: activeTag === cat ? 'var(--accent)' : 'var(--surface-2)',
//                   color: activeTag === cat ? '#fff' : 'var(--text-muted)',
//                   border: `1px solid ${activeTag === cat ? 'var(--accent)' : 'var(--border)'}`,
//                   cursor: 'pointer',
//                 }}>
//                 {cat}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Main layout: feed + sidebar */}
//       <div className="max-w-7xl mx-auto w-full px-6 py-8 flex gap-8">

//         {/* Feed */}
//         <div className="flex-1 min-w-0 flex flex-col gap-8">

//           {/* Featured */}
//           {(initialLoading || featured.length > 0) && (
//             <section>
//               <div className="flex items-center gap-3 mb-4">
//                 <span className="text-xs font-semibold px-2 py-1 rounded"
//                   style={{ background: 'rgba(235,16,0,0.15)', color: 'var(--accent)' }}>Featured</span>
//                 <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
//               </div>
//               <div className="grid md:grid-cols-2 gap-5">
//                 {initialLoading
//                   ? [0, 1].map(i => <SkeletonCard key={i} featured />)
//                   : featured.map(a => <FeaturedCard key={a._id} article={a} />)
//                 }
//               </div>
//             </section>
//           )}

//           {/* Inline ad after featured */}
//           <AdPlaceholder size="inline" />

//           {/* Latest section header */}
//           <div className="flex items-center gap-3">
//             <h2 className="text-sm font-semibold whitespace-nowrap" style={{ color: 'var(--text)' }}>Latest Stories</h2>
//             <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
//             <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{articles.length} articles</span>
//           </div>

//           {/* Articles with ad injections */}
//           <div className="flex flex-col gap-3">
//             {initialLoading
//               ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
//               : buildFeed().map((item, idx) =>
//                   item === 'ad'
//                     ? <AdPlaceholder key={`ad-${idx}`} size="inline" className="my-2" />
//                     : <NewsCard key={regular[item]._id} article={regular[item]} />
//                 )
//             }
//           </div>

//           {/* Load more spinner / end message */}
//           <div ref={loaderRef} className="flex justify-center py-6">
//             {loading && !initialLoading && (
//               <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
//                 style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
//             )}
//             {!hasMore && !initialLoading && articles.length > 0 && (
//               <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
//                 — You've reached the end —
//               </p>
//             )}
//           </div>

//           {/* ── Big Card Infinite Feed ───────────────────────────── */}
//           {!initialLoading && articles.length > 0 && (
//             <section>
//               <div className="flex items-center gap-3 mb-6 mt-4">
//                 <span className="text-xs font-semibold px-2 py-1 rounded"
//                   style={{ background: 'rgba(235,16,0,0.15)', color: 'var(--accent)' }}>More Stories</span>
//                 <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
//               </div>
//               <BigCardFeed source={articles} />
//             </section>
//           )}

//           {/* Bottom section ad */}
//           <AdPlaceholder size="leaderboard" />
//         </div>

//         {/* Sidebar */}
//         <aside className="hidden xl:flex flex-col gap-6 w-72 flex-shrink-0">
//           <AdPlaceholder size="sidebar" />

//           <SubscribeSidebar />

//           <div className="p-4 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
//             <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text)' }}>PDF Tools</h3>
//             <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>Free online tools — no signup needed</p>
//             <Link href="/"
//               className="block w-full text-center py-2 rounded-lg text-sm font-medium text-white transition-all"
//               style={{ background: 'var(--accent)' }}>
//               Browse Tools →
//             </Link>
//           </div>

//           <AdPlaceholder size="rectangle" />
//         </aside>
//       </div>

//       {/* Footer ad */}
//       <div className="w-full px-4 py-4 flex justify-center" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
//         <AdPlaceholder size="leaderboard" className="max-w-4xl" />
//       </div>

//       <footer style={{ borderTop: '1px solid var(--border)' }}>
//         <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
//           <span className="font-bold" style={{ color: 'var(--text)' }}>
//             PDF<span style={{ color: 'var(--accent)' }}>.tools</span>
//           </span>
//           <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>Free · Anonymous · Open source</p>
//         </div>
//       </footer>
//     </div>
//   );
// }






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