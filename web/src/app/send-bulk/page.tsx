import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Send PDF for Bulk Signing Online — Mass E-Signature",
  description: "Send a PDF to multiple signatories at once. Bulk e-signature requests for PDF documents. Free, no account needed.",
  alternates: { canonical: 'https://pdf.tools/send-bulk' },
  openGraph: {
    title: "Send PDF for Bulk Signing Online — Mass E-Signature",
    description: "Send a PDF to multiple signatories at once. Bulk e-signature requests for PDF documents. Free, no account needed.",
    url: 'https://pdf.tools/send-bulk',
    type: 'website',
  },
};

import { ToolLayout } from '../../components/ToolLayout';

export default function Page() {
  return (
    <ToolLayout title="Send in bulk" tagline="Send a document to many people at once to sign individually" icon="📦" accentColor="#6B7FD7">
      <div style={{ padding: '64px 0', textAlign: 'center' }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16, margin: '0 auto 20px',
          background: 'var(--surface-2)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28,
        }}>📦</div>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>Send in bulk</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, maxWidth: 360, margin: '0 auto 24px' }}>Send a document to many people at once to sign individually</p>
        <div className="stamp">🚧 Coming soon</div>
      </div>
    </ToolLayout>
  );
}
