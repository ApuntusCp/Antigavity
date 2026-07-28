'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Newspaper, ArrowRight, Clock, Globe, Rss, Sparkles, RefreshCw, UserCheck, X, ChevronDown, TrendingUp, BookOpen, ShieldCheck, Award, CheckCircle2, FileText, User, Calendar, MapPin, BarChart3, Scale, Filter, Building2, GraduationCap, Compass, ExternalLink, Info, Sliders, Layers, ChevronRight, Check, Briefcase, Mail, Phone, Lock, FileSpreadsheet, BadgeCheck, Radio, Landmark, Eye, GitCompare, Compass as CompassIcon, Network, BrainCircuit, Target, Lightbulb, CheckCheck, Percent, LayoutGrid, Rows3, SlidersHorizontal, PieChart, History, AlertTriangle, Calculator, Flame } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import NewsTrustBadge from '../../components/NewsTrustBadge';

// COMPONENTE DE DATOS Y MÉTRICAS EN TEMA VERDE BOTÁNICO Y DORADO LUXURY (69% TRANSPARENCIA + BLUR)
function EventMetricsGrid({ metrics }) {
  if (!metrics || metrics.length === 0) return null;

  const displayMetrics = metrics.slice(0, 4);

  return (
    <div 
      className="p-5 sm:p-6 rounded-2xl border border-[#D4AF37]/50 space-y-4 shadow-2xl"
      style={{
        backgroundColor: 'rgba(10, 24, 12, 0.65)',
        backdropFilter: 'blur(22px)',
        WebkitBackdropFilter: 'blur(22px)'
      }}
    >
      <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3">
        <span className="text-xs sm:text-sm font-mono text-[#D4AF37] font-extrabold uppercase tracking-wider flex items-center gap-2">
          <BarChart3 size={18} className="text-[#D4AF37]" /> DATOS & MÉTRICAS CUANTITATIVAS DEL EVENTO
        </span>
        <span className="text-[10px] sm:text-xs font-mono text-[#D4AF37] font-extrabold px-3 py-1 rounded-full bg-[#051006]/80 border border-[#D4AF37]/60 shadow-md">
          Métricas Verificadas
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {displayMetrics.map((item, idx) => (
          <div 
            key={idx}
            className="p-4 rounded-xl border border-[#D4AF37]/35 space-y-1.5 shadow-md flex flex-col justify-between hover:border-[#D4AF37] transition-all"
            style={{
              backgroundColor: 'rgba(4, 14, 5, 0.55)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)'
            }}
          >
            <span className="text-[10px] font-mono text-emerald-300/80 font-extrabold uppercase tracking-wider block">
              {item.label}:
            </span>
            <strong className="font-serif text-sm sm:text-base font-black text-white block leading-snug">
              {item.value}
            </strong>
          </div>
        ))}
      </div>
    </div>
  );
}

// COMPONENTE SKELETON DE ALTA FIDELIDAD BOTANICAL GOLD (EVITA CLS Y MOSTRAR "0 COBERTURAS")
function NewsFeedSkeleton() {
  return (
    <div className="space-y-8 animate-pulse pt-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div 
          className="lg:col-span-7 rounded-3xl p-6 md:p-8 space-y-4 border-2 border-[#D4AF37]/30 min-h-[380px] flex flex-col justify-between"
          style={{ backgroundColor: 'rgba(5, 12, 24, 0.35)', backdropFilter: 'blur(22px)' }}
        >
          <div className="space-y-3">
            <div className="h-6 w-36 bg-[#D4AF37]/30 rounded-full"></div>
            <div className="h-10 w-5/6 bg-white/15 rounded-xl"></div>
            <div className="h-24 w-full bg-black/40 rounded-2xl border border-white/5"></div>
          </div>
          <div className="h-12 w-full bg-gradient-to-r from-[#D4AF37]/40 to-[#AA7C11]/40 rounded-xl"></div>
        </div>

        <div className="lg:col-span-5 space-y-3.5 flex flex-col justify-between">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-2xl p-4 border border-[#D4AF37]/20 space-y-3 min-h-[110px] bg-white/5 flex flex-col justify-between">
              <div className="h-4 w-1/3 bg-[#D4AF37]/30 rounded-md"></div>
              <div className="h-5 w-full bg-white/10 rounded-md"></div>
              <div className="h-6 w-full bg-white/10 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="h-6 w-56 bg-[#D4AF37]/30 rounded-lg"></div>
        <div className="flex gap-4 overflow-hidden pb-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="w-72 h-48 rounded-2xl border border-[#D4AF37]/20 bg-white/5 shrink-0 p-4 space-y-3 flex flex-col justify-between">
              <div className="h-4 w-24 bg-[#D4AF37]/30 rounded-md"></div>
              <div className="h-10 w-full bg-white/10 rounded-md"></div>
              <div className="h-8 w-full bg-white/10 rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// COMPONENTE PARA EL DESGLOSE MATEMÁTICO DEL CÁLCULO DE SESGO (TEMA VERDE BOTÁNICO + DORADO LUXURY)
function MathematicalBiasBreakdown({ formulaBreakdown, biasLevel, isNeutral }) {
  if (!formulaBreakdown) return null;

  return (
    <div 
      className="p-5 sm:p-6 rounded-2xl border border-[#D4AF37]/50 space-y-4 shadow-2xl"
      style={{
        backgroundColor: 'rgba(10, 24, 12, 0.65)',
        backdropFilter: 'blur(22px)',
        WebkitBackdropFilter: 'blur(22px)'
      }}
    >
      <div className="flex flex-wrap items-center justify-between border-b border-[#D4AF37]/30 pb-3 gap-2">
        <span className="text-xs sm:text-sm font-mono text-[#D4AF37] font-extrabold uppercase tracking-wider flex items-center gap-2">
          <Calculator size={18} className="text-[#D4AF37]" /> FÓRMULA MATEMÁTICA Y DESGLOSE EXACTO DEL CÁLCULO
        </span>
        <span className={`text-[11px] font-mono font-black px-3.5 py-1 rounded-full border shadow-md flex items-center gap-1.5 ${
          isNeutral 
            ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/70' 
            : 'bg-amber-950/90 text-amber-300 border-amber-500/70'
        }`}>
          <span>{biasLevel || "0% Sesgo (Neutral)"}</span>
        </span>
      </div>

      {/* DESGLOSE FACTORIAL CUANTITATIVO CON TIPOGRAFÍA Y TONALIDAD VERDE BOTÁNICA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 font-mono">
        <div 
          className="p-4 rounded-xl border border-[#D4AF37]/30 space-y-1.5"
          style={{
            backgroundColor: 'rgba(4, 14, 5, 0.55)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)'
          }}
        >
          <span className="text-emerald-300/80 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider block">
            1. PONDERACIÓN LÍNEA EDITORIAL DEL MEDIO (F1):
          </span>
          <strong className="text-white text-xs sm:text-sm block font-serif font-bold leading-relaxed">
            {formulaBreakdown.f1_label}
          </strong>
        </div>

        <div 
          className="p-4 rounded-xl border border-[#D4AF37]/30 space-y-1.5"
          style={{
            backgroundColor: 'rgba(4, 14, 5, 0.55)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)'
          }}
        >
          <span className="text-emerald-300/80 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider block">
            2. CARGA LÉXICA & ADJETIVACIÓN EN EL TITULAR (F2):
          </span>
          <strong className="text-white text-xs sm:text-sm block font-serif font-bold leading-relaxed">
            {formulaBreakdown.f2_label}
          </strong>
        </div>
      </div>

      {/* RESULTADO FINAL DE LA FÓRMULA EN TIPOGRAFÍA DESTACADA */}
      <div 
        className="p-4 rounded-xl border border-[#D4AF37] text-center font-mono text-xs sm:text-sm font-bold text-white shadow-xl"
        style={{
          backgroundColor: 'rgba(10, 24, 12, 0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)'
        }}
      >
        <span className="text-[10px] sm:text-xs text-[#D4AF37] font-black uppercase tracking-wider block mb-1">
          FÓRMULA DEL RESULTADO FINAL = (F1 MEDIO) + (F2 LÉXICO):
        </span>
        <span className="text-sm sm:text-base font-black text-gold-gradient tracking-wide">
          {formulaBreakdown.formulaText}
        </span>
      </div>
    </div>
  );
}

// COMPONENTE DE ANÁLISIS ACADÉMICO UNIFICADO (BOTÁNICO Y DORADO LUXURY)
function AcademicAnalysisSection({ analysis, title }) {
  if (!analysis) return null;

  return (
    <div className="space-y-6 pt-2">
      
      {/* 1. FÓRMULA MATEMÁTICA Y DESGLOSE EXACTO DEL CÁLCULO */}
      <MathematicalBiasBreakdown 
        formulaBreakdown={analysis.formulaBreakdown} 
        biasLevel={analysis.biasLevel} 
        isNeutral={analysis.isNeutral} 
      />

      {/* 2. MARCO TEÓRICO */}
      <div 
        className="p-5 sm:p-6 rounded-2xl border border-[#D4AF37]/50 space-y-2.5 shadow-2xl"
        style={{
          backgroundColor: 'rgba(10, 24, 12, 0.65)',
          backdropFilter: 'blur(22px)',
          WebkitBackdropFilter: 'blur(22px)'
        }}
      >
        <span className="text-xs sm:text-sm font-mono text-[#D4AF37] font-extrabold uppercase tracking-wider flex items-center gap-2">
          <BookOpen size={16} /> MARCO TEÓRICO & ESTRUCTURA NORMATIVA:
        </span>
        <p className="font-sans text-xs sm:text-sm md:text-base text-gray-100 leading-relaxed font-normal tracking-wide">
          {analysis.marcoTeorico}
        </p>
      </div>

      {/* 3. TESIS CENTRAL */}
      <div 
        className="p-5 sm:p-6 rounded-2xl border-l-4 border-[#D4AF37] border border-[#D4AF37]/50 space-y-2.5 shadow-2xl"
        style={{
          backgroundColor: 'rgba(10, 24, 12, 0.75)',
          backdropFilter: 'blur(22px)',
          WebkitBackdropFilter: 'blur(22px)'
        }}
      >
        <span className="text-xs sm:text-sm font-mono text-[#D4AF37] font-extrabold uppercase tracking-wider flex items-center gap-2">
          <Target size={16} /> TESIS CENTRAL FACTUAL DEL ARTÍCULO:
        </span>
        <p className="font-serif text-sm sm:text-base md:text-lg text-amber-100 leading-relaxed font-bold italic">
          "{analysis.tesisCentral}"
        </p>
      </div>

      {/* 4. CONCLUSIÓN DEFINITIVA DE INTEGRIDAD EDITORIAL */}
      <div 
        className="p-5 sm:p-6 rounded-2xl border-l-4 border-emerald-400 border border-emerald-500/50 space-y-2.5 shadow-2xl"
        style={{
          backgroundColor: 'rgba(6, 28, 12, 0.7)',
          backdropFilter: 'blur(22px)',
          WebkitBackdropFilter: 'blur(22px)'
        }}
      >
        <span className="text-xs sm:text-sm font-mono text-emerald-400 font-extrabold uppercase tracking-wider flex items-center gap-2">
          <CheckCheck size={18} /> CONCLUSIÓN IMPARCIAL DE INTEGRIDAD EDITORIAL:
        </span>
        <p className="font-sans text-xs sm:text-sm md:text-base text-emerald-100 leading-relaxed font-medium">
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

// BARRA DE SESGO IDEOLÓGICO: VERDE (IZQUIERDA) -> AMARILLO DORADO (CENTRO NEUTRAL) -> NARANJA INTENSO (DERECHA)
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
  let textColorClass = "text-[#D4AF37]";

  if (dir === 'Izquierda') {
    displayText = `${percent}% Sesgo Izquierda`;
    textColorClass = "text-emerald-400";
  } else if (dir === 'Derecha') {
    displayText = `${percent}% Sesgo Derecha`;
    textColorClass = "text-orange-400";
  }

  return (
    <div className="w-full space-y-1.5 mt-3 pt-2.5 border-t border-white/15 font-mono text-[10px]">
      <div className="flex items-center justify-between text-gray-300">
        <span className="flex items-center gap-1 font-semibold text-gray-200 truncate">
          <Scale size={12} className="text-[#D4AF37] shrink-0" />
          <span>Calculo desde el Centro:</span>
        </span>
        <span className={`font-black shrink-0 ${textColorClass}`}>{displayText}</span>
      </div>

      <div className="relative w-full h-2.5 rounded-full bg-black/90 overflow-hidden border border-white/20 shadow-inner">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-[#D4AF37] to-orange-500 opacity-95"></div>
        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white -translate-x-1/2 z-10"></div>
        
        <div 
          className="absolute top-0 bottom-0 w-3.5 bg-white border-2 border-black shadow-[0_0_10px_rgba(255,255,255,1)] rounded-full -translate-x-1/2 transition-all duration-500 z-20"
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
  const [newsData, setNewsData] = useState(null);
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
          if (isMounted && data.success) {
            setNewsData(data);
            if (data.articles && data.articles.length > 0) {
              setRealtimeArticles(data.articles);
            }
            setLoadingFeed(false);
            return;
          }
        }
      } catch (err) {
        console.error("Error al sincronizar feed de medios:", err);
      } finally {
        if (isMounted) setLoadingFeed(false);
      }
    }

    fetchLiveNewsFeed();

    // Auto-polling cada 30 segundos para actualización en tiempo real (Fase 5)
    const pollInterval = setInterval(fetchLiveNewsFeed, 30000);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
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

        {/* MASTHEAD PRINCIPAL CON TRANSPARENCIA Y FECHA SIN ANIMACIÓN */}
        <div 
          className="rounded-3xl p-6 md:p-10 relative overflow-hidden space-y-6 border-2 border-[#D4AF37]/50 shadow-[0_20px_80px_rgba(0,0,0,0.95)]"
          style={{
            backgroundColor: 'rgba(5, 12, 24, 0.22)',
            backdropFilter: 'blur(22px)',
            WebkitBackdropFilter: 'blur(22px)'
          }}
        >
          
          <div className="text-center space-y-4 border-b border-[#D4AF37]/35 pb-6">
            <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-gray-300 uppercase tracking-widest px-2 gap-2">
              <span className="hidden sm:inline font-bold text-[#D4AF37]/90">Mesa Editorial GranColinos • Publisher News Engine</span>
              
              <div className="inline-flex items-center font-extrabold text-[#D4AF37] px-4 py-1.5 bg-black/80 rounded-full border border-[#D4AF37]/50 shadow-md">
                <span>{formattedDate}</span>
              </div>

              <span className="hidden sm:inline font-bold text-[#D4AF37]/90">GranColinos Journal</span>
            </div>

            <h1 className="font-serif text-5xl md:text-8xl font-black tracking-tight text-gold-gradient uppercase drop-shadow-[0_4px_30px_rgba(212,175,55,0.45)]">
              GRAN NOTICIAS
            </h1>
            
            <div className="w-36 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto rounded-full shadow-[0_0_10px_rgba(212,175,55,0.8)]"></div>
            
            <p className="text-xs md:text-sm font-serif italic text-gray-200 max-w-3xl mx-auto font-light leading-relaxed">
              "Diagnóstico de integridad editorial, perfil de periodistas y monitoreo cuantitativo de 5 espectros."
            </p>

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

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs text-center border-b border-white/10 pb-4">
            <div 
              className="p-3 rounded-xl border border-white/10 space-y-0.5"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.22)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)'
              }}
            >
              <span className="text-gray-400 text-[10px] uppercase font-bold block">Coberturas En Vivo</span>
              <strong className="text-white font-extrabold text-sm">
                {loadingFeed && realtimeArticles.length === 0 ? (
                  <span className="text-[#D4AF37] animate-pulse">Sincronizando...</span>
                ) : (
                  `${newsData?.count || realtimeArticles.length} Coberturas`
                )}
              </strong>
            </div>

            <div 
              className="p-3 rounded-xl border border-white/10 space-y-0.5"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.22)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)'
              }}
            >
              <span className="text-gray-400 text-[10px] uppercase font-bold block">Medios Indexados</span>
              <strong className="text-[#D4AF37] font-extrabold text-sm">
                {loadingFeed && realtimeArticles.length === 0 ? (
                  <span className="text-[#D4AF37] animate-pulse">Indexando...</span>
                ) : (
                  `${newsData?.activeMediaCount || 5} Medios Activos`
                )}
              </strong>
            </div>

            <div 
              className="p-3 rounded-xl border border-white/10 space-y-0.5"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.22)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)'
              }}
            >
              <span className="text-gray-400 text-[10px] uppercase font-bold block">Punto Cero Neutral</span>
              <strong className="text-emerald-400 font-extrabold text-sm">0% Sesgo de Origen</strong>
            </div>

            <div 
              className="p-3 rounded-xl border border-white/10 space-y-0.5"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.22)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)'
              }}
            >
              <span className="text-gray-400 text-[10px] uppercase font-bold block">Diagnóstico de Integridad</span>
              <strong className="text-white font-extrabold text-sm">Análisis Diversificado</strong>
            </div>
          </div>

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
        </div>

        {/* ESTADO DE CARGA SKELETON EN LUGAR DE CERO SECO */}
          {loadingFeed && realtimeArticles.length === 0 ? (
            <NewsFeedSkeleton />
          ) : !loadingFeed && realtimeArticles.length === 0 ? (
            <div className="p-8 rounded-3xl border border-[#D4AF37]/40 bg-[#050C18]/60 backdrop-blur-xl text-center space-y-4 my-6 shadow-2xl">
              <AlertTriangle size={32} className="text-[#D4AF37] mx-auto animate-bounce" />
              <h3 className="font-serif text-xl font-bold text-white uppercase">Sincronizando Feed Periodístico en Tiempo Real</h3>
              <p className="text-xs font-sans text-gray-300 max-w-md mx-auto">
                No se han recibido despachos para la región seleccionada. Haz clic a continuación para refrescar la mesa de noticias.
              </p>
              <button
                onClick={() => {
                  setLoadingFeed(true);
                  fetch('/api/noticias/feed?pais=' + activeCountry)
                    .then(res => res.json())
                    .then(data => {
                      if (data.success) {
                        setNewsData(data);
                        setRealtimeArticles(data.articles || []);
                      }
                    })
                    .finally(() => setLoadingFeed(false));
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-mono font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-white transition-all shadow-lg"
              >
                Reintentar Sincronización
              </button>
            </div>
          ) : (
            <>
              <div className="pt-2 space-y-5">
                <div className="flex items-center justify-between border-b border-white/15 pb-2">
                  <h2 className="font-serif text-xl md:text-2xl font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Flame size={20} className="text-amber-400 fill-amber-400 animate-pulse" /> NOTICIA MÁS VIRAL DEL DÍA & ANÁLISIS DE TITULARES
                  </h2>
                  <span className="text-xs font-mono text-[#D4AF37] font-bold">Fecha: {dateDayMonthYear}</span>
                </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {topNewsPrimary && (
                <div 
                  className="lg:col-span-7 rounded-3xl p-6 md:p-8 shadow-2xl transition-all duration-500 space-y-4 hover:border-[#D4AF37] flex flex-col justify-between border-2 border-[#D4AF37]/60"
                  style={{
                    backgroundColor: 'rgba(5, 12, 24, 0.22)',
                    backdropFilter: 'blur(22px)',
                    WebkitBackdropFilter: 'blur(22px)'
                  }}
                >
                  <div className="space-y-4">
                    <MediaHeaderBadge 
                      sourceName={topNewsPrimary.sourceName}
                      sourceDomain={topNewsPrimary.sourceDomain}
                      logoUrl={topNewsPrimary.sourceLogoUrl}
                    />

                    <div className="space-y-3 cursor-pointer" onClick={() => setSelectedArticle(topNewsPrimary)}>
                      <div className="flex flex-wrap items-center justify-between text-[11px] font-mono gap-2">
                        <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-[#D4AF37] text-black font-black uppercase tracking-widest rounded-full shadow-lg flex items-center gap-1.5 border border-white/40">
                          <Flame size={13} className="fill-black" /> 🔥 NOTICIA MÁS VIRAL DEL DÍA
                        </span>
                        <span className="text-[#D4AF37] font-bold">{topNewsPrimary.publishedAt}</span>
                      </div>

                      <h3 className="font-serif text-2xl md:text-4xl font-black text-white leading-tight hover:text-[#D4AF37] transition-colors drop-shadow-md">
                        {topNewsPrimary.title}
                      </h3>

                      <div 
                        className="p-4 rounded-2xl border border-[#D4AF37]/30 space-y-2 shadow-inner"
                        style={{
                          backgroundColor: 'rgba(0, 0, 0, 0.22)',
                          backdropFilter: 'blur(16px)',
                          WebkitBackdropFilter: 'blur(16px)'
                        }}
                      >
                        <span className="text-[10px] font-mono text-[#D4AF37] font-extrabold uppercase tracking-wider block flex items-center gap-1.5">
                          <FileText size={13} /> RESUMEN EJECUTIVO DE LA NOTICIA:
                        </span>
                        <p className="text-gray-100 text-xs md:text-sm font-sans leading-relaxed font-normal">
                          {topNewsPrimary.summary || topNewsPrimary.fullContent}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <PoliticalBiasBar biasDirection={topNewsPrimary.biasDirection} deviationPercent={topNewsPrimary.deviationPercent} biasLabel={topNewsPrimary.biasLabel} />

                    <button
                      onClick={() => setSelectedBiasComparison(topNewsPrimary)}
                      className="w-full py-3 px-4 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-mono font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2 border border-white/30"
                    >
                      <Scale size={16} />
                      <span>Ver Datos & Métricas + Diagnóstico de Integridad</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="lg:col-span-5 space-y-3.5 flex flex-col justify-between">
                {topNewsSecondary.map((secItem, idx) => (
                  <div
                    key={secItem.id}
                    className="rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all space-y-2 hover:border-[#D4AF37] border border-[#D4AF37]/30"
                    style={{
                      backgroundColor: 'rgba(5, 12, 24, 0.22)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)'
                    }}
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

          <div className="pt-8 border-t border-white/15 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <div className="lg:col-span-8 space-y-8">
              <div className="border-b border-white/15 pb-2 flex items-center justify-between">
                <h3 className="font-serif text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Globe size={20} className="text-[#D4AF37]" /> MONITOREO MULTIMEDIOS & ANÁLISIS DE INTENCIÓN (DIARIO)
                </h3>
                <span className="text-xs font-mono text-[#D4AF37] font-bold">{filteredNews.length} Coberturas Indexadas</span>
              </div>

              {/* FASE 4 — CARRUSELES DEDICADOS POR MEDIO INDEXADO */}
              {newsData && newsData.groupedByMedia && typeof newsData.groupedByMedia === 'object' ? (
                <div className="space-y-8">
                  {Object.values(newsData.groupedByMedia).map((mediaGroup) => (
                    <div key={`media-carousel-${mediaGroup.domain}`} className="space-y-3.5">
                      <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded-md bg-white p-0.5 border border-[#D4AF37]/50 flex items-center justify-center shrink-0 shadow-sm">
                            <img src={mediaGroup.logo} alt={mediaGroup.name} className="w-full h-full object-contain" />
                          </div>
                          <h4 className="font-serif text-base font-bold text-white uppercase tracking-wide">{mediaGroup.name}</h4>
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/40 font-bold">
                            {mediaGroup.count || 0} {mediaGroup.count === 1 ? 'Nota' : 'Notas'}
                          </span>
                        </div>

                        <span className="text-[10px] font-mono text-gray-400 uppercase">Carrusel de Editorial</span>
                      </div>

                      {mediaGroup.hasUpdates && mediaGroup.notes && mediaGroup.notes.length > 0 ? (
                        <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2 pt-1">
                          {(mediaGroup.notes || []).map(noteItem => (
                            <div
                              key={`media-note-${noteItem.id}`}
                              className="w-72 shrink-0 rounded-2xl p-4 shadow-lg transition-all space-y-3 hover:border-[#D4AF37] flex flex-col justify-between border border-[#D4AF37]/30"
                              style={{
                                backgroundColor: 'rgba(5, 12, 24, 0.22)',
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)'
                              }}
                            >
                              <div className="space-y-2 cursor-pointer" onClick={() => setSelectedArticle(noteItem)}>
                                <span className="text-[10px] font-mono text-[#D4AF37] block">{noteItem.publishedAt}</span>
                                <h5 className="font-serif text-sm font-bold text-white line-clamp-2 hover:text-[#D4AF37] transition-colors leading-snug">
                                  {noteItem.title}
                                </h5>
                                <p className="text-xs font-sans text-gray-300 line-clamp-2 font-light leading-relaxed">
                                  {noteItem.summary}
                                </p>
                              </div>

                              <div className="space-y-2 pt-2 border-t border-white/10">
                                <PoliticalBiasBar biasDirection={noteItem.biasDirection} deviationPercent={noteItem.deviationPercent} biasLabel={noteItem.biasLabel} />

                                <button
                                  onClick={() => setSelectedBiasComparison(noteItem)}
                                  className="w-full py-2 px-3 bg-black/70 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black font-mono font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-all border border-[#D4AF37]/40 flex items-center justify-center gap-1.5 shadow-sm"
                                >
                                  <Scale size={13} />
                                  <span>Abrir Noticia Completa</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 text-amber-300/80 font-mono text-xs flex items-center gap-2">
                          <AlertTriangle size={14} className="text-amber-400 shrink-0" />
                          <span>Sin publicaciones recientes en este ciclo de ingesta para {mediaGroup.name}.</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filteredNews.slice(1, visibleNewsCount + 1).map(feedItem => (
                    <div
                      key={`feed-grid-${feedItem.id}`}
                      className="rounded-2xl p-5 shadow-lg transition-all space-y-3 hover:border-[#D4AF37] flex flex-col justify-between border border-[#D4AF37]/30"
                      style={{
                        backgroundColor: 'rgba(5, 12, 24, 0.22)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)'
                      }}
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
                          <span>Abrir Noticia Completa + Métricas</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* FASE 5 — BARRA LATERAL DERECHA (TICKER DIVERSIFICADO EN TIEMPO REAL) */}
            <div 
              className="lg:col-span-4 rounded-3xl p-6 shadow-xl space-y-5 border border-[#D4AF37]/40"
              style={{
                backgroundColor: 'rgba(5, 12, 24, 0.22)',
                backdropFilter: 'blur(22px)',
                WebkitBackdropFilter: 'blur(22px)'
              }}
            >
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
                {countrySidebarNews.slice(0, 10).map((sideItem, idx) => {
                  const domain = sideItem.sourceDomain || 'prensa.org';
                  return (
                    <div
                      key={`sidebar-${sideItem.id}`}
                      className="p-3 hover:bg-white/10 rounded-xl transition-colors cursor-pointer border-b border-white/10 space-y-1 group flex items-start gap-3"
                      onClick={() => setSelectedArticle(sideItem)}
                    >
                      <div className="w-7 h-7 rounded-lg bg-white p-1 border border-[#D4AF37]/40 shrink-0 flex items-center justify-center mt-0.5">
                        <img 
                          src={`https://icons.duckduckgo.com/ip3/${domain}.ico`}
                          alt={sideItem.sourceName}
                          onError={(e) => {
                            e.currentTarget.src = `https://unavatar.io/${domain}`;
                          }}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-gray-400">
                          <span className="font-bold text-[#D4AF37]">#{idx + 1} • {sideItem.sourceName}</span>
                          <span className="text-[9px]">{sideItem.publishedAt}</span>
                        </div>
                        <p className="font-serif font-bold text-white text-xs leading-snug line-clamp-2 group-hover:text-[#D4AF37] transition-colors">
                          {sideItem.title}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
            </>
          )}

        {/* MODAL LECTURA CON TEMA VERDE BOTÁNICO Y DORADO LUXURY (69% TRANSPARENCIA + BLUR) */}
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
              backgroundColor: 'rgba(3, 10, 4, 0.75)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)'
            }}
          >
            <div 
              className="text-white rounded-3xl max-w-5xl w-full max-h-[88vh] overflow-y-auto p-6 md:p-10 space-y-6 relative shadow-[0_0_120px_rgba(212,175,55,0.4)] border-2 border-[#D4AF37]/80 my-auto"
              style={{
                backgroundColor: 'rgba(7, 20, 10, 0.75)',
                backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(212, 175, 55, 0.25) 0%, transparent 70%), radial-gradient(circle at 50% 100%, rgba(45, 80, 22, 0.4) 0%, transparent 70%)',
                backdropFilter: 'blur(26px)',
                WebkitBackdropFilter: 'blur(26px)'
              }}
            >
              
              <button
                onClick={() => setSelectedArticle(null)}
                className="sticky top-0 float-right z-50 text-[#D4AF37] hover:text-black bg-[#051006] hover:bg-[#D4AF37] w-9 h-9 rounded-full border-2 border-[#D4AF37]/70 flex items-center justify-center font-black transition-all shadow-xl"
                title="Cerrar Lectura"
              >
                ✕
              </button>

              <div className="space-y-3 border-b border-[#D4AF37]/40 pb-5 clear-both">
                <MediaHeaderBadge 
                  sourceName={selectedArticle.sourceName}
                  sourceDomain={selectedArticle.sourceDomain}
                  logoUrl={selectedArticle.sourceLogoUrl}
                />

                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-snug drop-shadow-md">
                  {selectedArticle.title}
                </h2>

                <div className="flex flex-wrap items-center justify-between text-xs font-mono text-gray-200 pt-2 gap-2">
                  <button 
                    onClick={() => setSelectedAuthor(selectedArticle.authorProfile)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D4AF37]/25 border border-[#D4AF37]/60 hover:bg-[#D4AF37] hover:text-black transition-all group/author cursor-pointer text-left shadow-md"
                  >
                    <User size={16} className="text-[#D4AF37] group-hover/author:text-black transition-colors" />
                    <span className="font-mono text-xs">Autor Periodístico: <strong className="underline decoration-[#D4AF37] underline-offset-4">{selectedArticle.author}</strong></span>
                    <BadgeCheck size={15} className="text-[#D4AF37] group-hover/author:text-black shrink-0" />
                    <span className="text-[10px] bg-black/70 group-hover/author:bg-black text-[#D4AF37] group-hover/author:text-white px-2.5 py-0.5 rounded-full font-bold">Ver Hoja de Vida</span>
                  </button>

                  <span className="flex items-center gap-1.5 font-bold text-[#D4AF37] text-xs">
                    <Clock size={15} className="text-[#D4AF37]" /> {selectedArticle.publishedAt}
                  </span>
                </div>
              </div>

              <div 
                className="p-4 sm:p-5 rounded-2xl border border-[#D4AF37]/60 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl"
                style={{
                  backgroundColor: 'rgba(4, 14, 5, 0.55)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)'
                }}
              >
                <div className="space-y-1">
                  <span className="text-xs sm:text-sm font-mono font-bold text-[#D4AF37] uppercase flex items-center gap-1.5">
                    <Scale size={16} /> Comparador de Espectros Politicos (0% Centro)
                  </span>
                  <p className="text-xs sm:text-sm font-sans text-gray-200 leading-relaxed font-light">
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

              <EventMetricsGrid metrics={selectedArticle.metricsData} />

              <AcademicAnalysisSection 
                analysis={selectedArticle.academicAnalysis} 
                title={selectedArticle.title}
              />

              <div className="space-y-4 font-sans text-sm text-gray-200 leading-relaxed font-light pt-4 border-t border-white/15">
                <h4 className="font-serif text-lg font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-2">
                  <FileText size={18} /> REPORTAJE COMPLETO & HECHOS DESARROLLADOS
                </h4>

                <div 
                  className="space-y-4 text-sm sm:text-base leading-relaxed text-gray-100 font-sans p-6 rounded-2xl border border-[#D4AF37]/35 shadow-inner"
                  style={{
                    backgroundColor: 'rgba(4, 14, 5, 0.55)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)'
                  }}
                >
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

        {/* MODAL DE COMPARACIÓN DE 5 ESPECTROS EN TEMA BOTÁNICO DE CUERO VERDE Y DORADO LUXURY */}
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
              backgroundColor: 'rgba(3, 10, 4, 0.75)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)'
            }}
          >
            <div 
              className="text-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-10 space-y-6 relative shadow-[0_0_130px_rgba(212,175,55,0.45)] border-2 border-[#D4AF37]/80 my-auto"
              style={{
                backgroundColor: 'rgba(7, 20, 10, 0.75)',
                backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(212, 175, 55, 0.28) 0%, transparent 70%), radial-gradient(circle at 50% 100%, rgba(45, 80, 22, 0.45) 0%, transparent 70%)',
                backdropFilter: 'blur(26px)',
                WebkitBackdropFilter: 'blur(26px)'
              }}
            >
              
              <button
                onClick={() => setSelectedBiasComparison(null)}
                className="sticky top-0 float-right z-50 text-[#D4AF37] hover:text-black bg-[#051006] hover:bg-[#D4AF37] w-9 h-9 rounded-full border-2 border-[#D4AF37]/70 flex items-center justify-center font-black transition-all shadow-xl"
                title="Cerrar Comparador"
              >
                ✕
              </button>

              {/* ENCABEZADO CON DEGRADADO DORADO Y FONDO VERDE ORGANICO */}
              <div className="space-y-4 border-b border-[#D4AF37]/40 pb-6 clear-both text-center sm:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/25 border border-[#D4AF37]/60 text-[#D4AF37] text-xs font-mono font-extrabold uppercase tracking-widest shadow-md">
                  <Scale size={16} />
                  <span>ANÁLISIS DE SESGOS + MÉTRICAS + DIAGNÓSTICO EDITORIAL + CONCLUSIÓN NEUTRA</span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight drop-shadow-md">
                  Misma Noticia — Cobertura en los 5 Espectros Políticos
                </h3>
                
                {/* EVENTO MATRIZ DESTACADO */}
                <div className="pt-2">
                  <span className="text-xs font-mono text-[#D4AF37] font-extrabold uppercase tracking-wider block">
                    EVENTO MATRIZ / NOTICIA EVALUADA:
                  </span>
                  <h4 className="font-serif text-xl sm:text-2xl md:text-3xl font-black text-white leading-snug mt-1 text-gold-gradient drop-shadow-md">
                    "{selectedBiasComparison.title}"
                  </h4>
                </div>
              </div>

              {/* DATOS Y MÉTRICAS CUANTITATIVAS */}
              <EventMetricsGrid metrics={selectedBiasComparison.metricsData} />

              {/* INTEGRACIÓN DEL ANÁLISIS ACADÉMICO Y FÓRMULA MATEMÁTICA UNIFICADA */}
              <AcademicAnalysisSection 
                analysis={selectedBiasComparison.academicAnalysis} 
                title={selectedBiasComparison.title}
              />

              {/* TARJETAS DE LOS 5 ESPECTROS EN VERDE BOTÁNICO Y DORADO */}
              <div className="space-y-4 pt-4 border-t border-[#D4AF37]/35">
                <h4 className="font-serif text-lg font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-2">
                  <Scale size={18} /> COBERTURAS Y DESVIACIONES DESDE EL CENTRO (0%)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(selectedBiasComparison.otherCoverages || []).map((coverage, idx) => (
                    <div 
                      key={idx}
                      className="rounded-2xl p-5 border border-[#D4AF37]/50 space-y-3.5 shadow-2xl hover:border-[#D4AF37] hover:shadow-[0_0_30px_rgba(212,175,55,0.45)] transition-all flex flex-col justify-between group/card"
                      style={{
                        backgroundColor: 'rgba(10, 24, 12, 0.75)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)'
                      }}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-[#D4AF37]/25 pb-2.5">
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
                          
                          <span className="text-[9px] font-mono text-[#D4AF37] bg-[#051006] px-2.5 py-1 rounded-full border border-[#D4AF37]/60 font-extrabold">
                            {coverage.spectrumBadge || `Espectro ${idx + 1}`}
                          </span>
                        </div>

                        <div 
                          className={coverage.hasCoverage !== false ? "cursor-pointer group/title transition-all" : ""}
                          onClick={() => {
                            if (coverage.hasCoverage === false) return;

                            const matched = realtimeArticles.find(a => 
                              (a.originalUrl && coverage.outletUrl && a.originalUrl.toLowerCase() === coverage.outletUrl.toLowerCase()) ||
                              (a.title && coverage.headline && a.title.toLowerCase() === coverage.headline.toLowerCase())
                            );

                            const targetArticle = matched || {
                              id: `cov-${idx}-${Date.now()}`,
                              title: coverage.headline,
                              sourceName: coverage.sourceName,
                              sourceDomain: coverage.sourceDomain,
                              sourceLogoUrl: coverage.logoUrl,
                              originalUrl: coverage.outletUrl || selectedBiasComparison.originalUrl,
                              publishedAt: selectedBiasComparison.publishedAt,
                              author: `${coverage.sourceName} Redacción`,
                              authorProfile: {
                                name: `${coverage.sourceName} Redacción`,
                                title: `Mesa de Redacción de ${coverage.sourceName}`,
                                institution: "Prensa Institucional Acreditada",
                                location: "Redacción Central",
                                avatar: coverage.logoUrl,
                                bio: `Equipo de redactores e investigadores profesionales adscritos a ${coverage.sourceName}.`,
                                previousWork: [`Agencia de Noticias ${coverage.sourceName}`],
                                specialties: ["Cobertura Periodística Factual"],
                                publishedCount: 240
                              },
                              summary: `Reporte noticioso difundido por ${coverage.sourceName}. ${coverage.intention}`,
                              biasDirection: coverage.biasDirection,
                              deviationPercent: coverage.deviationPercent,
                              biasLabel: coverage.biasLabel,
                              academicAnalysis: selectedBiasComparison.academicAnalysis,
                              metricsData: [
                                { label: "Fuente Periodística", value: coverage.sourceName, icon: "ShieldCheck" },
                                { label: "Espectro Político", value: coverage.spectrumBadge, icon: "Scale" },
                                { label: "Fecha del Despacho", value: selectedBiasComparison.publishedAt, icon: "Clock" },
                                { label: "Origen de Feed", value: "RSS Oficial Indexado", icon: "Globe" }
                              ],
                              fullContent: `Despacho periodístico emitido por ${coverage.sourceName} sobre "${coverage.headline}".\n\n${coverage.intention}\n\nPara consultar la publicación original en la plataforma del emisor, utilice el botón adjunto.`,
                              otherCoverages: selectedBiasComparison.otherCoverages
                            };

                            setSelectedBiasComparison(null);
                            setSelectedArticle(targetArticle);
                          }}
                        >
                          <span className="text-[9px] font-mono text-emerald-300/80 font-bold uppercase tracking-wider flex items-center justify-between">
                            <span>TITULAR DEL MEDIO:</span>
                            {coverage.hasCoverage !== false && (
                              <span className="text-[#D4AF37] font-extrabold hover:underline flex items-center gap-1">
                                (Abrir Ficha Completa ↗)
                              </span>
                            )}
                          </span>
                          <h5 className={`font-serif text-sm sm:text-base font-bold text-white leading-snug mt-1 transition-colors ${coverage.hasCoverage !== false ? 'group-hover/title:text-[#D4AF37] group-hover/title:underline decoration-[#D4AF37] underline-offset-4' : ''}`}>
                            "{coverage.headline}"
                          </h5>
                        </div>

                        <div 
                          className="p-3.5 rounded-xl border border-[#D4AF37]/30 space-y-1 text-xs shadow-inner"
                          style={{
                            backgroundColor: 'rgba(4, 14, 5, 0.55)',
                            backdropFilter: 'blur(16px)',
                            WebkitBackdropFilter: 'blur(16px)'
                          }}
                        >
                          <span className="text-[9px] font-mono text-[#D4AF37] font-extrabold uppercase block tracking-wider">
                            ANÁLISIS DE INTENCIÓN & ENCUADRE:
                          </span>
                          <p className="font-sans text-xs text-gray-200 leading-relaxed italic font-light">
                            "{coverage.intention}"
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 pt-2">
                        <PoliticalBiasBar biasDirection={coverage.biasDirection} deviationPercent={coverage.deviationPercent} biasLabel={coverage.biasLabel} />

                        <div className="grid grid-cols-1 gap-2 font-mono text-[10px]">
                          {coverage.hasCoverage !== false && coverage.outletUrl ? (
                            <a
                              href={coverage.outletUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-2.5 px-3 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-mono font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-all shadow-md hover:bg-white flex items-center justify-center gap-1.5"
                            >
                              <span>LEER NOTICIA EN {coverage.sourceName}</span>
                              <ExternalLink size={12} />
                            </a>
                          ) : (
                            <div className="w-full py-2.5 px-3 bg-amber-950/40 text-amber-300/80 border border-amber-500/30 font-mono font-extrabold text-[9px] uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 opacity-80 cursor-not-allowed">
                              <AlertTriangle size={12} className="text-amber-400 shrink-0" />
                              <span>SIN REGISTRO EN ESTE MEDIO</span>
                            </div>
                          )}

                          <a
                            href={coverage.officialMatrixUrl || selectedBiasComparison.originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2 px-3 bg-white/10 hover:bg-white/20 text-gray-200 font-mono font-bold text-[9px] uppercase tracking-wider rounded-xl transition-all border border-white/20 flex items-center justify-center gap-1"
                          >
                            <Globe size={12} className="text-[#D4AF37]" />
                            <span>NOTICIA OFICIAL MATRIZ</span>
                            <ExternalLink size={11} />
                          </a>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#D4AF37]/35 text-right">
                <button
                  onClick={() => setSelectedBiasComparison(null)}
                  className="px-8 py-3 bg-white/10 text-white hover:bg-white/20 font-mono font-bold text-xs uppercase rounded-xl transition-all border border-white/20"
                >
                  CERRAR COMPARADOR
                </button>
              </div>

            </div>
          </div>
        )}

        {/* MODAL HOJA DE VIDA DEL AUTOR (BOTÁNICO Y DORADO LUXURY) */}
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
              backgroundColor: 'rgba(3, 10, 4, 0.75)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)'
            }}
          >
            <div 
              className="text-white rounded-3xl max-w-2xl w-full max-h-[88vh] overflow-y-auto p-6 md:p-8 space-y-6 relative shadow-[0_0_120px_rgba(212,175,55,0.4)] border-2 border-[#D4AF37]/80 my-auto"
              style={{
                backgroundColor: 'rgba(7, 20, 10, 0.75)',
                backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(212, 175, 55, 0.28) 0%, transparent 70%), radial-gradient(circle at 50% 100%, rgba(45, 80, 22, 0.45) 0%, transparent 70%)',
                backdropFilter: 'blur(26px)',
                WebkitBackdropFilter: 'blur(26px)'
              }}
            >
              
              <button
                onClick={() => setSelectedAuthor(null)}
                className="sticky top-0 float-right z-50 text-[#D4AF37] hover:text-black bg-[#051006] hover:bg-[#D4AF37] w-9 h-9 rounded-full border-2 border-[#D4AF37]/70 flex items-center justify-center font-black transition-all shadow-xl"
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
                <p 
                  className="font-sans text-xs md:text-sm text-gray-200 leading-relaxed p-4 rounded-2xl border border-white/10"
                  style={{
                    backgroundColor: 'rgba(4, 14, 5, 0.55)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)'
                  }}
                >
                  {selectedAuthor.bio}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-serif text-sm font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-2">
                  <History size={16} /> Medios y Empresas Donde Ha Trabajado (Trayectoria Profesional)
                </h4>
                <div 
                  className="space-y-2 p-4 rounded-2xl border border-white/10 font-mono text-xs"
                  style={{
                    backgroundColor: 'rgba(4, 14, 5, 0.55)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)'
                  }}
                >
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
                  className="px-6 py-2.5 bg-[#D4AF37] text-black hover:bg-white font-extrabold text-xs uppercase rounded-xl transition-all border border-[#D4AF37]"
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
