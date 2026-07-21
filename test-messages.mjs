import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

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
  const s1 = await getDoc(doc(db, 'cms_pages', 'home_production'));
  console.log(JSON.stringify(s1.data(), null, 2));
  process.exit(0);
}
test();
