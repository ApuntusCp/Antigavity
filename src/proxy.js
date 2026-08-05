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

// ── Función principal del proxy ───────────────────────────────────────────────
export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // 1. Solo actuar sobre rutas protegidas (excluye assets, API, etc.)
  if (!PROTECTED_ROUTES.has(pathname)) {
    return NextResponse.next();
  }

  // 2. Bypass admin: si tiene la cookie gc_admin_bypass, dejar pasar siempre
  const adminBypass = request.cookies.get('gc_admin_bypass');
  if (adminBypass?.value === '1') {
    return NextResponse.next();
  }

  // 3. Consultar estado de mantenimiento en Firestore
  const config = await fetchMaintenanceConfig();

  // 4. Fail-safe: si Firestore falló, permitir acceso normal
  if (config === null) {
    return NextResponse.next();
  }

  // 5. Buscar la config de esta ruta (con y sin slash inicial)
  const cleanKey = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const noSlashKey = pathname.replace(/^\//, '') || 'home';
  const routeConfig = config[cleanKey] ?? config[noSlashKey] ?? null;

  // 6. Si enabled=true, redirigir a la página de construcción
  if (routeConfig?.enabled === true) {
    const url = request.nextUrl.clone();
    url.pathname = '/en-construccion';
    url.searchParams.set('ruta', pathname);
    // Preservar los datos para evitar una segunda llamada a Firestore
    if (routeConfig.title) url.searchParams.set('titulo', routeConfig.title);
    if (routeConfig.subtitle) url.searchParams.set('subtitulo', routeConfig.subtitle);
    if (routeConfig.moduleName) url.searchParams.set('modulo', routeConfig.moduleName);
    if (routeConfig.estimatedDate) url.searchParams.set('fecha', routeConfig.estimatedDate);
    return NextResponse.rewrite(url);
  }

  // 7. Mantenimiento desactivado — pasar normal
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
