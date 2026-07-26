'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Briefcase, ShieldCheck, Search, Filter, MapPin, Award, CheckCircle, User, MessageSquare, UserPlus, Sparkles, AlertCircle, FileText, ExternalLink, Plus, Send, X, ThumbsUp } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import PaymentMethodsBadge from '@/components/PaymentMethodsBadge';

export default function ServiciosPage() {
  const { user } = useAuth();

  // Estados de Búsqueda y Filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [selectedCity, setSelectedCity] = useState('todas');

  // Estado del Perfil del Usuario Autenticado
  const [userProfile, setUserProfile] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedProfileDetail, setSelectedProfileDetail] = useState(null);
  const [activeTab, setActiveTab] = useState('directorio'); // 'directorio' | 'feed' | 'conexiones'

  // Mensajería y Estado de Conexiones
  const [activeChatProfile, setActiveChatProfile] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newChatMessage, setNewChatMessage] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Formulario de Registro Profesional
  const [regForm, setRegForm] = useState({
    nombre: user?.name || '',
    categoria: 'Salud',
    esRegulada: true,
    tarjetaProfesional: '',
    cedula: '',
    ciudad: 'Bogotá D.C.',
    biografia: '',
    experiencia: '',
    educacion: '',
    certificaciones: '',
    portafolioTitulo: '',
    portafolioDesc: '',
    consentimientoHabeasData: false
  });

  // Categorías de Profesiones Reguladas y No Reguladas en Colombia
  const categories = [
    { id: 'todas', name: 'Todas las Profesiones' },
    { id: 'Salud', name: 'Medicina, Odontología & Psicología (Regulada)' },
    { id: 'Derecho', name: 'Derecho & Ciencias Jurídicas (Regulada)' },
    { id: 'Ingenieria', name: 'Arquitectura e Ingeniería (Regulada)' },
    { id: 'Contaduria', name: 'Contaduría & Finanzas (Regulada)' },
    { id: 'Comunicacion', name: 'Comunicación Social & Periodismo' },
    { id: 'Artes', name: 'Artes Visuales, Música & Diseño' },
    { id: 'Filosofia', name: 'Filosofía, Humanidades & Ciencias Sociales' },
    { id: 'Educacion', name: 'Educación & Docencia' },
    { id: 'Tecnologia', name: 'Tecnología & Desarrollo de Software' },
    { id: 'Agropecuario', name: 'Ciencias Agropecuarias & Veterinaria' }
  ];

  // Base de Datos de Perfiles Profesionales Aprobados (Verificados por Admin)
  const [professionals, setProfessionals] = useState([
    {
      id: 'prof-001',
      nombre: 'Dra. María Helena Aponte',
      categoria: 'Salud',
      especialidad: 'Medicina Alternativa & Apiterapia',
      esRegulada: true,
      tarjetaProfesional: 'RM-2024-8849',
      ciudad: 'Bogotá D.C.',
      estadoVerificacion: 'Aprobado',
      biografia: 'Médica cirujana especialista en apiterapia clínica, melitina sublingual e inmunología natural con más de 12 años de experiencia.',
      experiencia: 'Directora Médica en Centro de Salud Botánica APONTE (2016-Presente).',
      educacion: 'Medicina Humana - Universidad Nacional de Colombia.',
      certificaciones: 'Diplomado en Apiterapia Clínica - Sociedad Colombiana de Apiterapia.',
      portafolio: [
        { titulo: 'Estudio de Eficacia de Melitina Sublingual', desc: 'Protocolo de tratamiento complementario para inflamación articular.' }
      ],
      conexionesCount: 142
    },
    {
      id: 'prof-002',
      nombre: 'Dr. Alejandro Vargas',
      categoria: 'Derecho',
      especialidad: 'Derecho Ambiental & Propiedad Intelectual',
      esRegulada: true,
      tarjetaProfesional: 'CSJ-99384-T',
      ciudad: 'Medellín',
      estadoVerificacion: 'Aprobado',
      biografia: 'Abogado consultor en marcas, patentes biológicas, marcas de origen botánico y regulación INVIMA para empresas de ciencias de la vida.',
      experiencia: 'Socio Fundador en Vargas & Asociados Abogados (2018-Presente).',
      educacion: 'Abogado - Universidad de Antioquia.',
      certificaciones: 'Especialización en Propiedad Industrial - Universidad Externado.',
      portafolio: [
        { titulo: 'Registro de Patentes de Extracción Biológica', desc: 'Asesoría legal para registro de patentes de extractos naturales.' }
      ],
      conexionesCount: 98
    },
    {
      id: 'prof-003',
      nombre: 'Lic. Camilo Restrepo',
      categoria: 'Filosofia',
      especialidad: 'Filosofía de la Ciencia & Humanidades',
      esRegulada: false,
      cedula: '1.018.293.882',
      ciudad: 'Cali',
      estadoVerificacion: 'Aprobado',
      biografia: 'Filósofo e investigador sobre epistemología, ética de la apicultura sostenible y movimiento social de preservación ambiental.',
      experiencia: 'Docente e Investigador en Pensamiento Crítico (2019-Presente).',
      educacion: 'Licenciatura en Filosofía - Universidad del Valle.',
      certificaciones: 'Publicación de ensayos filosóficos sobre ciencia comunitaria.',
      portafolio: [
        { titulo: 'Ensayo: La Ética de la Preservación Biológica', desc: 'Publicación en revistas filosóficas de divulgación abierta.' }
      ],
      conexionesCount: 76
    }
  ]);

  // Feed de Actividad Profesional (Fase 5 — Algoritmo de Ranking)
  const [feedPosts, setFeedPosts] = useState([
    {
      id: 'post-1',
      autor: 'Dra. María Helena Aponte',
      profesion: 'Medicina Alternativa & Apiterapia',
      fecha: 'Hace 2 horas',
      contenido: 'Hemos concluido la fase de evaluación clínica sobre la concentración de melitina en gotas sublinguales orgánicas. Excelentes resultados de tolerancia en más de 80 pacientes evaluados.',
      likes: 24,
      comentarios: 6
    },
    {
      id: 'post-2',
      autor: 'Dr. Alejandro Vargas',
      profesion: 'Derecho Ambiental & Propiedad Intelectual',
      fecha: 'Hace 5 horas',
      contenido: 'Actualización Regulatoria INVIMA 2026: Nuevos lineamientos para la certificación de productos fitoterapéuticos y apícolas en Colombia. Asesorando a productores locales para cumplimiento.',
      likes: 18,
      comentarios: 3
    }
  ]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Enviar Formulario de Registro Profesional
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regForm.consentimientoHabeasData) {
      showToast('Debe aceptar el consentimiento explícito de Habeas Data para el tratamiento de su Hoja de Vida y Documentos.');
      return;
    }

    const newProf = {
      id: `prof-${Date.now()}`,
      nombre: regForm.nombre || 'Profesional GranColinos',
      categoria: regForm.categoria,
      especialidad: `${regForm.categoria} — ${regForm.ciudad}`,
      esRegulada: regForm.esRegulada,
      tarjetaProfesional: regForm.tarjetaProfesional,
      cedula: regForm.cedula,
      ciudad: regForm.ciudad,
      estadoVerificacion: 'Pendiente', // EXIGENCIA: ESTADO PENDIENTE HASTA APROBACIÓN POR ADMIN
      biografia: regForm.biografia,
      experiencia: regForm.experiencia,
      educacion: regForm.educacion,
      certificaciones: regForm.certificaciones,
      portafolio: [
        { titulo: regForm.portafolioTitulo || 'Proyecto Destacado', desc: regForm.portafolioDesc || 'Descripción del trabajo profesional.' }
      ],
      conexionesCount: 0
    };

    setUserProfile(newProf);
    setShowRegisterModal(false);
    showToast('Su perfil profesional ha sido registrado y se encuentra en estado "PENDIENTE DE VERIFICACIÓN POR ADMINISTRACIÓN". No será visible públicamente hasta ser aprobado.');
  };

  // Conectar con Profesional (Grafo de Conexiones Bidireccional - Fase 4)
  const handleConnect = (prof) => {
    showToast(`Solicitud de conexión enviada a ${prof.nombre}. Una vez aceptada se habilitará la mensajería 1 a 1.`);
  };

  // Iniciar Chat 1 a 1
  const handleOpenChat = (prof) => {
    setActiveChatProfile(prof);
    setChatMessages([
      { sender: prof.nombre, text: `Hola, soy ${prof.nombre}. ¿En qué consulta o proyecto profesional te puedo colaborar?`, time: '12:00 PM' }
    ]);
  };

  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!newChatMessage.trim()) return;
    const msg = { sender: 'Tú', text: newChatMessage.trim(), time: 'Ahora' };
    setChatMessages([...chatMessages, msg]);
    setNewChatMessage('');
  };

  const filteredProfessionals = professionals.filter(p => {
    // REGLA STRICTA: SOLO MOSTRAR PERFILES APROBADOS
    if (p.estadoVerificacion !== 'Aprobado') return false;

    const q = searchQuery.toLowerCase().trim();
    const matchQuery = !q || p.nombre.toLowerCase().includes(q) || p.biografia.toLowerCase().includes(q) || p.especialidad.toLowerCase().includes(q);
    const matchCat = selectedCategory === 'todas' || p.categoria === selectedCategory;
    const matchCity = selectedCity === 'todas' || p.ciudad === selectedCity;

    return matchQuery && matchCat && matchCity;
  });

  return (
    <div className="min-h-screen bg-[#060911] text-white pt-32 pb-36 px-4 sm:px-6 relative overflow-hidden">
      
      {/* Fondo Púrpura/Azul de Red Profesional */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#130B24] via-[#060911] to-black opacity-90 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-10">

        {/* HERO Y TÍTULO DEL MÓDULO DE SERVICIOS */}
        <div className="text-center space-y-4 fade-in">
          <div className="inline-flex items-center gap-2 bg-[#A855F7]/10 px-4 py-1.5 rounded-full border border-[#A855F7]/30">
            <Briefcase size={16} className="text-[#A855F7]" />
            <span className="text-[#A855F7] text-xs font-bold tracking-[0.25em] uppercase">
              RED SOCIAL PROFESIONAL VERIFICADA GRANCOLINOS
            </span>
          </div>

          <h1 className="font-serif text-4xl md:text-6xl text-[#A855F7] drop-shadow-[0_0_25px_rgba(168,85,247,0.4)]">
            Directorio de Servicios & Profesionales
          </h1>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#A855F7] to-transparent mx-auto"></div>

          <p className="text-gray-300 max-w-3xl mx-auto font-light leading-relaxed text-sm md:text-base">
            Conecte con médicos, abogados, filósofos, ingenieros y creadores verificados por la administración de GranColinos. Garantía de autenticidad en credenciales profesionales.
          </p>

          {/* BOTÓN CREAR MI PERFIL PROFESIONAL */}
          <div className="pt-2 flex items-center justify-center gap-4">
            <button
              onClick={() => setShowRegisterModal(true)}
              className="px-8 py-3.5 bg-[#A855F7] text-white font-extrabold text-xs uppercase tracking-widest rounded-2xl hover:bg-white hover:text-black transition-all shadow-[0_0_30px_rgba(168,85,247,0.5)] flex items-center gap-2"
            >
              <Plus size={16} />
              <span>Registrar mi Perfil Profesional</span>
            </button>
          </div>

          {/* MENSAJE DE ESTADO DE VERIFICACIÓN DEL PROPIO USUARIO */}
          {userProfile && (
            <div className="max-w-xl mx-auto bg-black/60 border border-[#A855F7]/40 rounded-2xl p-4 text-xs font-mono text-left space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[#A855F7] font-bold">Estado de tu Perfil:</span>
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                  userProfile.estadoVerificacion === 'Aprobado' ? 'bg-green-500/20 text-green-400 border border-green-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}>
                  {userProfile.estadoVerificacion === 'Aprobado' ? '✓ VERIFICADO Y APROBADO' : '⏳ PENDIENTE DE APROBACIÓN POR ADMINISTRACIÓN'}
                </span>
              </div>
              <p className="text-gray-400 text-[11px]">
                {userProfile.estadoVerificacion === 'Pendiente' 
                  ? 'Su perfil está siendo revisado por el equipo de verificación de GranColinos. No será visible en el directorio público hasta que se aprueben las credenciales cargadas.' 
                  : 'Su perfil es visible públicamente en el directorio de profesionales.'}
              </p>
            </div>
          )}
        </div>

        {/* NAVEGACIÓN ENTRE TAB DE DIRECTORIO Y FEED */}
        <div className="flex items-center justify-center gap-3 font-mono text-xs">
          <button
            onClick={() => setActiveTab('directorio')}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all border ${
              activeTab === 'directorio' ? 'bg-[#A855F7] text-white border-[#A855F7] shadow-lg' : 'bg-black/60 text-gray-400 border-white/10 hover:text-white'
            }`}
          >
            Directorio Verificado ({filteredProfessionals.length})
          </button>
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all border ${
              activeTab === 'feed' ? 'bg-[#A855F7] text-white border-[#A855F7] shadow-lg' : 'bg-black/60 text-gray-400 border-white/10 hover:text-white'
            }`}
          >
            Feed de Actividad Profesional
          </button>
        </div>

        {/* CONTENIDO SEGÚN TAB SELECCIONADA */}
        {activeTab === 'directorio' && (
          <div className="space-y-8">
            
            {/* BUSCADOR Y MATRIZ DE FILTROS */}
            <div className="bg-[#0C1222]/90 border border-[#A855F7]/40 rounded-3xl p-6 backdrop-blur-xl space-y-4 shadow-[0_0_40px_rgba(168,85,247,0.15)]">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-4 top-3.5 text-[#A855F7]" size={20} />
                  <input
                    type="text"
                    placeholder="Buscar por nombre, especialidad o profesión (ej: Medicina, Abogado, Filosofía)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#060911] border border-[#A855F7]/30 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#A855F7] font-mono"
                  />
                </div>

                <div className="w-full md:w-64">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-[#060911] text-[#A855F7] text-xs font-semibold py-3.5 px-3 rounded-2xl border border-white/20 focus:outline-none focus:border-[#A855F7] cursor-pointer"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id} className="bg-[#060911] text-white">{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* GRID DE TARJETAS DE PROFESIONALES VERIFICADOS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredProfessionals.map((prof) => (
                <div
                  key={prof.id}
                  className="bg-[#0C1222]/80 border border-white/15 hover:border-[#A855F7]/60 rounded-3xl p-6 backdrop-blur-xl shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 group hover:-translate-y-1"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <span className="px-2.5 py-1 bg-green-500/15 text-green-400 text-[10px] font-bold uppercase tracking-widest rounded border border-green-500/30 flex items-center gap-1">
                        <ShieldCheck size={13} /> VERIFICADO
                      </span>
                      <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
                        <MapPin size={12} className="text-[#A855F7]" /> {prof.ciudad}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#A855F7] transition-colors">{prof.nombre}</h3>
                      <p className="text-[#A855F7] text-xs font-mono font-semibold">{prof.especialidad}</p>
                    </div>

                    <p className="text-gray-300 text-xs font-light leading-relaxed line-clamp-3 bg-black/40 p-3 rounded-xl border border-white/5 italic">
                      "{prof.biografia}"
                    </p>

                    {prof.esRegulada && prof.tarjetaProfesional && (
                      <div className="p-2 bg-[#A855F7]/10 rounded-lg border border-[#A855F7]/30 text-[10px] font-mono text-gray-300">
                        <span>Registro Profesional: </span>
                        <strong className="text-white">{prof.tarjetaProfesional}</strong>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2 font-mono text-xs">
                    <button
                      onClick={() => setSelectedProfileDetail(prof)}
                      className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] uppercase rounded-xl border border-white/10 transition-all"
                    >
                      Ver Hoja de Vida
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleConnect(prof)}
                        className="p-2 bg-[#A855F7]/20 text-[#A855F7] hover:bg-[#A855F7] hover:text-white rounded-xl border border-[#A855F7]/40 transition-all"
                        title="Enviar Solicitud de Conexión"
                      >
                        <UserPlus size={15} />
                      </button>

                      <button
                        onClick={() => handleOpenChat(prof)}
                        className="p-2 bg-[#A855F7] text-white hover:bg-white hover:text-black rounded-xl transition-all shadow-md"
                        title="Enviar Mensaje Directo"
                      >
                        <MessageSquare size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FEED DE ACTIVIDAD PROFESIONAL (TAB FEED) */}
        {activeTab === 'feed' && (
          <div className="max-w-3xl mx-auto space-y-6">
            {feedPosts.map(post => (
              <div key={post.id} className="bg-[#0C1222]/80 border border-white/15 rounded-3xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <h4 className="font-serif text-base font-bold text-white">{post.autor}</h4>
                    <p className="text-[#A855F7] text-xs font-mono">{post.profesion}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">{post.fecha}</span>
                </div>

                <p className="text-gray-200 text-sm font-light leading-relaxed">
                  {post.contenido}
                </p>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-gray-400">
                  <button className="flex items-center gap-1.5 hover:text-[#A855F7] transition-colors">
                    <ThumbsUp size={14} /> <span>{post.likes} Me gusta</span>
                  </button>
                  <button className="flex items-center gap-1.5 hover:text-[#A855F7] transition-colors">
                    <MessageSquare size={14} /> <span>{post.comentarios} Comentarios</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODAL REGISTRO DE PERFIL PROFESIONAL */}
        {showRegisterModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl animate-in fade-in overflow-y-auto">
            <div className="bg-[#0C1222] border border-[#A855F7]/50 rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6 relative my-8 shadow-[0_0_90px_rgba(168,85,247,0.3)]">
              <button
                onClick={() => setShowRegisterModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
              >
                <X size={16} />
              </button>

              <div className="space-y-1 border-b border-[#A855F7]/20 pb-3">
                <span className="px-3 py-1 bg-[#A855F7]/20 text-[#A855F7] text-[10px] font-bold uppercase tracking-widest rounded border border-[#A855F7]/40 inline-flex items-center gap-1">
                  <UserPlus size={12} /> REGISTRO DE CREDENCIALES PROFESIONALES
                </span>
                <h3 className="font-serif text-xl font-bold text-white">Formulario de Verificación Profesional</h3>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-gray-300">Nombre Completo:</label>
                    <input
                      type="text"
                      required
                      value={regForm.nombre}
                      onChange={(e) => setRegForm({ ...regForm, nombre: e.target.value })}
                      className="w-full bg-[#060911] border border-white/20 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#A855F7]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-300">Categoría Profesional:</label>
                    <select
                      value={regForm.categoria}
                      onChange={(e) => setRegForm({ ...regForm, categoria: e.target.value })}
                      className="w-full bg-[#060911] border border-white/20 rounded-xl p-2.5 text-[#A855F7] focus:outline-none focus:border-[#A855F7]"
                    >
                      <option value="Salud">Salud (Medicina, Odontología, Psicología)</option>
                      <option value="Derecho">Derecho (Abogado/Jurista)</option>
                      <option value="Ingenieria">Arquitectura e Ingeniería</option>
                      <option value="Contaduria">Contaduría & Finanzas</option>
                      <option value="Comunicacion">Comunicación Social & Periodismo</option>
                      <option value="Artes">Artes Visuales & Música</option>
                      <option value="Filosofia">Filosofía & Humanidades</option>
                    </select>
                  </div>
                </div>

                {/* CAMPO DE VERIFICACIÓN REGULADA VS NO REGULADA */}
                {['Salud', 'Derecho', 'Ingenieria', 'Contaduria'].includes(regForm.categoria) ? (
                  <div className="p-3 bg-[#A855F7]/10 rounded-xl border border-[#A855F7]/40 space-y-2">
                    <span className="text-[#A855F7] font-bold block">Profesión Regulada en Colombia:</span>
                    <label className="text-gray-300 block">Número de Tarjeta / Registro Profesional Obligatorio:</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: RM-2024-9948 / CSJ-88492-T"
                      value={regForm.tarjetaProfesional}
                      onChange={(e) => setRegForm({ ...regForm, tarjetaProfesional: e.target.value })}
                      className="w-full bg-[#060911] border border-white/20 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#A855F7]"
                    />
                  </div>
                ) : (
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-2">
                    <span className="text-gray-300 font-bold block">Profesión No Regulada:</span>
                    <label className="text-gray-300 block">Número de Cédula (Verificación de Identidad):</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: 1.018.293.882"
                      value={regForm.cedula}
                      onChange={(e) => setRegForm({ ...regForm, cedula: e.target.value })}
                      className="w-full bg-[#060911] border border-white/20 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#A855F7]"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-gray-300">Biografía Profesional Resumida:</label>
                  <textarea
                    required
                    rows={3}
                    value={regForm.biografia}
                    onChange={(e) => setRegForm({ ...regForm, biografia: e.target.value })}
                    className="w-full bg-[#060911] border border-white/20 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#A855F7]"
                    placeholder="Describa su trayectoria profesional, áreas de enfoque y servicios ofertados..."
                  />
                </div>

                {/* CHECKBOX CONSENTIMIENTO HABEAS DATA LEY 1581/2012 */}
                <div className="p-3 bg-black/60 rounded-xl border border-white/10 flex items-start gap-2 text-[11px] text-gray-300">
                  <input
                    type="checkbox"
                    id="consentimiento"
                    checked={regForm.consentimientoHabeasData}
                    onChange={(e) => setRegForm({ ...regForm, consentimientoHabeasData: e.target.checked })}
                    className="mt-0.5"
                  />
                  <label htmlFor="consentimiento">
                    Acepto explícitamente el tratamiento de mis datos personales, Hoja de Vida y documentos de identificación conforme a la Ley 1581/2012 (Habeas Data) y los <Link href="/habeas-data" className="text-[#A855F7] underline">Términos de Servicio GranColinos</Link>.
                  </label>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowRegisterModal(false)}
                    className="px-5 py-2.5 bg-white/10 text-white rounded-xl uppercase font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#A855F7] text-white rounded-xl uppercase font-bold hover:bg-white hover:text-black transition-all shadow-lg"
                  >
                    Enviar a Verificación
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL DETALLE DE HOJA DE VIDA Y PORTAFOLIO */}
        {selectedProfileDetail && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl animate-in fade-in">
            <div className="bg-[#0C1222] border border-[#A855F7]/50 rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6 relative shadow-[0_0_90px_rgba(168,85,247,0.3)]">
              <button
                onClick={() => setSelectedProfileDetail(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
              >
                <X size={16} />
              </button>

              <div className="space-y-1 border-b border-[#A855F7]/20 pb-3">
                <span className="px-3 py-1 bg-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-widest rounded border border-green-500/40 inline-flex items-center gap-1">
                  <ShieldCheck size={12} /> HOJA DE VIDA VERIFICADA
                </span>
                <h3 className="font-serif text-2xl font-bold text-white">{selectedProfileDetail.nombre}</h3>
                <p className="text-[#A855F7] text-xs font-mono font-bold">{selectedProfileDetail.especialidad}</p>
              </div>

              <div className="space-y-4 font-mono text-xs text-gray-300 max-h-96 overflow-y-auto pr-2">
                <div>
                  <h4 className="text-white font-bold uppercase border-b border-white/10 pb-1 mb-2">Experiencia Profesional</h4>
                  <p className="bg-black/50 p-3 rounded-xl border border-white/5">{selectedProfileDetail.experiencia}</p>
                </div>

                <div>
                  <h4 className="text-white font-bold uppercase border-b border-white/10 pb-1 mb-2">Educación & Títulos</h4>
                  <p className="bg-black/50 p-3 rounded-xl border border-white/5">{selectedProfileDetail.educacion}</p>
                </div>

                <div>
                  <h4 className="text-white font-bold uppercase border-b border-white/10 pb-1 mb-2">Portafolio de Proyectos Destacados</h4>
                  {(selectedProfileDetail.portafolio || []).map((proj, idx) => (
                    <div key={idx} className="bg-black/50 p-3 rounded-xl border border-white/5 space-y-1">
                      <p className="text-[#A855F7] font-bold">{proj.titulo}</p>
                      <p className="text-gray-300 text-[11px]">{proj.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CHAT DIRECTO 1 A 1 ENTRE PROFESIONALES */}
        {activeChatProfile && (
          <div className="fixed bottom-6 right-6 z-[9999] bg-[#0C1222] border border-[#A855F7]/60 rounded-3xl max-w-sm w-full p-4 space-y-4 shadow-[0_0_50px_rgba(168,85,247,0.4)] animate-in fade-in">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                <span className="font-mono text-xs font-bold text-white truncate">{activeChatProfile.nombre}</span>
              </div>
              <button onClick={() => setActiveChatProfile(null)} className="text-gray-400 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto text-xs font-mono p-2 bg-black/60 rounded-xl border border-white/5">
              {chatMessages.map((m, idx) => (
                <div key={idx} className={`p-2 rounded-lg ${m.sender === 'Tú' ? 'bg-[#A855F7]/30 text-right ml-4' : 'bg-white/10 text-left mr-4'}`}>
                  <p className="font-bold text-[10px] text-gray-300">{m.sender}</p>
                  <p className="text-white">{m.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChatMessage} className="flex gap-2">
              <input
                type="text"
                placeholder="Escribe un mensaje..."
                value={newChatMessage}
                onChange={(e) => setNewChatMessage(e.target.value)}
                className="flex-1 bg-[#060911] border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#A855F7]"
              />
              <button type="submit" className="p-2 bg-[#A855F7] text-white rounded-xl hover:bg-white hover:text-black transition-all">
                <Send size={14} />
              </button>
            </form>
          </div>
        )}

        {/* TOAST NOTIFICACIÓN */}
        {toastMessage && (
          <div className="fixed bottom-6 left-6 z-[9999] bg-[#A855F7] text-white font-mono font-bold text-xs px-5 py-3 rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.6)] animate-in fade-in flex items-center gap-2">
            <CheckCircle size={16} /> {toastMessage}
          </div>
        )}

        <PaymentMethodsBadge />
      </div>
    </div>
  );
}
