/**
 * Gran Colinos — Product Detail Page
 */
import { getProductById, formatPrice, getDiscountPercent, categories, copy, shipping } from '../config/brand.config.js';
import { store } from '../utils/store.js';
import { icons } from '../components/icons.js';
import * as AgeGate from '../components/age-gate.js';

export function render(productId) {
  const product = getProductById(productId);
  if (!product) return renderNotFound();

  const discount = getDiscountPercent(product);
  const category = categories.find(c => c.id === product.category);
  const displayPrice = product.salePrice || product.price;

  return `
    <section class="product-detail section">
      <div class="container">
        <div class="product-detail__breadcrumb">
          <a href="/">Inicio</a> <span>/</span>
          <a href="/catalogo">${category?.name || 'Productos'}</a> <span>/</span>
          <span>${product.name}</span>
        </div>

        <div class="product-detail__grid">
          <!-- Gallery -->
          <div class="product-detail__gallery">
            <div class="product-detail__main-image" id="pd-main-image">
              <img src="${product.images.main}" alt="${product.name}" id="pd-main-img" />
            </div>
            <div class="product-detail__thumbs" id="pd-thumbs">
              ${product.images.gallery.map((img, i) => `
                <button class="product-detail__thumb ${i === 0 ? 'product-detail__thumb--active' : ''}"
                        data-thumb-src="${img}" data-thumb-idx="${i}">
                  <img src="${img}" alt="${product.name} vista ${i + 1}" loading="lazy" />
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Info -->
          <div class="product-detail__info">
            ${product.badge ? `
              <span class="product-card__badge product-card__badge--${product.badgeType}" style="position:static; display:inline-block; margin-bottom: var(--space-md);">
                ${product.badge}
              </span>
            ` : ''}
            <h1 class="product-detail__title">${product.name}</h1>
            <p class="product-detail__subtitle">${product.subtitle}</p>

            <div class="product-detail__prices">
              <span class="product-detail__price--sale">${formatPrice(displayPrice)}</span>
              ${product.salePrice && product.salePrice < product.price ? `
                <span class="product-detail__price--original">${formatPrice(product.price)}</span>
                <span class="product-card__discount">-${discount}% OFF</span>
              ` : ''}
            </div>

            <!-- Benefits -->
            <div class="product-detail__benefits">
              ${product.benefits.map(b => `
                <div class="product-detail__benefit">
                  <span>${b.icon}</span>
                  <span>${b.text}</span>
                </div>
              `).join('')}
            </div>

            <!-- Actions -->
            <div class="product-detail__actions">
              <div class="product-detail__qty" id="pd-qty">
                <button data-qty-action="minus" aria-label="Menos">−</button>
                <span id="pd-qty-value">1</span>
                <button data-qty-action="plus" aria-label="Más">+</button>
              </div>
              <button class="btn btn--primary btn--lg btn--full" id="pd-add-to-cart">
                ${copy.product.addToCart} — ${formatPrice(displayPrice)}
              </button>
            </div>

            <!-- Shipping/Return info -->
            <div class="product-benefits">
              <div class="benefit-item">
                <span style="display:inline-flex; align-items:center;">${icons.Truck('', 24)}</span>
                <div>
                  <strong>${shipping.disclaimer}</strong>
                  <p>${shipping.estimatedDays.min}–${shipping.estimatedDays.max} días hábiles</p>
                </div>
              </div>
              <div class="benefit-item">
                <span style="display:inline-flex; align-items:center;">${icons.Clipboard('', 24)}</span>
                <div>
                  <strong>${copy.returns.title}</strong>
                  <p>${copy.returns.summary}</p>
                </div>
              </div>
            </div>

            <!-- Tabs -->
            <div class="product-detail__tabs">
              <div class="product-detail__tab-nav" id="pd-tab-nav">
                <button class="product-detail__tab-btn product-detail__tab-btn--active" data-tab="description">
                  ${copy.product.description}
                </button>
                <button class="product-detail__tab-btn" data-tab="ingredients">
                  ${copy.product.ingredients}
                </button>
                <button class="product-detail__tab-btn" data-tab="usage">
                  ${copy.product.usage}
                </button>
                <button class="product-detail__tab-btn" data-tab="warnings">
                  ${copy.product.warnings}
                </button>
              </div>
              <div class="product-detail__tab-content">
                <div class="product-detail__tab-panel product-detail__tab-panel--active" data-panel="description">
                  ${product.description.split('\n').map(p => p.trim() ? `<p>${p}</p>` : '').join('')}
                </div>
                <div class="product-detail__tab-panel" data-panel="ingredients">
                  <p>${product.ingredients}</p>
                </div>
                <div class="product-detail__tab-panel" data-panel="usage">
                  <p>${product.usage}</p>
                </div>
                <div class="product-detail__tab-panel" data-panel="warnings">
                  <p>${product.warnings}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderNotFound() {
  return `
    <section class="section" style="padding-top: calc(var(--header-h) + var(--space-3xl)); text-align: center;">
      <div class="container text-center" style="padding-block: var(--space-3xl);">
        <h1 style="font-size: 3rem; margin-bottom: var(--space-md);">${icons.Close('', 48)}</h1>
        <h2>Producto no encontrado</h2>
        <p class="text-muted mb-xl">Lo sentimos, no pudimos encontrar este producto.</p>
        <a href="/catalogo" class="btn btn--primary">Ver catálogo</a>
      </div>
    </section>
  `;
}

export async function mount(productId) {
  const product = getProductById(productId);
  if (!product) return;

  if (product.requiresAgeVerification) {
    const verified = await AgeGate.requireVerification();
    if (!verified) {
      history.pushState(null, '', '/');
      window.dispatchEvent(new Event('popstate'));
      return;
    }
  }

  let qty = 1;
  const qtyValue = document.getElementById('pd-qty-value');
  const addBtn = document.getElementById('pd-add-to-cart');

  // Quantity controls
  document.getElementById('pd-qty').addEventListener('click', (e) => {
    const action = e.target.dataset.qtyAction;
    if (action === 'minus' && qty > 1) qty--;
    if (action === 'plus' && qty < 10) qty++;
    qtyValue.textContent = qty;
    const price = product.salePrice || product.price;
    addBtn.textContent = `${copy.product.addToCart} — ${formatPrice(price * qty)}`;
  });

  // Add to cart
  addBtn.addEventListener('click', () => {
    store.addToCart(product.id, qty);
    store.showToast(`${product.name} agregado al carrito`);
    addBtn.textContent = '¡Agregado! ✓';
    addBtn.style.background = 'var(--c-success)';
    setTimeout(() => {
      const price = product.salePrice || product.price;
      addBtn.textContent = `${copy.product.addToCart} — ${formatPrice(price * qty)}`;
      addBtn.style.background = '';
    }, 1500);
  });

  // Thumbnail gallery
  document.querySelectorAll('[data-thumb-src]').forEach(thumb => {
    thumb.addEventListener('click', () => {
      const mainImg = document.getElementById('pd-main-img');
      mainImg.src = thumb.dataset.thumbSrc;
      document.querySelectorAll('[data-thumb-src]').forEach(t =>
        t.classList.remove('product-detail__thumb--active')
      );
      thumb.classList.add('product-detail__thumb--active');
    });
  });

  // Tabs
  document.querySelectorAll('[data-tab]').forEach(tabBtn => {
    tabBtn.addEventListener('click', () => {
      const tab = tabBtn.dataset.tab;
      document.querySelectorAll('[data-tab]').forEach(b =>
        b.classList.toggle('product-detail__tab-btn--active', b.dataset.tab === tab)
      );
      document.querySelectorAll('[data-panel]').forEach(p =>
        p.classList.toggle('product-detail__tab-panel--active', p.dataset.panel === tab)
      );
    });
  });

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
