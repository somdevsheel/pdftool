// import type { Metadata } from 'next';
// import CompressPage from '../compress/ToolPage';
// import { SeoContent } from '../../components/seo/SeoContent';
// import { JsonLd } from '../../components/seo/JsonLd';

// const TITLE       = 'Compress PDF Online Free — Reduce File Size';
// const DESCRIPTION = 'Reduce PDF file size online using Ghostscript. Choose quality level: screen, ebook, or print. Free, no signup.';
// const CANONICAL   = 'https://freenoo.com/compress-pdf';

// export const metadata: Metadata = {
//   title: TITLE,
//   description: DESCRIPTION,
//   alternates: { canonical: CANONICAL },
//   openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
// };

// const faqs = [
//   {
//     q: 'How much can I reduce a PDF file size?',
//     a: 'Results vary by content. Image-heavy PDFs compressed with the "Small file" setting can shrink by 60–80%. Text-only PDFs see smaller reductions since text is already compact.',
//   },
//   {
//     q: 'What is the difference between the compression quality levels?',
//     a: '"Small file" uses 72 dpi (screen resolution), suitable for web viewing. "Balanced" uses 150 dpi, good for most sharing needs. "High quality" uses 300 dpi, suitable for printing.',
//   },
//   {
//     q: 'Will compression reduce the visual quality of my PDF?',
//     a: 'Text remains sharp at all settings. Images are downsampled according to the DPI of the chosen level. The "High quality" setting produces minimal visible change for most documents.',
//   },
//   {
//     q: 'What tool is used to compress PDF files?',
//     a: 'This tool uses Ghostscript, the industry-standard PDF and PostScript processor. Compression happens entirely on the server — nothing is processed in your browser.',
//   },
// ];

// const relatedTools = [
//   { href: '/merge-pdf',    label: 'Merge PDF',    desc: 'Combine multiple PDFs into one before compressing' },
//   { href: '/split-pdf',    label: 'Split PDF',    desc: 'Remove unwanted sections to reduce size' },
//   { href: '/pdf-to-word',  label: 'PDF to Word',  desc: 'Convert compressed PDF to editable document' },
//   { href: '/jpg-to-pdf',   label: 'Image to PDF',   desc: 'Convert images to PDF, then compress' },
// ];

// const body = [
//   'PDF compression reduces the size of a PDF file by downsampling embedded images, removing unused objects, and applying stream compression. The result is a smaller file that is faster to upload, email, and share — while keeping the document text fully readable.',
//   'This tool uses Ghostscript\'s PDFSETTINGS parameter to apply different compression profiles. The "Small file" profile targets screen viewing at 72 dpi, making it ideal for online forms, email attachments, or any document that will be read on screen rather than printed. The "Balanced" profile at 150 dpi is the best general-purpose option.',
//   'Compression effectiveness depends on the content of your PDF. Documents with many high-resolution photographs or large graphics will see the greatest size reductions. PDFs that contain mostly text, vector graphics, or low-resolution images will see smaller but still measurable reductions.',
//   'After compression, download and review the output before replacing your original. If quality is insufficient, try a higher quality setting. For large documents where you only need certain sections, consider splitting the PDF first and then compressing only the pages you need.',
// ];

// export default function CompressPdfPage() {
//   return (
//     <>
//       <JsonLd toolName="Compress PDF Online" toolDescription={DESCRIPTION} toolUrl="/compress-pdf" faqs={faqs} />
//       <CompressPage />
//       <div className="max-w-6xl mx-auto px-6 pb-16">
//         <SeoContent heading="How PDF Compression Works" body={body} faqs={faqs} relatedTools={relatedTools} />
//       </div>
//     </>
//   );
// }



import type { Metadata } from 'next';
import CompressPage from '../compress/ToolPage';
import { SeoContent } from '../../components/seo/SeoContent';
import { JsonLd } from '../../components/seo/JsonLd';

const TITLE       = 'Compress PDF Online Free — Reduce File Size';
const DESCRIPTION = 'Reduce PDF file size online using Ghostscript. Choose quality level: screen, ebook, or print. Free, no signup.';
const CANONICAL   = 'https://freenoo.com/compress-pdf';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
};

const faqs = [
  { q: 'Is PDF compressor free?', a: 'Yes, completely free with no signup, no email, and no watermarks.' },
  { q: 'Can I compress PDF to specific sizes like 100KB?', a: 'Choose compression levels and check output size; re-compress if needed for strict limits.' },
  { q: 'Will compressing reduce quality?', a: 'Freenoo optimizes images and structure to reduce size while keeping text crisp.' },
  { q: 'Does it work for scanned PDFs?', a: 'Yes, scanned PDFs often compress significantly with minimal quality loss.' },
  { q: 'Is my compressed PDF secure?', a: 'Files are encrypted in transit and auto-deleted after about 1 hour—complete privacy.' },
  { q: 'Can I compress multiple PDFs?', a: 'Process as many files as needed one after another, or open multiple tabs for parallel compression.' },
];

const relatedTools = [
  { href: '/tools',      label: 'All Converter Tools', desc: 'Compress after converting' },
  { href: '/split-pdf',  label: 'Split PDF',            desc: 'Compress large files in sections' },
  { href: '/merge-pdf',  label: 'Merge PDF',            desc: 'Compress after combining' },
];

const body = [
  'Shrink large PDFs while keeping them clear and readable with Freenoo\'s Compress PDF tool. Perfect when you need to email documents or meet 100KB/200KB upload limits.',
  <>
    <strong>Why use Freenoo Compress PDF?</strong>
    <ul style={{ marginTop: 8, paddingLeft: 18, lineHeight: 2 }}>
      <li>Smart compression balances quality and size</li>
      <li>Choose target size or quality level</li>
      <li>Preserves text clarity and most image detail</li>
      <li>100% free with no watermarks or limits</li>
      <li>Privacy-focused—files auto-delete after processing</li>
    </ul>
  </>,
  <>
    <strong>How to compress PDF (3 steps):</strong>
    <ol style={{ marginTop: 8, paddingLeft: 18, lineHeight: 2 }}>
      <li>Upload your PDF file (scanned or digital, up to 100MB)</li>
      <li>Choose compression level: Strong, Balanced, or High Quality</li>
      <li>Click &quot;Compress PDF&quot;—download reduced-size file</li>
    </ol>
  </>,
  'Perfect for: email attachments, form uploads, mobile sharing, website optimization.',
];

export default function CompressPdfPage() {
  return (
    <>
      <JsonLd toolName="Compress PDF Online" toolDescription={DESCRIPTION} toolUrl="/compress-pdf" faqs={faqs} />
      <CompressPage />
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <SeoContent heading="How to Compress PDF Files Online" body={body} faqs={faqs} relatedTools={relatedTools} />
      </div>
    </>
  );
}