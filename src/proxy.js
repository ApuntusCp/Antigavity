import { NextResponse } from 'next/server';

// ── Proyecto Firestore ────────────────────────────────────────────────────────
// Leemos el doc maintenance_config via REST API para no depender del Firebase SDK
// (que no está disponible en Edge/Proxy runtime).
const FIRESTORE_PROJECT = 'aponte-sas';
const MAINTENANCE_DOC_URL =
  `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT}/databases/(default)/documents/settings/maintenance_config`;

// ── Rutas que protege este proxy ──────────────────────────────────────────────
// Cualquier ruta del menú de grancolinos.com que el admin puede poner en mantenimiento.
// /en-construccion está EXCLUIDA del matcher para evitar redirect loop.
const PROTECTED_ROUTES = new Set([
  '/',
  '/movimiento',
  '/noticias',
  '/periodismo-alternativo',
  '/libros',
  '/base-de-datos-global',
  '/artistas',
  '/servicios',
  '/comunidad',
  '/informacion',
  '/shop',
  '/gca',
  '/blog',
  '/contacto',
]);

// ── Parsear el valor booleano del formato REST de Firestore ───────────────────
// Firestore REST devuelve: { "booleanValue": true } o { "stringValue": "..." }
function getFieldValue(fieldObj) {
  if (!fieldObj) return undefined;
  if ('booleanValue' in fieldObj) return fieldObj.booleanValue;
  if ('stringValue' in fieldObj) return fieldObj.stringValue;
  if ('integerValue' in fieldObj) return Number(fieldObj.integerValue);
  return undefined;
}

// ── Leer configuración de mantenimiento desde Firestore REST ──────────────────
// Devuelve un objeto plano: { '/informacion': { enabled: true, title: '...' }, ... }
// Si hay cualquier error, devuelve null (fail-safe: no bloquear producción).
async function fetchMaintenanceConfig() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000); // 3s timeout

    const res = await fetch(MAINTENANCE_DOC_URL, {
      cache: 'no-store',
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) return null;

    const json = await res.json();
    const fields = json?.fields ?? {};

    // Convertir el formato REST de Firestore a un objeto JS plano
    // Cada clave del doc es una ruta (ej. "/informacion") con un mapValue
    const config = {};
    for (const [routeKey, routeVal] of Object.entries(fields)) {
      const routeFields = routeVal?.mapValue?.fields ?? {};
      config[routeKey] = {
        enabled: getFieldValue(routeFields.enabled),
        title: getFieldValue(routeFields.title),
        subtitle: getFieldValue(routeFields.subtitle),
        moduleName: getFieldValue(routeFields.moduleName),
        estimatedDate: getFieldValue(routeFields.estimatedDate),
        statusText: getFieldValue(routeFields.statusText),
        qualityText: getFieldValue(routeFields.qualityText),
      };
    }
    return config;
  } catch {
    // Timeout, red caída, JSON inválido — fail-safe: permitir acceso
    return null;
  }
}

// ── Rutas en modo construcción indefinido ─────────────────────────────────────
const INDEFINITE_MAINTENANCE_ROUTES = {
  '/gca': {
    enabled: true,
    title: 'MÓDULO GRAN COLINA ARQUITECTOS EN CONSTRUCCIÓN',
    subtitle: 'Estamos perfeccionando nuestro estudio de arquitectura de autor, diseño de interiores y construcción premium a gran escala.',
    moduleName: 'Gran Colina Arquitectos (GCA)',
    estimatedDate: 'Indefinido / Próximamente',
    statusText: 'En Desarrollo Exclusivo',
    qualityText: 'Estándar Aponte SAS',
  },
  '/movimiento': {
    enabled: true,
    title: 'MÓDULO DE MOVIMIENTO GRAN COLINOS EN CONSTRUCCIÓN',
    subtitle: 'Estamos preparando nuestra red comunitaria Solarpunk y manifiesto de soberanía botánica y tecnológica.',
    moduleName: 'Movimiento Solarpunk GC',
    estimatedDate: 'Indefinido / Próximamente',
    statusText: 'En Desarrollo Activo',
    qualityText: '100% Soberano',
  },
};

// ── Función principal del proxy ───────────────────────────────────────────────
export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // 1. Normalizar pathname (remover trailing slash si no es raíz)
  const cleanPath = pathname.length > 1 && pathname.endsWith('/')
    ? pathname.slice(0, -1)
    : pathname;

  // 2. Solo actuar sobre rutas protegidas (excluye assets, API, etc.)
  if (!PROTECTED_ROUTES.has(cleanPath)) {
    return NextResponse.next();
  }

  // 3. Bypass admin: si tiene la cookie gc_admin_bypass, dejar pasar siempre
  const adminBypass = request.cookies.get('gc_admin_bypass');
  if (adminBypass?.value === '1') {
    return NextResponse.next();
  }

  // 4. Modo Construcción Indefinido prioritario (/gca, /movimiento)
  // Se ejecuta de inmediato sin depender de red ni cuotas de base de datos
  const indefiniteConfig = INDEFINITE_MAINTENANCE_ROUTES[cleanPath];
  if (indefiniteConfig && indefiniteConfig.enabled) {
    const url = request.nextUrl.clone();
    url.pathname = '/en-construccion';
    url.searchParams.set('ruta', cleanPath);
    if (indefiniteConfig.title) url.searchParams.set('titulo', indefiniteConfig.title);
    if (indefiniteConfig.subtitle) url.searchParams.set('subtitulo', indefiniteConfig.subtitle);
    if (indefiniteConfig.moduleName) url.searchParams.set('modulo', indefiniteConfig.moduleName);
    if (indefiniteConfig.estimatedDate) url.searchParams.set('fecha', indefiniteConfig.estimatedDate);
    if (indefiniteConfig.statusText) url.searchParams.set('estado', indefiniteConfig.statusText);
    if (indefiniteConfig.qualityText) url.searchParams.set('calidad', indefiniteConfig.qualityText);
    return NextResponse.rewrite(url);
  }

  // 5. Consultar estado de mantenimiento dinámico en Firestore para las demás rutas
  const config = await fetchMaintenanceConfig();

  // 6. Fail-safe: si Firestore falló, permitir acceso normal
  if (config === null) {
    return NextResponse.next();
  }

  // 7. Buscar la config de esta ruta (con y sin slash inicial)
  const noSlashKey = cleanPath.replace(/^\//, '') || 'home';
  const routeConfig = config[cleanPath] ?? config[noSlashKey] ?? null;

  // 8. Si enabled=true, redirigir a la página de construcción
  if (routeConfig?.enabled === true) {
    const url = request.nextUrl.clone();
    url.pathname = '/en-construccion';
    url.searchParams.set('ruta', cleanPath);
    // Preservar los datos para evitar una segunda llamada a Firestore
    if (routeConfig.title) url.searchParams.set('titulo', routeConfig.title);
    if (routeConfig.subtitle) url.searchParams.set('subtitulo', routeConfig.subtitle);
    if (routeConfig.moduleName) url.searchParams.set('modulo', routeConfig.moduleName);
    if (routeConfig.estimatedDate) url.searchParams.set('fecha', routeConfig.estimatedDate);
    if (routeConfig.statusText) url.searchParams.set('estado', routeConfig.statusText);
    if (routeConfig.qualityText) url.searchParams.set('calidad', routeConfig.qualityText);
    return NextResponse.rewrite(url);
  }

  // 9. Mantenimiento desactivado — pasar normal
  return NextResponse.next();
}

// ── Matcher: rutas donde este proxy se activa ─────────────────────────────────
// Excluye: _next/static, _next/image, favicon.ico, archivos con extensión,
//          y la propia página /en-construccion para evitar loop infinito.
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|en-construccion|api|.*\\..*).*)',
  ],
};
