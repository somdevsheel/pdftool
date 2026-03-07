// import type { Metadata } from 'next';

// export const metadata: Metadata = {
//   title: "Insert Pages into PDF Online Free | Add PDF Pages",
//   description: "Insert pages into an existing PDF online. Add blank pages or pages from another PDF. Free, no signup needed.",
//   alternates: { canonical: 'https://pdf.tools/insert' },
//   openGraph: {
//     title: "Insert Pages into PDF Online Free | Add PDF Pages",
//     description: "Insert pages into an existing PDF online. Add blank pages or pages from another PDF. Free, no signup needed.",
//     url: 'https://pdf.tools/insert',
//     type: 'website',
//   },
// };

// import { ToolLayout } from '../../components/ToolLayout';

// export default function Page() {
//   return (
//     <ToolLayout title="Insert pages" tagline="Add pages into an existing PDF" icon="➕" accentColor="#5BB8F5">
//       <div style={{ padding: '64px 0', textAlign: 'center' }}>
//         <div style={{
//           width: 64, height: 64, borderRadius: 16, margin: '0 auto 20px',
//           background: 'var(--surface-2)', border: '1px solid var(--border)',
//           display: 'flex', alignItems: 'center', justifyContent: 'center',
//           fontSize: 28,
//         }}>➕</div>
//         <h2 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>Insert pages</h2>
//         <p style={{ color: 'var(--text-muted)', fontSize: 14, maxWidth: 360, margin: '0 auto 24px' }}>Add pages into an existing PDF</p>
//         <div className="stamp">🚧 Coming soon</div>
//       </div>
//     </ToolLayout>
//   );
// }






import type { Metadata } from 'next';
import ToolPage from './ToolPage';

export const metadata: Metadata = {
  title: "Insert Pages into PDF Online Free | Add PDF Pages",
  description: "Insert pages into an existing PDF online. Add blank pages or pages from another PDF. Free, no signup needed.",
  alternates: { canonical: 'https://pdf.tools/insert' },
  openGraph: {
    title: "Insert Pages into PDF Online Free | Add PDF Pages",
    description: "Insert pages into an existing PDF online. Add blank pages or pages from another PDF. Free, no signup needed.",
    url: 'https://pdf.tools/insert',
    type: 'website',
  },
};

export default function Page() {
  return <ToolPage />;
}