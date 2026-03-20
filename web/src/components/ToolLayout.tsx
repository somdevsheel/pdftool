// import { ReactNode } from 'react';
// import ToolContentSection from './ToolContentSection';
// import { TopAd } from './ads/TopAd';
// import { SidebarAd } from './ads/SidebarAd';
// import { BottomAd } from './ads/BottomAd';
// import Link from 'next/link';

// interface ToolLayoutProps {
//   title: string;
//   tagline: string;
//   icon: string;
//   accentColor?: string;
//   toolTag?: string;
//   toolTitle?: string;
//   children: ReactNode;
// }

// export function ToolLayout({
//   title,
//   tagline,
//   icon,
//   accentColor = 'var(--accent-red)',
//   toolTag,
//   toolTitle,
//   children,
// }: ToolLayoutProps) {
//   return (
//     <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
//       {/* Top Ad */}
//       <TopAd />

//       {/* Header */}
//       <header className="sticky top-0 z-10 backdrop-blur-sm"
//         style={{ background: 'rgba(28,28,28,0.92)', borderBottom: '1px solid var(--border)' }}>
//         <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
//           <Link href="/" className="flex items-center gap-3 group">
//             <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white"
//               style={{ background: 'var(--accent)' }}>
//               P
//             </div>
//             <span className="font-bold text-base hidden sm:block" style={{ color: 'var(--text)' }}>
//               <Image src="/logo.png" alt="Freenoo" width={100} height={30} style={{ height: '30px', width: 'auto' }} />
//             </span>
//           </Link>

//           {/* Nav */}
//           <nav className="hidden md:flex items-center gap-1 text-sm">
//             {[
//               ['Merge', '/merge-pdf'],
//               ['Split', '/split-pdf'],
//               ['Compress', '/compress-pdf'],
//               ['Rotate', '/rotate-pdf'],
//               ['JPG→PDF', '/jpg-to-pdf'],
//               ['Edit', '/edit-pdf'],
//               ['Tech News', '/tech-news'],
//                             ['All tools →', '/'],
//             ].map(([name, href]) => (
//               <Link key={href} href={href} className="nav-link px-3 py-1.5 rounded text-sm transition-all duration-150">
//                 {name}
//               </Link>
//             ))}
//           </nav>
//         </div>
//       </header>

//       {/* Tool header */}
//       <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
//         <div className="max-w-6xl mx-auto px-6 py-8 flex items-start gap-5">
//           <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
//             style={{ background: 'var(--surface-2)', border: '1px solid var(--border-light)' }}>
//             {icon}
//           </div>
//           <div>
//             <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>{title}</h1>
//             <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{tagline}</p>
//           </div>
//         </div>
//       </div>

//       {/* Main content */}
//       <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
//         <div className="flex gap-8">
//           <main className="flex-1 min-w-0 page-enter">
//             {children}
//             {toolTag && <ToolContentSection tag={toolTag} toolTitle={toolTitle || title} />}
//           </main>
//           <aside className="hidden xl:block w-60 flex-shrink-0">
//             <SidebarAd />
//           </aside>
//         </div>
//       </div>

//       {/* Bottom Ad */}
//       <BottomAd />

//       {/* Footer */}
//       <footer style={{ borderTop: '1px solid var(--border)' }}>
//         <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
//           <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
//             Freenoo — Free online PDF utilities
//           </p>
//           <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
//             Files auto-deleted after 60 minutes · No account required
//           </p>
//         </div>
//       </footer>
//     </div>
//   );
// }




// import { ReactNode } from 'react';
// import ToolContentSection from './ToolContentSection';
// import FeaturedNewsSection from './FeaturedNewsSection';
// import { TopAd } from './ads/TopAd';
// import { SidebarAd } from './ads/SidebarAd';
// import { BottomAd } from './ads/BottomAd';
// import Link from 'next/link';

// interface ToolLayoutProps {
//   title: string;
//   tagline: string;
//   icon: string;
//   accentColor?: string;
//   toolTag?: string;
//   toolTitle?: string;
//   children: ReactNode;
// }

// export function ToolLayout({
//   title,
//   tagline,
//   icon,
//   accentColor = 'var(--accent-red)',
//   toolTag,
//   toolTitle,
//   children,
// }: ToolLayoutProps) {
//   return (
//     <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
//       {/* Top Ad */}
//       <TopAd />

//       {/* Header */}
//       <header className="sticky top-0 z-10 backdrop-blur-sm"
//         style={{ background: 'rgba(28,28,28,0.92)', borderBottom: '1px solid var(--border)' }}>
//         <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
//           <Link href="/" className="flex items-center gap-3 group">
//             <span className="font-bold text-base hidden sm:block" style={{ color: 'var(--text)' }}>
//               <img src="/logo.png" alt="Freenoo" style={{ height: '86px', width: 'auto' }} />
//             </span>
//           </Link>

//           {/* Nav */}
//           <nav className="hidden md:flex items-center gap-1 text-sm">
//             {[
//               ['Merge', '/merge-pdf'],
//               ['Split', '/split-pdf'],
//               ['Compress', '/compress-pdf'],
//               ['Rotate', '/rotate-pdf'],
//               ['JPG→PDF', '/jpg-to-pdf'],
//               ['Edit', '/edit-pdf'],
//               ['Tech News', '/tech-news'],
//                             ['All tools →', '/'],
//             ].map(([name, href]) => (
//               <Link key={href} href={href} className="nav-link px-3 py-1.5 rounded text-sm transition-all duration-150">
//                 {name}
//               </Link>
//             ))}
//           </nav>
//         </div>
//       </header>

//       {/* Tool header */}
//       <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
//         <div className="max-w-6xl mx-auto px-6 py-8 flex items-start gap-5">
//           <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
//             style={{ background: 'var(--surface-2)', border: '1px solid var(--border-light)' }}>
//             {icon}
//           </div>
//           <div>
//             <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>{title}</h1>
//             <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{tagline}</p>
//           </div>
//         </div>
//       </div>

//       {/* Main content */}
//       <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
//         <div className="flex gap-8">
//           <main className="flex-1 min-w-0 page-enter">
//             {children}
//             {toolTag && <ToolContentSection tag={toolTag} toolTitle={toolTitle || title} />}
//             <FeaturedNewsSection />
//           </main>
//           <aside className="hidden xl:block w-60 flex-shrink-0">
//             <SidebarAd />
//           </aside>
//         </div>
//       </div>

//       {/* Bottom Ad */}
//       <BottomAd />

//       {/* Footer */}
//       <footer style={{ borderTop: '1px solid var(--border)' }}>
//         <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
//           <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
//             Freenoo — Free online PDF utilities
//           </p>
//           <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
//             Files auto-deleted after 60 minutes · No account required
//           </p>
//         </div>
//       </footer>
//     </div>
//   );
// }



import { ReactNode } from 'react';
import ToolContentSection from './ToolContentSection';
import FeaturedNewsSection from './FeaturedNewsSection';
import { TopAd } from './ads/TopAd';
import { SidebarAd } from './ads/SidebarAd';
import { BottomAd } from './ads/BottomAd';
import MobileHeader from '@/components/MobileHeader';
import Link from 'next/link';


interface ToolLayoutProps {
  title: string;
  tagline: string;
  icon: string;
  accentColor?: string;
  toolTag?: string;
  toolTitle?: string;
  children: ReactNode;
}

export function ToolLayout({
  title,
  tagline,
  icon,
  accentColor = 'var(--accent-red)',
  toolTag,
  toolTitle,
  children,
}: ToolLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      {/* Top Ad */}
      <TopAd />

      {/* Header */}
      <MobileHeader />

      {/* Tool header */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-start gap-5">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border-light)' }}>
            {icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>{title}</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{tagline}</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        <div className="flex gap-8">
          <main className="flex-1 min-w-0 page-enter">
            {children}
            {toolTag && <ToolContentSection tag={toolTag} toolTitle={toolTitle || title} />}
            <FeaturedNewsSection />
          </main>
          <aside className="hidden xl:block w-60 flex-shrink-0">
            <SidebarAd />
          </aside>
        </div>
      </div>

      {/* Bottom Ad */}
      <BottomAd />

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
            Freenoo — Free online PDF utilities
          </p>
          {/* <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Files auto-deleted after 60 minutes · No account required
          </p> */}
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Files auto-deleted after 60 minutes · No account required
          </p>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/privacy" style={{ color: 'var(--text-muted)' }}>Privacy Policy</Link>
            <Link href="/terms" style={{ color: 'var(--text-muted)' }}>Terms & Conditions</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}