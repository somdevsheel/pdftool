import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Convert Files to PDF Online Free",
  description: "Convert Word, PowerPoint, Excel, and image files to PDF online. Free file to PDF converter, no signup required.",
  alternates: { canonical: 'https://freenoo.com/convert-to-pdf' },
  openGraph: {
    title: "Convert Files to PDF Online Free",
    description: "Convert Word, PowerPoint, Excel, and image files to PDF online. Free file to PDF converter, no signup required.",
    url: 'https://freenoo.com/convert-to-pdf',
    type: 'website',
  },
};

import { ToolLayout } from '../../components/ToolLayout';

export default function Page() {
  return (
    <ToolLayout title="Convert to PDF" tagline="Turn almost any file into a PDF" icon="🔄" accentColor="#E8526A">
      <div className="py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
          🔄
        </div>
        <h2 className="font-semibold text-xl" style={{ color: 'var(--text)' }}>Convert to PDF</h2>
        <p style={{ color: 'var(--text-muted)' }} className="max-w-sm mx-auto text-sm">Turn almost any file into a PDF</p>
        <div className="inline-block stamp mt-4">🚧 Coming soon</div>
      </div>
    </ToolLayout>
  );
}
