const SITE_URL  = 'https://freenoo.com';
const SITE_NAME = 'Freenoo';

export interface JsonLdProps {
  toolName: string;
  toolDescription: string;
  /** Path only, e.g. "/merge-pdf" */
  toolUrl: string;
  faqs?: { q: string; a: string }[];
}

/**
 * Pure Server Component — emits three JSON-LD blocks:
 *  1. WebApplication  (for Google's app/tool rich results)
 *  2. FAQPage         (for accordion rich results in SERPs)
 *  3. BreadcrumbList  (breadcrumb trail: Home › Tool Name)
 */
export function JsonLd({ toolName, toolDescription, toolUrl, faqs }: JsonLdProps) {
  const fullUrl = `${SITE_URL}${toolUrl}`;

  // ── WebApplication ─────────────────────────────────────────────────────
  const webApp = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: toolName,
    description: toolDescription,
    url: fullUrl,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  };

  // ── FAQPage ────────────────────────────────────────────────────────────
  const faqSchema = faqs && faqs.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      }
    : null;

  // ── BreadcrumbList ─────────────────────────────────────────────────────
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: toolName,
        item: fullUrl,
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApp) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
    </>
  );
}
