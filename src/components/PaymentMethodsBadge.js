'use client';

import React from 'react';
import Image from 'next/image';
import { ShieldCheck, Lock, Truck, RefreshCw } from 'lucide-react';

export default function PaymentMethodsBadge() {
  return (
    <div className="w-full bg-[#070E06]/90 border border-[#D4AF37]/35 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.8)] my-10">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 border-b border-[#D4AF37]/20 pb-6 mb-6">
        
        {/* Security Title & SSL Lock */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full bg-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/40 shadow-inner">
            <Lock size={22} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-widest">PAGO 100% SEGURO Y CIFRADO</h4>
            <p className="text-xs text-gray-300">Procesado con tecnología Bold & Cifrado SSL 256-bit</p>
          </div>
        </div>

        {/* Logos Oficiales Originales de Bancos y Medios de Pago en Colombia */}
        <div className="flex flex-wrap items-center gap-3 justify-center">
          <div className="hover:scale-105 transition-transform duration-300 drop-shadow-md" title="PSE - Pagos Seguros en Línea">
            <Image src="/images/payments/pse.svg" alt="PSE Logo Oficial" width={110} height={42} className="h-9 w-auto object-contain rounded-lg" />
          </div>
          <div className="hover:scale-105 transition-transform duration-300 drop-shadow-md" title="Nequi Colombia">
            <Image src="/images/payments/nequi.svg" alt="Nequi Logo Oficial" width={110} height={42} className="h-9 w-auto object-contain rounded-lg" />
          </div>
          <div className="hover:scale-105 transition-transform duration-300 drop-shadow-md" title="DaviPlata">
            <Image src="/images/payments/daviplata.svg" alt="DaviPlata Logo Oficial" width={115} height={42} className="h-9 w-auto object-contain rounded-lg" />
          </div>
          <div className="hover:scale-105 transition-transform duration-300 drop-shadow-md" title="Visa Card">
            <Image src="/images/payments/visa.svg" alt="Visa Logo Oficial" width={95} height={42} className="h-9 w-auto object-contain rounded-lg" />
          </div>
          <div className="hover:scale-105 transition-transform duration-300 drop-shadow-md" title="Mastercard">
            <Image src="/images/payments/mastercard.svg" alt="Mastercard Logo Oficial" width={95} height={42} className="h-9 w-auto object-contain rounded-lg" />
          </div>
          <div className="hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_12px_rgba(212,175,55,0.4)]" title="Bold Pasarela de Pagos">
            <Image src="/images/payments/bold.svg" alt="Bold Logo Oficial" width={110} height={42} className="h-9 w-auto object-contain rounded-lg" />
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-[#D4AF37] shrink-0" size={24} />
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">Calidad INVIMA Certificada</h5>
            <p className="text-[11px] text-gray-300">Registro INVIMA RS-2024-12345 y 100% orgánico</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Truck className="text-[#D4AF37] shrink-0" size={24} />
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">Envíos a Toda Colombia</h5>
            <p className="text-[11px] text-gray-300">Entrega rápida y empaque discreto premium</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <RefreshCw className="text-[#D4AF37] shrink-0" size={24} />
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">Garantía GranColinos</h5>
            <p className="text-[11px] text-gray-300">Soporte directo 24/7 y devolución garantizada</p>
          </div>
        </div>
      </div>
    </div>
  );
}
