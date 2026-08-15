import { NextResponse } from 'next/server';
import { adminDb } from '../../../../utils/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const { uid, points, type, reason } = body;

    if (!uid || points === undefined) {
      return NextResponse.json({ success: false, error: 'UID y puntos son obligatorios' }, { status: 400 });
    }

    const pointsNum = Number(points);
    if (isNaN(pointsNum)) {
      return NextResponse.json({ success: false, error: 'Puntos inválidos' }, { status: 400 });
    }

    // 1. Registrar auditoría Nivel 2
    const logDoc = await adminDb.collection('eco_points_log').add({
      uid,
      points: pointsNum,
      type: type || 'custom_grant',
      reason: reason || 'Ajuste de puntos en Club Gran Colinos',
      reversible: true,
      timestamp: new Date(),
      createdAt: FieldValue.serverTimestamp()
    });

    // 2. Actualizar cliente y calcular rango
    const clientRef = adminDb.collection('clients').doc(uid);
    const clientSnap = await clientRef.get();

    let newTotal = pointsNum;
    if (clientSnap.exists) {
      const current = clientSnap.data()?.ecoPoints || 0;
      newTotal = Math.max(0, current + pointsNum);
    }

    // Umbrales: Bronce (0-199), Plata (200-499), Oro (500+)
    let newVipLevel = 'Bronce';
    if (newTotal >= 500) newVipLevel = 'Oro';
    else if (newTotal >= 200) newVipLevel = 'Plata';

    await clientRef.set({
      ecoPoints: newTotal,
      vipLevel: newVipLevel,
      updatedAt: FieldValue.serverTimestamp()
    }, { merge: true });

    return NextResponse.json({
      success: true,
      auditId: logDoc.id,
      ecoPoints: newTotal,
      vipLevel: newVipLevel
    });

  } catch (error) {
    console.error('[Points Log API] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
