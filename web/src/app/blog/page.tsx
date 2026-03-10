// 'use client';
// import { useState, useEffect, useRef, useCallback } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';

// const API_BASE = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'https://pdftooladmin.arutechconsultancy.com';
// const CATEGORIES = ['All', 'PDF Tips', 'Tutorials', 'How-To', 'Merge PDF', 'Split PDF', 'Compress PDF', 'Convert PDF', 'Edit PDF', 'Sign PDF', 'OCR'];

// interface BlogPost {
//   _id: string; title: string; summary: string; tag: string; tagColor: string;
//   imageUrl: string; readTime: number; featured: boolean; createdAt: string; slug: string;
//   author: { name: string };
// }

// function timeAgo(d: string) {
//   const diff = Date.now() - new Date(d).getTime();
//   const days = Math.floor(diff / 86400000);
//   if (days === 0) return 'Today';
//   if (days === 1) return 'Yesterday';
//   if (days < 7) return `${days}d ago`;
//   return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
// }

// export default function BlogPage() {
//   const [activeTag, setActiveTag] = useState('All');
//   const [posts, setPosts] = useState<BlogPost[]>([]);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [initialLoading, setInitialLoading] = useState(true);
//   const loaderRef = useRef<HTMLDivElement>(null);

//   const fetchPosts = useCallback(async (pageNum: number, reset = false) => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams({ page: pageNum.toString(), limit: '9', ...(activeTag !== 'All' ? { tag: activeTag } : {}) });
//       const res = await fetch(`${API_BASE}/api/blog?${params}`);
//       const data = await res.json();
//       const incoming: BlogPost[] = Array.isArray(data.posts) ? data.posts : [];
//       setPosts(prev => reset ? incoming : [...prev, ...incoming]);
//       setHasMore(data.hasMore ?? false);
//       setPage(pageNum);
//     } catch { /* silent */ }
//     finally { setLoading(false); setInitialLoading(false); }
//   }, [activeTag]);

//   useEffect(() => {
//     setPosts([]); setPage(1); setHasMore(true); setInitialLoading(true);
//     fetchPosts(1, true);
//   }, [activeTag]);

//   useEffect(() => {
//     const el = loaderRef.current;
//     if (!el) return;
//     const obs = new IntersectionObserver(entries => {
//       if (entries[0].isIntersecting && hasMore && !loading) fetchPosts(page + 1);
//     }, { threshold: 0.1 });
//     obs.observe(el);
//     return () => obs.disconnect();
//   }, [hasMore, loading, page, fetchPosts]);

//   const featured = posts.filter(p => p.featured).slice(0, 1)[0];
//   const rest = posts.filter(p => !featured || p._id !== featured._id);

//   return (
//     <div className="min-h-screen" style={{ background: 'var(--bg)' }}>

//       {/* Header */}
//       <header className="sticky top-0 z-20 backdrop-blur-sm"
//         style={{ background: 'rgba(28,28,28,0.92)', borderBottom: '1px solid var(--border)' }}>
//         <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
//           <Link href="/" className="flex items-center gap-3">
//             <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-lg text-white" style={{ background: 'var(--accent)' }}>P</div>
//             <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--text)' }}>PDF<span style={{ color: 'var(--accent)' }}>.tools</span></span>
//           </Link>
//           <nav className="hidden md:flex items-center gap-1 text-sm">
//             {[['Edit', '/#edit'], ['Convert', '/#convert'], ['Tech News', '/tech-news'], ['Blog', '/blog']].map(([label, href]) => (
//               <Link key={href} href={href}
//                 className="px-4 py-2 rounded text-sm transition-all"
//                 style={{ color: label === 'Blog' ? 'var(--accent)' : 'var(--text-muted)' }}>
//                 {label}
//               </Link>
//             ))}
//           </nav>
//         </div>
//       </header>

//       {/* Hero */}
//       <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
//         <div className="max-w-7xl mx-auto px-6 py-10">
//           <div className="flex items-center gap-3 mb-2">
//             <span className="text-2xl">📝</span>
//             <h1 className="font-bold text-3xl" style={{ color: 'var(--text)' }}>PDF Blog</h1>
//           </div>
//           <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
//             Tips, tutorials and how-to guides for working with PDFs.
//           </p>
//           <div className="flex flex-wrap gap-2">
//             {CATEGORIES.map(cat => (
//               <button key={cat} onClick={() => setActiveTag(cat)}
//                 className="text-xs px-3 py-1.5 rounded-full font-medium transition-all"
//                 style={{
//                   background: activeTag === cat ? 'var(--accent)' : 'var(--surface-2)',
//                   color: activeTag === cat ? '#fff' : 'var(--text-muted)',
//                   border: `1px solid ${activeTag === cat ? 'var(--accent)' : 'var(--border)'}`,
//                 }}>
//                 {cat}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-10">

//         {/* Featured post hero */}
//         {!initialLoading && featured && (
//           <Link href={`/blog/${featured.slug}`}
//             className="group block rounded-2xl overflow-hidden mb-10 transition-all hover:scale-[1.005]"
//             style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
//             <div className="grid md:grid-cols-2">
//               <div className="relative h-64 md:h-80">
//                 <Image src={featured.imageUrl} alt={featured.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
//                 <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full"
//                   style={{ background: 'var(--accent)', color: '#fff' }}>FEATURED</span>
//               </div>
//               <div className="p-8 flex flex-col justify-center">
//                 <span className="text-xs font-semibold px-2 py-0.5 rounded-full inline-block mb-3 w-fit"
//                   style={{ background: `${featured.tagColor}22`, color: featured.tagColor }}>
//                   {featured.tag}
//                 </span>
//                 <h2 className="font-bold text-2xl leading-tight mb-3 group-hover:opacity-80 transition-opacity"
//                   style={{ color: 'var(--text)' }}>{featured.title}</h2>
//                 <p className="text-sm leading-relaxed mb-4 line-clamp-3" style={{ color: 'var(--text-muted)' }}>
//                   {featured.summary}
//                 </p>
//                 <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
//                   <span>{featured.author?.name}</span>
//                   <span>·</span>
//                   <span>{featured.readTime} min read</span>
//                   <span>·</span>
//                   <span>{timeAgo(featured.createdAt)}</span>
//                 </div>
//               </div>
//             </div>
//           </Link>
//         )}

//         {/* Grid */}
//         {initialLoading ? (
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {Array.from({ length: 6 }).map((_, i) => (
//               <div key={i} className="rounded-xl overflow-hidden animate-pulse" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
//                 <div className="h-44" style={{ background: 'var(--surface-2)' }} />
//                 <div className="p-5 flex flex-col gap-2">
//                   <div className="h-3 w-16 rounded" style={{ background: 'var(--surface-2)' }} />
//                   <div className="h-4 w-full rounded" style={{ background: 'var(--surface-2)' }} />
//                   <div className="h-4 w-3/4 rounded" style={{ background: 'var(--surface-2)' }} />
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : rest.length === 0 && !featured ? (
//           <div className="text-center py-20">
//             <p className="text-4xl mb-4">📝</p>
//             <p className="text-lg font-medium" style={{ color: 'var(--text)' }}>No posts yet</p>
//             <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>Check back soon for PDF tips and tutorials</p>
//           </div>
//         ) : (
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {rest.map(post => (
//               <Link key={post._id} href={`/blog/${post.slug}`}
//                 className="group block rounded-xl overflow-hidden transition-all hover:scale-[1.02]"
//                 style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
//                 <div className="relative h-44 overflow-hidden">
//                   <Image src={post.imageUrl} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
//                 </div>
//                 <div className="p-5">
//                   <span className="text-xs font-semibold px-2 py-0.5 rounded-full inline-block mb-2"
//                     style={{ background: `${post.tagColor}22`, color: post.tagColor }}>
//                     {post.tag}
//                   </span>
//                   <h3 className="font-semibold text-sm leading-snug mb-2 group-hover:opacity-80 line-clamp-2"
//                     style={{ color: 'var(--text)' }}>{post.title}</h3>
//                   <p className="text-xs leading-relaxed line-clamp-2 mb-3" style={{ color: 'var(--text-muted)' }}>
//                     {post.summary}
//                   </p>
//                   <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
//                     <span>{post.readTime} min</span>
//                     <span>·</span>
//                     <span>{timeAgo(post.createdAt)}</span>
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         )}

//         {/* Infinite scroll loader */}
//         <div ref={loaderRef} className="flex justify-center py-8">
//           {loading && !initialLoading && (
//             <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
//               style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
//           )}
//           {!hasMore && !initialLoading && posts.length > 0 && (
//             <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>— End of blog —</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// const API_BASE = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:3002';
const API_BASE = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'https://pdftooladmin.arutechconsultancy.com';
const CATEGORIES = ['All', 'PDF Tips', 'Tutorials', 'How-To', 'Merge PDF', 'Split PDF', 'Compress PDF', 'Convert PDF', 'Edit PDF', 'Sign PDF', 'OCR'];

interface BlogPost {
  _id: string; title: string; summary: string; tag: string; tagColor: string;
  imageUrl: string; readTime: number; featured: boolean; createdAt: string; slug: string;
  author: { name: string };
}

function timeAgo(d: string) {
  if (typeof window === 'undefined') return '';
  const diff = Date.now() - new Date(d).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function BlogPage() {
  const [activeTag, setActiveTag] = useState('All');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);

  const fetchPosts = useCallback(async (pageNum: number, reset = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: pageNum.toString(), limit: '9', ...(activeTag !== 'All' ? { tag: activeTag } : {}) });
      const res = await fetch(`${API_BASE}/api/blog?${params}`);
      const data = await res.json();
      const incoming: BlogPost[] = Array.isArray(data.posts) ? data.posts : [];
      setPosts(prev => reset ? incoming : [...prev, ...incoming]);
      setHasMore(data.hasMore ?? false);
      setPage(pageNum);
    } catch { /* silent */ }
    finally { setLoading(false); setInitialLoading(false); }
  }, [activeTag]);

  useEffect(() => {
    setPosts([]); setPage(1); setHasMore(true); setInitialLoading(true);
    fetchPosts(1, true);
  }, [activeTag]);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) fetchPosts(page + 1);
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, loading, page, fetchPosts]);

  const featured = posts.filter(p => p.featured).slice(0, 1)[0];
  const rest = posts.filter(p => !featured || p._id !== featured._id);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>

      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur-sm"
        style={{ background: 'rgba(28,28,28,0.92)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-lg text-white" style={{ background: 'var(--accent)' }}>P</div>
            <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--text)' }}>PDF<span style={{ color: 'var(--accent)' }}>.tools</span></span>
          </Link>
          <nav className="hidden md:flex items-center gap-1 text-sm">
            {[['Edit', '/#edit'], ['Convert', '/#convert'], ['Tech News', '/tech-news'], ['Blog', '/blog']].map(([label, href]) => (
              <Link key={href} href={href}
                className="px-4 py-2 rounded text-sm transition-all"
                style={{ color: label === 'Blog' ? 'var(--accent)' : 'var(--text-muted)' }}>
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">📝</span>
            <h1 className="font-bold text-3xl" style={{ color: 'var(--text)' }}>PDF Blog</h1>
          </div>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            Tips, tutorials and how-to guides for working with PDFs.
          </p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveTag(cat)}
                className="text-xs px-3 py-1.5 rounded-full font-medium transition-all"
                style={{
                  background: activeTag === cat ? 'var(--accent)' : 'var(--surface-2)',
                  color: activeTag === cat ? '#fff' : 'var(--text-muted)',
                  border: `1px solid ${activeTag === cat ? 'var(--accent)' : 'var(--border)'}`,
                }}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Featured post hero */}
        {!initialLoading && featured && (
          <Link href={`/blog/${featured.slug}`}
            className="group block rounded-2xl overflow-hidden mb-10 transition-all hover:scale-[1.005]"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="grid md:grid-cols-2">
              {featured.imageUrl && !featured.imageUrl.includes('placehold.co') && (
                <div className="relative h-64 md:h-80">
                  <Image src={featured.imageUrl} alt={featured.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full"
                    style={{ background: 'var(--accent)', color: '#fff' }}>FEATURED</span>
                </div>
              )}
              <div className="p-8 flex flex-col justify-center">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full inline-block mb-3 w-fit"
                  style={{ background: `${featured.tagColor}22`, color: featured.tagColor }}>
                  {featured.tag}
                </span>
                <h2 className="font-bold text-2xl leading-tight mb-3 group-hover:opacity-80 transition-opacity"
                  style={{ color: 'var(--text)' }}>{featured.title}</h2>
                <p className="text-sm leading-relaxed mb-4 line-clamp-3" style={{ color: 'var(--text-muted)' }}>
                  {featured.summary}
                </p>
                <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <span>{featured.author?.name}</span>
                  <span>·</span>
                  <span>{featured.readTime} min read</span>
                  <span>·</span>
                  <span>{timeAgo(featured.createdAt)}</span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Grid */}
        {initialLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden animate-pulse" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <div className="h-44" style={{ background: 'var(--surface-2)' }} />
                <div className="p-5 flex flex-col gap-2">
                  <div className="h-3 w-16 rounded" style={{ background: 'var(--surface-2)' }} />
                  <div className="h-4 w-full rounded" style={{ background: 'var(--surface-2)' }} />
                  <div className="h-4 w-3/4 rounded" style={{ background: 'var(--surface-2)' }} />
                </div>
              </div>
            ))}
          </div>
        ) : rest.length === 0 && !featured ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">📝</p>
            <p className="text-lg font-medium" style={{ color: 'var(--text)' }}>No posts yet</p>
            <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>Check back soon for PDF tips and tutorials</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map(post => (
              <Link key={post._id} href={`/blog/${post.slug}`}
                className="group block rounded-xl overflow-hidden transition-all hover:scale-[1.02]"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                {post.imageUrl && !post.imageUrl.includes('placehold.co') && (
                  <div className="relative h-44 overflow-hidden">
                    <Image src={post.imageUrl} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                )}
                <div className="p-5">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full inline-block mb-2"
                    style={{ background: `${post.tagColor}22`, color: post.tagColor }}>
                    {post.tag}
                  </span>
                  <h3 className="font-semibold text-sm leading-snug mb-2 group-hover:opacity-80 line-clamp-2"
                    style={{ color: 'var(--text)' }}>{post.title}</h3>
                  <p className="text-xs leading-relaxed line-clamp-2 mb-3" style={{ color: 'var(--text-muted)' }}>
                    {post.summary}
                  </p>
                  <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
                    <span>{post.readTime} min</span>
                    <span>·</span>
                    <span>{timeAgo(post.createdAt)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Infinite scroll loader */}
        <div ref={loaderRef} className="flex justify-center py-8">
          {loading && !initialLoading && (
            <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
          )}
          {!hasMore && !initialLoading && posts.length > 0 && (
            <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>— End of blog —</p>
          )}
        </div>
      </div>
    </div>
  );
}