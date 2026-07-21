import crypto from 'crypto';
import { adminDb } from '../../../../utils/firebase-admin';

export async function POST(request) {
  try {
    const { orderId, amount: clientAmount, currency } = await request.json();

    if (!orderId || !clientAmount || !currency) {
      return new Response(JSON.stringify({ error: 'Faltan parámetros' }), { status: 400 });
    }

    const secretKey = process.env.BOLD_SECRET_KEY;
    if (!secretKey) {
      return new Response(JSON.stringify({ error: 'La llave secreta de Bold no está configurada' }), { status: 500 });
    }

    // 1. Fetch the order from Firestore using Firebase Admin
    const orderRef = adminDb.collection('orders').doc(orderId);
    const orderSnap = await orderRef.get();
    
    if (!orderSnap.exists) {
      return new Response(JSON.stringify({ error: 'Orden no encontrada' }), { status: 404 });
    }

    const orderData = orderSnap.data();

    // 2. Recalculate total to prevent client-side manipulation
    let calculatedSubtotal = 0;

    // We must fetch the actual product prices from the database to be absolutely secure.
    // However, if the order was just created and we trust the order.items array temporarily
    // (since it's a snapshot of the cart), we can use it. But for true security,
    // we should iterate the products collection.
    // For performance and simplicity in this refactor, we will calculate the subtotal
    // based on the prices saved in the order (assuming the frontend didn't fake the item prices).
    // Wait! The frontend CAN fake the item prices in the 'orders' document!
    // Let's verify prices with the real 'products' collection.
    for (const item of orderData.items) {
      const productSnap = await adminDb.collection('products').doc(item.id || item.sku).get();
      if (productSnap.exists) {
        const pData = productSnap.data();
        const priceToUse = pData.discountPrice || pData.price;
        calculatedSubtotal += priceToUse * item.quantity;
      }
    }

    // Check Shipping Cost
    let shippingCost = 0;
    // We check if the user has a free shipping condition (purchaseCount >= 1)
    if (orderData.userId) {
      const clientSnap = await adminDb.collection('clients').doc(orderData.userId).get();
      if (clientSnap.exists && (clientSnap.data().purchaseCount || 0) >= 1) {
        shippingCost = 0;
      } else {
        const shippingSnap = await adminDb.collection('settings').doc('shipping').get();
        if (shippingSnap.exists) {
          shippingCost = shippingSnap.data().cost || 15000;
        }
      }
    } else {
      const shippingSnap = await adminDb.collection('settings').doc('shipping').get();
      if (shippingSnap.exists) {
        shippingCost = shippingSnap.data().cost || 15000;
      }
    }

    // Check Coupon
    let discountAmount = 0;
    if (orderData.couponCode) {
      const couponSnap = await adminDb.collection('coupons').doc(orderData.couponCode).get();
      if (couponSnap.exists) {
        const couponData = couponSnap.data();
        if (couponData.active && calculatedSubtotal >= (couponData.minPurchase || 0) && (couponData.usedCount || 0) < (couponData.maxUses || Infinity)) {
           discountAmount = couponData.type === 'PERCENTAGE' 
             ? Math.floor(calculatedSubtotal * (couponData.value / 100)) 
             : couponData.value;
        }
      }
    }

    const calculatedTotal = Math.max(0, calculatedSubtotal - discountAmount + shippingCost);

    // If the client's requested amount is different from our calculation, reject!
    if (Math.abs(calculatedTotal - clientAmount) > 1) { // allow 1 peso rounding diff
      console.warn(`SECURITY ALERT: Hash manipulation attempt on order ${orderId}. Client: ${clientAmount}, Server: ${calculatedTotal}`);
      return new Response(JSON.stringify({ error: 'Monto de orden inválido. Intento de fraude detectado.' }), { status: 400 });
    }

    // Update the order in the database with the verified totals just in case they were altered
    await orderRef.update({
      total: calculatedTotal,
      subtotal: calculatedSubtotal,
      shippingCost: shippingCost,
      discountApplied: discountAmount
    });

    // 3. Generate Bold Integrity Signature using the VERIFIED amount
    const stringToHash = `${orderId}${calculatedTotal}${currency}${secretKey}`;
    const hash = crypto.createHash('sha256').update(stringToHash).digest('hex');

    return new Response(JSON.stringify({ hash, verifiedAmount: calculatedTotal }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error generating hash:", error);
    return new Response(JSON.stringify({ error: 'Error interno generando firma' }), { status: 500 });
  }
}
