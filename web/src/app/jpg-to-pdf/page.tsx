import type { Metadata } from 'next';
import ConvertPage from '../convert/ToolPage';
import { SeoContent } from '../../components/seo/SeoContent';
import { JsonLd } from '../../components/seo/JsonLd';

const TITLE       = 'JPG to PDF Converter Online Free | PNG & TIFF Too';
const DESCRIPTION = 'Convert JPG, PNG, and TIFF images to PDF online. Free image to PDF converter, no account needed. Fast and secure.';
const CANONICAL   = 'https://Freenoo/jpg-to-pdf';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
};

const faqs = [
  {
    q: 'Which image formats can I convert to PDF?',
    a: 'You can convert JPG (JPEG), PNG, and TIFF image files to PDF. Upload one or multiple images and they will be combined into a single PDF document.',
  },
  {
    q: 'Will converting an image to PDF reduce its quality?',
    a: 'The image is embedded in the PDF at its original resolution using ImageMagick. There is no quality loss unless the source image has low resolution to begin with.',
  },
  {
    q: 'Can I convert multiple images to one PDF?',
    a: 'Yes. Upload up to 10 images and all of them will be included in a single PDF, with each image on its own page.',
  },
  {
    q: 'How do I convert a screenshot to PDF?',
    a: 'Save your screenshot as a JPG or PNG file, then upload it using this tool. The screenshot will be converted to a PDF page in seconds.',
  },
];

const relatedTools = [
  { href: '/compress-pdf',  label: 'Compress PDF',  desc: 'Reduce the size of your converted PDF' },
  { href: '/merge-pdf',     label: 'Merge PDF',     desc: 'Combine your image PDF with other documents' },
  { href: '/pdf-to-word',   label: 'PDF to Word',   desc: 'Convert PDF back to an editable document' },
  { href: '/split-pdf',     label: 'Split PDF',     desc: 'Split a multi-image PDF into individual pages' },
];

const body = [
  'Converting images to PDF is a common task when preparing documents for email, submission to online forms, or long-term archival. A PDF wraps your image in a standardized container format that preserves its exact appearance on any device, without requiring any image viewer application.',
  'This tool accepts JPG, PNG, and TIFF files. Each image is embedded in the PDF at its original dimensions using ImageMagick on the server. The resulting PDF can then be combined with other PDFs, compressed, or further processed using any of the other tools on this site.',
  'When you upload multiple images, they are each placed on a separate PDF page in the order they were uploaded. The file list shows each image name and size before conversion starts, allowing you to remove any unwanted files.',
  'TIFF files are commonly used in professional scanning workflows and contain high-resolution image data. This converter handles multi-layer TIFF files correctly, flattening them to a standard PDF page. All files are deleted from the server after 60 minutes.',
];

export default function JpgToPdfPage() {
  return (
    <>
      <JsonLd toolName="JPG to PDF Converter" toolDescription={DESCRIPTION} toolUrl="/jpg-to-pdf" faqs={faqs} />
      <ConvertPage />
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <SeoContent heading="How to Convert Images to PDF" body={body} faqs={faqs} relatedTools={relatedTools} />
      </div>
    </>
  );
}
