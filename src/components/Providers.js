'use client';

import { CartProvider } from './CartContext';
import { AuthProvider } from './AuthProvider';
import { Toaster } from 'react-hot-toast';
import ServiceWorkerCleaner from './ServiceWorkerCleaner';

export default function Providers({ children }) {
  return (
    <CartProvider>
      <ServiceWorkerCleaner />
      <Toaster 
        position="top-center"
        toastOptions={{
          className: 'font-mono text-xs uppercase tracking-widest',
          style: {
            background: '#0a0a0a',
            color: '#fff',
            border: '1px solid rgba(212,175,55,0.3)',
            borderRadius: '2px',
          },
          success: {
            iconTheme: {
              primary: '#D4AF37',
              secondary: '#0a0a0a',
            },
          },
        }}
      />
      <AuthProvider>
        {children}
      </AuthProvider>
    </CartProvider>
  );
}
