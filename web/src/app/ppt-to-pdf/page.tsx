import type { Metadata } from 'next';
import PptToPdfToolPage from './ToolPage';
import { SeoContent } from '../../components/seo/SeoContent';
import { JsonLd } from '../../components/seo/JsonLd';

const TITLE       = 'PowerPoint to PDF Converter Online Free | PPT to PDF';
const DESCRIPTION = 'Convert PowerPoint presentations to PDF online. Free PPT and PPTX to PDF converter. No signup, no software needed.';
const CANONICAL   = 'https://Freenoo/ppt-to-pdf';

export const metadata: Metadata = {
  title: TITLE, description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
};

const faqs = [
  { q: 'How do I convert a PowerPoint file to PDF online?', a: 'Upload your PPT or PPTX file and it is converted to a PDF where each slide becomes a page.' },
  { q: 'Does converting PPT to PDF preserve animations?', a: 'PDF is a static format. Each slide is captured at its final state — transitions and animations are frozen.' },
  { q: 'Can I convert a Google Slides presentation to PDF?', a: 'Export your Google Slides as PPTX from File → Download → PowerPoint, then upload the PPTX file.' },
  { q: 'What is the difference between PPT and PPTX?', a: 'PPT is the older binary format. PPTX is the modern XML-based format used by PowerPoint 2007 and later.' },
];
const relatedTools = [
  { href: '/compress-pdf', label: 'Compress PDF', desc: 'Reduce size of the converted presentation PDF' },
  { href: '/merge-pdf', label: 'Merge PDF', desc: 'Combine multiple slide PDFs into one document' },
  { href: '/word-to-pdf', label: 'Word to PDF', desc: 'Convert the accompanying report to PDF as well' },
  { href: '/pdf-to-jpg', label: 'PDF to JPG', desc: 'Extract individual slides as images' },
];
const body = [
  'Converting a PowerPoint presentation to PDF is the most reliable way to share slides with people who may not have PowerPoint installed, or to ensure the presentation displays identically on every device.',
  'Each slide in the presentation becomes a single page in the PDF output. The conversion captures the final static state of each slide — background images, charts, text boxes, and embedded media are all preserved.',
  'PPT and PPTX files are both supported. PPTX is the format used by modern versions of Microsoft PowerPoint, Google Slides (via export), LibreOffice Impress, and Apple Keynote (via export).',
  "After converting, use the Compress PDF tool to reduce the file size if the presentation contains many high-resolution images.",
];

export default function PptToPdfPage() {
  return (
    <>
      <JsonLd toolName="PowerPoint to PDF Converter" toolDescription={DESCRIPTION} toolUrl="/ppt-to-pdf" faqs={faqs} />
      <PptToPdfToolPage />
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <SeoContent heading="How to Convert PowerPoint to PDF" body={body} faqs={faqs} relatedTools={relatedTools} />
      </div>
    </>
  );
}
