// import { NextRequest, NextResponse } from 'next/server';
// import { connectDB } from '@/lib/mongodb';
// import { News } from '@/lib/models/News';
// import '@/lib/models/User';

// export async function GET(_: NextRequest, { params }: { params: { slug: string } }) {
//   try {
//     await connectDB();
//     const article = await News.findOne({ slug: params.slug, published: true })
//       .populate('author', 'name')
//       .lean();

//     if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 });

//     // Increment views
//     await News.findByIdAndUpdate((article as any)._id, { $inc: { views: 1 } });

//     return NextResponse.json({ article });
//   } catch (err) {
//     const message = err instanceof Error ? err.message : String(err);
//     return NextResponse.json({ error: 'Server error', detail: message }, { status: 500 });
//   }
// }



import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { News } from '@/lib/models/News';
import '@/lib/models/User';

export async function GET(_: NextRequest, { params }: { params: { slug: string } }) {
  try {
    await connectDB();

    // Find article + increment views in PARALLEL
    const article = await News.findOne({ slug: params.slug, published: true })
      .select('-__v')   // exclude internal field
      .lean();

    if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Fire view increment without awaiting — don't slow down response
    News.findByIdAndUpdate((article as { _id: unknown })._id, { $inc: { views: 1 } }).exec();

    const response = NextResponse.json({ article });

    // Cache article page for 5 minutes on CDN
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=300, stale-while-revalidate=600'
    );

    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: 'Server error', detail: message }, { status: 500 });
  }
}
