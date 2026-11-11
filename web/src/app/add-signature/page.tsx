import type { Metadata } from 'next';
import { ToolLayout } from '../../components/ToolLayout';
import { SeoContent } from '../../components/seo/SeoContent';
import { JsonLd } from '../../components/seo/JsonLd';

const TITLE       = 'Add Signature to PDF Online Free | E-Sign PDF';
const DESCRIPTION = 'Add your electronic signature to any PDF online. Draw, type, or upload your signature. Free, no account needed.';
const CANONICAL   = 'https://www.freenoo.com/add-signature';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
};

const faqs = [
  { q: 'How do I create a digital signature with Freenoo?', a: 'Use Draw (mouse/touch), Type (handwriting fonts), or Upload image—save instantly for reuse.' },
  { q: 'Can I save multiple signature styles?', a: 'Yes, create formal, casual, and initial versions—switch between them instantly.' },
  { q: 'Are Freenoo signatures legally valid?', a: 'Yes for most documents; includes timestamp. For highest legal assurance, use Request Signature workflow.' },
  { q: 'Does creating signatures require signup?', a: 'No, 100% free, browser-based—your signatures stay local until you use them.' },
  { q: 'Is my signature data secure?', a: 'Signatures are stored locally in your browser—we never upload or store them on servers.' },
  { q: 'Can I use my signature on mobile?', a: 'Yes, touch-friendly signature drawing works perfectly on phones and tablets.' },
];

const relatedTools = [
  { href: '/fill-sign',        label: 'Fill & Sign',        desc: 'Use saved signatures on PDFs' },
  { href: '/request-signatures', label: 'Request Signature', desc: 'Add your signature before sending' },
  { href: '/edit-pdf',         label: 'Edit PDF',           desc: 'Place signatures with annotations' },
];

const body = [
  'Create professional digital signatures you can reuse across all your PDF documents. Draw, type, or upload your personal signature and save it for instant use.',
  <>
    <strong>Why create signatures with Freenoo?</strong>
    <ul style={{ marginTop: 8, paddingLeft: 18, lineHeight: 2 }}>
      <li>Draw with mouse/touchpad, Type in handwriting fonts, or Upload scanned signature</li>
      <li>Save unlimited signatures in your browser for instant reuse</li>
      <li>100% free signature maker—no signup, no watermarks</li>
      <li>Use saved signatures in Fill &amp; Sign and Request Signature tools</li>
    </ul>
  </>,
  <>
    <strong>How to create &amp; save signature (2 steps):</strong>
    <ol style={{ marginTop: 8, paddingLeft: 18, lineHeight: 2 }}>
      <li>Choose Draw, Type, or Upload—create your signature style</li>
      <li>Click &quot;Save Signature&quot;—instantly available in all signing tools</li>
    </ol>
  </>,
  'Perfect for: contracts, forms, invoices, agreements, approvals.',
];

export default function AddSignaturePage() {
  return (
    <>
      <JsonLd toolName="Add Signature to PDF" toolDescription={DESCRIPTION} toolUrl="/add-signature" faqs={faqs} />
      <ToolLayout title="Add a signature" tagline="Sign a document yourself" icon="🖊️" accentColor="#5BB8F5">
        <div style={{ padding: '48px 0', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, margin: '0 auto 20px', background: 'var(--surface-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🖊️</div>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>Add a signature</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, maxWidth: 400, margin: '0 auto 24px', lineHeight: 1.6 }}>Draw, type, or upload your signature and place it anywhere on your PDF.</p>
          <div className="stamp">🚧 Coming soon</div>
        </div>
      </ToolLayout>
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <SeoContent heading="How to Add a Signature to a PDF" body={body} faqs={faqs} relatedTools={relatedTools} />
      </div>
    </>
  );
}