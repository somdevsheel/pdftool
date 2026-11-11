import type { Metadata } from 'next';
import SplitPage from '../split/ToolPage';
import { SeoContent } from '../../components/seo/SeoContent';
import { JsonLd } from '../../components/seo/JsonLd';

const TITLE       = 'Split PDF Online Free — Extract Pages Instantly';
const DESCRIPTION = 'Split a PDF into separate pages or extract a page range. Free online PDF splitter, no software needed.';
const CANONICAL   = 'https://www.freenoo.com/split-pdf';

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