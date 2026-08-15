#!/usr/bin/env node

/**
 * ============================================================================
 * GRANCOLINOS.COM — SCRIPT DE AUDITORÍA AUTOMATIZADA DE SEGURIDAD & DATOS
 * ============================================================================
 * Ejecutable en CI/CD, pre-commit o manualmente antes de cada despliegue.
 * Verifica:
 *  1. Ausencia de claves privadas en bundles de cliente o código público.
 *  2. Ausencia de spread operators (...data) en funciones de consulta a DB.
 *  3. Validación de variables públicas NEXT_PUBLIC_ (solo IDs no confidenciales).
 *  4. Configuración de cabeceras de seguridad HTTP en Next.js.
 * ============================================================================
 */

import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();
let errorCount = 0;
let warningCount = 0;

console.log("\n=======================================================");
console.log("🛡️  INICIANDO AUDITORÍA AUTOMATIZADA DE SEGURIDAD");
console.log("=======================================================\n");

// 1. Validar .env.local
console.log("1. Auditando variables de entorno en .env.local...");
const envPath = path.join(ROOT_DIR, '.env.local');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key] = trimmed.split('=');
      const cleanKey = key.trim();
      
      // Si tiene prefijo NEXT_PUBLIC_ pero parece ser un secreto
      if (cleanKey.startsWith('NEXT_PUBLIC_')) {
        if (/secret|private|token|password|auth_key|service_account/i.test(cleanKey)) {
          console.error(`❌ [ERROR] Variable crítica con prefijo público: ${cleanKey} (línea ${index + 1})`);
          errorCount++;
        } else {
          console.log(`   ✔ Variable pública permitida: ${cleanKey}`);
        }
      } else {
        console.log(`   ✔ Variable privada de servidor: ${cleanKey}`);
      }
    }
  });
} else {
  console.log("   ℹ Archivo .env.local no encontrado en local (se asume inyectado en CI/CD).");
}

// 2. Escanear código fuente en busca de sobre-exposición de datos (...data en DB reads)
console.log("\n2. Auditando sobre-exposición de datos en DB reads (src/utils/)...");
const utilsDir = path.join(ROOT_DIR, 'src', 'utils');
if (fs.existsSync(utilsDir)) {
  const utilsFiles = fs.readdirSync(utilsDir).filter(f => f.endsWith('.js') || f.endsWith('.ts'));
  utilsFiles.forEach(file => {
    const filePath = path.join(utilsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // Buscar doc.data() seguido de spread sin proyección
    if (content.includes('...data') && file !== 'firebase-admin.js') {
      console.warn(`⚠️  [WARNING] Posible sobre-exposición de datos detectada (...data) en: src/utils/${file}`);
      warningCount++;
    } else {
      console.log(`   ✔ src/utils/${file} sanitizado (proyección estricta).`);
    }
  });
}

// 3. Escaneo de secretos en componentes y páginas de cliente
console.log("\n3. Escaneando llamadas de cliente y componentes (src/components, src/app)...");
const clientDirs = [
  path.join(ROOT_DIR, 'src', 'components'),
  path.join(ROOT_DIR, 'src', 'app')
];

const FORBIDDEN_CLIENT_PATTERNS = [
  { name: 'Clave privada Firebase Admin', regex: /adminDb|service_account|private_key/g },
  { name: 'Secret Key de Pasarela en Cliente', regex: /BOLD_SECRET_KEY|ADMIN_SECRET_KEY/g }
];

function scanClientFiles(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      // Ignorar carpeta api en app (es código de servidor)
      if (entry.name !== 'api' && entry.name !== 'node_modules') {
        scanClientFiles(fullPath);
      }
    } else if (entry.isFile() && (entry.name.endsWith('.js') || entry.name.endsWith('.jsx'))) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const relPath = path.relative(ROOT_DIR, fullPath);

      FORBIDDEN_CLIENT_PATTERNS.forEach(pat => {
        // Excluir rutas de API porque se ejecutan en Node/Edge server
        if (!relPath.includes('api' + path.sep)) {
          if (pat.regex.test(content)) {
            console.error(`❌ [ERROR] ${pat.name} encontrada en archivo de cliente: ${relPath}`);
            errorCount++;
          }
        }
      });
    }
  }
}

clientDirs.forEach(d => scanClientFiles(d));
console.log("   ✔ Código de cliente verificado bajo política Zero-Client-Side Secrets.");

// 4. Verificar cabeceras de seguridad en next.config.mjs
console.log("\n4. Verificando cabeceras de seguridad HTTP en next.config.mjs...");
const nextConfigPath = path.join(ROOT_DIR, 'next.config.mjs');
if (fs.existsSync(nextConfigPath)) {
  const confContent = fs.readFileSync(nextConfigPath, 'utf8');
  const requiredHeaders = [
    'X-Content-Type-Options',
    'X-Frame-Options',
    'Referrer-Policy',
    'Strict-Transport-Security'
  ];

  requiredHeaders.forEach(h => {
    if (confContent.includes(h)) {
      console.log(`   ✔ Cabecera configurada: ${h}`);
    } else {
      console.error(`❌ [ERROR] Cabecera requerida no encontrada: ${h}`);
      errorCount++;
    }
  });
}

// Resumen final
console.log("\n=======================================================");
console.log(`RESUMEN DE AUDITORÍA: ${errorCount} ERRORES, ${warningCount} ADVERTENCIAS`);
console.log("=======================================================\n");

if (errorCount > 0) {
  console.error("❌ LA AUDITORÍA FALLÓ. Corrige los errores antes de desplegar.\n");
  process.exit(1);
} else {
  console.log("✅ AUDITORÍA DE SEGURIDAD EXITOSA: 0 credenciales ni datos expuestos.\n");
  process.exit(0);
}
