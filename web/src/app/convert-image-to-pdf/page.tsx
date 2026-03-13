import type { Metadata } from 'next';
import ConvertPage from '../convert/ToolPage';
import { SeoContent } from '../../components/seo/SeoContent';
import { JsonLd } from '../../components/seo/JsonLd';

const TITLE       = 'Convert Image to PDF Online Free | JPG PNG TIFF';
const DESCRIPTION = 'Convert images to PDF online. Supports JPG, PNG, and TIFF. Multiple images become one PDF. Free, no signup.';
const CANONICAL   = 'https://Freenoo/convert-image-to-pdf';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
};

const faqs = [
  {
    q: 'How do I convert an image to PDF?',
    a: 'Upload your image file (JPG, PNG, or TIFF), then click "Convert to PDF". The PDF is created on the server and ready to download in seconds. No quality loss occurs during conversion.',
  },
  {
    q: 'Can I convert multiple images to one PDF?',
    a: 'Yes. Upload up to 10 image files and they will all be included in a single PDF — each image on its own page — in the order they appear in the file list.',
  },
  {
    q: 'What image formats can be converted to PDF?',
    a: 'JPG and JPEG (photographs), PNG (screenshots, graphics with transparency), and TIFF (professional scans and documents) are all supported.',
  },
  {
    q: 'Does converting a PNG to PDF keep the transparency?',
    a: 'PDF does not natively support transparency in the same way as PNG. Transparent areas in PNG images are rendered on a white background in the output PDF.',
  },
  {
    q: 'How do I convert a photo on my phone to PDF?',
    a: 'Open this page in your phone\'s browser, tap the upload area, and select the photo from your camera roll. The conversion works the same way on mobile as on desktop.',
  },
];

const relatedTools = [
  { href: '/jpg-to-pdf',    label: 'JPG to PDF',    desc: 'Convert JPEG images specifically' },
  { href: '/compress-pdf',  label: 'Compress PDF',  desc: 'Reduce size of your converted PDF' },
  { href: '/merge-pdf',     label: 'Merge PDF',     desc: 'Add more pages to your image PDF' },
  { href: '/rotate-pdf',    label: 'Rotate PDF',    desc: 'Fix orientation after converting' },
];

const body = [
  'Converting an image to PDF is the most reliable way to share a photograph, screenshot, or scanned document in a format that looks identical on every device and operating system. Unlike raw image files, PDFs can be password-protected, combined with other documents, and printed at exact sizes.',
  'This tool converts JPG, PNG, and TIFF images to PDF using ImageMagick on the server. Each image is embedded at its original resolution — no quality reduction is applied during conversion. The resulting PDF\'s page size matches the image dimensions.',
  'When multiple images are uploaded, they are placed on separate pages of a single PDF in upload order. This is useful for combining a set of scanned document pages, creating a PDF portfolio of photographs, or packaging a multi-page form that was scanned as individual JPG files.',
  'TIFF files are widely used in professional scanning because they support lossless compression and high bit depth. This converter processes standard single-layer TIFF files correctly. For images from scanners that produce multi-page TIFF files, the tool handles the conversion into individual PDF pages.',
];

export default function ConvertImageToPdfPage() {
  return (
    <>
      <JsonLd toolName="Convert Image to PDF Online" toolDescription={DESCRIPTION} toolUrl="/convert-image-to-pdf" faqs={faqs} />
      <ConvertPage />
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <SeoContent
          heading="How to Convert Images to PDF"
          body={body}
          faqs={faqs}
          relatedTools={relatedTools}
        />
      </div>
    </>
  );
}
