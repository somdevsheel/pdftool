import type { Metadata } from 'next';
import ReorderPage from './ToolPage';

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  alternates: { canonical: 'https://pdf.tools/reorder-pages' },
};

export default function Page() {
  return <ReorderPage />;
}
