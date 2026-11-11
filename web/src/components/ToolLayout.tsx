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
      {/* <footer style={{ borderTop: '1px solid var(--border)' }}> */}
      <footer style={{ borderTop: '1px solid var(--border)', marginTop: '24px' }}>
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
        </div>
      </footer>
    </div>
  );
}