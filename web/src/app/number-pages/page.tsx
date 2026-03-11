import type { Metadata } from 'next';
import ToolPage from './ToolPage';
import { SeoContent } from '../../components/seo/SeoContent';
import { JsonLd } from '../../components/seo/JsonLd';

const TITLE       = 'Add Page Numbers to PDF Online Free';
const DESCRIPTION = 'Add page numbers to a PDF document online. Choose position and starting number. Free, no account required.';
const CANONICAL   = 'https://pdf.tools/number-pages';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
};

const faqs = [
  {
    q: 'Can I choose where the page numbers appear?',
    a: 'Yes. Page numbers can be placed at the top or bottom of the page, and aligned to the left, centre, or right. Common positions include bottom-centre for reports and bottom-right for legal documents.',
  },
  {
    q: 'Can I start numbering from a page other than 1?',
    a: 'Yes. Set any starting number you need. For example, if the document is chapter 3 of a larger work and pages should start at 47, enter 47 as the starting number.',
  },
  {
    q: 'Can I skip the first page (cover page)?',
    a: 'Yes. You can specify which page to begin numbering from, allowing you to exclude a cover page or title page from the page count.',
  },
  {
    q: 'What font and size are used for the page numbers?',
    a: 'The default is a clean, standard serif or sans-serif font at a size proportional to the page. Custom font and size options are available in the tool settings.',
  },
];

const relatedTools = [
  { href: '/merge-pdf',      label: 'Merge PDF',      desc: 'Combine documents before numbering pages' },
  { href: '/split-pdf',      label: 'Split PDF',      desc: 'Split after numbering to distribute sections' },
  { href: '/organize-pages', label: 'Organize Pages', desc: 'Reorder pages before adding numbers' },
  { href: '/compress-pdf',   label: 'Compress PDF',   desc: 'Reduce size of the numbered document' },
];

const body = [
  'Adding page numbers to a PDF makes long documents easier to navigate and reference. Page numbers are essential for professional reports, academic papers, legal briefs, manuals, and any multi-page document that will be read, printed, or cited by section.',
  'The page numbering tool stamps numbers onto each page as a permanent element in the PDF. You can choose the position — header or footer, left, centre, or right — and customise the starting number. This is useful for documents that form part of a larger set where continuous numbering across files is required.',
  'For documents with a cover page, title page, or table of contents that should not be numbered, you can set the tool to begin numbering from a specific page. The skipped pages are included in the output but contain no page number stamp.',
  'Page numbers are added as real text elements in the PDF rather than as image overlays. This means they remain selectable, searchable, and render sharply at any zoom level. The output file is fully compatible with all standard PDF readers.',
];

export default function NumberPagesPage() {
  return (
    <>
      <JsonLd toolName="Add Page Numbers to PDF" toolDescription={DESCRIPTION} toolUrl="/number-pages" faqs={faqs} />
      <ToolPage />
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <SeoContent heading="How to Add Page Numbers to a PDF" body={body} faqs={faqs} relatedTools={relatedTools} />
      </div>
    </>
  );
}