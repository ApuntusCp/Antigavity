import twilio from 'twilio';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

// Configuración de Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// Leer datos manuales de la tienda (inventario, ventas, etc)
function getStoreData() {
  try {
    const dataPath = path.join(process.cwd(), 'backend', 'store-data.json');
    const file = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(file);
  } catch (error) {
    console.error("Error leyendo store-data.json:", error);
    return { error: "No se pudo leer la base de datos." };
  }
}

/**
 * 🧠 Router Neuronal Multimodelo (Optimizador de Tokens y Costos)
 * Analiza la complejidad de la pregunta y decide qué IA usar para
 * gastar los menos tokens posibles de forma efectiva.
 */
async function neuronalRouter(prompt, systemPrompt) {
  const isComplex = prompt.toLowerCase().includes('audita') || 
                    prompt.toLowerCase().includes('analiza') || 
                    prompt.toLowerCase().includes('flujo de caja') ||
                    prompt.length > 200;

  // 1. Intentar usar Deepseek/Opus/Kimi si las llaves existen (Router para modelos avanzados)
  if (isComplex && process.env.OPENROUTER_API_KEY) {
    // Si tienes OpenRouter, puedes rutear a Opus, Deepseek o Kimi fácilmente
    console.log("🚀 Ruteando a modelo complejo (OpenRouter)...");
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "anthropic/claude-3-opus", // o deepseek/deepseek-coder
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt }
          ]
        })
      });
      const data = await response.json();
      if (data.choices && data.choices[0]) {
        return data.choices[0].message.content;
      }
    } catch (e) {
      console.error("Error en modelo complejo, cayendo a Gemini...", e);
    }
  }

  // 2. Modelo Principal por defecto: Gemini Flash (Súper rápido y gratis)
  console.log("⚡ Ruteando a Gemini (Alta velocidad, bajo costo de tokens)...");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(`${systemPrompt}\n\nPregunta del jefe: ${prompt}`);
  return result.response.text();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    // Twilio envía los datos como x-www-form-urlencoded
    const { Body, From, To } = req.body;
    
    // Extraer números
    const senderNumber = From.replace('whatsapp:', '');
    const adminNumber = process.env.ADMIN_WHATSAPP_NUMBER.replace('whatsapp:', '');

    // 🔒 CAPA DE SEGURIDAD: Solo el jefe puede auditar la tienda
    if (senderNumber !== adminNumber) {
      console.log(`Intento de acceso no autorizado desde: ${senderNumber}`);
      return res.status(403).send('No autorizado.');
    }

    // 1. Cargar el cerebro (datos de la tienda)
    const storeData = getStoreData();
    const storeDataString = JSON.stringify(storeData, null, 2);

    // 2. Configurar la personalidad del Agente Ejecutivo
    const systemPrompt = `
Eres el Agente Ejecutivo y Asistente Financiero Privado de Gran Colinos.
Tu jefe (el dueño de la empresa) te está hablando por WhatsApp.
Misión: Dar reportes rápidos, concisos y exactos sobre el estado del negocio.

Reglas de Oro:
- Gasta los menos tokens posibles. Ve directo al grano.
- Usa listas con viñetas para datos numéricos.
- Nunca inventes datos. Usa SOLO la siguiente base de datos en tiempo real:

BASE DE DATOS ACTUAL:
${storeDataString}
`;

    // 3. Pasar por el Router Neuronal
    const aiResponse = await neuronalRouter(Body, systemPrompt);

    // 4. Enviar respuesta por WhatsApp
    await client.messages.create({
      body: aiResponse,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${adminNumber}`
    });

    // Twilio espera un XML vacío como respuesta exitosa si ya enviamos el mensaje por API
    res.setHeader('Content-Type', 'text/xml');
    res.status(200).send('<Response></Response>');

  } catch (error) {
    console.error('Error en webhook de WhatsApp:', error);
    res.status(500).send('Internal Server Error');
  }
}
