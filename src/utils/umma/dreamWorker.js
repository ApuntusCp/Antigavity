/**
 * Worker de Consolidación Nocturna para Cerebro Umma (El "Sueño").
 * Fase 8: Módulo tipo CRON diseñado para correr en el proceso Main de Electron.
 */

import { decayFact } from './memoryWeights.js';

// En producción esto interactuaría con Firestore/SQLite
// import { db } from '../firebase.js'; 

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * Función que simula la poda del historial crudo en la base de datos.
 */
async function pruneRawHistory() {
  console.log("[SUEÑO] Iniciando poda de historial crudo...");
  const cutoffDate = Date.now() - THIRTY_DAYS_MS;
  
  // Lógica mockeada: db.collection('umma_raw_history').where('timestamp', '<', cutoffDate).delete();
  console.log(`[SUEÑO] Historial anterior a ${new Date(cutoffDate).toISOString()} ha sido eliminado.`);
}

/**
 * Función que aplica decaimiento a todos los hechos en la base de datos.
 */
async function applyDecayToMemories() {
  console.log("[SUEÑO] Aplicando decaimiento a los hechos clave...");
  // Lógica mockeada: 
  // const facts = await db.collection('hechos_clave').get();
  // facts.forEach(doc => { 
  //   const updatedFact = decayFact(doc.data());
  //   doc.ref.update(updatedFact);
  // });
  console.log("[SUEÑO] Decaimiento aplicado exitosamente a la plasticidad.");
}

/**
 * Ejecuta el ciclo completo del "Sueño" de Umma.
 */
export async function runUmmaDreamCycle() {
  console.log("=== INICIANDO CICLO DE SUEÑO DE UMMA ===");
  try {
    await pruneRawHistory();
    await applyDecayToMemories();
    // Aquí también se puede integrar la generación del JSON diario de temas (Fase 8).
    console.log("=== CICLO DE SUEÑO COMPLETADO ===");
  } catch (error) {
    console.error("[SUEÑO] Error durante la consolidación:", error);
  }
}

/**
 * Inicia el temporizador para que el ciclo corra automáticamente.
 * Idealmente se llama una sola vez al iniciar la app de Electron.
 * @param {number} intervalMs - Cada cuánto tiempo correr. (Default: 24h)
 */
export function startDreamWorker(intervalMs = 24 * 60 * 60 * 1000) {
  console.log(`[WORKER] DreamWorker iniciado. Próximo ciclo en ${intervalMs / 1000}s`);
  setInterval(() => {
    runUmmaDreamCycle();
  }, intervalMs);
}
