"use client";
import { useState } from 'react';
import { db } from '../utils/firebase';
import { collection, addDoc, doc, setDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { Mail, Gift, CheckCircle, Copy, Loader2, User } from 'lucide-react';

export default function NewsletterForm() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error, exists
  const [generatedCoupon, setGeneratedCoupon] = useState('');
  const [copied, setCopied] = useState(false);

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'GC-';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setStatus('loading');

    try {
      // 1. Check if email already exists
      const q = query(collection(db, 'clients'), where('email', '==', formData.email.toLowerCase().trim()));
      const snap = await getDocs(q);
      
      if (!snap.empty) {
        setStatus('exists');
        return;
      }

      // 2. Generate unique coupon
      const newCode = generateCode();
      
      // 3. Save to coupons collection
      await setDoc(doc(db, 'coupons', newCode), {
        code: newCode,
        type: 'PERCENTAGE',
        value: 10, // 10% discount by default
        maxUses: 1,
        usedCount: 0,
        active: true,
        isWelcomeCoupon: true,
        assignedTo: formData.email.toLowerCase().trim(),
        createdAt: serverTimestamp()
      });

      // 4. Save to clients collection
      await addDoc(collection(db, 'clients'), {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        couponCode: newCode,
        source: 'Newsletter',
        createdAt: serverTimestamp()
      });

      setGeneratedCoupon(newCode);
      setStatus('success');
    } catch (error) {
      console.error("Error subscribing:", error);
      setStatus('error');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCoupon);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (status === 'success') {
    return (
      <div className="bg-gradient-to-br from-[#111] to-black border border-brand-gold/30 rounded-2xl p-8 text-center shadow-[0_0_40px_rgba(212,175,55,0.1)] relative overflow-hidden max-w-2xl mx-auto w-full">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent opacity-50"></div>
        <CheckCircle className="w-16 h-16 text-brand-gold mx-auto mb-4 animate-in zoom-in duration-500" />
        <h3 className="text-3xl font-bold text-white mb-2">¡Bienvenido a la Familia!</h3>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Gracias por unirte a Gran Colinos. Como lo prometimos, aquí tienes tu cupón único del 10% de descuento para tu primera compra.
        </p>
        
        <div className="bg-black/50 border border-brand-gold/50 rounded-xl p-6 flex flex-col items-center justify-center gap-4 relative group">
          <span className="text-xs font-bold tracking-widest text-brand-gold uppercase">Tu Código Exclusivo</span>
          <div className="text-4xl md:text-5xl font-black text-white tracking-widest font-mono">
            {generatedCoupon}
          </div>
          <button 
            onClick={copyToClipboard}
            className="mt-2 flex items-center gap-2 px-6 py-2.5 bg-brand-gold/10 hover:bg-brand-gold/20 text-brand-gold rounded-full font-bold text-sm transition-all border border-brand-gold/30 hover:border-brand-gold"
          >
            {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? '¡COPIADO!' : 'COPIAR CÓDIGO'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#111] to-[#050505] border border-white/5 rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-2xl max-w-4xl mx-auto w-full flex flex-col md:flex-row items-center gap-12">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-gold/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="flex-1 relative z-10 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-xs font-bold uppercase tracking-widest mb-6">
          <Gift className="w-4 h-4" /> Club Gran Colinos
        </div>
        <h3 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
          Obtén un <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-yellow-200">10% OFF</span> en tu primera compra
        </h3>
        <p className="text-gray-400 text-lg">
          Únete a nuestra lista VIP y recibe ofertas exclusivas, novedades sobre el CBD y tu regalo de bienvenida inmediato.
        </p>
      </div>

      <div className="flex-1 w-full max-w-sm relative z-10 mx-auto md:mx-0">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              required
              disabled={status === 'loading'}
              placeholder="Tu nombre"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="email"
              required
              disabled={status === 'loading'}
              placeholder="Tu correo electrónico"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"
            />
          </div>

          {status === 'exists' && (
            <p className="text-red-400 text-sm font-medium text-center bg-red-400/10 py-2 rounded-lg border border-red-400/20">
              Este correo ya está registrado en nuestro sistema.
            </p>
          )}

          {status === 'error' && (
            <p className="text-red-400 text-sm font-medium text-center bg-red-400/10 py-2 rounded-lg border border-red-400/20">
              Ocurrió un error. Intenta nuevamente más tarde.
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-brand-gold hover:bg-yellow-500 text-black font-black uppercase tracking-widest py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            {status === 'loading' ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Procesando...</>
            ) : (
              'Quiero mi Descuento'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
