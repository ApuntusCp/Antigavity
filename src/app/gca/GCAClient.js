'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Playfair_Display, Inter } from 'next/font/google';
import BlueprintSVG from '@/components/BlueprintSVG';
import { db } from '@/utils/firebase';
import { doc, onSnapshot, collection } from 'firebase/firestore';
import { Compass, Sparkles, Building2, Trees, Ruler, ArrowUpRight, Phone, Mail, Award, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';

const playfair = Playfair_Display({ subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });

export default function GCAClient() {
  const [isLoaded, setIsLoaded] = useState(false);

  // Real-time Firestore states - NO generic/dummy hardcoded fallbacks!
  const [branding, setBranding] = useState({
    showHero: true,
    showStats: true,
    showManifesto: true,
    showCeo: true,
    showServices: true,
    showProjects: true,
    showPortafolioBtn: true,
    heroTitle: 'Gran Colina Arquitectos',
    heroSubtitle: 'Donde la naturaleza, el lujo y la geometría se encuentran para crear espacios atemporales.',
    heroImageUrl: '',
    heroVideoUrl: '',
    ceoName: 'CEO, Aponte SAS',
    ceoRole: 'Fundador & Director Creativo',
    ceoBio1: 'Como mente creativa detrás del ecosistema Gran Colinos, mi visión siempre ha sido entrelazar el bienestar humano con la perfección de la naturaleza.',
    ceoBio2: 'Gran Colina Arquitectos nace como la máxima expresión de esta filosofía. No solo creamos productos botánicos; construimos los santuarios donde la vida transcurre. Desde el diseño de interiores meticuloso hasta el desarrollo de infraestructuras a gran escala, aplicamos el mismo rigor, lujo y conexión natural que define a Aponte SAS.',
    ceoQuote: 'La arquitectura no es solo construir; es esculpir el entorno para elevar el espíritu.',
    ceoImageUrl: '',
    statProjects: '45+',
    statMeters: '120.000m²',
    statExperience: '8+ Años',
    servicesTitle: 'Nuestros Servicios de Firma',
    servicesSubtitle: 'Ejecutados con estándares de precisión internacional y atención personalizada en cada fase.',
    services: [] // Default empty array, NO hardcoded sample cards!
  });

  const [contact, setContact] = useState({
    phone: '+57 302 769 7935',
    email: 'contacto@grancolinos.com',
    whatsappMessage: 'Hola Gran Colina Arquitectos, me gustaría agendar una consultoría privada de diseño.'
  });

  const [projects, setProjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [selectedProject, setSelectedProject] = useState(null);

  // Set up real-time Firebase subscriptions
  useEffect(() => {
    // 1. Subscribe to Branding/CEO/Services settings
    const unsubBranding = onSnapshot(
      doc(db, 'settings', 'gca_branding'),
      (snapshot) => {
        if (snapshot.exists()) {
          setBranding(prev => ({ ...prev, ...snapshot.data() }));
        }
        setIsLoaded(true);
      },
      (err) => {
        console.log("Branding snapshot sub:", err);
        setIsLoaded(true);
      }
    );

    // 2. Subscribe to Contact settings
    const unsubContact = onSnapshot(
      doc(db, 'settings', 'contact_info'),
      (snapshot) => {
        if (snapshot.exists()) {
          setContact(prev => ({ ...prev, ...snapshot.data() }));
        }
      },
      (err) => console.log("Contact snapshot sub:", err)
    );

    // 3. Subscribe to Projects collection
    const unsubProjects = onSnapshot(
      collection(db, 'gca_projects'),
      (snapshot) => {
        const list = [];
        snapshot.forEach(docSnap => {
          list.push({ id: docSnap.id, ...docSnap.data() });
        });
        setProjects(list);
      },
      (err) => console.log("Projects snapshot sub:", err)
    );

    return () => {
      unsubBranding();
      unsubContact();
      unsubProjects();
    };
  }, []);

  const categories = ['Todos', 'Diseño de Interiores', 'Arquitectura Paisajística', 'Construcción a Gran Escala'];

  const filteredProjects = activeCategory === 'Todos'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  const cleanPhone = contact.phone ? contact.phone.replace(/[^0-9]/g, '') : '573027697935';
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(contact.whatsappMessage || 'Hola Gran Colina Arquitectos')}`;

  // While loading initial real-time data from Firestore, show a sleek luxury loading screen over the leather texture
  if (!isLoaded) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center text-[#D4AF37] space-y-6 bg-transparent">
        <div className="relative flex items-center justify-center">
          <Compass size={56} className="animate-spin text-[#D4AF37]" style={{ animationDuration: '8s' }} />
          <div className="absolute inset-0 rounded-full border border-[#D4AF37]/30 animate-ping opacity-25" />
        </div>
        <div className="text-center space-y-2">
          <h2 className={`${playfair.className} text-xl font-bold tracking-[0.3em] uppercase text-[#FFF5D0]`}>
            Gran Colina Arquitectos
          </h2>
          <p className="text-xs text-gray-400 font-mono tracking-widest uppercase">Cargando Estudio Directivo...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen text-[#E2E8F0] selection:bg-[#D4AF37] selection:text-black overflow-hidden bg-transparent">

      {/* HERO CINEMATOGRÁFICO CON BLUEPRINT ANIMADO */}
      {branding.showHero !== false && (
        <section className="relative w-full min-h-[92vh] flex items-center justify-center border-b border-[#D4AF37]/20 pt-20 bg-transparent">
          
          {/* Background Video or Parallax Image */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-transparent z-20" />
            
            {branding.heroVideoUrl ? (
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-50 z-0"
                src={branding.heroVideoUrl}
              />
            ) : branding.heroImageUrl ? (
              <div
                className="w-full h-full bg-cover bg-center opacity-40 scale-105 transition-transform duration-1000 z-0"
                style={{ backgroundImage: `url('${branding.heroImageUrl}')` }}
              />
            ) : (
              <div className="w-full h-full bg-transparent opacity-80 z-0" />
            )}
          </div>

          {/* Overlay blueprint vectors */}
          <BlueprintSVG />

          {/* Hero Content */}
          <div className="relative z-30 max-w-5xl mx-auto px-6 text-center space-y-8">
            
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold tracking-[0.3em] uppercase backdrop-blur-md animate-pulse">
              <Compass size={14} className="animate-spin" style={{ animationDuration: '20s' }} />
              Estudio de Arquitectura & Construcción
            </div>

            <h1 className={`${playfair.className} text-5xl sm:text-7xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF5D0] to-[#D4AF37] leading-[1.08] tracking-tight drop-shadow-[0_10px_30px_rgba(212,175,55,0.25)]`}>
              {branding.heroTitle || 'Gran Colina Arquitectos'}
            </h1>

            <p className={`${inter.className} text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed drop-shadow-md`}>
              {branding.heroSubtitle}
            </p>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B89220] text-black font-bold tracking-[0.2em] text-xs uppercase rounded-none hover:shadow-[0_0_40px_rgba(212,175,55,0.4)] transition-all duration-300 flex items-center gap-3 group"
              >
                Agendar Consultoría Privada
                <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>

              {branding.showPortafolioBtn !== false && (
                <a
                  href="#portafolio"
                  className="px-8 py-4 bg-transparent border border-[#D4AF37]/40 text-[#D4AF37] font-semibold tracking-[0.2em] text-xs uppercase hover:bg-[#D4AF37]/10 transition-all duration-300"
                >
                  Ver Portafolio
                </a>
              )}
            </div>

            {/* Stats Bar */}
            {branding.showStats !== false && (
              <div className="pt-16 grid grid-cols-3 gap-6 max-w-3xl mx-auto border-t border-[#D4AF37]/15">
                <div>
                  <div className={`${playfair.className} text-3xl md:text-5xl font-bold text-[#D4AF37]`}>
                    {branding.statProjects}
                  </div>
                  <div className="text-xs text-gray-400 font-medium tracking-widest uppercase mt-1">Obras Ejecutadas</div>
                </div>
                <div>
                  <div className={`${playfair.className} text-3xl md:text-5xl font-bold text-[#FFF5D0]`}>
                    {branding.statMeters}
                  </div>
                  <div className="text-xs text-gray-400 font-medium tracking-widest uppercase mt-1">Diseñados & Construidos</div>
                </div>
                <div>
                  <div className={`${playfair.className} text-3xl md:text-5xl font-bold text-[#D4AF37]`}>
                    {branding.statExperience}
                  </div>
                  <div className="text-xs text-gray-400 font-medium tracking-widest uppercase mt-1">Rigor & Vanguardia</div>
                </div>
              </div>
            )}

          </div>
        </section>
      )}

      {/* SECCIÓN MANIFIESTO FILOSÓFICO - 100% TRANSPARENTE SOBRE EL CUERO */}
      {branding.showManifesto !== false && (
        <section className="py-28 relative bg-transparent border-b border-[#D4AF37]/10">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <span className="text-[#D4AF37] font-bold text-xs tracking-[0.3em] uppercase block mb-4">Filosofía Arquitectónica</span>
            <h2 className={`${playfair.className} text-3xl md:text-5xl text-white leading-tight font-normal max-w-4xl mx-auto italic`}>
              "No diseñamos simples estructuras de concreto y cristal; creamos santuarios vivos donde la luz, la naturaleza y la comodidad convergen en perfecta armonía."
            </h2>
            <div className="w-20 h-[1px] bg-[#D4AF37] mx-auto mt-8 opacity-60" />
          </div>
        </section>
      )}

      {/* SECCIÓN CEO / PERFIL DIRECTIVO - 100% TRANSPARENTE SOBRE EL CUERO */}
      {branding.showCeo !== false && (
        <section className="py-32 relative bg-transparent">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-12 gap-12 items-center">
              
              {/* Foto del CEO */}
              <div className="md:col-span-5 relative">
                <div className="relative w-full rounded-sm overflow-hidden border border-[#D4AF37]/30 shadow-[0_0_60px_rgba(212,175,55,0.12)] group bg-transparent">
                  {branding.ceoImageUrl ? (
                    <img
                      src={branding.ceoImageUrl}
                      alt={branding.ceoName}
                      className="w-full h-auto max-h-[650px] object-cover object-top filter contrast-[1.05] group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-80 min-h-[420px] bg-black/20 flex flex-col items-center justify-center p-8 text-center space-y-4">
                      <div className="w-20 h-20 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                        <Building2 size={38} />
                      </div>
                      <span className="text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase">Gran Colina Arquitectos</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 pointer-events-none" />
                  <div className="absolute bottom-6 left-6 right-6 z-10">
                    <span className="text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase block">{branding.ceoRole}</span>
                    <h3 className={`${playfair.className} text-2xl text-white font-bold`}>{branding.ceoName}</h3>
                  </div>
                </div>
              </div>

              {/* Biografía & Visión */}
              <div className="md:col-span-7 space-y-6">
                <div className="inline-block px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase">
                  Visión Directiva & Liderazgo
                </div>

                <h2 className={`${playfair.className} text-4xl md:text-5xl text-white font-bold leading-tight`}>
                  Arquitectura de Autor Respaldada por <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#FFF1C5]">Aponte SAS</span>
                </h2>

                <div className={`${inter.className} text-gray-300 font-light text-base md:text-lg leading-relaxed space-y-4`}>
                  <p>{branding.ceoBio1}</p>
                  <p>{branding.ceoBio2}</p>
                </div>

                <blockquote className="p-6 bg-black/20 border-l-2 border-[#D4AF37] rounded-r-lg text-[#FFF5D0] italic text-lg font-light">
                  "{branding.ceoQuote}"
                </blockquote>

                <div className="pt-4 flex items-center gap-6">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-[#D4AF37] text-black font-bold tracking-widest text-xs uppercase hover:bg-white transition-colors"
                  >
                    Contactar con Dirección
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* SECCIÓN SERVICIOS PREMIUM - 100% TRANSPARENTE SOBRE EL CUERO */}
      {branding.showServices !== false && (
        <section className="py-28 bg-transparent border-t border-b border-[#D4AF37]/15">
          <div className="max-w-7xl mx-auto px-6">
            
            <div className="text-center mb-16 space-y-3">
              <span className="text-[#D4AF37] font-bold text-xs tracking-[0.3em] uppercase">Especialidades</span>
              <h2 className={`${playfair.className} text-4xl md:text-5xl text-white font-bold`}>
                {branding.servicesTitle || 'Nuestros Servicios de Firma'}
              </h2>
              {branding.servicesSubtitle && (
                <p className="text-gray-400 max-w-xl mx-auto text-sm font-light">
                  {branding.servicesSubtitle}
                </p>
              )}
            </div>

            {branding.services && branding.services.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-8">
                {branding.services.map((service, i) => {
                  const getIcon = (iconName) => {
                    switch (iconName) {
                      case 'Sparkles': return <Sparkles size={28} />;
                      case 'Trees': return <Trees size={28} />;
                      case 'Building2': return <Building2 size={28} />;
                      case 'Compass': return <Compass size={28} />;
                      case 'Wrench': return <Ruler size={28} />;
                      default: return <Sparkles size={28} />;
                    }
                  };

                  return (
                    <div key={service.id || i} className="bg-transparent p-8 border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all duration-500 rounded-sm group relative overflow-hidden flex flex-col justify-between hover:bg-black/10">
                      <div>
                        <div className="w-14 h-14 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] mb-8 group-hover:scale-110 transition-transform">
                          {getIcon(service.icon)}
                        </div>
                        <h3 className={`${playfair.className} text-2xl text-white font-bold mb-4 group-hover:text-[#D4AF37] transition-colors`}>
                          {service.title}
                        </h3>
                        <p className="text-gray-400 font-light text-sm leading-relaxed">
                          {service.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 p-8 border border-white/5 rounded-2xl bg-transparent">
                <p className="text-gray-400 text-sm">Configura tus servicios desde GC Admin para verlos aquí.</p>
              </div>
            )}

          </div>
        </section>
      )}

      {/* SECCIÓN PORTAFOLIO / GALERÍA EN VIVO - 100% TRANSPARENTE SOBRE EL CUERO */}
      {branding.showProjects !== false && (
        <section id="portafolio" className="py-32 bg-transparent">
          <div className="max-w-7xl mx-auto px-6">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <span className="text-[#D4AF37] font-bold text-xs tracking-[0.3em] uppercase block mb-2">Galería en Tiempo Real</span>
                <h2 className={`${playfair.className} text-4xl md:text-5xl text-white font-bold`}>Proyectos Destacados</h2>
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase rounded-full transition-all ${
                      activeCategory === cat
                        ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20 font-bold'
                        : 'bg-transparent text-gray-400 hover:text-white border border-white/20'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid de Proyectos */}
            {filteredProjects.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((proj) => (
                  <div
                    key={proj.id}
                    onClick={() => setSelectedProject(proj)}
                    className="bg-transparent border border-[#D4AF37]/30 rounded-sm overflow-hidden group cursor-pointer hover:border-[#D4AF37] transition-all duration-500 flex flex-col hover:bg-black/10"
                  >
                    <div className="relative h-64 overflow-hidden bg-black/40">
                      <img
                        src={proj.imageUrl}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-3 left-3 bg-black/80 border border-[#D4AF37]/40 text-[#D4AF37] px-3 py-1 text-[10px] uppercase font-bold tracking-widest rounded-none">
                        {proj.category}
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className={`${playfair.className} text-xl text-white font-bold group-hover:text-[#D4AF37] transition-colors`}>
                          {proj.title}
                        </h3>
                        <p className="text-gray-400 text-xs font-light mt-2 line-clamp-3 leading-relaxed">
                          {proj.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-[#D4AF37] font-semibold">
                        <span>Ver Detalles de Obra</span>
                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 p-8 border border-white/5 rounded-2xl bg-transparent">
                <p className="text-gray-400 text-sm">No hay proyectos publicados en esta categoría todavía.</p>
              </div>
            )}

          </div>
        </section>
      )}

      {/* MODAL DETALLE DE PROYECTO */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#080E0B] border border-[#D4AF37]/50 max-w-3xl w-full rounded-lg overflow-hidden shadow-2xl space-y-6">
            <div className="relative h-80">
              <img src={selectedProject.imageUrl} alt={selectedProject.title} className="w-full h-full object-cover" />
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 bg-black/80 text-[#D4AF37] w-10 h-10 rounded-full flex items-center justify-center text-lg hover:bg-[#D4AF37] hover:text-black transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <span className="text-[#D4AF37] text-xs uppercase font-bold tracking-widest">{selectedProject.category}</span>
              <h3 className={`${playfair.className} text-3xl text-white font-bold`}>{selectedProject.title}</h3>
              <p className="text-gray-300 text-sm font-light leading-relaxed">{selectedProject.description}</p>
              <div className="pt-4 flex justify-end">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors"
                >
                  Consultar sobre este proyecto
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA FINAL - 100% TRANSPARENTE SOBRE EL CUERO */}
      <section className="py-32 relative text-center bg-transparent border-t border-[#D4AF37]/20">
        <div className="max-w-3xl mx-auto px-6 space-y-8">
          <h2 className={`${playfair.className} text-4xl md:text-6xl text-white font-bold`}>
            Hagamos Realidad Tu Proyecto
          </h2>
          <p className="text-gray-300 font-light text-base md:text-lg max-w-xl mx-auto">
            Agenda una consultoría directa con la dirección de Gran Colina Arquitectos. Transformemos tus ideas en arquitectura tangible de lujo.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#D4AF37] text-black hover:bg-white px-12 py-5 tracking-[0.25em] uppercase text-xs font-bold transition-all shadow-[0_0_50px_rgba(212,175,55,0.3)]"
          >
            Agendar Cita en WhatsApp
          </a>
        </div>
      </section>

    </main>
  );
}
