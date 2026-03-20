import type { Metadata } from 'next';
import PdfToWordToolPage from './ToolPage';
import { SeoContent } from '../../components/seo/SeoContent';
import { JsonLd } from '../../components/seo/JsonLd';

const TITLE       = 'PDF to Word Converter Online Free | DOC & DOCX';
const DESCRIPTION = 'Convert PDF to Word document online. Free PDF to DOC converter. Preserves formatting. No signup required.';
const CANONICAL   = 'https://freenoo.com/pdf-to-word';

export const metadata: Metadata = {
  title: TITLE, description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
};

const faqs = [
  { q: 'Does converting PDF to Word preserve formatting?', a: 'Layout preservation depends on the complexity of the PDF. Text-based PDFs convert with high fidelity. Scanned PDFs require OCR first.' },
  { q: 'Can I convert a scanned PDF to Word?', a: 'Scanned PDFs need OCR to extract text before conversion. Use the PDF OCR tool first, then convert the searchable PDF to Word.' },
  { q: 'What is the output format — DOC or DOCX?', a: 'Output is in DOCX format, compatible with Microsoft Word 2007 and later, Google Docs, LibreOffice, and all modern word processors.' },
];
const relatedTools = [
  { href: '/compress-pdf', label: 'Compress PDF', desc: 'Reduce PDF size before converting' },
  { href: '/pdf-ocr', label: 'PDF OCR', desc: 'Make scanned PDFs text-searchable first' },
  { href: '/merge-pdf', label: 'Merge PDF', desc: 'Combine PDFs before converting to Word' },
  { href: '/jpg-to-pdf', label: 'JPG to PDF', desc: 'Convert images to PDF, then to Word' },
];
const body = [
  'Converting a PDF to a Word document lets you edit, reformat, and extract content from a PDF that would otherwise be static. This is useful when you receive a PDF form, report, or contract and need to make changes to the text.',
  'PDF to Word conversion works best on text-based PDFs — documents originally created in a word processor or typesetting application.',
  'PDFs created by scanning physical documents contain images of text rather than text data. These require OCR before the text can be extracted. Use the PDF OCR tool on this site first.',
  'The output DOCX file can be opened in Microsoft Word, Google Docs, LibreOffice Writer, and any other modern word processor.',
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
