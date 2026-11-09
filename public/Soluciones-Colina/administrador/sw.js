// Service Worker para PWA Soluciones Colina
const CACHE_NAME = 'soluciones-colina-v1'

self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim())
})

self.addEventListener('fetch', (event) => {
  // Estrategia Network first con fallback a cache
  if (event.request.method !== 'GET') return

  const url = new URL(event.request.url)
  // Jamás interceptar ni cachear la consola administrativa independiente
  if (url.pathname.includes('/administrador')) {
    return
  }

  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  )
})
