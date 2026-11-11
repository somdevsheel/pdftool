import type { Metadata } from 'next';
import CompressPage from '../compress/ToolPage';
import { SeoContent } from '../../components/seo/SeoContent';
import { JsonLd } from '../../components/seo/JsonLd';

const TITLE       = 'Compress PDF Online Free — Reduce File Size';
const DESCRIPTION = 'Reduce PDF file size online while keeping text sharp. Choose small, balanced or high quality. Free, no signup, no watermark.';
const CANONICAL   = 'https://www.freenoo.com/compress-pdf';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
};

const faqs = [
  { q: 'Is PDF compressor free?', a: 'Yes, completely free with no signup, no email, and no watermarks.' },
  { q: 'Can I compress PDF to specific sizes like 100KB?', a: 'Choose compression levels and check output size; re-compress if needed for strict limits.' },
  { q: 'Will compressing reduce quality?', a: 'Freenoo optimizes images and structure to reduce size while keeping text crisp.' },
  { q: 'Does it work for scanned PDFs?', a: 'Yes, scanned PDFs often compress significantly with minimal quality loss.' },
  { q: 'Is my compressed PDF secure?', a: 'Files are encrypted in transit and auto-deleted after about 1 hour—complete privacy.' },
  { q: 'Can I compress multiple PDFs?', a: 'Process as many files as needed one after another, or open multiple tabs for parallel compression.' },
];

const relatedTools = [
  { href: '/tools',      label: 'All Converter Tools', desc: 'Compress after converting' },
  { href: '/split-pdf',  label: 'Split PDF',            desc: 'Compress large files in sections' },
  { href: '/merge-pdf',  label: 'Merge PDF',            desc: 'Compress after combining' },
];

const body = [
  'Shrink large PDFs while keeping them clear and readable with Freenoo\'s Compress PDF tool. Perfect when you need to email documents or meet 100KB/200KB upload limits.',
  <>
    <strong>Why use Freenoo Compress PDF?</strong>
    <ul style={{ marginTop: 8, paddingLeft: 18, lineHeight: 2 }}>
      <li>Smart compression balances quality and size</li>
      <li>Choose target size or quality level</li>
      <li>Preserves text clarity and most image detail</li>
      <li>100% free with no watermarks or limits</li>
      <li>Privacy-focused—files auto-delete after processing</li>
    </ul>
  </>,
  <>
    <strong>How to compress PDF (3 steps):</strong>
    <ol style={{ marginTop: 8, paddingLeft: 18, lineHeight: 2 }}>
      <li>Upload your PDF file (scanned or digital, up to 100MB)</li>
      <li>Choose compression level: Strong, Balanced, or High Quality</li>
      <li>Click &quot;Compress PDF&quot;—download reduced-size file</li>
    </ol>
  </>,
  'Perfect for: email attachments, form uploads, mobile sharing, website optimization.',
];

export default function CompressPdfPage() {
  return (
    <>
      <JsonLd toolName="Compress PDF Online" toolDescription={DESCRIPTION} toolUrl="/compress-pdf" faqs={faqs} />
      <CompressPage />
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <SeoContent heading="How to Compress PDF Files Online" body={body} faqs={faqs} relatedTools={relatedTools} />
      </div>
    </>
  );
}