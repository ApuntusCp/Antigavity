import { isSensitive, detectIntentComplexity } from './classifier.js';
import { estimateTokenCount, shouldForceConsolidation } from './tokenUtils.js';
import { getHomeostasisDirective, addSentimentRecord, extractSentiment } from './homeostasis.js';
import { reinforceFact, rankFacts } from './memoryWeights.js';

/**
 * Ejemplo conceptual de la función principal askUmma (Core).
 * Integra las Fases 7, 9, 10 y 11 de Cerebro Umma Avanzado.
 */
export async function askUmma(userMessage, conversationHistory, systemInstruction, dbContext) {
  try {
    // ------------------------------------------------------------------
    // FASE 11: Clasificación de Verbosidad y Economía de Créditos
    // ------------------------------------------------------------------
    const intentType = detectIntentComplexity(userMessage);
    let dynamicSystemPrompt = systemInstruction;
    let apiMaxTokens = 800; 

    if (intentType === 'ACTION_QUICK') {
      dynamicSystemPrompt += `\n[MODO: Ultra-Conciso. Responde en 1 o 2 oraciones máximo. Evita saludos largos.]`;
      apiMaxTokens = 150; 
    } else if (intentType === 'DEEP_RESEARCH') {
      dynamicSystemPrompt += `\n[MODO: Investigación Profunda. Usa todos los tokens necesarios. Proporciona datos exhaustivos y cita fuentes verídicas de academias serias. No dejes ningún dato suelto.]`;
      apiMaxTokens = 4000; 
    }

    // ------------------------------------------------------------------
    // FASE 9: Homeostasis y Corrección Activa (Actualizado con Heurística)
    // ------------------------------------------------------------------
    // Analizamos el mensaje actual del usuario para extraer su sentimiento
    const currentSentiment = extractSentiment(userMessage);
    addSentimentRecord(currentSentiment);

    const homeostasisAlert = getHomeostasisDirective();
    if (homeostasisAlert) {
      dynamicSystemPrompt += `\n${homeostasisAlert}`;
    }

    // ------------------------------------------------------------------
    // FASE 7: Inyección Contextual con Ranking
    // ------------------------------------------------------------------
    // Supongamos que dbContext.hechos_clave es un array de objetos Fact
    if (dbContext && dbContext.hechos_clave) {
      const rankedFacts = rankFacts(dbContext.hechos_clave);
      // Tomamos solo el top 5 para no saturar el prompt
      const topFacts = rankedFacts.slice(0, 5).map(f => f.text).join('\n- ');
      dynamicSystemPrompt += `\nHECHOS CLAVE RELEVANTES:\n- ${topFacts}`;
    }

    // ------------------------------------------------------------------
    // FASE 10: Reposicionamiento de Reglas Críticas (Recency Bias)
    // ------------------------------------------------------------------
    const criticalRules = "REGLA CRÍTICA: Los precios son finales. Nunca ofrezcas descuentos no autorizados.";
    
    const messagesPayload = [
      ...conversationHistory,
      { role: 'system', content: dynamicSystemPrompt },
      { role: 'system', content: criticalRules }, // Recency bias
      { role: 'user', content: userMessage }
    ];

    // ------------------------------------------------------------------
    // FASE 10: Gestión Estricta de Presupuesto y Consolidación Dinámica
    // ------------------------------------------------------------------
    const MAX_BUDGET_TOKENS = 100000; 
    let currentTokenCount = estimateTokenCount(messagesPayload);
    
    if (shouldForceConsolidation(currentTokenCount, MAX_BUDGET_TOKENS)) {
      console.log("Forzando ciclo de consolidación en caliente...");
    }

    // ------------------------------------------------------------------
    // FASE 10: Chequeo de Contradicción Selectivo (Guardrail Rápido)
    // ------------------------------------------------------------------
    if (isSensitive(userMessage)) {
      console.log("Intención sensible detectada. Ejecutando doble validación...");
    }

    // ------------------------------------------------------------------
    // LLAMADA FINAL AL LLM (Simulada)
    // ------------------------------------------------------------------
    console.log(`Llamando al LLM con maxTokens: ${apiMaxTokens} y modo: ${intentType}`);
    const response = { text: "Respuesta de Umma generada con éxito." }; 

    // ------------------------------------------------------------------
    // FASE 7: Refuerzo en Caliente (Plasticidad)
    // ------------------------------------------------------------------
    // Tras responder, si usamos algún hecho, aumentamos su peso en background
    if (dbContext && dbContext.hechos_clave && dbContext.hechos_clave.length > 0) {
      // Mock: Reforzamos el primer hecho como ejemplo
      const reinforced = reinforceFact(dbContext.hechos_clave[0]);
      console.log(`[PLASTICIDAD] Hecho reforzado: Peso actual = ${reinforced.weight}`);
      // db.update(reinforced); // Guardar en Firebase
    }

    return response;

  } catch (error) {
    console.error("Error en askUmma:", error);
    throw error;
  }
}
