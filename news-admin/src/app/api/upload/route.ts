import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { getPresignedUploadUrl } from '@/lib/s3';

// SVG is excluded: it can carry script and is served from the public CDN.
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { fileType, folder } = await req.json();

    if (typeof fileType !== 'string' || !ALLOWED_IMAGE_TYPES.includes(fileType)) {
      return NextResponse.json({ error: 'Invalid file type — images only' }, { status: 400 });
    }

    // Fixed set of key prefixes — the folder must not let a caller write anywhere in the bucket.
    const { url, key } = await getPresignedUploadUrl(fileType, folder === 'blog' ? 'blog' : 'news');
    const cloudFrontUrl = `${process.env.CLOUDFRONT_DOMAIN}/${key}`;

    return NextResponse.json({ uploadUrl: url, key, imageUrl: cloudFrontUrl });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 });
  }
}
