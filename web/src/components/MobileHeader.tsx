'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// const NAV_LINKS = [
//   ['Edit',      '#edit'],
//   ['Convert',   '#convert'],
//   ['E-Sign',    '#esign'],
//   ['Tech News', '/tech-news'],
// ];

// const NAV_LINKS = [
//   ['Merge',      '/merge-pdf'],
//   ['Split',      '/split-pdf'],
//   ['Compress',   '/compress-pdf'],
//   ['Rotate',     '/rotate-pdf'],
//   ['JPG→PDF',    '/jpg-to-pdf'],
//   ['Edit',       '/edit-pdf'],
//   ['Tech News',  '/tech-news'],
//   ['All tools →', '/'],
// ];


const HOME_NAV = [
  ['Edit',      '#edit'],
  ['Convert',   '#convert'],
  ['E-Sign',    '#esign'],
  ['Tech News', '/tech-news'],
];

const TOOL_NAV = [
  ['Merge',       '/merge-pdf'],
  ['Split',       '/split-pdf'],
  ['Compress',    '/compress-pdf'],
  ['Rotate',      '/rotate-pdf'],
  ['JPG→PDF',     '/jpg-to-pdf'],
  ['Edit',        '/edit-pdf'],
  ['Tech News',   '/tech-news'],
  ['All tools →', '/'],
];

export default function MobileHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';
  const NAV_LINKS = isHome ? HOME_NAV : TOOL_NAV;

  return (
    // <header
    //   className="sticky top-0 z-20 backdrop-blur-sm"
    //   style={{ background: 'rgba(28,28,28,0.92)', borderBottom: '1px solid var(--border)' }}
    // >

    <header
      className="sticky top-0 z-20 backdrop-blur-sm"
      style={{ background: 'rgba(28,28,28,0.92)', borderBottom: '1px solid var(--border)', position: 'relative' }}
    >
      {/* <div className="max-w-7xl mx-auto px-6 py-0 flex items-center justify-between"> */}
      {/* <div className="max-w-5xl mx-auto px-6 py-1 flex items-center justify-between">   */}
      <div className="max-w-7xl mx-auto px-6 py-1 flex items-center justify-between">


        {/* Logo */}
        <Link href="/" className="flex items-center gap-3" style={{ textDecoration: 'none' }}>
          <img src="/logo.png" alt="Freenoo" style={{ height: '66px', width: 'auto' }} />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 text-sm">
          {NAV_LINKS.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="nav-link px-4 py-2 rounded text-sm transition-all duration-150"
              style={(label === 'Tech News' || label === 'Blog') ? { color: 'var(--accent)' } : {}}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Right side: stamp (desktop) + hamburger (mobile) */}
        <div className="flex items-center gap-3">
          {/* <div className="stamp hidden sm:flex">
            Free · No account · Files auto-deleted
          </div> */}

          {/* Hamburger — only on mobile */}
          <button
            className="md:hidden flex flex-col justify-center items-center gap-1.5 p-2 rounded-lg transition-all"
            style={{ background: open ? 'var(--surface-2)' : 'transparent', border: '1px solid transparent', cursor: 'pointer' }}
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span
              style={{
                display: 'block', width: 22, height: 2,
                background: 'var(--text)',
                borderRadius: 2,
                transition: 'transform 0.2s, opacity 0.2s',
                transform: open ? 'translateY(5px) rotate(45deg)' : 'none',
              }}
            />
            <span
              style={{
                display: 'block', width: 22, height: 2,
                background: 'var(--text)',
                borderRadius: 2,
                transition: 'opacity 0.2s',
                opacity: open ? 0 : 1,
              }}
            />
            <span
              style={{
                display: 'block', width: 22, height: 2,
                background: 'var(--text)',
                borderRadius: 2,
                transition: 'transform 0.2s, opacity 0.2s',
                transform: open ? 'translateY(-5px) rotate(-45deg)' : 'none',
              }}
            />
          </button>
        </div>
      </div>

      {/* Mobile dropdown
      <div
        className="md:hidden overflow-hidden transition-all duration-200"
        style={{
          maxHeight: open ? 600 : 0,
          borderTop: open ? '1px solid var(--border)' : 'none',
        }}
      >
        <nav
          className="flex flex-col px-4 py-3 gap-1"
          style={{ background: 'rgba(28,28,28,0.98)' }}
        > */}

        {/* Mobile dropdown */}
      <div
        className="md:hidden overflow-hidden transition-all duration-200"
        style={{
          maxHeight: open ? 600 : 0,
          position: 'absolute',
          top: '100%',
          right: '16px',
          width: '200px',
          zIndex: 50,
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          border: open ? '1px solid var(--border)' : 'none',
        }}
      >
        <nav
          className="flex flex-col px-2 py-2 gap-0.5"
          style={{ background: 'rgba(20,20,20,0.85)', backdropFilter: 'blur(12px)' }}
        >
          {NAV_LINKS.map(([label, href]) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-xl text-sm font-medium transition-all"
              style={{
                color: (label === 'Tech News' || label === 'Blog') ? 'var(--accent)' : 'var(--text)',
                background: 'transparent',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <span style={{ fontSize: 16 }}>
                {/* {label === 'Edit' ? '✏️' : label === 'Convert' ? '🔄' : label === 'E-Sign' ? '🖊️' : label === 'Tech News' ? '⚡' : '📝'} */}
                {/* {label === 'Merge' ? '📄' : label === 'Split' ? '✂️' : label === 'Compress' ? '🗜️' : label === 'Rotate' ? '🔄' : label === 'JPG→PDF' ? '🖼️' : label === 'Edit' ? '✏️' : label === 'Tech News' ? '⚡' : '🏠'} */}
              </span>
              {label}
            </a>
          ))}

          <div
            className="mx-4 mt-2 mb-1 text-xs font-mono text-center py-2 rounded-lg"
            style={{ color: 'var(--text-muted)', background: 'var(--surface-2)' }}
          >
            Free · No account · Files auto-deleted
          </div>
        </nav>
      </div>
    </header>
  );
}