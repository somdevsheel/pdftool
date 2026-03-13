import type { Metadata } from 'next';
import { ToolLayout } from '../../components/ToolLayout';
import { SeoContent } from '../../components/seo/SeoContent';
import { JsonLd } from '../../components/seo/JsonLd';

const TITLE       = 'PDF OCR Online — Make Scanned PDFs Searchable';
const DESCRIPTION = 'Run OCR on scanned PDF files online. Make text searchable and selectable. Free PDF OCR tool, no signup needed.';
const CANONICAL   = 'https://Freenoo/pdf-ocr';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
};

const faqs = [
  {
    q: 'What does OCR do to a PDF?',
    a: 'OCR (Optical Character Recognition) analyses the images in a scanned PDF and converts them into machine-readable text. The output PDF looks identical but now has a searchable text layer.',
  },
  {
    q: 'Which languages does the OCR support?',
    a: 'The OCR engine supports over 100 languages including English, French, German, Spanish, Chinese, Arabic, and Hindi. Language detection is automatic for most documents.',
  },
  {
    q: 'Can I copy and paste text from an OCR-processed PDF?',
    a: 'Yes. After OCR, the text layer is embedded in the PDF and can be selected, copied, and used for searching in any PDF viewer.',
  },
  {
    q: 'Will OCR work on PDFs with photographs?',
    a: 'OCR works on any page that contains text, even if text appears within a photograph or complex layout. Accuracy depends on image quality and text clarity.',
  },
];

const relatedTools = [
  { href: '/pdf-to-word',  label: 'PDF to Word',  desc: 'Convert OCR-processed PDF to editable Word' },
  { href: '/compress-pdf', label: 'Compress PDF', desc: 'Reduce size after adding OCR text layer' },
  { href: '/edit-pdf',     label: 'Edit PDF',     desc: 'Add annotations after making text searchable' },
  { href: '/split-pdf',    label: 'Split PDF',    desc: 'Extract individual pages from scanned documents' },
];

const body = [
  'OCR (Optical Character Recognition) converts scanned PDF pages — which are essentially images — into PDFs with a searchable and selectable text layer. Without OCR, text in a scanned document cannot be highlighted, searched, or copied.',
  'This tool is particularly useful for digitised documents, scanned contracts, archived records, and any PDF exported from a photocopier or scanner. After OCR processing, the file looks identical but the text is now embedded and accessible to search engines, accessibility tools, and screen readers.',
  'OCR accuracy depends on the quality of the source scan. Clear, high-resolution scans of printed text (300 dpi or higher) achieve near-perfect accuracy. Handwriting, decorative fonts, and low-quality photocopies will produce lower accuracy results.',
  'Once your PDF has a text layer, you can use the PDF to Word converter to create an editable document, or the Compress PDF tool to reduce the size of the now-larger searchable file. All processing happens on the server — no third-party OCR API is used.',
];

export default function PdfOcrPage() {
  return (
    <>
      <JsonLd toolName="PDF OCR — Searchable PDF Maker" toolDescription={DESCRIPTION} toolUrl="/pdf-ocr" faqs={faqs} />
      <ToolLayout title="Recognize Text with OCR" tagline="Make scanned PDFs fully searchable and selectable." icon="🔍" accentColor="#3FC87A">
        <div style={{ padding: '48px 0', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, margin: '0 auto 20px', background: 'var(--surface-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🔍</div>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>PDF OCR</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, maxWidth: 400, margin: '0 auto 24px' }}>OCR processing is coming soon. This will make scanned PDFs fully searchable and selectable.</p>
          <div className="stamp">🚧 Coming soon</div>
        </div>
      </ToolLayout>
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <SeoContent heading="About PDF OCR" body={body} faqs={faqs} relatedTools={relatedTools} />
      </div>
    </>
  );
}
