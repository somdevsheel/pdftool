// Single source of truth for site identity + per-page SEO metadata.
// Every page should build its metadata through buildToolMetadata() so that
// canonical, Open Graph, and Twitter tags stay consistent and always use the
// canonical host (www). Do not hardcode the host anywhere else.

import type { Metadata } from 'next';

export const SITE_URL = 'https://www.freenoo.com'; // canonical host — must match robots.ts + sitemap.ts
export const SITE_NAME = 'Freenoo';

/** Absolute URL for a path. `absoluteUrl('/merge-pdf')` -> https://www.freenoo.com/merge-pdf */
export function absoluteUrl(path: string): string {
  if (!path || path === '/') return SITE_URL;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

// The layout title template already appends " | Freenoo" to every page title.
// Strip a trailing brand from a passed-in title so we never double it, and so
// migrating existing pages (whose titles still include "| Freenoo") is safe.
const BRAND_SUFFIX = new RegExp(`\\s*[|\\-–—]\\s*${SITE_NAME}\\s*$`, 'i');
function stripBrand(title: string): string {
  return title.replace(BRAND_SUFFIX, '').trim();
}

export interface ToolMetaInput {
  /** Route path, e.g. "/merge-pdf". Use "/" for the homepage. */
  path: string;
  /** Page title WITHOUT the brand suffix — the layout template adds "| Freenoo". */
  title: string;
  description: string;
  /** Optional social share image (absolute or root-relative path). */
  ogImage?: string;
}

/**
 * Build a complete, consistent Metadata object for a tool/landing page.
 * - <title>            : base title (layout template appends "| Freenoo" once)
 * - canonical          : always the www host + path
 * - Open Graph + Twitter: page-specific, brand included, pointed at the canonical URL
 */
export function buildToolMetadata({ path, title, description, ogImage }: ToolMetaInput): Metadata {
  const base = stripBrand(title);
  const url = absoluteUrl(path);
  const social = `${base} | ${SITE_NAME}`;
  const images = ogImage ? [ogImage] : undefined;

  return {
    title: base,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      url,
      title: social,
      description,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: social,
      description,
      ...(images ? { images } : {}),
    },
  };
}
