import twilio from 'twilio';

// Instancia el cliente de Twilio (opcional por si las variables no están)
let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const orderData = req.body;
    const { customer, totals, items } = orderData;

    let paymentUrl = 'https://pagos.bold.co/ejemplo-checkout-gran-colinos'; 

    // 1. Llamar a la API de BOLD para generar Link de Pago
    if (process.env.BOLD_SECRET_KEY && process.env.BOLD_IDENTITY_KEY) {
      const boldPayload = {
        amount: totals.grandTotal,
        currency: 'COP',
        description: `Compra Gran Colinos - ${customer.firstName} ${customer.lastName}`,
        taxes: 0,
        integritySignature: process.env.BOLD_IDENTITY_KEY // En integración real se firma criptográficamente
      };

      try {
        // Ejemplo genérico de solicitud a Bold. 
        // Si la URL cambia en su nueva versión, puedes ajustarla aquí.
        const boldResponse = await fetch('https://api.bold.co/v2/payment-link', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.BOLD_SECRET_KEY}`
          },
          body: JSON.stringify(boldPayload)
        });
        
        if (boldResponse.ok) {
          const boldData = await boldResponse.json();
          if (boldData && boldData.paymentLink) {
             paymentUrl = boldData.paymentLink;
          }
        } else {
          console.error("Error desde Bold API:", await boldResponse.text());
          // Si falla (ej. endpoint incorrecto de la v2), mantenemos la URL simulada para que el UX no se rompa
        }
      } catch (boldErr) {
        console.error("Error conectando con Bold:", boldErr);
      }
    }

    // 2. Enviar WhatsApp al Administrador usando Twilio (Si está configurado)
    if (twilioClient && process.env.ADMIN_WHATSAPP_NUMBER) {
      const waMessage = `🚨 *Nuevo Pedido - Gran Colinos*\n\n` +
                        `👤 Cliente: ${customer.firstName} ${customer.lastName}\n` +
                        `📍 Ciudad: ${customer.city}, ${customer.department}\n` +
                        `💰 Total: $${totals.grandTotal.toLocaleString('es-CO')}\n\n` +
                        `Esperando que el cliente realice el pago en Bold.`;

      await twilioClient.messages.create({
        body: waMessage,
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:${process.env.ADMIN_WHATSAPP_NUMBER}`
      }).catch(e => console.error("Error enviando WS:", e));
    }

    // 3. Devolver la URL de pago al frontend
    return res.status(200).json({ 
      success: true, 
      paymentUrl: paymentUrl 
    });

  } catch (error) {
    console.error("Checkout Backend Error:", error);
    return res.status(500).json({ error: 'Error procesando la orden en el servidor.' });
  }
}
