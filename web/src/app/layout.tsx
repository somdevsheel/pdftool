import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import '../styles/globals.css';

const SITE_URL  = 'https://Freenoo';
const SITE_NAME = 'Freenoo';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1c1c1c',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  
   verification: {
    google: 'e610fc5e555de602',
  },

  title: {
    default: `${SITE_NAME} — Free Online PDF`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'Free Online PDF: merge, split, compress, rotate, edit, convert, sign, and OCR your PDF files. No signup. Files deleted after 60 minutes.',

  keywords: [
    'Freenoo', 'merge PDF', 'split PDF', 'compress PDF', 'rotate PDF',
    'PDF editor', 'JPG to PDF', 'PDF to Word', 'PDF OCR', 'sign PDF',
    'free Freenoo online',
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
    title: `${SITE_NAME} — Free Online PDF`,
    description:
      'Free Online PDF: merge, split, compress, rotate, edit, convert, sign, and OCR. No account needed.',
  },

  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Free Online PDF`,
    description: 'Merge, split, compress, rotate, convert and sign PDFs online for free.',
  },

  alternates: {
    canonical: SITE_URL,
  },

  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico',
  },
};

/** Site-wide Organisation schema */
function OrganizationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    description: 'Free Online PDF — merge, split, compress, rotate, edit, and convert PDFs.',
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
    description: 'Free Online PDF: merge, split, compress, rotate, edit, convert, sign, and OCR.',
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

        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-VB17887Q0D" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-VB17887Q0D');
            `,
          }}
        />
      </head>
      <body>{children}</body>
      <Analytics />
    </html>
  );
}
