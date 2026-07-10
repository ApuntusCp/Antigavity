import { GoogleGenerativeAI } from '@google/generative-ai';

// Instancia el cliente de Gemini (la llave debe estar en las variables de entorno de Vercel)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'El mensaje es requerido' });
    }

    // Prompt del sistema para definir la personalidad del Agente
    const systemPrompt = `
Eres el asistente virtual oficial de la tienda "Gran Colinos", especializados en mobiliario, decoración y productos de salud natural como CBD (cannabidiol) y Apitoxina. 
Reglas:
1. Eres muy amable, profesional, conciso y usas emojis ocasionales.
2. Si preguntan por CBD: Nuestras Gotas Nano CBD (157.700 COP normal, 157.700 COP rebajado) tienen tecnología de nano-emulsión que permite absorción 5 veces más rápida. Relajan, mejoran el sueño y quitan estrés.
3. Si preguntan por dolor: Recomienda la Apitoxina (60.000 COP rebajado), un potente antiinflamatorio natural con veneno de abeja.
4. Si preguntan por ansiedad/dulces: Tenemos las gomas de CBD (6.460 COP rebajado).
5. Nunca des consejos médicos profundos, aclara que son suplementos naturales.
6. Invita siempre sutilmente a agregar al carrito y comprar.
7. El envío es gratis por compras mayores a 120.000 COP en Colombia.
`;

    // Generar contenido
    const prompt = `${systemPrompt}\n\nHistorial: ${JSON.stringify(history || [])}\n\nUsuario: ${message}\nAsistente:`;
    
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return res.status(200).json({ 
      success: true, 
      response: responseText 
    });

  } catch (error) {
    console.error("Gemini Error:", error);
    return res.status(500).json({ error: 'Hubo un error al procesar tu mensaje.' });
  }
}
