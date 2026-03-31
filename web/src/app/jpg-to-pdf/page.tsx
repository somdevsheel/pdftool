// import type { Metadata } from 'next';
// import ConvertPage from '../convert/ToolPage';
// import { SeoContent } from '../../components/seo/SeoContent';
// import { JsonLd } from '../../components/seo/JsonLd';

// const TITLE       = 'Image to PDF Converter Online Free | PNG & TIFF Too';
// const DESCRIPTION = 'Convert JPG, PNG, and TIFF images to PDF online. Free image to PDF converter, no account needed. Fast and secure.';
// const CANONICAL   = 'https://freenoo.com/jpg-to-pdf';

// export const metadata: Metadata = {
//   title: TITLE,
//   description: DESCRIPTION,
//   alternates: { canonical: CANONICAL },
//   openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
// };

// const faqs = [
//   {
//     q: 'Which image formats can I convert to PDF?',
//     a: 'You can convert JPG (JPEG), PNG, and TIFF image files to PDF. Upload one or multiple images and they will be combined into a single PDF document.',
//   },
//   {
//     q: 'Will converting an image to PDF reduce its quality?',
//     a: 'The image is embedded in the PDF at its original resolution using ImageMagick. There is no quality loss unless the source image has low resolution to begin with.',
//   },
//   {
//     q: 'Can I convert multiple images to one PDF?',
//     a: 'Yes. Upload up to 10 images and all of them will be included in a single PDF, with each image on its own page.',
//   },
//   {
//     q: 'How do I convert a screenshot to PDF?',
//     a: 'Save your screenshot as a JPG or PNG file, then upload it using this tool. The screenshot will be converted to a PDF page in seconds.',
//   },
// ];

// const relatedTools = [
//   { href: '/compress-pdf',  label: 'Compress PDF',  desc: 'Reduce the size of your converted PDF' },
//   { href: '/merge-pdf',     label: 'Merge PDF',     desc: 'Combine your image PDF with other documents' },
//   { href: '/pdf-to-word',   label: 'PDF to Word',   desc: 'Convert PDF back to an editable document' },
//   { href: '/split-pdf',     label: 'Split PDF',     desc: 'Split a multi-image PDF into individual pages' },
// ];

// const body = [
//   'Converting images to PDF is a common task when preparing documents for email, submission to online forms, or long-term archival. A PDF wraps your image in a standardized container format that preserves its exact appearance on any device, without requiring any image viewer application.',
//   'This tool accepts JPG, PNG, and TIFF files. Each image is embedded in the PDF at its original dimensions using ImageMagick on the server. The resulting PDF can then be combined with other PDFs, compressed, or further processed using any of the other tools on this site.',
//   'When you upload multiple images, they are each placed on a separate PDF page in the order they were uploaded. The file list shows each image name and size before conversion starts, allowing you to remove any unwanted files.',
//   'TIFF files are commonly used in professional scanning workflows and contain high-resolution image data. This converter handles multi-layer TIFF files correctly, flattening them to a standard PDF page. All files are deleted from the server after 60 minutes.',
// ];

// export default function JpgToPdfPage() {
//   return (
//     <>
//       <JsonLd toolName="Image to PDF Converter" toolDescription={DESCRIPTION} toolUrl="/jpg-to-pdf" faqs={faqs} />
//       <ConvertPage />
//       <div className="max-w-6xl mx-auto px-6 pb-16">
//         <SeoContent heading="How to Convert Images to PDF" body={body} faqs={faqs} relatedTools={relatedTools} />
//       </div>
//     </>
//   );
// }



import type { Metadata } from 'next';
import ConvertPage from '../convert/ToolPage';
import { SeoContent } from '../../components/seo/SeoContent';
import { JsonLd } from '../../components/seo/JsonLd';

const TITLE       = 'Image to PDF Converter Online Free | PNG & TIFF Too';
const DESCRIPTION = 'Convert any JPG or JPEG image into a clean, shareable PDF in just a few clicks with Freenoo. Perfect for ID proofs, invoices, scanned notes, and photo collections.';
const CANONICAL   = 'https://freenoo.com/jpg-to-pdf';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
};

const faqs = [
  { q: 'Is JPG to PDF converter free?', a: 'Yes, completely free with no signup, no email required, and no watermarks.' },
  { q: 'Can I convert multiple JPG files to one PDF?', a: 'Absolutely—upload several images and Freenoo merges them into a single PDF.' },
  { q: 'Does it work for PNG or other image formats?', a: 'Yes, also supports PNG to PDF conversion without quality loss.' },
  { q: 'Is my photo data secure?', a: 'Files are processed on secure servers and auto-deleted after 1 hour—complete privacy.' },
  { q: 'Can I convert photos to PDF on mobile?', a: 'Yes, works in any browser on phone or tablet without installing apps.' },
  { q: 'Does it support high-quality JPG to PDF?', a: 'Yes, we balance quality and compression for sharp output with reasonable file sizes.' },
];

const relatedTools = [
  { href: '/png-to-pdf', label: 'PNG to PDF', desc: 'convert transparent images' },
  { href: '/pdf-to-jpg', label: 'PDF to JPG', desc: 'reverse conversion' },
  { href: '/compress-pdf', label: 'Compress PDF', desc: 'reduce output file size' },
];

const body = [
  'Convert any JPG or JPEG image into a clean, shareable PDF in just a few clicks with Freenoo. Perfect for ID proofs, invoices, scanned notes, and photo collections.',
  <strong>Why use Freenoo JPG to PDF?</strong>,
  'Convert single or multiple JPG files to one PDF',
  'Smart page ordering with drag-drop interface',
  'Maintains original image quality with optimized file size',
  '100% free with no watermarks or page limits',
  'Works on desktop and mobile browsers',
  <strong>How to convert JPG to PDF (3 steps):</strong>,
  'Upload one or more JPG/JPEG files (drag-drop supported)',
  'Reorder images if needed, choose page orientation',
  'Click "Convert to PDF"—download your combined PDF',
  <><strong>Perfect for:</strong> identity documents, receipts, scanned forms, photo albums</>
];

export default function JpgToPdfPage() {
  return (
    <>
      <JsonLd toolName="Image to PDF Converter" toolDescription={DESCRIPTION} toolUrl="/jpg-to-pdf" faqs={faqs} />
      <ConvertPage />
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <SeoContent heading="How to Convert Images to PDF" body={body} faqs={faqs} relatedTools={relatedTools} />
      </div>
    </>
  );
}