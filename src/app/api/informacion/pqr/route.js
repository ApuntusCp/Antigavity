import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { tipo, nombre, email, telefono, numeroOrden, mensaje, ticketId } = body;

    console.log(`[PQR Radicada en Sistema] Ticket ${ticketId}:`, {
      tipo,
      nombre,
      email,
      fechaRadicado: new Date().toISOString(),
      plazoMaximoRespuesta: '15 días hábiles (Ley 1755 de 2015)'
    });

    return NextResponse.json({
      success: true,
      ticketId,
      message: 'PQR radicada exitosamente en el sistema de administración de GranColinos.',
      plazo_dias_habiles: 15
    });

  } catch (error) {
    console.error("Error al procesar PQR:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
