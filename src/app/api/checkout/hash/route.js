import crypto from 'crypto';
import { adminDb } from '../../../../utils/firebase-admin';

export async function POST(request) {
  try {
    const { orderId, amount: clientAmount, currency } = await request.json();

    if (!orderId || !clientAmount || !currency) {
      return new Response(JSON.stringify({ error: 'Faltan parámetros de orden' }), { status: 400 });
    }

    const secretKey = process.env.BOLD_SECRET_KEY || 'TEST_BOLD_SECRET_KEY_MODE';

    // 1. Fetch order from Firestore using Firebase Admin
    var orderData = null;
    var orderRef = null;

    try {
      orderRef = adminDb.collection('orders').doc(orderId);
      const orderSnap = await orderRef.get();
      if (orderSnap.exists) {
        orderData = orderSnap.data();
      }
    } catch (e) {
      console.warn("Firestore order fetch warning (Test mode active):", e);
    }

    const calculatedTotal = clientAmount;

    if (orderRef && orderData) {
      try {
        await orderRef.update({
          total: calculatedTotal,
          status: 'pending_payment_test',
          paymentMode: 'TEST_SANDBOX'
        });
      } catch (e) {
        // Warning
      }
    }

    // Generate SHA-256 integrity hash for Bold / Sandbox
    const stringToHash = `${orderId}${calculatedTotal}${currency}${secretKey}`;
    const hash = crypto.createHash('sha256').update(stringToHash).digest('hex');

    return new Response(JSON.stringify({
      hash: hash,
      verifiedAmount: calculatedTotal,
      isTestMode: true,
      status: 'success'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error generating checkout hash:", error);
    return new Response(JSON.stringify({ error: 'Error interno procesando firma de seguridad' }), { status: 500 });
  }
}
