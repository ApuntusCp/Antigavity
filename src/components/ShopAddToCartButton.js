'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCart } from './CartContext';
import { ShoppingCart, Check } from 'lucide-react';

export default function ShopAddToCartButton({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const timerRef = useRef(null);

  // Limpiar timeout si el componente se desmonta (memory leak fix)
  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // addToCart() ya muestra el toast internamente en CartContext
    // No duplicar el toast aquí
    addToCart(product, 1);
    setAdded(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setAdded(false);
    }, 1800);
  };

  return (
    <button
      onClick={handleAdd}
      aria-label={`Añadir ${product.name || product.title || 'producto'} al carrito`}
      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${
        added
          ? 'bg-green-600 text-white shadow-[0_0_15px_rgba(76,175,80,0.5)]'
          : 'bg-[#1E3314] text-[#D4AF37] border border-white/15 hover:bg-[#D4AF37] hover:text-black hover:border-transparent shadow-md'
      }`}
    >
      {added ? (
        <>
          <Check size={16} /> ¡Añadido!
        </>
      ) : (
        <>
          <ShoppingCart size={16} /> Añadir al Carrito
        </>
      )}
    </button>
  );
}

