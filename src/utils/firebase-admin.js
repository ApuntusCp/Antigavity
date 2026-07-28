import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK
if (!getApps().length) {
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      initializeApp({
        credential: cert(serviceAccount)
      });
    } else {
      // Fallback: funciona si gcloud local está autenticado
      // o si está desplegado en Vercel/GCP con GOOGLE_APPLICATION_CREDENTIALS
      initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || "aponte-sas",
      });
    }
  } catch (error) {
    console.error('[firebase-admin] Error de inicialización:', error.stack);
  }
}

// ── Lazy getter para Firestore Admin ────────────────────────────────────────
// getFirestore() ahora está dentro de una función para evitar que un error de
// inicialización crashee el módulo completo al importarlo.
let _adminDb = null;
function getAdminDb() {
  if (!_adminDb) {
    try {
      _adminDb = getFirestore();
    } catch (error) {
      console.error('[firebase-admin] No se pudo obtener Firestore:', error.message);
      throw error;
    }
  }
  return _adminDb;
}

// Exportar como proxy para mantener compatibilidad con el código existente
export const adminDb = new Proxy({}, {
  get(_, prop) {
    return getAdminDb()[prop];
  }
});
