import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const FROM = `"${process.env.GMAIL_FROM_NAME || 'Freenoo'}" <${process.env.GMAIL_USER}>`;
const SITE_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://freenoo.com.com';
const ADMIN_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://admin.freenoo.com';

function wrapHTML(body: string, unsubscribeToken?: string) {
  const footer = unsubscribeToken ? `
    <tr><td style="padding:24px 40px;text-align:center;border-top:1px solid #222;">
      <p style="margin:0;font-size:12px;color:#555;">
        You subscribed at Freenoo.<br/>
        <a href="${ADMIN_URL}/api/unsubscribe?token=${unsubscribeToken}" style="color:#eb1000;text-decoration:underline;">Unsubscribe</a>
      </p>
    </td></tr>` : '';

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#0f0f0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f0f;padding:40px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#111;border-radius:16px;overflow:hidden;border:1px solid #1e1e1e;">
<tr><td style="background:#1a1a1a;padding:24px 40px;border-bottom:1px solid #1e1e1e;">
  <table cellpadding="0" cellspacing="0"><tr>
    <td style="background:#eb1000;border-radius:8px;width:32px;height:32px;text-align:center;vertical-align:middle;">
      <span style="color:#fff;font-weight:800;font-size:16px;line-height:32px;">P</span>
    </td>
    <td style="padding-left:10px;">
      <span style="color:#fff;font-weight:700;font-size:16px;">PDF</span><span style="color:#eb1000;font-weight:700;font-size:16px;">.tools</span>
    </td>
  </tr></table>
</td></tr>
${body}
${footer}
</table>
</td></tr></table>
</body></html>`;
}

export async function sendWelcomeEmail(email: string, unsubscribeToken: string) {
  const body = `
<tr><td style="padding:40px;">
  <p style="margin:0 0 8px;font-size:28px;">👋</p>
  <h1 style="margin:0 0 12px;font-size:22px;font-weight:800;color:#fff;">Welcome to Freenoo!</h1>
  <p style="margin:0 0 20px;font-size:14px;color:#aaa;line-height:1.7;">You are now subscribed to our weekly digest. Every week you will get:</p>
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
    <tr><td style="padding:10px 0;border-bottom:1px solid #1e1e1e;font-size:14px;color:#ccc;">📰 &nbsp;Latest tech news from the PDF world</td></tr>
    <tr><td style="padding:10px 0;border-bottom:1px solid #1e1e1e;font-size:14px;color:#ccc;">📝 &nbsp;PDF tips, tutorials &amp; how-to guides</td></tr>
    <tr><td style="padding:10px 0;font-size:14px;color:#ccc;">🛠️ &nbsp;New tool updates &amp; features</td></tr>
  </table>
  <a href="${SITE_URL}/tech-news" style="display:inline-block;background:#eb1000;color:#fff;font-weight:700;font-size:14px;padding:14px 28px;border-radius:10px;text-decoration:none;">Read Latest News →</a>
  <p style="margin:24px 0 0;font-size:12px;color:#555;">No spam, ever. Just good content once a week.</p>
</td></tr>`;

  await transporter.sendMail({
    from: FROM, to: email,
    subject: "👋 Welcome to Freenoo — You're subscribed!",
    html: wrapHTML(body, unsubscribeToken),
  });
}

export interface DigestArticle {
  title: string; summary: string; slug: string;
  tag: string; tagColor: string; readTime: number; contentType: 'news' | 'blog';
}

export async function sendDigestEmail(email: string, unsubscribeToken: string, articles: DigestArticle[]) {
  const news = articles.filter(a => a.contentType === 'news');
  const blog = articles.filter(a => a.contentType === 'blog');
  const weekStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  function card(a: DigestArticle) {
    const href = `${SITE_URL}/${a.contentType === 'blog' ? 'blog' : 'tech-news'}/${a.slug}`;
    return `<tr><td style="padding:14px 0;border-bottom:1px solid #1a1a1a;">
      <span style="display:inline-block;background:${a.tagColor}22;color:${a.tagColor};font-size:11px;font-weight:600;padding:2px 10px;border-radius:20px;margin-bottom:6px;">${a.tag}</span>
      <p style="margin:0 0 5px;font-size:14px;font-weight:700;color:#fff;"><a href="${href}" style="color:#fff;text-decoration:none;">${a.title}</a></p>
      <p style="margin:0 0 6px;font-size:12px;color:#888;line-height:1.6;">${a.summary.slice(0, 110)}${a.summary.length > 110 ? '...' : ''}</p>
      <a href="${href}" style="font-size:12px;color:#eb1000;text-decoration:none;font-weight:600;">Read ${a.readTime} min →</a>
    </td></tr>`;
  }

  function section(title: string, icon: string, items: DigestArticle[]) {
    if (!items.length) return '';
    return `<tr><td style="padding:28px 40px 0;">
      <p style="margin:0 0 14px;font-size:11px;font-weight:700;color:#555;text-transform:uppercase;letter-spacing:0.1em;">${icon} ${title}</p>
      <table width="100%" cellpadding="0" cellspacing="0">${items.slice(0, 5).map(card).join('')}</table>
    </td></tr>`;
  }

  const body = `
<tr><td style="padding:28px 40px 20px;background:#1a1a1a;border-bottom:1px solid #1e1e1e;">
  <p style="margin:0 0 4px;font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.1em;">Weekly Digest · ${weekStr}</p>
  <h1 style="margin:0;font-size:20px;font-weight:800;color:#fff;">Your Freenoo weekly roundup</h1>
  <p style="margin:6px 0 0;font-size:13px;color:#888;">${articles.length} new article${articles.length !== 1 ? 's' : ''} this week</p>
</td></tr>
${section('Tech News', '📰', news)}
${section('Blog Posts', '📝', blog)}
<tr><td style="padding:28px 40px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-radius:10px;">
    <tr><td style="padding:18px 22px;">
      <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#fff;">Free Freenoo — No signup needed</p>
      <p style="margin:0 0 10px;font-size:12px;color:#666;">Merge, split, compress, convert and more.</p>
      <a href="${SITE_URL}" style="display:inline-block;background:#eb1000;color:#fff;font-weight:700;font-size:12px;padding:10px 18px;border-radius:8px;text-decoration:none;">Try Freenoo →</a>
    </td></tr>
  </table>
</td></tr>`;

  await transporter.sendMail({
    from: FROM, to: email,
    subject: `✉️ Your Freenoo Weekly Digest — ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
    html: wrapHTML(body, unsubscribeToken),
  });
}
