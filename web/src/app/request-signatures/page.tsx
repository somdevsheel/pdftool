import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Request E-Signatures Online — Send PDF for Signing",
  description: "Send PDF documents to others for electronic signature online. Free e-signature request tool, no account needed.",
  alternates: { canonical: 'https://pdf.tools/request-signatures' },
  openGraph: {
    title: "Request E-Signatures Online — Send PDF for Signing",
    description: "Send PDF documents to others for electronic signature online. Free e-signature request tool, no account needed.",
    url: 'https://pdf.tools/request-signatures',
    type: 'website',
  },
};

import { ToolLayout } from '../../components/ToolLayout';

export default function Page() {
  return (
    <ToolLayout title="Request e-signatures" tagline="Send a document to anyone to e-sign online fast" icon="📨" accentColor="#6B7FD7">
      <div style={{ padding: '64px 0', textAlign: 'center' }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16, margin: '0 auto 20px',
          background: 'var(--surface-2)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28,
        }}>📨</div>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>Request e-signatures</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, maxWidth: 360, margin: '0 auto 24px' }}>Send a document to anyone to e-sign online fast</p>
        <div className="stamp">🚧 Coming soon</div>
      </div>
    </ToolLayout>
  );
}
