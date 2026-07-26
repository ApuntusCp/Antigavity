'use client';

import React from 'react';

// 1. Tienda: Canasta de compra minimalista
export function IconTienda({ className = "w-5 h-5", strokeWidth = 1.5 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 9l1.5-5h9L18 9" />
      <path d="M4 9h16l-1.5 11h-13L4 9z" />
      <path d="M9 13v3M15 13v3" />
    </svg>
  );
}

// 2. Noticias: Periódico doblado visto de 3/4
export function IconNoticias({ className = "w-5 h-5", strokeWidth = 1.5 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 6h16M4 10h16M4 14h10M4 18h10" />
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M16 14h2M16 18h2" />
    </svg>
  );
}

// 3. Periodismo Alternativo: Altavoz / Megáfono con ondas concéntricas
export function IconPeriodismo({ className = "w-5 h-5", strokeWidth = 1.5 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 11l10-5v12l-10-5V11z" />
      <path d="M13 10c2-1 3.5 0 4.5 1s1.5 3 0 4.5c-1 1-2.5 2-4.5 1" />
      <path d="M18 7c3.5-1.5 6 0 7.5 2s1.5 5 0 7.5c-1.5 2-4 3.5-7.5 2" />
      <path d="M6 14.5V19a1.5 1.5 0 0 0 3 0v-3" />
    </svg>
  );
}

// 4. Libros: Libro abierto de frente
export function IconLibros({ className = "w-5 h-5", strokeWidth = 1.5 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 5c-2.5-1.5-6-1.5-9 0v14c3-1.5 6.5-1.5 9 0 2.5-1.5 6-1.5 9 0V5c-3-1.5-6.5-1.5-9 0z" />
      <path d="M12 5v14" />
    </svg>
  );
}

// 5. Base de Datos Global: Cilindro de base de datos con esfera
export function IconBaseDatos({ className = "w-5 h-5", strokeWidth = 1.5 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
      <path d="M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
      <circle cx="12" cy="12" r="7" strokeDasharray="2 2" opacity="0.6" />
    </svg>
  );
}

// 6. Movimiento: Puño izquierdo levantado en silueta sólida
export function IconMovimiento({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M10 3a2 2 0 0 0-2 2v2.1l-.8-.8a2 2 0 0 0-2.8 2.8l2 2V12a1 1 0 0 1-2 0v-1a1 1 0 0 0-2 0v2.5A5.5 5.5 0 0 0 8.5 19h7a5.5 5.5 0 0 0 5.5-5.5V9a2 2 0 0 0-3.4-1.4l-.6.6V5a2 2 0 0 0-3.4-1.4L13 4.6V3a2 2 0 0 0-3-1.7V3z" />
    </svg>
  );
}

// 7. Servicios (Red Profesional Verificada): Maletín / Red de Profesionales
export function IconServicios({ className = "w-5 h-5", strokeWidth = 1.5 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

// 8. Info (Corporativo & PQR): Círculo de Información & Soporte
export function IconInfo({ className = "w-5 h-5", strokeWidth = 1.5 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}
