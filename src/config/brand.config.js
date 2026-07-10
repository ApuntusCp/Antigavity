/**
 * Gran Colinos — Brand Configuration
 * ===================================
 * SINGLE SOURCE OF TRUTH for all brand values.
 * No colors, fonts, or brand text should be hardcoded elsewhere.
 * Every visual decision references this file.
 */

// ─── COLOR PALETTE: "Tierra Colombiana" ─────────────────────
export const colors = {
  primary:        '#2D5016',
  primaryLight:   '#3D6B20',
  primaryDark:    '#1E3A0E',
  secondary:      '#C4541A',
  secondaryLight: '#D4682E',
  accent:         '#D4920B',
  accentLight:    '#E5A832',
  bg:             '#FDF5E6',
  bgAlt:          '#FAFAF5',
  surface:        '#FFFFFF',
  text:           '#1A1A1A',
  textSecondary:  '#4A4A48',
  textMuted:      '#8A8A85',
  border:         '#E8D5B7',
  borderLight:    '#F0E6D2',
  olive:          '#7A8B5C',
  success:        '#2D7D46',
  warning:        '#E5A100',
  error:          '#C0392B',
  info:           '#1B3A5C',
};

// ─── TYPOGRAPHY (Google Fonts — 100% free) ──────────────────
export const typography = {
  heading: "'Playfair Display', Georgia, 'Times New Roman', serif",
  body:    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  sizes: {
    hero:   'clamp(2.5rem, 6vw, 4.5rem)',
    h1:     'clamp(2rem, 4vw, 3rem)',
    h2:     'clamp(1.5rem, 3vw, 2.25rem)',
    h3:     'clamp(1.25rem, 2.5vw, 1.75rem)',
    h4:     '1.25rem',
    body:   '1rem',
    small:  '0.875rem',
    xs:     '0.75rem',
  },
  weights: { regular: 400, medium: 500, semibold: 600, bold: 700, black: 900 },
};

// ─── FEATURE FLAGS ──────────────────────────────────────────
export const featureFlags = {
  underConstruction: false,
  cbdEnabled:       true,
  ageGateRequired:  true,
  ageMinimum:       18,
  arViewEnabled:    false,
  reviewsEnabled:   false,
  loyaltyEnabled:   false,
  chatEnabled:      true,
  checkoutEnabled:  true,
  api: {
    checkoutEndpoint: '/api/checkout',
    chatEndpoint: '/api/chat',
  },
};

export const products = [
  {
    id: 'CH-CBD-001',
    name: 'Gotas Orgánicas GC',
    subtitle: 'Bienestar Natural',
    shortDescription: 'Gotas de CBD orgánicas para tu bienestar diario.',
    description: 'Nuestras Gotas Orgánicas GC están formuladas con los mejores ingredientes naturales para brindarte relajación y equilibrio en tu día a día. Perfectas para aliviar el estrés y mejorar la calidad del sueño.',
    ingredients: 'Extracto puro orgánico, aceites esenciales naturales.',
    usage: 'Aplicar 2-3 gotas debajo de la lengua, esperar 60 segundos y tragar. Usar diariamente para mejores resultados.',
    warnings: 'Mantener fuera del alcance de los niños. Consultar a su médico si está en periodo de gestación.',
    category: 'cbd',
    price: 193900,
    salePrice: 169700,
    currency: 'COP',
    requiresAgeVerification: true,
    badge: 'Más Vendido',
    badgeType: 'primary',
    inStock: true,
    images: {
      main: '/products/nano-cbd/main.png',
      gallery: [
        '/products/nano-cbd/main.png'
      ],
    },
    benefits: [
      { icon: '🌿', text: '100% Orgánico' },
      { icon: '🇨🇴', text: 'Hecho en Colombia' }
    ],
  },
  {
    id: 'APX-GC-001',
    name: 'Apitoxina Relajante Muscular',
    subtitle: 'Alivio Profundo',
    shortDescription: 'Relajante muscular natural a base de veneno de abeja.',
    description: 'Poderoso relajante muscular formulado con Apitoxina (veneno de abeja) que actúa directamente sobre la tensión y el dolor. Ideal para deportistas o personas con dolores articulares.',
    ingredients: 'Apitoxina natural, extractos herbales relajantes.',
    usage: 'Aplicar sobre la zona de dolor con un suave masaje hasta que se absorba completamente.',
    warnings: 'No usar si es alérgico a las picaduras de abeja. Solo para uso externo.',
    category: 'bienestar',
    price: 55700,
    salePrice: 32900,
    currency: 'COP',
    requiresAgeVerification: false,
    badge: 'Oferta',
    badgeType: 'secondary',
    inStock: true,
    images: {
      main: '/products/apitoxina/main.png',
      gallery: [
        '/products/apitoxina/main.png'
      ],
    },
    benefits: [
      { icon: '🐝', text: 'Apitoxina pura' },
      { icon: '💪', text: 'Alivio muscular' }
    ],
  }
];

// ─── CATEGORIES ─────────────────────────────────────────────
export const categories = [
  { id: 'todos',     name: 'Todos los Productos', icon: '✨', description: 'Explora todo nuestro catálogo', enabled: true },
  { id: 'cbd',       name: 'CBD & Bienestar',     icon: '🌿', description: 'Productos con CBD de espectro completo', requiresAgeVerification: true, enabled: featureFlags.cbdEnabled },
  { id: 'bienestar', name: 'Activo Natural',       icon: '🐝', description: 'Productos naturales para tu bienestar', enabled: true },
  { id: 'snacks',    name: 'Snacks',               icon: '🌶️', description: 'Snacks con sabor colombiano', enabled: true },
];

// ─── SITE METADATA ──────────────────────────────────────────
export const site = {
  name:           'Gran Colinos',
  tagline:        'Lo natural tiene poder',
  description:    'Productos naturales premium: CBD, bienestar y snacks colombianos. Calidad que se siente.',
  domain:         'grancolinos.com',
  url:            'https://grancolinos.com',
  currency:       'COP',
  currencySymbol: '$',
  locale:         'es-CO',
  whatsapp:       '',
  instagram:      '',
  email:          '',
};

// ─── UI COPY (Tono: cercano, cálido, tuteo) ─────────────────
export const copy = {
  hero: {
    title:        'Lo natural tiene poder',
    subtitle:     'Productos que cuidan tu cuerpo, hechos con la fuerza de la tierra colombiana.',
    cta:          'Explorar productos',
    ctaSecondary: 'Conoce nuestra historia',
  },
  cart: {
    empty:            'Tu carrito está vacío',
    emptySubtitle:    '¡Agrega algo que te encante!',
    total:            'Total',
    checkout:         'Ir a pagar',
    continueShopping: 'Seguir comprando',
    added:            '¡Agregado al carrito!',
    removed:          'Producto eliminado',
  },
  product: {
    addToCart:       'Agregar al carrito',
    buyNow:         'Comprar ahora',
    outOfStock:     'Agotado',
    ingredients:    'Ingredientes',
    usage:          'Modo de uso',
    description:    'Descripción',
    warnings:       'Precauciones',
    relatedProducts:'También te puede gustar',
  },
  ageGate: {
    title:    '¿Eres mayor de 18 años?',
    subtitle: 'Este producto contiene CBD. Por regulación colombiana, debemos verificar tu edad antes de continuar.',
    confirm:  'Sí, soy mayor de 18',
    deny:     'No, soy menor de edad',
    denied:   'Lo sentimos, debes ser mayor de 18 años para ver estos productos.',
  },
  footer: {
    about:     'Sobre Gran Colinos',
    aboutText: 'Somos una marca colombiana comprometida con productos naturales de la más alta calidad. Cada producto nace de la tierra y llega a tus manos con todo el cuidado que mereces.',
    quickLinks:'Enlaces rápidos',
    legal:     'Legal',
    followUs:  'Síguenos',
    rights:    '© 2026 Gran Colinos. Todos los derechos reservados.',
    madeIn:    'Hecho con 💚 en Colombia',
  },
  returns: {
    title:   'Política de devoluciones',
    summary: 'Tienes 30 días para devolver tu producto si no estás satisfecho. Sin complicaciones, sin letra pequeña.',
    details: `En Gran Colinos creemos que deberías amar lo que compras. Si por cualquier razón no estás satisfecho con tu compra, tienes 30 días calendario desde la fecha de entrega para solicitar un cambio o devolución.\n\n**¿Cómo funciona?**\n1. Escríbenos por WhatsApp o correo con tu número de pedido.\n2. Te enviamos una guía de devolución (sin costo adicional).\n3. Una vez recibamos el producto, procesamos tu reembolso en máximo 5 días hábiles.\n\n**Condiciones:**\n- El producto debe estar sin uso y en su empaque original.\n- Los productos CBD abiertos no son reembolsables por razones sanitarias, pero sí canjeables.\n- Snacks: solo aplica devolución si el producto llegó dañado o en mal estado.\n\n**Importante:** Si alguna vez cambiamos esta política, te avisaremos por WhatsApp y correo antes de que entre en vigencia.`,
  },
};

// ─── SHIPPING ───────────────────────────────────────────────
export const shipping = {
  freeShippingThreshold: 150000,
  estimatedDays: { min: 3, max: 7 },
  disclaimer: 'Entrega estimada',
  methods: [
    { id: 'standard', name: 'Envío estándar', description: '3–7 días hábiles', price: 12000 },
    { id: 'express',  name: 'Envío express',  description: '1–3 días hábiles', price: 25000 },
  ],
};

// ─── HELPERS ────────────────────────────────────────────────
export function formatPrice(amount) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getProductById(id) {
  return products.find(p => p.id === id);
}

export function getProductsByCategory(categoryId) {
  if (categoryId === 'todos') return products.filter(p => {
    const cat = categories.find(c => c.id === p.category);
    return cat?.enabled !== false;
  });
  return products.filter(p => p.category === categoryId);
}

export function getDiscountPercent(product) {
  if (!product.salePrice || product.salePrice >= product.price) return 0;
  return Math.round((1 - product.salePrice / product.price) * 100);
}
