/**
 * Gran Colinos — Home Page
 */
import { products, copy, shipping, formatPrice } from '../config/brand.config.js';
import * as Hero from '../components/hero.js';
import * as ProductCard from '../components/product-card.js';

export function render() {
  return `
    ${Hero.render()}

    <!-- Features Strip -->
    <section class="section" style="padding-top: 0; margin-top: -40px; position: relative; z-index: 2;">
      <div class="container">
        <div class="features-strip">
          <div class="feature-item animate-fade-in">
            <div class="feature-item__icon">🌿</div>
            <div class="feature-item__text">
              <h4>100% Natural</h4>
              <p>Sin químicos ni aditivos artificiales</p>
            </div>
          </div>
          <div class="feature-item animate-fade-in stagger-1">
            <div class="feature-item__icon">🇨🇴</div>
            <div class="feature-item__text">
              <h4>Hecho en Colombia</h4>
              <p>Con los mejores ingredientes locales</p>
            </div>
          </div>
          <div class="feature-item animate-fade-in stagger-2">
            <div class="feature-item__icon">🚚</div>
            <div class="feature-item__text">
              <h4>Envío gratis</h4>
              <p>Desde ${formatPrice(shipping.freeShippingThreshold)}</p>
            </div>
          </div>
          <div class="feature-item animate-fade-in stagger-3">
            <div class="feature-item__icon">✅</div>
            <div class="feature-item__text">
              <h4>Registro INVIMA</h4>
              <p>Calidad garantizada y certificada</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Products Section -->
    <section class="section" id="home-products" style="background: var(--c-bg-alt);">
      <div class="container">
        <div class="section-header">
          <div class="section-header__label">
            <span>✨</span> Nuestros productos
          </div>
          <h2 class="section-header__title">Lo mejor de la tierra colombiana</h2>
          <p class="section-header__subtitle">Cada producto está hecho con ingredientes naturales cuidadosamente seleccionados para tu bienestar.</p>
        </div>
        ${ProductCard.renderGrid(products)}
        <div class="text-center mt-md" style="margin-top: var(--space-2xl);">
          <a href="#/catalogo" class="btn btn--outline btn--lg">Ver todo el catálogo →</a>
        </div>
      </div>
    </section>

    <!-- Why Gran Colinos -->
    <section class="section" id="home-why">
      <div class="container">
        <div class="section-header">
          <div class="section-header__label">
            <span>💚</span> ¿Por qué Gran Colinos?
          </div>
          <h2 class="section-header__title">No somos una marca más</h2>
          <p class="section-header__subtitle">Creemos en el poder de lo natural. Cada producto es una promesa de calidad, transparencia y cuidado.</p>
        </div>
        <div class="features-strip">
          <div class="feature-item animate-fade-in">
            <div class="feature-item__icon">🔬</div>
            <div class="feature-item__text">
              <h4>Tecnología + Naturaleza</h4>
              <p>Nano CBD con 5× más absorción</p>
            </div>
          </div>
          <div class="feature-item animate-fade-in stagger-1">
            <div class="feature-item__icon">📋</div>
            <div class="feature-item__text">
              <h4>Devoluciones claras</h4>
              <p>30 días, sin letra pequeña</p>
            </div>
          </div>
          <div class="feature-item animate-fade-in stagger-2">
            <div class="feature-item__icon">🐝</div>
            <div class="feature-item__text">
              <h4>Ingredientes reales</h4>
              <p>Apitoxina, CBD, chiles naturales</p>
            </div>
          </div>
          <div class="feature-item animate-fade-in stagger-3">
            <div class="feature-item__icon">💬</div>
            <div class="feature-item__text">
              <h4>Soporte humano</h4>
              <p>Siempre listos para ayudarte</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Banner -->
    <section class="section" style="background: linear-gradient(135deg, var(--c-primary-dark), var(--c-primary)); color: #fff; text-align: center;">
      <div class="container">
        <h2 class="animate-fade-in" style="font-size: var(--fs-h1); margin-bottom: var(--space-md); color: #fff;">¿Listo para probar lo natural?</h2>
        <p class="animate-fade-in stagger-1" style="font-size: 1.125rem; opacity: 0.85; margin-bottom: var(--space-xl); max-width: 500px; margin-inline: auto;">Dale a tu cuerpo lo que merece. Productos colombianos, naturales y efectivos.</p>
        <a href="#/catalogo" class="btn btn--secondary btn--lg animate-fade-in stagger-2">Explorar productos 🌿</a>
      </div>
    </section>
  `;
}

export function mount() {
  Hero.mount();
  ProductCard.mount(document.getElementById('home-products'));

  // Intersection Observer for scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.animate-fade-in:not(.is-visible), .animate-slide-right:not(.is-visible)').forEach(el => {
    observer.observe(el);
  });
}
