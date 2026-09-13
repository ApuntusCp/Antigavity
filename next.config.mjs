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
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.bold.co https://*.bold.co https://apis.google.com https://*.firebaseapp.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: blob: https: https://*.googleapis.com https://*.googleusercontent.com https://checkout.bold.co https://*.bold.co",
              "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://*.bold.co https://checkout.bold.co https://api.telegram.org",
              "frame-src 'self' https://checkout.bold.co https://*.bold.co https://*.firebaseapp.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self' https://checkout.bold.co",
            ].join('; '),
          },
        ],
      },
    ];
  },
  // ── Enrutamiento GCA OS Admin ───────────────────────────────────────────────
  async rewrites() {
    return [
      {
        source: '/GCA-Admin',
        destination: '/GCA-Admin/index.html',
      },
      {
        source: '/GCA-Admin/:path*',
        destination: '/GCA-Admin/:path*',
      },
      {
        source: '/gca-admin',
        destination: '/GCA-Admin/index.html',
      },
      {
        source: '/gca-admin/:path*',
        destination: '/GCA-Admin/:path*',
      },
      {
        has: [
          {
            type: 'host',
            value: 'gca-admin.grancolinos.com',
          },
        ],
        source: '/:path*',
        destination: '/GCA-Admin/:path*',
      },
    ];
  },
};

export default nextConfig;
