import Link from 'next/link';

export interface RelatedTool {
  href: string;
  label: string;
  desc: string;
}

export interface SeoContentProps {
  heading: string;
  /** Array of paragraph strings — target 250–400 words total. */
  body: string[];
  faqs: { q: string; a: string }[];
  relatedTools: RelatedTool[];
}

/**
 * Pure Server Component — no event handlers, zero client JS.
 * Hover effects via scoped <style> injected once on server render.
 */
export function SeoContent({ heading, body, faqs, relatedTools }: SeoContentProps) {
  return (
    <>
      {/* Scoped styles — no runtime JS, no CSS import needed */}
      <style>{`
        .seo-tool-card {
          display: block;
          padding: 12px 16px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          text-decoration: none;
          transition: border-color 0.14s, background 0.14s;
        }
        .seo-tool-card:hover {
          border-color: var(--border-light);
          background: var(--surface-2);
        }
        .seo-faq-item {
          padding: 14px 18px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
        }
        .seo-faq-item + .seo-faq-item {
          margin-top: 10px;
        }
      `}</style>

      <section
        aria-label="About this tool"
        style={{ marginTop: 64, paddingTop: 40, borderTop: '1px solid var(--border)' }}
      >
        {/* ── About copy ────────────────────────────────────────── */}
        <div style={{ maxWidth: 740 }}>
          <h2 style={{
            fontSize: 18, fontWeight: 700, color: 'var(--text)',
            marginBottom: 16, letterSpacing: '-0.01em',
          }}>
            {heading}
          </h2>
          {body.map((para, i) => (
            <p key={i} style={{
              fontSize: 14, lineHeight: 1.78,
              color: 'var(--text-soft)', marginBottom: 14,
            }}>
              {para}
            </p>
          ))}
        </div>

        {/* ── FAQ section ───────────────────────────────────────── */}
        {faqs.length > 0 && (
          <div style={{ maxWidth: 740, marginTop: 40 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>
              Frequently Asked Questions
            </h2>
            <div>
              {faqs.map((faq, i) => (
                <div key={i} className="seo-faq-item">
                  <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
                    {faq.q}
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--text-soft)', lineHeight: 1.65, margin: 0 }}>
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Related tools ─────────────────────────────────────── */}
        {relatedTools.length > 0 && (
          <div style={{ marginTop: 44 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>
              Related Tools
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
              gap: 10,
            }}>
              {relatedTools.map((tool) => (
                <Link key={tool.href} href={tool.href} className="seo-tool-card">
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', marginBottom: 3 }}>
                    {tool.label}
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                    {tool.desc}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
        {/* Privacy & Terms */}
        <div style={{ marginTop: '40px', paddingTop: '16px', borderTop: '1px solid var(--border)', display: 'flex', gap: '16px' }}>
          <Link href="/privacy" style={{ fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy Policy</Link>
          <Link href="/terms" style={{ fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'none' }}>Terms & Conditions</Link>
        </div>

      </section>
    </>
  );
}
