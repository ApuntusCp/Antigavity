import { adminDb } from '../../../../utils/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(request) {
  try {
    const rawBody = await request.text();
    let data;
    try {
      data = JSON.parse(rawBody);
    } catch (e) {
      return new Response("Invalid JSON", { status: 400 });
    }

    const orderId = data?.payment?.reference || data?.reference;
    const status = data?.payment?.status || data?.status;

    if (!orderId) {
      return new Response("Falta reference/orderId", { status: 400 });
    }

    if (status !== 'APPROVED') {
      // Registrar notificación de fallo o rechazo de pago en GC Admin
      try {
        await adminDb.collection('notifications').add({
          title: '⚠️ Pago Rechazado o Cancelado',
          message: `El pago para la Orden #${orderId} no fue aprobado. Estado de la pasarela: ${status || 'REJECTED'}.`,
          type: 'payment_error',
          orderId: orderId,
          read: false,
          timestamp: new Date()
        });
      } catch (e) {
        console.warn("Could not write rejection notification:", e);
      }

      return new Response("Pago no aprobado, notificación enviada a GC Admin", { status: 200 });
    }

    // 1. Obtener la orden
    const orderRef = adminDb.collection('orders').doc(orderId);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
      return new Response("Orden no encontrada", { status: 404 });
    }

    const orderData = orderSnap.data();

    // Si ya está pagada, evitamos descontar el stock doble vez
    if (orderData.status === 'paid') {
      return new Response("La orden ya fue procesada previamente", { status: 200 });
    }

    // 2. Actualizar estado de la orden a 'paid'
    await orderRef.update({
      status: 'paid',
      paidAt: FieldValue.serverTimestamp()
    });

    // 3. Actualizar estado del carrito en GC Admin
    const cartRef = adminDb.collection('carts').doc(orderId);
    await cartRef.update({
      status: 'paid'
    }).catch(e => console.warn("Error al actualizar carrito:", e));

    // 4. Registrar notificación de venta exitosa en GC Admin
    try {
      await adminDb.collection('notifications').add({
        title: '🎉 ¡Nueva Venta Aprobada!',
        message: `El pago para la Orden #${orderId} fue APROBADO exitosamente por Bold por un valor de $${(orderData.total || 0).toLocaleString()} COP.`,
        type: 'payment_success',
        orderId: orderId,
        amount: orderData.total,
        customerName: orderData.customer?.name || 'Cliente',
        customerEmail: orderData.customer?.email || '',
        read: false,
        timestamp: new Date()
      });
    } catch (e) {
      console.warn("Could not write success notification:", e);
    }

    // 5. DESCONTAR INVENTARIO
    if (Array.isArray(orderData.items) && orderData.items.length > 0) {
      const batch = adminDb.batch();
      for (const item of orderData.items) {
        const productRef = adminDb.collection('products').doc(item.id || item.sku);
        batch.update(productRef, {
           stock: FieldValue.increment(-item.quantity)
        });
      }
      try {
        await batch.commit();
        console.log(`Inventario descontado exitosamente para la orden ${orderId}`);
      } catch (e) {
        console.error("Fallo al descontar el inventario:", e);
      }
    }

    // 6. Enviar notificación a Telegram
    try {
      const baseUrl = request.headers.get('origin') || `https://${request.headers.get('host')}`;
      await fetch(`${baseUrl}/api/notify/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: orderData.customer?.name || 'Cliente Web',
          total: orderData.total,
          city: orderData.customer?.city || 'No especificada'
        })
      });
    } catch (e) {
      console.warn("Fallo la notificación de Telegram:", e);
    }

    return new Response("Webhook procesado exitosamente con notificación en GC Admin", { status: 200 });
  } catch (error) {
    console.error("Error crítico en Webhook:", error);
    return new Response("Error interno del servidor", { status: 500 });
  }
}
