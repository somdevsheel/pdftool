import type { Metadata } from 'next';
import ToolPage from './ToolPage';

export const metadata: Metadata = {
  title: "Add Page Numbers to PDF Online Free",
  description: "Add page numbers to a PDF document online. Choose position and starting number. Free, no account required.",
  alternates: { canonical: 'https://pdf.tools/number-pages' },
  openGraph: {
    title: "Add Page Numbers to PDF Online Free",
    description: "Add page numbers to a PDF document online. Choose position and starting number. Free, no account required.",
    url: 'https://pdf.tools/number-pages',
    type: 'website',
  },
};

export default function Page() {
  return <ToolPage />;
}