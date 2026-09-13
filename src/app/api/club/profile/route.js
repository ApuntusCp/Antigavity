import { NextResponse } from 'next/server';
import { adminDb } from '../../../../utils/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { authenticateRequest } from '../../../../utils/auth-server';

export const dynamic = 'force-dynamic';

const ALLOWED_AVATAR_TYPES = ['upload', 'icon', 'letter'];
const ALLOWED_AVATAR_ICONS = ['leaf', 'droplet', 'sun', 'sparkle', 'shield'];

export async function POST(request) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth) {
      return NextResponse.json({ success: false, error: 'No autorizado. Se requiere iniciar sesión.' }, { status: 401 });
    }

    const body = await request.json();
    const { uid, name, avatarType, avatarIconId } = body;

    if (!uid || typeof uid !== 'string') {
      return NextResponse.json({ success: false, error: 'UID inválido' }, { status: 400 });
    }

    // Aislamiento: solo el dueño de la cuenta o un admin puede modificar el perfil
    if (!auth.isAdmin && auth.uid !== uid) {
      return NextResponse.json({ success: false, error: 'Acceso denegado: no puedes modificar otros perfiles.' }, { status: 403 });
    }

    const updatePayload = {
      updatedAt: FieldValue.serverTimestamp()
    };

    if (typeof name === 'string' && name.trim()) {
      const sanitizedName = name.trim().slice(0, 60);
      updatePayload.name = sanitizedName;
    }

    if (avatarType && ALLOWED_AVATAR_TYPES.includes(avatarType)) {
      updatePayload.avatarType = avatarType;
    }

    if (avatarIconId && ALLOWED_AVATAR_ICONS.includes(avatarIconId)) {
      updatePayload.avatarIconId = avatarIconId;
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
    return NextResponse.json({ success: false, error: 'Error interno al actualizar el perfil' }, { status: 500 });
  }
}
