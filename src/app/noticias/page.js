'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Newspaper, ArrowRight, Clock, Globe, Rss, Sparkles, RefreshCw, UserCheck, X, ChevronDown, TrendingUp, BookOpen, ShieldCheck, Award, CheckCircle2, FileText, User, Calendar, MapPin, BarChart3, Scale, Filter, Building2, GraduationCap, Compass, ExternalLink, Info, Sliders, Layers, ChevronRight, Check, Briefcase, Mail, Phone, Lock, FileSpreadsheet, BadgeCheck, Radio, Landmark, Eye, GitCompare, Compass as CompassIcon, Network, BrainCircuit, Target, Lightbulb, CheckCheck, Percent, LayoutGrid, Rows3, SlidersHorizontal, PieChart, History } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import NewsTrustBadge from '../../components/NewsTrustBadge';

// COMPONENTE DE DATOS Y MÉTRICAS BALANCEADO ESTILO PUBLISHER (4 CARDS PERFECTAMENTE ALINEADAS)
function EventMetricsGrid({ metrics }) {
  if (!metrics || metrics.length === 0) return null;

  const displayMetrics = metrics.slice(0, 4);

  return (
    <div 
      className="p-5 rounded-2xl border border-[#D4AF37]/50 space-y-3.5 shadow-2xl"
      style={{
        backgroundColor: 'rgba(5, 12, 24, 0.22)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <span className="text-xs font-mono text-[#D4AF37] font-extrabold uppercase tracking-widest flex items-center gap-2">
          <BarChart3 size={16} className="text-[#D4AF37]" /> DATOS & MÉTRICAS CUANTITATIVAS DEL EVENTO
        </span>
        <span className="text-[10px] font-mono text-[#D4AF37] font-bold px-2.5 py-0.5 rounded-full bg-black/60 border border-[#D4AF37]/40">
          Métricas Verificadas
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {displayMetrics.map((item, idx) => (
          <div 
            key={idx}
            className="p-4 rounded-xl border border-[#D4AF37]/30 space-y-1.5 shadow-md flex flex-col justify-between hover:border-[#D4AF37] transition-all bg-black/40"
          >
            <span className="text-[9px] font-mono text-gray-400 font-bold uppercase tracking-wider block">
              {item.label}:
            </span>
            <strong className="font-serif text-sm font-black text-white block leading-snug">
              {item.value}
            </strong>
          </div>
        ))}
      </div>
    </div>
  );
}

// COMPONENTE DE MAPA MENTAL CONCEPTUAL VISUAL CON VERDE LIMO EN IZQUIERDA Y ROJO EN DERECHA
function AcademicMindMap({ nodes, title }) {
  if (!nodes || nodes.length === 0) return null;

  return (
    <div 
      className="p-5 rounded-2xl border border-[#D4AF37]/40 space-y-4 shadow-2xl"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.22)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <span className="text-xs font-mono text-[#D4AF37] font-extrabold uppercase tracking-widest flex items-center gap-2">
          <BrainCircuit size={16} className="text-[#D4AF37]" /> MAPA MENTAL CONCEPTUAL DE LA NOTICIA
        </span>
        <span className="text-[10px] font-mono text-gray-300">Desglose Imparcial</span>
      </div>

      <div className="space-y-4 pt-1">
        <div className="p-4 rounded-xl bg-gradient-to-r from-[#D4AF37]/25 via-black/80 to-[#D4AF37]/25 border-2 border-[#D4AF37] text-center space-y-1 shadow-[0_0_25px_rgba(212,175,55,0.4)]">
          <span className="text-[10px] font-mono text-[#D4AF37] font-black uppercase tracking-widest block">
            [ NÚCLEO CENTRAL DE LA NOTICIA ]
          </span>
          <h5 className="font-serif text-sm sm:text-base font-extrabold text-white leading-snug">
            "{nodes[0]?.desc || title}"
          </h5>
        </div>

        <div className="w-0.5 h-6 bg-[#D4AF37] mx-auto opacity-70"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {nodes.slice(1).map((node, idx) => {
            let borderColor = "border-lime-500/70";
            let textColor = "text-lime-300";
            let bgColor = "rgba(132, 204, 22, 0.22)";
            
            if (node.color === 'slate') {
              borderColor = "border-slate-300/50";
              textColor = "text-slate-200";
              bgColor = "rgba(100, 116, 139, 0.22)";
            } else if (node.color === 'red') {
              borderColor = "border-red-500/70";
              textColor = "text-red-300";
              bgColor = "rgba(220, 38, 38, 0.22)";
            }

            return (
              <div 
                key={idx}
                className={`p-3.5 rounded-xl border ${borderColor} space-y-1.5 text-xs shadow-lg flex flex-col justify-between`}
                style={{ backgroundColor: bgColor, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
              >
                <div className="space-y-1">
                  <span className={`font-mono text-[10px] font-extrabold block ${textColor}`}>
                    {node.label}
                  </span>
                  <p className="font-sans text-[11px] text-gray-200 leading-relaxed font-light">
                    {node.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

// COMPONENTE DE ANÁLISIS COMPLETO (MARCO TEÓRICO, TESIS Y CONCLUSIÓN NEUTRA)
function AcademicAnalysisSection({ analysis, title }) {
  if (!analysis) return null;

  return (
    <div className="space-y-5 pt-2">
      
      <div 
        className="p-5 rounded-2xl border border-[#D4AF37]/35 space-y-2 shadow-2xl"
        style={{
          backgroundColor: 'rgba(5, 15, 30, 0.22)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }}
      >
        <span className="text-[10px] font-mono text-[#D4AF37] font-extrabold uppercase tracking-widest flex items-center gap-2">
          <BookOpen size={15} /> MARCO TEÓRICO & ESTRUCTURA NORMATIVA:
        </span>
        <p className="font-sans text-xs md:text-sm text-gray-100 leading-relaxed font-light">
          {analysis.marcoTeorico}
        </p>
      </div>

      <div 
        className="p-5 rounded-2xl border-l-4 border-[#D4AF37] border border-[#D4AF37]/35 space-y-2 shadow-2xl"
        style={{
          backgroundColor: 'rgba(20, 20, 10, 0.22)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }}
      >
        <span className="text-[10px] font-mono text-[#D4AF37] font-extrabold uppercase tracking-widest flex items-center gap-2">
          <Target size={15} /> TESIS CENTRAL FACTUAL DEL ARTÍCULO:
        </span>
        <p className="font-serif text-sm md:text-base text-white leading-relaxed font-bold italic">
          "{analysis.tesisCentral}"
        </p>
      </div>

      <AcademicMindMap nodes={analysis.mapaMentalNodes} title={title} />

      <div 
        className="p-5 rounded-2xl border-l-4 border-emerald-400 border border-emerald-500/40 space-y-2 shadow-2xl"
        style={{
          backgroundColor: 'rgba(0, 35, 20, 0.22)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }}
      >
        <span className="text-[10px] font-mono text-emerald-400 font-extrabold uppercase tracking-widest flex items-center gap-2">
          <CheckCheck size={16} /> CONCLUSIÓN DEFINITIVA SIN SESGOS NI BANDOS:
        </span>
        <p className="font-sans text-xs md:text-sm text-emerald-100 leading-relaxed font-normal">
          {analysis.conclusionImparcial}
        </p>
      </div>

    </div>
  );
}

// INSIGNIA ELEGANTE COMPACTA DEL MEDIO
function MediaHeaderBadge({ sourceName, sourceDomain, logoUrl }) {
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

// BARRA DE SESGO IDEOLÓGICO MATEMÁTICO CON ORIGEN EN CENTRO (0% PUNTO NEUTRO)
function PoliticalBiasBar({ biasDirection, deviationPercent, biasLabel }) {
  const dir = biasDirection || 'Centro';
  const percent = deviationPercent !== undefined ? deviationPercent : 0;

  let visualPos = 50;
  if (dir === 'Izquierda') {
    visualPos = 50 - (percent * 0.45);
  } else if (dir === 'Derecha') {
    visualPos = 50 + (percent * 0.45);
  }

  let displayText = "0% Sesgo (Punto Cero Neutral)";
  if (dir === 'Izquierda') displayText = `${percent}% Sesgo Izquierda`;
  else if (dir === 'Derecha') displayText = `${percent}% Sesgo Derecha`;

  return (
    <div className="w-full space-y-1 mt-3 pt-2.5 border-t border-white/15 font-mono text-[10px]">
      <div className="flex items-center justify-between text-gray-300">
        <span className="flex items-center gap-1 font-semibold text-[#D4AF37] truncate">
          <Scale size={12} className="text-[#D4AF37] shrink-0" />
          <span>Calculo desde el Centro:</span>
        </span>
        <span className="text-[#D4AF37] font-bold shrink-0">{displayText}</span>
      </div>

      <div className="relative w-full h-2 rounded-full bg-black/80 overflow-hidden border border-white/20">
        <div className="absolute inset-0 bg-gradient-to-r from-[#84cc16] via-slate-200 to-red-600 opacity-90"></div>
        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/60 -translate-x-1/2 z-10"></div>
        
        <div 
          className="absolute top-0 bottom-0 w-3 bg-white border border-black shadow-[0_0_8px_rgba(255,255,255,1)] rounded-full -translate-x-1/2 transition-all duration-500 z-20"
          style={{ left: `${visualPos}%` }}
        ></div>
      </div>
    </div>
  );
}

function NoticiasContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialCountry = searchParams.get('pais') || 'co';
  const [activeCountry, setActiveCountry] = useState(initialCountry);
  const [activeCategoryTab, setActiveCategoryTab] = useState('ultimas');
  const [publisherLayoutMode, setPublisherLayoutMode] = useState('diario');

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

        {/* MASTHEAD PRINCIPAL CON CONTROL EDITORIAL PUBLISHER */}
        <div className="leather-canvas-blue rounded-3xl p-6 md:p-10 backdrop-blur-2xl relative overflow-hidden space-y-6 border-2 border-[#D4AF37]/50 shadow-[0_20px_60px_rgba(0,0,0,0.9)]">
          
          <div className="text-center space-y-4 border-b border-[#D4AF37]/35 pb-6">
            <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-gray-300 uppercase tracking-widest px-2 gap-2">
              <span className="hidden sm:inline font-bold text-[#D4AF37]/90">Mesa Editorial GranColinos • Publisher News Engine</span>
              
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
              "Perfil de periodistas con trayectoria pública verídica, maquetación editorial y monitoreo cuantitativo de 5 espectros."
            </p>

            {/* BARRA DE CONTROL PUBLISHER EDITORIAL */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <div className="inline-flex items-center gap-1.5 p-1 bg-black/80 rounded-2xl border border-[#D4AF37]/50 shadow-xl font-mono text-xs font-bold">
                <button
                  onClick={() => setPublisherLayoutMode('diario')}
                  className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 uppercase tracking-wider ${
                    publisherLayoutMode === 'diario'
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-black shadow-lg scale-105'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Newspaper size={14} /> Diario Editorial
                </button>

                <button
                  onClick={() => setPublisherLayoutMode('radar')}
                  className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 uppercase tracking-wider ${
                    publisherLayoutMode === 'radar'
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-black shadow-lg scale-105'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <LayoutGrid size={14} /> Radar Hemerográfico
                </button>

                <button
                  onClick={() => setPublisherLayoutMode('investigacion')}
                  className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 uppercase tracking-wider ${
                    publisherLayoutMode === 'investigacion'
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-black shadow-lg scale-105'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <BrainCircuit size={14} /> Expediente Factual
                </button>
              </div>
            </div>
          </div>

          {/* DASHBOARD INDICADORES DE PUBLISHER */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs text-center border-b border-white/10 pb-4">
            <div className="p-3 bg-black/40 rounded-xl border border-white/10 space-y-0.5">
              <span className="text-gray-400 text-[10px] uppercase font-bold block">Coberturas En Vivo</span>
              <strong className="text-white font-extrabold text-sm">{realtimeArticles.length} Medios Indexados</strong>
            </div>
            <div className="p-3 bg-black/40 rounded-xl border border-white/10 space-y-0.5">
              <span className="text-gray-400 text-[10px] uppercase font-bold block">Matriz Ideológica</span>
              <strong className="text-[#D4AF37] font-extrabold text-sm">5 Espectros Evaluados</strong>
            </div>
            <div className="p-3 bg-black/40 rounded-xl border border-white/10 space-y-0.5">
              <span className="text-gray-400 text-[10px] uppercase font-bold block">Punto Cero Neutral</span>
              <strong className="text-emerald-400 font-extrabold text-sm">0% Sesgo de Origen</strong>
            </div>
            <div className="p-3 bg-black/40 rounded-xl border border-white/10 space-y-0.5">
              <span className="text-gray-400 text-[10px] uppercase font-bold block">Autores Periodísticos</span>
              <strong className="text-white font-extrabold text-sm">Trayectoria Pública</strong>
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
                    <PoliticalBiasBar biasDirection={topNewsPrimary.biasDirection} deviationPercent={topNewsPrimary.deviationPercent} biasLabel={topNewsPrimary.biasLabel} />

                    <button
                      onClick={() => setSelectedBiasComparison(topNewsPrimary)}
                      className="w-full py-3 px-4 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-mono font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2 border border-white/30"
                    >
                      <Scale size={16} />
                      <span>Ver Datos & Métricas + Mapa Mental + Conclusión Neutra</span>
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
                      <span>Comparar 5 Espectros + Métricas</span>
                    </button>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* MAIN GRID SEGÚN MODO PUBLISHER */}
          <div className="pt-8 border-t border-white/15 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <div className="lg:col-span-8 space-y-6">
              <div className="border-b border-white/15 pb-2 flex items-center justify-between">
                <h3 className="font-serif text-xl font-bold text-white uppercase tracking-wider">
                  MONITOREO MULTIMEDIOS & ANÁLISIS DE INTENCIÓN ({publisherLayoutMode.toUpperCase()})
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
                      />

                      <h4 className="font-serif text-base font-bold text-white line-clamp-2 hover:text-[#D4AF37] transition-colors leading-snug">
                        {feedItem.title}
                      </h4>
                      
                      <p className="text-xs font-sans text-gray-300 line-clamp-2 font-light leading-relaxed">
                        {feedItem.summary}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2">
                      <PoliticalBiasBar biasDirection={feedItem.biasDirection} deviationPercent={feedItem.deviationPercent} biasLabel={feedItem.biasLabel} />

                      <button
                        onClick={() => setSelectedBiasComparison(feedItem)}
                        className="w-full py-2 px-3 bg-black/70 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black font-mono font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-all border border-[#D4AF37]/40 flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Scale size={13} />
                        <span>Abrir Noticia Completa + Métricas + Mapa Mental</span>
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

        {/* MODAL LECTURA INTEGRADO CON BOTÓN INTERACTIVO PARA VER EL DOSSIER DEL AUTOR */}
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
            <div className="leather-canvas-blue text-white rounded-3xl max-w-5xl w-full max-h-[88vh] overflow-y-auto p-6 md:p-10 space-y-6 relative shadow-[0_0_120px_rgba(212,175,55,0.5)] border-2 border-[#D4AF37] my-auto">
              
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
                />

                <h2 className="font-serif text-2xl md:text-4xl font-extrabold text-white leading-tight drop-shadow-md">
                  {selectedArticle.title}
                </h2>

                <div className="flex flex-wrap items-center justify-between text-xs font-mono text-gray-300 pt-1">
                  {/* BOTÓN INTERACTIVO PARA ABRIR HOJA DE VIDA Y TRAYECTORIA DEL AUTOR */}
                  <button 
                    onClick={() => setSelectedAuthor(selectedArticle.authorProfile)}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/50 hover:bg-[#D4AF37] hover:text-black transition-all group/author cursor-pointer text-left shadow-md"
                  >
                    <User size={15} className="text-[#D4AF37] group-hover/author:text-black transition-colors" />
                    <span>Autor Periodístico: <strong className="underline decoration-[#D4AF37] underline-offset-4">{selectedArticle.author}</strong></span>
                    <BadgeCheck size={14} className="text-[#D4AF37] group-hover/author:text-black shrink-0" />
                    <span className="text-[9px] bg-black/60 group-hover/author:bg-black text-[#D4AF37] group-hover/author:text-white px-2 py-0.5 rounded-full font-bold">Ver Hoja de Vida</span>
                  </button>

                  <span className="flex items-center gap-1.5 font-bold text-[#D4AF37]">
                    <Clock size={14} className="text-[#D4AF37]" /> {selectedArticle.publishedAt}
                  </span>
                </div>
              </div>

              {/* ACCESO A COMPARADOR DE ESPECTROS */}
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
                    <Scale size={14} /> Comparador de Espectros Politicos (0% Centro)
                  </span>
                  <p className="text-xs font-sans text-gray-300">
                    Inspecciona la misma noticia bajo la narrativa de los 5 medios de comunicación.
                  </p>
                </div>

                <button
                  onClick={() => {
                    const art = selectedArticle;
                    setSelectedArticle(null);
                    setSelectedBiasComparison(art);
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-mono font-extrabold text-xs uppercase tracking-widest rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)] shrink-0 flex items-center gap-2 border border-white/30"
                >
                  <BrainCircuit size={15} />
                  <span>Ver 5 Espectros & Comparativa</span>
                </button>
              </div>

              {/* SECCIÓN 1: DATOS Y MÉTRICAS CUANTITATIVAS BALANCEADAS */}
              <EventMetricsGrid metrics={selectedArticle.metricsData} />

              {/* SECCIÓN 2: MARCO TEÓRICO, TESIS, MAPA MENTAL & CONCLUSIÓN IMPARCIAL */}
              <AcademicAnalysisSection 
                analysis={selectedArticle.academicAnalysis} 
                title={selectedArticle.title}
              />

              {/* SECCIÓN 3: REPORTAJE COMPLETO DETALLADO DEL EVENTO */}
              <div className="space-y-4 font-sans text-sm text-gray-200 leading-relaxed font-light pt-4 border-t border-white/15">
                <h4 className="font-serif text-lg font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-2">
                  <FileText size={18} /> REPORTAJE COMPLETO & HECHOS DESARROLLADOS
                </h4>

                <div className="space-y-4 text-base leading-relaxed text-gray-100 font-sans bg-black/40 p-6 rounded-2xl border border-white/15 shadow-inner">
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
                  <span>Ir a la Noticia Oficial Matriz</span>
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

        {/* MODAL DE COMPARACIÓN CON DATOS, MÉTRICAS, MARCO TEÓRICO, TESIS, MAPA MENTAL Y CONCLUSIÓN IMPARCIAL */}
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
                  <span>Análisis de Sesgos + Métricas + Mapa Mental + Conclusión Neutra</span>
                </div>

                <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-white leading-tight">
                  Misma Noticia — Cobertura en los 5 Espectros Políticos
                </h3>
                
                {/* EVENTO MATRIZ DESTACADO */}
                <div className="pt-2">
                  <span className="text-xs font-mono text-[#D4AF37] font-bold uppercase tracking-wider block">
                    Evento Matriz / Noticia Evaluada:
                  </span>
                  <h4 className="font-serif text-xl sm:text-3xl font-black text-white leading-snug mt-1 text-gold-gradient drop-shadow-md">
                    "{selectedBiasComparison.title}"
                  </h4>
                </div>
              </div>

              {/* GUÍA DEL ESPECTRO IDEOLÓGICO */}
              <div 
                className="p-5 rounded-2xl border border-[#D4AF37]/40 space-y-3 shadow-2xl"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.22)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)'
                }}
              >
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase font-extrabold tracking-widest flex items-center gap-1.5">
                  <CompassIcon size={14} /> GUÍA DEL ESPECTRO (DISTANCIA DESDE EL CENTRO 0% NEUTRAL):
                </span>
                
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-[10px] font-mono text-center font-bold">
                  <div 
                    className="p-2.5 rounded-xl border border-lime-500/60 text-lime-300 flex flex-col items-center justify-center gap-1 shadow-md"
                    style={{ backgroundColor: 'rgba(132, 204, 22, 0.22)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
                  >
                    <span className="w-2.5 h-2.5 bg-[#84cc16] rounded-full shadow-[0_0_8px_rgba(132,204,22,0.8)]"></span>
                    <span>1. Izquierda (75% Sesgo Izq)</span>
                  </div>

                  <div 
                    className="p-2.5 rounded-xl border border-lime-400/50 text-lime-200 flex flex-col items-center justify-center gap-1 shadow-md"
                    style={{ backgroundColor: 'rgba(100, 180, 20, 0.22)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
                  >
                    <span className="w-2.5 h-2.5 bg-[#a3e635] rounded-full shadow-[0_0_8px_rgba(163,230,53,0.8)]"></span>
                    <span>2. Centro-Izquierda (30% Sesgo Izq)</span>
                  </div>

                  <div 
                    className="p-2.5 rounded-xl border border-slate-300/50 text-slate-100 flex flex-col items-center justify-center gap-1 shadow-md"
                    style={{ backgroundColor: 'rgba(100, 116, 139, 0.22)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
                  >
                    <span className="w-2.5 h-2.5 bg-slate-200 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"></span>
                    <span>3. Centro Factual (0% Punto Cero)</span>
                  </div>

                  <div 
                    className="p-2.5 rounded-xl border border-red-400/50 text-red-200 flex flex-col items-center justify-center gap-1 shadow-md"
                    style={{ backgroundColor: 'rgba(180, 40, 40, 0.22)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
                  >
                    <span className="w-2.5 h-2.5 bg-red-400 rounded-full shadow-[0_0_8px_rgba(248,113,113,0.8)]"></span>
                    <span>4. Centro-Derecha (32% Sesgo Der)</span>
                  </div>

                  <div 
                    className="p-2.5 rounded-xl border border-red-600/60 text-red-300 flex flex-col items-center justify-center gap-1 shadow-md"
                    style={{ backgroundColor: 'rgba(220, 38, 38, 0.22)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
                  >
                    <span className="w-2.5 h-2.5 bg-red-600 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
                    <span>5. Derecha (80% Sesgo Der)</span>
                  </div>
                </div>
              </div>

              {/* DATOS Y MÉTRICAS CUANTITATIVAS BALANCEADAS DEL EVENTO */}
              <EventMetricsGrid metrics={selectedBiasComparison.metricsData} />

              {/* INTEGRACIÓN DEL ANÁLISIS ACADÉMICO: MARCO TEÓRICO, TESIS, MAPA MENTAL Y CONCLUSIÓN IMPARCIAL */}
              <AcademicAnalysisSection 
                analysis={selectedBiasComparison.academicAnalysis} 
                title={selectedBiasComparison.title}
              />

              {/* VENTANAS DE CADA TITULAR CON DOS BOTONES CLAROS Y DIFERENCIADOS */}
              <div className="space-y-4 pt-4 border-t border-white/15">
                <h4 className="font-serif text-base font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-2">
                  <Scale size={16} /> COBERTURAS Y DESVIACIONES DESDE EL CENTRO (0%)
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

                        {/* Análisis de Intención & Encuadre */}
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

                      {/* Barra de Sesgo & DOS BOTONES DISTINTOS */}
                      <div className="space-y-2.5 pt-2">
                        <PoliticalBiasBar biasDirection={coverage.biasDirection} deviationPercent={coverage.deviationPercent} biasLabel={coverage.biasLabel} />

                        <div className="grid grid-cols-1 gap-1.5 font-mono text-[10px]">
                          <a
                            href={coverage.outletUrl || `https://${coverage.sourceDomain}/`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2 px-3 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-mono font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-all shadow-md hover:bg-white flex items-center justify-center gap-1.5"
                          >
                            <span>LEER NOTICIA EN {coverage.sourceName}</span>
                            <ExternalLink size={11} />
                          </a>

                          <a
                            href={coverage.officialMatrixUrl || selectedBiasComparison.originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-1.5 px-3 bg-white/10 hover:bg-white/20 text-gray-200 font-mono font-bold text-[9px] uppercase tracking-wider rounded-xl transition-all border border-white/20 flex items-center justify-center gap-1"
                          >
                            <Globe size={11} className="text-[#D4AF37]" />
                            <span>NOTICIA OFICIAL MATRIZ</span>
                            <ExternalLink size={10} />
                          </a>
                        </div>

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

        {/* MODAL HOJA DE VIDA PÚBLICA & TRAYECTORIA PROFESIONAL DEL AUTOR */}
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
                    <span>Perfil Profesional de Prensa Verificado</span>
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

              <div className="space-y-2">
                <h4 className="font-serif text-sm font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-2">
                  <FileText size={16} /> Biografía & Trayectoria Informativa
                </h4>
                <p className="font-sans text-xs md:text-sm text-gray-200 leading-relaxed bg-black/40 p-4 rounded-2xl border border-white/10">
                  {selectedAuthor.bio}
                </p>
              </div>

              {/* TRAYECTORIA DE MEDIOS Y EMPRESAS DONDE HA TRABAJADO */}
              <div className="space-y-2">
                <h4 className="font-serif text-sm font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-2">
                  <History size={16} /> Medios y Empresas Donde Ha Trabajado (Trayectoria Profesional)
                </h4>
                <div className="space-y-2 bg-black/40 p-4 rounded-2xl border border-white/10 font-mono text-xs">
                  {selectedAuthor.previousWork.map((work, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-gray-200">
                      <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
                      <span>{work}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-serif text-sm font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-2">
                  <Briefcase size={16} /> Áreas de Especialización Periodística
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedAuthor.specialties.map((spec, i) => (
                    <span key={i} className="px-3 py-1 rounded-lg bg-white/10 border border-white/15 text-xs font-mono font-semibold text-gray-200">
                      • {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/20 flex items-center justify-between font-mono text-xs">
                <span className="text-[#D4AF37] font-bold">Publicaciones Indexadas: {selectedAuthor.publishedCount} Reportes</span>

                <button
                  onClick={() => setSelectedAuthor(null)}
                  className="px-6 py-2.5 bg-white/10 text-white hover:bg-white/20 font-bold text-xs uppercase rounded-xl transition-all border border-white/20"
                >
                  Cerrar Hoja de Vida
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
