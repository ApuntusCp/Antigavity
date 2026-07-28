import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../utils/firebase';

export async function POST(request) {
  try {
    // ── Verificación de token interno ────────────────────────────────────────
    // Este endpoint solo debe ser llamado internamente desde el webhook de pago.
    // Sin este check, cualquiera puede spamear notificaciones al canal de Telegram.
    const authHeader = request.headers.get('authorization') || '';
    const adminSecret = process.env.ADMIN_SECRET_KEY;
    if (adminSecret && authHeader !== `Bearer ${adminSecret}`) {
      return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });
    }

    const orderData = await request.json();

    // Validar que total sea un número antes de formatear (previene TypeError)
    const total = typeof orderData.total === 'number' ? orderData.total : 0;

    // Fetch Telegram credentials securely from Firestore (server-side only)
    const tgSnap = await getDoc(doc(db, 'settings', 'telegram'));
    
    if (tgSnap.exists()) {
      const { botToken, chatId } = tgSnap.data();
      
      if (botToken && chatId) {
        const message = `🛍 *NUEVO PEDIDO RECIBIDO*\n\n*Cliente:* ${orderData.name || 'N/A'}\n*Total:* $${total.toLocaleString('es-CO')}\n*Ciudad:* ${orderData.city || 'N/A'}\n\n*Umma:* ¡Alista los productos para el envío! 🚀`;
        
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'Markdown' })
        });
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[Notify] Error enviando notificación Telegram:', error);
    return new Response(JSON.stringify({ error: 'Error enviando notificación' }), { status: 500 });
  }
}

