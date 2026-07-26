'use client';

import React from 'react';
import { ShieldCheck, Globe, ExternalLink, FileText, BookOpen, Award } from 'lucide-react';

export default function AcademicTrustBadge() {
  return (
    <div className="w-full bg-[#0A1424]/90 border border-[#00F0FF]/35 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-[0_0_50px_rgba(0,240,255,0.15)] my-10 space-y-6">
      
      {/* Top Banner — Open Access & Global Indexing */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 border-b border-[#00F0FF]/20 pb-6">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#00F0FF]/15 flex items-center justify-center text-[#00F0FF] border border-[#00F0FF]/40 shadow-inner">
            <Globe size={22} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-widest font-mono">
              INDEXACIÓN GLOBAL & ACCESO ABIERTO
            </h4>
            <p className="text-xs text-gray-300">
              Repositorio de investigación sin muros de pago • Datos abiertos para estudiantes e investigadores
            </p>
          </div>
        </div>

        {/* Academic Source Badges */}
        <div className="flex flex-wrap items-center gap-2 justify-center font-mono text-[10px] font-bold">
          <span className="px-3 py-1.5 bg-[#00F0FF]/10 text-[#00F0FF] rounded-xl border border-[#00F0FF]/30">
            OpenAlex Catalog
          </span>
          <span className="px-3 py-1.5 bg-white/10 text-white rounded-xl border border-white/20">
            PubMed / NCBI
          </span>
          <span className="px-3 py-1.5 bg-white/10 text-white rounded-xl border border-white/20">
            arXiv Repository
          </span>
          <span className="px-3 py-1.5 bg-[#00F0FF]/10 text-[#00F0FF] rounded-xl border border-[#00F0FF]/30">
            SciELO & Redalyc
          </span>
        </div>
      </div>

      {/* 3 Academic Trust Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        <div className="flex items-start gap-3 p-3 bg-black/40 rounded-2xl border border-white/5">
          <ShieldCheck className="text-[#00F0FF] shrink-0 mt-0.5" size={22} />
          <div className="space-y-0.5">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Fuentes Científicas Acreditadas
            </h5>
            <p className="text-[11px] text-gray-300 font-light leading-relaxed">
              Indexación de artículos peer-reviewed, tesis doctorales y preprints de universidades globales.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-black/40 rounded-2xl border border-white/5">
          <ExternalLink className="text-[#00F0FF] shrink-0 mt-0.5" size={22} />
          <div className="space-y-0.5">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Derechos de Autor Respetados
            </h5>
            <p className="text-[11px] text-gray-300 font-light leading-relaxed">
              Sin copias ni muros. Enlace directo e inmediato a la revista o repositorio institucional oficial.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-black/40 rounded-2xl border border-white/5">
          <FileText className="text-[#00F0FF] shrink-0 mt-0.5" size={22} />
          <div className="space-y-0.5">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Motor de Citación APA 7 & ICONTEC
            </h5>
            <p className="text-[11px] text-gray-300 font-light leading-relaxed">
              Herramienta de citación automática y exportación a gestores bibliográficos (BibTeX / RIS).
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
