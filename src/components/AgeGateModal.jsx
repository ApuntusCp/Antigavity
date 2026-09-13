'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle, XCircle, Lock } from 'lucide-react';

export default function AgeGateModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    try {
      const isVerifiedLocal = localStorage.getItem('grancolinos_age_verified');
      const isVerifiedCookie = document.cookie.includes('gc_age_verified=true');

      if (!isVerifiedLocal && !isVerifiedCookie) {
        setIsOpen(true);
      }
    } catch (_) {
      // Si el acceso a localStorage está bloqueado, no interrumpimos la experiencia
      setIsOpen(false);
    }
  }, []);

  const handleConfirmAge = () => {
    try {
      localStorage.setItem('grancolinos_age_verified', 'true');
      // Cookie válida por 30 días con SameSite=Lax
      document.cookie = 'gc_age_verified=true; max-age=2592000; path=/; SameSite=Lax';
    } catch (_) {}
    setIsOpen(false);
  };

  const handleRejectAge = () => {
    window.location.href = 'https://www.google.com';
  };

  if (!hasMounted || !isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-[#060D07] border border-[#D4AF37]/40 p-6 sm:p-8 shadow-[0_0_50px_rgba(212,175,55,0.15)] text-center space-y-6">
        {/* Badge superior */}
        <div className="mx-auto w-14 h-14 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shadow-inner">
          <Lock size={26} />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-semibold block">
            Cumplimiento Normativo • República de Colombia
          </span>
          <h2 id="age-gate-title" className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
            Verificación de Mayoría de Edad (+18)
          </h2>
        </div>

        <div className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed space-y-3 border-y border-white/10 py-4 text-left sm:text-center">
          <p>
            Conforme a las disposiciones de la legislación colombiana (Ley 1480 de 2011) y los estándares sanitarios aplicables a formulaciones botánicas, apícolas y extractos derivados del cáñamo/CBD, la consulta y adquisición de nuestros productos están dirigidas exclusivamente a personas mayores de edad.
          </p>
          <p className="text-[11px] text-gray-400 font-mono">
            ¿Confirmas de manera libre y voluntaria que tienes 18 años o más para ingresar a GranColinos?
          </p>
        </div>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleConfirmAge}
            className="flex-1 py-3 px-5 rounded-xl bg-[#D4AF37] hover:bg-[#b8972e] text-black font-semibold text-xs tracking-wider uppercase transition-all shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.35)] cursor-pointer flex items-center justify-center gap-2"
          >
            <CheckCircle size={16} />
            <span>Soy mayor de 18 años</span>
          </button>
          <button
            onClick={handleRejectAge}
            className="py-3 px-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white font-medium text-xs tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <XCircle size={16} />
            <span>Soy menor de edad</span>
          </button>
        </div>

        <p className="text-[10px] text-gray-500 font-mono">
          APONTE S.A.S. • NIT 100120471-4 • Consumo responsable y bienestar consciente
        </p>
      </div>
    </div>
  );
}
