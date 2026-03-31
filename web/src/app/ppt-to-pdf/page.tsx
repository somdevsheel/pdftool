// import type { Metadata } from 'next';
// import PptToPdfToolPage from './ToolPage';
// import { SeoContent } from '../../components/seo/SeoContent';
// import { JsonLd } from '../../components/seo/JsonLd';

// const TITLE       = 'PowerPoint to PDF Converter Online Free | PPT to PDF';
// const DESCRIPTION = 'Convert PowerPoint presentations to PDF online. Free PPT and PPTX to PDF converter. No signup, no software needed.';
// const CANONICAL   = 'https://freenoo.com/ppt-to-pdf';

// export const metadata: Metadata = {
//   title: TITLE, description: DESCRIPTION,
//   alternates: { canonical: CANONICAL },
//   openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
// };

// const faqs = [
//   { q: 'How do I convert a PowerPoint file to PDF online?', a: 'Upload your PPT or PPTX file and it is converted to a PDF where each slide becomes a page.' },
//   { q: 'Does converting PPT to PDF preserve animations?', a: 'PDF is a static format. Each slide is captured at its final state — transitions and animations are frozen.' },
//   { q: 'Can I convert a Google Slides presentation to PDF?', a: 'Export your Google Slides as PPTX from File → Download → PowerPoint, then upload the PPTX file.' },
//   { q: 'What is the difference between PPT and PPTX?', a: 'PPT is the older binary format. PPTX is the modern XML-based format used by PowerPoint 2007 and later.' },
// ];
// const relatedTools = [
//   { href: '/compress-pdf', label: 'Compress PDF', desc: 'Reduce size of the converted presentation PDF' },
//   { href: '/merge-pdf', label: 'Merge PDF', desc: 'Combine multiple slide PDFs into one document' },
//   { href: '/word-to-pdf', label: 'Word to PDF', desc: 'Convert the accompanying report to PDF as well' },
//   { href: '/pdf-to-jpg', label: 'PDF to Image', desc: 'Extract individual slides as images' },
// ];
// const body = [
//   'Converting a PowerPoint presentation to PDF is the most reliable way to share slides with people who may not have PowerPoint installed, or to ensure the presentation displays identically on every device.',
//   'Each slide in the presentation becomes a single page in the PDF output. The conversion captures the final static state of each slide — background images, charts, text boxes, and embedded media are all preserved.',
//   'PPT and PPTX files are both supported. PPTX is the format used by modern versions of Microsoft PowerPoint, Google Slides (via export), LibreOffice Impress, and Apple Keynote (via export).',
//   "After converting, use the Compress PDF tool to reduce the file size if the presentation contains many high-resolution images.",
// ];

// export default function PptToPdfPage() {
//   return (
//     <>
//       <JsonLd toolName="PowerPoint to PDF Converter" toolDescription={DESCRIPTION} toolUrl="/ppt-to-pdf" faqs={faqs} />
//       <PptToPdfToolPage />
//       <div className="max-w-6xl mx-auto px-6 pb-16">
//         <SeoContent heading="How to Convert PowerPoint to PDF" body={body} faqs={faqs} relatedTools={relatedTools} />
//       </div>
//     </>
//   );
// }



import type { Metadata } from 'next';
import PptToPdfToolPage from './ToolPage';
import { SeoContent } from '../../components/seo/SeoContent';
import { JsonLd } from '../../components/seo/JsonLd';

const TITLE       = 'PowerPoint to PDF Converter Online Free | PPT to PDF';
const DESCRIPTION = 'Convert PowerPoint presentations to PDF online. Free PPT and PPTX to PDF converter. No signup, no software needed.';
const CANONICAL   = 'https://freenoo.com/ppt-to-pdf';

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