import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export interface MailOptions {
  to: string | string[];
  subject: string;
  html: string;
}

export async function sendMail({ to, subject, html }: MailOptions) {
  const info = await transporter.sendMail({
    from: `"${process.env.GMAIL_FROM_NAME || 'PDF.tools'}" <${process.env.GMAIL_USER}>`,
    to: Array.isArray(to) ? to.join(', ') : to,
    subject,
    html,
  });
  return info;
}

// ─── Email Templates ──────────────────────────────────────────────────────────

export function welcomeEmailHtml(email: string): string {
  const unsubUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/unsubscribe?email=${encodeURIComponent(email)}`;
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Welcome to PDF.tools</title>
</head>
<body style="margin:0;padding:0;background:#0f0f0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f0f;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#141414;border-radius:16px;overflow:hidden;border:1px solid #1f1f1f;max-width:600px;width:100%;">
        
        <!-- Red top bar -->
        <tr><td style="height:4px;background:linear-gradient(90deg,#eb1000,#ff6b35);"></td></tr>
        
        <!-- Header -->
        <tr><td style="padding:36px 40px 28px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <div style="display:inline-flex;align-items:center;gap:10px;">
                  <div style="width:36px;height:36px;background:#eb1000;border-radius:8px;display:inline-block;text-align:center;line-height:36px;font-weight:700;font-size:18px;color:#fff;">P</div>
                  <span style="font-size:20px;font-weight:700;color:#fff;">PDF<span style="color:#eb1000;">.tools</span></span>
                </div>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Hero -->
        <tr><td style="padding:0 40px 32px;">
          <h1 style="margin:0 0 12px;font-size:28px;font-weight:800;color:#fff;line-height:1.2;">
            You're subscribed! 🎉
          </h1>
          <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#aaa;">
            Welcome to the <strong style="color:#fff;">PDF.tools</strong> weekly digest. Every week we send you the best PDF tips, tool guides, and tech news — straight to your inbox.
          </p>
          <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#aaa;">
            Here's what you can expect:
          </p>
          
          <!-- Feature list -->
          <table width="100%" cellpadding="0" cellspacing="0">
            ${[
              ['📝', 'Blog Posts', 'PDF tips & step-by-step tutorials'],
              ['📰', 'Tech News', 'Latest in AI, tools & tech'],
              ['🛠️', 'Tool Guides', 'Get the most from PDF.tools'],
            ].map(([icon, title, desc]) => `
            <tr>
              <td style="padding:10px 0;">
                <table cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="width:44px;height:44px;background:#1a1a1a;border-radius:10px;text-align:center;vertical-align:middle;font-size:20px;">${icon}</td>
                    <td style="padding-left:14px;">
                      <p style="margin:0;font-size:14px;font-weight:600;color:#fff;">${title}</p>
                      <p style="margin:2px 0 0;font-size:13px;color:#666;">${desc}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>`).join('')}
          </table>
        </td></tr>

        <!-- CTA -->
        <tr><td style="padding:0 40px 36px;">
          <a href="${process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://freenoo.com'}"
            style="display:inline-block;background:#eb1000;color:#fff;font-size:15px;font-weight:700;padding:14px 32px;border-radius:10px;text-decoration:none;">
            Explore PDF Tools →
          </a>
        </td></tr>

        <!-- Divider -->
        <tr><td style="height:1px;background:#1f1f1f;margin:0 40px;"></td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 40px;text-align:center;">
          <p style="margin:0 0 8px;font-size:12px;color:#444;">
            You subscribed to PDF.tools updates. No spam, ever.
          </p>
          <a href="${unsubUrl}" style="font-size:12px;color:#555;text-decoration:underline;">
            Unsubscribe
          </a>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function digestEmailHtml(
  articles: { title: string; summary: string; slug: string; tag: string; tagColor: string; imageUrl: string; contentType: string }[],
  emails: string[]
): string {
  const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://freenoo.com';

  const articleCards = articles.slice(0, 8).map(a => {
    const href = `${frontendUrl}/${a.contentType === 'blog' ? 'blog' : 'tech-news'}/${a.slug}`;
    return `
    <tr><td style="padding:0 0 20px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-radius:12px;overflow:hidden;border:1px solid #222;">
        <tr>
          <td style="padding:18px 20px;">
            <p style="margin:0 0 6px;">
              <span style="font-size:11px;font-weight:700;padding:3px 8px;border-radius:20px;background:${a.tagColor}22;color:${a.tagColor};">${a.tag}</span>
            </p>
            <h3 style="margin:8px 0 6px;font-size:16px;font-weight:700;color:#fff;line-height:1.3;">${a.title}</h3>
            <p style="margin:0 0 12px;font-size:13px;color:#888;line-height:1.6;">${a.summary.slice(0, 120)}...</p>
            <a href="${href}" style="font-size:13px;font-weight:600;color:#eb1000;text-decoration:none;">Read more →</a>
          </td>
        </tr>
      </table>
    </td></tr>`;
  }).join('');

  // Per-recipient unsubscribe handled outside; use placeholder
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#0f0f0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f0f;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#141414;border-radius:16px;overflow:hidden;border:1px solid #1f1f1f;max-width:600px;width:100%;">
        
        <tr><td style="height:4px;background:linear-gradient(90deg,#eb1000,#ff6b35);"></td></tr>
        
        <!-- Header -->
        <tr><td style="padding:32px 40px 20px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <span style="font-size:20px;font-weight:700;color:#fff;">PDF<span style="color:#eb1000;">.tools</span></span>
                <span style="margin-left:10px;font-size:12px;color:#444;font-weight:500;">Weekly Digest</span>
              </td>
              <td align="right" style="font-size:12px;color:#444;">
                ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Headline -->
        <tr><td style="padding:0 40px 28px;">
          <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#fff;">This week's highlights</h1>
          <p style="margin:0;font-size:14px;color:#666;">${articles.length} new articles from PDF.tools</p>
        </td></tr>

        <!-- Articles -->
        <tr><td style="padding:0 40px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${articleCards}
          </table>
        </td></tr>

        <!-- CTA -->
        <tr><td style="padding:8px 40px 36px;">
          <a href="${frontendUrl}/tech-news"
            style="display:inline-block;background:#1a1a1a;color:#888;font-size:13px;font-weight:600;padding:12px 24px;border-radius:8px;text-decoration:none;border:1px solid #2a2a2a;margin-right:10px;">
            More News →
          </a>
          <a href="${frontendUrl}/blog"
            style="display:inline-block;background:#eb1000;color:#fff;font-size:13px;font-weight:600;padding:12px 24px;border-radius:8px;text-decoration:none;">
            Read Blog →
          </a>
        </td></tr>

        <tr><td style="height:1px;background:#1f1f1f;"></td></tr>

        <!-- Footer — unsubscribe is per-email, injected at send time -->
        <tr><td style="padding:24px 40px;text-align:center;">
          <p style="margin:0 0 8px;font-size:12px;color:#444;">PDF.tools · Weekly Digest · No spam</p>
          <span style="font-size:12px;color:#555;">{{UNSUBSCRIBE_LINK}}</span>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
