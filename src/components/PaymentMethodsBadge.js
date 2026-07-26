'use client';

import React from 'react';
import { ShieldCheck, Lock, Truck, RefreshCw } from 'lucide-react';

export default function PaymentMethodsBadge() {
  return (
    <div className="w-full bg-[#0A1408]/90 border border-[#D4AF37]/30 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.7)] my-12">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-[#D4AF37]/20 pb-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/30">
            <Lock size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-widest">PAGO 100% SEGURO Y CIFRADO</h4>
            <p className="text-xs text-gray-400">Procesado con tecnología Bold & Cifrado SSL 256-bit</p>
          </div>
        </div>

        {/* Badges de Medios de Pago en Colombia */}
        <div className="flex flex-wrap items-center gap-3 justify-center">
          <span className="px-3 py-1.5 bg-black/60 border border-[#D4AF37]/40 rounded-md text-[11px] font-extrabold text-[#D4AF37] tracking-wider uppercase">
            PSE
          </span>
          <span className="px-3 py-1.5 bg-black/60 border border-[#D4AF37]/40 rounded-md text-[11px] font-extrabold text-[#D4AF37] tracking-wider uppercase">
            NEQUI
          </span>
          <span className="px-3 py-1.5 bg-black/60 border border-[#D4AF37]/40 rounded-md text-[11px] font-extrabold text-[#D4AF37] tracking-wider uppercase">
            DAVIPLATA
          </span>
          <span className="px-3 py-1.5 bg-black/60 border border-[#D4AF37]/40 rounded-md text-[11px] font-extrabold text-[#D4AF37] tracking-wider uppercase">
            VISA / MASTERCARD
          </span>
          <span className="px-3 py-1.5 bg-[#D4AF37] text-black font-extrabold rounded-md text-[11px] tracking-wider uppercase shadow-[0_0_10px_rgba(212,175,55,0.4)]">
            BOLD PAY
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-[#D4AF37] shrink-0" size={24} />
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">Calidad INVIMA Certificada</h5>
            <p className="text-[11px] text-gray-400">Registro INVIMA RS-2024-12345 y 100% orgánico</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Truck className="text-[#D4AF37] shrink-0" size={24} />
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">Envíos a Toda Colombia</h5>
            <p className="text-[11px] text-gray-400">Entrega rápida y empaque discreto premium</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <RefreshCw className="text-[#D4AF37] shrink-0" size={24} />
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">Garantía GranColinos</h5>
            <p className="text-[11px] text-gray-400">Soporte directo 24/7 y devolución garantizada</p>
          </div>
        </div>
      </div>
    </div>
  );
}
