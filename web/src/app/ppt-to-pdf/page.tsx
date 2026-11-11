import type { Metadata } from 'next';
import PptToPdfToolPage from './ToolPage';
import { SeoContent } from '../../components/seo/SeoContent';
import { JsonLd } from '../../components/seo/JsonLd';

const TITLE       = 'PowerPoint to PDF Converter Online Free | PPT to PDF';
const DESCRIPTION = 'Convert PowerPoint presentations to PDF online. Free PPT and PPTX to PDF converter. No signup, no software needed.';
const CANONICAL   = 'https://www.freenoo.com/ppt-to-pdf';

export const metadata: Metadata = {
  title: TITLE, description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
};

const faqs = [
  { q: 'Is PPT to PDF conversion free?', a: 'Yes, 100% free with unlimited conversions and no watermarks.' },
  { q: 'Does it preserve slide formatting?', a: 'Yes, maintains fonts, colors, layouts, images, and charts accurately.' },
  { q: 'Can I convert PPTX to PDF on mobile?', a: 'Yes, works in any browser without PowerPoint installation.' },
  { q: 'Is my presentation secure?', a: 'Files are encrypted and auto-deleted after 1 hour—complete confidentiality.' },
  { q: 'Does it support animations?', a: 'Static slides are preserved; animations become static images in PDF format.' },
  { q: 'Can I convert Google Slides to PDF?', a: 'Download Google Slides as PPTX first, then upload to Freenoo for conversion.' },
];
const relatedTools = [
  { href: '/pdf-to-ppt', label: 'PDF to PPT', desc: 'Reverse conversion' },
  { href: '/merge-pdf', label: 'Merge PDF', desc: 'Combine multiple presentations' },
  { href: '/compress-pdf', label: 'Compress PDF', desc: 'Reduce output file size' },
];
const body = [
  'Convert PowerPoint presentations to professional PDFs with Freenoo—preserves all slides, layouts, and formatting perfectly.',
  <>
    <strong>Why use Freenoo PPT to PDF?</strong>
    <ul style={{ marginTop: 8, paddingLeft: 18, lineHeight: 2 }}>
      <li>Maintains slide layouts, fonts, and images</li>
      <li>Preserves charts, tables, and graphics</li>
      <li>Print-ready PDFs for sharing and archiving</li>
      <li>100% free with no watermarks or limits</li>
      <li>Works without PowerPoint installation</li>
    </ul>
  </>,
  <>
    <strong>How to convert PPT to PDF (3 steps):</strong>
    <ol style={{ marginTop: 8, paddingLeft: 18, lineHeight: 2 }}>
      <li>Upload your PowerPoint file (PPT or PPTX)</li>
      <li>Click &quot;Convert to PDF&quot;</li>
      <li>Download presentation PDF instantly</li>
    </ol>
  </>,
  'Perfect for: pitch decks, business presentations, lectures, portfolios.',
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