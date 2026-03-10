// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   output: 'standalone',

//   env: {
//     NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
//   },

//   // Allow PDF.js worker to load without canvas
//   webpack: (config) => {
//     config.resolve.alias.canvas = false;
//     return config;
//   },

//   /**
//    * 301 redirects: old short routes → canonical SEO routes.
//    * Search engines transfer all link equity to the new URL.
//    * Old URLs remain functional for users who have bookmarks.
//    */
//   async redirects() {
//     return [
//       // Core tools
//       { source: '/merge',    destination: '/merge-pdf',    permanent: true },
//       { source: '/split',    destination: '/split-pdf',    permanent: true },
//       { source: '/compress', destination: '/compress-pdf', permanent: true },
//       { source: '/rotate',   destination: '/rotate-pdf',   permanent: true },
//       { source: '/convert',  destination: '/jpg-to-pdf',   permanent: true },
//       { source: '/edit',     destination: '/edit-pdf',     permanent: true },
//       { source: '/protect',  destination: '/protect-pdf',  permanent: true },
//       { source: '/ocr',      destination: '/pdf-ocr',      permanent: true },
//       // E-sign
//       { source: '/fill-sign',           destination: '/sign-pdf',    permanent: true },
//       // Convert variants
//       { source: '/convert-to-pdf',      destination: '/jpg-to-pdf',  permanent: true },
//     ];
//   },
// };

// module.exports = nextConfig;






/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',

  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd1afw9oa08qpwz.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: '**.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
    ],
  },

  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
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