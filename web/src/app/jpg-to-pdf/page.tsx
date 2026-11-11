import type { Metadata } from 'next';
import ConvertPage from '../convert/ToolPage';
import { SeoContent } from '../../components/seo/SeoContent';
import { JsonLd } from '../../components/seo/JsonLd';

const TITLE       = 'Image to PDF Converter Online Free | PNG & TIFF Too';
const DESCRIPTION = 'Convert any JPG or JPEG image into a clean, shareable PDF in just a few clicks with Freenoo. Perfect for ID proofs, invoices, scanned notes, and photo collections.';
const CANONICAL   = 'https://www.freenoo.com/jpg-to-pdf';

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