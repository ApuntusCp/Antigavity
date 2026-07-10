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
import { copy } from './config/brand.config.js';

// ─── App Shell ──────────────────────────────────────────────
const app = document.getElementById('app');

function renderShell() {
  app.innerHTML = `
    ${Header.render()}
    ${CartDrawer.render()}
    ${AgeGate.render()}
    ${ChatWidget.render()}
    <main id="main-content" role="main"></main>
    ${Footer.render()}
    <div class="toast" id="toast"></div>
  `;
  Header.mount();
  CartDrawer.mount();
  AgeGate.mount();
  ChatWidget.mount();
  Footer.mount();
  setupToast();
}

// ─── Toast ──────────────────────────────────────────────────
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
function renderPage(html) {
  const main = document.getElementById('main-content');
  main.innerHTML = html;
}

// ─── Routes ─────────────────────────────────────────────────
router
  .add('/', () => {
    renderPage(HomePage.render());
    HomePage.mount();
  })
  .add('/catalogo', () => {
    renderPage(CatalogPage.render());
    CatalogPage.mount();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  })
  .add('/producto/:id', ({ params }) => {
    renderPage(ProductPage.render(params.id));
    ProductPage.mount(params.id);
  })
  .add('/checkout', () => {
    import('./pages/checkout.js').then(CheckoutPage => {
      renderPage(CheckoutPage.render());
      CheckoutPage.mount();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  })
  .add('/politica-devoluciones', () => {
    renderPage(renderReturnPolicy());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  })
  .add('/nosotros', () => {
    renderPage(renderAbout());
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          <a href="#/catalogo" class="btn btn--primary btn--lg">Conoce nuestros productos 🌿</a>
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
renderShell();
