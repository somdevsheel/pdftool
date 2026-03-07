import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Export PDF Online — Download & Convert PDF Free",
  description: "Export and download PDF files in various formats. Free online PDF export tool, no account required.",
  alternates: { canonical: 'https://pdf.tools/export-pdf' },
  openGraph: {
    title: "Export PDF Online — Download & Convert PDF Free",
    description: "Export and download PDF files in various formats. Free online PDF export tool, no account required.",
    url: 'https://pdf.tools/export-pdf',
    type: 'website',
  },
};

import { ToolLayout } from '../../components/ToolLayout';

export default function Page() {
  return (
    <ToolLayout title="Export a PDF" tagline="Convert PDFs to Office files, images, and more" icon="📤" accentColor="#3FC87A">
      <div className="py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
          📤
        </div>
        <h2 className="font-semibold text-xl" style={{ color: 'var(--text)' }}>Export a PDF</h2>
        <p style={{ color: 'var(--text-muted)' }} className="max-w-sm mx-auto text-sm">Convert PDFs to Office files, images, and more</p>
        <div className="inline-block stamp mt-4">🚧 Coming soon</div>
      </div>
    </ToolLayout>
  );
}
