import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const copyRecursiveSync = (src, dest) => {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  if (isDirectory) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else if (exists) {
    fs.copyFileSync(src, dest);
  }
};

console.log('🚀 Iniciando proceso de empaquetado para Hostinger...');

console.log('\n📦 1. Compilando el proyecto Next.js...');
try {
  execSync('npm run build', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Error durante la compilación:', error.message);
  process.exit(1);
}

console.log('\n📂 2. Copiando archivos estáticos al directorio standalone...');
const standaloneDir = path.join(process.cwd(), '.next', 'standalone');
const staticDir = path.join(process.cwd(), '.next', 'static');
const publicDir = path.join(process.cwd(), 'public');

const destStatic = path.join(standaloneDir, '.next', 'static');
const destPublic = path.join(standaloneDir, 'public');

if (!fs.existsSync(standaloneDir)) {
  console.error('❌ No se encontró el directorio standalone. Asegúrate de tener output: "standalone" en next.config.mjs');
  process.exit(1);
}

copyRecursiveSync(staticDir, destStatic);
console.log('✅ Carpeta .next/static copiada.');

copyRecursiveSync(publicDir, destPublic);
console.log('✅ Carpeta public copiada.');

console.log('\n🗜️ 3. Creando el archivo ZIP...');
try {
  // Use PowerShell to zip the standalone folder, ensuring paths with spaces are handled properly
  const psCommand = `Compress-Archive -Path '${standaloneDir}\\*' -DestinationPath '${process.cwd()}\\deploy.zip' -Force`;
  execSync(`powershell.exe -Command "${psCommand}"`, { stdio: 'inherit' });
  console.log('✅ Archivo deploy.zip creado con éxito.');
} catch (error) {
  console.error('❌ Error al comprimir:', error.message);
}

console.log('\n🎉 ¡PROCESO FINALIZADO!');
console.log('📌 Sube el archivo deploy.zip a tu Hostinger, extráelo y usa "server.js" como archivo de inicio.');
