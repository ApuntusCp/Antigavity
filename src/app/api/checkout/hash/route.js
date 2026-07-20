import crypto from 'crypto';

export async function POST(request) {
  try {
    const { orderId, amount, currency } = await request.json();

    if (!orderId || !amount || !currency) {
      return new Response(JSON.stringify({ error: 'Faltan parámetros' }), { status: 400 });
    }

    const secretKey = process.env.BOLD_SECRET_KEY;
    
    if (!secretKey) {
      return new Response(JSON.stringify({ error: 'La llave secreta de Bold no está configurada' }), { status: 500 });
    }

    // Bold requires integritySignature for v2
    // Concatenate orderId, amount, currency, and secretKey
    const stringToHash = `${orderId}${amount}${currency}${secretKey}`;
    
    const hash = crypto.createHash('sha256').update(stringToHash).digest('hex');

    return new Response(JSON.stringify({ hash }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error generating hash:", error);
    return new Response(JSON.stringify({ error: 'Error interno generando firma' }), { status: 500 });
  }
}
