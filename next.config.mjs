/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  
  // ── Eliminar console.log en producción ──────────────────────────────────────
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // ── Optimización de imágenes ─────────────────────────────────────────────────
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Firebase Storage
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: 'storage.googleapis.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      // DuckDuckGo (íconos de medios)
      { protocol: 'https', hostname: 'icons.duckduckgo.com' },
      { protocol: 'https', hostname: 'external-content.duckduckgo.com' },
      // Wikimedia (educativo)
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      // Medios
      { protocol: 'https', hostname: '**.eltiempo.com' },
      { protocol: 'https', hostname: '**.semana.com' },
      { protocol: 'https', hostname: '**.elespectador.com' },
      { protocol: 'https', hostname: '**.caracoltv.com' },
      { protocol: 'https', hostname: '**.rcnradio.com' },
    ],
  },

  // ── Cabeceras de seguridad HTTP robustas ─────────────────────────────────────
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
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), accelerometer=*, payment=(self "https://checkout.bold.co")',
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
