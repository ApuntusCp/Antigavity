/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
};

export default nextConfig;
