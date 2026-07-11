import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAH980UahKAMSzLpnSeSYojJgeeMhE40yU",
  authDomain: "aponte-sas.firebaseapp.com",
  projectId: "aponte-sas",
  storageBucket: "aponte-sas.firebasestorage.app",
  messagingSenderId: "1010400930261",
  appId: "1:1010400930261:web:aa68fa2eb9515d265d355c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Fetch products from Firebase Firestore
export async function fetchProducts() {
  try {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data
      };
    });
  } catch (error) {
    console.error("Error fetching products from Firebase:", error);
    // Return empty array or throw error
    return [];
  }
}
