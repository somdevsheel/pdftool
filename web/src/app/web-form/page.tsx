import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Create PDF Web Form — Embeddable Signature Form",
  description: "Create embeddable web forms from PDF documents. Collect signatures and data online. Free PDF web form builder.",
  alternates: { canonical: 'https://pdf.tools/web-form' },
  openGraph: {
    title: "Create PDF Web Form — Embeddable Signature Form",
    description: "Create embeddable web forms from PDF documents. Collect signatures and data online. Free PDF web form builder.",
    url: 'https://pdf.tools/web-form',
    type: 'website',
  },
};

import { ToolLayout } from '../../components/ToolLayout';

export default function Page() {
  return (
    <ToolLayout title="Create a web form" tagline="Add forms to your website and collect data online" icon="🌐" accentColor="#E8526A">
      <div style={{ padding: '64px 0', textAlign: 'center' }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16, margin: '0 auto 20px',
          background: 'var(--surface-2)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28,
        }}>🌐</div>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>Create a web form</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, maxWidth: 360, margin: '0 auto 24px' }}>Add forms to your website and collect data online</p>
        <div className="stamp">🚧 Coming soon</div>
      </div>
    </ToolLayout>
  );
}
