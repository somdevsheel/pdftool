import type { Metadata } from 'next';
import ConvertPage from './ToolPage';

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  alternates: { canonical: 'https://freenoo.com/jpg-to-pdf' },
};

export default function Page() {
  return <ConvertPage />;
}
