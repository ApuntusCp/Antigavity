'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Info, HelpCircle, MessageSquare, ShieldCheck, Mail, Phone, FileText, Send, CheckCircle, Clock, Globe, ArrowRight, Building, Layers, Lock, Cpu, Sparkles } from 'lucide-react';
import PaymentMethodsBadge from '@/components/PaymentMethodsBadge';
import MaintenanceGuard from '@/components/MaintenanceGuard';

export default function InformacionPage() {
  // Estado del Formulario PQR (Petición, Queja, Reclamo)
  const [pqrForm, setPqrForm] = useState({
    tipo: 'Peticion',
    nombre: '',
    email: '',
    telefono: '',
    numeroOrden: '',
    mensaje: '',
    adjunto: null
  });

  const [pqrSent, setPqrSent] = useState(false);
  const [pqrTicketId, setPqrTicketId] = useState('');

  // Estado del Chat en Vivo
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'Soporte GranColinos', text: '¡Hola! Bienvenido al canal de información de GranColinos. ¿En qué te podemos ayudar hoy?', time: 'En línea' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Enviar PQR
  const handlePqrSubmit = async (e) => {
    e.preventDefault();
    if (!pqrForm.nombre || !pqrForm.email || !pqrForm.mensaje) {
      showToast('Por favor diligencie todos los campos requeridos del formulario.');
      return;
    }

    const ticketId = `PQR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setPqrTicketId(ticketId);

    try {
      const res = await fetch('/api/informacion/pqr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...pqrForm, ticketId })
      });
      if (!res.ok) {
        throw new Error(`API respondió con status ${res.status}`);
      }
    } catch (e) {
      console.error('[PQR] Error enviando solicitud:', e);
      showToast('Hubo un error al enviar tu solicitud. Por favor intenta de nuevo o contáctanos directamente.');
      return; // No marcar como enviado si la API falló
    }

    setPqrSent(true);
    showToast(`PQR enviada con éxito. Número de Radicado: ${ticketId}. Plazo legal de respuesta: máximo 15 días hábiles.`);
  };

  // Enviar Mensaje en el Chat
  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { sender: 'Tú', text: chatInput.trim(), time: 'Ahora' };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { sender: 'Soporte GranColinos', text: 'Gracias por escribirnos. Un agente de administración GC responderá a su consulta a la brevedad.', time: 'Ahora' }
      ]);
    }, 1500);
  };

  const ecosystemModules = [
    { name: 'Tienda Oficial', desc: 'Productos botánicos orgánicos, apiterapia sublingual y concentrados purificados.', link: '/shop' },
    { name: 'Noticias & Análisis', desc: 'Reportajes y análisis del acontecer nacional y global con enfoque analítico.', link: '/noticias' },
    { name: 'Periodismo Alternativo', desc: 'Voz independiente y pluralismo informativo libre de sesgos corporativos.', link: '/periodismo-alternativo' },
    { name: 'Libros & Biblioteca', desc: 'Obras clásicas completas en formato digital de acceso abierto para estudiantes.', link: '/libros' },
    { name: 'Base de Datos Global', desc: 'Buscador académico universal federado y verificación de lotes de laboratorio.', link: '/base-de-datos-global' },
    { name: 'Movimiento Social', desc: 'Plataforma comunitaria de participación y organización social consciente.', link: '/movimiento' },
    { name: 'Servicios Profesionales', desc: 'Red social verificada de profesionales regulados en Colombia.', link: '/servicios' }
  ];

  return (
    <MaintenanceGuard
      routeKey="/informacion"
      defaultTitle="MÓDULO DE ATENCIÓN & PQR / INFO EN CONSTRUCCIÓN"
      defaultSubtitle="Estamos optimizando los canales de atención al ciudadano y respuesta PQR de GranColinos."
      defaultModuleName="Atención & PQR / Info"
      defaultEstimatedDate="Agosto 2026"
    >
      <div className="min-h-screen bg-[#050A07] text-white pt-32 pb-36 px-4 sm:px-6 relative overflow-hidden">
        
        {/* Fondo Verde Esmeralda Corporativo */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#0A1F13] via-[#050A07] to-black opacity-95 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-16">

        {/* HERO CORPORATIVO */}
        <div className="text-center space-y-4 fade-in">
          <div className="inline-flex items-center gap-2 bg-[#10B981]/10 px-4 py-1.5 rounded-full border border-[#10B981]/30">
            <Info size={16} className="text-[#10B981]" />
            <span className="text-[#10B981] text-xs font-bold tracking-[0.25em] uppercase">
              INFORMACIÓN CORPORATIVA & PQR ATENCIÓN AL CIUDADANO
            </span>
          </div>

          <h1 className="font-serif text-4xl md:text-6xl text-[#10B981] drop-shadow-[0_0_25px_rgba(16,185,129,0.4)]">
            Ecosistema GranColinos
          </h1>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#10B981] to-transparent mx-auto"></div>

          <p className="text-gray-300 max-w-3xl mx-auto font-light leading-relaxed text-sm md:text-base">
            GranColinos es una plataforma de APONTE S.A.S. comprometida con el desarrollo científico, la transparencia informativa, el comercio justo y el servicio ciudadano.
          </p>
        </div>

        {/* MÓDULO QUIÉNES SOMOS Y ARQUITECTURA DE ECOSISTEMA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          <div className="bg-[#0A1610]/90 border border-[#10B981]/30 rounded-3xl p-8 backdrop-blur-xl space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <span className="px-3 py-1 bg-[#10B981]/20 text-[#10B981] text-[10px] font-bold uppercase tracking-widest rounded border border-[#10B981]/40 inline-flex items-center gap-1 font-mono">
                <Building size={12} /> HISTORIA & MISIÓN CORPORATIVA
              </span>
              <h3 className="font-serif text-2xl font-bold text-white">Nuestra Visión y Compromiso</h3>
              <p className="text-gray-300 text-xs font-light leading-relaxed">
                Nacidos en el corazón de la Cordillera Central colombiana, integramos la biotecnología botánica con repositorios académicos abiertos, herramientas de comunicación plural e innovación ciudadana.
              </p>
              <p className="text-gray-300 text-xs font-light leading-relaxed">
                Garantizamos que cada producto, publicación y servicio ofertado opere bajo los más estrictos estándares de transparencia, licencias legales e integridad científica.
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-[#10B981]">
              <span>Operado por APONTE S.A.S.</span>
              <span>NIT 901.839.201-4</span>
            </div>
          </div>

          <div className="bg-[#0A1610]/90 border border-[#10B981]/30 rounded-3xl p-8 backdrop-blur-xl space-y-4 shadow-xl">
            <span className="px-3 py-1 bg-[#10B981]/20 text-[#10B981] text-[10px] font-bold uppercase tracking-widest rounded border border-[#10B981]/40 inline-flex items-center gap-1 font-mono">
              <Layers size={12} /> COMPONENTES DEL ECOSISTEMA
            </span>
            <h3 className="font-serif text-xl font-bold text-white">Módulos de la Red GranColinos</h3>

            <div className="space-y-2 font-mono text-xs max-h-64 overflow-y-auto pr-2">
              {ecosystemModules.map((m, idx) => (
                <Link
                  key={idx}
                  href={m.link}
                  className="p-3 bg-black/40 hover:bg-[#10B981]/20 border border-white/10 hover:border-[#10B981]/50 rounded-xl flex items-center justify-between transition-all group"
                >
                  <div>
                    <p className="text-white font-bold group-hover:text-[#10B981]">{m.name}</p>
                    <p className="text-gray-400 text-[10px]">{m.desc}</p>
                  </div>
                  <ArrowRight size={14} className="text-[#10B981] shrink-0" />
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* FORMULARIO OFICIAL DE PQR (PETICIÓN, QUEJA, RECLAMO) */}
        <div className="bg-[#0A1610]/90 border border-[#10B981]/40 rounded-3xl p-6 md:p-10 backdrop-blur-xl shadow-[0_0_50px_rgba(16,185,129,0.15)] space-y-6">
          
          <div className="space-y-2 border-b border-white/10 pb-4">
            <span className="px-3 py-1 bg-[#10B981]/20 text-[#10B981] text-[10px] font-bold uppercase tracking-widest rounded border border-[#10B981]/40 inline-flex items-center gap-1 font-mono">
              <FileText size={12} /> CANAL LEGAL DE ATENCIÓN AL CIUDADANO (LEY 1755 DE 2015)
            </span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-white">Formulario Oficial de PQR</h2>
            <p className="text-gray-300 text-xs font-mono">
              Plazo legal de respuesta: Máximo <strong className="text-[#10B981]">15 días hábiles</strong> contados a partir del radicado.
            </p>
          </div>

          {pqrSent ? (
            <div className="p-8 bg-black/60 border border-green-500/50 rounded-2xl text-center space-y-4 font-mono">
              <CheckCircle size={48} className="text-green-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">¡Su PQR ha sido radicada con éxito!</h3>
              <p className="text-xs text-gray-300">
                Número de Radicado Oficial: <strong className="text-[#10B981]">{pqrTicketId}</strong>
              </p>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                Hemos enviado un correo electrónico de confirmación. Nuestro equipo de administración responderá dentro del término legal estipulado.
              </p>
              <button
                onClick={() => setPqrSent(false)}
                className="px-6 py-2 bg-[#10B981] text-black font-bold uppercase text-xs rounded-xl hover:bg-white"
              >
                Radicar otra solicitud
              </button>
            </div>
          ) : (
            <form onSubmit={handlePqrSubmit} className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label htmlFor="pqr-tipo" className="text-gray-300">Tipo de Solicitud:</label>
                  <select
                    id="pqr-tipo"
                    name="tipo"
                    value={pqrForm.tipo}
                    onChange={(e) => setPqrForm({ ...pqrForm, tipo: e.target.value })}
                    className="w-full bg-[#050A07] border border-white/20 rounded-xl p-3 text-[#10B981] focus:outline-none focus:border-[#10B981]"
                  >
                    <option value="Peticion">Petición / Consulta General</option>
                    <option value="Queja">Queja por Servicio / Atención</option>
                    <option value="Reclamo">Reclamo sobre Producto / Envío</option>
                    <option value="Sugerencia">Sugerencia o Felicitación</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="pqr-nombre" className="text-gray-300">Nombre Completo del Solicitante:</label>
                  <input
                    id="pqr-nombre"
                    name="nombre"
                    type="text"
                    required
                    placeholder="Ej: Juan Pérez"
                    value={pqrForm.nombre}
                    onChange={(e) => setPqrForm({ ...pqrForm, nombre: e.target.value })}
                    className="w-full bg-[#050A07] border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="pqr-email" className="text-gray-300">Correo Electrónico de Contacto:</label>
                  <input
                    id="pqr-email"
                    name="email"
                    type="email"
                    required
                    placeholder="ejemplo@correo.com"
                    value={pqrForm.email}
                    onChange={(e) => setPqrForm({ ...pqrForm, email: e.target.value })}
                    className="w-full bg-[#050A07] border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="pqr-telefono" className="text-gray-300">Teléfono / WhatsApp (Opcional):</label>
                  <input
                    id="pqr-telefono"
                    name="telefono"
                    type="text"
                    placeholder="Ej: +57 300 123 4567"
                    value={pqrForm.telefono}
                    onChange={(e) => setPqrForm({ ...pqrForm, telefono: e.target.value })}
                    className="w-full bg-[#050A07] border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="pqr-numeroOrden" className="text-gray-300">Número de Orden de Compra (Si aplica):</label>
                  <input
                    id="pqr-numeroOrden"
                    name="numeroOrden"
                    type="text"
                    placeholder="Ej: GC-ORD-8849"
                    value={pqrForm.numeroOrden}
                    onChange={(e) => setPqrForm({ ...pqrForm, numeroOrden: e.target.value })}
                    className="w-full bg-[#050A07] border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="pqr-mensaje" className="text-gray-300">Descripción Detallada de la Solicitud:</label>
                <textarea
                  id="pqr-mensaje"
                  name="mensaje"
                  required
                  rows={4}
                  placeholder="Escriba los hechos, fechas y detalles específicos de su petición, queja o reclamo..."
                  value={pqrForm.mensaje}
                  onChange={(e) => setPqrForm({ ...pqrForm, mensaje: e.target.value })}
                  className="w-full bg-[#050A07] border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-gray-400">Sus datos son protegidos bajo la Ley 1581/2012 de Habeas Data.</span>
                <button
                  type="submit"
                  className="px-8 py-3 bg-[#10B981] text-black font-extrabold text-xs uppercase tracking-widest rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center gap-2"
                >
                  <Send size={15} />
                  <span>Radicar PQR Oficial</span>
                </button>
              </div>
            </form>
          )}

        </div>

        {/* CHAT DIRECTO CLIENTE-ADMINISTRACIÓN FLOTANTE */}
        {isChatOpen && (
          <div className="fixed bottom-6 right-6 z-[9999] bg-[#0A1610] border border-[#10B981]/60 rounded-3xl max-w-sm w-full p-4 space-y-4 shadow-[0_0_50px_rgba(16,185,129,0.4)] animate-in fade-in">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
                <span className="font-mono text-xs font-bold text-white">Chat Directo GranColinos</span>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-gray-400 hover:text-white font-mono text-xs" aria-label="Cerrar chat">
                ✕
              </button>
            </div>

            <div className="space-y-2 max-h-52 overflow-y-auto text-xs font-mono p-2 bg-black/60 rounded-xl border border-white/5">
              {chatMessages.map((m, idx) => (
                <div key={idx} className={`p-2 rounded-lg ${m.sender === 'Tú' ? 'bg-[#10B981]/30 text-right ml-4' : 'bg-white/10 text-left mr-4'}`}>
                  <p className="font-bold text-[10px] text-gray-300">{m.sender}</p>
                  <p className="text-white">{m.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChatMessage} className="flex gap-2 font-mono text-xs">
              <input
                id="chat-input"
                name="chatInput"
                type="text"
                placeholder="Escriba su consulta..."
                aria-label="Escriba su consulta"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-[#050A07] border border-white/20 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
              />
              <button type="submit" className="p-2 bg-[#10B981] text-black rounded-xl hover:bg-white transition-all" aria-label="Enviar mensaje">
                <Send size={14} />
              </button>
            </form>
          </div>
        )}

        {/* BOTÓN FLOTANTE ACTIVADOR DE CHAT */}
        {!isChatOpen && (
          <button
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-6 right-6 z-[9998] p-4 bg-[#10B981] text-black rounded-full shadow-[0_0_30px_rgba(16,185,129,0.7)] hover:bg-white transition-all hover:scale-110 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider"
          >
            <MessageSquare size={18} />
            <span className="hidden sm:inline">Soporte & Chat Directo</span>
          </button>
        )}

        {/* TOAST ALERTA */}
        {toastMessage && (
          <div className="fixed bottom-6 left-6 z-[9999] bg-[#10B981] text-black font-mono font-bold text-xs px-5 py-3 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.6)] animate-in fade-in flex items-center gap-2">
            <CheckCircle size={16} /> {toastMessage}
          </div>
        )}

        <PaymentMethodsBadge />
      </div>
    </div>
  </MaintenanceGuard>
  );
}
