import crypto from 'crypto';
import { adminDb } from '../../../../utils/firebase-admin';

export async function POST(request) {
  try {
    const { orderId, currency } = await request.json();

    if (!orderId || !currency) {
      return new Response(JSON.stringify({ error: 'Faltan parámetros de orden' }), { status: 400 });
    }

    // ── Seguridad crítica: la clave NUNCA tiene fallback hardcodeado ─────────
    const secretKey = process.env.BOLD_SECRET_KEY;
    if (!secretKey) {
      console.error('[Hash] BOLD_SECRET_KEY no está definida — abortar generación de hash');
      return new Response(JSON.stringify({ error: 'Configuración de pasarela no disponible' }), { status: 500 });
    }

    // ── Leer el total REAL desde Firestore (nunca del cliente) ───────────────
    // Previene que un atacante envíe un monto manipulado (ej: 1 COP en vez de 100.000 COP)
    const orderRef = adminDb.collection('orders').doc(orderId);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
      return new Response(JSON.stringify({ error: 'Orden no encontrada' }), { status: 404 });
    }

    const orderData = orderSnap.data();
    const trustedTotal = orderData.total;

    if (!trustedTotal || typeof trustedTotal !== 'number' || trustedTotal <= 0) {
      return new Response(JSON.stringify({ error: 'Total de orden inválido en base de datos' }), { status: 400 });
    }

    // Actualizar estado de la orden para el checkout en vivo
    try {
      await orderRef.update({
        status: 'pending_payment_live',
        paymentMode: 'LIVE'
      });
    } catch (e) {
      console.warn('[Hash] No se pudo actualizar estado de la orden:', e);
    }

    // ── Generar hash SHA-256 con el total confiable de Firestore ────────────
    const stringToHash = `${orderId}${trustedTotal}${currency}${secretKey}`;
    const hash = crypto.createHash('sha256').update(stringToHash).digest('hex');

    // Notificar GC Admin del inicio del proceso de pago
    try {
      await adminDb.collection('notifications').add({
        title: 'Inicio de Pago en Vivo',
        message: `Cliente ${orderData?.customer?.name || 'Comprador'} inició proceso de pago para la Orden #${orderId}.`,
        type: 'new_order',
        orderId: orderId,
        amount: trustedTotal,
        customerName: orderData?.customer?.name || 'Cliente Web',
        customerEmail: orderData?.customer?.email || 'N/A',
        read: false,
        timestamp: new Date()
      });
    } catch (e) {
      console.warn('[Hash] No se pudo notificar a GC Admin:', e);
    }

    return new Response(JSON.stringify({
      hash: hash,
      verifiedAmount: trustedTotal,
      isLive: true,
      status: 'success'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[Hash] Error generando checkout hash:', error);

    try {
      await adminDb.collection('notifications').add({
        title: '⚠️ Fallo en Pasarela de Pago',
        message: `Error al procesar hash de seguridad: ${error.message}`,
        type: 'payment_error',
        read: false,
        timestamp: new Date()
      });
    } catch (e) {
      // Silenciar error secundario
    }

    return new Response(JSON.stringify({ error: 'Error interno procesando firma de seguridad de pago' }), { status: 500 });
  }
}

