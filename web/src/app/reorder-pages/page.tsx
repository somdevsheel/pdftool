import type { Metadata } from 'next';
import ReorderPage from '../reorder/ToolPage';
import { SeoContent } from '../../components/seo/SeoContent';
import { JsonLd } from '../../components/seo/JsonLd';

const TITLE       = 'Reorder PDF Pages Online Free — Drag to Sort';
const DESCRIPTION = 'Reorder pages in a PDF by dragging thumbnails. Free online PDF page sorter. No account or software needed.';
const CANONICAL   = 'https://freenoo.com/reorder-pages';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
};

const faqs = [
  { q: 'How do I reorder pages in a PDF?', a: 'Upload your PDF, then drag the page thumbnails into the order you want. The number badge on each thumbnail updates to show the new position. Click Save to create the reordered PDF.' },
  { q: 'Can I sort PDF pages alphabetically or numerically?', a: 'Manual drag-and-drop reordering is supported. Automatic sorting by page content is not available — use the drag interface to arrange pages in the order you need.' },
  { q: 'Does reordering pages affect content quality?', a: 'No. Reordering is a structural operation that rearranges page references without re-rendering content. Image quality, fonts, and layout are completely preserved.' },
];

const relatedTools = [
  { href: '/organize-pages', label: 'Organize Pages', desc: 'Reorder and delete pages together' },
  { href: '/delete-pages',   label: 'Delete Pages',   desc: 'Remove unwanted pages' },
  { href: '/merge-pdf',      label: 'Merge PDF',      desc: 'Combine multiple PDFs into one' },
  { href: '/split-pdf',      label: 'Split PDF',      desc: 'Split into individual pages first' },
];

const body = [
  'Reordering PDF pages lets you change the sequence of pages in a document without modifying the actual content. This is needed when pages were scanned out of order, when a document structure needs to be reorganised, or when you need to move a concluding section to a different position.',
  'The drag-and-drop interface renders all pages as thumbnail previews. Drag any thumbnail to its new position — the other thumbnails shift automatically to fill the space. The numbered badge on each thumbnail updates in real time to reflect the new output order.',
  'Reordering is non-destructive in the sense that the original uploaded file is never changed. The operation creates a new PDF using qpdf with the specified page sequence. If the result is not quite right, upload the original again and try a different order.',
  'For workflows that combine reordering with page deletion, use the Organize Pages tool instead, which provides both drag-to-reorder and individual page removal in one interface.',
];

export default function ReorderPagesRoute() {
  return (
    <>
      <JsonLd toolName="Reorder PDF Pages Online" toolDescription={DESCRIPTION} toolUrl="/reorder-pages" faqs={faqs} />
      <ReorderPage />
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <SeoContent heading="How to Reorder PDF Pages" body={body} faqs={faqs} relatedTools={relatedTools} />
      </div>
    </>
  );
}
