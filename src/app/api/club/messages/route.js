import { NextResponse } from 'next/server';
import { adminDb } from '../../../../utils/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';

// ── GET: Obtener mensajes enriquecidos con tag y tipo ────────────────────────
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get('tag');
    const postType = searchParams.get('postType');

    let query = adminDb.collection('community_messages').orderBy('createdAt', 'desc').limit(50);

    const snapshot = await query.get();
    let messages = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt ? (data.createdAt.toDate ? data.createdAt.toDate().toISOString() : data.createdAt) : new Date().toISOString(),
        likesCount: data.likesCount || (Array.isArray(data.likedBy) ? data.likedBy.length : 0),
        likedBy: Array.isArray(data.likedBy) ? data.likedBy : [],
        replies: Array.isArray(data.replies) ? data.replies : [],
        tag: data.tag || 'Testimonio',
        postType: data.postType || (data.authorName?.toLowerCase().includes('aponte') || data.role?.toLowerCase().includes('admin') ? 'institucional' : 'comunidad')
      };
    });

    if (tag && tag !== 'Todos') {
      messages = messages.filter(m => m.tag === tag);
    }

    if (postType && postType !== 'todos') {
      messages = messages.filter(m => m.postType === postType);
    }

    return NextResponse.json({ success: true, count: messages.length, messages });
  } catch (error) {
    console.error('[Messages GET] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ── POST: Crear nuevo mensaje en el foro ─────────────────────────────────────
export async function POST(request) {
  try {
    const body = await request.json();
    const { uid, text, authorName, role, photoUrl, avatarIconId, verifiedProfession, professionTitle, tag = 'Testimonio', postType = 'comunidad' } = body;

    if (!uid || !text?.trim()) {
      return NextResponse.json({ success: false, error: 'Mensaje y UID son obligatorios' }, { status: 400 });
    }

    // Verificar si el usuario es realmente admin para permitir postType: 'institucional'
    let finalPostType = 'comunidad';
    if (postType === 'institucional') {
      const clientDoc = await adminDb.collection('clients').doc(uid).get();
      const isAdmin = clientDoc.exists && (clientDoc.data()?.role === 'admin' || clientDoc.data()?.isAdmin === true);
      if (isAdmin) {
        finalPostType = 'institucional';
      }
    }

    const newMessage = {
      uid,
      text: text.trim(),
      authorName: authorName || 'Miembro del Club',
      name: authorName || 'Miembro del Club',
      role: role || 'Voz del Club',
      photoUrl: photoUrl || null,
      avatarIconId: avatarIconId || null,
      verifiedProfession: Boolean(verifiedProfession),
      professionTitle: professionTitle || null,
      tag: tag || 'Testimonio',
      postType: finalPostType,
      likesCount: 0,
      likedBy: [],
      replies: [],
      isPublished: true,
      createdAt: FieldValue.serverTimestamp()
    };

    const docRef = await adminDb.collection('community_messages').add(newMessage);

    return NextResponse.json({
      success: true,
      id: docRef.id,
      message: newMessage
    });
  } catch (error) {
    console.error('[Messages POST] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ── PUT: Toggle de Reacción / Resonancia Botánica ────────────────────────────
export async function PUT(request) {
  try {
    const body = await request.json();
    const { messageId, uid } = body;

    if (!messageId || !uid) {
      return NextResponse.json({ success: false, error: 'Faltan parámetros (messageId, uid)' }, { status: 400 });
    }

    const messageRef = adminDb.collection('community_messages').doc(messageId);
    const snap = await messageRef.get();

    if (!snap.exists) {
      return NextResponse.json({ success: false, error: 'Mensaje no encontrado' }, { status: 404 });
    }

    const data = snap.data();
    const likedBy = Array.isArray(data.likedBy) ? data.likedBy : [];
    const hasLiked = likedBy.includes(uid);

    if (hasLiked) {
      // Quitar like
      await messageRef.update({
        likedBy: FieldValue.arrayRemove(uid),
        likesCount: FieldValue.increment(-1)
      });
    } else {
      // Agregar like
      await messageRef.update({
        likedBy: FieldValue.arrayUnion(uid),
        likesCount: FieldValue.increment(1)
      });
    }

    return NextResponse.json({
      success: true,
      hasLiked: !hasLiked,
      likesCount: hasLiked ? Math.max(0, (data.likesCount || 1) - 1) : (data.likesCount || 0) + 1
    });
  } catch (error) {
    console.error('[Messages Reaction] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ── PATCH: Agregar respuesta a un mensaje (Hilo de un nivel) ─────────────────
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { messageId, uid, authorName, text, avatarIconId, verifiedProfession } = body;

    if (!messageId || !uid || !text?.trim()) {
      return NextResponse.json({ success: false, error: 'Faltan parámetros requeridos' }, { status: 400 });
    }

    const replyObj = {
      id: `rep_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      uid,
      authorName: authorName || 'Miembro del Club',
      text: text.trim(),
      avatarIconId: avatarIconId || null,
      verifiedProfession: Boolean(verifiedProfession),
      createdAt: new Date().toISOString()
    };

    const messageRef = adminDb.collection('community_messages').doc(messageId);
    await messageRef.update({
      replies: FieldValue.arrayUnion(replyObj),
      updatedAt: FieldValue.serverTimestamp()
    });

    return NextResponse.json({
      success: true,
      reply: replyObj
    });
  } catch (error) {
    console.error('[Messages Reply] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
