import type { Metadata } from 'next';
import ExtractPage from './ToolPage';
import { SeoContent } from '../../components/seo/SeoContent';
import { JsonLd } from '../../components/seo/JsonLd';

const TITLE       = 'Extract PDF Pages Online Free — Save Selected Pages';
const DESCRIPTION = 'Extract specific pages from a PDF online. Click to select, then save as a new PDF. Free, no signup required.';
const CANONICAL   = 'https://pdf.tools/extract-pages';

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  alternates: { canonical: CANONICAL },
};

const faqs = [
  { q: 'How do I extract pages from a PDF?', a: 'Upload your PDF, click the page thumbnails you want to keep (they become highlighted), then click Extract. A new PDF containing only the selected pages is ready to download.' },
  { q: 'What is the difference between extract and split?', a: 'Extract lets you visually select specific pages to save as a new PDF. Split can separate every page automatically or extract a page range using a text notation like "1-3, 7".' },
  { q: 'Can I extract non-consecutive pages?', a: 'Yes. You can select any combination of pages in any order using the thumbnail grid. The output PDF will contain the selected pages in their original document order.' },
];

const relatedTools = [
  { href: '/split-pdf',      label: 'Split PDF',      desc: 'Extract by page range notation' },
  { href: '/delete-pages',   label: 'Delete Pages',   desc: 'Remove pages instead of keeping them' },
  { href: '/organize-pages', label: 'Organize Pages', desc: 'Reorder and remove in one step' },
  { href: '/compress-pdf',   label: 'Compress PDF',   desc: 'Compress the extracted pages' },
];

const body = [
  'Extracting pages from a PDF means saving a subset of pages from a larger document as a standalone PDF. This is useful when you need to share a single chapter from a report, isolate a specific invoice from a batch, or save a page range for separate processing.',
  'The visual thumbnail interface makes it easy to identify exactly which pages to extract. Each page is rendered as a small preview so you can read the content before deciding. Click a thumbnail to select it; click again to deselect. The selection count is shown in real time.',
  'The "All", "None", and "Invert" toolbar buttons help with bulk selection. For example, to extract every page except the first and last, click "All", then deselect page 1 and the final page.',
  'The output PDF contains the selected pages in ascending numerical order, regardless of the order you clicked them. Pages are renumbered from 1 in the output. All processing uses qpdf and no quality loss occurs during extraction.',
];

export default function Page() {
  return (
    <>
      <JsonLd toolName="Extract PDF Pages Online" toolDescription={DESCRIPTION} toolUrl="/extract-pages" faqs={faqs} />
      <ExtractPage />
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <SeoContent heading="How to Extract Pages from a PDF" body={body} faqs={faqs} relatedTools={relatedTools} />
      </div>
    </>
  );
}