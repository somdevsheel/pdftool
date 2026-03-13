import type { Metadata } from 'next';
import ToolPage from './ToolPage';
import { SeoContent } from '../../components/seo/SeoContent';
import { JsonLd } from '../../components/seo/JsonLd';

const TITLE       = 'Crop PDF Pages Online Free — Trim PDF Margins';
const DESCRIPTION = 'Crop PDF pages to remove unwanted margins or white space. Free online PDF crop tool, no account needed.';
const CANONICAL   = 'https://Freenoo/crop';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
};

const faqs = [
  {
    q: 'How do I crop pages in a PDF?',
    a: 'Upload your PDF, drag the crop handles on the preview to define the area you want to keep, then apply. The cropped PDF is generated on the server and ready to download.',
  },
  {
    q: 'Can I crop all pages to the same dimensions?',
    a: 'Yes. Apply the same crop box to all pages at once, or set a different crop area for individual pages if the layout varies across the document.',
  },
  {
    q: 'Does cropping permanently remove the hidden content?',
    a: 'PDF cropping sets the CropBox, which hides content outside the defined area. The hidden content is not visible in standard viewers but remains in the file. Use a flattening step to permanently discard it.',
  },
  {
    q: 'Will cropping reduce the file size?',
    a: 'Setting the CropBox alone does not reduce file size since the underlying content is still present. To reduce size after cropping, run the file through the Compress PDF tool.',
  },
];

const relatedTools = [
  { href: '/compress-pdf',   label: 'Compress PDF',   desc: 'Reduce size after cropping' },
  { href: '/rotate-pdf',     label: 'Rotate PDF',     desc: 'Fix orientation before cropping' },
  { href: '/edit-pdf',       label: 'Edit PDF',       desc: 'Add annotations after cropping' },
  { href: '/split-pdf',      label: 'Split PDF',      desc: 'Extract pages before cropping selectively' },
];

const body = [
  'Cropping a PDF removes unwanted margins, white space, or irrelevant content from the edges of pages, producing a cleaner, more focused document. This is commonly used to trim scanned pages that have large borders, remove headers or footers before repurposing content, or resize pages to a specific display area.',
  'The crop tool works by setting a CropBox on each page — a rectangle that defines the visible area. Content outside the CropBox is hidden from view in all standard PDF readers. You define the crop rectangle visually by dragging handles on a live page preview, so you can see exactly what will be kept before applying.',
  'You can apply the same crop dimensions to all pages in one operation, which is ideal for consistently scanned documents. For documents where page content varies — such as mixed portrait and landscape pages — each page can be cropped individually with its own settings.',
  'After cropping, consider running the file through the Compress PDF tool to reduce the overall file size. For documents that will be printed, check the output in print preview to ensure the crop margins align with the required paper size and bleed settings.',
];

export default function Page() {
  return (
    <>
      <JsonLd toolName="Crop PDF Pages Online" toolDescription={DESCRIPTION} toolUrl="/crop" faqs={faqs} />
      <ToolPage />
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <SeoContent heading="How to Crop PDF Pages" body={body} faqs={faqs} relatedTools={relatedTools} />
      </div>
    </>
  );
}