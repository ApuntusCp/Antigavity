'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { Newspaper, ArrowRight, Clock, Globe, Rss, ExternalLink, Sparkles, RefreshCw, UserCheck } from 'lucide-react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import PaymentMethodsBadge from '../../components/PaymentMethodsBadge';
import { useSearchParams, useRouter } from 'next/navigation';

function NoticiasContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialCountry = searchParams.get('pais') || 'global';
  const [activeCountry, setActiveCountry] = useState(initialCountry);
  const [realtimeArticles, setRealtimeArticles] = useState([]);
  const [loadingFeed, setLoadingFeed] = useState(true);

  // Sync state with URL parameter for shareable filters
  const handleCountryChange = (countryId) => {
    setActiveCountry(countryId);
    if (countryId === 'global') {
      router.push('/noticias', { scroll: false });
    } else {
      router.push(`/noticias?pais=${countryId}`, { scroll: false });
    }
  };

  // OPCIÓN B: Franja Fija Editorial de Marca GranColinos
  const brandFeaturedArticles = [
    {
      id: "brand-1",
      title: "Avances de la Reglamentación del CBD en Colombia 2026",
      summary: "Análisis detallado sobre los nuevos decretos del INVIMA y el Ministerio de Salud para extractos botánicos de alta pureza.",
      author: "Dra. Camila Torres",
      date: "26 Julio, 2026",
      category: "Regulación & Salud",
      readTime: "4 min de lectura",
      image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80",
      sourceLogo: "🇨🇴 GranColinos Editorial"
    },
    {
      id: "brand-2",
      title: "La Ciencia detrás de la Apitoxina en la Recuperación Muscular",
      summary: "Estudios clínicos recientes respaldan las propiedades antiinflamatorias de la apitoxina en atletas y personas de alto rendimiento.",
      author: "Dr. Roberto Aponte",
      date: "24 Julio, 2026",
      category: "Investigación",
      readTime: "6 min de lectura",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80",
      sourceLogo: "🐝 Laboratorio GranColinos"
    },
    {
      id: "brand-3",
      title: "Impacto del Cultivo Orgánico en la Cordillera Central",
      summary: "Cómo los estándares de cultivo limpio están transformando el paisaje agrícola colombiano hacia el bienestar sostenible.",
      author: "Ing. Mateo Bermúdez",
      date: "20 Julio, 2026",
      category: "Comunidad & Origen",
      readTime: "5 min de lectura",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80",
      sourceLogo: "🌱 Red Agrícola GC"
    }
  ];

  // Country & Region Filter List
  const countryFilters = [
    { id: 'global', label: '🌎 Global', code: 'ALL' },
    { id: 'co', label: '🇨🇴 Colombia', code: 'CO' },
    { id: 'mx', label: '🇲🇽 México', code: 'MX' },
    { id: 'ar', label: '🇦🇷 Argentina', code: 'AR' },
    { id: 'es', label: '🇪🇸 España', code: 'ES' },
    { id: 'us', label: '🇺🇸 Internacional', code: 'US' },
    { id: 'salud', label: '🔬 Ciencia & Botánica', code: 'HEALTH' },
  ];

  // Fallback Realtime Dataset from Gran Noticias Network (con Imágenes, Autores y Logos de Medios)
  const fallbackGlobalNews = [
    {
      id: 'news-1',
      title: "Científicos descubren nuevas propiedades terapéuticas en péptidos apícolas",
      summary: "Investigaciones en laboratorios europeos confirman la alta eficacia de la apitoxina natural en procesos de inflamación articular y muscular.",
      author: "Dr. Michael Harrison",
      sourceName: "ScienceDaily",
      sourceLogo: "🔬 ScienceDaily",
      image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=600&q=80",
      country: "us",
      publishedAt: "Hace 10 min",
      url: "https://news.google.com"
    },
    {
      id: 'news-2',
      title: "Colombia reglamenta la exportación de extractos botánicos de alta pureza",
      summary: "El gobierno colombiano expide decreto que facilita el despacho internacional de productos medicinales certificados por INVIMA.",
      author: "Juliana Restrepo",
      sourceName: "El Tiempo",
      sourceLogo: "📰 El Tiempo",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
      country: "co",
      publishedAt: "Hace 25 min",
      url: "https://eltiempo.com"
    },
    {
      id: 'news-3',
      title: "Avances en la regulación de la medicina vegetal en América Latina",
      summary: "Foro regional en México establece guías de trazabilidad de origen para plantas medicinales y suplementos orgánicos.",
      author: "Carlos Mendoza",
      sourceName: "Agencia EFE",
      sourceLogo: "🌐 Agencia EFE",
      image: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=600&q=80",
      country: "mx",
      publishedAt: "Hace 45 min",
      url: "https://efe.com"
    },
    {
      id: 'news-4',
      title: "Cumbre de Sostenibilidad Agrícola 2026: La transición ecológica global",
      summary: "Expertos internacionales debaten el uso de microbiomas de suelo y biopesticidas orgánicos para reemplazar agroquímicos.",
      author: "Sarah Jenkins",
      sourceName: "Reuters World",
      sourceLogo: "📡 Reuters",
      image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=600&q=80",
      country: "global",
      publishedAt: "Hace 1 hora",
      url: "https://reuters.com"
    },
    {
      id: 'news-5',
      title: "El impacto del bienestar holístico en la productividad laboral urbana",
      summary: "Nuevos datos demuestran que el consumo de adaptógenos naturales y nutrición vegetal optimiza el desempeño en entornos exigentes.",
      author: "David Vance",
      sourceName: "Financial Times",
      sourceLogo: "📈 Financial Times",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
      country: "us",
      publishedAt: "Hace 2 horas",
      url: "https://ft.com"
    },
    {
      id: 'news-6',
      title: "Argentina impulsa la investigación en productos derivados de apiterapia",
      summary: "Universidades de Buenos Aires abren laboratorio especializado en caracterización de venenos de abejas y propóleos.",
      author: "Gonzalo Peralta",
      sourceName: "La Nación",
      sourceLogo: "🇦🇷 La Nación",
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80",
      country: "ar",
      publishedAt: "Hace 3 horas",
      url: "https://lanacion.com.ar"
    }
  ];

  // Realtime Firestore Listener to Gran Noticias Feed
  useEffect(() => {
    setLoadingFeed(true);
    let unsubscribe = () => {};

    try {
      const q = query(
        collection(db, 'gran_noticias_articles'),
        orderBy('publishedAt', 'desc'),
        limit(40)
      );

      unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const docs = snapshot.docs.map(docSnap => {
            const data = docSnap.data();
            let pubTime = "Reciente";
            if (data.publishedAt?.toDate) {
              const diffMs = Date.now() - data.publishedAt.toDate().getTime();
              const diffMins = Math.floor(diffMs / (1000 * 60));
              if (diffMins < 60) pubTime = `Hace ${diffMins} min`;
              else pubTime = `Hace ${Math.floor(diffMins / 60)}h`;
            }

            return {
              id: docSnap.id,
              title: data.title || 'Titular de Noticia',
              summary: data.summary || data.excerpt || 'Resumen de noticia verificado.',
              author: data.author || data.byline || 'Redacción Gran Noticias',
              sourceName: data.sourceName || 'Agencia Periodística',
              sourceLogo: data.sourceLogo || `📰 ${data.sourceName || 'Medio Verificado'}`,
              image: data.image || data.thumbnail || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80",
              country: (data.country || 'global').toLowerCase(),
              publishedAt: pubTime,
              url: data.link || data.url || '#'
            };
          });

          setRealtimeArticles(docs);
        } else {
          setRealtimeArticles(fallbackGlobalNews);
        }
        setLoadingFeed(false);
      }, (err) => {
        console.warn("Firestore Gran Noticias fallback active:", err);
        setRealtimeArticles(fallbackGlobalNews);
        setLoadingFeed(false);
      });
    } catch (e) {
      console.warn("Error initializing Gran Noticias feed:", e);
      setRealtimeArticles(fallbackGlobalNews);
      setLoadingFeed(false);
    }

    return () => unsubscribe();
  }, []);

  // Filtered News Items based on Selected Country/Region Filter
  const filteredNews = realtimeArticles.filter(item => {
    if (activeCountry === 'global') return true;
    if (activeCountry === 'salud') return item.summary.toLowerCase().includes('apitoxina') || item.summary.toLowerCase().includes('botánic') || item.summary.toLowerCase().includes('salud');
    return item.country === activeCountry || item.country === 'global';
  });

  return (
    <div className="min-h-screen theme-noticias text-white pt-32 pb-24 px-4 sm:px-6 relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Main Header */}
        <div className="text-center mb-12 fade-in">
          <span className="text-[#E2E8F0] text-xs font-bold tracking-[0.3em] uppercase mb-3 block flex items-center justify-center gap-2">
            <Newspaper size={16} className="text-[#E2E8F0]" /> PORTAL DE NOTICIAS GLOBALES EN TIEMPO REAL
          </span>
          <h1 className="font-serif text-4xl md:text-6xl text-[#E2E8F0] mb-6 drop-shadow-md">
            Gran Noticias Global
          </h1>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#E2E8F0] to-transparent mx-auto mb-6"></div>
          <p className="text-gray-300 max-w-2xl mx-auto font-light leading-relaxed text-sm md:text-base">
            Monitoreo en tiempo real de noticias internacionales, investigación botánica y economía del bienestar impulsado por la red Gran Noticias.
          </p>
        </div>

        {/* OPCIÓN B: FRANJA FIJA EDITORIAL DESTACADA GRANCOLINOS */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-3">
            <h2 className="text-xs font-bold text-[#E2E8F0] uppercase tracking-[0.25em] flex items-center gap-2">
              <Sparkles size={16} /> DESTACADOS Y REGULACIÓN GRANCOLINOS
            </h2>
            <span className="text-[10px] text-gray-400 font-mono">EDICIÓN INSTITUCIONAL</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {brandFeaturedArticles.map((article) => (
              <div key={article.id} className="bg-black/40 border border-[#E2E8F0]/30 hover:border-[#E2E8F0]/70 rounded-2xl overflow-hidden backdrop-blur-xl shadow-xl transition-all duration-300 flex flex-col justify-between group">
                <div>
                  {/* Original Image */}
                  <div className="relative h-44 w-full overflow-hidden">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/80 backdrop-blur-md text-[#E2E8F0] text-[9px] font-bold tracking-widest uppercase rounded border border-[#E2E8F0]/40">
                      {article.category}
                    </span>
                  </div>

                  <div className="p-6">
                    {/* Media Badge & Author */}
                    <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 mb-2">
                      <span className="text-[#E2E8F0] font-bold">{article.sourceLogo}</span>
                      <span className="flex items-center gap-1 text-gray-300"><UserCheck size={12} /> {article.author}</span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-white mb-3 group-hover:text-[#E2E8F0] transition-colors leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-gray-300 text-xs leading-relaxed mb-4 font-light">
                      {article.summary}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0 flex items-center justify-between text-xs text-gray-400 font-mono">
                  <span>{article.date}</span>
                  <span className="text-[#E2E8F0] flex items-center gap-1 cursor-pointer hover:underline font-bold">
                    Ver Reporte <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FEED GLOBAL EN TIEMPO REAL CON FILTRO POR PAÍS/REGIÓN */}
        <div className="bg-black/50 border border-[#E2E8F0]/30 rounded-3xl p-6 md:p-10 backdrop-blur-xl shadow-2xl mb-16 glow-noticias">
          
          {/* Header del Feed & Filtros sin Scrollbars */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-[#E2E8F0]/20 pb-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E2E8F0]/15 border border-[#E2E8F0]/30 flex items-center justify-center text-[#E2E8F0] shrink-0">
                <Rss size={20} className="animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  FEED EN VIVO DE GRAN NOTICIAS <span className="px-2.5 py-0.5 bg-[#E2E8F0]/20 text-[#E2E8F0] text-[9px] font-mono rounded border border-[#E2E8F0]/30">EN TIEMPO REAL</span>
                </h3>
                <p className="text-xs text-gray-300">Fuentes periodísticas e internacionales verificadas en directo</p>
              </div>
            </div>

            {/* Country Selector Chips Bar (SIN BARRAS DE SCROLL NATIVAS) */}
            <div className="flex flex-wrap items-center gap-2 max-w-full overflow-hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {countryFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => handleCountryChange(filter.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border shrink-0 ${
                    activeCountry === filter.id
                      ? 'bg-[#E2E8F0] text-black border-[#E2E8F0] shadow-[0_0_15px_rgba(226,232,240,0.4)]'
                      : 'bg-white/5 text-gray-300 border-white/10 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Feed Content Grid */}
          {loadingFeed ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <RefreshCw className="animate-spin text-[#E2E8F0] mb-4" size={32} />
              <p className="text-xs font-mono uppercase tracking-widest">Sincronizando satélites de información...</p>
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/5">
              <Globe className="text-gray-500 mx-auto mb-3" size={36} />
              <h4 className="text-sm font-bold text-white mb-1">Sin noticias recientes para esta región</h4>
              <p className="text-xs text-gray-400">Selecciona "Global" para visualizar la cobertura completa en tiempo real.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-black/40 border border-[#E2E8F0]/20 hover:border-[#E2E8F0]/60 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between hover:scale-[1.02] shadow-lg"
                >
                  <div>
                    {/* Article Original Image */}
                    <div className="relative h-44 w-full overflow-hidden bg-black/60">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                      
                      {/* Media Badge Overlay */}
                      <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/80 backdrop-blur-md text-[#E2E8F0] text-[10px] font-bold tracking-wider uppercase rounded border border-[#E2E8F0]/30 shadow-md">
                        {item.sourceLogo || item.sourceName}
                      </span>
                    </div>

                    <div className="p-6">
                      {/* Author & Time Info */}
                      <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 mb-3">
                        <span className="flex items-center gap-1 text-[#E2E8F0] font-semibold">
                          <UserCheck size={12} /> {item.author || 'Redacción'}
                        </span>
                        <span className="flex items-center gap-1 text-gray-400">
                          <Clock size={12} /> {item.publishedAt}
                        </span>
                      </div>

                      <h4 className="font-serif text-lg font-bold text-white mb-3 group-hover:text-[#E2E8F0] transition-colors leading-snug">
                        {item.title}
                      </h4>

                      <p className="text-gray-300 text-xs font-light leading-relaxed mb-4 line-clamp-3">
                        {item.summary}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-0 flex items-center justify-between text-xs font-bold text-[#E2E8F0] group-hover:underline">
                    <span>Leer Artículo Completo</span>
                    <ExternalLink size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

        <PaymentMethodsBadge />
      </div>
    </div>
  );
}

export default function NoticiasPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen theme-noticias flex items-center justify-center text-white">
        <RefreshCw className="animate-spin text-[#E2E8F0]" size={32} />
      </div>
    }>
      <NoticiasContent />
    </Suspense>
  );
}
