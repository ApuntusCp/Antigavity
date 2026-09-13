import { adminAuth } from './firebase-admin';

/**
 * Valida la autorización de una solicitud Next.js.
 * Acepta tokens de Firebase Auth ID Token o ADMIN_SECRET_KEY del servidor.
 * Retorna { uid, email, isAdmin } si es válido, o null si no está autorizado.
 */
export async function authenticateRequest(request) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    if (!authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) return null;

    // 1. Validar si es la clave de administración interna
    const adminSecret = process.env.ADMIN_SECRET_KEY;
    if (adminSecret && token === adminSecret) {
      return { uid: 'admin', email: 'admin@grancolinos.com', isAdmin: true };
    }

    // 2. Validar como token de usuario de Firebase Auth
    try {
      const decoded = await adminAuth.verifyIdToken(token);
      return {
        uid: decoded.uid,
        email: decoded.email || null,
        isAdmin: !!decoded.admin,
      };
    } catch (_) {
      return null;
    }
  } catch (error) {
    console.error('[auth-server] Error verificando autenticación:', error);
    return null;
  }
}
