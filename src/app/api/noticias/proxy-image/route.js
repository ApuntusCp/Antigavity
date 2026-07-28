import { NextResponse } from 'next/server';

// ─── LISTA BLANCA DE DOMINIOS PERMITIDOS ────────────────────────────────────
// SSRF Fix: Solo se permite hacer fetch de imágenes de dominios conocidos y
// confiables. Cualquier otro dominio (incluyendo IPs locales, metadata cloud
// como 169.254.169.254, localhost, redes internas) es bloqueado.
const ALLOWED_IMAGE_DOMAINS = [
  'firebasestorage.googleapis.com',
  'storage.googleapis.com',
  'lh3.googleusercontent.com',
  'eltiempo.com',
  'semana.com',
  'elespectador.com',
  'rcnradio.com',
  'caracoltv.com',
  'noticias.caracoltv.com',
  'lafm.com.co',
  'lasillavacia.com',
  'icons.duckduckgo.com',
  'external-content.duckduckgo.com',
  'upload.wikimedia.org',
  'www.bluradio.com',
  'img.bluradio.com',
  'i.imgur.com',
];

function isAllowedDomain(urlString) {
  try {
    const parsed = new URL(urlString);
    // Bloquear explícitamente IPs privadas y localhost (defensa adicional)
    const hostname = parsed.hostname.toLowerCase();
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.startsWith('172.') ||
      hostname === '169.254.169.254' || // AWS/GCP metadata
      hostname === '0.0.0.0'
    ) {
      return false;
    }
    return ALLOWED_IMAGE_DOMAINS.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  // ── Validar dominio contra lista blanca ───────────────────────────────────
  if (!imageUrl.startsWith('http') || !isAllowedDomain(imageUrl)) {
    return new NextResponse('Domain not allowed', { status: 403 });
  }

  try {
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

    // Verificar que la respuesta es realmente una imagen
    const contentType = imageRes.headers.get('content-type') || '';
    if (!contentType.startsWith('image/')) {
      return new NextResponse('Response is not an image', { status: 400 });
    }

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
