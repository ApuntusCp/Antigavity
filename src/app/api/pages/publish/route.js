import { NextResponse } from 'next/server';
import { adminDb } from '@/utils/firebase-admin';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/utils/firebase';

export const dynamic = 'force-dynamic';

const ALLOWED_ORIGINS = ['https://grancolinos.com', 'https://www.grancolinos.com', 'http://localhost:3000'];

function getCorsHeaders(request) {
  const origin = request.headers.get('origin');
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : 'https://grancolinos.com';
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  };
}

export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(request),
  });
}

export async function POST(request) {
  const corsHeaders = getCorsHeaders(request);

  // ── Verificación obligatoria de clave de administración ──────────────────────
  const authHeader = request.headers.get('authorization') || '';
  const adminSecret = process.env.ADMIN_SECRET_KEY;
  if (!adminSecret || authHeader !== `Bearer ${adminSecret}`) {
    return NextResponse.json(
      { error: 'No autorizado para publicar páginas' },
      { status: 401, headers: corsHeaders }
    );
  }

  try {
    const body = await request.json();
    const { page } = body;

    if (!page || !page.slug || typeof page.slug !== 'string') {
      return NextResponse.json(
        { error: 'Datos de página inválidos. Se requiere "slug" y contenido.' },
        { status: 400, headers: corsHeaders }
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

    if (!cleanSlug || cleanSlug.length < 2 || cleanSlug.length > 80) {
      return NextResponse.json(
        { error: 'Formato de slug inválido (debe tener entre 2 y 80 caracteres alfanuméricos).' },
        { status: 400, headers: corsHeaders }
      );
    }

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
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('[API /api/pages/publish] Error al publicar:', error);
    return NextResponse.json(
      { error: 'Error al publicar la página en el servidor.' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function GET(request) {
  const corsHeaders = getCorsHeaders(request);
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
          return NextResponse.json({ success: true, page: docSnap.data() }, { headers: corsHeaders });
        }
        const docSnap2 = await adminDb.collection('gca_projects').doc(`page_${cleanSlug}`).get();
        if (docSnap2.exists) {
          return NextResponse.json({ success: true, page: docSnap2.data() }, { headers: corsHeaders });
        }
      } catch (_) {}

      const docSnap = await getDoc(doc(db, 'gc_universal_pages', cleanSlug));
      if (!docSnap.exists()) {
        return NextResponse.json({ error: 'Página no encontrada' }, { status: 404, headers: corsHeaders });
      }

      return NextResponse.json({ success: true, page: docSnap.data() }, { headers: corsHeaders });
    }

    try {
      const snapshot = await adminDb.collection('gc_universal_pages').get();
      const pages = snapshot.docs.map(d => d.data());
      return NextResponse.json({ success: true, count: pages.length, pages }, { headers: corsHeaders });
    } catch (_) {}

    const snapshot = await getDocs(collection(db, 'gc_universal_pages'));
    const pages = snapshot.docs.map(d => d.data());

    return NextResponse.json({ success: true, count: pages.length, pages }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al consultar páginas publicadas' },
      { status: 500, headers: corsHeaders }
    );
  }
}
