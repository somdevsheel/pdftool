import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { News } from '@/lib/models/News';
import '@/lib/models/User';
import { getAuthUser } from '@/lib/auth';
import { TAG_COLORS } from '@/types';

const BLOG_TAGS: Record<string, string> = {
  'PDF Tips': '#eb1000',
  'Tutorials': '#2B5EE8',
  'How-To': '#059669',
  'Merge PDF': '#7C3AED',
  'Split PDF': '#D97706',
  'Compress PDF': '#DB2777',
  'Convert PDF': '#0891B2',
  'Edit PDF': '#EA580C',
  'Sign PDF': '#6B7280',
  'OCR': '#DC2626',
};

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const tag = searchParams.get('tag') || '';
    const adminView = searchParams.get('admin') === 'true';
    const search = searchParams.get('search') || '';

    const query: Record<string, unknown> = { contentType: 'blog' };
    if (!adminView) query.published = true;
    if (tag && tag !== 'All') query.tag = tag;
    if (search) query.title = { $regex: search, $options: 'i' };

    const skip = (page - 1) * limit;
    const total = await News.countDocuments(query);

    const posts = await News.find(query)
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({
      posts,
      total,
      page,
      limit,
      hasMore: skip + posts.length < total,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: 'Server error', detail: message, posts: [] }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { title, summary, content, tag, imageUrl, imageKey, source, sourceUrl, readTime, featured, published } = body;

    if (!title || !summary || !content || !tag || !imageUrl || !imageKey) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    const post = await News.create({
      title, summary, content, tag,
      tagColor: BLOG_TAGS[tag] || TAG_COLORS[tag as keyof typeof TAG_COLORS] || '#eb1000',
      imageUrl, imageKey,
      source: source || 'PDF.tools',
      sourceUrl: sourceUrl || '',
      readTime: readTime || 5,
      featured: featured || false,
      published: published || false,
      contentType: 'blog',
      author: user.userId,
    });

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: 'Server error', detail: message }, { status: 500 });
  }
}
