/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',

  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
  },

  // The repo root has its own package-lock.json; build from this app's folder.
  // pdfjs-dist optionally requires "canvas" (Node only); point it at an empty module.
  turbopack: {
    root: __dirname,
    resolveAlias: { canvas: './src/lib/empty-module.ts' },
  },

  // Exactly the hosts our news/blog images come from. Broad wildcards (any
  // *.amazonaws.com / *.cloudfront.net host) let anyone use this site's image
  // optimizer as a free proxy for any bucket.
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'd1afw9oa08qpwz.cloudfront.net' },
      { protocol: 'https', hostname: 'd14ffvfop2p6yc.cloudfront.net' },
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // A full script CSP would break Google Tag Manager, so only framing is locked down.
          { key: 'Content-Security-Policy', value: "frame-ancestors 'none'" },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },

  async redirects() {
    return [
      { source: '/merge',           destination: '/merge-pdf',    permanent: true },
      { source: '/split',           destination: '/split-pdf',    permanent: true },
      { source: '/compress',        destination: '/compress-pdf', permanent: true },
      { source: '/rotate',          destination: '/rotate-pdf',   permanent: true },
      { source: '/convert',         destination: '/jpg-to-pdf',   permanent: true },
      { source: '/edit',            destination: '/edit-pdf',     permanent: true },
      { source: '/protect',         destination: '/protect-pdf',  permanent: true },
      { source: '/ocr',             destination: '/pdf-ocr',      permanent: true },
      { source: '/fill-sign',       destination: '/sign-pdf',     permanent: true },
      { source: '/convert-to-pdf',  destination: '/jpg-to-pdf',   permanent: true },
    ];
  },
};

module.exports = nextConfig;
