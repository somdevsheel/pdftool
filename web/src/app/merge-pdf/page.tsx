import type { Metadata } from 'next';
import MergePage from '../merge/ToolPage';
import { SeoContent } from '../../components/seo/SeoContent';
import { JsonLd } from '../../components/seo/JsonLd';

const TITLE       = 'Merge PDF Files Online Free - Combine PDFs | Freenoo';
const DESCRIPTION = 'Merge multiple PDF files into one in seconds. Free PDF combiner with drag-drop reordering, no watermarks, unlimited pages.';
const CANONICAL   = 'https://freenoo.com.com/merge-pdf';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: CANONICAL,
    type: 'website',
  },
};

const faqs = [
  {
    q: 'How do I merge PDF files online for free?',
    a: 'Upload two or more PDF files using the tool above, drag the cards to set the order you want, then click "Merge PDFs". Your combined file will be ready to download in seconds.',
  },
  {
    q: 'Is there a file size limit for merging PDFs?',
    a: 'There is no hard file size limit. Very large files may take longer to process. All files are automatically deleted from our servers after 60 minutes.',
  },
  {
    q: 'Can I merge more than two PDFs at once?',
    a: 'Yes. You can upload up to 20 PDF files in a single merge operation. Use the drag-to-reorder feature to set the exact page sequence in your output.',
  },
  {
    q: 'Is my data safe when I merge PDFs online?',
    a: 'Files are processed on a secure server and deleted automatically after 60 minutes. No account is required and no data is stored beyond that window.',
  },
];

const relatedTools = [
  { href: '/split-pdf',    label: 'Split PDF',    desc: 'Separate a PDF into individual pages or ranges' },
  { href: '/compress-pdf', label: 'Compress PDF', desc: 'Reduce PDF file size after merging' },
  { href: '/rotate-pdf',   label: 'Rotate PDF',   desc: 'Fix page orientation before or after merging' },
  { href: '/edit-pdf',     label: 'Edit PDF',     desc: 'Add text and annotations to your merged PDF' },
];

const body = [
  'Merging PDF files combines two or more separate documents into a single, continuous PDF. This is useful when you have scanned pages saved as individual files, when you want to combine a report with its appendices, or when you need to consolidate invoices and contracts for a single transaction.',
  'This tool uses qpdf, an open-source command-line PDF processor, to perform the merge entirely on the server. No browser plugin or desktop application is required. The original files are not modified — a new file is created from the pages you provide.',
  'To control the final page order, drag the file cards left or right before starting the merge. Each card shows a live thumbnail of the first page so you can confirm the correct order at a glance. You can also click any thumbnail to open a full-page preview with zoom controls.',
  'After downloading your merged PDF, consider running it through the Compress PDF tool if the combined file size is larger than needed for sharing or email attachment. All tools on this site are free, anonymous, and require no account.',
];

export default function MergePdfPage() {
  return (
    <>
      <JsonLd
        toolName="Merge PDF Files Online"
        toolDescription={DESCRIPTION}
        toolUrl="/merge-pdf"
        faqs={faqs}
      />
      <MergePage />
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <SeoContent
          heading="How to Merge PDF Files Online"
          body={body}
          faqs={faqs}
          relatedTools={relatedTools}
        />
      </div>
    </>
  );
}
