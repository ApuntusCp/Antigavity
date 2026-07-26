'use client';

import React, { useState } from 'react';
import { useCart } from './CartContext';
import { ShoppingCart, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ShopAddToCartButton({ product }) {
  const { addToCart, setIsCartOpen } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    toast.success(`${product.name || product.title} añadido al carrito`, {
      style: {
        background: '#0A1408',
        color: '#D4AF37',
        border: '1px solid rgba(212, 175, 55, 0.4)',
      },
      iconTheme: {
        primary: '#D4AF37',
        secondary: '#0A1408',
      },
    });
    setTimeout(() => {
      setAdded(false);
    }, 1800);
  };

  return (
    <button
      onClick={handleAdd}
      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${
        added
          ? 'bg-green-600 text-white shadow-[0_0_15px_rgba(76,175,80,0.5)]'
          : 'bg-[#1E3314] text-[#D4AF37] border border-[#D4AF37]/40 hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.2)]'
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
