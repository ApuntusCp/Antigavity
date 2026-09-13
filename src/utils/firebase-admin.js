import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

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

// ── Lazy getter para Auth Admin ─────────────────────────────────────────────
let _adminAuth = null;
function getAdminAuth() {
  if (!_adminAuth) {
    try {
      _adminAuth = getAuth();
    } catch (error) {
      console.error('[firebase-admin] No se pudo obtener Auth:', error.message);
      throw error;
    }
  }
  return _adminAuth;
}

export const adminDb = new Proxy({}, {
  get(_, prop) {
    return getAdminDb()[prop];
  }
});

export const adminAuth = new Proxy({}, {
  get(_, prop) {
    return getAdminAuth()[prop];
  }
});
