import { NextResponse } from 'next/server';

/**
 * Configuración pública de Firebase para GC Admin.
 *
 * La API key de Firebase web es un identificador público (la seguridad real
 * la aplican las reglas de Firestore/Auth), pero GitHub bloquea las claves en
 * el código. Por eso se sirve desde aquí con una variable de entorno de Vercel:
 *
 *   GC_FIREBASE_CONFIG = {"apiKey":"...","authDomain":"...","projectId":"...",
 *                         "storageBucket":"...","messagingSenderId":"...","appId":"..."}
 */
export const dynamic = 'force-dynamic';

export function GET() {
  const raw = process.env.GC_FIREBASE_CONFIG || 'null';
  return new NextResponse(`window.GC_FIREBASE_CONFIG = ${raw};`, {
    status: 200,
    headers: {
      'content-type': 'application/javascript; charset=utf-8',
      'cache-control': 'no-store, no-cache, must-revalidate',
      'x-content-type-options': 'nosniff'
    }
  });
}
