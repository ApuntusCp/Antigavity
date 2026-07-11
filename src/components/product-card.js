/**
 * Gran Colinos — Product Card Component
 */
import { formatPrice, getDiscountPercent, categories } from '../config/brand.config.js';
import { store } from '../utils/store.js';

export function render(product) {
  const discount = getDiscountPercent(product);
  const category = categories.find(c => c.id === product.category);
  const displayPrice = product.salePrice || product.price;

  return `
    <article class="product-card animate-fade-in" data-product-id="${product.id}">
      <div class="product-card__image-wrap">
        <img class="product-card__image"
             src="${product.images.main}"
             alt="${product.name}"
             loading="lazy"
             width="400" height="400" />
        ${product.badge ? `
          <span class="product-card__badge product-card__badge--${product.badgeType}">
            ${product.badge}
          </span>
        ` : ''}
        <button class="product-card__quick-add"
                data-add-to-cart="${product.id}"
                aria-label="Agregar ${product.name} al carrito"
                title="Agregar al carrito">
          +
        </button>
      </div>
      <div class="product-card__body">
        <div class="product-card__category">${category?.icon || ''} ${category?.name || ''}</div>
        <h3 class="product-card__name">
          <a href="#/producto/${product.id}">${product.name}</a>
        </h3>
        <p class="product-card__subtitle">${product.subtitle}</p>
        <div class="product-card__prices">
          <span class="product-card__price--sale">${formatPrice(displayPrice)}</span>
          ${product.salePrice && product.salePrice < product.price ? `
            <span class="product-card__price--original">${formatPrice(product.price)}</span>
            <span class="product-card__discount">-${discount}%</span>
          ` : ''}
        </div>
      </div>
    </article>
  `;
}

export function renderGrid(products) {
  return `
    <div class="products-grid" id="products-grid">
      ${products.map(p => render(p)).join('')}
    </div>
  `;
}

export function mount(container) {
  if (!container) container = document;

  container.querySelectorAll('[data-add-to-cart]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const productId = btn.dataset.addToCart;
      store.addToCart(productId);
      store.showToast('¡Agregado al carrito!');

      // Quick animation
      btn.style.transform = 'scale(1.3)';
      setTimeout(() => { btn.style.transform = ''; }, 200);
    });
  });
}
