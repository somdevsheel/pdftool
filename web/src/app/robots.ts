// import { MetadataRoute } from 'next';

// const BASE_URL = 'https://www.freenoo.com';

// export default function robots(): MetadataRoute.Robots {
//   return {
//     rules: [
//       {
//         userAgent: '*',
//         allow: '/',
//         disallow: [
//           '/api/',          // API endpoints
//           '/viewer',        // Internal PDF viewer (not a landing page)
//           '/_next/',        // Next.js internals
//           '/merge',         // Legacy short routes (noindexed, but belt-and-suspenders)
//           '/split',
//           '/compress',
//           '/rotate',
//           '/convert',
//           '/edit',
//           '/organize',
//           '/extract',
//           '/reorder',
//           '/protect',
//           '/ocr',
//         ],
//       },
//     ],
//     sitemap: `${BASE_URL}/sitemap.xml`,
//     host: BASE_URL,
//   };
// }





import { MetadataRoute } from 'next';

// Canonical host — must match the sitemap BASE_URL and the live domain (www).
const BASE_URL = 'https://www.freenoo.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Only disallow genuinely non-indexable paths.
        //
        // Do NOT list tool routes here. robots.txt Disallow is a PREFIX match,
        // so `/merge` would also block `/merge-pdf`, `/compress` would block
        // `/compress-pdf` and `/compress-pdf-to-100kb`, etc. The legacy short
        // routes (/merge, /split, ...) are already 301-redirected to their
        // canonical `-pdf` pages in next.config.js — that handles canonicalization
        // on its own, without hiding the real pages from crawlers.
        //
        // Do NOT block /_next/ either: it contains the JS/CSS chunks Googlebot
        // needs to render the pages. Blocking them breaks rendering of the whole
        // site. (If anything under _next ever needs hiding, scope it to
        // /_next/data/ — never the static assets.)
        disallow: [
          '/api/',    // Backend API endpoints — nothing to index
          '/viewer',  // Internal PDF viewer — not a landing page
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
