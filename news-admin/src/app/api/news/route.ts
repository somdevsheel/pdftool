// import { NextRequest, NextResponse } from 'next/server';
// import { connectDB } from '@/lib/mongodb';
// import { News } from '@/lib/models/News';
// import '@/lib/models/User';
// import { getAuthUser } from '@/lib/auth';
// import { TAG_COLORS } from '@/types';

// export async function GET(req: NextRequest) {
//   try {
//     await connectDB();
//     const { searchParams } = new URL(req.url);
//     const page = parseInt(searchParams.get('page') || '1');
//     const limit = parseInt(searchParams.get('limit') || '12');
//     const tag = searchParams.get('tag') || '';
//     const featured = searchParams.get('featured') === 'true';
//     const adminView = searchParams.get('admin') === 'true';
//     const search = searchParams.get('search') || '';

//     const query: Record<string, unknown> = { contentType: { $ne: 'blog' } };
//     if (!adminView) query.published = true;
//     if (tag && tag !== 'All') query.tag = tag;
//     if (featured) query.featured = true;
//     if (search) query.title = { $regex: search, $options: 'i' };

//     const skip = (page - 1) * limit;
//     const total = await News.countDocuments(query);

//     const articles = await News.find(query)
//       .populate('author', 'name email')
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit)
//       .lean();

//     return NextResponse.json({
//       articles,
//       total,
//       page,
//       limit,
//       hasMore: skip + articles.length < total,
//     });
//   } catch (err: unknown) {
//     const message = err instanceof Error ? err.message : String(err);
//     console.error('[GET /api/news]', message);
//     return NextResponse.json(
//       { error: 'Server error', detail: message, articles: [] },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const user = await getAuthUser();
//     if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

//     const body = await req.json();
//     const { title, summary, content, tag, imageUrl, imageKey, source, sourceUrl, readTime, featured, published } = body;

//     if (!title || !summary || !content || !tag || !imageUrl || !imageKey || !source) {
//       return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
//     }

//     await connectDB();

//     const article = await News.create({
//       title, summary, content, tag,
//       tagColor: TAG_COLORS[tag as keyof typeof TAG_COLORS] || '#6B7FD7',
//       imageUrl, imageKey, source,
//       sourceUrl: sourceUrl || '',
//       readTime: readTime || 3,
//       featured: featured || false,
//       published: published || false,
//       author: user.userId,
//     });

//     return NextResponse.json({ success: true, article }, { status: 201 });
//   } catch (err: unknown) {
//     const message = err instanceof Error ? err.message : String(err);
//     console.error('[POST /api/news]', message);
//     return NextResponse.json({ error: 'Server error', detail: message }, { status: 500 });
//   }
// }





import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { News } from '@/lib/models/News';
import '@/lib/models/User';
import { getAuthUser } from '@/lib/auth';
import { TAG_COLORS } from '@/types';

// GET /api/news — public, paginated
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page      = parseInt(searchParams.get('page')  || '1');
    const limit     = parseInt(searchParams.get('limit') || '12');
    const tag       = searchParams.get('tag')      || '';
    const featured  = searchParams.get('featured') === 'true';
    const adminView = searchParams.get('admin')    === 'true';
    const search    = searchParams.get('search')   || '';

    const query: Record<string, unknown> = { contentType: { $ne: 'blog' } };
    if (!adminView) query.published = true;
    if (tag && tag !== 'All') query.tag = tag;
    if (featured) query.featured = true;
    if (search) query.title = { $regex: search, $options: 'i' };

    const skip = (page - 1) * limit;

    // Run count + find in PARALLEL — cuts DB time in half
    const [articles, total] = await Promise.all([
      News.find(query)
        .select('-content')        // exclude heavy content field from list view
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      News.countDocuments(query),
    ]);

    const response = NextResponse.json({
      articles,
      total,
      page,
      limit,
      hasMore: skip + articles.length < total,
    });

    // Cache public (non-admin) responses for 60 seconds
    // Vercel CDN serves cached response instantly — no DB hit
    if (!adminView && !search) {
      response.headers.set(
        'Cache-Control',
        'public, s-maxage=60, stale-while-revalidate=120'
      );
    }

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[GET /api/news]', message);
    return NextResponse.json(
      { error: 'Server error', detail: message, articles: [] },
      { status: 500 }
    );
  }
}

// POST /api/news — create article (admin/editor only)
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { title, summary, content, tag, imageUrl, imageKey, source, sourceUrl, readTime, featured, published } = body;

    if (!title || !summary || !content || !tag || !imageUrl || !imageKey || !source) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    const article = await News.create({
      title,
      summary,
      content,
      tag,
      tagColor: TAG_COLORS[tag as keyof typeof TAG_COLORS] || '#6B7FD7',
      imageUrl,
      imageKey,
      source,
      sourceUrl: sourceUrl || '',
      readTime: readTime || 3,
      featured: featured || false,
      published: published || false,
      author: user.userId,
    });

    return NextResponse.json({ success: true, article }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[POST /api/news]', message);
    return NextResponse.json(
      { error: 'Server error', detail: message },
      { status: 500 }
    );
  }
}