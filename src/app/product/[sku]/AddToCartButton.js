'use client';

import { useCart } from '../../../components/CartContext';

export default function AddToCartButton({ product }) {
  const { addToCart } = useCart();

  return (
    <button 
      onClick={() => addToCart(product)}
      disabled={product.stock <= 0}
      className={`w-full py-5 flex items-center justify-center gap-3 text-brand-dark text-sm font-bold uppercase tracking-widest transition-all rounded-sm shadow-[0_0_30px_rgba(212,175,55,0.2)] ${product.stock > 0 ? 'bg-brand-gold hover:bg-white hover:scale-[1.02]' : 'bg-gray-700 opacity-50 cursor-not-allowed text-gray-400'}`}
    >
      {product.stock > 0 ? 'Añadir al Carrito' : 'Sin Stock'}
    </button>
  );
}
