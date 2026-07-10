/**
 * Gran Colinos — Footer Component
 * Return policy visible from EVERY page (Phase 7 compliance).
 */
import { site, copy } from '../config/brand.config.js';

export function render() {
  return `
    <footer class="footer" id="site-footer">
      <div class="container">
        <div class="footer__grid">
          <div class="footer__about">
            <div class="footer__logo">🌿 ${site.name}</div>
            <p>${copy.footer.aboutText}</p>
          </div>
          <div>
            <h4>${copy.footer.quickLinks}</h4>
            <ul class="footer__links">
              <li><a href="#/">🏠 Inicio</a></li>
              <li><a href="#/catalogo">✨ Productos</a></li>
              <li><a href="#/nosotros">💚 Nosotros</a></li>
            </ul>
          </div>
          <div>
            <h4>${copy.footer.legal}</h4>
            <ul class="footer__links">
              <li>
                <a href="#/politica-devoluciones" class="footer__return-policy" id="footer-return-link">
                  📋 ${copy.returns.title}
                </a>
              </li>
              <li><a href="#/terminos">📄 Términos y condiciones</a></li>
              <li><a href="#/privacidad">🔒 Política de privacidad</a></li>
            </ul>
          </div>
        </div>
        <div class="footer__bottom">
          <span>${copy.footer.rights}</span>
          <span>${copy.footer.madeIn}</span>
        </div>
      </div>
    </footer>
  `;
}

export function mount() {
  // Footer is mostly static, no special event listeners needed
}
