import { NextResponse } from 'next/server';
import { adminDb } from '@/utils/firebase-admin';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
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

    const cleanSlug = page.slug
      .trim()
      .toLowerCase()
      .replace(/^(https?:\/\/)+/gi, '')
      .replace(/^(www\.)?grancolinos\.com\/?/i, '')
      .replace(/^\//, '')
      .replace(/\/$/, '')
      .replace(/[^a-z0-9-_]/g, '-');

    const pageDocument = {
      ...page,
      slug: cleanSlug,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      liveUrl: `https://grancolinos.com/${cleanSlug}`
    };

    // 1. Guardar con adminDb (Firebase Admin SDK Server-Side con permisos completos)
    try {
      await adminDb.collection('gca_projects').doc(`page_${cleanSlug}`).set(pageDocument, { merge: true });
      await adminDb.collection('gc_universal_pages').doc(cleanSlug).set(pageDocument, { merge: true });

      if (page.originalSlug && page.originalSlug !== cleanSlug) {
        await adminDb.collection('gca_projects').doc(`page_${page.originalSlug}`).set(pageDocument, { merge: true });
        await adminDb.collection('gc_universal_pages').doc(page.originalSlug).set(pageDocument, { merge: true });
      }
    } catch (adminErr) {
      console.warn('[API /api/pages/publish] Fallback a client db:', adminErr?.message);
      await setDoc(doc(db, 'gca_projects', `page_${cleanSlug}`), pageDocument, { merge: true });
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
        .replace(/^(www\.)?grancolinos\.com\/?/i, '')
        .replace(/^\//, '');

      try {
        const docSnap = await adminDb.collection('gc_universal_pages').doc(cleanSlug).get();
        if (docSnap.exists) {
          return NextResponse.json({ success: true, page: docSnap.data() }, { headers: CORS_HEADERS });
        }
        const docSnap2 = await adminDb.collection('gca_projects').doc(`page_${cleanSlug}`).get();
        if (docSnap2.exists) {
          return NextResponse.json({ success: true, page: docSnap2.data() }, { headers: CORS_HEADERS });
        }
      } catch (_) {}

      const docSnap = await getDoc(doc(db, 'gc_universal_pages', cleanSlug));
      if (!docSnap.exists()) {
        return NextResponse.json({ error: 'Página no encontrada' }, { status: 404, headers: CORS_HEADERS });
      }

      return NextResponse.json({ success: true, page: docSnap.data() }, { headers: CORS_HEADERS });
    }

    try {
      const snapshot = await adminDb.collection('gc_universal_pages').get();
      const pages = snapshot.docs.map(d => d.data());
      return NextResponse.json({ success: true, count: pages.length, pages }, { headers: CORS_HEADERS });
    } catch (_) {}

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
