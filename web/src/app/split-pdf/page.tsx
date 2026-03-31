// import type { Metadata } from 'next';
// import SplitPage from '../split/ToolPage';
// import { SeoContent } from '../../components/seo/SeoContent';
// import { JsonLd } from '../../components/seo/JsonLd';

// const TITLE       = 'Split PDF Online Free — Extract Pages Instantly';
// const DESCRIPTION = 'Split a PDF into separate pages or extract a page range. Free online PDF splitter, no software needed.';
// const CANONICAL   = 'https://freenoo.com/split-pdf';

// export const metadata: Metadata = {
//   title: TITLE,
//   description: DESCRIPTION,
//   alternates: { canonical: CANONICAL },
//   openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
// };

// const faqs = [
//   {
//     q: 'Can I split a PDF into individual pages?',
//     a: 'Yes. Choose "Split all pages" mode and every page in your PDF becomes a separate file. The individual PDFs are bundled into a single ZIP file for download.',
//   },
//   {
//     q: 'How do I extract a specific page range from a PDF?',
//     a: 'Choose "Extract range" mode and enter your page numbers separated by commas, for example "1-3, 5, 8-10". The tool will create a new PDF containing only those pages.',
//   },
//   {
//     q: 'What format are the split files downloaded in?',
//     a: 'When splitting all pages, you receive a ZIP archive containing individual PDF files named page-1.pdf, page-2.pdf, and so on. When extracting a range, you receive a single PDF file.',
//   },
//   {
//     q: 'Does splitting a PDF affect its quality?',
//     a: 'No. The tool uses qpdf to extract pages without re-encoding or re-rendering any content. Text, images, and formatting are preserved exactly as in the original.',
//   },
// ];

// const relatedTools = [
//   { href: '/merge-pdf',      label: 'Merge PDF',      desc: 'Combine the split pages back into one file' },
//   { href: '/compress-pdf',   label: 'Compress PDF',   desc: 'Reduce size of individual split pages' },
//   { href: '/rotate-pdf',     label: 'Rotate PDF',     desc: 'Fix orientation of extracted pages' },
//   { href: '/extract-pages',  label: 'Extract Pages',  desc: 'Visually select pages to extract' },
// ];

// const body = [
//   'Splitting a PDF means dividing one PDF file into multiple smaller files. This is useful when you receive a large combined document and only need one section, when you want to share individual chapters separately, or when you need to isolate a specific page for editing or reuse.',
//   'This tool offers two split modes. "Split all pages" creates one PDF per page — useful for processing each page individually or creating an archive of scanned document pages. "Extract range" lets you specify exactly which pages to keep, giving you precise control without discarding useful content.',
//   'Page ranges follow a simple format: individual page numbers separated by commas (e.g. 1, 4, 7), continuous ranges written with a hyphen (e.g. 2-5), or combinations of both (e.g. 1, 3-6, 9). Pages are always included in ascending order in the output.',
//   'All splitting is performed using qpdf on the server. The original file is not modified. Processed files are automatically deleted from the server after 60 minutes. No account, email address, or payment is required.',
// ];

// export default function SplitPdfPage() {
//   return (
//     <>
//       <JsonLd toolName="Split PDF Online" toolDescription={DESCRIPTION} toolUrl="/split-pdf" faqs={faqs} />
//       <SplitPage />
//       <div className="max-w-6xl mx-auto px-6 pb-16">
//         <SeoContent heading="How to Split a PDF Online" body={body} faqs={faqs} relatedTools={relatedTools} />
//       </div>
//     </>
//   );
// }




import type { Metadata } from 'next';
import SplitPage from '../split/ToolPage';
import { SeoContent } from '../../components/seo/SeoContent';
import { JsonLd } from '../../components/seo/JsonLd';

const TITLE       = 'Split PDF Online Free — Extract Pages Instantly';
const DESCRIPTION = 'Split a PDF into separate pages or extract a page range. Free online PDF splitter, no software needed.';
const CANONICAL   = 'https://freenoo.com/split-pdf';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
};

const faqs = [
  { q: 'Is PDF splitter free?', a: 'Yes, completely free with no registration and no watermarks.' },
  { q: 'Can I extract specific pages?', a: 'Yes, choose individual pages or page ranges to extract.' },
  { q: 'Does it maintain quality?', a: 'Yes, split files maintain original PDF quality.' },
  { q: 'Is my data secure?', a: 'Files are encrypted and auto-deleted after 1 hour—complete privacy.' },
  { q: 'Can I split password-protected PDFs?', a: 'Remove password protection first, then split the document.' },
  { q: 'Does it work on mobile?', a: 'Yes, works in any browser without app installation.' },
];

const relatedTools = [
  { href: '/merge-pdf',      label: 'Merge PDF',      desc: 'Combine split files' },
  { href: '/pdf-to-jpg',     label: 'PDF to JPG',     desc: 'Extract pages as images' },
  { href: '/organize-pages', label: 'Organize Pages', desc: 'Rearrange before splitting' },
];

const body = [
  'Break large PDFs into smaller files or extract specific pages with Freenoo\'s Split PDF tool. Perfect for separating chapters, extracting single pages, or dividing reports.',
  <>
    <strong>Why use Freenoo Split PDF?</strong>
    <ul style={{ marginTop: 8, paddingLeft: 18, lineHeight: 2 }}>
      <li>Split by page range or extract individual pages</li>
      <li>Create multiple separate PDF files from one document</li>
      <li>Maintains original quality</li>
      <li>100% free with no watermarks or limits</li>
      <li>Privacy-focused—files auto-delete after processing</li>
    </ul>
  </>,
  <>
    <strong>How to split PDF (3 steps):</strong>
    <ol style={{ marginTop: 8, paddingLeft: 18, lineHeight: 2 }}>
      <li>Upload your PDF file</li>
      <li>Choose split mode: by page range, extract pages, or split all</li>
      <li>Click &quot;Split PDF&quot;—download separate files</li>
    </ol>
  </>,
  'Perfect for: extracting chapters, separating invoices, dividing long documents.',
];

export default function SplitPdfPage() {
  return (
    <>
      <JsonLd toolName="Split PDF Online" toolDescription={DESCRIPTION} toolUrl="/split-pdf" faqs={faqs} />
      <SplitPage />
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <SeoContent heading="How to Split a PDF Online" body={body} faqs={faqs} relatedTools={relatedTools} />
      </div>
    </>
  );
}