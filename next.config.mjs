/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── Eliminar console.log en producción ──────────────────────────────────────
  // Evita que logs internos sean visibles en DevTools del navegador en producción
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // ── Optimización de imágenes ─────────────────────────────────────────────────
  images: {
    // Formatos modernos: AVIF tiene mejor compresión que WebP; WebP mejor que JPEG/PNG
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Firebase Storage (imágenes de productos y CMS)
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: 'storage.googleapis.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      // DuckDuckGo (íconos de noticias)
      { protocol: 'https', hostname: 'icons.duckduckgo.com' },
      { protocol: 'https', hostname: 'external-content.duckduckgo.com' },
      // Wikimedia (imágenes educativas)
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      // Medios colombianos (noticias)
      { protocol: 'https', hostname: '**.eltiempo.com' },
      { protocol: 'https', hostname: '**.semana.com' },
      { protocol: 'https', hostname: '**.elespectador.com' },
      { protocol: 'https', hostname: '**.caracoltv.com' },
      { protocol: 'https', hostname: '**.rcnradio.com' },
    ],
  },

  // ── Cabeceras de seguridad HTTP ──────────────────────────────────────────────
  // Estas cabeceras se aplican a TODAS las respuestas sin afectar el diseño ni UX.
  // Previenen: Clickjacking (X-Frame-Options), MIME sniffing (X-Content-Type-Options),
  // exposición de referrer (Referrer-Policy), abuso de APIs de dispositivo (Permissions-Policy).
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
