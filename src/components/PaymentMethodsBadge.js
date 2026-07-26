'use client';

import React from 'react';
import { ShieldCheck, Lock, Truck, RefreshCw } from 'lucide-react';

/* Official Payment Provider Vector SVG Logos */

function PseLogo() {
  return (
    <div className="h-9 px-3 bg-[#0A1A2A] border border-[#D4AF37]/40 rounded-xl flex items-center justify-center shadow-md hover:border-[#D4AF37] transition-all hover:scale-105" title="PSE - Pagos Seguros en Línea">
      <svg className="h-6 w-auto" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="40" rx="6" fill="#03254C"/>
        <circle cx="22" cy="20" r="13" fill="#F7B500"/>
        <path d="M22 10C16.477 10 12 14.477 12 20C12 25.523 16.477 30 22 30C27.523 30 32 25.523 32 20C32 14.477 27.523 10 22 10ZM20 15H24V18H20V15ZM20 20H24V25H20V20Z" fill="#03254C"/>
        <text x="42" y="26" fontFamily="sans-serif" fontWeight="900" fontSize="18" fill="#FFFFFF" letterSpacing="1">pse</text>
      </svg>
    </div>
  );
}

function NequiLogo() {
  return (
    <div className="h-9 px-3 bg-[#1C0024] border border-[#FF007A]/40 rounded-xl flex items-center justify-center shadow-md hover:border-[#FF007A] transition-all hover:scale-105" title="Nequi Colombia">
      <svg className="h-6 w-auto" viewBox="0 0 110 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="110" height="36" rx="6" fill="#20002B"/>
        <rect x="10" y="8" width="20" height="20" rx="4" fill="#FF007A"/>
        <path d="M15 13H19V23H15V13ZM21 13H25V23H21V13Z" fill="#FFFFFF"/>
        <text x="36" y="24" fontFamily="sans-serif" fontWeight="800" fontSize="16" fill="#FFFFFF">nequi</text>
      </svg>
    </div>
  );
}

function DaviplataLogo() {
  return (
    <div className="h-9 px-3 bg-[#2A0505] border border-[#E30613]/40 rounded-xl flex items-center justify-center shadow-md hover:border-[#E30613] transition-all hover:scale-105" title="DaviPlata">
      <svg className="h-6 w-auto" viewBox="0 0 120 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="36" rx="6" fill="#E30613"/>
        <path d="M12 18L20 10L28 18V26H12V18Z" fill="#FFFFFF"/>
        <rect x="17" y="19" width="6" height="7" fill="#E30613"/>
        <text x="34" y="23" fontFamily="sans-serif" fontWeight="900" fontSize="14" fill="#FFFFFF">DaviPlata</text>
      </svg>
    </div>
  );
}

function VisaLogo() {
  return (
    <div className="h-9 px-3 bg-[#0A1428] border border-[#1A1F71]/60 rounded-xl flex items-center justify-center shadow-md hover:border-[#F7B600] transition-all hover:scale-105" title="Visa Card">
      <svg className="h-5 w-auto" viewBox="0 0 80 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="5" y="22" fontFamily="sans-serif" fontWeight="900" fontStyle="italic" fontSize="24" fill="#1A1F71" letterSpacing="1">VI<tspan fill="#F7B600">SA</tspan></text>
      </svg>
    </div>
  );
}

function MastercardLogo() {
  return (
    <div className="h-9 px-3 bg-[#18120B] border border-[#FF5F00]/40 rounded-xl flex items-center justify-center shadow-md hover:border-[#FF5F00] transition-all hover:scale-105" title="Mastercard">
      <svg className="h-6 w-auto" viewBox="0 0 60 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="22" cy="18" r="12" fill="#EB001B"/>
        <circle cx="38" cy="18" r="12" fill="#F79E1B" fillOpacity="0.88"/>
      </svg>
    </div>
  );
}

function BoldPayLogo() {
  return (
    <div className="h-9 px-3.5 bg-[#D4AF37] border border-[#D4AF37] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:scale-105 transition-all" title="Bold Pasarela de Pagos">
      <svg className="h-5 w-auto" viewBox="0 0 90 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 6H20C24 6 26 8 26 11C26 13 24.5 14.5 22.5 15C25 15.5 27 17.5 27 20.5C27 24 24 25.5 19.5 25.5H8V6ZM14 12.5H18C19.5 12.5 20.5 11.8 20.5 10.8C20.5 9.8 19.5 9.2 18 9.2H14V12.5ZM14 22H18.5C20.2 22 21.2 21.2 21.2 20C21.2 18.8 20.2 18 18.5 18H14V22Z" fill="#050A04"/>
        <text x="32" y="21" fontFamily="sans-serif" fontWeight="900" fontSize="16" fill="#050A04" letterSpacing="0.5">BOLD</text>
      </svg>
    </div>
  );
}

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

        {/* Logos Oficiales de Bancos y Medios de Pago en Colombia */}
        <div className="flex flex-wrap items-center gap-2.5 justify-center">
          <PseLogo />
          <NequiLogo />
          <DaviplataLogo />
          <VisaLogo />
          <MastercardLogo />
          <BoldPayLogo />
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
