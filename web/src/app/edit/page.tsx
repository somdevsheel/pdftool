// import type { Metadata } from 'next';
// import EditPage from './ToolPage';

// export const metadata: Metadata = {
//   robots: { index: false, follow: true },
//   alternates: { canonical: 'https://www.freenoo.com/edit-pdf' },
// };

// export default function Page() {
//   return <EditPage />;
// }




import type { Metadata } from 'next';
import Link from 'next/link';

// Honest, keyword-bearing title. Layout template appends " | Freenoo".
const TITLE       = 'Edit PDF Online — Coming Soon';
const DESCRIPTION =
  'Our free online PDF editor is coming soon — add text, draw annotations, and mark up PDF pages right in your browser. Meanwhile, explore our other free PDF tools.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/edit-pdf' },
  openGraph: {
    title: `${TITLE} | Freenoo`,
    description: DESCRIPTION,
    url: 'https://www.freenoo.com/edit-pdf',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${TITLE} | Freenoo`,
    description: DESCRIPTION,
  },
  // To hide the page from search until the editor ships, uncomment:
  // robots: { index: false, follow: true },
};

const availableTools = [
  { href: '/merge-pdf',    label: 'Merge PDF',    desc: 'Combine multiple PDFs into one', color: '#6B7FD7' },
  { href: '/compress-pdf', label: 'Compress PDF', desc: 'Reduce file size without losing quality', color: '#F5A623' },
  { href: '/rotate-pdf',   label: 'Rotate PDF',   desc: 'Fix page orientation in seconds', color: '#F5A623' },
  { href: '/protect-pdf',  label: 'Protect PDF',  desc: 'Lock your PDF with a password', color: '#5BB8F5' },
];

export default function EditPdfComingSoonPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      {/* Header */}
      <header style={{ background: 'rgba(28,28,28,0.92)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/"><img src="/logo.png" alt="Freenoo" style={{ height: '40px', width: 'auto' }} /></Link>
          <Link href="/" className="text-sm" style={{ color: 'var(--text-muted)' }}>← Back to Home</Link>
        </div>
      </header>

      {/* Coming soon hero */}
      <main className="flex-1 w-full">
        <section className="max-w-2xl mx-auto px-6 pt-20 pb-14 text-center">
          {/* Icon with soft glow */}
          <div className="relative inline-flex items-center justify-center mb-7">
            <span
              aria-hidden
              className="absolute inset-0 rounded-2xl animate-pulse"
              style={{ background: 'rgba(245,166,35,0.18)', filter: 'blur(22px)' }}
            />
            <div
              className="relative flex items-center justify-center rounded-2xl"
              style={{ width: 88, height: 88, background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <svg viewBox="0 0 40 40" fill="none" width="52" height="52">
                <path d="M10 8h14l6 6v18a2 2 0 01-2 2H12a2 2 0 01-2-2V10a2 2 0 012-2z" stroke="#F5A623" strokeWidth="1.8" fill="rgba(245,166,35,0.1)" />
                <path d="M24 8v6h6" stroke="#F5A623" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M24 26l-8 2 2-8 6 6z" stroke="#F5A623" strokeWidth="1.5" fill="rgba(245,166,35,0.2)" strokeLinejoin="round" />
                <path d="M22 20l4 4" stroke="#F5A623" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          <div className="stamp mb-5" style={{ margin: '0 auto' }}>
            <svg width="7" height="7" viewBox="0 0 7 7" fill="currentColor"><circle cx="3.5" cy="3.5" r="3.5" /></svg>
            Under construction
          </div>

          <h1 className="font-bold mb-3 leading-tight" style={{ color: 'var(--text)', fontSize: 'clamp(1.9rem, 4vw, 3rem)' }}>
            PDF Editor<br /><span style={{ color: 'var(--accent)' }}>Coming Soon</span>
          </h1>

          <p className="text-base mb-2 mx-auto" style={{ color: 'var(--text-muted)', maxWidth: '34rem', lineHeight: 1.7 }}>
            We&apos;re building a fast, free PDF editor — add text, draw annotations, and mark up any page right in your
            browser. No account, no watermarks, no limits.
          </p>
          <p className="text-sm mb-10" style={{ color: 'var(--text-muted)', opacity: 0.75 }}>
            It&apos;s almost ready. Check back soon.
          </p>
        </section>

        {/* Available in the meantime */}
        <section className="max-w-4xl mx-auto w-full px-6 pb-20">
          <div className="flex items-center gap-4 mb-5">
            <h2 className="text-base font-semibold whitespace-nowrap" style={{ color: 'var(--text)' }}>
              In the meantime, try these
            </h2>
            <div className="flex-1" style={{ height: '1px', background: 'var(--border)' }} />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {availableTools.map((t) => (
              <Link key={t.href} href={t.href} className="tool-card group flex flex-col gap-2 p-5 rounded-lg transition-all duration-150">
                <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{t.label}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{t.desc}</p>
                <span className="text-xs mt-auto pt-2" style={{ color: t.color }}>Open tool →</span>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/" className="btn-ghost inline-flex items-center gap-2 px-5 py-2.5 rounded text-sm font-medium">
              Browse all tools ↓
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}