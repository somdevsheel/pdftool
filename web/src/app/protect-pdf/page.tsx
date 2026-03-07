// import type { Metadata } from 'next';
// import { ToolLayout } from '../../components/ToolLayout';
// import { SeoContent } from '../../components/seo/SeoContent';
// import { JsonLd } from '../../components/seo/JsonLd';

// const TITLE       = 'Protect PDF with Password Online Free | Encrypt PDF';
// const DESCRIPTION = 'Add password protection to a PDF file online. Encrypt PDF with 128-bit AES. Free, no account required.';
// const CANONICAL   = 'https://pdf.tools/protect-pdf';

// export const metadata: Metadata = {
//   title: TITLE,
//   description: DESCRIPTION,
//   alternates: { canonical: CANONICAL },
//   openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
// };

// const faqs = [
//   {
//     q: 'What encryption is used to protect the PDF?',
//     a: 'This tool uses 128-bit AES encryption, the same standard used by Adobe Acrobat. The password is required to open the file in any PDF viewer.',
//   },
//   {
//     q: 'Can I restrict printing or copying as well as opening?',
//     a: 'Yes. In addition to the open password, you can set permissions that restrict printing, copying text, and modifying the document. These restrictions are enforced by the PDF viewer.',
//   },
//   {
//     q: 'What happens if I forget the password?',
//     a: 'There is no password recovery. Make sure to save the password you set. Once a PDF is encrypted with a password, it cannot be opened without it.',
//   },
// ];

// const relatedTools = [
//   { href: '/merge-pdf',   label: 'Merge PDF',   desc: 'Combine documents before protecting' },
//   { href: '/compress-pdf', label: 'Compress PDF', desc: 'Reduce size before adding password' },
//   { href: '/edit-pdf',    label: 'Edit PDF',    desc: 'Edit content before protecting' },
//   { href: '/sign-pdf',    label: 'Sign PDF',    desc: 'Add a signature before protecting' },
// ];

// const body = [
//   'Password-protecting a PDF prevents unauthorised users from opening, printing, or modifying the document. This is essential for sharing confidential contracts, financial documents, personal identification, or any file that should only be accessible to specific recipients.',
//   'PDF encryption works by applying a symmetric encryption algorithm to the file\'s content. The password is used to derive the encryption key. Any compliant PDF viewer — including Adobe Reader, Preview on macOS, and browser-based viewers — will prompt for the password before displaying the content.',
//   'Two levels of password protection are available in the PDF standard: an "open" password that prevents the document from being opened at all, and a "permissions" password that restricts specific operations such as printing, copying text, or making changes. Both can be set independently.',
//   'Encrypted PDFs are slightly larger than their unencrypted originals due to the overhead of the encryption metadata. For very sensitive documents, consider compressing the PDF before encrypting it to keep the file size manageable.',
// ];

// export default function ProtectPdfPage() {
//   return (
//     <>
//       <JsonLd toolName="Protect PDF with Password" toolDescription={DESCRIPTION} toolUrl="/protect-pdf" faqs={faqs} />
//       <ToolLayout title="Protect a PDF" tagline="Lock your PDF with a password. 128-bit AES encryption." icon="🔒" accentColor="#5BB8F5">
//         <div style={{ padding: '48px 0', textAlign: 'center' }}>
//           <div style={{ width: 64, height: 64, borderRadius: 16, margin: '0 auto 20px', background: 'var(--surface-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🔒</div>
//           <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>Protect a PDF</h2>
//           <p style={{ color: 'var(--text-muted)', fontSize: 14, maxWidth: 400, margin: '0 auto 24px' }}>PDF password protection with AES encryption is coming soon.</p>
//           <div className="stamp">🚧 Coming soon</div>
//         </div>
//       </ToolLayout>
//       <div className="max-w-6xl mx-auto px-6 pb-16">
//         <SeoContent heading="How to Protect a PDF with a Password" body={body} faqs={faqs} relatedTools={relatedTools} />
//       </div>
//     </>
//   );
// }






import type { Metadata } from 'next';
import { SeoContent } from '../../components/seo/SeoContent';
import { JsonLd } from '../../components/seo/JsonLd';
import ToolPage from './ToolPage';

const TITLE       = 'Protect PDF with Password Online Free | Encrypt PDF';
const DESCRIPTION = 'Add password protection to a PDF file online. Encrypt PDF with 128-bit AES. Free, no account required.';
const CANONICAL   = 'https://pdf.tools/protect-pdf';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
};

const faqs = [
  {
    q: 'What encryption is used to protect the PDF?',
    a: 'This tool uses 128-bit AES encryption, the same standard used by Adobe Acrobat. The password is required to open the file in any PDF viewer.',
  },
  {
    q: 'Can I restrict printing or copying as well as opening?',
    a: 'Yes. In addition to the open password, you can set permissions that restrict printing, copying text, and modifying the document. These restrictions are enforced by the PDF viewer.',
  },
  {
    q: 'What happens if I forget the password?',
    a: 'There is no password recovery. Make sure to save the password you set. Once a PDF is encrypted with a password, it cannot be opened without it.',
  },
];

const relatedTools = [
  { href: '/merge-pdf',    label: 'Merge PDF',    desc: 'Combine documents before protecting' },
  { href: '/compress-pdf', label: 'Compress PDF', desc: 'Reduce size before adding password' },
  { href: '/edit-pdf',     label: 'Edit PDF',     desc: 'Edit content before protecting' },
  { href: '/sign-pdf',     label: 'Sign PDF',     desc: 'Add a signature before protecting' },
];

const body = [
  'Password-protecting a PDF prevents unauthorised users from opening, printing, or modifying the document. This is essential for sharing confidential contracts, financial documents, personal identification, or any file that should only be accessible to specific recipients.',
  'PDF encryption works by applying a symmetric encryption algorithm to the file\'s content. The password is used to derive the encryption key. Any compliant PDF viewer — including Adobe Reader, Preview on macOS, and browser-based viewers — will prompt for the password before displaying the content.',
  'Two levels of password protection are available in the PDF standard: an "open" password that prevents the document from being opened at all, and a "permissions" password that restricts specific operations such as printing, copying text, or making changes. Both can be set independently.',
  'Encrypted PDFs are slightly larger than their unencrypted originals due to the overhead of the encryption metadata. For very sensitive documents, consider compressing the PDF before encrypting it to keep the file size manageable.',
];

export default function ProtectPdfPage() {
  return (
    <>
      <JsonLd toolName="Protect PDF with Password" toolDescription={DESCRIPTION} toolUrl="/protect-pdf" faqs={faqs} />
      <ToolPage />
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <SeoContent heading="How to Protect a PDF with a Password" body={body} faqs={faqs} relatedTools={relatedTools} />
      </div>
    </>
  );
}