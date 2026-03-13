import type { Metadata } from 'next';
import WordToPdfToolPage from './ToolPage';
import { SeoContent } from '../../components/seo/SeoContent';
import { JsonLd } from '../../components/seo/JsonLd';

const TITLE       = 'Word to PDF Converter Online Free | DOC to PDF';
const DESCRIPTION = 'Convert Word documents to PDF online. Free DOC and DOCX to PDF converter. Preserves formatting, no signup.';
const CANONICAL   = 'https://Freenoo/word-to-pdf';

export const metadata: Metadata = {
  title: TITLE, description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
};

const faqs = [
  { q: 'Can I convert a DOCX file to PDF online for free?', a: 'Yes. Upload your DOC or DOCX file and it is converted to a standard PDF on the server. No Microsoft Word installation is required.' },
  { q: 'Does Word to PDF conversion preserve formatting?', a: 'Fonts, tables, images, and page layout are preserved with high fidelity for standard documents.' },
  { q: 'What is the difference between DOC and DOCX?', a: 'DOC is the older Microsoft Word binary format. DOCX is the modern XML-based format. Both are supported.' },
  { q: 'Will my Word document look the same as a PDF?', a: 'PDF output matches the printed appearance of the Word document — identical on any device and any PDF viewer.' },
];
const relatedTools = [
  { href: '/pdf-to-word', label: 'PDF to Word', desc: 'Convert PDF back to an editable Word document' },
  { href: '/compress-pdf', label: 'Compress PDF', desc: 'Reduce size of your converted PDF' },
  { href: '/merge-pdf', label: 'Merge PDF', desc: 'Combine the converted PDF with others' },
  { href: '/ppt-to-pdf', label: 'PPT to PDF', desc: 'Convert PowerPoint to PDF as well' },
];
const body = [
  'Converting a Word document to PDF creates a fixed-layout version that looks identical on every device and operating system. This is the standard format for sharing final documents, submitting files to government portals, sending contracts, and creating print-ready files.',
  'The conversion process renders the Word document exactly as it appears when printed from Microsoft Word: fonts, margins, tables, images, headers, footers, and page numbers are all preserved.',
  'DOC and DOCX files are both supported. DOCX is the modern format used by Word 2007 and later, Google Docs exports, LibreOffice, and Apple Pages.',
  'After conversion, you can combine the PDF with other files using the Merge PDF tool, reduce its size with the Compress PDF tool, or add a password using the Protect PDF tool.',
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
