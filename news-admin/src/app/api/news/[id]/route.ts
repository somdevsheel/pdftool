import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { News } from '@/lib/models/News';
import { getAuthUser } from '@/lib/auth';
import { deleteS3Object } from '@/lib/s3';
import { TAG_COLORS } from '@/types';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const article = await News.findById(params.id).populate('author', 'name email').lean();
    if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Increment views for published articles
    await News.findByIdAndUpdate(params.id, { $inc: { views: 1 } });
    return NextResponse.json({ article });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const body = await req.json();

    if (body.tag) {
      body.tagColor = TAG_COLORS[body.tag as keyof typeof TAG_COLORS] || '#6B7FD7';
    }

    const article = await News.findByIdAndUpdate(params.id, body, { new: true }).lean();
    if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({ success: true, article });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 });
    }

    await connectDB();
    const article = await News.findById(params.id);
    if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 });

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
