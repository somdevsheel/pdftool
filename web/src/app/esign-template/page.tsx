import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Create E-Sign Template — Reusable PDF Signature Form",
  description: "Create reusable e-signature templates for PDF documents. Save time on recurring signature workflows. Free.",
  alternates: { canonical: 'https://pdf.tools/esign-template' },
  openGraph: {
    title: "Create E-Sign Template — Reusable PDF Signature Form",
    description: "Create reusable e-signature templates for PDF documents. Save time on recurring signature workflows. Free.",
    url: 'https://pdf.tools/esign-template',
    type: 'website',
  },
};

import { ToolLayout } from '../../components/ToolLayout';

export default function Page() {
  return (
    <ToolLayout title="Create e-sign template" tagline="Create a reusable document to send for e-signature faster" icon="📑" accentColor="#C17EE8">
      <div style={{ padding: '64px 0', textAlign: 'center' }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16, margin: '0 auto 20px',
          background: 'var(--surface-2)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28,
        }}>📑</div>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>Create e-sign template</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, maxWidth: 360, margin: '0 auto 24px' }}>Create a reusable document to send for e-signature faster</p>
        <div className="stamp">🚧 Coming soon</div>
      </div>
    </ToolLayout>
  );
}
