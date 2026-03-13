import type { Metadata } from 'next';
import CompressPage from '../compress/ToolPage';
import { SeoContent } from '../../components/seo/SeoContent';
import { JsonLd } from '../../components/seo/JsonLd';

const TITLE       = 'Reduce PDF Size Online Free — PDF File Reducer';
const DESCRIPTION = 'Reduce PDF file size online without losing quality. Three compression levels. Free PDF reducer, no signup needed.';
const CANONICAL   = 'https://Freenoo/reduce-pdf-size';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
};

const faqs = [
  {
    q: 'How do I reduce a PDF file size without losing quality?',
    a: 'Use the "High quality" compression level. This setting reduces file size by around 20% while preserving 300 dpi image resolution — suitable for documents that will be printed.',
  },
  {
    q: 'Why is my PDF file so large?',
    a: 'Large PDFs typically contain high-resolution images, embedded fonts, or uncompressed streams. A PDF exported from design software or created from scanned pages at high DPI will be much larger than a text-only document.',
  },
  {
    q: 'Can I reduce PDF size on a Mac or iPhone?',
    a: 'Yes. This tool works on macOS, iOS, Windows, Android, and Linux — any device with a modern browser. No application installation is required.',
  },
  {
    q: 'Does reducing PDF size affect text quality?',
    a: 'No. Text in PDFs is stored as vector data and is not affected by image compression. Only raster images are downsampled during the size reduction process.',
  },
];

const relatedTools = [
  { href: '/compress-pdf',          label: 'Compress PDF',           desc: 'Primary compression tool' },
  { href: '/compress-pdf-to-100kb', label: 'Compress to 100KB',      desc: 'Maximum size reduction' },
  { href: '/pdf-compressor',         label: 'PDF Compressor',         desc: 'All compression levels' },
  { href: '/split-pdf',             label: 'Split PDF',              desc: 'Remove pages before compressing' },
];

const body = [
  'Reducing a PDF\'s file size makes it faster to email, upload to web portals, and store. Large PDFs slow down email servers, exceed upload limits, and take longer to open on mobile devices. Size reduction is one of the most frequently needed PDF operations.',
  'The right compression level depends on how the document will be used. For documents that will only ever be viewed on screen — emails, online forms, digital-only reports — the "Small file" setting (72 dpi) achieves the maximum reduction. For documents that might occasionally be printed, "Balanced" (150 dpi) is a better balance.',
  'PDF size is mostly driven by image content. A 50-page PDF containing scanned photographs will be many times larger than a 50-page text document. Compressing a text-heavy PDF will reduce its size, but not as dramatically as compressing an image-heavy one.',
  'After reducing the size, check the output file in your PDF viewer before replacing the original. If the quality is acceptable for your use case, you can proceed. If not, re-upload and try a higher quality level. The "High quality" setting at 300 dpi is nearly visually identical to the uncompressed original for most documents.',
];

export default function ReducePdfSizePage() {
  return (
    <>
      <JsonLd toolName="Reduce PDF File Size Online" toolDescription={DESCRIPTION} toolUrl="/reduce-pdf-size" faqs={faqs} />
      <CompressPage />
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <SeoContent
          heading="How to Reduce PDF File Size"
          body={body}
          faqs={faqs}
          relatedTools={relatedTools}
        />
      </div>
    </>
  );
}
