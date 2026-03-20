import type { Metadata } from 'next';
import SplitPage from './ToolPage';

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  alternates: { canonical: 'https://freenoo.com/split-pdf' },
};

export default function Page() {
  return <SplitPage />;
}
