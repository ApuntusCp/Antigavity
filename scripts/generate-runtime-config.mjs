#!/usr/bin/env node
/**
 * Genera la configuración pública de Firebase para GC Admin en tiempo de build.
 *
 * - Se ejecuta antes de `next build` (Vercel) y escribe:
 *     public/GC-Admin/firebase-config.js
 * - La clave NUNCA está en el repositorio: llega por la variable de entorno
 *   GC_FIREBASE_CONFIG (Project Settings → Environment Variables).
 * - Si la variable falta, el archivo queda con un aviso legible en lugar de
 *   romper la app en silencio.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const outDir = resolve('public', 'GC-Admin');
const outFile = resolve(outDir, 'firebase-config.js');
const raw = process.env.GC_FIREBASE_CONFIG || '';

let body;
if (raw.trim()) {
  try {
    // Validación mínima: debe ser un JSON con apiKey.
    const parsed = JSON.parse(raw);
    if (!parsed.apiKey) throw new Error('Falta apiKey');
    body = `window.GC_FIREBASE_CONFIG = ${JSON.stringify(parsed)};`;
    console.log('[runtime-config] Configuración de Firebase inyectada desde GC_FIREBASE_CONFIG.');
  } catch (error) {
    console.error('[runtime-config] GC_FIREBASE_CONFIG no es un JSON válido:', error.message);
    body = `window.GC_FIREBASE_CONFIG = null; console.error('[GC Admin] GC_FIREBASE_CONFIG inválida o ausente.');`;
  }
} else {
  console.warn('[runtime-config] GC_FIREBASE_CONFIG no está definida: el admin web no podrá iniciar sesión.');
  body = `window.GC_FIREBASE_CONFIG = null; console.error('[GC Admin] Falta GC_FIREBASE_CONFIG en el entorno.');`;
}

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, `${body}\n`, 'utf8');
console.log(`[runtime-config] Escrito ${outFile}`);
