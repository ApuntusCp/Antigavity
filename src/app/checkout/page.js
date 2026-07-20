'use client';

import { useState, useEffect } from 'react';
import { useCart } from '../../components/CartContext';
import { db } from '../../utils/firebase';
import { collection, addDoc, serverTimestamp, doc, setDoc, getDoc, updateDoc, increment, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../../components/AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, Truck, Lock, Eye, EyeOff, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user, register, login } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authPassword, setAuthPassword] = useState('');
  const [showAuthPassword, setShowAuthPassword] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(false);
  
  // Base shipping cost (fetched from Firestore)
  const [baseShippingCost, setBaseShippingCost] = useState(15000);
  
  // Estados para cupón
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState({ type: 'NONE', value: 0 });
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Lógica de Envío Gratis
  const purchaseCount = user?.customProfile?.purchaseCount || 0;
  const SHIPPING_COST = (user && purchaseCount >= 1) ? 0 : baseShippingCost;
  
  const discountAmount = discount.type === 'PERCENTAGE' ? cartTotal * (discount.value / 100) : (discount.type === 'FIXED' ? discount.value : 0);
  const grandTotal = Math.max(0, cartTotal - discountAmount + SHIPPING_COST);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
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

  // Fetch dynamic shipping cost from Firestore (Realtime)
  useEffect(() => {
    const docRef = doc(db, 'settings', 'shipping');
    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists() && typeof snap.data().cost === 'number') {
        setBaseShippingCost(snap.data().cost);
      }
    }, (error) => {
      console.error("Error fetching shipping cost in realtime:", error);
    });
    
    return () => unsubscribe();
  }, []);

  // Autocompletar email si el usuario ya está logueado
  useEffect(() => {
    if (user?.email && !formData.email) {
      setFormData(prev => ({ ...prev, email: user.email }));
    }
  }, [user, formData.email]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplyCoupon = async () => {
    setCouponError('');
    setCouponSuccess('');
    
    const code = couponCode.toUpperCase().trim();
    if (!code) return;
    
    try {
      const docRef = doc(db, 'coupons', code);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const couponData = snap.data();
        if (!couponData.active) {
          setCouponError('El cupón está inactivo.');
          setDiscount({ type: 'NONE', value: 0 });
          return;
        }
        if (couponData.minPurchase && cartTotal < couponData.minPurchase) {
          setCouponError(`Compra mínima de $${couponData.minPurchase.toLocaleString()} requerida.`);
          setDiscount({ type: 'NONE', value: 0 });
          return;
        }
        if (couponData.maxUses && couponData.usedCount >= couponData.maxUses) {
          setCouponError('El cupón ha alcanzado su límite de usos.');
          setDiscount({ type: 'NONE', value: 0 });
          return;
        }
        
        setDiscount({ type: couponData.type, value: couponData.value });
        setCouponSuccess(`Cupón ${code} aplicado (${couponData.type === 'PERCENTAGE' ? couponData.value + '%' : '$' + couponData.value.toLocaleString()} de descuento)`);
      } else {
         setCouponError('Cupón inválido o no encontrado.');
         setDiscount({ type: 'NONE', value: 0 });
      }
    } catch (e) {
      console.error(e);
      setCouponError('Error al validar el cupón.');
      setDiscount({ type: 'NONE', value: 0 });
    }
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    // Si no hay usuario logueado, mostramos el modal para ofrecer envío gratis
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    // Si ya está logueado, procesamos directamente
    processCheckout(user.uid, user.email);
  };

  const handleRegisterAndCheckout = async () => {
    if (authPassword.length < 6) return alert("La contraseña debe tener al menos 6 caracteres.");
    setRegistering(true);
    try {
      let newUser;
      
      if (isLoginMode) {
        // Iniciar Sesión
        const userCredential = await login(formData.email, authPassword);
        newUser = userCredential.user;
      } else {
        // Registro
        const userCredential = await register(formData.email, authPassword);
        newUser = userCredential.user;
        
        // Crear el perfil del cliente solo en registro
        await setDoc(doc(db, 'clients', newUser.uid), {
          uid: newUser.uid,
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email.toLowerCase().trim(),
          source: 'Checkout',
          purchaseCount: 0,
          createdAt: serverTimestamp()
        });
      }
      
      await processCheckout(newUser.uid, formData.email);
    } catch (e) {
      if (e.code === 'auth/invalid-credential' || e.code === 'auth/wrong-password') {
        alert("Contraseña incorrecta o usuario no encontrado.");
      } else if (e.code === 'auth/email-already-in-use') {
        alert("Este correo ya está registrado. Por favor, selecciona 'Ya tengo cuenta' para iniciar sesión.");
        setIsLoginMode(true);
      } else {
        alert("Error: " + e.message);
      }
    } finally {
      setRegistering(false);
      setShowAuthModal(false);
    }
  };

  const handleGuestCheckout = () => {
    setShowAuthModal(false);
    processCheckout(null, formData.email);
  };

  const processCheckout = async (userId = null, payerEmail = null) => {
    setLoading(true);

    try {
      const finalEmail = payerEmail || formData.email;
      const orderData = {
        customer: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: finalEmail,
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
        discountApplied: discountAmount,
        couponCode: discount.value > 0 ? couponCode.toUpperCase().trim() : null,
        total: grandTotal,
        status: 'pending_payment',
        paymentGateway: 'bold',
        createdAt: serverTimestamp(),
        userId: userId // Vinculamos la orden al usuario si existe
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
        status: 'active',
        updatedAt: serverTimestamp()
      });

      // 3. Incrementar el contador de compras del usuario (si está registrado)
      if (userId) {
        try {
          await updateDoc(doc(db, 'clients', userId), {
            purchaseCount: increment(1)
          });
        } catch (e) {
          console.warn("Could not increment purchase count", e);
        }
      }

      // 4. Incrementar el contador de uso del cupón (si aplica)
      if (discount.value > 0 && couponCode) {
        try {
          await updateDoc(doc(db, 'coupons', couponCode.toUpperCase().trim()), {
            usedCount: increment(1)
          });
        } catch (e) {
          console.warn("Error updating coupon count:", e);
        }
      }
      
      // 4.5. Enviar Notificación de Telegram al celular del administrador
      try {
        await fetch('/api/notify/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: orderData.customer.name,
            total: grandTotal,
            city: orderData.customer.city
          })
        });
      } catch(e) {
        console.warn("No se pudo notificar a telegram", e);
      }

      // 5. Obtener Integrity Hash de nuestro servidor seguro
      const hashRes = await fetch('/api/checkout/hash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderRef.id,
          amount: grandTotal,
          currency: 'COP'
        })
      });
      
      const hashData = await hashRes.json();
      
      if (!hashRes.ok) {
        throw new Error(hashData.error || 'Error al generar firma de seguridad');
      }

      // 6. Cargar el script de Bold dinámicamente si no existe
      if (typeof window.BoldCheckout === 'undefined') {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = "https://checkout.bold.co/library/boldPaymentButton.js";
          script.onload = () => {
            // Dar un pequeño respiro para que el script termine de inicializarse
            setTimeout(resolve, 500); 
          };
          script.onerror = () => reject(new Error("No se pudo cargar la pasarela de Bold."));
          document.head.appendChild(script);
        });
      }

      // 7. Iniciar Widget de Bold
      if (typeof window.BoldCheckout !== 'undefined') {
        const checkout = new window.BoldCheckout({
          orderId: orderRef.id,
          currency: "COP",
          amount: grandTotal,
          apiKey: process.env.NEXT_PUBLIC_BOLD_INTEGRATION_ID,
          integritySignature: hashData.hash,
          renderMode: 'embedded',
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
      alert(`Error procesando pedido: ${error.message || "Por favor intenta de nuevo"}. Si el error persiste, contáctanos.`);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) return null;

  return (
    <>
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
            
            <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-6">
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
                <input required name="email" value={formData.email} onChange={handleChange} type="email" readOnly={!!user} className={`w-full bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 p-4 rounded-sm outline-none focus:border-brand-gold transition-colors text-sm ${user ? 'opacity-70 cursor-not-allowed' : ''}`} placeholder="correo@ejemplo.com" />
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

              <div className="border-t border-gray-200 dark:border-white/10 pt-6 mt-6 space-y-4">
                {/* Input Cupón */}
                <div className="flex flex-col gap-2 mb-4">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-gray-500">¿Tienes un cupón?</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Ej: GRANCOLINOS10"
                      className="flex-1 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 p-3 rounded-sm outline-none focus:border-brand-gold text-sm uppercase"
                    />
                    <button 
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-4 bg-brand-dark dark:bg-white text-white dark:text-brand-dark text-xs font-bold uppercase tracking-widest rounded-sm hover:opacity-80 transition-opacity"
                    >
                      Aplicar
                    </button>
                  </div>
                  {couponError && <p className="text-red-500 text-[10px] uppercase tracking-wider">{couponError}</p>}
                  {couponSuccess && <p className="text-brand-gold text-[10px] uppercase tracking-wider">{couponSuccess}</p>}
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-mono">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(cartTotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-brand-gold">
                    <span>Descuento ({discount * 100}%)</span>
                    <span className="font-mono">- {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Envío Nacional 
                    {user && purchaseCount >= 1 && <span className="text-brand-gold text-[10px] uppercase ml-2 tracking-wider">(Beneficio Club)</span>}
                  </span>
                  <span className="font-mono">
                    {SHIPPING_COST === 0 ? <span className="text-brand-gold font-bold">GRATIS</span> : new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(SHIPPING_COST)}
                  </span>
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
      
      {/* Modal de Registro de Alta Gama */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setShowAuthModal(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(212,175,55,0.15)] overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent" />
              <button 
                onClick={() => setShowAuthModal(false)} 
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="p-8 md:p-10">
                <h3 className="font-playfair text-3xl text-white mb-2 text-center">
                  {isLoginMode ? 'Iniciar Sesión' : 'Únete al Club'}
                </h3>
                <p className="text-gray-400 text-sm text-center mb-8 leading-relaxed">
                  {isLoginMode 
                    ? 'Ingresa tu contraseña para continuar con tu compra VIP.'
                    : <>Crea tu cuenta ahora. Por tu registro, el envío de tu <strong className="text-white">segunda compra</strong> (y todas las siguientes) será <span className="text-brand-gold font-bold uppercase tracking-wider">Totalmente Gratis</span> de por vida.</>
                  }
                </p>

                <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-2">Contraseña para {formData.email}</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input 
                        type={showAuthPassword ? "text" : "password"} 
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-lg outline-none focus:border-brand-gold focus:bg-white/10 transition-all text-white text-sm"
                        placeholder="Crea una contraseña segura"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowAuthPassword(!showAuthPassword)} 
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-brand-gold transition-colors"
                      >
                        {showAuthPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <button 
                    type="button" 
                    onClick={handleRegisterAndCheckout}
                    disabled={registering || !authPassword}
                    className="w-full py-4 bg-brand-gold text-black font-bold uppercase tracking-widest text-xs rounded-lg hover:bg-white transition-all flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-brand-gold"
                  >
                    {registering ? 'Procesando...' : (isLoginMode ? 'Ingresar y Pagar' : 'Registrarme y Pagar')}
                  </button>

                  <button 
                    type="button"
                    onClick={() => setIsLoginMode(!isLoginMode)}
                    className="w-full text-center text-xs text-brand-gold hover:text-white transition-colors underline tracking-widest uppercase mt-2"
                  >
                    {isLoginMode ? 'No tengo cuenta, quiero registrarme' : 'Ya tengo cuenta, iniciar sesión'}
                  </button>
                  
                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-white/5"></div>
                    <span className="flex-shrink-0 mx-4 text-gray-600 text-[10px] uppercase tracking-widest font-bold">O</span>
                    <div className="flex-grow border-t border-white/5"></div>
                  </div>

                  <button 
                    type="button" 
                    onClick={handleGuestCheckout}
                    className="w-full py-4 bg-transparent border border-white/10 text-gray-400 hover:text-white font-bold uppercase tracking-widest text-xs rounded-lg hover:bg-white/5 transition-colors"
                  >
                    Pagar como Invitado (Envío ${new Intl.NumberFormat('es-CO').format(baseShippingCost)})
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
    </>
  );
}
