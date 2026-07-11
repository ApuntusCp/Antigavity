/**
 * Gran Colinos — Cart Drawer Component
 */
import { products, formatPrice, copy, shipping } from '../config/brand.config.js';
import { store } from '../utils/store.js';
import { icons } from './icons.js';

export function render() {
  return `
    <div class="cart-drawer" id="cart-drawer">
      <div class="cart-drawer__overlay" id="cart-overlay"></div>
      <div class="cart-drawer__panel">
        <div class="cart-drawer__header">
          <h2 class="cart-drawer__title">Tu Carrito</h2>
          <button class="cart-drawer__close" id="cart-close" aria-label="Cerrar carrito">${icons.Close()}</button>
        </div>
        <div class="cart-drawer__items" id="cart-items">
          <!-- Rendered dynamically -->
        </div>
        <div class="cart-drawer__footer" id="cart-footer">
          <!-- Rendered dynamically -->
        </div>
      </div>
    </div>
  `;
}

function renderCartItems() {
  const { cart } = store.state;

  if (cart.length === 0) {
    return `
      <div class="cart-drawer__empty">
        <div class="cart-drawer__empty-icon">${icons.Cart('', 48)}</div>
        <h3>${copy.cart.empty}</h3>
        <p>${copy.cart.emptySubtitle}</p>
        <a href="/catalogo" class="btn btn--primary mt-md" id="cart-shop-link">${copy.cart.continueShopping}</a>
      </div>
    `;
  }

  return cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    if (!product) return '';
    const price = product.salePrice || product.price;

    return `
      <div class="cart-item" data-cart-item="${item.productId}">
        <div class="cart-item__image">
          <img src="${product.images.main}" alt="${product.name}" loading="lazy" />
        </div>
        <div class="cart-item__info">
          <div class="cart-item__name">${product.name}</div>
          <div class="cart-item__price">${formatPrice(price)}</div>
          <div class="cart-item__controls">
            <button class="cart-item__qty-btn" data-cart-minus="${item.productId}" aria-label="Reducir cantidad">${icons.Minus('', 16)}</button>
            <span class="cart-item__qty">${item.qty}</span>
            <button class="cart-item__qty-btn" data-cart-plus="${item.productId}" aria-label="Aumentar cantidad">+</button>
            <button class="cart-item__remove" data-cart-remove="${item.productId}" aria-label="Eliminar">${icons.Trash('', 18)}</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderCartFooter() {
  const { cart } = store.state;
  if (cart.length === 0) return '';

  const total = store.getCartTotal(products);
  const isFreeShipping = total >= shipping.freeShippingThreshold;

  return `
    <div class="cart-drawer__subtotal">
      <span>Subtotal</span>
      <span>${formatPrice(total)}</span>
    </div>
    <div class="cart-drawer__total">
      <span>${copy.cart.total}</span>
      <span>${formatPrice(total)}</span>
    </div>
    <button class="btn btn--primary btn--full btn--lg" id="cart-checkout-btn">
      ${copy.cart.checkout}
    </button>
    <p class="cart-drawer__shipping-note">
      ${isFreeShipping
        ? `<span style="vertical-align: middle; display: inline-flex; align-items: center; gap: 4px;">${icons.Check('', 16)} ¡Envío gratis!</span>`
        : `Envío gratis a partir de ${formatPrice(shipping.freeShippingThreshold)}`}
    </p>
  `;
}

export function mount() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  const closeBtn = document.getElementById('cart-close');
  const itemsContainer = document.getElementById('cart-items');
  const footerContainer = document.getElementById('cart-footer');

  overlay.addEventListener('click', () => store.toggleCart(false));
  closeBtn.addEventListener('click', () => store.toggleCart(false));

  function updateCart() {
    itemsContainer.innerHTML = renderCartItems();
    footerContainer.innerHTML = renderCartFooter();

    // Bind item controls
    itemsContainer.querySelectorAll('[data-cart-minus]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.cartMinus;
        const item = store.state.cart.find(i => i.productId === id);
        if (item) store.updateQuantity(id, item.qty - 1);
      });
    });
    itemsContainer.querySelectorAll('[data-cart-plus]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.cartPlus;
        const item = store.state.cart.find(i => i.productId === id);
        if (item) store.updateQuantity(id, item.qty + 1);
      });
    });
    itemsContainer.querySelectorAll('[data-cart-remove]').forEach(btn => {
      btn.addEventListener('click', () => {
        store.removeFromCart(btn.dataset.cartRemove);
        store.showToast(copy.cart.removed);
      });
    });

    // Shop link closes drawer
    const shopLink = document.getElementById('cart-shop-link');
    if (shopLink) shopLink.addEventListener('click', () => store.toggleCart(false));

    // Checkout navigation
    const checkoutBtn = document.getElementById('cart-checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        store.toggleCart(false);
        history.pushState(null, '', '/checkout');
        window.dispatchEvent(new Event('popstate'));
      });
    }
  }

  store.subscribe(state => {
    drawer.classList.toggle('cart-drawer--open', state.cartOpen);
    updateCart();
  });

  updateCart();
}
