'use client';

import { useCart } from "./CartContext";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, cartTotal } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />
      
      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-brand-light dark:bg-[#0a0a0a] shadow-2xl z-50 flex flex-col border-l border-gray-200 dark:border-white/10 transform transition-transform duration-500">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-white/10 shrink-0">
          <h2 className="font-playfair text-xl text-brand-dark dark:text-white flex items-center gap-2">
            <ShoppingBag size={20} className="text-brand-gold" />
            Tu Carrito Exclusivo
          </h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors text-gray-500 hover:text-brand-gold"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400">
                <ShoppingBag size={32} />
              </div>
              <div>
                <p className="text-gray-500 font-light mb-2">Tu carrito está vacío.</p>
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-brand-gold">Descubre nuestro bienestar premium</p>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="px-8 py-3 bg-brand-dark text-white text-xs font-bold tracking-widest uppercase hover:bg-brand-gold hover:text-brand-dark transition-colors"
              >
                Volver al Catálogo
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={item.sku} className="flex gap-4 group">
                  {/* Item Image */}
                  <div className="w-20 h-24 bg-gray-100 dark:bg-gray-800 relative shrink-0">
                    {item.images && item.images.length > 0 ? (
                      <Image 
                        src={item.images[0]} 
                        alt={item.title || item.name} 
                        fill 
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-brand-dark border border-white/5" />
                    )}
                  </div>
                  
                  {/* Item Details */}
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h3 className="font-playfair text-brand-dark dark:text-white line-clamp-1">{item.title || item.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          {item.discountPrice ? (
                            <>
                              <span className="text-gray-500 text-xs tracking-wider font-mono line-through opacity-70">
                                {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(item.price)}
                              </span>
                              <span className="text-red-400 text-sm tracking-wider font-mono font-bold">
                                {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(item.discountPrice)}
                              </span>
                            </>
                          ) : (
                            <span className="text-brand-gold text-sm tracking-wider font-mono">
                              {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(item.price)}
                            </span>
                          )}
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.sku)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center border border-gray-200 dark:border-white/10 rounded-sm">
                        <button 
                          onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                          className="px-3 py-1 text-gray-500 hover:text-brand-gold transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-mono">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                          className="px-3 py-1 text-gray-500 hover:text-brand-gold transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-6 py-6 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-brand-dark shrink-0">
            <div className="flex justify-between items-end mb-6">
              <span className="text-gray-500 text-xs font-bold tracking-[0.2em] uppercase">Subtotal</span>
              <span className="font-playfair text-2xl text-brand-gold">
                {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(cartTotal)}
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-6 font-light">El envío y los impuestos se calculan en el checkout.</p>
            
            <Link href="/checkout" onClick={() => setIsCartOpen(false)}>
              <button className="w-full py-4 bg-brand-gold text-brand-dark text-sm font-bold tracking-[0.2em] uppercase hover:bg-white transition-all shadow-[0_0_30px_rgba(212,175,55,0.15)] hover:scale-[1.02]">
                Finalizar Compra
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
