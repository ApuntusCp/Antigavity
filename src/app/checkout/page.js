'use client';

import { useState, useEffect } from 'react';
import { useCart } from '../../components/CartContext';
import { db } from '../../utils/firebase';
import { collection, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { ShieldCheck, ArrowRight, Truck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const SHIPPING_COST = 15000; // Tarifa fija nacional
  const grandTotal = cartTotal + SHIPPING_COST;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    department: '',
  });

  // Si el carrito está vacío, regresar a la tienda
  useEffect(() => {
    if (cart.length === 0) {
      router.push('/shop');
    }
  }, [cart, router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        customer: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          department: formData.department,
        },
        items: cart.map(item => ({
          sku: item.sku,
          name: item.name || item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.images?.[0] || ''
        })),
        subtotal: cartTotal,
        shippingCost: SHIPPING_COST,
        total: grandTotal,
        status: 'pending_payment',
        paymentGateway: 'bold',
        createdAt: serverTimestamp(),
      };

      // 1. Guardar la orden en Firebase (Colección 'orders')
      const orderRef = await addDoc(collection(db, 'orders'), orderData);
      
      // 2. Registrar/Actualizar en 'carts' para GC Admin
      await setDoc(doc(db, 'carts', orderRef.id), {
        customerName: orderData.customer.name,
        customerEmail: orderData.customer.email,
        customerPhone: orderData.customer.phone,
        items: orderData.items,
        total: grandTotal,
        status: 'active', // 'active' hasta que Bold confirme el pago (en un webhook real)
        updatedAt: serverTimestamp()
      });

      // 3. Iniciar Widget de Bold
      if (typeof window.BoldCheckout !== 'undefined') {
        const checkout = new window.BoldCheckout({
          orderId: orderRef.id,
          currency: "COP",
          amount: grandTotal,
          apiKey: process.env.NEXT_PUBLIC_BOLD_INTEGRATION_ID,
          redirectionUrl: `${window.location.origin}/`,
          payerEmail: orderData.customer.email,
          payerPhone: orderData.customer.phone,
          payerName: orderData.customer.name,
        });

        checkout.open();
        clearCart();
      } else {
        alert("El sistema de pagos se está cargando o no está disponible. Por favor intenta de nuevo.");
      }

    } catch (error) {
      console.error("Error procesando checkout:", error);
      alert("Hubo un error procesando tu pedido. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) return null; // Evitar render mientras redirige

  return (
    <>
    <Script src="https://checkout.bold.co/v2/bold.js" strategy="lazyOnload" />
    <div className="min-h-screen bg-brand-light dark:bg-[#050505] text-brand-dark dark:text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex items-center gap-4 text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-12">
          <Link href="/cart" className="hover:text-brand-gold transition-colors">Carrito</Link>
          <ArrowRight size={14} />
          <span className="text-brand-gold">Checkout Seguro</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Formulario de Datos */}
          <div className="w-full lg:w-3/5">
            <h1 className="font-playfair text-3xl mb-8">Información de Envío</h1>
            
            <form id="checkout-form" onSubmit={handleCheckout} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-gray-500">Nombre</label>
                  <input required name="firstName" value={formData.firstName} onChange={handleChange} type="text" className="w-full bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 p-4 rounded-sm outline-none focus:border-brand-gold transition-colors text-sm" placeholder="Tu nombre" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-gray-500">Apellido</label>
                  <input required name="lastName" value={formData.lastName} onChange={handleChange} type="text" className="w-full bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 p-4 rounded-sm outline-none focus:border-brand-gold transition-colors text-sm" placeholder="Tu apellido" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest uppercase text-gray-500">Correo Electrónico</label>
                <input required name="email" value={formData.email} onChange={handleChange} type="email" className="w-full bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 p-4 rounded-sm outline-none focus:border-brand-gold transition-colors text-sm" placeholder="correo@ejemplo.com" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest uppercase text-gray-500">Teléfono / Celular</label>
                <input required name="phone" value={formData.phone} onChange={handleChange} type="tel" className="w-full bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 p-4 rounded-sm outline-none focus:border-brand-gold transition-colors text-sm" placeholder="300 000 0000" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest uppercase text-gray-500">Dirección de Entrega</label>
                <input required name="address" value={formData.address} onChange={handleChange} type="text" className="w-full bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 p-4 rounded-sm outline-none focus:border-brand-gold transition-colors text-sm" placeholder="Calle, Carrera, Apto, Barrio" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-gray-500">Ciudad</label>
                  <input required name="city" value={formData.city} onChange={handleChange} type="text" className="w-full bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 p-4 rounded-sm outline-none focus:border-brand-gold transition-colors text-sm" placeholder="Ej: Bogotá" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-gray-500">Departamento</label>
                  <input required name="department" value={formData.department} onChange={handleChange} type="text" className="w-full bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 p-4 rounded-sm outline-none focus:border-brand-gold transition-colors text-sm" placeholder="Ej: Cundinamarca" />
                </div>
              </div>
            </form>
          </div>

          {/* Resumen de Orden */}
          <div className="w-full lg:w-2/5">
            <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 p-8 rounded-sm sticky top-32">
              <h2 className="font-playfair text-2xl mb-6">Resumen del Pedido</h2>
              
              <div className="space-y-4 mb-6">
                {cart.map(item => (
                  <div key={item.sku} className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 relative rounded-sm overflow-hidden border border-white/5 shrink-0">
                      {item.images?.[0] && (
                        <Image src={item.images[0]} alt={item.title || item.name} fill className="object-cover" />
                      )}
                      <div className="absolute -top-2 -right-2 bg-brand-gold text-brand-dark w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold z-10">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium line-clamp-1">{item.title || item.name}</h4>
                      <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-mono">
                        {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(item.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-white/10 pt-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-mono">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Envío Nacional</span>
                  <span className="font-mono">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(SHIPPING_COST)}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-white/10 mt-6 pt-6 flex justify-between items-end">
                <span className="text-xs font-bold tracking-widest uppercase">Total</span>
                <span className="font-playfair text-3xl text-brand-gold">
                  {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(grandTotal)}
                </span>
              </div>

              <button 
                form="checkout-form"
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-brand-gold text-brand-dark text-sm font-bold uppercase tracking-widest hover:bg-white transition-all rounded-sm shadow-[0_0_30px_rgba(212,175,55,0.2)] mt-8 flex items-center justify-center gap-2"
              >
                {loading ? 'Procesando...' : (
                  <>
                    <ShieldCheck size={18} />
                    Pagar con Bold
                  </>
                )}
              </button>

              <div className="mt-6 flex flex-col gap-3 text-center text-[10px] text-gray-500 tracking-widest uppercase">
                <p className="flex items-center justify-center gap-2"><ShieldCheck size={14} className="text-brand-gold"/> Pagos 100% Seguros</p>
                <p className="flex items-center justify-center gap-2"><Truck size={14} className="text-brand-gold"/> Envíos protegidos a toda Colombia</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
    </>
  );
}
