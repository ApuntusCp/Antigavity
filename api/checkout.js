import twilio from 'twilio';

// Instancia el cliente de Twilio
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

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
    const { customer, totals } = orderData;

    // 1. Llamar a la API de BOLD para generar Link de Pago (Simulado aquí si no hay API Key)
    // Documentación Bold: https://developers.bold.co
    let paymentUrl = 'https://pagos.bold.co/ejemplo-checkout-gran-colinos'; 
    
    if (process.env.BOLD_API_KEY) {
      // Aquí iría el fetch real a la API de BOLD usando process.env.BOLD_API_KEY
      // const boldResponse = await fetch('https://api.bold.co/v1/...');
    }

    // 2. Enviar WhatsApp al Administrador (Agente Ejecutivo) usando Twilio
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.ADMIN_WHATSAPP_NUMBER) {
      const waMessage = `🚨 *Nuevo Pedido - Gran Colinos*\n\n` +
                        `👤 Cliente: ${customer.firstName} ${customer.lastName}\n` +
                        `📍 Ciudad: ${customer.city}, ${customer.department}\n` +
                        `💰 Total: $${totals.grandTotal.toLocaleString('es-CO')}\n\n` +
                        `Esperando que el cliente realice el pago en Bold.`;

      await twilioClient.messages.create({
        body: waMessage,
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:${process.env.ADMIN_WHATSAPP_NUMBER}`
      });
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
