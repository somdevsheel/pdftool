import type { Metadata } from 'next';
import { ToolLayout } from '../../components/ToolLayout';
import { SeoContent } from '../../components/seo/SeoContent';
import { JsonLd } from '../../components/seo/JsonLd';

const TITLE       = 'Request E-Signatures Online — Send PDF for Signing';
const DESCRIPTION = 'Send PDF documents to others for electronic signature online. Free e-signature request tool, no account needed.';
const CANONICAL   = 'https://www.freenoo.com/request-signatures';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
};

const faqs = [
  { q: 'How does Request Signature work?', a: 'Upload PDF, add signer emails—they receive a secure link to sign electronically without accounts.' },
  { q: 'Are e-signatures legally binding?', a: 'Yes, includes timestamp, IP tracking, and audit trail meeting regulations in most countries.' },
  { q: 'Can multiple people sign the same PDF?', a: 'Yes, set sequential (A→B→C) or simultaneous signing workflows.' },
  { q: 'Is my data secure?', a: 'Encrypted transmission, files auto-delete after signing completion.' },
  { q: 'Can I track signature status?', a: 'Yes, receive notifications when each signer completes their signature.' },
  { q: 'Do signers need Freenoo accounts?', a: 'No, signers receive a secure link and can sign without registration.' },
];

const relatedTools = [
  { href: '/fill-sign',   label: 'Fill & Sign',   desc: 'Sign documents yourself first' },
  { href: '/add-signature', label: 'Add Signature', desc: 'Create reusable signatures' },
  { href: '/protect-pdf', label: 'Protect PDF',    desc: 'Secure documents before sending' },
];

const body = [
  'Send any PDF to multiple people for e-signature approval without email chains or complex software. Upload, add recipients, and get notified when signed copies return.',
  <>
    <strong>Why use Freenoo Request Signature?</strong>
    <ul style={{ marginTop: 8, paddingLeft: 18, lineHeight: 2 }}>
      <li>Send to multiple signers in sequence or simultaneously</li>
      <li>Automatic reminders and status tracking</li>
      <li>Legally binding e-signatures with audit trail</li>
      <li>100% free—no signup, no watermarks</li>
      <li>Files auto-delete after signing completion</li>
    </ul>
  </>,
  <>
    <strong>How to request PDF signature (3 steps):</strong>
    <ol style={{ marginTop: 8, paddingLeft: 18, lineHeight: 2 }}>
      <li>Upload your PDF and add email addresses of signers</li>
      <li>Set signing order and place signature fields where needed</li>
      <li>Signers receive secure link to sign—you get completed PDF</li>
    </ol>
  </>,
  'Perfect for: contracts, proposals, agreements, approval workflows.',
];

export default function RequestSignaturesPage() {
  return (
    <>
      <JsonLd toolName="Request E-Signatures Online" toolDescription={DESCRIPTION} toolUrl="/request-signatures" faqs={faqs} />
      <ToolLayout title="Request e-signatures" tagline="Send a document to anyone to e-sign online fast" icon="📨" accentColor="#6B7FD7">
        <div style={{ padding: '48px 0', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, margin: '0 auto 20px', background: 'var(--surface-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>📨</div>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>Request e-signatures</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, maxWidth: 400, margin: '0 auto 24px', lineHeight: 1.6 }}>Send your PDF to others for e-signature. Each signer gets a unique link and signs in their browser. Coming soon.</p>
          <div className="stamp">🚧 Coming soon</div>
        </div>
      </ToolLayout>
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <SeoContent heading="How to Request E-Signatures on a PDF" body={body} faqs={faqs} relatedTools={relatedTools} />
      </div>
    </>
  );
}