'use client';

import React from 'react';
import { BookOpen, Scale, Globe } from 'lucide-react';

export default function NewsTrustBadge() {
  return (
    <div className="w-full bg-[#051208]/90 border border-[#D4AF37]/40 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.9)] my-10 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
        
        {/* Item 1: Hemeroteca y Fuentes Verídicas */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#D4AF37]/25 to-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/50 shrink-0 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <BookOpen size={22} />
          </div>
          <div>
            <h5 className="text-xs font-serif font-bold text-white uppercase tracking-wider">Hemeroteca & Fuentes 100% Verídicas</h5>
            <p className="text-[11px] text-gray-300 font-light">Atribución legal directa y enlace a la publicación oficial original</p>
          </div>
        </div>

        {/* Item 2: Síntesis Algorítmica Umma */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#D4AF37]/25 to-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/50 shrink-0 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <Scale size={22} />
          </div>
          <div>
            <h5 className="text-xs font-serif font-bold text-white uppercase tracking-wider">Síntesis Algorítmica Umma</h5>
            <p className="text-[11px] text-gray-300 font-light">Medición neutral de sesgo ideológico y pluralismo discursivo</p>
          </div>
        </div>

        {/* Item 3: Indexación Continental Medios América */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#D4AF37]/25 to-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/50 shrink-0 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <Globe size={22} />
          </div>
          <div>
            <h5 className="text-xs font-serif font-bold text-white uppercase tracking-wider">Indexación Continental Medios América</h5>
            <p className="text-[11px] text-gray-300 font-light">Monitoreo y archivo noticioso panamericano en tiempo real</p>
          </div>
        </div>

      </div>
    </div>
  );
}
