import type { Metadata } from 'next';
import MergePage from '../merge/ToolPage';
import { SeoContent } from '../../components/seo/SeoContent';
import { JsonLd } from '../../components/seo/JsonLd';

const TITLE       = 'Merge PDF Online — Merge pdf files in Your Browser';
const DESCRIPTION = 'Merge PDF files online without installing software. Works in any browser. Free, private, no account needed.';
const CANONICAL   = 'https://freenoo.com/merge-pdf-online';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
};

const faqs = [
  {
    q: 'Can I merge PDFs online without installing software?',
    a: 'Yes. This tool runs entirely through your browser with no installation required. Upload your files, set the order, and download the merged result in seconds.',
  },
  {
    q: 'Does merging PDFs online work on mobile?',
    a: 'Yes. The tool works on any device with a modern browser including iOS Safari and Android Chrome. You can upload files from your phone\'s local storage or cloud drives.',
  },
  {
    q: 'Are there any limitations on how many files I can merge?',
    a: 'You can merge up to 20 PDF files in one operation. For larger batches, merge in groups and then merge the resulting files together.',
  },
];

const relatedTools = [
  { href: '/split-pdf',            label: 'Split PDF',           desc: 'Split a PDF into separate pages' },
  { href: '/compress-pdf',         label: 'Compress PDF',        desc: 'Reduce size of your merged file' },
  { href: '/combine-pdf-files',    label: 'Combine PDF Files',   desc: 'Another way to combine PDFs' },
  { href: '/rotate-pdf',           label: 'Rotate PDF',          desc: 'Fix orientation in merged pages' },
];

const body = [
  'Merging PDFs online means combining two or more PDF files into one document directly in your browser — no software installation, no operating system restrictions, and no account required. The processing happens on a secure server and the original files are never modified.',
  'This is particularly useful when working on a device where you cannot install applications, such as a work computer with restricted permissions, a school computer, or a shared workstation. As long as you have a browser and an internet connection, you can merge PDFs.',
  'The tool supports up to 20 files per merge. Drag the file cards to arrange the output order before clicking merge. Each thumbnail shows the first page of the document so you can quickly verify the correct sequence.',
  'After downloading your merged PDF, the file is automatically deleted from our servers within 60 minutes. Nothing is stored, indexed, or accessed beyond the time needed to process and deliver the file.',
];

export default function MergePdfOnlinePage() {
  return (
    <>
      <JsonLd toolName="Merge PDF Online" toolDescription={DESCRIPTION} toolUrl="/merge-pdf-online" faqs={faqs} />
      <MergePage />
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <SeoContent
          heading="Merge PDF Files Online — No Software Needed"
          body={body}
          faqs={faqs}
          relatedTools={relatedTools}
        />
      </div>
    </>
  );
}
