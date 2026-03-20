import type { Metadata } from 'next';
import SplitPage from '../split/ToolPage';
import { SeoContent } from '../../components/seo/SeoContent';
import { JsonLd } from '../../components/seo/JsonLd';

const TITLE       = 'Split PDF Online Free — No Software Required';
const DESCRIPTION = 'Split PDF files online without any software. Extract pages or split every page into separate PDFs. Free, instant.';
const CANONICAL   = 'https://freenoo.com/split-pdf-online';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
};

const faqs = [
  {
    q: 'Can I split a PDF online for free?',
    a: 'Yes. Upload your PDF, choose whether to split every page or extract a specific range, and download the result. No payment, no account, and no software installation required.',
  },
  {
    q: 'What browsers support this online PDF splitter?',
    a: 'The tool works in all modern browsers: Chrome, Firefox, Safari, Edge, and Opera — on desktop and mobile. No browser extension or plugin is needed.',
  },
  {
    q: 'How long does splitting a PDF online take?',
    a: 'For most documents, splitting completes in under 10 seconds. Very large PDFs (100+ pages at high resolution) may take up to 30 seconds.',
  },
];

const relatedTools = [
  { href: '/split-pdf',     label: 'Split PDF',     desc: 'Primary PDF split tool' },
  { href: '/merge-pdf',     label: 'Merge PDF',     desc: 'Rejoin split sections' },
  { href: '/compress-pdf',  label: 'Compress PDF',  desc: 'Compress individual split pages' },
  { href: '/extract-pages', label: 'Extract Pages', desc: 'Visually select pages to extract' },
];

const body = [
  'Splitting a PDF online means dividing it into smaller files directly in your browser, without downloading or installing any application. The file is uploaded to a secure server where qpdf processes it, and the result is ready to download within seconds.',
  'There are two common splitting needs: extracting a specific page range from a large document, or splitting every single page into its own PDF file. Both are supported. Page ranges use a simple comma-and-hyphen notation — for example, "1-3, 7, 10-12" — and there is no limit on the number of pages you can extract.',
  'When splitting all pages, the output is a ZIP file containing individually named PDFs (page-1.pdf, page-2.pdf, and so on). This is useful for batch processing workflows where each page needs to be handled separately.',
  'Splitting online is particularly convenient when you are on a shared device, a managed computer, or a mobile device where installing applications is not an option. The interface is fully responsive and works on phones and tablets.',
];

export default function SplitPdfOnlinePage() {
  return (
    <>
      <JsonLd toolName="Split PDF Online Free" toolDescription={DESCRIPTION} toolUrl="/split-pdf-online" faqs={faqs} />
      <SplitPage />
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <SeoContent
          heading="Split PDF Online — No Software Needed"
          body={body}
          faqs={faqs}
          relatedTools={relatedTools}
        />
      </div>
    </>
  );
}
