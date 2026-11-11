import type { Metadata } from 'next';
import { ToolLayout } from '../../components/ToolLayout';
import { SeoContent } from '../../components/seo/SeoContent';
import { JsonLd } from '../../components/seo/JsonLd';

const TITLE       = 'Create PDF Web Form — Embeddable Signature Form';
const DESCRIPTION = 'Create embeddable web forms from PDF documents. Collect signatures and data online. Free PDF web form builder.';
const CANONICAL   = 'https://www.freenoo.com/web-form';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
};

const faqs = [
  { q: 'Are PDF web forms free?', a: 'Yes, completely free with unlimited form submissions.' },
  { q: 'Does it work with WordPress?', a: 'Yes, embed code works with WordPress, Wix, Squarespace, and any HTML website.' },
  { q: 'Can I collect signatures through web forms?', a: 'Yes, forms support electronic signature fields for legally binding approvals.' },
  { q: 'Is form data secure?', a: 'All submissions are encrypted; data can be exported or auto-deleted based on settings.' },
  { q: 'Can I customize form styling?', a: 'Yes, customize colors, fonts, and button styles to match your website.' },
  { q: 'Do I get submission notifications?', a: 'Yes, receive email notifications for each form submission.' },
];

const relatedTools = [
  { href: '/fill-sign',          label: 'Fill & Sign',          desc: 'Test your forms' },
  { href: '/request-signatures', label: 'Request Signature',    desc: 'Alternative collection method' },
  { href: '/esign-template',     label: 'Signature Templates',  desc: 'Start with pre-made forms' },
];

const body = [
  'Create embeddable PDF web forms that collect signatures and data directly on your website. No complex integrations—just copy and paste embed code.',
  <>
    <strong>Why use Freenoo Web Forms?</strong>
    <ul style={{ marginTop: 8, paddingLeft: 18, lineHeight: 2 }}>
      <li>Generate embed code for any PDF form</li>
      <li>Collect signatures and form data securely</li>
      <li>Real-time submission notifications</li>
      <li>100% free with unlimited form submissions</li>
      <li>Works on any website or CMS</li>
    </ul>
  </>,
  <>
    <strong>How to create web forms (3 steps):</strong>
    <ol style={{ marginTop: 8, paddingLeft: 18, lineHeight: 2 }}>
      <li>Upload your PDF form or choose a template</li>
      <li>Configure form fields and submission settings</li>
      <li>Copy embed code and paste into your website</li>
    </ol>
  </>,
  'Perfect for: contact forms, registration forms, waivers, applications, consent forms.',
];

export default function WebFormPage() {
  return (
    <>
      <JsonLd toolName="Create PDF Web Form" toolDescription={DESCRIPTION} toolUrl="/web-form" faqs={faqs} />
      <ToolLayout title="Create a web form" tagline="Add forms to your website and collect data online" icon="🌐" accentColor="#E8526A">
        <div style={{ padding: '48px 0', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, margin: '0 auto 20px', background: 'var(--surface-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🌐</div>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>Create a web form</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, maxWidth: 400, margin: '0 auto 24px', lineHeight: 1.6 }}>Turn your PDF into an embeddable online form and collect signatures and data at scale. Coming soon.</p>
          <div className="stamp">🚧 Coming soon</div>
        </div>
      </ToolLayout>
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <SeoContent heading="How PDF Web Forms Work" body={body} faqs={faqs} relatedTools={relatedTools} />
      </div>
    </>
  );
}