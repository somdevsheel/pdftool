// import type { NewsArticle } from '@/types';
// import Image from 'next/image';
// import Link from 'next/link';

// export function FeaturedCard({ article }: { article: NewsArticle }) {
//   return (
//     <Link href={article.sourceUrl || '#'} target="_blank" rel="noopener noreferrer"
//       className="group rounded-xl overflow-hidden cursor-pointer transition-all duration-200 block hover:scale-[1.01]"
//       style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
//       <div className="relative h-52 overflow-hidden">
//         <Image src={article.imageUrl} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
//         <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} />
//         <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full"
//           style={{ background: `${article.tagColor}dd`, color: '#fff' }}>
//           {article.tag}
//         </span>
//       </div>
//       <div className="p-5">
//         <h2 className="font-bold text-base leading-snug mb-2 group-hover:opacity-80 transition-opacity"
//           style={{ color: 'var(--text)' }}>
//           {article.title}
//         </h2>
//         <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: 'var(--text-muted)' }}>
//           {article.summary}
//         </p>
//         <div className="flex items-center justify-between">
//           <span className="text-xs font-mono" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
//             via {article.source}
//           </span>
//           <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
//             <span>{article.readTime} min read</span>
//             <span>·</span>
//             <span>{timeAgo(article.createdAt)}</span>
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// }

// export function NewsCard({ article }: { article: NewsArticle }) {
//   return (
//     <Link href={article.sourceUrl || '#'} target="_blank" rel="noopener noreferrer"
//       className="group flex gap-4 p-4 rounded-xl cursor-pointer transition-all duration-150 block hover:brightness-110"
//       style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
//       <div className="relative w-24 h-20 rounded-lg overflow-hidden flex-shrink-0">
//         <Image src={article.imageUrl} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
//       </div>
//       <div className="flex flex-col gap-1.5 flex-1 min-w-0">
//         <div className="flex items-center gap-2">
//           <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
//             style={{ background: `${article.tagColor}22`, color: article.tagColor }}>
//             {article.tag}
//           </span>
//           <span className="text-xs" style={{ color: 'var(--text-muted)', opacity: 0.5 }}>{timeAgo(article.createdAt)}</span>
//         </div>
//         <h3 className="text-sm font-semibold leading-snug line-clamp-2" style={{ color: 'var(--text)' }}>
//           {article.title}
//         </h3>
//         <div className="flex items-center gap-2 text-xs mt-auto" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
//           <span>{article.source}</span>
//           <span>·</span>
//           <span>{article.readTime} min</span>
//         </div>
//       </div>
//     </Link>
//   );
// }

// export function SkeletonCard({ featured = false }: { featured?: boolean }) {
//   return (
//     <div className="rounded-xl overflow-hidden animate-pulse" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
//       {featured && <div className="h-52" style={{ background: 'var(--surface-2)' }} />}
//       <div className={featured ? 'p-5' : 'p-4 flex gap-4'}>
//         {!featured && <div className="w-24 h-20 rounded-lg flex-shrink-0" style={{ background: 'var(--surface-2)' }} />}
//         <div className="flex-1 flex flex-col gap-2">
//           <div className="h-3 w-16 rounded" style={{ background: 'var(--surface-2)' }} />
//           <div className="h-4 w-full rounded" style={{ background: 'var(--surface-2)' }} />
//           <div className="h-4 w-3/4 rounded" style={{ background: 'var(--surface-2)' }} />
//           <div className="h-3 w-24 rounded mt-2" style={{ background: 'var(--surface-2)' }} />
//         </div>
//       </div>
//     </div>
//   );
// }

// function timeAgo(dateStr: string) {
//   const diff = Date.now() - new Date(dateStr).getTime();
//   const m = Math.floor(diff / 60000);
//   if (m < 60) return `${m}m ago`;
//   const h = Math.floor(m / 60);
//   if (h < 24) return `${h}h ago`;
//   return `${Math.floor(h / 24)}d ago`;
// }






import type { NewsArticle } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

export function FeaturedCard({ article }: { article: NewsArticle }) {
  return (
    <Link href={`/tech-news/${article.slug}`}
      className="group rounded-xl overflow-hidden cursor-pointer transition-all duration-200 block hover:scale-[1.01]"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
      <div className="relative h-52 overflow-hidden">
        <Image src={article.imageUrl} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} />
        <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ background: `${article.tagColor}dd`, color: '#fff' }}>
          {article.tag}
        </span>
      </div>
      <div className="p-5">
        <h2 className="font-bold text-base leading-snug mb-2 group-hover:opacity-80 transition-opacity"
          style={{ color: 'var(--text)' }}>
          {article.title}
        </h2>
        <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: 'var(--text-muted)' }}>
          {article.summary}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
            via {article.source}
          </span>
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
            <span>{article.readTime} min read</span>
            <span>·</span>
            <span>{timeAgo(article.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <Link href={`/tech-news/${article.slug}`}
      className="group flex gap-4 p-4 rounded-xl cursor-pointer transition-all duration-150 block hover:brightness-110"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
      <div className="relative w-24 h-20 rounded-lg overflow-hidden flex-shrink-0">
        <Image src={article.imageUrl} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: `${article.tagColor}22`, color: article.tagColor }}>
            {article.tag}
          </span>
          <span className="text-xs" style={{ color: 'var(--text-muted)', opacity: 0.5 }}>{timeAgo(article.createdAt)}</span>
        </div>
        <h3 className="text-sm font-semibold leading-snug line-clamp-2" style={{ color: 'var(--text)' }}>
          {article.title}
        </h3>
        <div className="flex items-center gap-2 text-xs mt-auto" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
          <span>{article.source}</span>
          <span>·</span>
          <span>{article.readTime} min</span>
        </div>
      </div>
    </Link>
  );
}

export function SkeletonCard({ featured = false }: { featured?: boolean }) {
  return (
    <div className="rounded-xl overflow-hidden animate-pulse" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
      {featured && <div className="h-52" style={{ background: 'var(--surface-2)' }} />}
      <div className={featured ? 'p-5' : 'p-4 flex gap-4'}>
        {!featured && <div className="w-24 h-20 rounded-lg flex-shrink-0" style={{ background: 'var(--surface-2)' }} />}
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-3 w-16 rounded" style={{ background: 'var(--surface-2)' }} />
          <div className="h-4 w-full rounded" style={{ background: 'var(--surface-2)' }} />
          <div className="h-4 w-3/4 rounded" style={{ background: 'var(--surface-2)' }} />
          <div className="h-3 w-24 rounded mt-2" style={{ background: 'var(--surface-2)' }} />
        </div>
      </div>
    </div>
  );
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}



