import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
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

async function runTests() {
  console.log("=== INICIANDO QA FASE 1: TEST DE VALIDACIÓN BACKEND (FIRESTORE) ===");
  const testResults = [];

  // TEST 1: Insertar Cashflow Negativo
  try {
    const docRef = await addDoc(collection(db, 'cashflow'), {
      type: 'INCOME',
      amount: -50000, // INVALID: negative income
      concept: 'TEST_QA_NEGATIVE_AMOUNT',
      category: 'Ventas',
      date: serverTimestamp()
    });
    testResults.push({ id: 'BUG-101', module: 'Centro Financiero / Backend', test: 'Montos negativos', status: 'FAIL (Allowed)', detail: 'Firestore permitió insertar un ingreso con monto negativo (-50000)' });
    await deleteDoc(doc(db, 'cashflow', docRef.id));
  } catch (error) {
    testResults.push({ id: 'BUG-101', module: 'Centro Financiero / Backend', test: 'Montos negativos', status: 'PASS (Blocked)', detail: error.message });
  }

  // TEST 2: Insertar Cashflow con fecha nula/inválida
  try {
    const docRef = await addDoc(collection(db, 'cashflow'), {
      type: 'EXPENSE',
      amount: 100,
      concept: 'TEST_QA_INVALID_DATE',
      category: 'Operación',
      date: "invalid_date_string" // INVALID: wrong type
    });
    testResults.push({ id: 'BUG-102', module: 'Centro Financiero / Backend', test: 'Fechas inválidas', status: 'FAIL (Allowed)', detail: 'Firestore permitió insertar un registro con string en lugar de Timestamp' });
    await deleteDoc(doc(db, 'cashflow', docRef.id));
  } catch (error) {
    testResults.push({ id: 'BUG-102', module: 'Centro Financiero / Backend', test: 'Fechas inválidas', status: 'PASS (Blocked)', detail: error.message });
  }

  // TEST 3: Crear producto con precio negativo
  try {
    const docRef = await addDoc(collection(db, 'products'), {
      name: 'QA_TEST_PRODUCT',
      price: -100, // INVALID
      stock: 5
    });
    testResults.push({ id: 'BUG-103', module: 'Inventario / Backend', test: 'Precio negativo', status: 'FAIL (Allowed)', detail: 'Firestore permitió crear producto con precio negativo' });
    await deleteDoc(doc(db, 'products', docRef.id));
  } catch (error) {
    testResults.push({ id: 'BUG-103', module: 'Inventario / Backend', test: 'Precio negativo', status: 'PASS (Blocked)', detail: error.message });
  }

  console.table(testResults);
  console.log("=== FIN QA FASE 1 ===");
  process.exit(0);
}

runTests();
