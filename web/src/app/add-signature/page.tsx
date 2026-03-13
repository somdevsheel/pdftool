import type { Metadata } from 'next';
import { ToolLayout } from '../../components/ToolLayout';
import { SeoContent } from '../../components/seo/SeoContent';
import { JsonLd } from '../../components/seo/JsonLd';

const TITLE       = 'Add Signature to PDF Online Free | E-Sign PDF';
const DESCRIPTION = 'Add your electronic signature to any PDF online. Draw, type, or upload your signature. Free, no account needed.';
const CANONICAL   = 'https://Freenoo/add-signature';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
};

const faqs = [
  {
    q: 'How do I add my signature to a PDF?',
    a: 'Upload your PDF, click to place a signature field, then draw your signature with a mouse or finger, type your name in a handwriting font, or upload an image of your handwritten signature.',
  },
  {
    q: 'Can I place the signature anywhere on the page?',
    a: 'Yes. After creating your signature, drag it to any position on any page in the document. You can also resize it to fit the available signature space.',
  },
  {
    q: 'Will the signature be permanent after download?',
    a: 'Yes. Once downloaded, the signature is embedded as a fixed element in the PDF and cannot be moved or removed without access to the original unsigned document.',
  },
  {
    q: 'Is adding a signature the same as a digital certificate signature?',
    a: 'No. This tool adds a visual signature image to the PDF. A cryptographic digital signature uses a certificate to verify identity and detect tampering. For basic contracts, a visual signature is usually sufficient.',
  },
];

const relatedTools = [
  { href: '/sign-pdf',       label: 'Sign PDF',       desc: 'Full fill and sign workflow for PDF forms' },
  { href: '/protect-pdf',    label: 'Protect PDF',    desc: 'Password-protect your signed document' },
  { href: '/compress-pdf',   label: 'Compress PDF',   desc: 'Reduce file size before sending the signed PDF' },
  { href: '/merge-pdf',      label: 'Merge PDF',      desc: 'Combine signed documents into one file' },
];

const body = [
  'Adding a signature to a PDF allows you to sign contracts, agreements, approval forms, and any other document that requires your signature — without printing, signing by hand, and scanning back in. The signature is placed directly into the PDF as a permanent visual element.',
  'Three signature formats are supported: drawn signatures created with a mouse or touchscreen stylus, typed signatures where your name is rendered in a cursive handwriting font, and uploaded signatures where you provide a PNG image of your actual handwritten signature with a transparent background.',
  'Once your signature is created, click anywhere on the PDF page to place it. Drag to reposition and use the corner handles to resize it to fit the signature line. The placement is pixel-accurate and the signature stays exactly where you put it in the output file.',
  'For documents that require multiple signatures — such as contracts with multiple parties — each signer adds their own signature in turn. The first person signs and downloads the PDF, then passes it to the next signer who opens the new file and adds their signature. The document accumulates all signatures in sequence.',
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