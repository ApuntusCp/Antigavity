import { NextResponse } from 'next/server';
import { adminDb } from '../../../../utils/firebase-admin';

export async function POST(request) {
  try {
    const body = await request.json();
    const { tipo, nombre, email, telefono, numeroOrden, mensaje, ticketId } = body;

    // Validar campos obligatorios
    if (!nombre || !email || !mensaje) {
      return NextResponse.json({ success: false, error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    // ── Guardar en Firestore (antes solo se logueaba, datos se perdían) ──────
    // Sin esto, los clientes recibían un "éxito" falso y sus solicitudes se perdían
    await adminDb.collection('pqrs').add({
      ticketId: ticketId || `PQR-${Date.now()}`,
      tipo: tipo || 'Petición',
      nombre,
      email,
      telefono: telefono || '',
      numeroOrden: numeroOrden || '',
      mensaje,
      estado: 'pendiente',
      fechaRadicado: new Date(),
      plazoMaximoRespuesta: '15 días hábiles (Ley 1755 de 2015)'
    });

    return NextResponse.json({
      success: true,
      ticketId,
      message: 'PQR radicada exitosamente en el sistema de administración de GranColinos.',
      plazo_dias_habiles: 15
    });

  } catch (error) {
    console.error('[PQR] Error al procesar:', error);
    return NextResponse.json({ success: false, error: 'Error interno al procesar la solicitud' }, { status: 500 });
  }
}
