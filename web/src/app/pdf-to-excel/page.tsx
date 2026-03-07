import type { Metadata } from 'next';
import PdfToExcelToolPage from './ToolPage';
import { JsonLd } from '../../components/seo/JsonLd';

const TITLE       = 'PDF to Excel Converter Online Free | PDF to XLS';
const DESCRIPTION = 'Convert PDF tables to Excel spreadsheets online. Free PDF to XLSX converter. Extract data from PDF. No signup.';
const CANONICAL   = 'https://pdf.tools/pdf-to-excel';

export const metadata: Metadata = {
  title: TITLE, description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
};

const faqs = [
  { q: 'What does PDF to Excel conversion produce?', a: 'The PDF is converted to an XLSX spreadsheet using LibreOffice. Tables and structured data are extracted as editable cells.' },
  { q: 'Will all PDF tables be detected?', a: 'Text-based PDFs with clear table structure convert best. Scanned PDFs may require manual cleanup after conversion.' },
];

export default function PdfToExcelPage() {
  return (
    <>
      <JsonLd toolName="PDF to Excel Converter" toolDescription={DESCRIPTION} toolUrl="/pdf-to-excel" faqs={faqs} />
      <PdfToExcelToolPage />
    </>
  );
}
