export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Bloquear rutas internas: APIs privadas, checkout, páginas de auth
        disallow: ['/api/', '/checkout', '/login', '/registro'],
      },
    ],
    sitemap: 'https://grancolinos.com/sitemap.xml',
    host: 'https://grancolinos.com',
  };
}
