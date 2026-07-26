import crypto from 'crypto';
import { adminDb } from '../../../../utils/firebase-admin';

export async function POST(request) {
  try {
    const { orderId, amount: clientAmount, currency } = await request.json();

    if (!orderId || !clientAmount || !currency) {
      return new Response(JSON.stringify({ error: 'Faltan parámetros de orden' }), { status: 400 });
    }

    const secretKey = process.env.BOLD_SECRET_KEY || 'LIVE_BOLD_SECRET_KEY';

    var orderData = null;
    var orderRef = null;

    try {
      orderRef = adminDb.collection('orders').doc(orderId);
      const orderSnap = await orderRef.get();
      if (orderSnap.exists) {
        orderData = orderSnap.data();
      }
    } catch (e) {
      console.warn("Firestore order fetch alert:", e);
    }

    const calculatedTotal = clientAmount;

    // Update order status for live checkout
    if (orderRef) {
      try {
        await orderRef.update({
          total: calculatedTotal,
          status: 'pending_payment_live',
          paymentMode: 'LIVE'
        });
      } catch (e) {
        console.warn("Could not update order status:", e);
      }
    }

    // Generate SHA-256 integrity hash for Bold Live Payments
    const stringToHash = `${orderId}${calculatedTotal}${currency}${secretKey}`;
    const hash = crypto.createHash('sha256').update(stringToHash).digest('hex');

    // Notify GC Admin Notifications module in Firestore
    try {
      await adminDb.collection('notifications').add({
        title: 'Inicio de Pago en Vivo',
        message: `Cliente ${orderData?.customer?.name || 'Comprador'} inició proceso de pago para la Orden #${orderId}.`,
        type: 'new_order',
        orderId: orderId,
        amount: calculatedTotal,
        customerName: orderData?.customer?.name || 'Cliente Web',
        customerEmail: orderData?.customer?.email || 'N/A',
        read: false,
        timestamp: new Date()
      });
    } catch (e) {
      console.warn("Could not write notification to GC Admin:", e);
    }

    return new Response(JSON.stringify({
      hash: hash,
      verifiedAmount: calculatedTotal,
      isLive: true,
      status: 'success'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error generating checkout hash:", error);

    // Notify GC Admin Notifications module of payment failure / error
    try {
      await adminDb.collection('notifications').add({
        title: '⚠️ Fallo en Pasarela de Pago',
        message: `Se produjo un error al procesar el hash de seguridad de pago: ${error.message}`,
        type: 'payment_error',
        read: false,
        timestamp: new Date()
      });
    } catch (e) {
      // Warning
    }

    return new Response(JSON.stringify({ error: 'Error interno procesando firma de seguridad de pago' }), { status: 500 });
  }
}
