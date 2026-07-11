/**
 * Gran Colinos — Checkout Page
 */
import { products, formatPrice, shipping } from '../config/brand.config.js';
import { store } from '../utils/store.js';
import { submitOrder } from '../services/api.js';
import { icons } from '../components/icons.js';

export function render() {
  const { cart } = store.state;
  if (cart.length === 0) {
    return `
      <section class="section" style="padding-top: calc(var(--header-h) + var(--space-3xl)); text-align: center;">
        <div class="container">
          <h1 style="margin-bottom: var(--space-md);">Tu carrito está vacío</h1>
          <a href="#/catalogo" class="btn btn--primary">Volver a la tienda</a>
        </div>
      </section>
    `;
  }

  const total = store.getCartTotal(products);
  const isFreeShipping = total >= shipping.freeShippingThreshold;
  const shippingCost = isFreeShipping ? 0 : 12000; // Mock base rate if not free
  const grandTotal = total + shippingCost;

  return `
    <section class="section" style="padding-top: calc(var(--header-h) + var(--space-xl)); background: var(--c-bg-alt); min-height: 100vh;">
      <div class="container" style="max-width: 1000px;">
        <div class="checkout-grid" style="display: grid; grid-template-columns: 1fr; gap: var(--space-2xl);">
          
          <!-- Checkout Form -->
          <div class="checkout-form-container" style="background: var(--c-surface); padding: var(--space-xl); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm);">
            <h1 style="font-size: var(--fs-h2); margin-bottom: var(--space-xl);">Finalizar Pedido</h1>
            
            <form id="checkout-form">
              <h3 style="font-family: var(--f-body); font-size: 1.125rem; font-weight: 600; margin-bottom: var(--space-md); padding-bottom: var(--space-xs); border-bottom: 1px solid var(--c-border-light);">Datos de Contacto</h3>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md); margin-bottom: var(--space-md);">
                <div style="display: flex; flex-direction: column; gap: var(--space-xs);">
                  <label for="fname" style="font-size: var(--fs-small); font-weight: 500; color: var(--c-text-secondary);">Nombre</label>
                  <input type="text" id="fname" name="fname" required style="padding: 12px; border: 1px solid var(--c-border); border-radius: var(--radius-sm); outline: none; transition: border-color 0.2s;" />
                </div>
                <div style="display: flex; flex-direction: column; gap: var(--space-xs);">
                  <label for="lname" style="font-size: var(--fs-small); font-weight: 500; color: var(--c-text-secondary);">Apellidos</label>
                  <input type="text" id="lname" name="lname" required style="padding: 12px; border: 1px solid var(--c-border); border-radius: var(--radius-sm); outline: none;" />
                </div>
              </div>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md); margin-bottom: var(--space-xl);">
                <div style="display: flex; flex-direction: column; gap: var(--space-xs);">
                  <label for="email" style="font-size: var(--fs-small); font-weight: 500; color: var(--c-text-secondary);">Correo Electrónico</label>
                  <input type="email" id="email" name="email" required style="padding: 12px; border: 1px solid var(--c-border); border-radius: var(--radius-sm); outline: none;" />
                </div>
                <div style="display: flex; flex-direction: column; gap: var(--space-xs);">
                  <label for="phone" style="font-size: var(--fs-small); font-weight: 500; color: var(--c-text-secondary);">Teléfono (WhatsApp)</label>
                  <input type="tel" id="phone" name="phone" required style="padding: 12px; border: 1px solid var(--c-border); border-radius: var(--radius-sm); outline: none;" />
                </div>
              </div>

              <h3 style="font-family: var(--f-body); font-size: 1.125rem; font-weight: 600; margin-bottom: var(--space-md); padding-bottom: var(--space-xs); border-bottom: 1px solid var(--c-border-light);">Dirección de Envío</h3>
              
              <div style="display: flex; flex-direction: column; gap: var(--space-xs); margin-bottom: var(--space-md);">
                <label for="address" style="font-size: var(--fs-small); font-weight: 500; color: var(--c-text-secondary);">Dirección completa</label>
                <input type="text" id="address" name="address" required placeholder="Ej: Calle 123 #45-67 Apto 8" style="padding: 12px; border: 1px solid var(--c-border); border-radius: var(--radius-sm); outline: none;" />
              </div>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md); margin-bottom: var(--space-2xl);">
                <div style="display: flex; flex-direction: column; gap: var(--space-xs);">
                  <label for="city" style="font-size: var(--fs-small); font-weight: 500; color: var(--c-text-secondary);">Ciudad</label>
                  <input type="text" id="city" name="city" required style="padding: 12px; border: 1px solid var(--c-border); border-radius: var(--radius-sm); outline: none;" />
                </div>
                <div style="display: flex; flex-direction: column; gap: var(--space-xs);">
                  <label for="department" style="font-size: var(--fs-small); font-weight: 500; color: var(--c-text-secondary);">Departamento</label>
                  <select id="department" name="department" required style="padding: 12px; border: 1px solid var(--c-border); border-radius: var(--radius-sm); outline: none; background: #fff;">
                    <option value="">Selecciona...</option>
                    <option value="Antioquia">Antioquia</option>
                    <option value="Bogotá D.C.">Bogotá D.C.</option>
                    <option value="Cundinamarca">Cundinamarca</option>
                    <option value="Valle del Cauca">Valle del Cauca</option>
                    <option value="Otro">Otro (Nacional)</option>
                  </select>
                </div>
              </div>

              <button type="submit" id="checkout-submit-btn" class="btn btn--primary btn--full btn--lg" style="display:flex; justify-content:center; gap:10px;">
                <span>Ir a Pagar con Bold</span>
                <span style="display:inline-flex; align-items:center;">${icons.Shield('', 20)}</span>
              </button>
              <p style="text-align:center; font-size:var(--fs-xs); color:var(--c-text-muted); margin-top:var(--space-sm);">Pagos 100% seguros a través de Bold.</p>
            </form>
          </div>

          <!-- Order Summary -->
          <div class="checkout-summary" style="background: var(--c-primary-dark); color: #fff; padding: var(--space-xl); border-radius: var(--radius-lg); height: fit-content; align-self: start;">
            <h3 style="font-family: var(--f-body); font-size: 1.25rem; font-weight: 600; margin-bottom: var(--space-xl); color: #fff;">Resumen del Pedido</h3>
            
            <div style="display: flex; flex-direction: column; gap: var(--space-md); margin-bottom: var(--space-xl);">
              ${cart.map(item => {
                const p = products.find(prod => prod.id === item.productId);
                if (!p) return '';
                const price = p.salePrice || p.price;
                return `
                  <div style="display: flex; justify-content: space-between; align-items: center; gap: var(--space-sm);">
                    <div style="display: flex; align-items: center; gap: var(--space-sm);">
                      <div style="width: 50px; height: 50px; background: #fff; border-radius: var(--radius-sm); overflow: hidden; flex-shrink: 0;">
                        <img src="${p.images.main}" style="width: 100%; height: 100%; object-fit: cover;" />
                      </div>
                      <div>
                        <div style="font-size: var(--fs-small); font-weight: 500;">${p.name}</div>
                        <div style="font-size: var(--fs-xs); opacity: 0.7;">Cant: ${item.qty}</div>
                      </div>
                    </div>
                    <div style="font-weight: 600; font-size: var(--fs-small);">${formatPrice(price * item.qty)}</div>
                  </div>
                `;
              }).join('')}
            </div>
            
            <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: var(--space-md); margin-bottom: var(--space-md);">
              <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-sm); font-size: var(--fs-small); opacity: 0.8;">
                <span>Subtotal</span>
                <span>${formatPrice(total)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: var(--fs-small); opacity: 0.8;">
                <span>Envío</span>
                <span>${isFreeShipping ? 'Gratis' : formatPrice(shippingCost)}</span>
              </div>
            </div>
            
            <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: var(--space-md); display: flex; justify-content: space-between; font-size: 1.5rem; font-weight: 700;">
              <span>Total</span>
              <span style="color: var(--c-accent-light);">${formatPrice(grandTotal)}</span>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  `;
}

export function mount() {
  const form = document.getElementById('checkout-form');
  if (!form) return;

  // Add media query rule programmatically for layout
  const mq = window.matchMedia('(min-width: 768px)');
  const grid = document.querySelector('.checkout-grid');
  
  function applyGrid() {
    if (grid) {
      grid.style.gridTemplateColumns = mq.matches ? '1.5fr 1fr' : '1fr';
    }
  }
  mq.addEventListener('change', applyGrid);
  applyGrid();

  // Load saved customer data (guest mode cache)
  const savedData = localStorage.getItem('gc_customer');
  if (savedData) {
    try {
      const data = JSON.parse(savedData);
      Object.keys(data).forEach(key => {
        if (form.elements[key]) form.elements[key].value = data[key];
      });
    } catch(e){}
  }

  // Handle Form Submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('checkout-submit-btn');
    
    // Build Customer Object
    const customer = {
      firstName: form.fname.value.trim(),
      lastName: form.lname.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      address: form.address.value.trim(),
      city: form.city.value.trim(),
      department: form.department.value
    };

    // Save to localstorage for convenience
    localStorage.setItem('gc_customer', JSON.stringify(customer));

    // Calculate totals
    const cartItems = store.state.cart;
    const total = store.getCartTotal(products);
    const isFreeShipping = total >= shipping.freeShippingThreshold;
    const shippingCost = isFreeShipping ? 0 : 12000;
    const grandTotal = total + shippingCost;

    // Detailed cart mapping for n8n/Alegra
    const orderItems = cartItems.map(item => {
      const p = products.find(prod => prod.id === item.productId);
      return {
        id: p.id,
        name: p.name,
        price: p.salePrice || p.price,
        qty: item.qty,
        total: (p.salePrice || p.price) * item.qty
      };
    });

    const payload = {
      customer,
      items: orderItems,
      totals: {
        subtotal: total,
        shipping: shippingCost,
        grandTotal: grandTotal
      }
    };

    // UI Loading state
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span style="animation: pulse 1s infinite;">Conectando con pasarela...</span>';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    // Submit to API
    const response = await submitOrder(payload);

    if (response.success && response.paymentUrl) {
      if (response.isMock) {
        store.showToast('ℹ️ Modo Dev: Redirigiendo a pasarela Mock');
      }
      // Redirect to Bold
      window.location.href = response.paymentUrl;
    } else {
      btn.innerHTML = originalText;
      btn.disabled = false;
      btn.style.opacity = '1';
      store.showToast(response.error || 'Error al procesar el pago', 'error');
    }
  });
}
