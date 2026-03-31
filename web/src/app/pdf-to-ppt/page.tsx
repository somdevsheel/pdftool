import type { Metadata } from 'next';
import PdfToPptToolPage from './ToolPage';
import { SeoContent } from '../../components/seo/SeoContent';
import { JsonLd } from '../../components/seo/JsonLd';

const TITLE       = 'PDF to PowerPoint Converter Online Free | PDF to PPT';
const DESCRIPTION = 'Convert PDF files to PowerPoint presentations online. Free PDF to PPTX converter, no account or software needed.';
const CANONICAL   = 'https://freenoo.com/pdf-to-ppt';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
};

const faqs = [
  { q: 'What does PDF to PPT conversion produce?', a: 'Each PDF page is converted to a slide in a PPTX file using LibreOffice. Text, images, and layout are carried over as editable PowerPoint elements.' },
  { q: 'Is the output editable in PowerPoint?', a: 'Yes. The output is a standard PPTX file that opens in Microsoft PowerPoint, Google Slides, and LibreOffice Impress.' },
  { q: 'Can I convert a scanned PDF to PowerPoint?', a: 'Scanned PDFs need to be processed with the PDF OCR tool first to extract a text layer. After OCR, the searchable PDF can be converted to a PPTX file with editable text.' },
  { q: 'Does converting PDF to PPT preserve animations?', a: 'PDF is a static format and does not store animations. Each slide is captured at its final state. Transitions and animated elements cannot be recovered from a PDF.' },
];

const relatedTools = [
  { href: '/ppt-to-pdf',   label: 'PPT to PDF',   desc: 'Convert PowerPoint presentations back to PDF' },
  { href: '/pdf-ocr',      label: 'PDF OCR',       desc: 'Make scanned PDFs searchable before converting' },
  { href: '/compress-pdf', label: 'Compress PDF',  desc: 'Reduce PDF size before extracting slides' },
  { href: '/pdf-to-jpg',   label: 'PDF to Image',    desc: 'Export PDF pages as images for presentations' },
];

const body = [
  'Converting a PDF to PowerPoint recreates each page of the document as an editable slide in a PPTX file. This is useful when you receive a presentation as a PDF and need to update the content, re-brand the slides, or repurpose sections for a new deck.',
  'The conversion uses LibreOffice to analyse each PDF page and identify text blocks, images, and layout regions. These are placed as individual objects on the corresponding PowerPoint slide, allowing you to click, edit, move, and resize each element independently in PowerPoint.',
  'PDFs created from presentations — by exporting from PowerPoint, Google Slides, or Keynote — convert with the highest fidelity because the page structure closely mirrors the original slide layout. PDFs created from documents or reports may require more cleanup after conversion since their layouts were not originally designed as slides.',
  'Once converted, open the PPTX file in Microsoft PowerPoint, Google Slides, LibreOffice Impress, or Apple Keynote. Apply your brand theme, update text, swap images, and add animations before presenting or exporting. For large PDFs, consider splitting the file first and converting only the sections you need.',
];

export default function PdfToPptPage() {
  return (
    <>
      <JsonLd toolName="PDF to PowerPoint Converter" toolDescription={DESCRIPTION} toolUrl="/pdf-to-ppt" faqs={faqs} />
      <PdfToPptToolPage />
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <SeoContent heading="How to Convert PDF to PowerPoint" body={body} faqs={faqs} relatedTools={relatedTools} />
      </div>
    </>
  );
}
