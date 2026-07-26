/**
 * Módulo de Homeostasis para Cerebro Umma.
 * Fase 9: Autorregulación basada en la satisfacción del usuario a corto plazo.
 */

const sentimentHistory = []; 
const MAX_HISTORY_LENGTH = 5;

const SETPOINTS = {
  minSatisfaction: 0.4, // Escala 0 a 1. Menos de 0.4 dispara alerta.
};

// Palabras heurísticas para extraer sentimiento sin API
const POSITIVE_WORDS = ['gracias', 'excelente', 'perfecto', 'bien', 'bueno', 'genial', 'encanta'];
const NEGATIVE_WORDS = ['mal', 'pesimo', 'pésimo', 'error', 'equivocado', 'horrible', 'malo', 'no sirve'];

/**
 * Analizador heurístico rápido de sentimiento (rango 0 a 1)
 */
export function extractSentiment(text) {
  if (!text) return 0.7; // Neutral-positivo por defecto
  const normalized = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  let score = 0.7; 
  if (POSITIVE_WORDS.some(w => normalized.includes(w))) score += 0.3;
  if (NEGATIVE_WORDS.some(w => normalized.includes(w))) score -= 0.6;
  
  // Limitar entre 0 y 1
  return Math.max(0, Math.min(1, score));
}

/**
 * Agrega un nuevo registro de sentimiento al historial (ventana móvil de 5 turnos).
 */
export function addSentimentRecord(sentimentScore) {
  sentimentHistory.push(sentimentScore);
  if (sentimentHistory.length > MAX_HISTORY_LENGTH) {
    sentimentHistory.shift(); 
  }
}

/**
 * Calcula la media móvil de los últimos turnos.
 */
export function calculateMovingAverage() {
  if (sentimentHistory.length === 0) return 0.7; 
  const sum = sentimentHistory.reduce((acc, val) => acc + val, 0);
  return sum / sentimentHistory.length;
}

/**
 * Retorna una directiva temporal si la homeostasis está rota (sentimiento bajo).
 */
export function getHomeostasisDirective() {
  const average = calculateMovingAverage();
  if (average < SETPOINTS.minSatisfaction) {
    return `[ALERTA INTERNA: Baja satisfacción detectada en los últimos turnos (${average.toFixed(2)}). Cambia a un tono altamente empático, disculpándote si es necesario, y responde de forma concisa.]`;
  }
  return null;
}

export function resetHomeostasis() {
  sentimentHistory.length = 0;
}
