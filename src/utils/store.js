/**
 * Gran Colinos — Reactive Store
 * Simple pub/sub state management for cart, age verification, UI state.
 */

const STORAGE_KEY = 'grancolinos_store';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      cart: state.cart,
      ageVerified: state.ageVerified,
    }));
  } catch {}
}

const saved = loadState();

const state = {
  cart: saved?.cart || [],
  ageVerified: saved?.ageVerified || false,
  cartOpen: false,
  mobileNavOpen: false,
  toast: null,
};

const listeners = new Set();

function notify() {
  saveState(state);
  listeners.forEach(fn => fn({ ...state }));
}

export const store = {
  get state() { return state; },

  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },

  // ─── Cart ──────────────────────────────
  addToCart(productId, qty = 1) {
    const existing = state.cart.find(i => i.productId === productId);
    if (existing) {
      existing.qty += qty;
    } else {
      state.cart.push({ productId, qty });
    }
    notify();
  },

  removeFromCart(productId) {
    state.cart = state.cart.filter(i => i.productId !== productId);
    notify();
  },

  updateQuantity(productId, qty) {
    const item = state.cart.find(i => i.productId === productId);
    if (!item) return;
    if (qty <= 0) {
      this.removeFromCart(productId);
      return;
    }
    item.qty = qty;
    notify();
  },

  clearCart() {
    state.cart = [];
    notify();
  },

  getCartCount() {
    return state.cart.reduce((sum, i) => sum + i.qty, 0);
  },

  getCartTotal(products) {
    return state.cart.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId);
      if (!product) return sum;
      const price = product.salePrice || product.price;
      return sum + price * item.qty;
    }, 0);
  },

  // ─── Age verification ──────────────────
  verifyAge() {
    state.ageVerified = true;
    notify();
  },

  denyAge() {
    state.ageVerified = false;
    notify();
  },

  // ─── UI State ──────────────────────────
  toggleCart(open) {
    state.cartOpen = typeof open === 'boolean' ? open : !state.cartOpen;
    document.body.style.overflow = state.cartOpen ? 'hidden' : '';
    notify();
  },

  toggleMobileNav(open) {
    state.mobileNavOpen = typeof open === 'boolean' ? open : !state.mobileNavOpen;
    document.body.style.overflow = state.mobileNavOpen ? 'hidden' : '';
    notify();
  },

  showToast(message, type = 'success', duration = 3000) {
    state.toast = { message, type };
    notify();
    setTimeout(() => {
      state.toast = null;
      notify();
    }, duration);
  },
};
