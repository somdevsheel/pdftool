import type { Metadata } from 'next';
import { ToolLayout } from '../../components/ToolLayout';
import { SeoContent } from '../../components/seo/SeoContent';
import { JsonLd } from '../../components/seo/JsonLd';

const TITLE       = 'Create PDF Web Form — Embeddable Signature Form';
const DESCRIPTION = 'Create embeddable web forms from PDF documents. Collect signatures and data online. Free PDF web form builder.';
const CANONICAL   = 'https://pdf.tools/web-form';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
};

const faqs = [
  {
    q: 'What is a PDF web form?',
    a: 'A PDF web form converts your PDF document into an online form hosted at a unique URL. Visitors fill it in and sign it in their browser, and responses are collected and stored automatically.',
  },
  {
    q: 'Can I embed the form on my own website?',
    a: 'Yes. Each form has an embed code that you paste into any webpage. The form appears inline on your site and collects responses without visitors leaving your page.',
  },
  {
    q: 'How do I receive the completed forms?',
    a: 'Completed submissions are stored in your dashboard and can be downloaded as individual PDFs or exported as a CSV with all field values. Email notifications can be configured for each new submission.',
  },
  {
    q: 'Can I limit who can submit the form?',
    a: 'Yes. You can make the form publicly accessible via its URL, restrict it to specific email domains, or require an access code before the form can be submitted.',
  },
];

const relatedTools = [
  { href: '/request-signatures', label: 'Request Signatures', desc: 'Send to specific named people instead' },
  { href: '/fill-sign',          label: 'Fill & Sign',        desc: 'Fill a form yourself rather than publish it' },
  { href: '/esign-template',     label: 'E-Sign Template',    desc: 'Create a reusable template for repeated use' },
  { href: '/protect-pdf',        label: 'Protect PDF',        desc: 'Encrypt completed form downloads' },
];

const body = [
  'A PDF web form converts any PDF document into a publicly accessible online form that collects signatures and data from an unlimited number of respondents. Instead of emailing the PDF to each person individually, you share a single link or embed the form on your website.',
  'The form builder detects existing form fields in the PDF and maps them to web form inputs automatically. You can add, edit, and reposition fields using a visual editor — adding text fields, date pickers, checkboxes, dropdown menus, and signature pads anywhere on the page.',
  'Each submission is stored as a completed PDF with all fields filled in and the signature embedded. Responses are accessible from your dashboard, where you can download individual PDFs, download all responses as a ZIP archive, or export the field values to a CSV spreadsheet for data analysis.',
  'Web forms are ideal for client intake forms, membership applications, event waivers, health and safety acknowledgements, and any recurring process where many different people must complete the same document. The form URL can be shared via email, messaging, QR code, or embedded directly into your website.',
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