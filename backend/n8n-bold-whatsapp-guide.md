# 🔗 Guía de Integración Backend (n8n + Bold + WhatsApp)

Como Gran Colinos es un Frontend SPA Ultrarrápido, toda la lógica de negocio pesada, pagos y conexión con la inteligencia artificial se realiza a través de **n8n**.

## 1. El Webhook de Pedidos (Punto de entrada)

El frontend de la tienda (la página `/checkout`) enviará automáticamente un `POST` al Webhook de tu n8n cuando el cliente haga clic en "Ir a Pagar con Bold".

**Payload que n8n recibirá (Ejemplo):**
```json
{
  "source": "store_checkout",
  "timestamp": "2026-07-10T08:50:00.000Z",
  "customer": {
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan@correo.com",
    "phone": "3001234567",
    "address": "Calle 123 #45-67",
    "city": "Medellín",
    "department": "Antioquia"
  },
  "items": [
    {
      "id": "cbd-gotas-nano",
      "name": "Gotas Nano CBD (Espectro Completo)",
      "price": 157700,
      "qty": 2,
      "total": 315400
    }
  ],
  "totals": {
    "subtotal": 315400,
    "shipping": 0,
    "grandTotal": 315400
  }
}
```

## 2. Flujo de Trabajo en n8n a configurar

Para cumplir todos tus requerimientos, en n8n debes construir un flujo con los siguientes Nodos:

### Paso A: Recibir el Webhook
- Configura un nodo **Webhook** para método POST y que responda *usando otro nodo (Respond to Webhook)*.

### Paso B: Llamada a la API de BOLD
- Nodo **HTTP Request** haciendo POST a la API de Bold para generar un "Payment Link" (Link de pago).
- Bold te devolverá una URL segura de pago.

### Paso C: Enviar mensaje al Agente Ejecutivo (WhatsApp)
- Nodo **WhatsApp / HTTP Request (Meta API o Twilio)**.
- Mensaje configurado para ti (el dueño/admin):
  > *"🚨 Nuevo pedido en la tienda!\nCliente: {customer.firstName} {customer.lastName}\nTotal: {totals.grandTotal}\nEsperando pago de Bold..."*

### Paso D: Responder al Frontend
- Nodo **Respond to Webhook**.
- Cuerpo de la respuesta:
  ```json
  {
    "success": true,
    "paymentUrl": "{{ URL_DE_PAGO_DE_BOLD_DEL_PASO_B }}"
  }
  ```
El frontend leerá ese `paymentUrl` y enviará al cliente directamente a pagar en Bold.

## 3. Asistentes Virtuales y Agente Ejecutivo

Para la **Fase 3 (Asistente Cliente)** y **Fase 4 (Agente Administrativo WhatsApp)**, utilizaremos la característica de "AI Agent" de n8n o la API de Antigravity (Gemini/OpenAI) conectada al catálogo de productos y a Alegra/Siigo.

- **Agente Ejecutivo WhatsApp:** Conectaremos un número corporativo de WhatsApp. Cuando escribas, el Webhook receptor desencadenará un Nodo de Agente (LangChain / OpenAI Node en n8n) con *Tools* conectadas a Alegra para consultar facturación, caja y stock en tiempo real.
