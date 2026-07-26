'use client';

import React, { useState } from 'react';
import { Database, Globe, Search, Cpu, ShieldCheck, CheckCircle2, Calendar, FileText, ExternalLink, Filter, RotateCcw } from 'lucide-react';
import PaymentMethodsBadge from '../../components/PaymentMethodsBadge';

export default function TrazabilidadPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLotModal, setSelectedLotModal] = useState(null);

  const datasetEntries = [
    {
      id: "GC-LOT-2026-001",
      product: "Apitoxina Sublingual Pura 30ml",
      purity: "99.8% Melitina Grado Farmacéutico",
      invima: "RS-2024-12345",
      origin: "Cordillera Central (2.400m msnm)",
      fecha_verificacion: "26 de Julio, 2026",
      laboratorio: "Laboratorios Analíticos Botánicos APONTE S.A.S.",
      lote_fab: "LT-2026-07-A",
      status: "Verificado",
      analisis_pdf: "https://grancolinos.com/docs/certificados/GC-LOT-2026-001.pdf"
    },
    {
      id: "GC-LOT-2026-002",
      product: "Gotas Orgánicas GC Antiestrés",
      purity: "99.4% Extracto Estandarizado",
      invima: "RS-2024-12346",
      origin: "Valle del Cauca (Cultivo Orgánico Certificado)",
      fecha_verificacion: "24 de Julio, 2026",
      laboratorio: "Laboratorios Analíticos Botánicos APONTE S.A.S.",
      lote_fab: "LT-2026-07-B",
      status: "Verificado",
      analisis_pdf: "https://grancolinos.com/docs/certificados/GC-LOT-2026-002.pdf"
    },
    {
      id: "GC-LOT-2026-003",
      product: "Gotas con Apitoxina de Abeja",
      purity: "99.9% Apitoxina Purificada en Frío",
      invima: "RS-2024-12347",
      origin: "Reserva Botánica APONTE (Cordillera Central)",
      fecha_verificacion: "22 de Julio, 2026",
      laboratorio: "Laboratorios Analíticos Botánicos APONTE S.A.S.",
      lote_fab: "LT-2026-07-C",
      status: "Verificado",
      analisis_pdf: "https://grancolinos.com/docs/certificados/GC-LOT-2026-003.pdf"
    },
    {
      id: "GC-LOT-2026-004",
      product: "Miel Silvestre Concentrada con Propóleo",
      purity: "100% Orgánica Multifloreal",
      invima: "RS-2024-12348",
      origin: "Santuario de Abejas GranColinos",
      fecha_verificacion: "18 de Julio, 2026",
      laboratorio: "Laboratorios Analíticos Botánicos APONTE S.A.S.",
      lote_fab: "LT-2026-07-D",
      status: "Verificado",
      analisis_pdf: "https://grancolinos.com/docs/certificados/GC-LOT-2026-004.pdf"
    }
  ];

  const filteredEntries = datasetEntries.filter(item => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.id.toLowerCase().includes(q) ||
      item.invima.toLowerCase().includes(q) ||
      item.product.toLowerCase().includes(q) ||
      item.origin.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen theme-datos text-white pt-32 pb-24 px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        
        {/* Header Trazabilidad */}
        <div className="text-center fade-in">
          <span className="text-[#00F0FF] text-xs font-bold tracking-[0.3em] uppercase mb-3 inline-flex items-center gap-2 bg-[#00F0FF]/10 px-4 py-1.5 rounded-full border border-[#00F0FF]/30">
            <Globe size={16} className="text-[#00F0FF]" /> CERTIFICACIÓN DE LOTES & ORIGEN GEOGRÁFICO
          </span>
          <h1 className="font-serif text-4xl md:text-6xl text-[#00F0FF] mb-6 drop-shadow-md">
            Sistema de Trazabilidad Botánica
          </h1>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent mx-auto mb-6"></div>
          <p className="text-gray-300 max-w-2xl mx-auto font-light leading-relaxed text-sm md:text-base">
            Consulte la trazabilidad biológica, el registro INVIMA, la pureza espectrográfica y el certificado de laboratorio de cada lote fabricado por GranColinos.
          </p>
        </div>

        {/* Console de Búsqueda Interactiva */}
        <div className="bg-black/60 border border-[#00F0FF]/40 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl space-y-4 glow-datos">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-3.5 text-[#00F0FF]" size={20} />
              <input
                type="text"
                placeholder="Buscar por ID de Lote (ej: GC-LOT-2026-001), Registro INVIMA o Producto..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/80 border border-[#00F0FF]/30 rounded-2xl pl-12 pr-10 py-3.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#00F0FF] font-mono shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-white"
                >
                  <RotateCcw size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-gray-400 px-2">
            <span>Resultados encontrados: <strong className="text-[#00F0FF] font-bold">{filteredEntries.length}</strong> lotes en sistema</span>
            <span>Última actualización de lotes: <strong className="text-green-400 font-bold">26 de Julio, 2026</strong></span>
          </div>
        </div>

        {/* Tabla de Lotes Verificados */}
        <div className="bg-black/40 border border-[#00F0FF]/30 rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl">
          <div className="p-6 border-b border-[#00F0FF]/20 flex flex-wrap items-center justify-between gap-4">
            <h3 className="font-mono text-sm font-bold text-[#00F0FF] uppercase tracking-wider flex items-center gap-2">
              <Cpu size={18} /> REGISTROS DE PUREZA & TRAZABILIDAD EN TIEMPO REAL
            </h3>
            <span className="text-[10px] font-mono bg-[#00F0FF]/15 text-[#00F0FF] px-3 py-1.5 rounded-xl border border-[#00F0FF]/30 uppercase font-bold">
              CONEXIÓN DIRECTA CON LABORATORIO
            </span>
          </div>

          {filteredEntries.length === 0 ? (
            <div className="text-center py-16 text-gray-400 space-y-3 font-mono">
              <p className="text-sm font-bold text-red-400">No se encontró ningún lote o registro INVIMA con el código "{searchQuery}"</p>
              <p className="text-xs text-gray-500">Verifique el código impreso en el empaque o frasco del producto GranColinos.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-[#00F0FF]/10 text-[#00F0FF] uppercase border-b border-[#00F0FF]/20">
                  <tr>
                    <th className="py-4 px-6">ID Lote</th>
                    <th className="py-4 px-6">Producto</th>
                    <th className="py-4 px-6">Pureza Botánica</th>
                    <th className="py-4 px-6">Registro INVIMA</th>
                    <th className="py-4 px-6">Origen Geo-Ubicación</th>
                    <th className="py-4 px-6">Última Verificación</th>
                    <th className="py-4 px-6">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredEntries.map((item) => (
                    <tr key={item.id} className="hover:bg-[#00F0FF]/5 transition-colors">
                      <td className="py-4 px-6 text-white font-bold">{item.id}</td>
                      <td className="py-4 px-6 text-gray-200 font-semibold">{item.product}</td>
                      <td className="py-4 px-6 text-[#00F0FF] font-bold">{item.purity}</td>
                      <td className="py-4 px-6 text-gray-300">{item.invima}</td>
                      <td className="py-4 px-6 text-gray-400">{item.origin}</td>
                      <td className="py-4 px-6 text-gray-400 flex items-center gap-1.5">
                        <Calendar size={13} className="text-[#00F0FF]" /> {item.fecha_verificacion}
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => setSelectedLotModal(item)}
                          className="px-3 py-1.5 bg-[#00F0FF]/20 text-[#00F0FF] hover:bg-[#00F0FF] hover:text-black text-[11px] font-bold uppercase rounded-lg border border-[#00F0FF]/40 transition-all flex items-center gap-1"
                        >
                          <FileText size={13} /> Ver Ficha
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* MODAL DE CERTIFICADO Y FICHA TÉCNICA DE LOTE */}
        {selectedLotModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
            <div className="bg-[#0A0F0D] border border-[#00F0FF]/50 rounded-3xl max-w-lg w-full p-6 md:p-8 space-y-6 relative shadow-[0_0_80px_rgba(0,240,255,0.2)]">
              <button
                onClick={() => setSelectedLotModal(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
              >
                ✕
              </button>

              <div className="space-y-2 border-b border-[#00F0FF]/20 pb-4">
                <span className="px-3 py-1 bg-[#00F0FF]/20 text-[#00F0FF] text-[10px] font-bold uppercase tracking-widest rounded border border-[#00F0FF]/40 inline-flex items-center gap-1">
                  <ShieldCheck size={12} /> LOTE OFICIAL APROBADO & CERTIFICADO
                </span>
                <h3 className="font-serif text-xl font-bold text-white">{selectedLotModal.product}</h3>
                <p className="text-xs font-mono text-[#00F0FF]">ID Lote: {selectedLotModal.id}</p>
              </div>

              <div className="space-y-3 font-mono text-xs text-gray-300">
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-gray-400">Pureza Espectrográfica:</span>
                  <span className="text-[#00F0FF] font-bold">{selectedLotModal.purity}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-gray-400">Registro Sanitario INVIMA:</span>
                  <span className="text-white font-bold">{selectedLotModal.invima}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-gray-400">Origen Botánico / Geográfico:</span>
                  <span className="text-white text-right">{selectedLotModal.origin}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-gray-400">Laboratorio Emisor:</span>
                  <span className="text-white text-right">{selectedLotModal.laboratorio}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-gray-400">Última Fecha de Análisis:</span>
                  <span className="text-green-400 font-bold">{selectedLotModal.fecha_verificacion}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedLotModal(null)}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase font-bold rounded-xl"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        <PaymentMethodsBadge />
      </div>
    </div>
  );
}
