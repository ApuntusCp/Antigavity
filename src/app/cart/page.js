'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../components/CartContext';
import Link from 'next/link';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { cart, setIsCartOpen } = useCart();

  useEffect(() => {
    // Si hay productos en el carrito, redirigir a checkout o abrir drawer
    if (cart.length > 0) {
      router.replace('/checkout');
    } else {
      setIsCartOpen(true);
      router.replace('/shop');
    }
  }, [cart, router, setIsCartOpen]);

  return (
    <div className="min-h-screen bg-[#040903] flex items-center justify-center px-6">
      <div className="text-center max-w-md p-8 bg-black/40 border border-[#D4AF37]/30 rounded-2xl backdrop-blur-xl">
        <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] mx-auto mb-6">
          <ShoppingBag size={28} />
        </div>
        <h1 className="font-serif text-2xl text-white mb-3">Tu Carrito GranColinos</h1>
        <p className="text-gray-300 text-sm mb-6">Redirigiendo a tu proceso de compra segura...</p>
        <Link
          href="/shop"
          prefetch={false}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-widest rounded-full hover:bg-white transition-all shadow-lg"
        >
          <span>Ir a la Tienda</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
