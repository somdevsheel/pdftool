import type { Metadata } from 'next';
import DeletePagesPage from './ToolPage';
import { SeoContent } from '../../components/seo/SeoContent';
import { JsonLd } from '../../components/seo/JsonLd';

const TITLE       = 'Delete PDF Pages Online Free — Remove Pages Instantly';
const DESCRIPTION = 'Delete specific pages from a PDF online. Click thumbnails to select pages to remove. Free, no account needed.';
const CANONICAL   = 'https://freenoo.com/delete-pages';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
};

const faqs = [
  { q: 'How do I delete pages from a PDF without Adobe?', a: 'Upload your PDF, click the thumbnails of pages you want to remove (they will be highlighted), then click the delete button. The output PDF contains all remaining pages.' },
  { q: 'Can I delete multiple pages at once?', a: 'Yes. Click as many page thumbnails as you want to mark for deletion. Use the "All" and "Invert" buttons to select large numbers of pages quickly.' },
  { q: 'Can I undo a page deletion?', a: 'Changes are not applied until you click the delete button, so you can deselect pages freely before confirming. Once you have downloaded the output, re-run the tool on the original file to try again.' },
];

const relatedTools = [
  { href: '/organize-pages', label: 'Organize Pages', desc: 'Reorder and remove pages together' },
  { href: '/extract-pages',  label: 'Extract Pages',  desc: 'Keep specific pages instead of removing' },
  { href: '/split-pdf',      label: 'Split PDF',      desc: 'Split PDF into individual pages' },
  { href: '/compress-pdf',   label: 'Compress PDF',   desc: 'Reduce size after deleting pages' },
];

const body = [
  'Deleting pages from a PDF is necessary when a document contains cover pages you do not need, blank pages from scanning, confidential sections that should not be shared, or boilerplate appendices that are not relevant to the recipient.',
  'This tool shows every page as a clickable thumbnail. Clicking a thumbnail marks it for deletion — marked pages appear dimmed so you can see exactly what will be removed before confirming. The toolbar provides Select All, Select None, and Invert Selection shortcuts for bulk operations.',
  'Deletion is applied server-side using qpdf, which rebuilds the PDF with only the pages you chose to keep. The resulting file has no gaps in page numbering — pages are renumbered sequentially from 1 in the output.',
  'The original uploaded file is never modified. If you delete pages by mistake, re-upload the original and start again. Uploaded files are automatically deleted from our servers after 60 minutes.',
];

export default function DeletePagesRoute() {
  return (
    <>
      <JsonLd toolName="Delete PDF Pages Online" toolDescription={DESCRIPTION} toolUrl="/delete-pages" faqs={faqs} />
      <DeletePagesPage />
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <SeoContent heading="How to Delete Pages from a PDF" body={body} faqs={faqs} relatedTools={relatedTools} />
      </div>
    </>
  );
}
