'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Hammer, Sparkles, Shield, ArrowLeft, Newspaper, ShoppingBag, Bell, Check, Send, AlertTriangle, Compass, Clock, Landmark } from 'lucide-react';

export default function UnderConstructionScreen({ 
  title = "SECCIÓN EN DESARROLLO & PRÓXIMO LANZAMIENTO",
  subtitle = "Estamos perfeccionando este módulo con los más altos estándares de calidad, verificación factual y diseño hemerográfico.",
  moduleName = "GranColinos Digital",
  estimatedDate = "Agosto 2026",
  showNavigationButtons = true
}) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen theme-noticias text-white flex items-center justify-center pt-28 pb-32 px-4 sm:px-6 relative overflow-hidden">
      
      {/* Luz y destellos de fondo */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#D4AF37]/15 via-[#AA7C11]/10 to-transparent rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-4xl w-full mx-auto relative z-10">
        <div 
          className="rounded-3xl p-8 sm:p-14 border-2 border-[#D4AF37]/60 shadow-[0_20px_80px_rgba(0,0,0,0.95)] text-center space-y-8 relative overflow-hidden"
          style={{
            backgroundColor: 'rgba(5, 12, 24, 0.45)',
            backdropFilter: 'blur(25px)',
            WebkitBackdropFilter: 'blur(25px)'
          }}
        >
          {/* Marca de Agua de Fondo */}
          <div className="absolute -right-20 -bottom-20 opacity-5 pointer-events-none select-none">
            <Hammer size={380} className="text-[#D4AF37]" />
          </div>

          {/* Badge Superior Animado */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-black/80 border border-[#D4AF37]/60 text-[#D4AF37] text-xs font-mono font-extrabold uppercase tracking-widest shadow-xl">
            <span className="w-2.5 h-2.5 bg-[#D4AF37] rounded-full animate-ping"></span>
            <Hammer size={15} className="text-[#D4AF37] animate-bounce" />
            <span>Módulo En Construcción • {moduleName}</span>
          </div>

          {/* Encabezado Principal */}
          <div className="space-y-4 max-w-2xl mx-auto">
            <h1 className="font-serif text-3xl sm:text-5xl font-black tracking-tight text-gold-gradient uppercase drop-shadow-[0_4px_30px_rgba(212,175,55,0.4)]">
              {title}
            </h1>
            
            <div className="w-28 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto rounded-full shadow-[0_0_12px_rgba(212,175,55,0.8)]"></div>
            
            <p className="font-sans text-sm sm:text-base text-gray-200 font-light leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Tarjetas de Estado & Cronograma de Disponibilidad */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-2 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-black/50 border border-[#D4AF37]/35 space-y-1 text-center shadow-lg">
              <span className="text-gray-400 text-[10px] uppercase font-bold block">Estado Actual</span>
              <strong className="text-amber-400 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5">
                <Clock size={14} /> Desarrollo Activo
              </strong>
            </div>

            <div className="p-4 rounded-2xl bg-black/50 border border-[#D4AF37]/35 space-y-1 text-center shadow-lg">
              <span className="text-gray-400 text-[10px] uppercase font-bold block">Estándar de Calidad</span>
              <strong className="text-emerald-400 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5">
                <Shield size={14} /> 100% Verificado
              </strong>
            </div>

            <div className="p-4 rounded-2xl bg-black/50 border border-[#D4AF37]/35 space-y-1 text-center shadow-lg">
              <span className="text-gray-400 text-[10px] uppercase font-bold block">Fecha Estimada</span>
              <strong className="text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5">
                <Sparkles size={14} className="text-[#D4AF37]" /> {estimatedDate}
              </strong>
            </div>
          </div>

          {/* Formulario de Notificación al Usuario */}
          <div className="max-w-md mx-auto p-6 rounded-2xl bg-black/60 border border-[#D4AF37]/40 space-y-3 shadow-2xl">
            <span className="text-xs font-mono font-bold text-[#D4AF37] uppercase tracking-wider block flex items-center justify-center gap-2">
              <Bell size={14} /> ¿Deseas recibir una notificación al ser publicado?
            </span>

            {subscribed ? (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500/60 rounded-xl text-emerald-300 text-xs font-mono font-bold flex items-center justify-center gap-2 animate-in fade-in">
                <Check size={16} /> ¡Gracias! Te avisaremos tan pronto esté disponible.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  placeholder="Tu correo electrónico..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-black/90 text-white text-xs font-mono px-4 py-2.5 rounded-xl border border-white/20 focus:outline-none focus:border-[#D4AF37] placeholder-gray-500"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-mono font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span>Notificarme</span>
                  <Send size={13} />
                </button>
              </form>
            )}
          </div>

          {/* Botones de Navegación a Secciones Activas */}
          {showNavigationButtons && (
            <div className="pt-4 border-t border-white/15 flex flex-wrap items-center justify-center gap-3 font-mono text-xs">
              <Link
                href="/noticias"
                className="px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-extrabold uppercase tracking-wider rounded-xl hover:bg-white transition-all shadow-[0_0_25px_rgba(212,175,55,0.5)] flex items-center gap-2 border border-white/30"
              >
                <Newspaper size={16} />
                <span>Ir a Gran Noticias (Activo)</span>
              </Link>

              <Link
                href="/tienda"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-wider rounded-xl transition-all border border-white/20 flex items-center gap-2"
              >
                <ShoppingBag size={16} className="text-[#D4AF37]" />
                <span>Ir a la Tienda Oficial</span>
              </Link>

              <Link
                href="/"
                className="px-5 py-3 text-gray-400 hover:text-white font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft size={14} />
                <span>Regresar al Inicio</span>
              </Link>
            </div>
          )}

          {/* Pie de Página de Marca */}
          <div className="pt-2 text-[10px] font-mono text-gray-400 uppercase tracking-widest">
            GranColinos • Ecosistema Digital APONTE SAS
          </div>

        </div>
      </div>
    </div>
  );
}
