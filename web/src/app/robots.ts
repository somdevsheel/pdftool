import { MetadataRoute } from 'next';

const BASE_URL = 'https://freenoo.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',          // API endpoints
          '/viewer',        // Internal PDF viewer (not a landing page)
          '/_next/',        // Next.js internals
          '/merge',         // Legacy short routes (noindexed, but belt-and-suspenders)
          '/split',
          '/compress',
          '/rotate',
          '/convert',
          '/edit',
          '/organize',
          '/extract',
          '/reorder',
          '/protect',
          '/ocr',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
