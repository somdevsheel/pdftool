import type { Metadata } from 'next';
import { ToolLayout } from '../../components/ToolLayout';
import { SeoContent } from '../../components/seo/SeoContent';
import { JsonLd } from '../../components/seo/JsonLd';

const TITLE       = 'PDF to Word Converter — Free Online DOC Converter';
const DESCRIPTION = 'Convert PDF to Word (DOCX) online for free. Accurate PDF to Word converter. Keeps formatting. No signup required.';
const CANONICAL   = 'https://Freenoo/pdf-to-word-converter';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
};

const faqs = [
  {
    q: 'Is this PDF to Word converter accurate?',
    a: 'Accuracy depends on the source PDF. Text-based PDFs created from word processors convert with high fidelity, preserving headings, paragraphs, and basic tables. Scanned PDFs require OCR processing before conversion.',
  },
  {
    q: 'What is the difference between a PDF and a Word document?',
    a: 'PDF is a fixed-layout format — content is positioned precisely and looks identical on all devices. Word (DOCX) is a reflowable format where text adapts to the page size and can be freely edited.',
  },
  {
    q: 'Can I convert a multi-page PDF to Word?',
    a: 'Yes. The entire document, regardless of page count, is converted into a single DOCX file with the same page structure as the original PDF.',
  },
  {
    q: 'Do I need Microsoft Word to use the output file?',
    a: 'No. The DOCX format is supported by Google Docs, LibreOffice, Apple Pages, and all other major word processors without requiring a Microsoft Office licence.',
  },
];

const relatedTools = [
  { href: '/pdf-to-word',  label: 'PDF to Word',  desc: 'Primary PDF to Word tool' },
  { href: '/pdf-ocr',      label: 'PDF OCR',      desc: 'Make scanned PDFs text-searchable first' },
  { href: '/compress-pdf', label: 'Compress PDF', desc: 'Reduce PDF size before converting' },
  { href: '/edit-pdf',     label: 'Edit PDF',     desc: 'Edit the PDF without converting' },
];

const body = [
  'A PDF to Word converter extracts the text and layout from a PDF document and reconstructs it as an editable DOCX file. This lets you reuse, edit, or reformat content that was originally saved in the fixed PDF format.',
  'The conversion process analyses the PDF\'s internal structure: text streams, font information, paragraph boundaries, and table coordinates. Well-structured PDFs from word processors or publishing tools convert cleanly. PDFs that are scanned images of text cannot be converted directly — they require an OCR pass first to extract the text layer.',
  'Output files are in the DOCX format (Office Open XML), which is compatible with Microsoft Word 2007 and later, Google Docs (via import), LibreOffice Writer, and Apple Pages. The DOCX format is the industry-standard interchange format for word processor documents.',
  'After converting, you may need to clean up minor formatting differences, particularly in complex multi-column layouts or documents with unusual font usage. For simple text documents and straightforward reports, the output is typically ready to use with minimal adjustment.',
];

export default function PdfToWordConverterPage() {
  return (
    <>
      <JsonLd toolName="PDF to Word Converter Online" toolDescription={DESCRIPTION} toolUrl="/pdf-to-word-converter" faqs={faqs} />
      <ToolLayout title="PDF to Word Converter" tagline="Convert PDF documents to editable Word files." icon="📝" accentColor="#2B5EE8">
        <div style={{ padding: '48px 0', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, margin: '0 auto 20px', background: 'var(--surface-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>📝</div>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>PDF to Word Converter</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, maxWidth: 400, margin: '0 auto 24px', lineHeight: 1.6 }}>Full PDF to Word conversion launching soon. Use PDF OCR first to make scanned PDFs text-searchable.</p>
          <div className="stamp">🚧 Coming soon</div>
        </div>
      </ToolLayout>
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <SeoContent
          heading="About PDF to Word Conversion"
          body={body}
          faqs={faqs}
          relatedTools={relatedTools}
        />
      </div>
    </>
  );
}
