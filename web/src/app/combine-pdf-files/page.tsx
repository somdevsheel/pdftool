import type { Metadata } from 'next';
import MergePage from '../merge/ToolPage';
import { SeoContent } from '../../components/seo/SeoContent';
import { JsonLd } from '../../components/seo/JsonLd';

const TITLE       = 'Combine PDF Files Online Free — Fast PDF Joiner';
const DESCRIPTION = 'Combine multiple PDF files into one. Free online PDF joiner with drag-to-reorder. No account, no watermark.';
const CANONICAL   = 'https://freenoo.com/combine-pdf-files';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
};

const faqs = [
  {
    q: 'How do I combine PDF files without a watermark?',
    a: 'This tool adds no watermarks. Upload your files, arrange them in the order you want, click Merge, and download a clean combined PDF with no added marks or branding.',
  },
  {
    q: 'Can I combine PDFs of different page sizes?',
    a: 'Yes. PDFs with different page orientations and sizes (A4, Letter, Legal, etc.) can all be combined into a single document. Each page keeps its original dimensions.',
  },
  {
    q: 'Is there a cost to combine PDF files online?',
    a: 'This tool is completely free. There are no per-use fees, no subscription, and no account required.',
  },
];

const relatedTools = [
  { href: '/merge-pdf',         label: 'Merge PDF',        desc: 'Primary PDF merge tool' },
  { href: '/split-pdf',         label: 'Split PDF',        desc: 'Split combined PDFs into parts' },
  { href: '/compress-pdf',      label: 'Compress PDF',     desc: 'Reduce size after combining' },
  { href: '/merge-pdf-online',  label: 'Merge PDF Online', desc: 'Merge from any browser, any device' },
];

const body = [
  'Combining PDF files creates a single document from two or more separate PDFs. The most common use cases are assembling a multi-chapter report from separately saved sections, joining a signed signature page with a contract, or bundling invoices into a single submission.',
  'The process is simple: upload all the files you want to combine, then drag the cards to set the page order of the final document. Each card shows a thumbnail preview of the first page so you can confirm the order visually before combining.',
  'Unlike some tools that require a file-by-file upload process, this tool accepts multiple files in a single drop. You can upload up to 20 PDFs at once and reorder them freely before starting the combine operation.',
  'The output is a standard PDF with no watermarks, no restrictions, and no changes to the content or quality of the original pages. All files are processed on the server using qpdf and deleted within 60 minutes of the job completing.',
];

export default function CombinePdfFilesPage() {
  return (
    <>
      <JsonLd toolName="Combine PDF Files Online" toolDescription={DESCRIPTION} toolUrl="/combine-pdf-files" faqs={faqs} />
      <MergePage />
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <SeoContent
          heading="How to Combine PDF Files"
          body={body}
          faqs={faqs}
          relatedTools={relatedTools}
        />
      </div>
    </>
  );
}
