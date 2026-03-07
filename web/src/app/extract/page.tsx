import type { Metadata } from 'next';
import ExtractPage from './ToolPage';

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  alternates: { canonical: 'https://pdf.tools/extract-pages' },
};

export default function Page() {
  return <ExtractPage />;
}
