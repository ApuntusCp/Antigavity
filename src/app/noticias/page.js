import React from 'react';
import Link from 'next/link';
import { Newspaper, ArrowRight, Clock, ShieldCheck } from 'lucide-react';
import PaymentMethodsBadge from '../../components/PaymentMethodsBadge';

export const metadata = {
  title: 'Noticias & Informativo | GranColinos',
  description: 'Información verificada, actualidad y reportes de salud y bienestar en Colombia.',
};

export default function NoticiasPage() {
  const newsArticles = [
    {
      id: 1,
      title: "Avances de la Reglamentación del CBD en Colombia 2026",
      summary: "Análisis detallado sobre los nuevos decretos del INVIMA y el Ministerio de Salud para extractos botánicos de alta pureza.",
      date: "26 Julio, 2026",
      category: "Regulación & Salud",
      readTime: "4 min de lectura"
    },
    {
      id: 2,
      title: "La Ciencia detrás de la Apitoxina en la Recuperación Muscular",
      summary: "Estudios clínicos recientes respaldan las propiedades antiinflamatorias de la apitoxina en atletas y personas de alto rendimiento.",
      date: "24 Julio, 2026",
      category: "Investigación",
      readTime: "6 min de lectura"
    },
    {
      id: 3,
      title: "Impacto del Cultivo Orgánico en la Cordillera Central",
      summary: "Cómo los estándares de cultivo limpio están transformando el paisaje agrícola colombiano hacia el bienestar sostenible.",
      date: "20 Julio, 2026",
      category: "Comunidad & Origen",
      readTime: "5 min de lectura"
    }
  ];

  return (
    <div className="min-h-screen theme-noticias text-white pt-32 pb-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 fade-in">
          <span className="text-[#E2E8F0] text-xs font-bold tracking-[0.3em] uppercase mb-3 block flex items-center justify-center gap-2">
            <Newspaper size={16} className="text-[#E2E8F0]" /> NOTICIAS & REPORTES
          </span>
          <h1 className="font-serif text-4xl md:text-6xl text-[#E2E8F0] mb-6 drop-shadow-md">
            Información Verificada y Actualidad
          </h1>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#E2E8F0] to-transparent mx-auto mb-6"></div>
          <p className="text-gray-300 max-w-2xl mx-auto font-light leading-relaxed text-sm md:text-base">
            El portal informativo de GranColinos con análisis profundos sobre bienestar, investigación botánica y actualidad regulatoria colombiana.
          </p>
        </div>

        {/* Featured News Hero */}
        <div className="bg-black/40 border border-[#E2E8F0]/30 rounded-3xl p-8 md:p-12 backdrop-blur-xl shadow-2xl mb-16 glow-noticias">
          <div className="max-w-3xl">
            <span className="px-3 py-1 bg-[#E2E8F0]/20 text-[#E2E8F0] text-[10px] font-extrabold uppercase tracking-widest rounded-md border border-[#E2E8F0]/40 mb-4 inline-block">
              DESTACADO DE HOY
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-white font-bold mb-4 leading-tight">
              Colombia Lidera Estándares Hemisféricos en Extractos de Grado Farmacéutico
            </h2>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6 font-light">
              Revisión especial sobre cómo la integración de normas INVIMA y certificación de trazabilidad de origen posiciona al país a la vanguardia de la industria global.
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-400 font-mono">
              <span className="flex items-center gap-1.5"><Clock size={14} /> 26 Julio 2026</span>
              <span>•</span>
              <span className="text-[#E2E8F0]">Por Redacción GranColinos</span>
            </div>
          </div>
        </div>

        {/* Grid de Noticias */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {newsArticles.map((article) => (
            <div key={article.id} className="bg-black/35 border border-[#E2E8F0]/20 hover:border-[#E2E8F0]/60 rounded-2xl p-6 backdrop-blur-xl shadow-xl hover:shadow-[#E2E8F0]/10 transition-all duration-300 flex flex-col justify-between">
              <div>
                <span className="text-[#E2E8F0] text-[10px] font-bold tracking-widest uppercase block mb-2">
                  {article.category}
                </span>
                <h3 className="font-serif text-xl font-bold text-white mb-3 hover:text-[#E2E8F0] transition-colors">
                  {article.title}
                </h3>
                <p className="text-gray-300 text-xs leading-relaxed mb-6 font-light">
                  {article.summary}
                </p>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400 font-mono pt-4 border-t border-white/10">
                <span>{article.date}</span>
                <span className="text-[#E2E8F0] flex items-center gap-1 cursor-pointer hover:underline">
                  Leer <ArrowRight size={12} />
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
