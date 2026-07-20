import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../utils/firebase';

export async function POST(request) {
  try {
    const orderData = await request.json();

    // Fetch Telegram credentials securely from Firestore (server-side only)
    const tgSnap = await getDoc(doc(db, 'settings', 'telegram'));
    
    if (tgSnap.exists()) {
      const { botToken, chatId } = tgSnap.data();
      
      if (botToken && chatId) {
        const message = `🛍 *NUEVO PEDIDO RECIBIDO*\n\n*Cliente:* ${orderData.name}\n*Total:* $${orderData.total.toLocaleString('es-CO')}\n*Ciudad:* ${orderData.city}\n\n*Umma:* ¡Alista los productos para el envío! 🚀`;
        
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
    console.error("Error sending Telegram notification:", error);
    return new Response(JSON.stringify({ error: 'Error enviando notificación' }), { status: 500 });
  }
}
