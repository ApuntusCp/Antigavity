import React from 'react';
import { Radio, Flame, ArrowRight, Mic, Volume2 } from 'lucide-react';
import PaymentMethodsBadge from '../../components/PaymentMethodsBadge';

export const metadata = {
  title: 'Periodismo Alternativo | GranColinos',
  description: 'Voz independiente, investigación sin censura y columnas de opinión objetivas.',
};

export default function PeriodismoPage() {
  const columns = [
    {
      id: 1,
      title: "La Verdad sobre la Monopolización de Patentes Agrícolas",
      author: "Voz del Territorio",
      date: "25 Julio, 2026",
      excerpt: "Un examen independiente a cómo las corporaciones buscan cercar las semillas tradicionales de la cordillera."
    },
    {
      id: 2,
      title: "Soberanía de Salud: La Lucha por el Acceso Libre a Productos Orgánicos",
      author: "Colectivo GranColinos",
      date: "22 Julio, 2026",
      excerpt: "Por qué el derecho a consumir apitoxina y plantas medicinales es una bandera de dignidad comunitaria."
    }
  ];

  return (
    <div className="min-h-screen theme-periodismo text-white pt-32 pb-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 fade-in">
          <span className="text-[#FF6B35] text-xs font-bold tracking-[0.3em] uppercase mb-3 block flex items-center justify-center gap-2">
            <Radio size={16} className="text-[#FF6B35]" /> VOZ LIBRE E INDEPENDIENTE
          </span>
          <h1 className="font-serif text-4xl md:text-6xl text-[#FF6B35] mb-6 drop-shadow-md">
            Periodismo Alternativo
          </h1>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#FF6B35] to-transparent mx-auto mb-6"></div>
          <p className="text-gray-300 max-w-2xl mx-auto font-light leading-relaxed text-sm md:text-base">
            Espacio de investigación crítica, análisis territorial y libertad de expresión en el ecosistema APONTE SAS.
          </p>
        </div>

        {/* Featured Editorial Audio / Podcast Block */}
        <div className="bg-black/50 border border-[#FF6B35]/40 rounded-3xl p-8 md:p-12 backdrop-blur-xl shadow-2xl mb-16 glow-periodismo">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <span className="px-3 py-1 bg-[#FF6B35]/20 text-[#FF6B35] text-[10px] font-extrabold uppercase tracking-widest rounded-md border border-[#FF6B35]/40 inline-flex items-center gap-2">
                <Mic size={12} /> PODCAST EDITORIAL #14
              </span>
              <h2 className="font-serif text-3xl font-bold text-white leading-tight">
                "Sin Filtros: La Realidad de la Autonomía Agrícola en Colombia"
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed font-light">
                Escucha la conversación completa con productores independientes de la región andina sobre autonomía económica y soberanía alimentaria.
              </p>
            </div>
            
            <div className="w-full md:w-auto shrink-0 flex flex-col items-center gap-3">
              <button className="w-16 h-16 rounded-full bg-[#FF6B35] text-black flex items-center justify-center shadow-[0_0_25px_rgba(255,107,53,0.7)] hover:scale-110 transition-transform">
                <Volume2 size={28} />
              </button>
              <span className="text-xs text-gray-400 font-mono">Escuchar Ahora (24 min)</span>
            </div>
          </div>
        </div>

        {/* Grid de Columnas de Opinión */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {columns.map((col) => (
            <div key={col.id} className="bg-black/40 border border-[#FF6B35]/20 hover:border-[#FF6B35]/60 rounded-2xl p-8 backdrop-blur-xl shadow-xl transition-all duration-300">
              <div className="flex items-center gap-2 text-[#FF6B35] text-xs font-bold uppercase tracking-widest mb-3">
                <Flame size={14} /> {col.author}
              </div>
              <h3 className="font-serif text-2xl font-bold text-white mb-4 leading-snug hover:text-[#FF6B35] transition-colors">
                {col.title}
              </h3>
              <p className="text-gray-300 text-sm font-light leading-relaxed mb-6">
                {col.excerpt}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-400 font-mono pt-4 border-t border-white/10">
                <span>{col.date}</span>
                <span className="text-[#FF6B35] flex items-center gap-1 cursor-pointer hover:underline">
                  Leer Columna <ArrowRight size={12} />
                </span>
              </div>
            </div>
          ))}
        </div>

        <PaymentMethodsBadge />
      </div>
    </div>
  );
}
