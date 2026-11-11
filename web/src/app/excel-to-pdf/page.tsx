import type { Metadata } from 'next';
import ExcelToPdfToolPage from './ToolPage';
import { SeoContent } from '../../components/seo/SeoContent';
import { JsonLd } from '../../components/seo/JsonLd';

const TITLE       = 'Excel to PDF Converter Online Free | XLS to PDF';
const DESCRIPTION = 'Convert Excel spreadsheets to professional PDFs online free with Freenoo—no formatting issues, works with formulas and charts perfectly.';
const CANONICAL   = 'https://www.freenoo.com/excel-to-pdf';

export const metadata: Metadata = {
  title: TITLE, description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
};

const faqs = [
  { q: 'Is Excel to PDF conversion free?', a: 'Yes, 100% free with unlimited conversions and no watermarks.' },
  { q: 'Does it preserve complex formatting?', a: 'Yes, maintains formulas, charts, colors, borders, and merged cells accurately.' },
  { q: 'Can I convert multiple Excel sheets to PDF?', a: 'Yes, all sheets in your workbook will be included in the PDF output.' },
  { q: 'Is it secure for sensitive financial data?', a: 'Files are encrypted in transit and auto-deleted after about 1 hour—complete privacy.' },
  { q: 'Do I need Excel installed?', a: 'No, entirely browser-based—works without Microsoft Office software.' },
  { q: 'Can I convert CSV to PDF?', a: 'Yes, upload CSV files and Freenoo will convert them to PDF format.' },
];

const relatedTools = [
  { href: '/pdf-to-excel', label: 'PDF to Excel', desc: 'reverse conversion' },
  { href: '/merge-pdf', label: 'Merge PDF', desc: 'combine multiple Excel→PDF exports' },
  { href: '/compress-pdf', label: 'Compress PDF', desc: 'reduce output file size' },
  { href: '/word-to-pdf', label: 'Word to PDF', desc: 'Convert the Word document companion file' },
];

const body = [
  'Convert Excel spreadsheets to professional PDFs online free with Freenoo—no formatting issues, works with formulas and charts perfectly.',
  <strong>Why use Freenoo Excel to PDF?</strong>,
  'Preserves cell formatting, colors, borders, and merged cells',
  'Maintains charts, graphs, and conditional formatting',
  'Print-ready PDFs from any spreadsheet',
  '100% free—no Microsoft Excel installation needed',
  'Privacy-focused—files auto-delete after processing',
  <strong>How to convert Excel to PDF (3 steps):</strong>,
  'Upload your Excel file (XLS or XLSX)',
  'Click "Convert to PDF"',
  'Download print-ready PDF instantly',
  <><strong>Perfect for:</strong> financial reports, budgets, data presentations, invoices</>
];

export default function ExcelToPdfPage() {
  return (
    <>
      <JsonLd toolName="Excel to PDF Converter" toolDescription={DESCRIPTION} toolUrl="/excel-to-pdf" faqs={faqs} />
      <ExcelToPdfToolPage />
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <SeoContent heading="How to Convert Excel to PDF" body={body} faqs={faqs} relatedTools={relatedTools} />
      </div>
    </>
  );
}