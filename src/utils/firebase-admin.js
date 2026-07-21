import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    } else {
      // Fallback: This works perfectly if the local gcloud is authenticated
      // or if deployed on Vercel/GCP with GOOGLE_APPLICATION_CREDENTIALS
      admin.initializeApp({
        projectId: "aponte-sas",
      });
    }
  } catch (error) {
    console.error('Firebase admin initialization error', error.stack);
  }
}

export const adminDb = admin.firestore();
