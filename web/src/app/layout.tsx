import type { Metadata, Viewport } from 'next';
import '../styles/globals.css';

const SITE_URL  = 'https://pdf.tools';
const SITE_NAME = 'PDF.tools';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1c1c1c',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: `${SITE_NAME} — Free Online PDF Tools`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'Free online PDF tools: merge, split, compress, rotate, edit, convert, sign, and OCR your PDF files. No signup. Files deleted after 60 minutes.',

  keywords: [
    'PDF tools', 'merge PDF', 'split PDF', 'compress PDF', 'rotate PDF',
    'PDF editor', 'JPG to PDF', 'PDF to Word', 'PDF OCR', 'sign PDF',
    'free PDF tools online',
  ],

  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Free Online PDF Tools`,
    description:
      'Free online PDF tools: merge, split, compress, rotate, edit, convert, sign, and OCR. No account needed.',
  },

  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Free Online PDF Tools`,
    description: 'Merge, split, compress, rotate, convert and sign PDFs online for free.',
  },

  alternates: {
    canonical: SITE_URL,
  },
};

/** Site-wide Organisation schema */
function OrganizationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    description: 'Free online PDF tools — merge, split, compress, rotate, edit, and convert PDFs.',
    sameAs: [],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/** WebSite schema — enables Google Sitelinks Searchbox eligibility */
function WebSiteJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: 'Free online PDF tools: merge, split, compress, rotate, edit, convert, sign, and OCR.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body>{children}</body>
    </html>
  );
}
