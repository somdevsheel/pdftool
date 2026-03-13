import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { SeoContent } from '../../components/seo/SeoContent';
import { JsonLd } from '../../components/seo/JsonLd';

// Must be loaded client-side only — uses canvas, PDF.js, window, document
const EditPage = dynamic(() => import('../edit/ToolPage'), { ssr: false });

const TITLE       = 'Edit PDF Online Free — Add Text & Annotations';
const DESCRIPTION = 'Edit PDF files online. Add text, draw rectangles, and annotate pages. Free PDF editor, no account required.';
const CANONICAL   = 'https://Freenoo/edit-pdf';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
};

const faqs = [
  {
    q: 'Can I add text to a PDF without Adobe Acrobat?',
    a: 'Yes. Upload your PDF, select the Text tool, type your content, choose a font size and color, then click the position on the page where you want it placed. No Adobe software is required.',
  },
  {
    q: 'How do I annotate a PDF online?',
    a: 'Use the Box tool to draw rectangle annotations on any page. Choose your color, click the canvas to place the annotation, then save your edits. All annotations are embedded in the output PDF.',
  },
  {
    q: 'Is editing done in the browser or on a server?',
    a: 'All edits are applied server-side using pdf-lib. You specify coordinates and content in the interface; the server renders them into the PDF. This means large files don\'t slow down your browser.',
  },
];

const relatedTools = [
  { href: '/merge-pdf',      label: 'Merge PDF',      desc: 'Combine edited pages with other documents' },
  { href: '/compress-pdf',   label: 'Compress PDF',   desc: 'Reduce file size of your edited PDF' },
  { href: '/rotate-pdf',     label: 'Rotate PDF',     desc: 'Fix page orientation before editing' },
  { href: '/protect-pdf',    label: 'Protect PDF',    desc: 'Add password protection after editing' },
];

const body = [
  'Editing a PDF online lets you add content to an existing document without converting it to another format. This is useful for filling in information on a template, labelling pages, or marking up a document for review before sharing.',
  'This editor offers two tools: a text overlay that places typed content at any position on any page, and a rectangle annotation that draws a box outline. Both support custom colors and can be placed on different pages within the same session.',
  'Coordinates are specified by clicking on the page canvas. The click position is translated into standard PDF coordinate units (points, with origin at the bottom-left corner) and sent to the server with your chosen content and style settings. The server processes all edits in a single pass using pdf-lib.',
  'For making structural changes — such as removing pages or reordering content — use the Organize Pages or Split Freenoo. For adding password protection to an edited PDF, use the Protect PDF tool. All tools are free and do not require an account.',
];

export default function EditPdfPage() {
  return (
    <>
      <JsonLd toolName="Edit PDF Online" toolDescription={DESCRIPTION} toolUrl="/edit-pdf" faqs={faqs} />
      <EditPage />
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <SeoContent heading="How to Edit a PDF Online" body={body} faqs={faqs} relatedTools={relatedTools} />
      </div>
    </>
  );
}