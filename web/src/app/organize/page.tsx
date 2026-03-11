import type { Metadata } from 'next';
import OrganizePage from './ToolPage';
import { SeoContent } from '../../components/seo/SeoContent';
import { JsonLd } from '../../components/seo/JsonLd';

const TITLE       = 'Organize PDF Pages Online Free — Rearrange & Sort';
const DESCRIPTION = 'Organize, rearrange, and sort pages in a PDF online. Drag and drop to reorder pages. Free, no signup required.';
const CANONICAL   = 'https://pdf.tools/organize-pages';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
};

const faqs = [
  {
    q: 'Can I rearrange pages in a PDF without software?',
    a: 'Yes. Upload your PDF and drag pages into any order in the browser. The reordered PDF is generated on the server and ready to download in seconds.',
  },
  {
    q: 'Can I delete pages while organizing?',
    a: 'Yes. While organizing, you can remove any pages you do not want in the output. Excluded pages are simply omitted from the downloaded file.',
  },
  {
    q: 'Does organizing pages change the file content?',
    a: 'Only the page order changes. All text, images, annotations, and embedded fonts within each page are preserved exactly as they were in the original.',
  },
  {
    q: 'Is there a limit on how many pages I can rearrange?',
    a: 'The tool handles PDFs of any length. For very large documents (500+ pages), the page thumbnail grid may take a few extra seconds to load.',
  },
];

const relatedTools = [
  { href: '/split-pdf',    label: 'Split PDF',    desc: 'Extract specific pages into a separate file' },
  { href: '/merge-pdf',    label: 'Merge PDF',    desc: 'Combine multiple PDFs then organize the pages' },
  { href: '/rotate-pdf',   label: 'Rotate PDF',   desc: 'Fix page orientation while organizing' },
  { href: '/compress-pdf', label: 'Compress PDF', desc: 'Reduce file size after reordering' },
];

const body = [
  'Organizing PDF pages lets you rearrange, reorder, and remove individual pages from a document without any desktop software. This is useful when combining scanned pages that were fed in the wrong order, restructuring chapters in a report, or removing blank or duplicate pages before sharing.',
  'The page organizer displays thumbnail previews of every page in your PDF. You drag and drop the thumbnails into the desired sequence and click to remove any pages you do not need. The final output PDF contains only the pages you kept, in the order you chose.',
  'This is especially useful after using the Merge PDF tool to combine documents from multiple sources. Merged files often have pages out of sequence or include cover pages and blanks that need to be removed. The organizer gives you full visual control over the final page order.',
  'All changes are non-destructive in the sense that the original file is never modified. A new PDF is generated from your selected arrangement. If you want to try a different order, simply re-upload and rearrange again.',
];

export default function OrganizePdfPage() {
  return (
    <>
      <JsonLd toolName="Organize PDF Pages" toolDescription={DESCRIPTION} toolUrl="/organize-pages" faqs={faqs} />
      <OrganizePage />
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <SeoContent heading="How to Organize PDF Pages" body={body} faqs={faqs} relatedTools={relatedTools} />
      </div>
    </>
  );
}