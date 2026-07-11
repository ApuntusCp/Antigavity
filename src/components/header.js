/**
 * Gran Colinos — Header Component
 */
import { site } from '../config/brand.config.js';
import { store } from '../utils/store.js';
import { router } from '../utils/router.js';
import { icons } from './icons.js';

export function render() {
  return `
    <header class="header" id="site-header">
      <div class="header__inner">
        <a href="#/" class="header__logo" id="header-logo" aria-label="${site.name} - Inicio">
          <img src="/logo-principal.png" alt="${site.name}" style="height: 40px; width: auto;" />
        </a>

        <nav class="header__nav" id="header-nav" aria-label="Navegación principal">
          <a href="#/">Inicio</a>
          <a href="#/catalogo">Productos</a>
          <a href="#/nosotros">Nosotros</a>
          <a href="#/politica-devoluciones">Devoluciones</a>
        </nav>

        <div class="header__actions">
          <button class="header__cart-btn" id="header-cart-btn" aria-label="Ver carrito">
            ${icons.Cart('header-cart-icon')}
            <span class="header__cart-count" id="header-cart-count">0</span>
          </button>
          <button class="header__menu-toggle" id="header-menu-toggle" aria-label="Abrir menú">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>

    <!-- Mobile Navigation -->
    <div class="mobile-nav" id="mobile-nav">
      <div class="mobile-nav__overlay" id="mobile-nav-overlay"></div>
      <div class="mobile-nav__panel">
        <button class="mobile-nav__close" id="mobile-nav-close" aria-label="Cerrar menú">${icons.Close()}</button>
        <div class="mobile-nav__links">
          <a href="#/" class="mobile-nav__link"><span class="icon-wrapper">${icons.Home()}</span> Inicio</a>
          <a href="#/catalogo" class="mobile-nav__link"><span class="icon-wrapper">${icons.Sparkles()}</span> Productos</a>
          <a href="#/nosotros" class="mobile-nav__link"><span class="icon-wrapper">${icons.Heart()}</span> Nosotros</a>
          <a href="#/politica-devoluciones" class="mobile-nav__link"><span class="icon-wrapper">${icons.Clipboard()}</span> Devoluciones</a>
        </div>
      </div>
    </div>
  `;
}

export function mount() {
  const header = document.getElementById('site-header');
  const cartBtn = document.getElementById('header-cart-btn');
  const menuToggle = document.getElementById('header-menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
  const mobileNavClose = document.getElementById('mobile-nav-close');
  const cartCount = document.getElementById('header-cart-count');

  // Scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
    lastScroll = scrollY;
  }, { passive: true });

  // Cart button
  cartBtn.addEventListener('click', () => store.toggleCart(true));

  // Mobile nav
  menuToggle.addEventListener('click', () => store.toggleMobileNav(true));
  mobileNavOverlay.addEventListener('click', () => store.toggleMobileNav(false));
  mobileNavClose.addEventListener('click', () => store.toggleMobileNav(false));

  // Close mobile nav on link click
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => store.toggleMobileNav(false));
  });

  // Update cart count
  store.subscribe(state => {
    const count = store.getCartCount();
    cartCount.textContent = count;
    cartCount.classList.toggle('header__cart-count--visible', count > 0);
    mobileNav.classList.toggle('mobile-nav--open', state.mobileNavOpen);
  });

  // Initial count
  const count = store.getCartCount();
  cartCount.textContent = count;
  cartCount.classList.toggle('header__cart-count--visible', count > 0);
}
