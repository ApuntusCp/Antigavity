# BORRADOR — Política de Cookies y Almacenamiento Local

> **ESTADO:** BORRADOR. **PENDIENTE DE VALIDACIÓN POR ABOGADO**.  
> **Versión:** `2026-11-16-v1`

---

## 1. Uso de Almacenamiento Local (Sin Rastreadores Publicitarios)
**Soluciones Colina** no utiliza cookies de publicidad ni rastreadores de terceros con fines comerciales. Para funcionar sin conexión (*offline-first*) y proteger la sesión en navegador y Android, la aplicación emplea almacenamiento técnico estrictamente necesario:
- **IndexedDB (`Dexie`):** borradores de facturas, clientes, productos, cartera e inventario para operación sin internet.
- **Capacitor Preferences / Almacenamiento seguro del dispositivo:** preferencias de tema visual, registro de consentimiento Ley 1581 y hash Argon2id + sal del PIN local (nunca contraseñas en texto plano).
- **Firebase Auth / App Check:** tokens de sesión y verificación anti-abuso (`reCAPTCHA Enterprise` en web).

## 2. Control del Usuario
El usuario puede cerrar sesión, exportar su información en JSON/CSV o limpiar el almacenamiento local desde los ajustes del navegador/dispositivo o desde `Seguridad > Mis Datos y Privacidad`.
