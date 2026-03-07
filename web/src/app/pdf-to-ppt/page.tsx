import type { Metadata } from 'next';
import PdfToPptToolPage from './ToolPage';
import { JsonLd } from '../../components/seo/JsonLd';

const TITLE       = 'PDF to PowerPoint Converter Online Free | PDF to PPT';
const DESCRIPTION = 'Convert PDF files to PowerPoint presentations online. Free PDF to PPTX converter, no account or software needed.';
const CANONICAL   = 'https://pdf.tools/pdf-to-ppt';

export const metadata: Metadata = {
  title: TITLE, description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
};

const faqs = [
  { q: 'What does PDF to PPT conversion produce?', a: 'Each PDF page is converted to a slide in a PPTX file using LibreOffice. Text, images, and layout are carried over as editable PowerPoint elements.' },
  { q: 'Is the output editable in PowerPoint?', a: 'Yes. The output is a standard PPTX file that opens in Microsoft PowerPoint, Google Slides, and LibreOffice Impress.' },
];

export default function PdfToPptPage() {
  return (
    <>
      <JsonLd toolName="PDF to PowerPoint Converter" toolDescription={DESCRIPTION} toolUrl="/pdf-to-ppt" faqs={faqs} />
      <PdfToPptToolPage />
    </>
  );
}
