import * as ftp from "basic-ftp";
import { config } from "dotenv";
import { resolve } from "path";

// Cargar variables de entorno
config();

async function deploy() {
    const client = new ftp.Client();
    // client.ftp.verbose = true; // Descomentar para ver logs detallados de la conexión

    let host = process.env.FTP_HOST;
    const user = process.env.FTP_USER;
    const password = process.env.FTP_PASSWORD;

    if (host) host = host.replace(/^ftps?:\/\//, '');

    if (!host || !user || !password) {
        console.error("❌ Faltan credenciales FTP. Por favor revisa tu archivo .env");
        console.error("Asegúrate de tener FTP_HOST, FTP_USER y FTP_PASSWORD configurados.");
        process.exit(1);
    }

    try {
        console.log(`🔌 Conectando a FTP: ${host}...`);
        await client.access({
            host: host,
            user: user,
            password: password,
            secure: false // Hostinger a veces requiere true o false dependiendo de la configuración
        });
        
        console.log("✅ Conectado exitosamente al servidor FTP.");
        
        // Listar el directorio para debug
        const list = await client.list();
        const hasPublicHtml = list.some(item => item.name === 'public_html');
        const hasDomains = list.some(item => item.name === 'domains');
        
        if (hasDomains) {
            await client.cd('domains/grancolinos.com/public_html').catch(() => {});
        } else if (hasPublicHtml) {
            await client.cd('public_html');
        }

        console.log("🚀 Subiendo archivos de la carpeta dist/ al directorio actual del FTP...");
        
        // Sube todo el contenido de la carpeta 'dist' al directorio actual del FTP
        await client.uploadFromDir("dist");
        
        console.log("🎉 ¡Despliegue completado con éxito! Tu sitio está actualizado.");

    } catch (err) {
        console.error("❌ Hubo un error durante el despliegue:", err);
    }
    client.close();
}

deploy();
