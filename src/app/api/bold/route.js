import crypto from 'crypto';

/**
 * Puente seguro para la API de Bold desde la web de GC Admin.
 * ─────────────────────────────────────────────────────────────────────────────
 * El navegador no puede llamar a integrations.api.bold.co por CORS. Esta ruta
 * corre en el servidor de Vercel y reenvía solo las acciones necesarias:
 *   · terminals / methods (lectura)
 *   · link (crear link de pago para QR/NFC)
 *   · charge (enviar cobro al datáfono físico)
 *
 * Seguridad:
 *   · Exige un ID token de Firebase del proyecto gc-aponte-sas (usuario logueado).
 *   · La llave de identidad de Bold viaja en el cuerpo (es pública); nunca se
 *     registra en logs.
 *   · No se acepta la llave secreta de Bold ni datos de tarjeta.
 */

export const runtime = 'nodejs';
export const maxDuration = 30;

const BOLD_BASE = 'https://integrations.api.bold.co';
const FIREBASE_PROJECT = 'gc-aponte-sas';
const ALLOWED_ORIGINS = new Set([
  'https://grancolinos.com',
  'https://www.grancolinos.com',
  'https://gca-admin.grancolinos.com',
  'http://localhost:3000'
]);

const ACTIONS = {
  terminals: { method: 'GET', path: '/payments/binded-terminals' },
  methods: { method: 'GET', path: '/payments/payment-methods' },
  link: { method: 'POST', path: '/online/link/v1' },
  charge: { method: 'POST', path: '/payments/app-checkout' }
};

const rateLimitMap = new Map();
const RATE_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 30;

let certCache = { at: 0, certs: {} };

function corsHeaders(origin) {
  const allowed = origin && ALLOWED_ORIGINS.has(origin) ? origin : 'https://grancolinos.com';
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '600',
    Vary: 'Origin',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff'
  };
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) }
  });
}

function base64UrlToBuffer(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(normalized, 'base64');
}

async function getGoogleCertificates() {
  if (Date.now() - certCache.at < 60 * 60 * 1000 && Object.keys(certCache.certs).length > 0) {
    return certCache.certs;
  }
  const response = await fetch(
    'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com'
  );
  if (!response.ok) throw new Error('No se pudieron obtener los certificados de Firebase.');
  const certs = await response.json();
  certCache = { at: Date.now(), certs };
  return certs;
}

async function verifyFirebaseIdToken(idToken) {
  if (!idToken || typeof idToken !== 'string') return null;
  const parts = idToken.split('.');
  if (parts.length !== 3) return null;

  let header;
  let payload;
  try {
    header = JSON.parse(base64UrlToBuffer(parts[0]).toString('utf8'));
    payload = JSON.parse(base64UrlToBuffer(parts[1]).toString('utf8'));
  } catch {
    return null;
  }

  if (header?.alg !== 'RS256' || !header?.kid) return null;

  const certs = await getGoogleCertificates();
  const certificate = certs[header.kid];
  if (!certificate) return null;

  const verifier = crypto.createVerify('RSA-SHA256');
  verifier.update(`${parts[0]}.${parts[1]}`);
  verifier.end();
  if (!verifier.verify(certificate, base64UrlToBuffer(parts[2]))) return null;

  const now = Math.floor(Date.now() / 1000);
  if (payload.aud !== FIREBASE_PROJECT) return null;
  if (payload.iss !== `https://securetoken.google.com/${FIREBASE_PROJECT}`) return null;
  if (!payload.sub || typeof payload.sub !== 'string') return null;
  if (typeof payload.exp !== 'number' || payload.exp < now) return null;

  return payload;
}

function checkRateLimit(uid) {
  const now = Date.now();
  const hits = (rateLimitMap.get(uid) || []).filter(timestamp => now - timestamp < RATE_WINDOW_MS);
  if (hits.length >= MAX_REQUESTS) return false;
  hits.push(now);
  rateLimitMap.set(uid, hits);
  if (rateLimitMap.size > 2000) {
    for (const [key, timestamps] of rateLimitMap.entries()) {
      if (timestamps.every(timestamp => now - timestamp >= RATE_WINDOW_MS)) rateLimitMap.delete(key);
    }
  }
  return true;
}

function isValidIdentityKey(key) {
  return typeof key === 'string' && /^[A-Za-z0-9_-]{16,200}$/.test(key.trim());
}

function validateLinkPayload(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return 'Payload inválido.';
  if (!['OPEN', 'CLOSE'].includes(payload.amount_type)) return 'Tipo de monto inválido.';
  if (payload.amount_type === 'CLOSE') {
    const total = Number(payload.amount?.total_amount);
    if (!Number.isFinite(total) || total < 1000 || total > 50000000) {
      return 'El monto debe estar entre 1.000 y 50.000.000 COP.';
    }
  }
  if (payload.callback_url && !/^https:\/\//i.test(String(payload.callback_url))) {
    return 'La URL de comprobante debe ser HTTPS.';
  }
  if (payload.reference && !/^[A-Za-z0-9_-]{1,60}$/.test(String(payload.reference))) {
    return 'La referencia solo admite letras, números, guion y guion bajo (máx. 60).';
  }
  return null;
}

function validateChargePayload(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return 'Payload inválido.';
  const total = Number(payload.amount?.total_amount);
  if (!Number.isFinite(total) || total < 1000 || total > 50000000) {
    return 'El monto debe estar entre 1.000 y 50.000.000 COP.';
  }
  if (!payload.terminal_serial || !payload.terminal_model) return 'Falta el datáfono.';
  if (!payload.user_email || !String(payload.user_email).includes('@')) return 'Falta el correo del vendedor.';
  if (!payload.reference || !/^[A-Za-z0-9_-]{1,60}$/.test(String(payload.reference))) {
    return 'La referencia es obligatoria (máx. 60).';
  }
  return null;
}

export async function OPTIONS(request) {
  return new Response(null, { status: 204, headers: corsHeaders(request.headers.get('origin')) });
}

export async function POST(request) {
  const origin = request.headers.get('origin');
  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    return json({ error: 'Origen no permitido.' }, 403, origin);
  }

  const authorization = request.headers.get('authorization') || '';
  const idToken = authorization.startsWith('Bearer ') ? authorization.slice(7).trim() : '';
  let user = null;
  try {
    user = await verifyFirebaseIdToken(idToken);
  } catch (error) {
    console.error('[Bold API] Error verificando token:', error.message);
    return json({ error: 'No se pudo verificar la sesión.' }, 500, origin);
  }
  if (!user) {
    return json({ error: 'Sesión requerida. Inicia sesión en GC Admin.' }, 401, origin);
  }
  if (!checkRateLimit(user.sub)) {
    return json({ error: 'Demasiadas solicitudes. Espera un minuto.' }, 429, origin);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Cuerpo JSON inválido.' }, 400, origin);
  }

  const action = ACTIONS[body?.action];
  if (!action) return json({ error: 'Acción no permitida.' }, 400, origin);

  const key = typeof body?.key === 'string' ? body.key.trim() : '';
  if (!isValidIdentityKey(key)) {
    return json({ error: 'Llave de identidad de Bold inválida.' }, 400, origin);
  }

  const payload = body?.payload ?? null;
  if (action.method === 'POST') {
    const validationError =
      body.action === 'link' ? validateLinkPayload(payload) : validateChargePayload(payload);
    if (validationError) return json({ error: validationError }, 400, origin);
  }

  try {
    const response = await fetch(`${BOLD_BASE}${action.path}`, {
      method: action.method,
      headers: {
        Authorization: `x-api-key ${key}`,
        'Content-Type': 'application/json'
      },
      body: action.method === 'POST' ? JSON.stringify(payload) : undefined
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    if (!response.ok) {
      const detail =
        data?.errors?.[0]?.message ||
        data?.message ||
        `Bold respondió con estado ${response.status}.`;
      return json({ error: detail }, response.status, origin);
    }

    return json(data, 200, origin);
  } catch (error) {
    console.error('[Bold API] Error de red:', error.message);
    return json({ error: 'No se pudo contactar a Bold. Intenta de nuevo.' }, 502, origin);
  }
}
