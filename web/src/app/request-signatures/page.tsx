import type { Metadata } from 'next';
import { ToolLayout } from '../../components/ToolLayout';
import { SeoContent } from '../../components/seo/SeoContent';
import { JsonLd } from '../../components/seo/JsonLd';

const TITLE       = 'Request E-Signatures Online — Send PDF for Signing';
const DESCRIPTION = 'Send PDF documents to others for electronic signature online. Free e-signature request tool, no account needed.';
const CANONICAL   = 'https://Freenoo/request-signatures';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
};

const faqs = [
  {
    q: 'How does sending a PDF for e-signature work?',
    a: 'Upload the PDF, add signature fields for each signer, enter their email addresses, and send. Each recipient receives a unique link to sign the document. Once all parties have signed, you receive the completed PDF.',
  },
  {
    q: 'Do signers need an account to sign?',
    a: 'No. Recipients receive a link by email and can sign directly in their browser without creating an account or downloading any software.',
  },
  {
    q: 'Can I request signatures from multiple people?',
    a: 'Yes. You can add multiple signers and define the signing order — either all at once or sequentially, where each signer receives the link only after the previous one has signed.',
  },
  {
    q: 'How will I know when everyone has signed?',
    a: 'You receive an email notification when each person signs and a final notification with the completed PDF once all signatures have been collected.',
  },
];

const relatedTools = [
  { href: '/sign-pdf',        label: 'Sign PDF',        desc: 'Sign a PDF yourself without sending to others' },
  { href: '/fill-sign',       label: 'Fill & Sign',     desc: 'Complete a form and sign it yourself' },
  { href: '/protect-pdf',     label: 'Protect PDF',     desc: 'Encrypt the signed document for security' },
  { href: '/esign-template',  label: 'E-Sign Template', desc: 'Create a reusable signing template' },
];

const body = [
  'Requesting electronic signatures allows you to send any PDF document to one or more people and collect their signatures digitally — without printing, scanning, or physical meetings. Each signer receives a link by email, opens the document in their browser, and signs with a click.',
  'The workflow starts with uploading your document and placing signature fields on the relevant pages. For contracts with two parties, you place your own signature field and the other party\'s field. You can also add date fields, initials fields, and text input fields for additional information.',
  'Once the document is configured, enter the email addresses of the signers and set the signing order. Sequential signing sends the link to each person one at a time — the next signer receives their link only after the previous one has completed. Parallel signing sends to all signers simultaneously.',
  'After all signatures are collected, the completed document is emailed to all parties and is available for download. The signed PDF includes an audit trail showing who signed, from which IP address, and at what time. This audit information forms part of the legally binding record.',
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