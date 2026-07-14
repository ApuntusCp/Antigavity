import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAH980UahKAMSzLpnSeSYojJgeeMhE40yU",
  authDomain: "aponte-sas.firebaseapp.com",
  projectId: "aponte-sas",
  storageBucket: "aponte-sas.firebasestorage.app",
  messagingSenderId: "1010400930261",
  appId: "1:1010400930261:web:aa68fa2eb9515d265d355c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function test() {
  const q = collection(db, 'products');
  const snapshot = await getDocs(q);
  console.log("Found products:", snapshot.size);
  snapshot.forEach(doc => {
    console.log("SKU:", doc.data().sku, "| Name:", doc.data().name);
  });
  
  const q2 = query(collection(db, 'products'), where('sku', '==', 'GC-NANO-CBD-001'));
  const snapshot2 = await getDocs(q2);
  console.log("Query with dashes size:", snapshot2.size);

  const q3 = query(collection(db, 'products'), where('sku', '==', 'GC-NANO-CBD 001'));
  const snapshot3 = await getDocs(q3);
  console.log("Query with spaces size:", snapshot3.size);
}
test();
