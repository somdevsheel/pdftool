import type { Metadata } from 'next';
import EditPage from './ToolPage';

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  alternates: { canonical: 'https://pdf.tools/edit-pdf' },
};

export default function Page() {
  return <EditPage />;
}
