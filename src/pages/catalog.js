/**
 * Gran Colinos — Catalog Page
 */
import { products, categories, getProductsByCategory } from '../config/brand.config.js';
import * as ProductCard from '../components/product-card.js';

let currentCategory = 'todos';

export function render(categoryFilter = 'todos') {
  currentCategory = categoryFilter;
  const filteredProducts = getProductsByCategory(categoryFilter);
  const activeCategories = categories.filter(c => c.enabled !== false);

  return `
    <section class="catalog section">
      <div class="container">
        <div class="section-header" style="text-align: left;">
          <h1 class="section-header__title">Nuestros Productos</h1>
          <p class="section-header__subtitle" style="margin-inline: 0;">Explora nuestra selección de productos naturales colombianos.</p>
        </div>

        <div class="catalog__filters" id="catalog-filters">
          ${activeCategories.map(cat => `
            <button class="catalog__filter-btn ${cat.id === categoryFilter ? 'catalog__filter-btn--active' : ''}"
                    data-filter="${cat.id}">
              ${cat.icon} ${cat.name}
            </button>
          `).join('')}
        </div>

        <div id="catalog-products">
          ${filteredProducts.length > 0
            ? ProductCard.renderGrid(filteredProducts)
            : '<p class="text-center text-muted" style="padding: var(--space-3xl);">No hay productos en esta categoría.</p>'
          }
        </div>
      </div>
    </section>
  `;
}

export function mount() {
  const filtersContainer = document.getElementById('catalog-filters');
  const productsContainer = document.getElementById('catalog-products');

  if (!filtersContainer) return;

  filtersContainer.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.filter;
      currentCategory = category;

      // Update active state
      filtersContainer.querySelectorAll('[data-filter]').forEach(b =>
        b.classList.toggle('catalog__filter-btn--active', b.dataset.filter === category)
      );

      // Re-render products
      const filteredProducts = getProductsByCategory(category);
      productsContainer.innerHTML = filteredProducts.length > 0
        ? ProductCard.renderGrid(filteredProducts)
        : '<p class="text-center text-muted" style="padding: var(--space-3xl);">No hay productos en esta categoría.</p>';

      ProductCard.mount(productsContainer);

      // Animate new cards
      productsContainer.querySelectorAll('.animate-fade-in').forEach(el => {
        setTimeout(() => el.classList.add('is-visible'), 50);
      });
    });
  });

  ProductCard.mount(productsContainer);

  // Animate on load
  setTimeout(() => {
    document.querySelectorAll('.catalog .animate-fade-in').forEach(el => {
      el.classList.add('is-visible');
    });
  }, 100);
}
