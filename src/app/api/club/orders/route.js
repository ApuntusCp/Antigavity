import { NextResponse } from 'next/server';
import { adminDb } from '../../../../utils/firebase-admin';
import { authenticateRequest } from '../../../../utils/auth-server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth) {
      return NextResponse.json({ success: false, error: 'No autorizado. Se requiere iniciar sesión.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const reqUid = searchParams.get('uid');
    const reqEmail = searchParams.get('email');

    // Aislamiento: si no es admin, solo puede consultar sus propios pedidos
    const targetUid = auth.isAdmin ? (reqUid || auth.uid) : auth.uid;
    const targetEmail = auth.isAdmin ? reqEmail : auth.email;

    const ordersMap = new Map();

    // Query by userId if provided
    if (targetUid) {
      const snapUid = await adminDb.collection('orders')
        .where('userId', '==', targetUid)
        .orderBy('createdAt', 'desc')
        .limit(20)
        .get();

      snapUid.forEach(doc => {
        ordersMap.set(doc.id, { id: doc.id, ...doc.data() });
      });
    }

    // Query by customer email if provided
    if (targetEmail) {
      const snapEmail = await adminDb.collection('orders')
        .where('customer.email', '==', targetEmail.toLowerCase().trim())
        .limit(20)
        .get();

      snapEmail.forEach(doc => {
        if (!ordersMap.has(doc.id)) {
          ordersMap.set(doc.id, { id: doc.id, ...doc.data() });
        }
      });
    }

    const orders = Array.from(ordersMap.values()).map(o => ({
      id: o.id,
      total: o.total || 0,
      status: o.status || 'pending_payment',
      itemsCount: Array.isArray(o.items) ? o.items.length : 0,
      items: (o.items || []).map(item => ({
        name: item.name || item.title || 'Producto GC',
        price: item.price || 0,
        quantity: item.quantity || 1,
        sku: item.sku || ''
      })),
      createdAt: o.createdAt ? (o.createdAt.toDate ? o.createdAt.toDate().toISOString() : o.createdAt) : null
    }));

    orders.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    return NextResponse.json({ success: true, count: orders.length, orders });
  } catch (error) {
    console.error('[Orders API] Error fetching client orders:', error);
    return NextResponse.json({ success: false, error: 'Error al consultar pedidos' }, { status: 500 });
  }
}
