import type { Metadata } from "next";
import PdfToExcelToolPage from "./ToolPage";
import { SeoContent } from "../../components/seo/SeoContent";
import { JsonLd } from "../../components/seo/JsonLd";

const TITLE       = "PDF to Excel Converter Online Free | PDF to XLS";
const DESCRIPTION = "Convert PDF tables to Excel spreadsheets online. Free PDF to XLSX converter. Extract data from PDF. No signup.";
const CANONICAL   = "https://pdf.tools/pdf-to-excel";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: "website" },
};

const faqs = [
  { q: "What does PDF to Excel conversion produce?", a: "The PDF is converted to an XLSX spreadsheet using LibreOffice. Tables and structured data are extracted as editable cells." },
  { q: "Will all PDF tables be detected?", a: "Text-based PDFs with clear table structure convert best. Scanned PDFs may require manual cleanup after conversion." },
  { q: "Can I convert a scanned PDF to Excel?", a: "Scanned PDFs require OCR before table extraction. Use the PDF OCR tool first to add a text layer, then convert the searchable PDF to Excel." },
  { q: "What if my PDF has multiple tables across several pages?", a: "Each table detected in the PDF is placed into a separate worksheet in the Excel output. Tables spanning multiple pages are concatenated into a single sheet." },
];

const relatedTools = [
  { href: "/excel-to-pdf",  label: "Excel to PDF",  desc: "Convert spreadsheets back to PDF format" },
  { href: "/pdf-ocr",       label: "PDF OCR",        desc: "Make scanned PDFs searchable before converting" },
  { href: "/compress-pdf",  label: "Compress PDF",   desc: "Reduce PDF size before extracting tables" },
  { href: "/pdf-to-word",   label: "PDF to Word",    desc: "Extract all text content into an editable document" },
];

const body = [
  "Converting a PDF to Excel extracts tabular data from the document and places it into a structured spreadsheet where each cell can be edited, formatted, and used in formulas. This is essential for working with financial reports, invoices, price lists, and any data that arrives as a PDF but needs to be analysed.",
  "The conversion uses LibreOffice to identify table boundaries by detecting grid lines, white space patterns, and text alignment. Once the table structure is recognised, the row and column layout is reconstructed in the XLSX output. Each detected table is placed into its own worksheet for easy navigation.",
  "Text-based PDFs — documents created digitally in a word processor, accounting software, or data export — convert with the highest accuracy because text positions are precisely defined in the PDF structure. Scanned PDFs require an OCR pass first to identify text before table extraction can proceed.",
  "After extracting your data, use standard Excel features to clean, sort, filter, and analyse the numbers. For PDFs containing charts or graphs rather than raw tables, consider using the PDF to JPG tool to capture the visual, then manually recreate the chart in Excel.",
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