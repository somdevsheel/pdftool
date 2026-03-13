import type { Metadata } from 'next';
import OrganizePage from '../organize/ToolPage';
import { SeoContent } from '../../components/seo/SeoContent';
import { JsonLd } from '../../components/seo/JsonLd';

const TITLE       = 'Organize PDF Pages Online — Reorder & Delete Free';
const DESCRIPTION = 'Organize PDF pages online. Drag to reorder, click to delete. Visual page manager. Free, no account needed.';
const CANONICAL   = 'https://Freenoo/organize-pages';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
};

const faqs = [
  { q: 'Can I reorder pages in a PDF online?', a: 'Yes. After uploading your PDF, the page organizer shows all pages as thumbnails. Drag any thumbnail to a new position to reorder it, then save the reorganised PDF.' },
  { q: 'How do I delete a page from a PDF online?', a: 'In the organizer, click the × button on any page thumbnail to remove it from the output. You can remove multiple pages before saving.' },
  { q: 'Does organizing pages change the original PDF?', a: 'No. The original file is not modified. Organizing creates a new PDF file with your chosen page order and selection.' },
];

const relatedTools = [
  { href: '/delete-pages',  label: 'Delete Pages',  desc: 'Remove specific pages by clicking' },
  { href: '/reorder-pages', label: 'Reorder Pages', desc: 'Drag-only page reordering' },
  { href: '/extract-pages', label: 'Extract Pages', desc: 'Save selected pages as a new PDF' },
  { href: '/split-pdf',     label: 'Split PDF',     desc: 'Split entire PDF into individual pages' },
];

const body = [
  'Organizing PDF pages covers three overlapping operations: reordering pages into a different sequence, removing unwanted pages, and saving only the pages that matter. This tool combines all three into a single visual interface.',
  'After uploading, all pages are rendered as thumbnail previews. You can drag any thumbnail to move it to a new position in the document, or click the × button on a thumbnail to exclude it from the output. The number badge on each thumbnail updates in real time to show the new output position.',
  'This approach is more intuitive than entering page numbers in a text field, especially for documents where you need to see the content of each page to decide what to keep. The visual interface makes it easy to spot duplicate pages, blank pages, or pages that belong in a different order.',
  'Once satisfied with the arrangement, click Save to process the document. The output PDF will contain exactly the pages you selected, in the order shown. All processing uses qpdf on the server with no quality loss.',
];

export default function OrganizePagesPage() {
  return (
    <>
      <JsonLd toolName="Organize PDF Pages Online" toolDescription={DESCRIPTION} toolUrl="/organize-pages" faqs={faqs} />
      <OrganizePage />
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <SeoContent heading="How to Organize PDF Pages" body={body} faqs={faqs} relatedTools={relatedTools} />
      </div>
    </>
  );
}
