import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { initializeApp, getApps, getApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyAH980UahKAMSzLpnSeSYojJgeeMhE40yU",
  authDomain: "aponte-sas.firebaseapp.com",
  projectId: "aponte-sas",
  storageBucket: "aponte-sas.firebasestorage.app",
  messagingSenderId: "1010400930261",
  appId: "1:1010400930261:web:aa68fa2eb9515d265d355c"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function isMaintenanceModeActive() {
  try {
    // Usar la API REST de Firestore con 'no-store' para forzar que siempre lea en tiempo real
    // y evitar el caché del servidor de Next.js
    const response = await fetch(
      'https://firestore.googleapis.com/v1/projects/aponte-sas/databases/(default)/documents/config/site',
      { cache: 'no-store' }
    );
    
    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    
    // En Firestore REST, los booleanos vienen como { booleanValue: true/false }
    if (data.fields && data.fields.maintenanceMode) {
      return data.fields.maintenanceMode.booleanValue === true;
    }
    
    return false;
  } catch (e) {
    // Si falla la red, no bloqueamos la tienda
    console.error("Error fetching maintenance mode:", e);
    return false;
  }
}
