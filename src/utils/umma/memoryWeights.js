/**
 * Módulo de Plasticidad y Pesos de Memoria para Cerebro Umma.
 * Fase 7: Refuerzo y Decaimiento de Hechos Clave.
 */

const MAX_WEIGHT = 5.0;
const MIN_WEIGHT = 0.5;
const BOOST_AMOUNT = 0.5;
const DECAY_RATE_PER_DAY = 0.1;

/**
 * Inicializa un nuevo hecho clave.
 * @param {string} text - El contenido del hecho.
 * @returns {object} El objeto hecho_clave.
 */
export function initializeFact(text) {
  return {
    text: text,
    weight: 1.0,
    last_activated: Date.now()
  };
}

/**
 * Refuerza el peso de un hecho que acaba de ser utilizado (Plasticidad).
 */
export function reinforceFact(fact) {
  fact.weight = Math.min(MAX_WEIGHT, fact.weight + BOOST_AMOUNT);
  fact.last_activated = Date.now();
  return fact;
}

/**
 * Aplica decaimiento a un hecho basado en los días transcurridos desde su último uso.
 */
export function decayFact(fact) {
  const daysPassed = (Date.now() - fact.last_activated) / (1000 * 60 * 60 * 24);
  if (daysPassed > 1) { // Solo decae si pasó más de un día
    const decayAmount = Math.floor(daysPassed) * DECAY_RATE_PER_DAY;
    fact.weight = Math.max(MIN_WEIGHT, fact.weight - decayAmount);
  }
  return fact;
}

/**
 * Calcula el Score final de un hecho para decidir si se inyecta en el contexto.
 * Fómula: peso * factor_recencia
 */
export function calculateFactScore(fact) {
  const daysPassed = (Date.now() - fact.last_activated) / (1000 * 60 * 60 * 24);
  // Recency factor: más alto mientras menos días hayan pasado (mínimo 0.1)
  const recencyFactor = Math.max(0.1, 1 - (daysPassed * 0.05));
  return fact.weight * recencyFactor;
}

/**
 * Ordena un array de hechos por su Score (descendente).
 */
export function rankFacts(factsArray) {
  return factsArray.sort((a, b) => calculateFactScore(b) - calculateFactScore(a));
}
