import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Add Signature to PDF Online Free | E-Sign PDF",
  description: "Add your electronic signature to any PDF online. Draw, type, or upload your signature. Free, no account needed.",
  alternates: { canonical: 'https://pdf.tools/add-signature' },
  openGraph: {
    title: "Add Signature to PDF Online Free | E-Sign PDF",
    description: "Add your electronic signature to any PDF online. Draw, type, or upload your signature. Free, no account needed.",
    url: 'https://pdf.tools/add-signature',
    type: 'website',
  },
};

import { ToolLayout } from '../../components/ToolLayout';

export default function Page() {
  return (
    <ToolLayout title="Add a signature" tagline="Sign a document yourself" icon="🖊️" accentColor="#5BB8F5">
      <div style={{ padding: '64px 0', textAlign: 'center' }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16, margin: '0 auto 20px',
          background: 'var(--surface-2)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28,
        }}>🖊️</div>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>Add a signature</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, maxWidth: 360, margin: '0 auto 24px' }}>Sign a document yourself</p>
        <div className="stamp">🚧 Coming soon</div>
      </div>
    </ToolLayout>
  );
}
