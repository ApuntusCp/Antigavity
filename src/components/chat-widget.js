/**
 * Gran Colinos — Chat Widget Component
 * UI for the Customer AI Assistant.
 */
import { copy, featureFlags, site } from '../config/brand.config.js';
import { store } from '../utils/store.js';

export function render() {
  if (!featureFlags.chatEnabled) return '';

  return `
    <div class="chat-widget" id="chat-widget">
      <!-- Chat Window -->
      <div class="chat-window" id="chat-window">
        <div class="chat-header">
          <div class="chat-header__info">
            <span class="chat-header__avatar">👩‍💼</span>
            <div>
              <h4 class="chat-header__title">Asistente ${site.name}</h4>
              <span class="chat-header__status">En línea</span>
            </div>
          </div>
          <button class="chat-header__close" id="chat-close" aria-label="Cerrar chat">✕</button>
        </div>
        
        <div class="chat-messages" id="chat-messages">
          <div class="message message--bot">
            <div class="message__bubble">
              ¡Hola! Soy tu asistente virtual de ${site.name}. 🌿<br><br>
              ¿En qué te puedo ayudar hoy? Puedo recomendarte productos o ayudarte con tu pedido.
            </div>
            <span class="message__time">Ahora</span>
          </div>
        </div>
        
        <form class="chat-input-area" id="chat-form">
          <input type="text" id="chat-input" class="chat-input" placeholder="Escribe tu mensaje..." autocomplete="off" required />
          <button type="submit" class="chat-submit" aria-label="Enviar mensaje">➤</button>
        </form>
      </div>
      
      <!-- Floating Button -->
      <button class="chat-toggle" id="chat-toggle" aria-label="Abrir chat">
        <span class="chat-toggle__icon">💬</span>
        <span class="chat-toggle__badge" id="chat-badge">1</span>
      </button>
    </div>
  `;
}

function addMessage(text, isUser = false) {
  const container = document.getElementById('chat-messages');
  if (!container) return;

  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${isUser ? 'message--user' : 'message--bot'} animate-fade-in is-visible`;
  
  msgDiv.innerHTML = `
    <div class="message__bubble">${text}</div>
    <span class="message__time">Ahora</span>
  `;
  
  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
}

function showTypingIndicator() {
  const container = document.getElementById('chat-messages');
  const typingDiv = document.createElement('div');
  typingDiv.className = 'message message--bot message--typing animate-fade-in is-visible';
  typingDiv.id = 'chat-typing-indicator';
  typingDiv.innerHTML = `
    <div class="message__bubble">
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
    </div>
  `;
  container.appendChild(typingDiv);
  container.scrollTop = container.scrollHeight;
}

function hideTypingIndicator() {
  const typing = document.getElementById('chat-typing-indicator');
  if (typing) typing.remove();
}

export function mount() {
  if (!featureFlags.chatEnabled) return;

  const widget = document.getElementById('chat-widget');
  const toggleBtn = document.getElementById('chat-toggle');
  const closeBtn = document.getElementById('chat-close');
  const chatWindow = document.getElementById('chat-window');
  const badge = document.getElementById('chat-badge');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');

  let isOpen = false;

  function toggleChat() {
    isOpen = !isOpen;
    widget.classList.toggle('chat-widget--open', isOpen);
    if (isOpen) {
      badge.style.display = 'none';
      input.focus();
    }
  }

  toggleBtn.addEventListener('click', toggleChat);
  closeBtn.addEventListener('click', toggleChat);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    // 1. Mostrar mensaje del usuario
    addMessage(text, true);
    input.value = '';

    // 2. Mostrar "Escribiendo..."
    showTypingIndicator();

    // 3. Llamar a la IA (Gemini Vercel Backend)
    try {
      const response = await fetch(api.chatEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: text,
          // Idealmente aquí se envía el array de mensajes previos para contexto de la conversación
          history: [] 
        })
      });

      hideTypingIndicator();
      
      if (!response.ok) throw new Error('Error de red');
      const data = await response.json();
      
      addMessage(data.response, false);
    } catch (error) {
      console.error(error);
      hideTypingIndicator();
      addMessage("Hubo un error de conexión con mi cerebro. Por favor intenta de nuevo.", false);
    }
  });
}
