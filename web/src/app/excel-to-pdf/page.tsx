// import type { Metadata } from 'next';
// import ExcelToPdfToolPage from './ToolPage';
// import { SeoContent } from '../../components/seo/SeoContent';
// import { JsonLd } from '../../components/seo/JsonLd';

// const TITLE       = 'Excel to PDF Converter Online Free | XLS to PDF';
// const DESCRIPTION = 'Convert Excel spreadsheets to PDF online. Free XLS and XLSX to PDF converter. Preserves tables and formatting. No signup.';
// const CANONICAL   = 'https://freenoo.com/excel-to-pdf';

// export const metadata: Metadata = {
//   title: TITLE, description: DESCRIPTION,
//   alternates: { canonical: CANONICAL },
//   openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'website' },
// };

// const faqs = [
//   { q: 'How do I convert an Excel file to PDF?', a: 'Upload your XLS or XLSX file and the converter renders each worksheet as a page in the output PDF.' },
//   { q: 'Does converting Excel to PDF keep the table formatting?', a: 'Yes. Cell borders, background colours, merged cells, and number formatting are all rendered in the PDF output.' },
//   { q: 'Will each worksheet become a separate page?', a: 'Each worksheet is rendered as one or more pages depending on its size and print settings.' },
//   { q: 'Can I convert a CSV file to PDF?', a: 'Open your CSV in Excel or Google Sheets first, format it as needed, then save as XLSX and upload for conversion.' },
// ];
// const relatedTools = [
//   { href: '/pdf-to-excel', label: 'PDF to Excel', desc: 'Convert PDF tables back to spreadsheet' },
//   { href: '/compress-pdf', label: 'Compress PDF', desc: 'Reduce size of your spreadsheet PDF' },
//   { href: '/merge-pdf', label: 'Merge PDF', desc: 'Combine Excel PDF with a report' },
//   { href: '/word-to-pdf', label: 'Word to PDF', desc: 'Convert the Word document companion file' },
// ];
// const body = [
//   "Converting an Excel spreadsheet to PDF is the standard way to share financial data, reports, and tables with people who need to view them without editing the source data.",
//   'Each worksheet in the Excel file is converted to a page in the PDF. Cell borders, background colours, column widths, row heights, and merged cells are all reproduced.',
//   'XLS is the older Excel binary format used before 2007. XLSX is the modern Open XML format. Both are supported by this converter.',
//   'For very wide spreadsheets, the PDF output follows the print settings defined in the worksheet. For best results, set a print area in Excel before converting.',
// ];

// export default function ExcelToPdfPage() {
//   return (
//     <>
//       <JsonLd toolName="Excel to PDF Converter" toolDescription={DESCRIPTION} toolUrl="/excel-to-pdf" faqs={faqs} />
//       <ExcelToPdfToolPage />
//       <div className="max-w-6xl mx-auto px-6 pb-16">
//         <SeoContent heading="How to Convert Excel to PDF" body={body} faqs={faqs} relatedTools={relatedTools} />
//       </div>
//     </>
//   );
// }



import type { Metadata } from 'next';
import ExcelToPdfToolPage from './ToolPage';
import { SeoContent } from '../../components/seo/SeoContent';
import { JsonLd } from '../../components/seo/JsonLd';

const TITLE       = 'Excel to PDF Converter Online Free | XLS to PDF';
const DESCRIPTION = 'Convert Excel spreadsheets to professional PDFs online free with Freenoo—no formatting issues, works with formulas and charts perfectly.';
const CANONICAL   = 'https://freenoo.com/excel-to-pdf';

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