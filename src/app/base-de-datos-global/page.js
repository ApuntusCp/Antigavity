import React from 'react';
import { Database, Globe, Search, Cpu, ShieldCheck } from 'lucide-react';
import PaymentMethodsBadge from '../../components/PaymentMethodsBadge';

export const metadata = {
  title: 'Base de Datos Global | GranColinos',
  description: 'Registro abierto de lotes, análisis de laboratorio y trazabilidad biológica.',
};

export default function BaseDatosPage() {
  const datasetEntries = [
    {
      id: "GC-LOT-2026-001",
      product: "Apitoxina Sublingual Pura 30ml",
      purity: "99.8%",
      invima: "RS-2024-12345",
      origin: "Cordillera Central (2.400m msnm)",
      status: "Verificado"
    },
    {
      id: "GC-LOT-2026-002",
      product: "Gotas Orgánicas GC Antiestrés",
      purity: "99.4%",
      invima: "RS-2024-12346",
      origin: "Valle del Cauca (Orgánico)",
      status: "Verificado"
    },
    {
      id: "GC-LOT-2026-003",
      product: "Gotas con Apitoxina de Abeja",
      purity: "99.9%",
      invima: "RS-2024-12347",
      origin: "Reserva Botánica APONTE",
      status: "Verificado"
    }
  ];

  return (
    <div className="min-h-screen theme-datos text-white pt-32 pb-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 fade-in">
          <span className="text-[#00F0FF] text-xs font-bold tracking-[0.3em] uppercase mb-3 block flex items-center justify-center gap-2">
            <Globe size={16} className="text-[#00F0FF]" /> NODO DE TRAZABILIDAD PÚBLICA
          </span>
          <h1 className="font-serif text-4xl md:text-6xl text-[#00F0FF] mb-6 drop-shadow-md">
            Base de Datos Global
          </h1>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent mx-auto mb-6"></div>
          <p className="text-gray-300 max-w-2xl mx-auto font-light leading-relaxed text-sm md:text-base">
            Registro descentralizado de certificación de origen, análisis espectrográficos y lotes aprobados por INVIMA.
          </p>
        </div>

        {/* Live Search Console */}
        <div className="bg-black/60 border border-[#00F0FF]/40 rounded-3xl p-8 backdrop-blur-xl shadow-2xl mb-12 glow-datos">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-3.5 text-[#00F0FF]" size={20} />
              <input
                type="text"
                placeholder="Buscar por Número de Lote (ej: GC-LOT-2026-001) o Registro INVIMA..."
                className="w-full bg-black/80 border border-[#00F0FF]/30 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#00F0FF] font-mono"
              />
            </div>
            <button className="w-full md:w-auto px-8 py-3 bg-[#00F0FF] text-black font-extrabold text-xs uppercase tracking-widest rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(0,240,255,0.6)]">
              Consultar Lote
            </button>
          </div>
        </div>

        {/* Tabla de Lotes Verificados */}
        <div className="bg-black/40 border border-[#00F0FF]/20 rounded-2xl overflow-hidden backdrop-blur-xl mb-16 shadow-2xl">
          <div className="p-6 border-b border-[#00F0FF]/20 flex items-center justify-between">
            <h3 className="font-mono text-sm font-bold text-[#00F0FF] uppercase tracking-wider flex items-center gap-2">
              <Cpu size={16} /> REGISTROS DE PUREZA & TRAZABILIDAD EN TIEMPO REAL
            </h3>
            <span className="text-[10px] font-mono bg-[#00F0FF]/15 text-[#00F0FF] px-3 py-1 rounded-md border border-[#00F0FF]/30">
              SISTEMA ACTIVO
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#00F0FF]/10 text-[#00F0FF] uppercase border-b border-[#00F0FF]/20">
                <tr>
                  <th className="py-4 px-6">ID Lote</th>
                  <th className="py-4 px-6">Producto</th>
                  <th className="py-4 px-6">Pureza Botánica</th>
                  <th className="py-4 px-6">Registro INVIMA</th>
                  <th className="py-4 px-6">Origen Geo-Ubicación</th>
                  <th className="py-4 px-6">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {datasetEntries.map((item) => (
                  <tr key={item.id} className="hover:bg-[#00F0FF]/5 transition-colors">
                    <td className="py-4 px-6 text-white font-bold">{item.id}</td>
                    <td className="py-4 px-6 text-gray-200">{item.product}</td>
                    <td className="py-4 px-6 text-[#00F0FF] font-bold">{item.purity}</td>
                    <td className="py-4 px-6 text-gray-300">{item.invima}</td>
                    <td className="py-4 px-6 text-gray-400">{item.origin}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 text-green-400 font-bold bg-green-500/10 px-2.5 py-1 rounded-md border border-green-500/30">
                        <ShieldCheck size={12} /> {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <PaymentMethodsBadge />
      </div>
    </div>
  );
}
