import type { Metadata } from 'next';
import { ToolLayout } from '../../components/ToolLayout';
import { SeoContent } from '../../components/seo/SeoContent';
import { JsonLd } from '../../components/seo/JsonLd';

const TITLE       = 'E-Sign Branding — Custom Logo for PDF Agreements';
const DESCRIPTION = 'Add your brand logo and custom URL to e-signature requests. Professional e-sign branding for PDF documents.';
const CANONICAL   = 'https://freenoo.com/esign-branding';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
};

const faqs = [
  {
    q: 'What branding elements can I add to e-signature requests?',
    a: 'You can add your company logo, company name, and a custom domain or website URL. These appear in the signature request email and on the signing page that recipients see.',
  },
  {
    q: 'Does branding apply to all future signature requests?',
    a: 'Yes. Once configured, your branding is applied automatically to all e-signature requests sent from your account. You can update or remove branding at any time.',
  },
  {
    q: 'Will signers see my company name in the email?',
    a: 'Yes. The "from" display name in the signature request email shows your company name, and your logo appears in the email header and at the top of the signing page.',
  },
  {
    q: 'What logo format and size is recommended?',
    a: 'Upload a PNG or SVG logo with a transparent background. Recommended size is 200 x 60 pixels or a similar horizontal format. The logo is displayed at a fixed height in the email and signing page.',
  },
];

const relatedTools = [
  { href: '/request-signatures', label: 'Request Signatures', desc: 'Send branded signature requests' },
  { href: '/esign-template',     label: 'E-Sign Template',    desc: 'Create reusable signing templates' },
  { href: '/sign-pdf',           label: 'Sign PDF',           desc: 'Sign documents yourself' },
  { href: '/send-bulk',          label: 'Send in Bulk',       desc: 'Send branded requests to many people' },
];

const body = [
  'E-sign branding lets you replace the default Freenoo branding on signature request emails and signing pages with your own company name, logo, and website URL. This creates a professional, white-labelled signing experience for your clients and partners.',
  'When you send a signature request with custom branding, the recipient sees your company logo in the email header, your company name as the sender, and your logo again at the top of the secure signing page. This builds trust and makes the request look like it comes from your own platform.',
  'Branding is particularly important for high-value or sensitive documents such as client contracts, non-disclosure agreements, employment offers, and financial agreements. A professionally branded signing experience reassures recipients that the request is legitimate and from an organisation they know.',
  'Once you have set up your branding, it applies automatically to all future signature requests. You do not need to configure it for each document. If you represent multiple brands or clients, branding can be updated before each batch of requests.',
];

export default function EsignBrandingPage() {
  return (
    <>
      <JsonLd toolName="E-Sign Branding for PDF" toolDescription={DESCRIPTION} toolUrl="/esign-branding" faqs={faqs} />
      <ToolLayout title="Add e-sign branding" tagline="Add your company name, logo and URL to e-sign agreements" icon="🎨" accentColor="#3FC87A">
        <div style={{ padding: '48px 0', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, margin: '0 auto 20px', background: 'var(--surface-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🎨</div>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>Add e-sign branding</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, maxWidth: 400, margin: '0 auto 24px', lineHeight: 1.6 }}>White-label your e-signature requests with your own logo and company name. Coming soon.</p>
          <div className="stamp">🚧 Coming soon</div>
        </div>
      </ToolLayout>
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <SeoContent heading="How E-Sign Branding Works" body={body} faqs={faqs} relatedTools={relatedTools} />
      </div>
    </>
  );
}