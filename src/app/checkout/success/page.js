'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { db } from '../../../utils/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { CheckCircle, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!orderId) {
      router.push('/');
      return;
    }

    async function processSuccess() {
      try {
        const orderRef = doc(db, 'orders', orderId);
        const orderSnap = await getDoc(orderRef);

        if (orderSnap.exists()) {
          const orderData = orderSnap.data();
          setOrder(orderData);

          // Si la orden aún estaba pendiente, la actualizamos y notificamos
          if (orderData.status === 'pending_payment') {
            await updateDoc(orderRef, {
              status: 'paid'
            });

            // Actualizar también en carts para GC Admin
            const cartRef = doc(db, 'carts', orderId);
            await updateDoc(cartRef, {
              status: 'paid'
            }).catch(console.warn);

            // Enviar notificación a Telegram
            await fetch('/api/notify/order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: orderData.customer.name,
                total: orderData.total,
                city: orderData.customer.city
              })
            }).catch(console.warn);
          }
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error processing success:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    processSuccess();
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 size={48} className="text-brand-gold animate-spin mb-4" />
        <h2 className="text-white font-playfair text-2xl">Verificando tu pago...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-red-500 font-playfair text-3xl mb-4">Error al verificar la orden</h2>
        <p className="text-gray-400 mb-8 max-w-md">No pudimos encontrar tu orden o hubo un problema de conexión. Si tu pago fue debitado, por favor contáctanos.</p>
        <Link href="/" className="px-8 py-3 bg-white text-black font-bold uppercase tracking-widest text-xs rounded hover:bg-brand-gold transition-colors">
          Volver al Inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-8 border border-green-500/50 shadow-[0_0_50px_rgba(34,197,94,0.3)]">
        <CheckCircle size={48} className="text-green-500" />
      </div>
      
      <h1 className="text-white font-playfair text-4xl mb-4">¡Pago Exitoso!</h1>
      <p className="text-gray-400 mb-2 text-lg">Gracias por tu compra, <span className="text-white font-bold">{order?.customer?.name}</span>.</p>
      <p className="text-gray-500 text-sm mb-12 max-w-lg leading-relaxed">
        Hemos recibido tu pago por <strong className="text-brand-gold">{new Intl.NumberFormat('es-CO', {style: 'currency', currency: 'COP', maximumFractionDigits: 0}).format(order?.total || 0)}</strong>.
        Tu pedido ya está siendo procesado para envío hacia <strong className="text-white">{order?.customer?.city}</strong>.
      </p>

      <div className="flex gap-4">
        <Link href="/shop" className="px-8 py-4 bg-brand-gold text-black font-bold uppercase tracking-widest text-xs rounded hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)]">
          Seguir Comprando
        </Link>
        <Link href="/" className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold uppercase tracking-widest text-xs rounded hover:bg-white/5 transition-all flex items-center gap-2">
          Volver al Inicio <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-12">
      <Suspense fallback={<div className="text-center py-20 text-brand-gold"><Loader2 size={40} className="animate-spin mx-auto" /></div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
