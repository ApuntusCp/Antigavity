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
      // Fallback: This works perfectly if the local gcloud is authenticated
      // or if deployed on Vercel/GCP with GOOGLE_APPLICATION_CREDENTIALS
      initializeApp({
        projectId: "aponte-sas",
      });
    }
  } catch (error) {
    console.error('Firebase admin initialization error', error.stack);
  }
}

export const adminDb = getFirestore();
