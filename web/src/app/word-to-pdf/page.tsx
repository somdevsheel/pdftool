import type { Metadata } from 'next';
import WordToPdfToolPage from './ToolPage';
import { SeoContent } from '../../components/seo/SeoContent';
import { JsonLd } from '../../components/seo/JsonLd';

const TITLE       = 'Word to PDF Converter Online Free | DOC to PDF';
const DESCRIPTION = 'Convert any Word document to a high-quality PDF in seconds with Freenoo. Our Word to PDF tool keeps your fonts, spacing, images, and page layout exactly as in the original DOC or DOCX file.';
const CANONICAL   = 'https://www.freenoo.com/word-to-pdf';

export const metadata: Metadata = {
  title: TITLE, description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
};

const faqs = [
  { q: 'Is Freenoo Word to PDF converter free?', a: 'Yes, 100% free with unlimited conversions and no watermarks.' },
  { q: 'Will my formatting change?', a: 'No, Freenoo preserves fonts, spacing, tables, and images exactly like your original Word file.' },
  { q: 'Can I convert DOCX to PDF on mobile?', a: 'Yes, works in any browser on Android, iOS, Windows, or Mac without software installation.' },
  { q: 'Does it support bulk Word to PDF conversion?', a: 'Convert multiple documents quickly by processing them one after another or opening multiple tabs.' },
  { q: 'Is my document safe?', a: 'Files are encrypted in transit and auto-deleted after about 1 hour—no storage, no third-party access.' },
  { q: 'Can I convert without Microsoft Word installed?', a: 'Yes, entirely online—no Office software required.' },
];

const relatedTools = [
  { href: '/pdf-to-word', label: 'PDF to Word', desc: 'reverse conversion' },
  { href: '/merge-pdf', label: 'Merge PDF', desc: 'combine multiple Word→PDF exports' },
  { href: '/compress-pdf', label: 'Compress PDF', desc: 'reduce PDF size after conversion' },
];

const body = [
  'Convert any Word document to a high-quality PDF in seconds with Freenoo. Our Word to PDF tool keeps your fonts, spacing, images, and page layout exactly as in the original DOC or DOCX file.',
  <strong>Why use Freenoo Word to PDF?</strong>,
  'One-click DOC/DOCX to PDF conversion',
  'Preserves tables, charts, bullet points, and merged cells',
  'Print-ready PDFs for professional sharing',
  '100% free—no signup, no watermarks',
  'Privacy-focused—files auto-delete after 1 hour',
  <strong>How to convert Word to PDF (3 steps):</strong>,
  'Upload your Word document (DOC or DOCX)',
  'Click "Convert to PDF"—instant processing',
  'Download print-ready PDF or share directly',
  <><strong>Perfect for:</strong> resumes, proposals, invoices, agreements, reports</>
];

export default function WordToPdfPage() {
  return (
    <>
      <JsonLd toolName="Word to PDF Converter" toolDescription={DESCRIPTION} toolUrl="/word-to-pdf" faqs={faqs} />
      <WordToPdfToolPage />
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <SeoContent heading="How to Convert Word to PDF" body={body} faqs={faqs} relatedTools={relatedTools} />
      </div>
    </>
  );
}