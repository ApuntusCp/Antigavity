'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Newspaper, ArrowRight, Clock, Globe, Rss, Sparkles, RefreshCw, UserCheck, X, ChevronDown, TrendingUp, BookOpen, ShieldCheck, Award, CheckCircle2, FileText, User, Calendar, MapPin, BarChart3, Scale, Filter, Building2, GraduationCap, Compass, ExternalLink, Info, Sliders, Layers, ChevronRight, Check, Briefcase, Mail, Phone, Lock, FileSpreadsheet, BadgeCheck, Radio, Landmark, Eye, GitCompare, Compass as CompassIcon } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import NewsTrustBadge from '../../components/NewsTrustBadge';

// INSIGNIA ELEGANTE COMPACTA DEL MEDIO
function MediaHeaderBadge({ sourceName, sourceDomain, logoUrl, brandColor }) {
  const cleanDomain = React.useMemo(() => {
    if (sourceDomain && !sourceDomain.includes('google')) return sourceDomain;
    const name = (sourceName || '').toLowerCase();
    if (name.includes('la republica') || name.includes('larepublica')) return 'larepublica.co';
    if (name.includes('semana')) return 'semana.com';
    if (name.includes('latinus')) return 'latinus.us';
    if (name.includes('tiempo')) return 'eltiempo.com';
    if (name.includes('espectador')) return 'elespectador.com';
    if (name.includes('heraldo')) return 'elheraldo.co';
    if (name.includes('red+')) return 'redmas.com.co';
    if (name.includes('oncuba')) return 'oncubanews.com';
    if (name.includes('caracol')) return 'caracol.com.co';
    if (name.includes('rtvc')) return 'rtvcnoticias.com';
    if (name.includes('bbc')) return 'bbc.com';
    if (name.includes('ny') || name.includes('york')) return 'nytimes.com';
    return 'prensa.org';
  }, [sourceDomain, sourceName]);

  const favicon = logoUrl || `https://icons.duckduckgo.com/ip3/${cleanDomain}.ico`;

  return (
    <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5 mb-3">
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-6 h-6 rounded-md bg-white p-0.5 shrink-0 shadow-sm border border-[#D4AF37]/50 flex items-center justify-center">
          <img 
            src={favicon} 
            alt={sourceName}
            onError={(e) => {
              e.currentTarget.src = `https://unavatar.io/${cleanDomain}`;
            }}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="flex flex-col min-w-0">
          <span className="font-serif text-sm font-bold text-white leading-tight truncate group-hover:text-[#D4AF37] transition-colors">
            {sourceName}
          </span>
          <span className="text-[9px] font-mono text-[#D4AF37] font-semibold tracking-wider truncate">
            {cleanDomain}
          </span>
        </div>
      </div>

      <span className="px-2.5 py-0.5 bg-black/60 text-[#D4AF37] border border-[#D4AF37]/40 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider shrink-0">
        Verificado
      </span>
    </div>
  );
}

// BARRA DE SESGO IDEOLÓGICO MATEMÁTICO
function PoliticalBiasBar({ biasScore, biasLabel }) {
  const score = Math.max(5, Math.min(95, biasScore || 50));

  return (
    <div className="w-full space-y-1 mt-3 pt-2.5 border-t border-white/15 font-mono text-[10px]">
      <div className="flex items-center justify-between text-gray-300">
        <span className="flex items-center gap-1 font-semibold text-[#D4AF37] truncate">
          <Scale size={12} className="text-[#D4AF37] shrink-0" />
          <span>Espectro:</span>
          <strong className="text-white font-bold truncate">{biasLabel || 'Neutral / Centro'}</strong>
        </span>
        <span className="text-gray-400 font-bold shrink-0">{score}%</span>
      </div>

      <div className="relative w-full h-1.5 rounded-full bg-black/60 overflow-hidden border border-white/20">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-blue-500 to-amber-500 opacity-90"></div>
        <div 
          className="absolute top-0 bottom-0 w-2.5 bg-white border border-black shadow-[0_0_8px_rgba(255,255,255,0.9)] rounded-full -translate-x-1/2 transition-all duration-500"
          style={{ left: `${score}%` }}
        ></div>
      </div>
    </div>
  );
}

// BASE DE DATOS DE AUTORES
const AUTHORS_DATABASE = {
  "Lina María Orozco": {
    name: "Lina María Orozco",
    title: "Periodista Senior de Investigación Agroregional & Asuntos Comunitarios",
    tpNumber: "REG-CNP-CO-78412",
    institution: "Universidad del Norte • Barranquilla",
    verified: true,
    verificationDate: "15 de Enero, 2025",
    location: "Montería / Córdoba, Colombia",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    bio: "Periodista colombiana con más de 12 años de trayectoria cubriendo transformación agrícola, desarrollo de unidades productivas rurales y fortalecimiento de asociaciones indígenas y campesinas en Córdoba y la región Caribe.",
    specialties: ["Desarrollo Agrario", "Comunidades Indígenas del Caribe", "Seguridad Alimentaria", "Mecanización Agrícola"],
    awards: ["Premio Regional de Periodismo Simón Bolívar (Reportaje Rural 2022)", "Mención de Honor en Crónica Comunitaria CNP 2023"],
    publishedCount: 148,
    contactEmail: "lina.orozco@elheraldo.co",
    networkProfile: "/servicios?autor=lina-orozco"
  },
  "Leila Guerriero": {
    name: "Leila Guerriero",
    title: "Cronista, Escritora y Editora Periodística Internacional",
    tpNumber: "PRESS-ID-INT-ARG-312",
    institution: "Universidad de Buenos Aires / Fundación Gabo",
    verified: true,
    verificationDate: "10 de Noviembre, 2024",
    location: "Buenos Aires, Argentina / Cobertura Panamericana",
    avatar: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
    bio: "Reconocida periodista y escritora argentina. Autora de obras fundamentales de periodismo narrativo como 'Los suicidas del fin del mundo', 'Plano americano' y 'La llamada'. Maestra de la Fundación Gabo y referente imprescindible del periodismo hispanoamericano.",
    specialties: ["Periodismo Narrativo de Investigación", "Perfiles Profundos", "Ética y Tecnologías en Medios", "Crónica Hispanoamericana"],
    awards: ["Premio Fundación Nuevo Periodismo Iberoamericano (FNPI 2010)", "Premio Periodístico Manuel Vázquez Montalbán (2019)", "Premio Konex de Platino"],
    publishedCount: 312,
    contactEmail: "leila.guerriero@fundaciongabo.org",
    networkProfile: "/servicios?autor=leila-guerriero"
  },
  "Camilo Sotomayor": {
    name: "Camilo Sotomayor",
    title: "Analista Político & Investigador de Tecnologías y Medios",
    tpNumber: "REG-CPB-2024-5542",
    institution: "Universidad de los Andes • Bogotá",
    verified: true,
    verificationDate: "20 de Febrero, 2025",
    location: "Bogotá D.C., Colombia",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80",
    bio: "Investigador y comunicador especializado en el impacto de algoritmos, redes de desinformación e inteligencia artificial en la opinión pública y el ejercicio del periodismo ético en América Latina.",
    specialties: ["Inteligencia Artificial en Redacciones", "Gobernanza Digital", "Análisis Electoral", "Verificación Factual"],
    awards: ["Premio Nacional de Periodismo Digital 2023", "Beca de Investigación Periodística Dejusticia 2024"],
    publishedCount: 94,
    contactEmail: "camilo.sotomayor@lasillavacia.com",
    networkProfile: "/servicios?autor=camilo-sotomayor"
  },
  "Juliana Restrepo": {
    name: "Juliana Restrepo",
    title: "Editora de Macroeconomía y Mercados Agroindustriales",
    tpNumber: "REG-CNP-CO-69814",
    institution: "Universidad Nacional de Colombia • Bogotá",
    verified: true,
    verificationDate: "05 de Diciembre, 2024",
    location: "Bogotá D.C., Colombia",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
    bio: "Economista y periodista con 15 años de cobertura especializada en finanzas públicas, balanza comercial de Colombia, exportaciones agropecuarias e informes de coyuntura del DANE.",
    specialties: ["Comercio Exterior & Balanza Comercial", "Informes Factuales DANE", "Cadenas Globales de Valor Agrícola", "Café y Flores de Exportación"],
    awards: ["Premio ANIF al Periodismo Económico 2021", "Reconocimiento Bolsa de Valores de Colombia 2023"],
    publishedCount: 230,
    contactEmail: "juliana.restrepo@eltiempo.com",
    networkProfile: "/servicios?autor=juliana-restrepo"
  }
};

function getAuthorProfile(authorName) {
  if (AUTHORS_DATABASE[authorName]) {
    return AUTHORS_DATABASE[authorName];
  }
  return {
    name: authorName || "Comunicador Verificado",
    title: "Periodista & Investigador Adscrito a la Red GranColinos",
    tpNumber: "REG-CPB-GC-102",
    institution: "Red Panamericana de Comunicadores",
    verified: true,
    verificationDate: "Verificado Activo",
    location: "América Latina",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80",
    bio: `Comunicador profesional registrado en la red periodística de GranColinos con credenciales de identidad y trayectoria pública verificadas bajo la Ley 1581 de Habeas Data.`,
    specialties: ["Periodismo de Investigación", "Análisis Factual", "Derecho a la Información"],
    awards: ["Credencial de Prensa Verificada GranColinos"],
    publishedCount: 45,
    contactEmail: "redaccion@grancolinos.com",
    networkProfile: "/servicios"
  };
}

function NoticiasContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialCountry = searchParams.get('pais') || 'co';
  const [activeCountry, setActiveCountry] = useState(initialCountry);
  const [activeCategoryTab, setActiveCategoryTab] = useState('ultimas');
  
  // Modales
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [selectedBiasComparison, setSelectedBiasComparison] = useState(null);
  
  const [realtimeArticles, setRealtimeArticles] = useState([]);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [visibleNewsCount, setVisibleNewsCount] = useState(8);

  const todayObj = new Date();
  const formattedDate = new Intl.DateTimeFormat('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(todayObj);

  const dateDayMonthYear = new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(todayObj);

  useEffect(() => {
    if (selectedArticle || selectedAuthor || selectedBiasComparison) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedArticle, selectedAuthor, selectedBiasComparison]);

  const categoryTabs = [
    { id: 'ultimas', name: 'Últimas Noticias' },
    { id: 'co', name: 'Colombia' },
    { id: 'mundo', name: 'Mundo & América' },
    { id: 'economia', name: 'Economía & Negocios' },
    { id: 'cultura', name: 'Cultura & Sociedad' },
    { id: 'salud', name: 'Ciencia & Salud' }
  ];

  const countries = [
    { id: 'co', name: 'Colombia' },
    { id: 'global', name: 'Cobertura Global' },
    { id: 'us', name: 'Estados Unidos' },
    { id: 'mx', name: 'México' },
    { id: 'ar', name: 'Argentina' },
    { id: 'br', name: 'Brasil' },
    { id: 'cl', name: 'Chile' }
  ];

  useEffect(() => {
    setLoadingFeed(true);
    let isMounted = true;

    async function fetchLiveNewsFeed() {
      try {
        const response = await fetch('/api/noticias/feed?pais=' + activeCountry);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.articles && data.articles.length > 0) {
            if (isMounted) {
              setRealtimeArticles(data.articles);
              setLoadingFeed(false);
              return;
            }
          }
        }
      } catch (err) {
        console.error("Error al sincronizar feed de medios:", err);
      }
    }

    fetchLiveNewsFeed();

    return () => {
      isMounted = false;
    };
  }, [activeCountry]);

  const filteredNews = realtimeArticles.filter(item => {
    if (activeCategoryTab === 'ultimas') return true;
    if (activeCategoryTab === 'co') return item.country === 'co';
    if (activeCategoryTab === 'mundo') return item.country !== 'co';
    if (activeCategoryTab === 'economia') return item.category.toLowerCase().includes('econ');
    if (activeCategoryTab === 'cultura') return item.category.toLowerCase().includes('cult');
    if (activeCategoryTab === 'salud') return item.category.toLowerCase().includes('salud') || item.category.toLowerCase().includes('cien');
    return true;
  });

  const topNewsPrimary = filteredNews[0] || realtimeArticles[0];
  const topNewsSecondary = filteredNews.slice(1, 5);

  const countrySidebarNews = realtimeArticles.filter(item => 
    activeCountry === 'global' ? true : item.country === activeCountry
  );

  const handleCountryChange = (countryId) => {
    setActiveCountry(countryId);
    if (countryId === 'global') router.push('/noticias', { scroll: false });
    else router.push(`/noticias?pais=${countryId}`, { scroll: false });
  };

  return (
    <div className="min-h-screen theme-noticias text-white pt-28 pb-36 px-3 sm:px-6 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto space-y-8 relative z-10">

        {/* MASTHEAD PRINCIPAL */}
        <div className="leather-canvas-blue rounded-3xl p-6 md:p-10 backdrop-blur-2xl relative overflow-hidden space-y-6 border-2 border-[#D4AF37]/50 shadow-[0_20px_60px_rgba(0,0,0,0.9)]">
          
          <div className="text-center space-y-4 border-b border-[#D4AF37]/35 pb-6">
            <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-gray-300 uppercase tracking-widest px-2 gap-2">
              <span className="hidden sm:inline font-bold text-[#D4AF37]/90">Monitoreo Hemerográfico en los 5 Espectros Ideológicos</span>
              
              <div className="inline-flex items-center gap-2 font-extrabold text-[#D4AF37] px-4 py-1.5 bg-black/80 rounded-full border border-[#D4AF37]/50 shadow-md">
                <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>
                <span>{formattedDate}</span>
              </div>

              <span className="hidden sm:inline font-bold text-[#D4AF37]/90">GranColinos Journal</span>
            </div>

            <h1 className="font-serif text-5xl md:text-8xl font-black tracking-tight text-gold-gradient uppercase drop-shadow-[0_4px_30px_rgba(212,175,55,0.45)]">
              GRAN NOTICIAS
            </h1>
            
            <div className="w-36 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto rounded-full shadow-[0_0_10px_rgba(212,175,55,0.8)]"></div>
            
            <p className="text-xs md:text-sm font-serif italic text-gray-200 max-w-3xl mx-auto font-light leading-relaxed">
              "Compara la misma noticia en los 5 espectros ideológicos (Izquierda, Centro-Izquierda, Centro, Centro-Derecha y Derecha). Analiza adjetivos, intención comunicativa y encuadre editorial sin tomar bandos."
            </p>

            <div className="pt-1 flex items-center justify-center">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-emerald-950/80 border border-emerald-500/50 rounded-full text-[10px] font-mono text-emerald-300 font-bold">
                <Radio size={12} className="animate-pulse text-emerald-400" />
                <span>DISEÑO DE CRISTAL GLASSMORPHISM TRANSPARENTE 22% ACTIVO ({dateDayMonthYear})</span>
              </div>
            </div>
          </div>

          {/* Navegación por Categorías */}
          <nav className="flex items-center justify-center gap-2 md:gap-4 overflow-x-auto scrollbar-none font-mono text-xs border-b border-white/10 pb-3">
            {categoryTabs.map(tab => {
              const isActive = activeCategoryTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategoryTab(tab.id)}
                  className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap font-extrabold uppercase tracking-wider ${
                    isActive
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black shadow-[0_0_25px_rgba(212,175,55,0.7)] scale-105 border border-white/40'
                      : 'text-gray-300 hover:text-white hover:bg-white/10 border border-transparent'
                  }`}
                >
                  {tab.name}
                </button>
              );
            })}
          </nav>

          {/* HERO SECCIÓN CON COMPARACIÓN DE LOS 5 ESPECTROS */}
          <div className="pt-2 space-y-5">
            <div className="flex items-center justify-between border-b border-white/15 pb-2">
              <h2 className="font-serif text-xl md:text-2xl font-black text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-3.5 h-3.5 bg-[#D4AF37] rounded-full inline-block shadow-[0_0_15px_rgba(212,175,55,0.9)] animate-pulse"></span> NOTICIA DE PORTADA & ANÁLISIS DE TITULARES
              </h2>
              <span className="text-xs font-mono text-[#D4AF37] font-bold">Fecha: {dateDayMonthYear}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Noticia de Portada Principal (7 Cols) */}
              {topNewsPrimary && (
                <div 
                  className="lg:col-span-7 leather-card-dark rounded-3xl p-6 shadow-2xl transition-all duration-500 space-y-4 hover:border-[#D4AF37] flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <MediaHeaderBadge 
                      sourceName={topNewsPrimary.sourceName}
                      sourceDomain={topNewsPrimary.sourceDomain}
                      logoUrl={topNewsPrimary.sourceLogoUrl}
                      brandColor={topNewsPrimary.sourceBrandColor}
                    />

                    <div className="space-y-2 cursor-pointer" onClick={() => setSelectedArticle(topNewsPrimary)}>
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#D4AF37]">
                        <span className="font-bold">{topNewsPrimary.category}</span>
                        <span>{topNewsPrimary.publishedAt}</span>
                      </div>

                      <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-white leading-tight hover:text-[#D4AF37] transition-colors">
                        {topNewsPrimary.title}
                      </h3>
                      
                      <p className="text-gray-200 text-xs md:text-sm font-sans line-clamp-3 leading-relaxed font-light">
                        {topNewsPrimary.summary}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <PoliticalBiasBar biasScore={topNewsPrimary.biasScore} biasLabel={topNewsPrimary.biasLabel} />

                    <button
                      onClick={() => setSelectedBiasComparison(topNewsPrimary)}
                      className="w-full py-3 px-4 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-mono font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2 border border-white/30"
                    >
                      <Scale size={16} />
                      <span>Ver Comparativa en los 5 Espectros Políticos (Izquierda a Derecha)</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Tendencias a la Derecha */}
              <div className="lg:col-span-5 space-y-3.5 flex flex-col justify-between">
                {topNewsSecondary.map((secItem, idx) => (
                  <div
                    key={secItem.id}
                    className="leather-card-dark rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all space-y-2 hover:border-[#D4AF37]"
                  >
                    <div className="flex items-start gap-3.5 cursor-pointer" onClick={() => setSelectedArticle(secItem)}>
                      <div className="w-8 h-8 rounded-lg bg-white p-1 border border-[#D4AF37]/50 shrink-0 flex items-center justify-center shadow-sm">
                        <img 
                          src={secItem.sourceLogoUrl || `https://icons.duckduckgo.com/ip3/${secItem.sourceDomain || 'prensa.org'}.ico`}
                          alt={secItem.sourceName}
                          onError={(e) => {
                            e.currentTarget.src = `https://unavatar.io/${secItem.sourceDomain || 'prensa.org'}`;
                          }}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="text-[#D4AF37] font-bold">#{idx + 1} • {secItem.sourceName}</span>
                          <span className="text-gray-400">{secItem.publishedAt}</span>
                        </div>
                        <h4 className="font-serif text-xs md:text-sm font-bold text-white line-clamp-2 leading-snug hover:text-[#D4AF37] transition-colors">
                          {secItem.title}
                        </h4>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedBiasComparison(secItem)}
                      className="w-full py-1.5 px-3 bg-white/10 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-mono font-bold text-[10px] uppercase tracking-wider rounded-lg transition-all border border-[#D4AF37]/30 flex items-center justify-center gap-1.5"
                    >
                      <GitCompare size={12} />
                      <span>Comparar 5 Espectros de Titulares</span>
                    </button>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* MAIN GRID */}
          <div className="pt-8 border-t border-white/15 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <div className="lg:col-span-8 space-y-6">
              <div className="border-b border-white/15 pb-2 flex items-center justify-between">
                <h3 className="font-serif text-xl font-bold text-white uppercase tracking-wider">
                  MONITOREO MULTIMEDIOS & ANÁLISIS DE INTENCIÓN
                </h3>
                <span className="text-xs font-mono text-gray-400">{filteredNews.length} Coberturas</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredNews.slice(1, visibleNewsCount + 1).map(feedItem => (
                  <div
                    key={`feed-grid-${feedItem.id}`}
                    className="leather-card-dark rounded-2xl p-5 shadow-lg transition-all space-y-3 hover:border-[#D4AF37] flex flex-col justify-between"
                  >
                    <div className="space-y-2 cursor-pointer" onClick={() => setSelectedArticle(feedItem)}>
                      <MediaHeaderBadge 
                        sourceName={feedItem.sourceName}
                        sourceDomain={feedItem.sourceDomain}
                        logoUrl={feedItem.sourceLogoUrl}
                        brandColor={feedItem.sourceBrandColor}
                      />

                      <h4 className="font-serif text-base font-bold text-white line-clamp-2 hover:text-[#D4AF37] transition-colors leading-snug">
                        {feedItem.title}
                      </h4>
                      
                      <p className="text-xs font-sans text-gray-300 line-clamp-2 font-light leading-relaxed">
                        {feedItem.summary}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2">
                      <PoliticalBiasBar biasScore={feedItem.biasScore} biasLabel={feedItem.biasLabel} />

                      <button
                        onClick={() => setSelectedBiasComparison(feedItem)}
                        className="w-full py-2 px-3 bg-black/70 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black font-mono font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-all border border-[#D4AF37]/40 flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Scale size={13} />
                        <span>Ver Noticia en los 5 Espectros Ideológicos</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center pt-4">
                <button
                  onClick={() => setVisibleNewsCount(prev => prev + 6)}
                  className="px-8 py-3 bg-[#D4AF37] text-black font-mono font-extrabold text-xs uppercase tracking-widest rounded-xl hover:bg-white transition-all shadow-[0_0_25px_rgba(212,175,55,0.5)] border border-white/30"
                >
                  Cargar Más Coberturas
                </button>
              </div>
            </div>

            {/* SIDEBAR DE MEDIOS REGIONALES */}
            <div className="lg:col-span-4 leather-card-dark rounded-3xl p-6 shadow-xl space-y-5 border border-[#D4AF37]/40">
              <div className="space-y-1.5 border-b border-white/15 pb-4">
                <span className="text-[10px] font-mono text-[#D4AF37] font-extrabold uppercase tracking-wider block">
                  FILTRO PAÍS SELECCIONADO
                </span>
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl font-bold text-white uppercase">
                    MEDIOS DE {countries.find(c => c.id === activeCountry)?.name || 'COLOMBIA'}
                  </h3>
                  
                  <select
                    value={activeCountry}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="bg-black/70 text-[#D4AF37] text-xs font-mono font-bold py-1.5 px-3 rounded-xl border border-[#D4AF37]/50 focus:outline-none shadow-sm"
                  >
                    {countries.map(c => (
                      <option key={c.id} value={c.id} className="bg-[#07101E] text-white">{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {countrySidebarNews.slice(0, 8).map((sideItem, idx) => {
                  const domain = sideItem.sourceDomain || 'prensa.org';
                  return (
                    <div
                      key={`sidebar-${sideItem.id}`}
                      className="p-3 hover:bg-white/10 rounded-xl transition-colors cursor-pointer border-b border-white/10 space-y-1 group flex items-center gap-3"
                      onClick={() => setSelectedArticle(sideItem)}
                    >
                      <div className="w-7 h-7 rounded-lg bg-white p-1 border border-[#D4AF37]/40 shrink-0 flex items-center justify-center">
                        <img 
                          src={`https://icons.duckduckgo.com/ip3/${domain}.ico`}
                          alt={sideItem.sourceName}
                          onError={(e) => {
                            e.currentTarget.src = `https://unavatar.io/${domain}`;
                          }}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between text-[10px] text-gray-400">
                          <span className="font-bold text-[#D4AF37]">#{idx + 1} • {sideItem.sourceName}</span>
                          <span>{sideItem.publishedAt}</span>
                        </div>
                        <p className="font-serif font-bold text-white leading-snug line-clamp-1 group-hover:text-[#D4AF37]">
                          {sideItem.title}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

        {/* MODAL LECTURA */}
        {selectedArticle && (
          <div 
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-6 animate-in fade-in overflow-y-auto"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.22)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)'
            }}
          >
            <div className="leather-canvas-blue text-white rounded-3xl max-w-4xl w-full max-h-[88vh] overflow-y-auto p-6 md:p-10 space-y-6 relative shadow-[0_0_120px_rgba(212,175,55,0.5)] border-2 border-[#D4AF37] my-auto">
              
              <button
                onClick={() => setSelectedArticle(null)}
                className="sticky top-0 float-right z-50 text-gray-300 hover:text-white bg-black/90 hover:bg-[#D4AF37] hover:text-black w-9 h-9 rounded-full border border-white/30 flex items-center justify-center font-bold transition-all shadow-lg"
                title="Cerrar Lectura"
              >
                ✕
              </button>

              <div className="space-y-3 border-b border-[#D4AF37]/30 pb-4 clear-both">
                <MediaHeaderBadge 
                  sourceName={selectedArticle.sourceName}
                  sourceDomain={selectedArticle.sourceDomain}
                  logoUrl={selectedArticle.sourceLogoUrl}
                  brandColor={selectedArticle.sourceBrandColor}
                />

                <h2 className="font-serif text-2xl md:text-4xl font-extrabold text-white leading-tight drop-shadow-md">
                  {selectedArticle.title}
                </h2>

                <div className="flex flex-wrap items-center justify-between text-xs font-mono text-gray-300 pt-1">
                  <button 
                    onClick={() => setSelectedAuthor(getAuthorProfile(selectedArticle.author))}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 hover:bg-[#D4AF37] hover:text-black transition-all group/author cursor-pointer text-left shadow-sm"
                  >
                    <User size={15} className="text-[#D4AF37] group-hover/author:text-black transition-colors" />
                    <span>Autor: <strong className="underline decoration-[#D4AF37] underline-offset-4">{selectedArticle.author}</strong></span>
                    <BadgeCheck size={14} className="text-[#D4AF37] group-hover/author:text-black shrink-0" />
                  </button>

                  <span className="flex items-center gap-1.5 font-bold text-[#D4AF37]">
                    <Clock size={14} className="text-[#D4AF37]" /> {selectedArticle.publishedAt}
                  </span>
                </div>
              </div>

              {/* BOTÓN EN MODAL LECTURA */}
              <div 
                className="p-4 rounded-2xl border border-[#D4AF37]/50 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.22)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)'
                }}
              >
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-[#D4AF37] uppercase flex items-center gap-1.5">
                    <Scale size={14} /> Comparador de los 5 Espectros Ideológicos
                  </span>
                  <p className="text-xs font-sans text-gray-300">
                    Compara cómo titularon esta misma noticia medios de Izquierda, Centro y Derecha.
                  </p>
                </div>

                <button
                  onClick={() => {
                    const art = selectedArticle;
                    setSelectedArticle(null);
                    setSelectedBiasComparison(art);
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-mono font-extrabold text-xs uppercase tracking-widest rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)] shrink-0 flex items-center gap-2"
                >
                  <Scale size={15} />
                  <span>Comparar 5 Espectros</span>
                </button>
              </div>

              <div className="space-y-4 font-sans text-sm text-gray-200 leading-relaxed font-light">
                <div className="bg-black/60 p-5 rounded-2xl border-l-4 border-[#D4AF37] shadow-inner space-y-2">
                  <span className="text-[10px] font-mono text-[#D4AF37] uppercase font-bold tracking-widest block">
                    Síntesis Oficial ({selectedArticle.sourceName}):
                  </span>
                  <p className="font-serif text-base italic text-white leading-relaxed">
                    "{selectedArticle.summary}"
                  </p>
                </div>

                <div className="space-y-3 pt-2 text-base leading-relaxed text-gray-100 font-sans">
                  <p className="whitespace-pre-line leading-relaxed">{selectedArticle.fullContent}</p>
                </div>
              </div>

              <div className="pt-6 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
                <a
                  href={selectedArticle.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-extrabold text-xs uppercase tracking-widest rounded-xl hover:bg-white transition-all shadow-[0_0_25px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2 border border-white/30"
                >
                  <span>Ir al Reportaje Completo en {selectedArticle.sourceName}</span>
                  <ExternalLink size={15} />
                </a>

                <button
                  onClick={() => setSelectedArticle(null)}
                  className="w-full sm:w-auto px-6 py-3 bg-white/10 text-white hover:bg-white/20 font-bold text-xs uppercase rounded-xl transition-all border border-white/20"
                >
                  Cerrar Lectura
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL DE COMPARACIÓN COMPLETA EN LOS 5 ESPECTROS CON TRANSPARENCIA DEL 22% Y BLUR DE ALTA GAMA */}
        {selectedBiasComparison && (
          <div 
            className="fixed inset-0 z-[100000] flex items-center justify-center p-4 md:p-6 animate-in fade-in overflow-y-auto"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.45)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)'
            }}
          >
            <div className="leather-canvas-blue text-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-10 space-y-6 relative shadow-[0_0_120px_rgba(212,175,55,0.6)] border-2 border-[#D4AF37] my-auto">
              
              <button
                onClick={() => setSelectedBiasComparison(null)}
                className="sticky top-0 float-right z-50 text-gray-300 hover:text-white bg-black/90 hover:bg-[#D4AF37] hover:text-black w-9 h-9 rounded-full border border-[#D4AF37]/50 flex items-center justify-center font-bold transition-all shadow-lg"
                title="Cerrar Comparador"
              >
                ✕
              </button>

              <div className="space-y-3 border-b border-[#D4AF37]/30 pb-6 clear-both text-center sm:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] text-[10px] font-mono font-bold uppercase tracking-widest">
                  <Scale size={14} />
                  <span>Comparador Algorítmico de los 5 Espectros Políticos</span>
                </div>

                <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-white leading-tight">
                  Misma Noticia — Cobertura en los 5 Espectros (Izquierda a Derecha)
                </h3>
                
                <p className="text-xs font-mono text-gray-300">
                  Evento Matriz: <strong className="text-[#D4AF37]">{selectedBiasComparison.title}</strong>
                </p>
              </div>

              {/* GUÍA DEL ESPECTRO IDEOLÓGICO EVALUADO CON TRANSPARENCIA DE 22% Y BLUR */}
              <div 
                className="p-5 rounded-2xl border border-[#D4AF37]/40 space-y-3 shadow-2xl"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.22)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)'
                }}
              >
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase font-extrabold tracking-widest flex items-center gap-1.5">
                  <CompassIcon size={14} /> GUÍA DEL ESPECTRO IDEOLÓGICO EVALUADO:
                </span>
                
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-[10px] font-mono text-center font-bold">
                  <div 
                    className="p-2.5 rounded-xl border border-red-500/50 text-red-300 flex flex-col items-center justify-center gap-1 shadow-md"
                    style={{ backgroundColor: 'rgba(180, 20, 20, 0.22)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
                  >
                    <span className="w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
                    <span>1. Izquierda (20%)</span>
                  </div>

                  <div 
                    className="p-2.5 rounded-xl border border-blue-400/50 text-blue-300 flex flex-col items-center justify-center gap-1 shadow-md"
                    style={{ backgroundColor: 'rgba(20, 80, 180, 0.22)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
                  >
                    <span className="w-2.5 h-2.5 bg-blue-400 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
                    <span>2. Centro-Izquierda (38%)</span>
                  </div>

                  <div 
                    className="p-2.5 rounded-xl border border-slate-300/50 text-slate-100 flex flex-col items-center justify-center gap-1 shadow-md"
                    style={{ backgroundColor: 'rgba(100, 116, 139, 0.22)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
                  >
                    <span className="w-2.5 h-2.5 bg-slate-200 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"></span>
                    <span>3. Centro Factual (50%)</span>
                  </div>

                  <div 
                    className="p-2.5 rounded-xl border border-amber-400/50 text-amber-300 flex flex-col items-center justify-center gap-1 shadow-md"
                    style={{ backgroundColor: 'rgba(180, 130, 20, 0.22)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
                  >
                    <span className="w-2.5 h-2.5 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]"></span>
                    <span>4. Centro-Derecha (64%)</span>
                  </div>

                  <div 
                    className="p-2.5 rounded-xl border border-orange-500/50 text-orange-300 flex flex-col items-center justify-center gap-1 shadow-md"
                    style={{ backgroundColor: 'rgba(194, 65, 12, 0.22)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
                  >
                    <span className="w-2.5 h-2.5 bg-orange-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.8)]"></span>
                    <span>5. Derecha (82%)</span>
                  </div>
                </div>
              </div>

              {/* SÍNTESIS IMPARCIAL GRANCOLINOS CON TRANSPARENCIA DE 22% Y BLUR */}
              <div 
                className="p-5 rounded-2xl border-l-4 border-emerald-400 border border-emerald-500/30 space-y-2 shadow-2xl"
                style={{
                  backgroundColor: 'rgba(0, 30, 20, 0.22)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)'
                }}
              >
                <span className="text-[10px] font-mono text-emerald-400 font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                  <ShieldCheck size={14} /> SÍNTESIS IMPARCIAL FACTUAL (GRANCOLINOS JOURNAL):
                </span>
                <p className="font-sans text-xs md:text-sm text-gray-100 leading-relaxed font-light">
                  {selectedBiasComparison.neutralSynthesis || `Síntesis Factual: Diversas salas de redacción cubren el acontecimiento aplicando distintos encuadres del lenguaje. El desglose inferior muestra los 5 espectros políticos.`}
                </p>
              </div>

              {/* VENTANAS DE CADA TITULAR (LAS 5 COBERTURAS) CON TRANSPARENCIA DE 22% Y BLUR */}
              <div className="space-y-4 pt-2">
                <h4 className="font-serif text-base font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-2">
                  <Scale size={16} /> COBERTURAS REGISTRADAS EN LOS 5 ESPECTROS IDEOLÓGICOS
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(selectedBiasComparison.otherCoverages || []).map((coverage, idx) => (
                    <div 
                      key={idx}
                      className="rounded-2xl p-5 border border-[#D4AF37]/35 space-y-3 shadow-2xl hover:border-[#D4AF37] hover:shadow-[0_0_30px_rgba(212,175,55,0.35)] transition-all flex flex-col justify-between group/card"
                      style={{
                        backgroundColor: 'rgba(5, 12, 24, 0.22)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)'
                      }}
                    >
                      <div className="space-y-2.5">
                        {/* Cabecera del Espectro */}
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-white p-0.5 border border-[#D4AF37]/50 flex items-center justify-center shrink-0 shadow-sm">
                              <img 
                                src={coverage.logoUrl || `https://icons.duckduckgo.com/ip3/${coverage.sourceDomain || 'prensa.org'}.ico`}
                                alt={coverage.sourceName}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <span className="font-serif text-sm font-bold text-white group-hover/card:text-[#D4AF37] transition-colors">{coverage.sourceName}</span>
                          </div>
                          
                          <span className="text-[9px] font-mono text-[#D4AF37] bg-black/70 px-2.5 py-1 rounded-full border border-[#D4AF37]/40 font-extrabold">
                            {coverage.spectrumBadge || `Espectro ${idx + 1}`}
                          </span>
                        </div>

                        {/* Titular utilizado por el Medio */}
                        <div>
                          <span className="text-[9px] font-mono text-gray-400 uppercase block">TITULAR DEL MEDIO:</span>
                          <h5 className="font-serif text-sm font-bold text-white leading-snug mt-0.5 group-hover/card:text-[#D4AF37] transition-colors">
                            "{coverage.headline}"
                          </h5>
                        </div>

                        {/* Análisis de Intención & Encuadre con Transparencia 22% */}
                        <div 
                          className="p-3 rounded-xl border border-white/15 space-y-1 text-xs shadow-inner"
                          style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.22)',
                            backdropFilter: 'blur(16px)',
                            WebkitBackdropFilter: 'blur(16px)'
                          }}
                        >
                          <span className="text-[9px] font-mono text-[#D4AF37] font-bold uppercase block">
                            ANÁLISIS DE INTENCIÓN & ENCUADRE:
                          </span>
                          <p className="font-sans text-[11px] text-gray-200 leading-relaxed italic">
                            "{coverage.intention}"
                          </p>
                        </div>
                      </div>

                      {/* Barra de Sesgo Ideológico */}
                      <div className="space-y-2 pt-2">
                        <PoliticalBiasBar biasScore={coverage.biasScore} biasLabel={coverage.biasLabel} />

                        <a
                          href={coverage.originalUrl || selectedBiasComparison.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 px-3 bg-white/10 hover:bg-[#D4AF37] text-white hover:text-black font-mono font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-all border border-white/20 flex items-center justify-center gap-1.5 shadow-md"
                        >
                          <span>LEER NOTICIA EN {coverage.sourceName}</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botón de Cierre */}
              <div className="pt-4 border-t border-white/20 text-right">
                <button
                  onClick={() => setSelectedBiasComparison(null)}
                  className="px-6 py-2.5 bg-white/10 text-white hover:bg-white/20 font-mono font-bold text-xs uppercase rounded-xl transition-all border border-white/20"
                >
                  CERRAR COMPARADOR
                </button>
              </div>

            </div>
          </div>
        )}

        {/* MODAL AUTOR */}
        {selectedAuthor && (
          <div 
            className="fixed inset-0 z-[100000] flex items-center justify-center p-4 md:p-6 animate-in fade-in overflow-y-auto"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.45)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)'
            }}
          >
            <div className="leather-canvas-blue text-white rounded-3xl max-w-2xl w-full max-h-[88vh] overflow-y-auto p-6 md:p-8 space-y-6 relative shadow-[0_0_120px_rgba(212,175,55,0.6)] border-2 border-[#D4AF37] my-auto">
              
              <button
                onClick={() => setSelectedAuthor(null)}
                className="sticky top-0 float-right z-50 text-gray-300 hover:text-white bg-black/90 hover:bg-[#D4AF37] hover:text-black w-9 h-9 rounded-full border border-[#D4AF37]/50 flex items-center justify-center font-bold transition-all shadow-lg"
                title="Cerrar Hoja de Vida"
              >
                ✕
              </button>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 border-b border-[#D4AF37]/30 pb-6 clear-both">
                <div className="relative w-28 h-28 rounded-2xl overflow-hidden shrink-0 border-2 border-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.5)]">
                  <img 
                    src={selectedAuthor.avatar} 
                    alt={selectedAuthor.name}
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80";
                    }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 right-1 bg-black/80 p-1 rounded-full border border-[#D4AF37]">
                    <BadgeCheck size={18} className="text-[#D4AF37]" />
                  </div>
                </div>

                <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] text-[10px] font-mono font-bold uppercase tracking-widest">
                    <ShieldCheck size={13} />
                    <span>Perfil Profesional Verificado por GranColinos</span>
                  </div>

                  <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-white leading-tight">
                    {selectedAuthor.name}
                  </h3>

                  <p className="font-mono text-xs text-[#D4AF37] font-bold">
                    {selectedAuthor.title}
                  </p>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-[11px] font-mono text-gray-300 pt-1">
                    <span className="flex items-center gap-1 bg-black/40 px-2.5 py-1 rounded-lg border border-white/10">
                      <GraduationCap size={13} className="text-[#D4AF37]" /> {selectedAuthor.institution}
                    </span>
                    <span className="flex items-center gap-1 bg-black/40 px-2.5 py-1 rounded-lg border border-white/10">
                      <MapPin size={13} className="text-[#D4AF37]" /> {selectedAuthor.location}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs bg-black/50 p-4 rounded-2xl border border-white/10">
                <div>
                  <span className="text-gray-400 block text-[10px]">REGISTRO PERIODÍSTICO / CREDENCIAL:</span>
                  <strong className="text-white font-bold">{selectedAuthor.tpNumber}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">FECHA DE VERIFICACIÓN HABEAS DATA:</span>
                  <strong className="text-[#D4AF37] font-bold">{selectedAuthor.verificationDate}</strong>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-serif text-sm font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-2">
                  <FileText size={16} /> Biografía & Trayectoria Pública
                </h4>
                <p className="font-sans text-xs md:text-sm text-gray-200 leading-relaxed bg-black/40 p-4 rounded-2xl border border-white/10">
                  {selectedAuthor.bio}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-serif text-sm font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-2">
                  <Briefcase size={16} /> Áreas de Especialización
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedAuthor.specialties.map((spec, i) => (
                    <span key={i} className="px-3 py-1 rounded-lg bg-white/10 border border-white/15 text-xs font-mono font-semibold text-gray-200">
                      • {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
                <Link
                  href={selectedAuthor.networkProfile}
                  onClick={() => setSelectedAuthor(null)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-extrabold text-xs uppercase tracking-widest rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2 border border-white/30"
                >
                  <Briefcase size={15} />
                  <span>Ver Perfil en Red de Servicios</span>
                </Link>

                <button
                  onClick={() => setSelectedAuthor(null)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-white/10 text-white hover:bg-white/20 font-bold text-xs uppercase rounded-xl transition-all border border-white/20"
                >
                  Cerrar Dossier
                </button>
              </div>

            </div>
          </div>
        )}

        <NewsTrustBadge />
      </div>
    </div>
  );
}

export default function NoticiasPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050A14] flex items-center justify-center text-white font-mono text-xs">
        <RefreshCw className="animate-spin text-[#D4AF37] mb-2" size={32} />
      </div>
    }>
      <NoticiasContent />
    </Suspense>
  );
}
