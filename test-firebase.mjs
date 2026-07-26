import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

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
  snapshot.forEach(doc => {
    const data = doc.data();
    console.log("SKU:", data.sku, "| Name:", data.name);
    if (data.images) {
      console.log("Images count:", data.images.length);
      data.images.forEach((img, idx) => {
        console.log(`Image [${idx}] type:`, img.substring(0, 40));
      });
    } else {
      console.log("No images array found!");
    }
    console.log("-----------------------------------");
  });
}
test();
