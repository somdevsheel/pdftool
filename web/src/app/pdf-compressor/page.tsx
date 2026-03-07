import type { Metadata } from 'next';
import CompressPage from '../compress/ToolPage';
import { SeoContent } from '../../components/seo/SeoContent';
import { JsonLd } from '../../components/seo/JsonLd';

const TITLE       = 'PDF Compressor Online — Shrink PDF Files Free';
const DESCRIPTION = 'Online PDF compressor with three quality settings. Shrink PDF files for email, web upload, or storage. Free.';
const CANONICAL   = 'https://pdf.tools/pdf-compressor';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
};

const faqs = [
  {
    q: 'What is a PDF compressor?',
    a: 'A PDF compressor is a tool that reduces the size of a PDF file by applying compression algorithms to images and streams inside the document, producing a smaller file that is functionally identical to the original.',
  },
  {
    q: 'Is this PDF compressor free?',
    a: 'Yes. This tool is completely free, with no per-use fees, no subscription, and no account required.',
  },
  {
    q: 'How does Ghostscript compress PDFs?',
    a: 'Ghostscript reprocesses the PDF, applying image downsampling and stream compression. It supports four quality profiles that trade file size against image resolution, from screen quality (72 dpi) up to prepress quality (600 dpi).',
  },
];

const relatedTools = [
  { href: '/compress-pdf',          label: 'Compress PDF',       desc: 'Standard compression tool' },
  { href: '/compress-pdf-to-100kb', label: 'Compress to 100KB',  desc: 'Reach very small file sizes' },
  { href: '/reduce-pdf-size',       label: 'Reduce PDF Size',    desc: 'Size reduction guide' },
  { href: '/merge-pdf',             label: 'Merge PDF',          desc: 'Combine then compress' },
];

const body = [
  'A PDF compressor reduces the byte size of a PDF document by processing its internal data streams. The most impactful compression target is embedded images, which typically account for 80–90% of a large PDF\'s file size. Text, fonts, and structure data are already stored in efficient formats.',
  'This compressor uses Ghostscript, an open-source PDF processing engine used in commercial printing and document workflows worldwide. It applies the /screen, /ebook, or /printer PDFSETTINGS profile depending on your chosen quality level, each representing a different trade-off between file size and image fidelity.',
  'Choose "Small file" for maximum compression when the PDF is for online viewing only — this reduces images to 72 DPI and applies the most aggressive stream compression. Choose "Balanced" for general-purpose sharing where occasional printing is likely. Choose "High quality" to keep 300 DPI images for documents that will be printed.',
  'After compression, verify the output in a PDF viewer before distributing it. If text appears blurry (which is unusual) or image quality is insufficient, re-compress at a higher quality setting. For very large PDFs where only certain sections are needed, use Split PDF first to isolate the relevant pages before compressing.',
];

export default function PdfCompressorPage() {
  return (
    <>
      <JsonLd toolName="PDF Compressor Online" toolDescription={DESCRIPTION} toolUrl="/pdf-compressor" faqs={faqs} />
      <CompressPage />
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <SeoContent
          heading="About This PDF Compressor"
          body={body}
          faqs={faqs}
          relatedTools={relatedTools}
        />
      </div>
    </>
  );
}
