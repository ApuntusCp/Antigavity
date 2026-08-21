import { NextResponse } from 'next/server';
import { adminDb } from '@/utils/firebase-admin';
import { doc, setDoc, getDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '@/utils/firebase';

export const dynamic = 'force-dynamic';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS,
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { page } = body;

    if (!page || !page.slug) {
      return NextResponse.json(
        { error: 'Datos de página inválidos. Se requiere "slug" y contenido.' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // Normalizar slug
    const cleanSlug = page.slug
      .trim()
      .toLowerCase()
      .replace(/^(https?:\/\/)+/gi, '')
      .replace(/^grancolinos\.com\/?/i, '')
      .replace(/^\//, '')
      .replace(/[^a-z0-9-_]/g, '-');

    const pageDocument = {
      ...page,
      slug: cleanSlug,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      liveUrl: `https://grancolinos.com/${cleanSlug}`
    };

    // 1. Guardar en Firestore usando adminDb con fallback a db
    try {
      if (adminDb && typeof adminDb.collection === 'function') {
        await adminDb.collection('gc_universal_pages').doc(cleanSlug).set(pageDocument, { merge: true });
        if (page.originalSlug && page.originalSlug !== cleanSlug) {
          await adminDb.collection('gc_universal_pages').doc(page.originalSlug).set(pageDocument, { merge: true });
        }
      } else {
        await setDoc(doc(db, 'gc_universal_pages', cleanSlug), pageDocument, { merge: true });
      }
    } catch (_) {
      await setDoc(doc(db, 'gc_universal_pages', cleanSlug), pageDocument, { merge: true });
    }

    return NextResponse.json({
      success: true,
      message: `Página "${page.title || cleanSlug}" publicada con éxito en vivo.`,
      slug: cleanSlug,
      liveUrl: `https://grancolinos.com/${cleanSlug}`,
      publishedAt: new Date().toISOString()
    }, { headers: CORS_HEADERS });
  } catch (error) {
    console.error('[API /api/pages/publish] Error al publicar:', error);
    return NextResponse.json(
      { error: 'Error al publicar la página en el servidor.', details: error.message },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const cleanSlug = slug
        .trim()
        .toLowerCase()
        .replace(/^(https?:\/\/)+/gi, '')
        .replace(/^grancolinos\.com\/?/i, '')
        .replace(/^\//, '');

      const docSnap = await getDoc(doc(db, 'gc_universal_pages', cleanSlug));
      if (!docSnap.exists()) {
        return NextResponse.json({ error: 'Página no encontrada' }, { status: 404, headers: CORS_HEADERS });
      }

      return NextResponse.json({ success: true, page: docSnap.data() }, { headers: CORS_HEADERS });
    }

    // Listar todas las páginas publicadas
    const snapshot = await getDocs(collection(db, 'gc_universal_pages'));
    const pages = snapshot.docs.map(d => d.data());

    return NextResponse.json({ success: true, count: pages.length, pages }, { headers: CORS_HEADERS });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al consultar páginas publicadas', details: error.message },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
