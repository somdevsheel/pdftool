import type { Metadata } from 'next';
import { ToolLayout } from '../../components/ToolLayout';
import { SeoContent } from '../../components/seo/SeoContent';
import { JsonLd } from '../../components/seo/JsonLd';

const TITLE       = 'Sign PDF Online Free — Add Electronic Signature';
const DESCRIPTION = 'Add an electronic signature to a PDF online. Fill & sign forms. Free e-signature tool, no account required.';
const CANONICAL   = 'https://www.freenoo.com/sign-pdf';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
};

const faqs = [
  { q: 'Is Fill & Sign PDF free?', a: 'Yes, completely free with unlimited forms and no watermarks.' },
  { q: 'Are Freenoo signatures legally binding?', a: 'Yes, includes timestamp and meets e-signature standards in most countries.' },
  { q: 'Can I save my signature for reuse?', a: 'Yes, create and save signatures in our Add Signature tool.' },
  { q: 'Is my form data secure?', a: 'Files are encrypted and auto-deleted after 1 hour—complete privacy.' },
  { q: 'Does it work on mobile?', a: 'Yes, touch-friendly interface works on phone and tablet browsers.' },
  { q: 'Can I fill forms without printing?', a: 'Yes, entirely digital—no printing or scanning needed.' },
];

const relatedTools = [
  { href: '/add-signature',        label: 'Add Signature',        desc: 'Create reusable signatures' },
  { href: '/request-signatures',    label: 'Request Signature',    desc: 'Get others to sign' },
  { href: '/esign-template',  label: 'Signature Templates',  desc: 'Use pre-made forms' },
];

const body = [
  'Complete any PDF form and add your signature in seconds with Freenoo. No printing, scanning, or software installation required.',
  <>
    <strong>Why use Freenoo Fill &amp; Sign?</strong>
    <ul style={{ marginTop: 8, paddingLeft: 18, lineHeight: 2 }}>
      <li>Fill text fields, checkboxes, and form elements</li>
      <li>Add signatures, initials, dates, and text anywhere</li>
      <li>Legally binding e-signatures with timestamp</li>
      <li>100% free with no watermarks or limits</li>
      <li>Works on desktop, tablet, and mobile</li>
    </ul>
  </>,
  <>
    <strong>How to fill &amp; sign PDF (3 steps):</strong>
    <ol style={{ marginTop: 8, paddingLeft: 18, lineHeight: 2 }}>
      <li>Upload your PDF form or document</li>
      <li>Click to add text, signatures, checkmarks, dates</li>
      <li>Download completed, signed PDF</li>
    </ol>
  </>,
  'Perfect for: contracts, applications, tax forms, agreements, waivers.',
];

export default function SignPdfPage() {
  return (
    <>
      <JsonLd toolName="Sign PDF Online Free" toolDescription={DESCRIPTION} toolUrl="/sign-pdf" faqs={faqs} />
      <ToolLayout title="Sign a PDF" tagline="Add electronic signatures and fill in PDF forms online." icon="✍️" accentColor="#C17EE8">
        <div style={{ padding: '48px 0', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, margin: '0 auto 20px', background: 'var(--surface-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>✍️</div>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>Sign a PDF</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, maxWidth: 400, margin: '0 auto 24px' }}>The full e-signature and fill & sign workflow is coming soon.</p>
          <div className="stamp">🚧 Coming soon</div>
        </div>
      </ToolLayout>
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <SeoContent heading="How to Fill & Sign a PDF Online" body={body} faqs={faqs} relatedTools={relatedTools} />
      </div>
    </>
  );
}
