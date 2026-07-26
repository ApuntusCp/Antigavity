'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Newspaper, ArrowRight, Clock, Globe, Rss, Sparkles, RefreshCw, UserCheck, X, ChevronDown, TrendingUp, BookOpen, ShieldCheck, Award, CheckCircle2, FileText, User, Calendar, MapPin, BarChart3, Scale, Filter, Building2, GraduationCap, Compass, ExternalLink, Info, Sliders, Layers, ChevronRight, Check } from 'lucide-react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { useSearchParams, useRouter } from 'next/navigation';
import PaymentMethodsBadge from '../../components/PaymentMethodsBadge';

// COMPONENTE BARRAS DE SESGO IDEOLÓGICO DISCRETO Y ELEGANTE
function PoliticalBiasBar({ biasScore, biasLabel }) {
  const score = Math.max(5, Math.min(95, biasScore || 50));

  return (
    <div className="w-full space-y-1 mt-3 pt-2.5 border-t border-black/10 group/bias relative font-mono text-[10px]">
      <div className="flex items-center justify-between text-gray-700">
        <span className="flex items-center gap-1 font-semibold text-gray-900 truncate">
          <Scale size={12} className="text-[#D4AF37] shrink-0" />
          <span>Sesgo:</span>
          <strong className="text-gray-900 font-bold truncate">{biasLabel || 'Neutral / Centro'}</strong>
        </span>
        <span className="text-gray-500 font-bold shrink-0">{score}%</span>
      </div>

      <div className="relative w-full h-1.5 rounded-full bg-black/10 overflow-hidden border border-black/10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-slate-400 to-amber-600 opacity-80"></div>
        <div 
          className="absolute top-0 bottom-0 w-2 bg-black rounded-full -translate-x-1/2 transition-all duration-500"
          style={{ left: `${score}%` }}
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
  const [activeUmmaCategory, setActiveUmmaCategory] = useState('co');
  
  // Modales
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [comparisonTopic, setComparisonTopic] = useState(null);
  
  const [realtimeArticles, setRealtimeArticles] = useState([]);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [visibleNewsCount, setVisibleNewsCount] = useState(6);

  // Fecha Actual para Masthead de Periódico Real
  const formattedDate = new Intl.DateTimeFormat('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date());

  const categoryTabs = [
    { id: 'ultimas', name: 'Últimas Noticias' },
    { id: 'co', name: 'Colombia' },
    { id: 'mundo', name: 'Mundo & América' },
    { id: 'economia', name: 'Economía & Negocios' },
    { id: 'cultura', name: 'Cultura & Sociedad' },
    { id: 'salud', name: 'Ciencia, Salud & Botánica' }
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

  // Base Extensa de Noticias Multimedio Panamericanas
  const fallbackGlobalNews = [
    {
      id: 'top-1',
      topicKey: "asociaciones-indigenas-cordoba",
      title: "En Córdoba fortalecen 14 asociaciones indígenas con maquinaria y herramientas agrícolas",
      summary: "La Gobernación de Córdoba entregó motoazadas, guadañadoras y equipos a 14 asociaciones indígenas para impulsar la productividad de 350 familias.",
      fullContent: `La Gobernación de Córdoba entregó motoazadas, guadañadoras y fumigadoras de motor a 14 asociaciones indígenas en el marco del Proyecto de Unidades Productivas Agropecuarias (UPA).\n\nEsta iniciativa beneficia directamente a 350 familias de productores dedicados al cultivo de maíz, yuca y ñame en zonas rurales del departamento.`,
      author: "Lina María Orozco",
      sourceName: "El Heraldo",
      sourceLogo: "El Heraldo",
      originalUrl: "https://www.elheraldo.co/cordoba/en-cordoba-fortalecen-14-asociaciones-indigenas-con-maquinaria-y-herramientas-agricolas-1111666",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80",
      category: "Colombia",
      country: "co",
      publishedAt: "Hace 30 min",
      biasScore: 50,
      biasLabel: "Imparcial",
      views: 34100
    },
    {
      id: 'top-2',
      topicKey: "leila-guerriero-periodismo-ia",
      title: "Leila Guerriero: 'Hay más preocupación con la IA que trabajo para ser mejor que ella'",
      summary: "Reflexión crítica sobre el periodismo narrativo, la investigación en terreno y la ética frente a las tecnologías generativas.",
      fullContent: `En diálogo con La Silla Vacía en el Festival Gabo, la escritora Leila Guerriero aborda el compromiso del periodismo de investigación.`,
      author: "Camilo Sotomayor",
      sourceName: "La Silla Vacía",
      sourceLogo: "La Silla Vacía",
      originalUrl: "https://www.lasillavacia.com/silla-nacional/",
      image: "https://images.unsplash.com/photo-1511497584788-876761c11969?auto=format&fit=crop&w=1000&q=80",
      category: "Cultura",
      country: "co",
      publishedAt: "Hace 1 hora",
      biasScore: 40,
      biasLabel: "Centro-Independiente",
      views: 26800
    },
    {
      id: 'top-3',
      topicKey: "exportaciones-agropecuarias-dane",
      title: "Exportaciones agropecuarias y de alimentos en Colombia crecen según informe del DANE",
      summary: "Las ventas externas del sector agropecuario y de productos botánicos registraron un incremento positivo impulsado por café y flores.",
      fullContent: `Según el último informe del DANE, las exportaciones colombianas agropecuarias y de insumos vegetales continuaron su tendencia al alza.`,
      author: "Juliana Restrepo",
      sourceName: "El Tiempo",
      sourceLogo: "El Tiempo",
      originalUrl: "https://www.eltiempo.com/economia/sectores",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80",
      category: "Economía",
      country: "co",
      publishedAt: "Hace 2 horas",
      biasScore: 65,
      biasLabel: "Centro-Derecha",
      views: 31200
    },
    {
      id: 'top-4',
      topicKey: "revolucion-cultivo-limpio-ny",
      title: "The Global Shift Toward Organic Cultivation and Clean Botanical Standards",
      summary: "An in-depth analysis on how non-synthetic farming techniques and botanical purity certifications are reshaping health markets.",
      fullContent: `International markets report growing demand for fully traceable botanical derivatives certified free of synthetic pesticides.`,
      author: "Sarah Jenkins",
      sourceName: "The New York Times",
      sourceLogo: "NY Times",
      originalUrl: "https://www.nytimes.com/section/well",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80",
      category: "Ciencia y Salud",
      country: "us",
      publishedAt: "Hace 3 horas",
      biasScore: 40,
      biasLabel: "Centro-Izquierda EE.UU.",
      views: 45200
    },
    {
      id: 'top-5',
      topicKey: "bioproductos-amazonicos-globo",
      title: "Brasil avança na exportação sustentável de produtos bioagrícolas e botânicos",
      summary: "Cooperativas agroforestais reportam aumento significativo no envio de insumos orgânicos com certificação ambiental.",
      fullContent: `Reportagem especial sobre o crescimento do setor bioagrícola nas regiões do Sudeste e Norte do Brasil.`,
      author: "Redacción O Globo",
      sourceName: "O Globo",
      sourceLogo: "O Globo",
      originalUrl: "https://g1.globo.com/economia/",
      image: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=1000&q=80",
      category: "Mundo",
      country: "br",
      publishedAt: "Hace 4 horas",
      biasScore: 50,
      biasLabel: "Imparcial Brasil",
      views: 38900
    }
  ];

  // Escuchar Feed de Firestore en Tiempo Real
  useEffect(() => {
    setLoadingFeed(true);
    let unsubscribe = () => {};

    try {
      const q = query(
        collection(db, 'gran_noticias_articles'),
        orderBy('publishedAt', 'desc'),
        limit(50)
      );

      unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const docs = snapshot.docs.map(docSnap => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              topicKey: data.topicKey || 'asociaciones-indigenas-cordoba',
              title: data.title || 'Titular Noticioso',
              summary: data.summary || data.excerpt || 'Resumen noticioso en desarrollo.',
              fullContent: data.fullContent || data.content || data.summary,
              author: data.author || 'Redacción Periodística',
              sourceName: data.sourceName || 'Agencia Periodística',
              sourceLogo: data.sourceLogo || 'Medio Verificado',
              originalUrl: data.originalUrl || 'https://grancolinos.com',
              image: data.image || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80",
              category: data.category || 'Colombia',
              country: (data.country || 'co').toLowerCase(),
              publishedAt: 'Reciente',
              biasScore: data.biasScore || 50,
              biasLabel: data.biasLabel || 'Neutral',
              views: data.views || 15000
            };
          });
          setRealtimeArticles(docs);
        } else {
          setRealtimeArticles(fallbackGlobalNews);
        }
        setLoadingFeed(false);
      }, () => {
        setRealtimeArticles(fallbackGlobalNews);
        setLoadingFeed(false);
      });
    } catch (e) {
      setRealtimeArticles(fallbackGlobalNews);
      setLoadingFeed(false);
    }

    return () => unsubscribe();
  }, []);

  const filteredNews = realtimeArticles.filter(item => {
    if (activeCategoryTab === 'ultimas') return true;
    if (activeCategoryTab === 'co') return item.country === 'co';
    if (activeCategoryTab === 'mundo') return item.country !== 'co';
    if (activeCategoryTab === 'economia') return item.category.toLowerCase().includes('econ');
    if (activeCategoryTab === 'cultura') return item.category.toLowerCase().includes('cult');
    if (activeCategoryTab === 'salud') return item.category.toLowerCase().includes('salud') || item.category.toLowerCase().includes('cien');
    return true;
  });

  const topNewsPrimary = filteredNews[0] || fallbackGlobalNews[0];
  const topNewsSecondary = filteredNews.slice(1, 5);

  const countrySidebarNews = realtimeArticles.filter(item => 
    activeCountry === 'global' ? true : item.country === activeCountry
  );

  return (
    <div className="min-h-screen bg-[#080E14] text-white pt-28 pb-36 px-3 sm:px-6 relative overflow-hidden">
      
      {/* FRAME DEL SITIO — ESTRUCTURA PERIÓDICO REAL CON LIENZO PAPEL CLARO */}
      <div className="max-w-7xl mx-auto space-y-6 relative z-10">

        {/* FASE 0 — MASTHEAD Y NAVEGACIÓN DE CATEGORÍAS */}
        <div className="bg-[#FBF9F5] text-[#111827] rounded-3xl p-6 md:p-8 shadow-2xl border border-[#D4AF37]/40 relative overflow-hidden space-y-6">
          
          {/* Masthead Header Centrado */}
          <div className="text-center space-y-3 border-b-2 border-[#111827]/10 pb-6">
            <div className="flex items-center justify-between text-[11px] font-mono text-gray-600 uppercase tracking-widest px-2">
              <span className="hidden sm:inline">Edición Hemerográfica Panamericana</span>
              <span className="font-bold text-gray-900">{formattedDate}</span>
              <span className="hidden sm:inline">GranColinos Journal</span>
            </div>

            <h1 className="font-serif text-4xl md:text-7xl font-extrabold tracking-tight text-[#111827] drop-shadow-sm uppercase">
              GRAN NOTICIAS
            </h1>
            
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto rounded-full"></div>
            
            <p className="text-xs md:text-sm font-serif italic text-gray-700 max-w-2xl mx-auto font-light">
              "Información factual verídica, análisis multivariable de sesgo editorial y preservación del archivo periodístico de América."
            </p>
          </div>

          {/* Barra de Pestañas de Categoría con Subrayado Dorado */}
          <nav className="flex items-center justify-center gap-2 md:gap-6 overflow-x-auto scrollbar-none font-mono text-xs border-b border-[#111827]/15 pb-2">
            {categoryTabs.map(tab => {
              const isActive = activeCategoryTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategoryTab(tab.id)}
                  className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap font-bold uppercase tracking-wider ${
                    isActive
                      ? 'bg-[#111827] text-white border-b-2 border-[#D4AF37] shadow-md scale-105'
                      : 'text-gray-700 hover:text-black hover:bg-black/5'
                  }`}
                >
                  {tab.name}
                </button>
              );
            })}
          </nav>

          {/* FASE 1 — SECCIÓN "TOP NEWS" (HERO GRID JERÁRQUICO COMPATIBLE CON KYODO NEWS) */}
          <div className="pt-2 space-y-4">
            <div className="flex items-center justify-between border-b border-[#111827]/20 pb-2">
              <h2 className="font-serif text-2xl font-black text-[#111827] uppercase tracking-wider flex items-center gap-2">
                <span className="w-3 h-3 bg-[#D4AF37] rounded-full inline-block"></span> TOP NEWS — NOTICIAS PRINCIPALES
              </h2>
              <span className="text-xs font-mono text-gray-600">Actualización en vivo</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Bloque Grande Destacado (Izquierda - 7 Cols) */}
              <div 
                onClick={() => setSelectedArticle(topNewsPrimary)}
                className="lg:col-span-7 bg-white border border-black/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer space-y-4 p-4"
              >
                <div className="relative h-64 md:h-80 w-full overflow-hidden rounded-xl bg-black/5">
                  <img 
                    src={topNewsPrimary.image} 
                    alt={topNewsPrimary.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-[#D4AF37] text-black font-mono text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-md">
                    {topNewsPrimary.category}
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-mono text-gray-500 uppercase font-semibold">
                    {topNewsPrimary.sourceName} • {topNewsPrimary.publishedAt}
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#111827] leading-snug group-hover:text-[#D4AF37] transition-colors">
                    {topNewsPrimary.title}
                  </h3>
                  <p className="text-gray-700 text-xs md:text-sm font-sans line-clamp-3 leading-relaxed">
                    {topNewsPrimary.summary}
                  </p>

                  <PoliticalBiasBar biasScore={topNewsPrimary.biasScore} biasLabel={topNewsPrimary.biasLabel} />
                </div>
              </div>

              {/* Columna de Noticas Medianas (Derecha - 5 Cols) */}
              <div className="lg:col-span-5 space-y-4">
                {topNewsSecondary.map(secItem => (
                  <div
                    key={secItem.id}
                    onClick={() => setSelectedArticle(secItem)}
                    className="bg-white border border-black/10 rounded-2xl p-3.5 shadow-sm hover:shadow-md transition-all cursor-pointer group flex items-center gap-3"
                  >
                    <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-black/5">
                      <img 
                        src={secItem.image} 
                        alt={secItem.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="space-y-1 flex-1 min-w-0">
                      <span className="text-[9px] font-mono text-[#D4AF37] font-bold uppercase block">
                        {secItem.sourceName}
                      </span>
                      <h4 className="font-serif text-xs md:text-sm font-bold text-[#111827] line-clamp-2 leading-snug group-hover:text-[#D4AF37] transition-colors">
                        {secItem.title}
                      </h4>
                      <span className="text-[9px] font-mono text-gray-500 block">{secItem.publishedAt}</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* FASE 2 — SECCIÓN "SELECCIÓN UMMA" (CURADURÍA ALGORÍTMICA CON TARJETAS CIRCULARES) */}
          <div className="pt-6 border-t-2 border-[#111827]/10 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#111827]/15 pb-3">
              <div>
                <span className="px-3 py-1 bg-[#111827] text-white text-[10px] font-mono font-bold uppercase tracking-widest rounded-full inline-flex items-center gap-1.5">
                  <Sparkles size={12} className="text-[#D4AF37]" /> SELECCIÓN ALGORÍTMICA UMMA
                </span>
                <h3 className="font-serif text-xl font-bold text-[#111827] mt-1">Síntesis Imparcial & Diversidad de Fuentes</h3>
              </div>

              {/* Pestañas de Subcategoría Umma */}
              <div className="flex items-center gap-2 font-mono text-[10px]">
                {countries.slice(0, 4).map(c => (
                  <button
                    key={c.id}
                    onClick={() => setActiveUmmaCategory(c.id)}
                    className={`px-3 py-1 rounded-lg font-bold uppercase ${
                      activeUmmaCategory === c.id ? 'bg-[#D4AF37] text-black' : 'bg-black/5 text-gray-700 hover:bg-black/10'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Fila de Tarjetas Circulares */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {realtimeArticles.slice(0, 3).map(circularItem => (
                <div
                  key={`circular-${circularItem.id}`}
                  onClick={() => setSelectedArticle(circularItem)}
                  className="bg-white border border-black/10 rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all cursor-pointer group flex items-start gap-4"
                >
                  <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-[#D4AF37] shadow-md">
                    <img 
                      src={circularItem.image} 
                      alt={circularItem.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <span className="text-[9px] font-mono text-gray-500 font-bold uppercase block">
                      {circularItem.sourceName} • Umma Verified
                    </span>
                    <h4 className="font-serif text-xs md:text-sm font-bold text-[#111827] line-clamp-2 group-hover:text-[#D4AF37] transition-colors">
                      {circularItem.title}
                    </h4>
                    <p className="text-[11px] font-sans text-gray-600 line-clamp-2 italic bg-black/5 p-2 rounded-lg">
                      "{circularItem.summary}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FASE 3 & 4 — SECCIÓN "ÚLTIMAS NOTICIAS" CON SIDEBAR REGIONAL */}
          <div className="pt-6 border-t-2 border-[#111827]/10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Contenido Principal de Últimas Noticias (8 Cols) */}
            <div className="lg:col-span-8 space-y-6">
              <div className="border-b border-[#111827]/20 pb-2">
                <h3 className="font-serif text-xl font-bold text-[#111827] uppercase tracking-wider">
                  ÚLTIMAS NOTICIAS DEL FEED
                </h3>
              </div>

              {/* Fila 1: 3 Tarjetas de solo Texto con Tarjeta Central Resaltada en Dorado */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredNews.slice(0, 3).map((textCard, idx) => {
                  const isCenterResaltada = idx === 1;
                  return (
                    <div
                      key={`text-card-${textCard.id}`}
                      onClick={() => setSelectedArticle(textCard)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 flex flex-col justify-between ${
                        isCenterResaltada
                          ? 'bg-[#111827] text-white border-[#D4AF37] shadow-xl scale-105'
                          : 'bg-white text-[#111827] border-black/10 shadow-sm hover:shadow-md'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <span className={`text-[9px] font-mono uppercase font-bold ${isCenterResaltada ? 'text-[#D4AF37]' : 'text-gray-500'}`}>
                          {textCard.sourceName} • {textCard.publishedAt}
                        </span>
                        <h4 className="font-serif text-sm font-bold leading-snug line-clamp-2">
                          {textCard.title}
                        </h4>
                        <p className={`text-xs font-sans line-clamp-3 ${isCenterResaltada ? 'text-gray-300' : 'text-gray-600'}`}>
                          {textCard.summary}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Fila 2: Tarjetas con Imagen Grande + Titular */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {filteredNews.slice(3, 3 + visibleNewsCount).map(feedItem => (
                  <div
                    key={`feed-grid-${feedItem.id}`}
                    onClick={() => setSelectedArticle(feedItem)}
                    className="bg-white border border-black/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group space-y-3 p-3.5"
                  >
                    <div className="relative h-44 w-full overflow-hidden rounded-xl bg-black/5">
                      <img 
                        src={feedItem.image} 
                        alt={feedItem.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2 left-2 bg-[#111827] text-white font-mono text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full">
                        {feedItem.sourceName}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="font-serif text-base font-bold text-[#111827] line-clamp-2 group-hover:text-[#D4AF37] transition-colors leading-snug">
                        {feedItem.title}
                      </h4>
                      <p className="text-xs font-sans text-gray-600 line-clamp-2">
                        {feedItem.summary}
                      </p>
                      <PoliticalBiasBar biasScore={feedItem.biasScore} biasLabel={feedItem.biasLabel} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Botón Ver Más Noticias */}
              <div className="text-center pt-4">
                <button
                  onClick={() => setVisibleNewsCount(prev => prev + 6)}
                  className="px-8 py-3 bg-[#111827] text-white hover:bg-[#D4AF37] hover:text-black font-mono font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md"
                >
                  Ver Más Noticias
                </button>
              </div>
            </div>

            {/* FASE 4 — SIDEBAR DE PAÍS / REGIÓN (4 Cols) */}
            <div className="lg:col-span-4 bg-white border border-black/10 rounded-2xl p-5 shadow-md space-y-4">
              <div className="space-y-1 border-b border-black/10 pb-3">
                <span className="text-[10px] font-mono text-[#D4AF37] font-bold uppercase tracking-wider block">
                  FILTRO PAÍS SELECCIONADO
                </span>
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl font-bold text-[#111827] uppercase">
                    NOTICIAS DE {countries.find(c => c.id === activeCountry)?.name || 'COLOMBIA'}
                  </h3>
                  
                  {/* Selector de País */}
                  <select
                    value={activeCountry}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="bg-black/5 text-[#111827] text-xs font-mono font-bold py-1 px-2 rounded-lg border border-black/15 focus:outline-none"
                  >
                    {countries.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <p className="text-[11px] font-sans text-gray-500 italic">
                  Todo lo que pasa en {countries.find(c => c.id === activeCountry)?.name || 'Colombia'}, minuto a minuto.
                </p>
              </div>

              {/* Lista Numerada por Hora */}
              <div className="space-y-3 font-mono text-xs">
                {countrySidebarNews.slice(0, 7).map((sideItem, idx) => (
                  <div
                    key={`sidebar-${sideItem.id}`}
                    onClick={() => setSelectedArticle(sideItem)}
                    className="p-2.5 hover:bg-black/5 rounded-xl transition-colors cursor-pointer border-b border-black/5 space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px] text-gray-500">
                      <span className="font-bold text-[#D4AF37]">#{idx + 1} • {sideItem.sourceName}</span>
                      <span>{sideItem.publishedAt}</span>
                    </div>
                    <p className="font-serif font-bold text-[#111827] leading-snug line-clamp-2 hover:text-[#D4AF37]">
                      {sideItem.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* FASE 5 — SECCIONES TEMÁTICAS AL PIE (Cultura, Ciencia & Salud, Economía) */}
          <div className="pt-8 border-t-2 border-[#111827]/10 space-y-6">
            <div className="border-b border-[#111827]/20 pb-2">
              <h3 className="font-serif text-xl font-bold text-[#111827] uppercase tracking-wider">
                SECCIONES TEMÁTICAS ESPECIALIZADAS
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Bloque 1: Cultura & Sociedad */}
              <div className="bg-white border border-black/10 rounded-2xl p-4 shadow-sm space-y-3">
                <h4 className="font-serif text-base font-bold text-[#111827] border-b border-[#D4AF37] pb-1">
                  Cultura & Sociedad
                </h4>
                {realtimeArticles.slice(0, 3).map(item => (
                  <div key={`cultura-${item.id}`} onClick={() => setSelectedArticle(item)} className="cursor-pointer space-y-1 border-b border-black/5 pb-2">
                    <span className="text-[9px] font-mono text-gray-500">{item.sourceName}</span>
                    <p className="font-serif text-xs font-bold text-[#111827] line-clamp-2 hover:text-[#D4AF37]">{item.title}</p>
                  </div>
                ))}
              </div>

              {/* Bloque 2: Ciencia & Salud */}
              <div className="bg-white border border-black/10 rounded-2xl p-4 shadow-sm space-y-3">
                <h4 className="font-serif text-base font-bold text-[#111827] border-b border-[#D4AF37] pb-1">
                  Ciencia, Botánica & Salud
                </h4>
                {realtimeArticles.slice(2, 5).map(item => (
                  <div key={`salud-${item.id}`} onClick={() => setSelectedArticle(item)} className="cursor-pointer space-y-1 border-b border-black/5 pb-2">
                    <span className="text-[9px] font-mono text-gray-500">{item.sourceName}</span>
                    <p className="font-serif text-xs font-bold text-[#111827] line-clamp-2 hover:text-[#D4AF37]">{item.title}</p>
                  </div>
                ))}
              </div>

              {/* Bloque 3: Economía & Negocios */}
              <div className="bg-white border border-black/10 rounded-2xl p-4 shadow-sm space-y-3">
                <h4 className="font-serif text-base font-bold text-[#111827] border-b border-[#D4AF37] pb-1">
                  Economía & Negocios
                </h4>
                {realtimeArticles.slice(1, 4).map(item => (
                  <div key={`econ-${item.id}`} onClick={() => setSelectedArticle(item)} className="cursor-pointer space-y-1 border-b border-black/5 pb-2">
                    <span className="text-[9px] font-mono text-gray-500">{item.sourceName}</span>
                    <p className="font-serif text-xs font-bold text-[#111827] line-clamp-2 hover:text-[#D4AF37]">{item.title}</p>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>

        {/* MODAL LECTURA COMPLETA DE NOTICIA */}
        {selectedArticle && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
            <div className="bg-[#FBF9F5] text-[#111827] border border-[#D4AF37] rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 relative shadow-2xl">
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 text-gray-700 hover:text-black w-8 h-8 rounded-full bg-black/5 flex items-center justify-center font-bold"
              >
                ✕
              </button>

              <div className="space-y-2 border-b border-black/10 pb-4">
                <div className="flex items-center gap-2 font-mono text-xs text-[#D4AF37] font-bold uppercase">
                  <span>{selectedArticle.sourceName}</span>
                  <span>•</span>
                  <span>{selectedArticle.category}</span>
                </div>
                <h2 className="font-serif text-2xl md:text-3xl font-extrabold text-[#111827] leading-snug">
                  {selectedArticle.title}
                </h2>
                <div className="flex items-center justify-between text-xs font-mono text-gray-600">
                  <span>Autor: {selectedArticle.author}</span>
                  <span>{selectedArticle.publishedAt}</span>
                </div>
              </div>

              <div className="relative h-64 w-full rounded-2xl overflow-hidden bg-black/5">
                <img src={selectedArticle.image} alt={selectedArticle.title} className="w-full h-full object-cover" />
              </div>

              <div className="space-y-4 font-sans text-sm text-gray-800 leading-relaxed">
                <p className="font-semibold text-base italic bg-black/5 p-4 rounded-2xl border-l-4 border-[#D4AF37]">
                  "{selectedArticle.summary}"
                </p>
                <p className="whitespace-pre-line">{selectedArticle.fullContent}</p>
              </div>

              <div className="pt-4 border-t border-black/10 flex items-center justify-between">
                <a
                  href={selectedArticle.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 bg-[#111827] text-white font-mono font-bold text-xs uppercase rounded-xl hover:bg-[#D4AF37] hover:text-black transition-all flex items-center gap-2"
                >
                  <span>Ver en Fuente Oficial ({selectedArticle.sourceName})</span>
                  <ExternalLink size={14} />
                </a>

                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-4 py-2 bg-black/10 text-gray-800 font-mono font-bold text-xs uppercase rounded-xl"
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

export default function NoticiasPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#080E14] flex items-center justify-center text-white font-mono text-xs">
        <RefreshCw className="animate-spin text-[#D4AF37] mb-2" size={32} />
      </div>
    }>
      <NoticiasContent />
    </Suspense>
  );
}
