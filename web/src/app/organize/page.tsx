import type { Metadata } from 'next';
import OrganizePage from './ToolPage';

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  alternates: { canonical: 'https://pdf.tools/organize-pages' },
};

export default function Page() {
  return <OrganizePage />;
}
