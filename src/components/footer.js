/**
 * Gran Colinos — Footer Component
 * Return policy visible from EVERY page (Phase 7 compliance).
 */
import { site, copy } from '../config/brand.config.js';
import { icons } from './icons.js';

export function render() {
  return `
    <footer class="footer" id="site-footer">
      <div class="container">
        <div class="footer__grid">
          <div class="footer__about">
            <div class="footer__logo" style="display: flex; align-items: center; gap: 0.5rem; justify-content: center;">
              <img src="/logo-principal.png" alt="${site.name}" style="height: 40px; width: auto;" />
            </div>
            <p>${copy.footer.aboutText}</p>
          </div>
          <div>
            <h4>${copy.footer.quickLinks}</h4>
            <ul class="footer__links">
              <li><a href="/"><span class="icon-wrapper">${icons.Home()}</span> Inicio</a></li>
              <li><a href="/catalogo"><span class="icon-wrapper">${icons.Sparkles()}</span> Productos</a></li>
              <li><a href="/nosotros"><span class="icon-wrapper">${icons.Heart()}</span> Nosotros</a></li>
            </ul>
          </div>
          <div>
            <h4>${copy.footer.legal}</h4>
            <ul class="footer__links">
              <li>
                <a href="/politica-devoluciones" class="footer__return-policy" id="footer-return-link">
                  <span class="icon-wrapper">${icons.Clipboard()}</span> ${copy.returns.title}
                </a>
              </li>
              <li><a href="/terminos"><span class="icon-wrapper">${icons.FileText()}</span> Términos y condiciones</a></li>
              <li><a href="/privacidad"><span class="icon-wrapper">${icons.Shield()}</span> Política de privacidad</a></li>
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
