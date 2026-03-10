import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { News } from '@/lib/models/News';
import '@/lib/models/User';

export async function GET(_: NextRequest, { params }: { params: { slug: string } }) {
  try {
    await connectDB();
    const article = await News.findOne({ slug: params.slug, published: true })
      .populate('author', 'name')
      .lean();

    if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Increment views
    await News.findByIdAndUpdate((article as any)._id, { $inc: { views: 1 } });

    return NextResponse.json({ article });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: 'Server error', detail: message }, { status: 500 });
  }
}
