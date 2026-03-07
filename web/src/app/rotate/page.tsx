import type { Metadata } from 'next';
import RotatePage from './ToolPage';

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  alternates: { canonical: 'https://pdf.tools/rotate-pdf' },
};

export default function Page() {
  return <RotatePage />;
}
