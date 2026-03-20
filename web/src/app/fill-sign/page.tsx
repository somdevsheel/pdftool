import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Fill and Sign PDF Online Free | Complete PDF Forms",
  description: "Fill in PDF forms and add your signature online. Free fill & sign PDF tool. No account or software needed.",
  alternates: { canonical: 'https://freenoo.com/fill-sign' },
  openGraph: {
    title: "Fill and Sign PDF Online Free | Complete PDF Forms",
    description: "Fill in PDF forms and add your signature online. Free fill & sign PDF tool. No account or software needed.",
    url: 'https://freenoo.com/fill-sign',
    type: 'website',
  },
};

import { ToolLayout } from '../../components/ToolLayout';

export default function Page() {
  return (
    <ToolLayout title="Fill & Sign" tagline="Complete a form and add your signature" icon="✍️" accentColor="#C17EE8">
      <div style={{ padding: '64px 0', textAlign: 'center' }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16, margin: '0 auto 20px',
          background: 'var(--surface-2)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28,
        }}>✍️</div>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>Fill & Sign</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, maxWidth: 360, margin: '0 auto 24px' }}>Complete a form and add your signature</p>
        <div className="stamp">🚧 Coming soon</div>
      </div>
    </ToolLayout>
  );
}
