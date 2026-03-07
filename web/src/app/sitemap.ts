import { MetadataRoute } from 'next';

const BASE_URL = 'https://pdf.tools';

// ─── Priority tiers ────────────────────────────────────────────────────────
//  1.0  Homepage
//  0.9  Primary SEO tool pages (one-per-intent, fully built)
//  0.7  Long-tail programmatic variants (reuse same component, different keyword)
//  0.5  Supporting pages (page-manipulation tools)
//  0.3  Stub pages (coming soon — indexed but low priority)

type Freq = MetadataRoute.Sitemap[number]['changeFrequency'];

function entry(url: string, priority: number, freq: Freq = 'monthly'): MetadataRoute.Sitemap[number] {
  return { url: `${BASE_URL}${url}`, lastModified: new Date(), changeFrequency: freq, priority };
}

// ─── Primary tool pages ───────────────────────────────────────────────────
const PRIMARY: string[] = [
  '/merge-pdf',
  '/compress-pdf',
  '/split-pdf',
  '/rotate-pdf',
  '/jpg-to-pdf',
  '/edit-pdf',
  '/pdf-to-word',
  '/pdf-ocr',
  '/protect-pdf',
  '/sign-pdf',
];

// ─── Long-tail keyword variants ───────────────────────────────────────────
const LONG_TAIL: string[] = [
  '/merge-pdf-online',
  '/combine-pdf-files',
  '/compress-pdf-to-100kb',
  '/reduce-pdf-size',
  '/pdf-compressor',
  '/split-pdf-online',
  '/pdf-to-word-converter',
  '/convert-image-to-pdf',
];

// ─── Supporting (page-management tools) ──────────────────────────────────
const SUPPORTING: string[] = [
  '/organize-pages',
  '/delete-pages',
  '/extract-pages',
  '/reorder-pages',
];

// ─── Stub pages (coming soon — real URLs, just not fully built yet) ───────
const STUBS: string[] = [
  '/pdf-to-jpg',
  '/pdf-to-ppt',
  '/pdf-to-excel',
  '/word-to-pdf',
  '/ppt-to-pdf',
  '/excel-to-pdf',
  '/fill-sign',
  '/add-signature',
  '/request-signatures',
  '/number-pages',
  '/crop',
  '/insert',
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // Homepage
    entry('/', 1.0, 'weekly'),

    // Primary SEO tool pages — checked more often as content may be refreshed
    ...PRIMARY.map((p) => entry(p, 0.9, 'monthly')),

    // Long-tail programmatic pages
    ...LONG_TAIL.map((p) => entry(p, 0.7, 'monthly')),

    // Supporting page-management tools
    ...SUPPORTING.map((p) => entry(p, 0.5, 'monthly')),

    // Stub pages — included for crawlability but at low priority
    ...STUBS.map((p) => entry(p, 0.3, 'yearly')),
  ];
}
