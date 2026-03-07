import type { Metadata } from 'next';
import PdfToJpgToolPage from './ToolPage';
import { SeoContent } from '../../components/seo/SeoContent';
import { JsonLd } from '../../components/seo/JsonLd';

const TITLE       = 'PDF to JPG Converter Online Free — PDF to Image';
const DESCRIPTION = 'Convert PDF pages to JPG images online. Each page becomes a separate JPG. Free, high quality, no signup.';
const CANONICAL   = 'https://pdf.tools/pdf-to-jpg';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
};

const faqs = [
  { q: 'How do I convert a PDF to JPG online?', a: 'Upload your PDF file and the converter extracts each page as a separate JPG image. All images are bundled into a ZIP file for easy download.' },
  { q: 'What resolution are the JPG images?', a: 'Pages are converted at 150 DPI by default, producing clear images suitable for web use, presentations, and general sharing. Higher DPI options are available.' },
  { q: 'Can I convert just one page of a PDF to JPG?', a: 'Yes. Use the Split PDF tool first to extract the single page you want, then convert that single-page PDF to a JPG.' },
  { q: 'Is there a difference between PDF to JPG and PDF to PNG?', a: 'JPG uses lossy compression — ideal for photographs and complex images where file size matters. PNG uses lossless compression — better for screenshots, diagrams, and images with text.' },
];
const relatedTools = [
  { href: '/jpg-to-pdf',   label: 'JPG to PDF',   desc: 'Convert images back to PDF' },
  { href: '/compress-pdf', label: 'Compress PDF', desc: 'Reduce PDF size before converting' },
  { href: '/split-pdf',    label: 'Split PDF',    desc: 'Extract a single page before converting' },
  { href: '/rotate-pdf',   label: 'Rotate PDF',   desc: 'Fix page orientation before converting' },
];
const body = [
  'Converting a PDF to JPG extracts each page as a raster image, making it easy to use PDF content in presentations, web pages, social media posts, or any context where an image file is required rather than a PDF document.',
  'Each page of the PDF is rendered at a fixed resolution and saved as a separate JPG file. For PDFs with multiple pages, all images are bundled into a single ZIP archive. The file naming follows the pattern page-1.jpg, page-2.jpg, and so on.',
  'JPG is the most widely supported image format and is accepted by virtually every application, website, and platform. The format works well for PDF pages that contain photographs, gradients, or rich colour content. For pages with text, diagrams, or screenshots where sharpness matters more than file size, PNG may produce better results.',
  'If you only need a specific page, use the Split PDF tool first to extract that page as a standalone PDF, then convert it to an image. This avoids downloading a large ZIP for a single page.',
];

export default function PdfToJpgPage() {
  return (
    <>
      <JsonLd toolName="PDF to JPG Converter" toolDescription={DESCRIPTION} toolUrl="/pdf-to-jpg" faqs={faqs} />
      <PdfToJpgToolPage />
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <SeoContent heading="How to Convert PDF to JPG" body={body} faqs={faqs} relatedTools={relatedTools} />
      </div>
    </>
  );
}
