import type { Metadata } from "next";
import PdfToExcelToolPage from "./ToolPage";
import { SeoContent } from "../../components/seo/SeoContent";
import { JsonLd } from "../../components/seo/JsonLd";

const TITLE       = "PDF to Excel Converter Online Free | PDF to XLS";
const DESCRIPTION = "Freenoo extracts tables and data from PDFs into clean, editable Excel spreadsheets (.xlsx)—perfect for invoices, financial reports, and scanned documents. No software installation required.";
const CANONICAL   = "https://www.freenoo.com/pdf-to-excel";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: "website" },
};

const faqs = [
  { q: "Is PDF to Excel converter free?", a: "Yes, completely free with no registration, no email, and no watermarks." },
  { q: "Will formulas be created automatically?", a: "No, Freenoo focuses on accurate data extraction—you get clean rows and columns, then add formulas in Excel." },
  { q: "Can I convert scanned PDF tables to Excel?", a: "Yes, using OCR technology to read text and numbers from scanned documents." },
  { q: "Does it work for large multi-page PDFs?", a: "Yes, handles multi-page reports—for very long files, consider splitting first for optimal performance." },
  { q: "Is my financial data secure?", a: "Files are processed on secure servers and auto-deleted after 1 hour—complete confidentiality." },
  { q: "Can I export to CSV format?", a: "Freenoo outputs Excel formats; open in Excel/Google Sheets and save as CSV for compatibility." },
];

const relatedTools = [
  { href: "/excel-to-pdf", label: "Excel to PDF", desc: "reverse conversion" },
  { href: "/pdf-ocr", label: "OCR Tool", desc: "for better scanned document accuracy" },
  { href: "/compress-pdf", label: "Compress PDF", desc: "reduce file size before converting" },
];

const body = [
  'Freenoo extracts tables and data from PDFs into clean, editable Excel spreadsheets (.xlsx)—perfect for invoices, financial reports, and scanned documents. No software installation required.',
  <strong>Why use Freenoo PDF to Excel?</strong>,
  'Smart table detection—accurately pulls columns, rows, and numbers',
  'OCR support for scanned PDFs and images',
  'Preserves data structure for easy sorting and analysis',
  '100% free with no watermarks or conversion limits',
  'Works on any device, any browser',
  <strong>How to convert PDF to Excel (3 steps):</strong>,
  'Upload your PDF with tables or data',
  'Choose output format (XLSX recommended)',
  'Click "Convert to Excel"—download editable spreadsheet',
  <><strong>Perfect for:</strong> bank statements, invoices, data reports, financial documents</>
];

export default function PdfToExcelPage() {
  return (
    <>
      <JsonLd toolName="PDF to Excel Converter" toolDescription={DESCRIPTION} toolUrl="/pdf-to-excel" faqs={faqs} />
      <PdfToExcelToolPage />
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <SeoContent heading="How to Convert PDF to Excel" body={body} faqs={faqs} relatedTools={relatedTools} />
      </div>
    </>
  );
}