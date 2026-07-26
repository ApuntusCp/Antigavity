/**
 * Gestor de Presupuesto de Tokens para Cerebro Umma.
 * Fase 10: Estabilidad en contexto largo y consolidación en caliente.
 */

// Estimación simple: 1 token ~= 4 caracteres
const CHARS_PER_TOKEN = 4;

/**
 * Recorta un texto largo respetando los límites de oración (puntos)
 * para asegurar que no exceda el límite seguro de caracteres.
 */
export function trimToSafeBudget(text, maxTokens) {
  if (!text) return '';
  const maxChars = maxTokens * CHARS_PER_TOKEN;
  
  if (text.length <= maxChars) return text;

  // Recortar al máximo de caracteres
  let trimmed = text.substring(0, maxChars);
  
  // Buscar el último punto para no cortar oraciones a la mitad
  const lastPeriod = trimmed.lastIndexOf('.');
  if (lastPeriod > 0) {
    trimmed = trimmed.substring(0, lastPeriod + 1);
  }

  return trimmed;
}

/**
 * Calcula un conteo aproximado de tokens para un array de mensajes
 */
export function estimateTokenCount(messages) {
  if (!Array.isArray(messages)) return 0;
  let totalChars = 0;
  for (const msg of messages) {
    if (msg.content) {
      totalChars += msg.content.length;
    }
  }
  return Math.ceil(totalChars / CHARS_PER_TOKEN);
}

/**
 * Determina si se debe forzar una consolidación basada en el uso de tokens.
 */
export function shouldForceConsolidation(currentTokens, maxTokensBudget, thresholdPercentage = 0.7) {
  return currentTokens >= (maxTokensBudget * thresholdPercentage);
}
