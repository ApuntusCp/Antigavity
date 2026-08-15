import { NextResponse } from 'next/server';
import { adminDb } from '../../../../utils/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';

function generateCouponCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'GC-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { uid, name, email, source = 'Club Registro' } = body;

    if (!uid || !email) {
      return NextResponse.json(
        { success: false, error: 'Faltan parámetros requeridos (uid, email)' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanName = (name || cleanEmail.split('@')[0] || 'Miembro del Club').trim();

    // 1. Verificar si el cliente ya existe para mantener datos existentes si aplica
    const clientRef = adminDb.collection('clients').doc(uid);
    const clientSnap = await clientRef.get();

    let couponCode = '';

    if (clientSnap.exists && clientSnap.data()?.couponCode) {
      couponCode = clientSnap.data().couponCode;
    } else {
      // 2. Generar y guardar cupón de bienvenida único (10% OFF)
      couponCode = generateCouponCode();
      
      const couponRef = adminDb.collection('coupons').doc(couponCode);
      await couponRef.set({
        code: couponCode,
        type: 'PERCENTAGE',
        value: 10,
        maxUses: 1,
        usedCount: 0,
        active: true,
        isWelcomeCoupon: true,
        assignedTo: cleanEmail,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      });
    }

    // 3. Crear / Actualizar perfil en CRM 'clients' para GC Admin
    const clientPayload = {
      uid: uid,
      name: cleanName,
      email: cleanEmail,
      couponCode: couponCode,
      vipLevel: clientSnap.exists ? (clientSnap.data()?.vipLevel || 'Bronce') : 'Bronce',
      ecoPoints: clientSnap.exists ? (clientSnap.data()?.ecoPoints ?? 50) : 50,
      purchaseCount: clientSnap.exists ? (clientSnap.data()?.purchaseCount ?? 0) : 0,
      source: source,
      role: 'member',
      updatedAt: FieldValue.serverTimestamp()
    };

    if (!clientSnap.exists) {
      clientPayload.createdAt = FieldValue.serverTimestamp();
    }

    await clientRef.set(clientPayload, { merge: true });

    // 4. Crear notificación en tiempo real para GC Admin
    try {
      await adminDb.collection('notifications').add({
        title: '🎉 ¡Nuevo Miembro en el Club!',
        message: `${cleanName} (${cleanEmail}) se ha unido al Club Gran Colinos.`,
        type: 'member_registered',
        clientUid: uid,
        clientEmail: cleanEmail,
        clientName: cleanName,
        couponCode: couponCode,
        read: false,
        timestamp: new Date(),
        createdAt: FieldValue.serverTimestamp()
      });
    } catch (notifErr) {
      console.warn('[Register API] No se pudo crear notificación para GC Admin:', notifErr.message);
    }

    return NextResponse.json({
      success: true,
      couponCode,
      client: {
        uid,
        name: cleanName,
        email: cleanEmail,
        vipLevel: clientPayload.vipLevel,
        ecoPoints: clientPayload.ecoPoints,
        couponCode
      }
    });

  } catch (error) {
    console.error('[Register API] Error al registrar cliente en el Club:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
