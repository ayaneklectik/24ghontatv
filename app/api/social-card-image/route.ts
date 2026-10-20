import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_HOSTS = new Set([
  'api.24ghontatv.com',
  '24ghontatv.com',
  'www.24ghontatv.com',
]);

export async function GET(request: NextRequest) {
  const rawUrl = request.nextUrl.searchParams.get('url');
  if (!rawUrl) {
    return NextResponse.json({ error: 'Missing image URL' }, { status: 400 });
  }

  let imageUrl: URL;
  try {
    imageUrl = new URL(rawUrl);
  } catch {
    return NextResponse.json({ error: 'Invalid image URL' }, { status: 400 });
  }

  if (imageUrl.protocol !== 'https:' || !ALLOWED_HOSTS.has(imageUrl.hostname)) {
    return NextResponse.json({ error: 'Image host is not allowed' }, { status: 400 });
  }

  try {
    const upstream = await fetch(imageUrl.toString(), {
      headers: { Accept: 'image/avif,image/webp,image/png,image/jpeg,image/gif,*/*;q=0.8' },
      redirect: 'follow',
      next: { revalidate: 3600 },
    });

    const finalUrl = new URL(upstream.url);
    if (!upstream.ok || !ALLOWED_HOSTS.has(finalUrl.hostname)) {
      return NextResponse.json({ error: 'Could not load image from the approved host' }, { status: 502 });
    }

    const contentType = upstream.headers.get('content-type') ?? '';
    if (!contentType.toLowerCase().startsWith('image/')) {
      return NextResponse.json({ error: 'Source URL did not return an image' }, { status: 415 });
    }

    return new NextResponse(upstream.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Image proxy request failed' }, { status: 502 });
  }
}
