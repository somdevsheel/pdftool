import type { Metadata } from 'next';
import { ToolLayout } from '../../components/ToolLayout';
import { SeoContent } from '../../components/seo/SeoContent';
import { JsonLd } from '../../components/seo/JsonLd';

const TITLE       = 'Create E-Sign Template — Reusable PDF Signature Form';
const DESCRIPTION = 'Create reusable e-signature templates for PDF documents. Save time on recurring signature workflows. Free.';
const CANONICAL   = 'https://pdf.tools/esign-template';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
};

const faqs = [
  {
    q: 'What is an e-sign template?',
    a: 'An e-sign template is a pre-configured version of a document with signature fields, date fields, and text fields already placed. You send the template to different signers each time without repositioning the fields.',
  },
  {
    q: 'Can I reuse a template for different signers?',
    a: 'Yes. A template stores the document and field layout permanently. Each time you send it, you just enter the signer\'s email address. The field positions are already set.',
  },
  {
    q: 'Can I have multiple signer roles in one template?',
    a: 'Yes. You can define multiple signer roles — for example, "Client" and "Witness" — each with their own set of fields. When sending, you assign email addresses to each role.',
  },
  {
    q: 'How many templates can I create?',
    a: 'There is no limit on the number of templates. Common use cases include NDA templates, service agreement templates, onboarding document templates, and approval templates.',
  },
];

const relatedTools = [
  { href: '/request-signatures', label: 'Request Signatures', desc: 'Send your template for signing' },
  { href: '/esign-branding',     label: 'E-Sign Branding',    desc: 'Apply your logo to template requests' },
  { href: '/send-bulk',          label: 'Send in Bulk',       desc: 'Send the same template to many people' },
  { href: '/sign-pdf',           label: 'Sign PDF',           desc: 'Sign a one-off document without a template' },
];

const body = [
  'An e-signature template lets you configure a document once — placing all signature fields, date fields, and input fields in their correct positions — and then reuse that configuration every time you need to send the same document to a new signer. This saves time for any document you send regularly.',
  'Common uses for templates include NDAs sent to every new client, employment contracts sent to new hires, service agreements sent at project start, and consent forms sent before appointments. Instead of re-uploading and repositioning fields each time, you simply select the template, enter the recipient\'s email, and send.',
  'Templates can be configured with multiple signer roles. For example, a sales contract might have a "Sales Rep" role and a "Client" role, each with their own signature and initials fields. When sending, you fill in the real email addresses for each role. The document is sent to the roles in the configured sequence.',
  'All templates are stored securely and can be edited, duplicated, or archived at any time. You can also combine templates with e-sign branding so every signature request carries your company logo and name, regardless of which team member sends it.',
];

export default function EsignTemplatePage() {
  return (
    <>
      <JsonLd toolName="Create E-Sign Template" toolDescription={DESCRIPTION} toolUrl="/esign-template" faqs={faqs} />
      <ToolLayout title="Create e-sign template" tagline="Create a reusable document to send for e-signature faster" icon="📑" accentColor="#C17EE8">
        <div style={{ padding: '48px 0', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, margin: '0 auto 20px', background: 'var(--surface-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>📑</div>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>Create e-sign template</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, maxWidth: 400, margin: '0 auto 24px', lineHeight: 1.6 }}>Configure your document once with signature fields and reuse it for every new signer. Coming soon.</p>
          <div className="stamp">🚧 Coming soon</div>
        </div>
      </ToolLayout>
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <SeoContent heading="How E-Sign Templates Work" body={body} faqs={faqs} relatedTools={relatedTools} />
      </div>
    </>
  );
}