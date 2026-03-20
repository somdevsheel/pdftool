import type { Metadata } from 'next';
import CompressPage from '../compress/ToolPage';
import { SeoContent } from '../../components/seo/SeoContent';
import { JsonLd } from '../../components/seo/JsonLd';

const TITLE       = 'Compress PDF to 100KB Online — Reduce PDF Size';
const DESCRIPTION = 'Compress a PDF to 100KB or less online. Maximum compression mode for small email attachments. Free, no signup.';
const CANONICAL   = 'https://freenoo.com/compress-pdf-to-100kb';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
};

const faqs = [
  {
    q: 'How do I compress a PDF to under 100KB?',
    a: 'Upload your PDF and select the "Small file" compression level (72 dpi). This applies maximum compression and is the best option for reaching very small file sizes. Results vary depending on how many images the PDF contains.',
  },
  {
    q: 'Why can\'t I get my PDF below 100KB?',
    a: 'Text-only PDFs have a minimum file size determined by the number of pages and the font data. Image-heavy PDFs can compress more aggressively. If the output is still too large, consider splitting the PDF to reduce the number of pages.',
  },
  {
    q: 'Will a 100KB PDF look acceptable on screen?',
    a: 'At "Small file" (72 dpi), the PDF is optimised for screen viewing. Text remains sharp. Images will appear at web resolution — acceptable for screen but not for print.',
  },
  {
    q: 'What is the "Small file" compression setting?',
    a: 'It maps to Ghostscript\'s /screen PDFSETTINGS profile, which targets 72 dpi and applies maximum image downsampling and stream compression across the document.',
  },
];

const relatedTools = [
  { href: '/compress-pdf',   label: 'Compress PDF',    desc: 'Standard PDF compression tool' },
  { href: '/reduce-pdf-size', label: 'Reduce PDF Size', desc: 'Alternative compression options' },
  { href: '/split-pdf',      label: 'Split PDF',       desc: 'Remove pages to reduce size further' },
  { href: '/pdf-compressor',  label: 'PDF Compressor',  desc: 'All compression options in one place' },
];

const body = [
  'Compressing a PDF to 100KB or smaller is a common requirement when uploading to portals with strict file size limits, such as government forms, university application systems, or HR platforms. The "Small file" setting applies maximum compression to bring PDF file sizes as low as possible.',
  'The primary lever for aggressive compression is image downsampling. When you compress to the smallest profile, embedded images are reduced to 72 DPI — the resolution used for screen display. If your PDF contains high-resolution photographs or diagrams, you should see significant size reduction.',
  'For text-only PDFs, the size reduction will be more modest because text is already stored compactly. If your document is still too large after compression, the most effective next step is to use the Split PDF tool to remove pages you do not need, then compress the shorter document.',
  'To reach the smallest possible output, select "Small file" in the compression options. For documents where some image quality must be preserved but size still matters, try "Balanced" first. All compression uses Ghostscript on the server — there is no client-side processing.',
];

export default function CompressPdfTo100kbPage() {
  return (
    <>
      <JsonLd toolName="Compress PDF to 100KB" toolDescription={DESCRIPTION} toolUrl="/compress-pdf-to-100kb" faqs={faqs} />
      <CompressPage />
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <SeoContent
          heading="How to Compress a PDF to 100KB"
          body={body}
          faqs={faqs}
          relatedTools={relatedTools}
        />
      </div>
    </>
  );
}
