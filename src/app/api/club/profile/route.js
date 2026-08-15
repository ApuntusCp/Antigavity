import { NextResponse } from 'next/server';
import { adminDb } from '../../../../utils/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const { uid, name, avatarType, avatarIconId } = body;

    if (!uid) {
      return NextResponse.json({ success: false, error: 'UID requerido' }, { status: 400 });
    }

    const updatePayload = {
      updatedAt: FieldValue.serverTimestamp()
    };

    if (typeof name === 'string' && name.trim()) {
      updatePayload.name = name.trim();
    }

    if (avatarType) {
      updatePayload.avatarType = avatarType; // 'upload' | 'icon' | 'letter'
    }

    if (avatarIconId) {
      updatePayload.avatarIconId = avatarIconId; // 'leaf' | 'droplet' | 'sun' | 'sparkle' | 'shield'
    }

    const clientRef = adminDb.collection('clients').doc(uid);
    await clientRef.set(updatePayload, { merge: true });

    return NextResponse.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      updated: updatePayload
    });

  } catch (error) {
    console.error('[Profile API] Error actualizando perfil:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
