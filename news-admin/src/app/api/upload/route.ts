import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { getPresignedUploadUrl } from '@/lib/s3';

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { fileType, folder } = await req.json();

    if (!fileType || !fileType.startsWith('image/')) {
      return NextResponse.json({ error: 'Invalid file type — images only' }, { status: 400 });
    }

    const { url, key } = await getPresignedUploadUrl(fileType, folder || 'news');
    const cloudFrontUrl = `${process.env.CLOUDFRONT_DOMAIN}/${key}`;

    return NextResponse.json({ uploadUrl: url, key, imageUrl: cloudFrontUrl });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 });
  }
}
