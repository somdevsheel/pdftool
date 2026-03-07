// import type { Metadata } from 'next';

// export const metadata: Metadata = {
//   title: "Crop PDF Pages Online Free — Trim PDF Margins",
//   description: "Crop PDF pages to remove unwanted margins or white space. Free online PDF crop tool, no account needed.",
//   alternates: { canonical: 'https://pdf.tools/crop' },
//   openGraph: {
//     title: "Crop PDF Pages Online Free — Trim PDF Margins",
//     description: "Crop PDF pages to remove unwanted margins or white space. Free online PDF crop tool, no account needed.",
//     url: 'https://pdf.tools/crop',
//     type: 'website',
//   },
// };

// import { ToolLayout } from '../../components/ToolLayout';

// export default function Page() {
//   return (
//     <ToolLayout title="Crop pages" tagline="Trim margins and resize PDF pages" icon="✂️" accentColor="#3FC87A">
//       <div style={{ padding: '64px 0', textAlign: 'center' }}>
//         <div style={{
//           width: 64, height: 64, borderRadius: 16, margin: '0 auto 20px',
//           background: 'var(--surface-2)', border: '1px solid var(--border)',
//           display: 'flex', alignItems: 'center', justifyContent: 'center',
//           fontSize: 28,
//         }}>✂️</div>
//         <h2 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>Crop pages</h2>
//         <p style={{ color: 'var(--text-muted)', fontSize: 14, maxWidth: 360, margin: '0 auto 24px' }}>Trim margins and resize PDF pages</p>
//         <div className="stamp">🚧 Coming soon</div>
//       </div>
//     </ToolLayout>
//   );
// }






import type { Metadata } from 'next';
import ToolPage from './ToolPage';

export const metadata: Metadata = {
  title: "Crop PDF Pages Online Free — Trim PDF Margins",
  description: "Crop PDF pages to remove unwanted margins or white space. Free online PDF crop tool, no account needed.",
  alternates: { canonical: 'https://pdf.tools/crop' },
  openGraph: {
    title: "Crop PDF Pages Online Free — Trim PDF Margins",
    description: "Crop PDF pages to remove unwanted margins or white space. Free online PDF crop tool, no account needed.",
    url: 'https://pdf.tools/crop',
    type: 'website',
  },
};

export default function Page() {
  return <ToolPage />;
}