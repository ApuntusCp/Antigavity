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
    const { name, email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Por favor ingresa un correo electrónico válido' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanName = (name || cleanEmail.split('@')[0] || 'Miembro del Club').trim();

    // 1. Verificar si el email ya existe en la colección clients
    const clientsRef = adminDb.collection('clients');
    const existingSnap = await clientsRef.where('email', '==', cleanEmail).limit(1).get();

    if (!existingSnap.empty) {
      const existingData = existingSnap.docs[0].data();
      return NextResponse.json({
        success: false,
        exists: true,
        couponCode: existingData.couponCode || null,
        message: 'Este correo electrónico ya está registrado en nuestro Club.'
      });
    }

    // 2. Generar y guardar cupón de bienvenida en 'coupons'
    const couponCode = generateCouponCode();
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

    // 3. Guardar cliente en 'clients' para GC Admin CRM
    const newClientDoc = clientsRef.doc();
    await newClientDoc.set({
      uid: newClientDoc.id,
      name: cleanName,
      email: cleanEmail,
      couponCode: couponCode,
      vipLevel: 'Bronce',
      ecoPoints: 50,
      purchaseCount: 0,
      source: 'Newsletter Club',
      role: 'lead',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    });

    // 4. Notificar a GC Admin
    try {
      await adminDb.collection('notifications').add({
        title: '🎁 Nuevo Registro al Club (10% OFF)',
        message: `${cleanName} (${cleanEmail}) se ha suscrito al Club y recibió el cupón ${couponCode}.`,
        type: 'club_join',
        clientEmail: cleanEmail,
        clientName: cleanName,
        couponCode: couponCode,
        read: false,
        timestamp: new Date(),
        createdAt: FieldValue.serverTimestamp()
      });
    } catch (notifErr) {
      console.warn('[Join API] No se pudo crear notificación para GC Admin:', notifErr.message);
    }

    return NextResponse.json({
      success: true,
      couponCode,
      message: '¡Bienvenido al Club! Tu cupón ha sido generado exitosamente.'
    });

  } catch (error) {
    console.error('[Join API] Error al registrar en el Club:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
