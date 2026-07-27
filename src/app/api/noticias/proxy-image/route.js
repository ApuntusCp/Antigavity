import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  try {
    // Si la URL es relativa o no empieza por http, retornar error
    if (!imageUrl.startsWith('http')) {
      return new NextResponse('Invalid URL format', { status: 400 });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

    const imageRes = await fetch(imageUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Referer': new URL(imageUrl).origin
      }
    });
    clearTimeout(timeoutId);

    if (!imageRes.ok) {
      return new NextResponse('Failed to fetch image', { status: imageRes.status });
    }

    const contentType = imageRes.headers.get('content-type') || 'image/jpeg';
    const blob = await imageRes.arrayBuffer();

    return new NextResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    return new NextResponse('Image proxy error', { status: 500 });
  }
}
