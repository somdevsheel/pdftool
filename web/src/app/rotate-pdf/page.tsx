import type { Metadata } from 'next';
import RotatePage from '../rotate/ToolPage';
import { SeoContent } from '../../components/seo/SeoContent';
import { JsonLd } from '../../components/seo/JsonLd';

const TITLE       = 'Rotate PDF Pages Online Free | Fix Orientation';
const DESCRIPTION = 'Rotate PDF pages 90, 180, or 270 degrees online. Fix upside-down or sideways pages. Free, no signup needed.';
const CANONICAL   = 'https://pdf.tools/rotate-pdf';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
};

const faqs = [
  {
    q: 'Can I rotate only specific pages in a PDF?',
    a: 'Yes. Switch to "Specific pages" mode and enter the page numbers you want to rotate, separated by commas. All other pages will remain unchanged.',
  },
  {
    q: 'Will rotating a PDF reduce its quality?',
    a: 'No. Rotation is a metadata operation applied by qpdf without re-rendering the page content. Images and text are not re-encoded, so quality is fully preserved.',
  },
  {
    q: 'Can I rotate a PDF 90 degrees clockwise?',
    a: 'Yes. Select 90° to rotate clockwise. Select 270° to rotate counter-clockwise (equivalent to 90° left). Select 180° to flip the page upside down.',
  },
];

const relatedTools = [
  { href: '/merge-pdf',        label: 'Merge PDF',        desc: 'Combine rotated PDFs with other documents' },
  { href: '/split-pdf',        label: 'Split PDF',        desc: 'Extract pages after rotating' },
  { href: '/organize-pages',   label: 'Organize Pages',   desc: 'Drag, reorder and remove pages' },
  { href: '/compress-pdf',     label: 'Compress PDF',     desc: 'Reduce file size after rotating' },
];

const body = [
  'PDF rotation corrects the viewing orientation of pages that were scanned or saved in the wrong direction. Upside-down pages, sideways scans, and mixed-orientation documents are all common situations where rotating individual pages or the entire PDF is necessary before sharing or printing.',
  'This tool supports three rotation angles: 90 degrees clockwise, 180 degrees (flip), and 270 degrees clockwise (equivalent to 90 degrees counter-clockwise). You can apply the rotation to all pages at once or to specific page numbers by entering them as a comma-separated list.',
  'Rotation is applied using qpdf, which modifies the rotation metadata in each page dictionary without re-rendering any content. This means the pixel data of embedded images is not touched, preserving full resolution and quality. The operation is extremely fast regardless of the number of pages.',
  'After rotating, download your corrected PDF and verify the orientation is as expected. If you need to rotate different pages by different amounts, you can run the tool multiple times — once per rotation angle — targeting specific pages each time.',
];

export default function RotatePdfPage() {
  return (
    <>
      <JsonLd toolName="Rotate PDF Pages Online" toolDescription={DESCRIPTION} toolUrl="/rotate-pdf" faqs={faqs} />
      <RotatePage />
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <SeoContent heading="How to Rotate PDF Pages" body={body} faqs={faqs} relatedTools={relatedTools} />
      </div>
    </>
  );
}
