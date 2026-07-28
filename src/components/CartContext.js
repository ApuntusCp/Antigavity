'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('gc_cart');
    if (savedCart) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error loading cart:", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when cart changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('gc_cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const addToCart = (product, quantity = 1) => {
    // ── Toast FUERA del state updater ───────────────────────────────────────
    // En React 18 Strict Mode los updaters se ejecutan 2 veces (para detectar
    // side effects). Poner toast aquí previene notificaciones duplicadas.
    let isUpdate = false;
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex(
        (item) => item.id === product.id || item.sku === product.sku
      );

      if (existingProductIndex >= 0) {
        isUpdate = true;
        const newCart = [...prevCart];
        newCart[existingProductIndex] = {
          ...newCart[existingProductIndex],
          quantity: newCart[existingProductIndex].quantity + quantity,
        };
        return newCart;
      } else {
        return [...prevCart, { ...product, quantity }];
      }
    });
    // Mostrar toast después del setState, no dentro
    toast.success(isUpdate ? 'Cantidad actualizada' : 'Añadido al carrito');
    setIsCartOpen(true);
  };

  const removeFromCart = (idOrSku) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== idOrSku && item.sku !== idOrSku));
  };

  const updateQuantity = (idOrSku, newQuantity) => {
    if (newQuantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        (item.id === idOrSku || item.sku === idOrSku) ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Guard contra NaN: si price/discountPrice es undefined o no numérico, usa 0
  const cartTotal = cart.reduce((total, item) => {
    const price = Number(item.discountPrice || item.price) || 0;
    const qty = Number(item.quantity) || 0;
    return total + (price * qty);
  }, 0);
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartItemCount,
        isCartOpen,
        setIsCartOpen,
        isLoaded
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
