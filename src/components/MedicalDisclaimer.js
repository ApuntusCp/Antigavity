'use client';

import React from 'react';
import { ShieldAlert } from 'lucide-react';

/**
 * MedicalDisclaimer - Componente de aviso legal de salud y transparencia médica.
 * 
 * Variantes:
 * - 'compact': Para fichas de producto (bajo el botón de compra o especificaciones).
 * - 'card': Para páginas de catálogo, tienda y artículos del Journal de Bienestar.
 * - 'footer': Para el pie de página global de la plataforma.
 */
export default function MedicalDisclaimer({ variant = 'card', className = '' }) {
  if (variant === 'compact') {
    return (
      <div className={`p-4 rounded-xl bg-[#040D06]/85 border border-[#D4AF37]/30 text-gray-300 text-[11px] leading-relaxed backdrop-blur-md space-y-1.5 ${className}`}>
        <div className="flex items-center gap-2 text-[#D4AF37] font-mono font-bold uppercase tracking-wider text-[10px]">
          <ShieldAlert size={14} className="shrink-0" />
          <span>Aviso Legal de Salud & Uso Responsable</span>
        </div>
        <p className="font-light text-gray-300">
          Este producto es un extracto natural / suplemento de bienestar y <strong>no sustituye el criterio médico profesional</strong>. 
          No tiene la intención de diagnosticar, tratar, curar ni prevenir ninguna enfermedad. 
          Consulte a su médico antes de iniciar cualquier uso, especialmente en caso de embarazo, lactancia o tratamientos farmacológicos preexistentes.
        </p>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`w-full py-4 px-6 rounded-2xl bg-black/50 border border-white/10 text-gray-400 text-[10px] leading-relaxed font-sans ${className}`}>
        <p className="max-w-5xl mx-auto text-center font-light">
          <strong className="text-gray-300 uppercase tracking-wider block sm:inline font-semibold">Descargo de Responsabilidad Médica: </strong>
          Las declaraciones relativas a extractos botánicos, apiterapia y formulaciones con CBD no han sido evaluadas con fines de prescripción médica curativa. 
          Los productos comercializados por GranColinos (APONTE S.A.S., NIT 100120471-4) están orientados al bienestar general y estilo de vida consciente. 
          Venta y consumo dirigido exclusivamente a mayores de 18 años en el territorio de la República de Colombia.
        </p>
      </div>
    );
  }

  // Variant: 'card' (default para Blog, Shop y páginas de contenido)
  return (
    <div className={`p-6 sm:p-8 rounded-3xl bg-[#061108]/90 border border-[#D4AF37]/35 shadow-2xl backdrop-blur-xl space-y-3 ${className}`}>
      <div className="flex items-center gap-2.5 border-b border-[#D4AF37]/25 pb-3">
        <div className="w-8 h-8 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0 shadow-inner">
          <ShieldAlert size={16} />
        </div>
        <div>
          <h4 className="font-serif text-sm sm:text-base font-bold text-white tracking-wide">
            Aviso de Transparencia & Responsabilidad Médica
          </h4>
          <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest font-semibold block">
            Cumplimiento Normativo Colombia • Google YMYL Guidelines
          </span>
        </div>
      </div>

      <div className="text-xs sm:text-[13px] text-gray-300 font-light leading-relaxed space-y-2">
        <p>
          La información presentada en esta plataforma, artículos divulgativos y fichas descriptivas se proporciona 
          exclusivamente con fines educativos y de transparencia botánica. <strong>Bajo ninguna circunstancia 
          constituye asesoramiento médico, diagnóstico clínico o prescripción farmacéutica.</strong>
        </p>
        <p className="text-gray-400 text-[11px] font-mono">
          Cada organismo responde de forma individual a los fitocannabinoides y extractos apícolas. 
          Si presenta alguna condición médica especial o toma medicamentos bajo prescripción, consulte previamente a su profesional de la salud de confianza.
        </p>
      </div>
    </div>
  );
}
