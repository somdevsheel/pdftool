import type { Metadata } from 'next';
import MergePage from './ToolPage';

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  alternates: { canonical: 'https://pdf.tools/merge-pdf' },
};

export default function Page() {
  return <MergePage />;
}
