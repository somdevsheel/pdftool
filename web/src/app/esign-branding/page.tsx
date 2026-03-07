import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "E-Sign Branding — Custom Logo for PDF Agreements",
  description: "Add your brand logo and custom URL to e-signature requests. Professional e-sign branding for PDF documents.",
  alternates: { canonical: 'https://pdf.tools/esign-branding' },
  openGraph: {
    title: "E-Sign Branding — Custom Logo for PDF Agreements",
    description: "Add your brand logo and custom URL to e-signature requests. Professional e-sign branding for PDF documents.",
    url: 'https://pdf.tools/esign-branding',
    type: 'website',
  },
};

import { ToolLayout } from '../../components/ToolLayout';

export default function Page() {
  return (
    <ToolLayout title="Add e-sign branding" tagline="Add your company name, logo and URL to e-sign agreements" icon="🎨" accentColor="#3FC87A">
      <div style={{ padding: '64px 0', textAlign: 'center' }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16, margin: '0 auto 20px',
          background: 'var(--surface-2)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28,
        }}>🎨</div>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>Add e-sign branding</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, maxWidth: 360, margin: '0 auto 24px' }}>Add your company name, logo and URL to e-sign agreements</p>
        <div className="stamp">🚧 Coming soon</div>
      </div>
    </ToolLayout>
  );
}
