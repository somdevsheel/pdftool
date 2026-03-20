import type { Metadata } from 'next';
import ToolPage from './ToolPage';
import { SeoContent } from '../../components/seo/SeoContent';
import { JsonLd } from '../../components/seo/JsonLd';

const TITLE       = 'Insert Pages into PDF Online Free | Add PDF Pages';
const DESCRIPTION = 'Insert pages into an existing PDF online. Add blank pages or pages from another PDF. Free, no signup needed.';
const CANONICAL   = 'https://freenoo.com/insert';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
};

const faqs = [
  {
    q: 'How do I insert pages into a PDF?',
    a: 'Upload your PDF, choose the position where you want to insert, then either add a blank page or upload a second PDF to insert pages from. Download the updated file when done.',
  },
  {
    q: 'Can I insert pages from another PDF at a specific position?',
    a: 'Yes. Choose the page number after which the new pages should appear. The inserted pages slot in at that position and the remaining pages shift forward automatically.',
  },
  {
    q: 'Can I insert multiple blank pages at once?',
    a: 'Yes. Specify how many blank pages to add and where to insert them. Blank pages are useful for adding notes sections, separator pages, or placeholders.',
  },
  {
    q: 'Does inserting pages change the existing content?',
    a: 'No. The existing pages are unchanged. Only the page order is updated to accommodate the inserted pages at the chosen position.',
  },
];

const relatedTools = [
  { href: '/merge-pdf',      label: 'Merge PDF',      desc: 'Combine whole PDFs end-to-end' },
  { href: '/delete-pages',   label: 'Delete Pages',   desc: 'Remove pages you no longer need' },
  { href: '/organize-pages', label: 'Organize Pages', desc: 'Drag to reorder and remove pages' },
  { href: '/split-pdf',      label: 'Split PDF',      desc: 'Extract sections before inserting' },
];

const body = [
  'Inserting pages into a PDF lets you add content at any position within an existing document — without recreating the whole file. This is useful when you need to add a cover page, slip in an appendix, include a signature page, or add separator pages between sections.',
  'Two insertion modes are available. You can insert one or more blank pages at any position, which is useful for adding notes or placeholder dividers. Alternatively, you can upload a second PDF and insert all or selected pages from it into the target document at the position you choose.',
  'The inserted pages appear in the output at exactly the position specified. All pages after the insertion point shift forward, and their content is completely unaffected. The resulting PDF can be downloaded immediately and is fully compatible with all PDF readers.',
  'For more complex restructuring — such as moving pages around, deleting some, and inserting others — use the Organize Pages tool, which provides a full visual editor for the complete page set in one interface.',
];

export default function Page() {
  return (
    <>
      <JsonLd toolName="Insert Pages into PDF" toolDescription={DESCRIPTION} toolUrl="/insert" faqs={faqs} />
      <ToolPage />
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <SeoContent heading="How to Insert Pages into a PDF" body={body} faqs={faqs} relatedTools={relatedTools} />
      </div>
    </>
  );
}