import type { Metadata } from 'next';
import CompressPage from './ToolPage';

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  alternates: { canonical: 'https://freenoo.com/compress-pdf' },
};

export default function Page() {
  return <CompressPage />;
}
