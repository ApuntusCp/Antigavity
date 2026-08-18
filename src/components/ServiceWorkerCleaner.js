'use client';

import { useEffect } from 'react';

/**
 * ServiceWorkerCleaner
 * Limpia y desregistra service workers obsoletos o corruptos (sw.js)
 * y vacía cachés del navegador que causen errores de esquema (ej. chrome-extension://)
 * o bloqueos por adblockers (ej. fbevents.js).
 */
export default function ServiceWorkerCleaner() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Desregistrar Service Workers activos en este dominio
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister().catch(() => {});
        }
      }).catch(() => {});
    }

    // 2. Limpiar Caché antigua/huérfana si existe
    if ('caches' in window) {
      caches.keys().then((keys) => {
        for (const key of keys) {
          caches.delete(key).catch(() => {});
        }
      }).catch(() => {});
    }
  }, []);

  return null;
}
