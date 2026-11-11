import { NextRequest, NextResponse } from 'next/server';
import { isValidObjectId } from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import { News } from '@/lib/models/News';
import { getAuthUser } from '@/lib/auth';
import { deleteS3Object } from '@/lib/s3';
import { TAG_COLORS } from '@/types';

// Fields an editor may change. Anything else in the request body (author, views,
// timestamps, …) is ignored rather than written straight into the document.
const EDITABLE_FIELDS = [
  'title', 'summary', 'content', 'tag', 'source', 'sourceUrl', 'readTime',
  'featured', 'published', 'imageUrl', 'imageKey', 'contentType', 'slug',
] as const;

const notFound = () => NextResponse.json({ error: 'Not found' }, { status: 404 });

export async function GET(_: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    if (!isValidObjectId(params.id)) return notFound();
    await connectDB();
    const user = await getAuthUser();
    const article = (await News.findById(params.id)
      .populate('author', user ? 'name email' : 'name')
      .lean()) as { published?: boolean } | null;
    // Unpublished drafts exist only for logged-in editors.
    if (!article || (!article.published && !user)) return notFound();

    // Count views from readers, not from editors previewing their own drafts
    if (!user) await News.findByIdAndUpdate(params.id, { $inc: { views: 1 } });
    return NextResponse.json({ article });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!isValidObjectId(params.id)) return notFound();

    await connectDB();
    const body = await req.json();

    const update: Record<string, unknown> = {};
    for (const key of EDITABLE_FIELDS) {
      const value = body?.[key];
      // Only plain values — an object here could smuggle in Mongo operators.
      if (value !== undefined && (value === null || typeof value !== 'object')) update[key] = value;
    }
    if (typeof update.tag === 'string') {
      update.tagColor = TAG_COLORS[update.tag as keyof typeof TAG_COLORS] || '#6B7FD7';
    }

    const article = await News.findByIdAndUpdate(params.id, { $set: update }, { new: true, runValidators: true }).lean();
    if (!article) return notFound();

    return NextResponse.json({ success: true, article });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 });
    }
    if (!isValidObjectId(params.id)) return notFound();

    await connectDB();
    const article = await News.findById(params.id);
    if (!article) return notFound();

    // Delete image from S3
    if (article.imageKey) {
      await deleteS3Object(article.imageKey).catch(console.error);
    }

    await article.deleteOne();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
