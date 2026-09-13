import { NextResponse } from 'next/server';
import { adminDb } from '../../../../utils/firebase-admin';

export async function POST(request) {
  try {
    const body = await request.json();
    const { tipo, nombre, email, telefono, numeroOrden, mensaje } = body;

    // Validar campos obligatorios y tipos
    if (!nombre || typeof nombre !== 'string' || !email || typeof email !== 'string' || !mensaje || typeof mensaje !== 'string') {
      return NextResponse.json({ success: false, error: 'Faltan campos obligatorios o formato inválido' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ success: false, error: 'Dirección de correo electrónico no válida' }, { status: 400 });
    }

    // Sanitizar inputs
    const cleanNombre = nombre.trim().slice(0, 100).replace(/[<>]/g, '');
    const cleanEmail = email.trim().toLowerCase().slice(0, 100);
    const cleanTelefono = typeof telefono === 'string' ? telefono.trim().slice(0, 30) : '';
    const cleanNumeroOrden = typeof numeroOrden === 'string' ? numeroOrden.trim().slice(0, 50) : '';
    const cleanMensaje = mensaje.trim().slice(0, 2000).replace(/[<>]/g, '');
    const cleanTipo = typeof tipo === 'string' ? tipo.trim().slice(0, 50) : 'Petición';

    const safeTicketId = `PQR-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // ── Guardar en Firestore ──────────────────────────────────────────────────
    await adminDb.collection('pqrs').add({
      ticketId: safeTicketId,
      tipo: cleanTipo,
      nombre: cleanNombre,
      email: cleanEmail,
      telefono: cleanTelefono,
      numeroOrden: cleanNumeroOrden,
      mensaje: cleanMensaje,
      estado: 'pendiente',
      fechaRadicado: new Date(),
      plazoMaximoRespuesta: '15 días hábiles (Ley 1755 de 2015)'
    });

    return NextResponse.json({
      success: true,
      ticketId: safeTicketId,
      message: 'PQR radicada exitosamente en el sistema de administración de GranColinos.',
      plazo_dias_habiles: 15
    });

  } catch (error) {
    console.error('[PQR] Error al procesar:', error);
    return NextResponse.json({ success: false, error: 'Error interno al procesar la solicitud' }, { status: 500 });
  }
}
