import type { Metadata } from 'next';
import PdfToWordToolPage from './ToolPage';
import { SeoContent } from '../../components/seo/SeoContent';
import { JsonLd } from '../../components/seo/JsonLd';

const TITLE       = 'PDF to Word Converter Online Free | DOC & DOCX';
const DESCRIPTION = "Turn your PDFs into fully editable Word documents in seconds with Freenoo's PDF to Word converter. Our tool preserves formatting, images, and tables for perfect results every time.";
const CANONICAL   = 'https://www.freenoo.com/pdf-to-word';

export const metadata: Metadata = {
  title: TITLE, description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
};

const faqs = [
  { q: 'Can I convert scanned PDF to Word?', a: 'Yes, Freenoo uses OCR (Optical Character Recognition) to make scanned PDFs editable in Word format.' },
  { q: 'Is PDF to Word conversion really free?', a: '100% free with no trials, hidden fees, or conversion limits. Convert unlimited PDFs to Word.' },
  { q: 'Does it preserve formatting?', a: 'Yes, our AI-powered converter maintains tables, images, fonts, and layout accuracy better than most tools.' },
  { q: 'What about PDF to DOCX converter?', a: 'Downloads as .docx by default, fully compatible with Microsoft Word 2007+.' },
  { q: 'Can I convert PDF to Word without losing formatting?', a: 'Our engine minimizes formatting shifts—ideal for professional documents.' },
  { q: 'Does it work for large PDF files?', a: 'Handles files up to 100MB easily with fast processing times.' },
];

const relatedTools = [
  { href: '/word-to-pdf', label: 'Word to PDF', desc: 'reverse conversion' },
  { href: '/compress-pdf', label: 'Compress PDF', desc: 'reduce file size before converting' },
  { href: '/sign-pdf', label: 'Fill & Sign', desc: 'sign your converted documents' },
];

// Using Markdown (**) for bolding to satisfy the string[] type
const body = [
  'Turn your PDFs into fully editable Word documents in seconds with Freenoo\'s PDF to Word converter. Our tool preserves formatting, images, and tables for perfect results every time.',
  <strong>Why use Freenoo PDF to Word?</strong>,
  'OCR support for scanned PDFs—convert image-based PDFs to editable Word',
  'Preserves original layout, fonts, tables, and images',
  '100% free with no watermarks or signup required',
  'Files auto-delete after processing for complete privacy',
  'Works on desktop, mobile, tablet—any device',
  <strong>How to convert PDF to Word (3 steps):</strong>,
  'Upload your PDF file (drag-drop or click to browse)',
  'Click "Convert to Word"—processes in seconds',
  'Download editable .docx file instantly',
  <><strong>Perfect for:</strong> contracts, reports, resumes, invoices, scanned documents</>
];

export default function PdfToWordPage() {
  return (
    <>
      <JsonLd toolName="PDF to Word Converter" toolDescription={DESCRIPTION} toolUrl="/pdf-to-word" faqs={faqs} />
      <PdfToWordToolPage />
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <SeoContent heading="About PDF to Word Conversion" body={body} faqs={faqs} relatedTools={relatedTools} />
      </div>
    </>
  );
}