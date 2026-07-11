/**
 * Gran Colinos — Age Gate Component
 * Required for CBD products per Colombian regulation.
 */
import { copy, featureFlags } from '../config/brand.config.js';
import { store } from '../utils/store.js';
import { icons } from './icons.js';

export function render() {
  if (!featureFlags.ageGateRequired) return '';

  return `
    <div class="age-gate" id="age-gate">
      <div class="age-gate__overlay"></div>
      <div class="age-gate__modal">
        <div class="age-gate__icon">${icons.Leaf('', 48)}</div>
        <h2 class="age-gate__title">${copy.ageGate.title}</h2>
        <p class="age-gate__text">${copy.ageGate.subtitle}</p>
        <div class="age-gate__actions" id="age-gate-actions">
          <button class="btn btn--primary" id="age-gate-confirm">
            ${copy.ageGate.confirm}
          </button>
          <button class="btn btn--outline" id="age-gate-deny">
            ${copy.ageGate.deny}
          </button>
        </div>
        <div class="age-gate__denied" id="age-gate-denied" style="display:none">
          <p>${copy.ageGate.denied}</p>
          <a href="#/" class="btn btn--outline mt-md">Volver al inicio</a>
        </div>
      </div>
    </div>
  `;
}

export function show() {
  const gate = document.getElementById('age-gate');
  if (!gate) return;
  gate.classList.add('age-gate--active');
  document.body.style.overflow = 'hidden';
}

export function hide() {
  const gate = document.getElementById('age-gate');
  if (!gate) return;
  gate.classList.remove('age-gate--active');
  document.body.style.overflow = '';
}

export function isVerified() {
  return store.state.ageVerified;
}

export function requireVerification() {
  return new Promise((resolve) => {
    if (!featureFlags.ageGateRequired || store.state.ageVerified) {
      resolve(true);
      return;
    }

    show();

    const confirmBtn = document.getElementById('age-gate-confirm');
    const denyBtn = document.getElementById('age-gate-deny');
    const actions = document.getElementById('age-gate-actions');
    const denied = document.getElementById('age-gate-denied');

    const handleConfirm = () => {
      store.verifyAge();
      hide();
      cleanup();
      resolve(true);
    };

    const handleDeny = () => {
      actions.style.display = 'none';
      denied.style.display = 'block';
      cleanup();
      resolve(false);
    };

    function cleanup() {
      confirmBtn.removeEventListener('click', handleConfirm);
      denyBtn.removeEventListener('click', handleDeny);
    }

    confirmBtn.addEventListener('click', handleConfirm);
    denyBtn.addEventListener('click', handleDeny);
  });
}

export function mount() {
  // Nothing to do on initial mount — triggered on demand
}
