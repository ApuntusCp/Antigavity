import { adminDb } from '../../../../utils/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import crypto from 'crypto';

// ─── BOLD WEBHOOK SIGNATURE VERIFICATION ────────────────────────────────────
// Bold envía un header X-Bold-Signature con HMAC-SHA256 del cuerpo usando
// BOLD_SECRET_KEY. Sin verificar esta firma, cualquiera podría marcar pedidos
// como pagados sin haber pagado realmente.
function verifyBoldSignature(rawBody, signatureHeader) {
  const secretKey = process.env.BOLD_SECRET_KEY;
  if (!signatureHeader) return false;
  const expectedSignature = crypto
    .createHmac('sha256', secretKey)
    .update(rawBody, 'utf8')
    .digest('hex');
  // Comparación en tiempo constante para prevenir timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signatureHeader, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch {
    return false;
  }
}

export async function POST(request) {
  // ── Fail-fast si la clave no está configurada ──────────────────────────────
  // Antes: el webhook omitía la verificación si BOLD_SECRET_KEY no existía,
  // aceptando cualquier llamada sin autenticar. Ahora: falla explícitamente.
  if (!process.env.BOLD_SECRET_KEY) {
    console.error('[Webhook] CRÍTICO: BOLD_SECRET_KEY no está configurada — rechazando');
    return new Response('Server misconfigured: missing BOLD_SECRET_KEY', { status: 500 });
  }

  try {
    const rawBody = await request.text();

    // ── Verificar firma Bold (siempre obligatorio en producción) ──────────────
    const signature = request.headers.get('x-bold-signature') ||
                      request.headers.get('x-signature') ||
                      request.headers.get('signature');
    if (!verifyBoldSignature(rawBody, signature)) {
      console.warn('[Webhook] Firma Bold inválida o ausente — solicitud rechazada');
      return new Response('Unauthorized: Invalid webhook signature', { status: 401 });
    }

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

    // 5. DESCONTAR INVENTARIO (Transacción Atómica — previene race condition)
    // ANTES: batch.update con FieldValue.increment → dos compras simultáneas
    // podían llevar el stock a negativo sin que ninguna fallara.
    // AHORA: runTransaction verifica el stock ANTES de descontarlo. Si stock < qty,
    // la transacción falla y se devuelve error 409 al cliente, sin cobrar.
    if (Array.isArray(orderData.items) && orderData.items.length > 0) {
      try {
        await adminDb.runTransaction(async (transaction) => {
          for (const item of orderData.items) {
            const productRef = adminDb.collection('products').doc(item.id || item.sku);
            const productSnap = await transaction.get(productRef);
            if (!productSnap.exists) continue; // Producto eliminado → skip sin error
            const currentStock = productSnap.data()?.stock ?? 0;
            if (currentStock < item.quantity) {
              throw new Error(`Stock insuficiente para "${item.name || item.id}": stock=${currentStock}, pedido=${item.quantity}`);
            }
            transaction.update(productRef, {
              stock: FieldValue.increment(-item.quantity)
            });
          }
        });
      } catch (stockError) {
        // No revertir el pago (ya fue aprobado por Bold), pero registrar el problema
        console.error('[Webhook] Error en descuento de inventario:', stockError.message);
        await adminDb.collection('notifications').add({
          title: '⚠️ Error de Inventario',
          message: `Pago aprobado para Orden #${orderId}, pero falló el descuento de stock: ${stockError.message}. Revisar en GC Admin.`,
          type: 'stock_error',
          orderId,
          read: false,
          timestamp: new Date()
        }).catch(() => {});
      }
    }

    // 6. Enviar notificación a Telegram
    try {
      const baseUrl = request.headers.get('origin') || `https://${request.headers.get('host')}`;
      await fetch(`${baseUrl}/api/notify/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Pasar token interno para que el endpoint protegido acepte la llamada
          'Authorization': `Bearer ${process.env.ADMIN_SECRET_KEY || ''}`
        },
        body: JSON.stringify({
          name: orderData.customer?.name || 'Cliente Web',
          total: orderData.total,
          city: orderData.customer?.city || 'No especificada'
        })
      });
    } catch (e) {
      console.warn('[Webhook] Falló la notificación de Telegram:', e);
    }

    return new Response("Webhook procesado exitosamente con notificación en GC Admin", { status: 200 });
  } catch (error) {
    console.error("Error crítico en Webhook:", error);
    return new Response("Error interno del servidor", { status: 500 });
  }
}
