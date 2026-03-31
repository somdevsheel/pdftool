// import type { Metadata } from "next";
// import PdfToExcelToolPage from "./ToolPage";
// import { SeoContent } from "../../components/seo/SeoContent";
// import { JsonLd } from "../../components/seo/JsonLd";

// const TITLE       = "PDF to Excel Converter Online Free | PDF to XLS";
// const DESCRIPTION = "Convert PDF tables to Excel spreadsheets online. Free PDF to XLSX converter. Extract data from PDF. No signup.";
// const CANONICAL   = "https://freenoo.com/pdf-to-excel";

// export const metadata: Metadata = {
//   title: TITLE,
//   description: DESCRIPTION,
//   alternates: { canonical: CANONICAL },
//   openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: "website" },
// };

// const faqs = [
//   { q: "What does PDF to Excel conversion produce?", a: "The PDF is converted to an XLSX spreadsheet using LibreOffice. Tables and structured data are extracted as editable cells." },
//   { q: "Will all PDF tables be detected?", a: "Text-based PDFs with clear table structure convert best. Scanned PDFs may require manual cleanup after conversion." },
//   { q: "Can I convert a scanned PDF to Excel?", a: "Scanned PDFs require OCR before table extraction. Use the PDF OCR tool first to add a text layer, then convert the searchable PDF to Excel." },
//   { q: "What if my PDF has multiple tables across several pages?", a: "Each table detected in the PDF is placed into a separate worksheet in the Excel output. Tables spanning multiple pages are concatenated into a single sheet." },
// ];

// const relatedTools = [
//   { href: "/excel-to-pdf",  label: "Excel to PDF",  desc: "Convert spreadsheets back to PDF format" },
//   { href: "/pdf-ocr",       label: "PDF OCR",        desc: "Make scanned PDFs searchable before converting" },
//   { href: "/compress-pdf",  label: "Compress PDF",   desc: "Reduce PDF size before extracting tables" },
//   { href: "/pdf-to-word",   label: "PDF to Word",    desc: "Extract all text content into an editable document" },
// ];

// const body = [
//   "Converting a PDF to Excel extracts tabular data from the document and places it into a structured spreadsheet where each cell can be edited, formatted, and used in formulas. This is essential for working with financial reports, invoices, price lists, and any data that arrives as a PDF but needs to be analysed.",
//   "The conversion uses LibreOffice to identify table boundaries by detecting grid lines, white space patterns, and text alignment. Once the table structure is recognised, the row and column layout is reconstructed in the XLSX output. Each detected table is placed into its own worksheet for easy navigation.",
//   "Text-based PDFs — documents created digitally in a word processor, accounting software, or data export — convert with the highest accuracy because text positions are precisely defined in the PDF structure. Scanned PDFs require an OCR pass first to identify text before table extraction can proceed.",
//   "After extracting your data, use standard Excel features to clean, sort, filter, and analyse the numbers. For PDFs containing charts or graphs rather than raw tables, consider using the PDF to Image tool to capture the visual, then manually recreate the chart in Excel.",
// ];

// export default function PdfToExcelPage() {
//   return (
//     <>
//       <JsonLd toolName="PDF to Excel Converter" toolDescription={DESCRIPTION} toolUrl="/pdf-to-excel" faqs={faqs} />
//       <PdfToExcelToolPage />
//       <div className="max-w-6xl mx-auto px-6 pb-16">
//         <SeoContent heading="How to Convert PDF to Excel" body={body} faqs={faqs} relatedTools={relatedTools} />
//       </div>
//     </>
//   );
// }


import type { Metadata } from "next";
import PdfToExcelToolPage from "./ToolPage";
import { SeoContent } from "../../components/seo/SeoContent";
import { JsonLd } from "../../components/seo/JsonLd";

const TITLE       = "PDF to Excel Converter Online Free | PDF to XLS";
const DESCRIPTION = "Freenoo extracts tables and data from PDFs into clean, editable Excel spreadsheets (.xlsx)—perfect for invoices, financial reports, and scanned documents. No software installation required.";
const CANONICAL   = "https://freenoo.com/pdf-to-excel";

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