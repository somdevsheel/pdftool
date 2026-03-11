import type { Metadata } from 'next';
import { ToolLayout } from '../../components/ToolLayout';
import { SeoContent } from '../../components/seo/SeoContent';
import { JsonLd } from '../../components/seo/JsonLd';

const TITLE       = 'Send PDF for Bulk Signing Online — Mass E-Signature';
const DESCRIPTION = 'Send a PDF to multiple signatories at once. Bulk e-signature requests for PDF documents. Free, no account needed.';
const CANONICAL   = 'https://pdf.tools/send-bulk';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
};

const faqs = [
  {
    q: 'What is the difference between bulk sending and regular signature requests?',
    a: 'Regular requests are for collecting signatures from specific named people on a single document. Bulk sending sends the same document to a large list of people, each of whom signs their own individual copy.',
  },
  {
    q: 'How do I provide the list of recipients for bulk sending?',
    a: 'Upload a CSV file containing the recipient email addresses and any personalised field values such as names or reference numbers. Each row becomes one individual sending.',
  },
  {
    q: 'Does each signer get a separate copy of the document?',
    a: 'Yes. Each recipient signs their own individual copy of the document. All completed copies are available for download from your dashboard after signing.',
  },
  {
    q: 'How many recipients can I include in a bulk send?',
    a: 'Bulk send supports up to 1,000 recipients per batch. For larger volumes, split the recipient list into multiple batches.',
  },
];

const relatedTools = [
  { href: '/request-signatures', label: 'Request Signatures', desc: 'Send to specific named people' },
  { href: '/esign-template',     label: 'E-Sign Template',    desc: 'Create a template before bulk sending' },
  { href: '/esign-branding',     label: 'E-Sign Branding',    desc: 'Brand all bulk sends with your logo' },
  { href: '/sign-pdf',           label: 'Sign PDF',           desc: 'Sign a single document yourself' },
];

const body = [
  'Bulk sending allows you to distribute the same document to a large number of recipients simultaneously, where each person signs their own individual copy. This is ideal for mass onboarding documents, compliance acknowledgements, policy agreements, or any situation where every person in a group must sign the same standard document.',
  'The process uses a CSV file to define the recipient list. Each row in the CSV contains an email address and any personalised values that should be pre-filled in the document — such as a name, employee ID, or reference number. The system generates one personalised document per row and sends each recipient a unique signing link.',
  'Each signer receives their own email with a direct link to sign. They do not see the other recipients. Once they sign, their completed copy is stored and available for download. You can monitor signing progress from your dashboard, send automated reminders to those who have not yet signed, and download all completed copies as a batch when ready.',
  'Bulk send is particularly efficient for HR onboarding workflows, annual compliance re-certifications, client contract rollouts, and event waivers. Combining bulk send with e-sign templates and custom branding creates a fully professional, automated signing workflow.',
];

export default function SendBulkPage() {
  return (
    <>
      <JsonLd toolName="Send PDF for Bulk E-Signing" toolDescription={DESCRIPTION} toolUrl="/send-bulk" faqs={faqs} />
      <ToolLayout title="Send in bulk" tagline="Send a document to many people at once to sign individually" icon="📦" accentColor="#6B7FD7">
        <div style={{ padding: '48px 0', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, margin: '0 auto 20px', background: 'var(--surface-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>📦</div>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>Send in bulk</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, maxWidth: 400, margin: '0 auto 24px', lineHeight: 1.6 }}>Upload your recipient list and send one personalised signing request to each person automatically. Coming soon.</p>
          <div className="stamp">🚧 Coming soon</div>
        </div>
      </ToolLayout>
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <SeoContent heading="How Bulk PDF Signing Works" body={body} faqs={faqs} relatedTools={relatedTools} />
      </div>
    </>
  );
}