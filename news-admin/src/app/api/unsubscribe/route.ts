import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Subscriber } from '@/lib/models/Subscriber';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return new NextResponse(unsubscribePage('Invalid link', 'This unsubscribe link is invalid or has expired.', false), {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    await connectDB();
    const subscriber = await Subscriber.findOne({ unsubscribeToken: token });

    if (!subscriber) {
      return new NextResponse(unsubscribePage('Already unsubscribed', 'You are not currently subscribed.', false), {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    if (!subscriber.active) {
      return new NextResponse(unsubscribePage('Already unsubscribed', 'You have already been unsubscribed from our emails.', false), {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    subscriber.active = false;
    await subscriber.save();

    return new NextResponse(unsubscribePage('Unsubscribed', "You've been unsubscribed successfully. You won't receive any more emails from us.", true), {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (err) {
    return new NextResponse(unsubscribePage('Error', 'Something went wrong. Please try again later.', false), {
      headers: { 'Content-Type': 'text/html' },
    });
  }
}

function unsubscribePage(title: string, message: string, success: boolean) {
  const SITE_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://pdftool.arutechconsultancy.com';
  const icon = success ? '✅' : '❌';
  const color = success ? '#059669' : '#eb1000';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${title} — PDF.tools</title>
</head>
<body style="margin:0;padding:0;background:#0f0f0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;">
  <div style="max-width:400px;width:100%;margin:40px auto;background:#111;border-radius:16px;border:1px solid #1e1e1e;overflow:hidden;">
    <div style="height:3px;background:linear-gradient(90deg,#eb1000,#ff6b35);"></div>
    <div style="padding:48px 40px;text-align:center;">
      <div style="font-size:48px;margin-bottom:16px;">${icon}</div>
      <h1 style="margin:0 0 12px;font-size:22px;font-weight:800;color:#fff;">${title}</h1>
      <p style="margin:0 0 28px;font-size:14px;color:#888;line-height:1.6;">${message}</p>
      <a href="${SITE_URL}"
         style="display:inline-block;background:#eb1000;color:#fff;font-weight:700;font-size:14px;padding:12px 24px;border-radius:10px;text-decoration:none;">
        Back to PDF.tools
      </a>
    </div>
    <div style="padding:16px 40px;text-align:center;border-top:1px solid #1e1e1e;">
      <p style="margin:0;font-size:12px;color:#555;">
        <span style="color:#fff;font-weight:700;">PDF</span><span style="color:#eb1000;font-weight:700;">.tools</span>
      </p>
    </div>
  </div>
</body>
</html>`;
}
