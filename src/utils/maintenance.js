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
    const snap = await getDoc(doc(db, 'config', 'site'));
    if (snap.exists()) {
      return snap.data().maintenanceMode === true;
    }
    return false;
  } catch (e) {
    // Si falla, no bloqueamos la tienda
    return false;
  }
}
