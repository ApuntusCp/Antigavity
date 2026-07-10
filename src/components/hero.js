/**
 * Gran Colinos — Hero Component
 */
import { copy } from '../config/brand.config.js';

export function render() {
  return `
    <section class="hero" id="hero-section">
      <div class="hero__bg">
        <img src="/hero-banner.jpg"
             alt="Productos naturales Gran Colinos"
             loading="eager"
             fetchpriority="high" />
        <div class="hero__overlay"></div>
      </div>
      <div class="container">
        <div class="hero__content">
          <div class="hero__badge animate-fade-in">
            <span>🇨🇴</span>
            <span>Productos 100% colombianos</span>
          </div>
          <h1 class="hero__title animate-fade-in stagger-1">
            Lo natural<br>
            <span>tiene poder</span>
          </h1>
          <p class="hero__subtitle animate-fade-in stagger-2">
            ${copy.hero.subtitle}
          </p>
          <div class="hero__actions animate-fade-in stagger-3">
            <a href="#/catalogo" class="btn btn--primary btn--lg" id="hero-cta">
              ${copy.hero.cta}
            </a>
          </div>
        </div>
      </div>
      <div class="hero__scroll-indicator" aria-hidden="true">
        <span>Desliza</span>
        <span>↓</span>
      </div>
    </section>
  `;
}

export function mount() {
  // Animate elements on load
  requestAnimationFrame(() => {
    setTimeout(() => {
      document.querySelectorAll('.hero .animate-fade-in').forEach(el => {
        el.classList.add('is-visible');
      });
    }, 200);
  });
}
