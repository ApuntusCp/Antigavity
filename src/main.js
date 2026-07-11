/**
 * Gran Colinos — Main Entry Point
 * Wires up router, components, and pages.
 */
import './styles/index.css';
import './styles/chat.css';
import { router } from './utils/router.js';
import { store } from './utils/store.js';
import * as Header from './components/header.js';
import * as Footer from './components/footer.js';
import * as CartDrawer from './components/cart-drawer.js';
import * as AgeGate from './components/age-gate.js';
import * as ChatWidget from './components/chat-widget.js';
import * as HomePage from './pages/home.js';
import * as CatalogPage from './pages/catalog.js';
import * as ProductPage from './pages/product.js';
import * as CheckoutPage from './pages/checkout.js';
import { copy, featureFlags, site, setProducts } from './config/brand.config.js';
import { fetchProducts } from './utils/firebase.js';
import { icons } from './components/icons.js';

// Setup routing removed, handled at the bottom of the file

function renderUnderConstruction() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: var(--bg); text-align: center; padding: 2rem;">
      <h1 style="font-family: var(--font-heading); color: var(--primary); font-size: 3rem; margin-bottom: 1rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">Estamos cultivando algo increíble ${icons.Sprout('', 40)}</h1>
      <p style="font-size: 1.25rem; color: var(--text-secondary); max-width: 600px; line-height: 1.6; margin-bottom: 2rem;">
        La tienda oficial de ${site.name} estará disponible muy pronto. Estamos terminando de preparar los mejores productos naturales para ti.
      </p>
      <a href="https://wa.me/573027697935" target="_blank" style="background-color: var(--success); color: white; padding: 1rem 2rem; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 1.1rem; display: inline-flex; align-items: center; gap: 0.5rem; transition: transform 0.2s ease;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.031 0C5.394 0 0 5.394 0 12.031C0 14.156 0.562 16.162 1.531 17.887L0.422 21.844L4.547 20.765C6.225 21.64 8.081 22.125 10.031 22.125C16.668 22.125 22.062 16.731 22.062 10.094C22.062 3.457 16.668 0 10.031 0H12.031ZM12.031 1.969C17.656 1.969 22.125 6.438 22.125 12.062C22.125 17.686 17.656 22.155 12.031 22.155C10.297 22.155 8.656 21.733 7.218 20.983L6.89 20.783L3.655 21.63L4.502 18.49L4.256 18.113C3.411 16.66 2.95 14.937 2.95 13.109C2.95 7.485 7.419 3.016 13.043 3.016H12.031V1.969ZM8.25 7.312C8 7.312 7.656 7.406 7.344 7.719C7.032 8.032 6.125 8.875 6.125 10.594C6.125 12.313 7.375 13.969 7.562 14.219C7.75 14.469 10.031 18.062 13.625 19.5C14.469 19.844 15.156 20.031 15.688 20.219C16.532 20.5 17.312 20.469 17.906 20.375C18.594 20.25 20.062 19.469 20.406 18.625C20.75 17.781 20.75 17.062 20.656 16.906C20.562 16.75 20.312 16.656 19.938 16.469C19.564 16.282 17.719 15.375 17.375 15.25C17.031 15.125 16.781 15.062 16.531 15.438C16.281 15.814 15.562 16.656 15.344 16.906C15.126 17.156 14.906 17.188 14.532 17C14.158 16.812 12.938 16.438 11.5 15.156C10.375 14.156 9.625 12.906 9.406 12.531C9.187 12.156 9.375 11.969 9.562 11.781C9.718 11.625 9.938 11.375 10.125 11.156C10.312 10.937 10.375 10.781 10.5 10.531C10.625 10.281 10.562 10.062 10.469 9.875C10.375 9.688 9.625 7.844 9.312 7.094C9.032 6.375 8.719 6.469 8.5 6.469C8.312 6.469 8.062 6.469 7.812 6.469H8.25V7.312Z" fill="white"/></svg>
        Escríbenos por WhatsApp
      </a>
    </div>
  `;
}

// App Shell
function renderApp() {
  if (featureFlags.underConstruction) {
    return renderUnderConstruction();
  }

  const app = document.getElementById('app');
  app.innerHTML = `
    ${AgeGate.render()}
    ${Header.render()}
    <main id="main-content" class="main-content"></main>
    ${Footer.render()}
    ${CartDrawer.render()}
    ${ChatWidget.render()}
    
    <!-- Botón flotante manual de WhatsApp (Fase 3: Atención Humana) -->
    <a href="https://wa.me/573027697935?text=Hola%20Gran%20Colinos,%20necesito%20asistencia%20con%20la%20tienda." 
       target="_blank" 
       id="whatsapp-float-btn"
       style="position: fixed; bottom: 20px; left: 20px; background-color: #25D366; color: white; border-radius: 50%; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.2); z-index: 999; cursor: pointer; transition: transform 0.2s;">
      <svg width="35" height="35" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.013 2.01c-5.506 0-9.98 4.474-9.98 9.98 0 1.956.513 3.824 1.487 5.488L2 22l4.646-1.503a9.922 9.922 0 0 0 5.367 1.547c5.505 0 9.98-4.474 9.98-9.98s-4.475-9.98-9.98-9.98zm0 18.255a8.214 8.214 0 0 1-4.225-1.168l-.304-.18-3.14.994.843-3.033-.198-.315A8.193 8.193 0 0 1 3.733 11.99c0-4.57 3.717-8.287 8.28-8.287 4.564 0 8.28 3.717 8.28 8.287 0 4.563-3.716 8.28-8.28 8.28zm4.542-6.2c-.248-.125-1.472-.727-1.7-.81-.228-.083-.394-.125-.56.125-.165.25-.643.81-.788.977-.145.166-.29.187-.538.062-.248-.125-1.05-.387-2-1.233-.738-.66-1.236-1.472-1.38-1.72-.145-.25-.015-.385.11-.51.11-.11.248-.29.373-.435.124-.145.166-.25.248-.415.083-.166.042-.31-.02-.435-.063-.125-.56-1.35-.768-1.848-.2-.487-.404-.422-.56-.43-.153-.007-.33-.008-.507-.008-.176 0-.466.066-.714.315-.248.25-.953.932-.953 2.27 0 1.338.977 2.632 1.112 2.8.134.165 1.91 2.915 4.626 4.086 2.715 1.17 2.715.78 3.21.738.497-.04 1.473-.6 1.68-1.18.207-.58.207-1.08.145-1.18-.06-.1-.227-.16-.475-.29z"/>
      </svg>
    </a>
    <div class="toast" id="toast"></div>
  `;

  // Mount components
  AgeGate.mount();
  Header.mount();
  CartDrawer.mount();
  ChatWidget.mount();
  Footer.mount();
  setupToast();
}

// ─── Toast ──────────────────────────────────────────────────
function updateActiveLinks() {
  const path = window.location.pathname;
  document.querySelectorAll('nav a').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === path) {
      link.classList.add('active');
    }
  });
}

function setupToast() {
  const toast = document.getElementById('toast');
  store.subscribe(state => {
    if (state.toast) {
      toast.textContent = state.toast.message;
      toast.className = `toast toast--visible ${state.toast.type === 'error' ? 'toast--error' : ''}`;
    } else {
      toast.classList.remove('toast--visible');
    }
  });
}

// ─── Page Renderer ──────────────────────────────────────────
function handleRoute() {
  const path = window.location.pathname;
  const app = document.getElementById('main-content');
  if (!app) return;
  window.scrollTo(0, 0);

  if (featureFlags.underConstruction) {
    return renderUnderConstruction();
  }

  if (path === '/') {
    app.innerHTML = HomePage.render();
    HomePage.mount();
  } else if (path === '/catalogo') {
    app.innerHTML = CatalogPage.render();
    CatalogPage.mount();
  } else if (path.startsWith('/producto/')) {
    const productId = path.split('/')[2];
    app.innerHTML = ProductPage.render(productId);
    ProductPage.mount(productId);
  } else if (path === '/checkout') {
    app.innerHTML = CheckoutPage.render();
    CheckoutPage.mount();
  } else if (path === '/politica-devoluciones' || path === '/terminos' || path === '/privacidad' || path === '/nosotros') {
    app.innerHTML = renderAbout();
  } else {
    app.innerHTML = `
      <div class="container text-center" style="padding: 120px 0; min-height: 50vh;">
        <h1 style="font-size: 3rem; margin-bottom: 1rem;">404</h1>
        <p>Página no encontrada</p>
        <a href="/" class="btn btn--primary" style="margin-top: 2rem;">Volver al inicio</a>
      </div>
    `;
  }
}

// Intercept clicks to prevent full page reload
document.addEventListener('click', e => {
  const link = e.target.closest('a');
  if (link && link.getAttribute('href') && link.getAttribute('href').startsWith('/')) {
    // Check if it is an external link
    if (link.getAttribute('target') === '_blank') return;
    e.preventDefault();
    history.pushState(null, '', link.getAttribute('href'));
    handleRoute();
    updateActiveLinks();
  }
});

// Setup routing
window.addEventListener('popstate', () => {
  handleRoute();
  updateActiveLinks();
});

// ─── Static Pages ───────────────────────────────────────────
function renderReturnPolicy() {
  const lines = copy.returns.details.split('\n');
  const html = lines.map(line => {
    if (line.startsWith('**') && line.endsWith('**')) {
      return `<h3 style="margin-top: var(--space-xl); margin-bottom: var(--space-md); color: var(--c-text);">${line.replace(/\*\*/g, '')}</h3>`;
    }
    if (line.startsWith('- ')) {
      return `<li style="margin-bottom: var(--space-sm); padding-left: var(--space-md);">• ${line.slice(2)}</li>`;
    }
    if (/^\d+\./.test(line)) {
      return `<li style="margin-bottom: var(--space-sm); padding-left: var(--space-md);">${line}</li>`;
    }
    if (line.trim() === '') return '';
    return `<p>${line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>`;
  }).join('');

  return `
    <section class="policy-page section">
      <div class="container">
        <div class="policy-page__content">
          <h1>${copy.returns.title}</h1>
          <p style="font-size: 1.125rem; color: var(--c-primary); font-weight: 500; margin-bottom: var(--space-2xl);">${copy.returns.summary}</p>
          ${html}
        </div>
      </div>
    </section>
  `;
}

function renderAbout() {
  return `
    <section class="section" style="padding-top: calc(var(--header-h) + var(--space-2xl));">
      <div class="container" style="max-width: 720px;">
        <h1 style="margin-bottom: var(--space-xl);">Sobre Gran Colinos</h1>
        <p style="font-size: 1.125rem; line-height: 1.8; color: var(--c-text-secondary);">
          Gran Colinos nació de una convicción: que los mejores productos para tu bienestar vienen de la naturaleza, 
          no de un laboratorio. Somos una marca colombiana que cree en el poder de los ingredientes naturales — 
          desde el CBD de espectro completo hasta la apitoxina de nuestras abejas, pasando por los chiles más 
          auténticos de nuestra tierra.
        </p>
        <p style="font-size: 1.125rem; line-height: 1.8; color: var(--c-text-secondary);">
          Cada producto que vendemos pasa por rigurosos controles de calidad y cuenta con los permisos de ley 
          (incluyendo INVIMA). No hacemos promesas vacías: te contamos exactamente qué tiene cada producto, 
          cómo usarlo, y qué esperar.
        </p>
        <p style="font-size: 1.125rem; line-height: 1.8; color: var(--c-text-secondary);">
          <strong>Nuestra promesa:</strong> Si no estás satisfecho, tienes 30 días para devolver tu producto. 
          Sin complicaciones. Sin letra pequeña. Porque creemos que la confianza se gana, no se exige.
        </p>
        <div style="margin-top: var(--space-2xl); text-align: center;">
          <a href="/catalogo" class="btn btn--primary btn--lg">Conoce nuestros productos</a>
        </div>
      </div>
    </section>
  `;
}

// ─── Service Worker Registration ────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW registered:', reg.scope))
      .catch(err => console.warn('SW registration failed:', err));
  });
}

// ─── Initialize ─────────────────────────────────────────────
async function init() {
  // Always render the app structure immediately
  renderApp();
  
  // Fetch products asynchronously in the background
  try {
    const fetchedProducts = await fetchProducts();
    if (fetchedProducts && fetchedProducts.length > 0) {
      setProducts(fetchedProducts);
      // Re-render the current view so new products show up
      handleRoute();
    }
  } catch (err) {
    console.error("Error init fetch products:", err);
  }
}

init();
