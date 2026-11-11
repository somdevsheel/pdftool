import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Subscriber } from '@/lib/models/Subscriber';
import { sendWelcomeEmail } from '@/lib/email';
import { getAuthUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, source = 'sidebar' } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    await connectDB();

    const existing = await Subscriber.findOne({ email });

    if (existing) {
      if (!existing.active) {
        existing.active = true;
        await existing.save();
        // Re-send welcome
        await sendWelcomeEmail(email, existing.unsubscribeToken).catch(console.error);
        return NextResponse.json({ success: true, message: 'Welcome back! You are re-subscribed.' });
      }
      return NextResponse.json({ success: true, message: 'You are already subscribed!' });
    }

    const subscriber = await Subscriber.create({ email, source });

    // Send welcome email (non-blocking — don't fail the request if email fails)
    sendWelcomeEmail(email, subscriber.unsubscribeToken).catch(err => {
      console.error('[Welcome email failed]', err.message);
    });

    return NextResponse.json({
      success: true,
      message: 'Subscribed! Check your inbox for a welcome email.',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[POST /api/subscribe]', message);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// Admin-only: the subscriber list is personal data, and each unsubscribe token
// would let anyone unsubscribe that person.
export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    await connectDB();
    const subscribers = await Subscriber.find({ active: true })
      .select('email source createdAt')
      .sort({ createdAt: -1 });
    return NextResponse.json({ subscribers, total: subscribers.length });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}