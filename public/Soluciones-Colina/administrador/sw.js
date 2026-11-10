// =====================================================
// COLINA STUDIO / SOLUCIONES COLINA
// Service Worker con Auto-Actualización y Push Instantáneo
// =====================================================
const CACHE_NAME = 'soluciones-colina-v1.1.0'

self.addEventListener('install', (event) => {
  // Permitir activación inmediata cuando se ordene
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Purgando cache antigua:', key)
            return caches.delete(key)
          }
          return Promise.resolve()
        })
      )
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] Recibido SKIP_WAITING — Activando versión inmediatamente')
    self.skipWaiting()
  }
})

self.addEventListener('push', (event) => {
  let title = 'Soluciones Colina — Actualización'
  let body = 'Nueva versión disponible. Presiona para actualizar al instante.'
  try {
    if (event.data) {
      const data = event.data.json()
      if (data.title) title = data.title
      if (data.body) body = data.body
    }
  } catch {}

  const options = {
    body,
    icon: '/soluciones-colina/icon-192.png',
    badge: '/soluciones-colina/icon-192.png',
    vibrate: [100, 50, 100],
    data: { url: '/soluciones-colina/' }
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          return client.focus()
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow('/soluciones-colina/')
      }
    })
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  const url = new URL(event.request.url)
  // Jamás interceptar la consola administrativa independiente ni llamadas de version
  if (url.pathname.includes('/administrador') || url.pathname.includes('version.json')) {
    return
  }

  // Network-first con fallback a cache para garantizar que siempre se obtenga lo nuevo
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Guardar copia fresca en cache si es respuesta válida
        if (response && response.status === 200 && response.type === 'basic') {
          const respClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, respClone))
        }
        return response
      })
      .catch(() => caches.match(event.request))
  )
})
