import type { Metadata } from 'next';
import PdfToJpgToolPage from './ToolPage';
import { SeoContent } from '../../components/seo/SeoContent';
import { JsonLd } from '../../components/seo/JsonLd';

const TITLE       = 'PDF to Image Converter Online Free — PDF to Image';
const DESCRIPTION = 'Turn any PDF into clear JPG images in seconds with Freenoo. Convert single pages or entire documents to high-quality images you can share, edit, or upload anywhere.';
const CANONICAL   = 'https://www.freenoo.com/pdf-to-jpg';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
};

const faqs = [
  { q: 'Is PDF to JPG converter free?', a: 'Yes, 100% free with no signup, no email, and no watermarks on your images.' },
  { q: 'Can I convert specific pages from PDF to JPG?', a: 'Yes, select page ranges or individual pages instead of converting the entire document.' },
  { q: 'Does it support high-quality conversion?', a: 'We provide optimized quality settings for print-ready images while keeping file sizes manageable.' },
  { q: 'Can I convert multiple PDFs to JPG?', a: 'Process multiple files quickly by opening several browser tabs for parallel conversions.' },
  { q: 'Is my PDF secure during conversion?', a: 'Files are encrypted in transit and auto-deleted after about 1 hour—complete privacy guaranteed.' },
  { q: 'What about PNG or other image formats?', a: 'Currently outputs JPG; for PNG or other formats, use our image converter tools after export.' },
];

const relatedTools = [
  { href: '/jpg-to-pdf', label: 'JPG to PDF', desc: 'reverse conversion' },
  { href: '/compress-pdf', label: 'Compress PDF', desc: 'reduce PDF size before converting' },
  { href: '/split-pdf', label: 'Split PDF', desc: 'extract specific pages first' },
];

const body = [
  'Turn any PDF into clear JPG images in seconds with Freenoo. Convert single pages or entire documents to high-quality images you can share, edit, or upload anywhere.',
  <strong>Why use Freenoo PDF to JPG?</strong>,
  'Convert PDF to JPG page-by-page or all pages at once',
  'High-resolution output suitable for print or web',
  'Download images individually or as ZIP archive',
  '100% free with no watermarks or limits',
  'Privacy-focused—files auto-delete after processing',
  <strong>How to convert PDF to JPG (3 steps):</strong>,
  'Upload your PDF file (supports multi-page PDFs up to 100MB)',
  'Choose output quality and select specific pages if needed',
  'Click "Convert to JPG"—download images or ZIP file',
  <><strong>Perfect for:</strong> social media posts, presentations, website images, print materials</>
];

export default function PdfToJpgPage() {
  return (
    <>
      <JsonLd toolName="PDF to Image Converter" toolDescription={DESCRIPTION} toolUrl="/pdf-to-jpg" faqs={faqs} />
      <PdfToJpgToolPage />
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <SeoContent heading="How to Convert PDF to Image" body={body} faqs={faqs} relatedTools={relatedTools} />
      </div>
    </>
  );
}
