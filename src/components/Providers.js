'use client';

import { CartProvider } from './CartContext';

export default function Providers({ children }) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
}
