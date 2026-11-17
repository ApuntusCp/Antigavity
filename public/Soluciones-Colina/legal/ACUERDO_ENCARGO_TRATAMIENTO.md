# BORRADOR — Acuerdo de Encargo de Tratamiento de Datos Personales (DPA)

> **ESTADO:** BORRADOR. **PENDIENTE DE VALIDACIÓN POR ABOGADO**.  
> **Versión:** `2026-11-16-v1` · **Partes:** Comerciante Suscriptor (**RESPONSABLE**) y APONTE SAS / Colina Studio (**ENCARGADO**).

---

## 1. Objeto
El RESPONSABLE encarga al ENCARGADO el alojamiento, procesamiento, respaldo y transmisión técnica de los datos personales de sus adquirentes, proveedores y colaboradores estrictamente necesarios para operar el software **Soluciones Colina** y emitir documentos electrónicos ante la DIAN.

## 2. Obligaciones del Encargado (Art. 18 Ley 1581 de 2012)
1. Tratar los datos únicamente conforme a las instrucciones del RESPONSABLE y las finalidades de facturación electrónica y gestión comercial.
2. Garantizar el secreto, confidencialidad y medidas técnicas de seguridad (cifrado en tránsito TLS, aislamiento multi-tenant en Firestore, secretos en Secret Manager y control de acceso por roles).
3. No utilizar los datos de clientes del RESPONSABLE para fines propios, publicitarios ni de terceros.
4. Notificar al RESPONSABLE ante cualquier incidente de seguridad que comprometa datos personales.
5. Permitir al RESPONSABLE la exportación y devolución de su información al término del servicio, observando los deberes legales de conservación tributaria (Art. 632 ET).

## 3. Subencargados Tecnológicos Autorizados
Para la prestación del servicio SaaS, el ENCARGADO utiliza infraestructura de **Google Cloud / Firebase (`us-central1`)**, entrega estática web y, cuando el RESPONSABLE los active, conectores de proveedor tecnológico DIAN (Factus / Siigo / Alegra) o pasarelas de pago (Wompi / Mercado Pago). **(PENDIENTE DE VALIDACIÓN POR ABOGADO las cláusulas de transmisión internacional conforme Art. 26 Ley 1581 de 2012).**
