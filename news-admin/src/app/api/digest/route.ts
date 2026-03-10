import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { News } from '@/lib/models/News';
import { Subscriber } from '@/lib/models/Subscriber';
import '@/lib/models/User';
import { sendDigestEmail, DigestArticle } from '@/lib/email';

// POST /api/digest  — call this weekly via cron or manually from admin
// Protect with DIGEST_SECRET env var
export async function POST(req: NextRequest) {
  try {
    const { secret } = await req.json().catch(() => ({}));
    if (secret !== process.env.DIGEST_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Articles published in last 7 days
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const articles = await News.find({
      published: true,
      createdAt: { $gte: since },
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    if (articles.length === 0) {
      return NextResponse.json({ success: true, message: 'No new articles this week — digest skipped.' });
    }

    const digestArticles: DigestArticle[] = articles.map((a: any) => ({
      title: a.title,
      summary: a.summary,
      slug: a.slug,
      tag: a.tag,
      tagColor: a.tagColor,
      readTime: a.readTime,
      contentType: a.contentType || 'news',
    }));

    const subscribers = await Subscriber.find({ active: true });

    if (subscribers.length === 0) {
      return NextResponse.json({ success: true, message: 'No active subscribers.' });
    }

    // Send in batches of 10 to avoid rate limits
    let sent = 0;
    let failed = 0;
    const BATCH = 10;

    for (let i = 0; i < subscribers.length; i += BATCH) {
      const batch = subscribers.slice(i, i + BATCH);
      await Promise.allSettled(
        batch.map(sub =>
          sendDigestEmail(sub.email, sub.unsubscribeToken, digestArticles)
            .then(() => sent++)
            .catch(err => { console.error(`[Digest] Failed ${sub.email}:`, err.message); failed++; })
        )
      );
      // Small delay between batches
      if (i + BATCH < subscribers.length) {
        await new Promise(r => setTimeout(r, 1000));
      }
    }

    return NextResponse.json({
      success: true,
      sent,
      failed,
      articles: articles.length,
      message: `Digest sent to ${sent} subscriber${sent !== 1 ? 's' : ''}.`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: 'Server error', detail: message }, { status: 500 });
  }
}
