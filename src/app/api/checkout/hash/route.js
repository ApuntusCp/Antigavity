import crypto from 'crypto';
import { adminDb } from '../../../../utils/firebase-admin';

// ── Rate Limiter en memoria (Ventana deslizante de 60s por IP) ───────────────
// Previene ataques de fuerza bruta y card testing automatizado contra la pasarela.
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 6;

function checkRateLimit(ip) {
  const now = Date.now();
  const clientData = rateLimitMap.get(ip) || [];
  const validRequests = clientData.filter(ts => now - ts < RATE_LIMIT_WINDOW_MS);

  if (validRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  validRequests.push(now);
  rateLimitMap.set(ip, validRequests);

  // Limpieza periódica de IPs inactivas
  if (rateLimitMap.size > 2000) {
    for (const [key, timestamps] of rateLimitMap.entries()) {
      if (timestamps.every(ts => now - ts >= RATE_LIMIT_WINDOW_MS)) {
        rateLimitMap.delete(key);
      }
    }
  }

  return true;
}

export async function POST(request) {
  try {
    // ── Validación de Rate Limit por IP ───────────────────────────────────────
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                     request.headers.get('x-real-ip') ||
                     'unknown-ip';

    if (!checkRateLimit(clientIp)) {
      console.warn(`[Hash RateLimit] Solicitudes excesivas desde IP: ${clientIp}`);
      return new Response(JSON.stringify({ 
        error: 'Demasiadas solicitudes de pago en un corto período. Por favor espera un momento.' 
      }), { 
        status: 429, 
        headers: { 'Content-Type': 'application/json', 'Retry-After': '60' } 
      });
    }

    const { orderId, currency } = await request.json();

    if (!orderId || typeof orderId !== 'string' || !/^[a-zA-Z0-9_-]{4,64}$/.test(orderId)) {
      return new Response(JSON.stringify({ error: 'Identificador de orden inválido o malformado' }), { status: 400 });
    }

    if (!currency || currency !== 'COP') {
      return new Response(JSON.stringify({ error: 'Moneda de transacción no admitida' }), { status: 400 });
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

    // Validar que la orden no haya sido pagada ya
    if (orderData.status === 'paid') {
      return new Response(JSON.stringify({ error: 'Esta orden ya fue pagada y procesada previamente' }), { status: 400 });
    }

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
        title: 'Fallo en Pasarela de Pago',
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

