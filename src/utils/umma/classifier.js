/**
 * Clasificador Regex rápido para Cerebro Umma.
 * Fase 10: Detectar intenciones sensibles (Guardrail).
 * Fase 11: Detectar complejidad de intención para verbosidad dinámica.
 */

// Las palabras clave ya no necesitan tildes porque normalizaremos el texto de entrada.
const SENSITIVE_KEYWORDS = [
  'precio', 'costo', 'cotiza', 'cotizacion', 'cuanto vale', 
  'cuanto cuesta', 'descuento', 'promocion', 'envio', 
  'cuando llega', 'stock', 'disponible'
];

const RESEARCH_KEYWORDS = [
  'como funciona', 'por que', 'investiga', 'explica', 'detalla', 
  'historia', 'diferencia', 'que significa', 'analiza', 
  'resumen de', 'profundiza'
];

const ACTION_QUICK_KEYWORDS = [
  'ok', 'vale', 'listo', 'gracias', 'hola', 'adios', 'hazlo', 
  'confirma', 'si', 'no', 'claro'
];

// Generar expresiones regulares seguras con \b (word boundaries)
const buildRegex = (keywords) => new RegExp(`\\b(${keywords.join('|')})\\b`, 'i');

const sensitiveRegex = buildRegex(SENSITIVE_KEYWORDS);
const researchRegex = buildRegex(RESEARCH_KEYWORDS);
const actionRegex = buildRegex(ACTION_QUICK_KEYWORDS);

/**
 * Normaliza el texto: a minúsculas y elimina tildes/acentos
 * para que el Regex con \b funcione sin problemas.
 */
function normalizeText(text) {
  if (!text) return '';
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/**
 * Determina si el texto del usuario toca temas sensibles que requieren
 * chequeo de contradicción (doble llamada al LLM).
 */
export function isSensitive(text) {
  const normalized = normalizeText(text);
  return sensitiveRegex.test(normalized);
}

/**
 * Determina la complejidad de la intención para ajustar parámetros de verbosidad
 * y límite de tokens en la petición a la API.
 */
export function detectIntentComplexity(text) {
  const normalized = normalizeText(text);

  if (researchRegex.test(normalized)) {
    return 'DEEP_RESEARCH';
  }

  // Si es muy corto (<= 4 palabras) y contiene palabras de acción
  if (normalized.trim().split(/\s+/).length <= 4 && actionRegex.test(normalized)) {
    return 'ACTION_QUICK';
  }

  return 'NORMAL';
}
