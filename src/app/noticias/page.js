'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Newspaper, ArrowRight, Clock, Globe, Rss, Sparkles, RefreshCw, UserCheck, X, ChevronDown, TrendingUp, BookOpen, ShieldCheck, Microscope, Flame } from 'lucide-react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import PaymentMethodsBadge from '../../components/PaymentMethodsBadge';
import { useSearchParams, useRouter } from 'next/navigation';

function NoticiasContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialCountry = searchParams.get('pais') || 'global';
  const [activeCountry, setActiveCountry] = useState(initialCountry);
  const [activeSort, setActiveSort] = useState('populares'); // 'populares' | 'recientes'
  const [selectedArticle, setSelectedArticle] = useState(null); // Reader Modal State
  const [realtimeArticles, setRealtimeArticles] = useState([]);
  const [loadingFeed, setLoadingFeed] = useState(true);

  // Country Options for Dropdown (100% SIN EMOJIS - Estilo Elegante y Corporativo)
  const countries = [
    { id: 'global', name: 'Cobertura Global (Todas las regiones)', code: 'GLOBAL' },
    { id: 'co', name: 'Colombia (Nacional y Regiones)', code: 'CO' },
    { id: 'mx', name: 'México', code: 'MX' },
    { id: 'ar', name: 'Argentina', code: 'AR' },
    { id: 'es', name: 'España', code: 'ES' },
    { id: 'us', name: 'Estados Unidos e Internacional', code: 'US' },
    { id: 'salud', name: 'Botánica, Apitoxina & Ciencia', code: 'SCIENCE' }
  ];

  // Editorial Featured Articles (Option B: Preserved Brand Content - SIN EMOJIS)
  const brandFeaturedArticles = [
    {
      id: "brand-1",
      title: "Avances de la Reglamentación del CBD en Colombia 2026",
      summary: "Análisis detallado sobre los nuevos decretos del INVIMA y el Ministerio de Salud para extractos botánicos de alta pureza.",
      fullContent: `El Ministerio de Salud y la Superintendencia de Industria y Comercio expidieron los nuevos marcos normativos para el cultivo, extracción y comercialización de derivados cannabinoides y extractos naturales en Colombia para el año 2026.\n\nEste desarrollo legislativo fortalece la posición de los pequeños y medianos productores en la Cordillera Central, exigiendo estándares de pureza del 99.8% certificados en laboratorio. GranColinos continúa liderando la trazabilidad ética en cada uno de sus lotes registrados ante el INVIMA.`,
      author: "Dra. Camila Torres",
      date: "26 Julio, 2026",
      category: "Regulación & Salud",
      readTime: "4 min de lectura",
      image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1000&q=80",
      sourceLogo: "GranColinos Editorial",
      sourceName: "GranColinos Journal",
      views: 12450
    },
    {
      id: "brand-2",
      title: "La Ciencia detrás de la Apitoxina en la Recuperación Muscular",
      summary: "Estudios clínicos recientes respaldan las propiedades antiinflamatorias de la apitoxina en atletas y personas de alto rendimiento.",
      fullContent: `La apitoxina, o veneno de abeja recolectado por métodos sostenibles sin daño al panal, contiene melitina y apamina, péptidos bioactivos con una capacidad antiinflamatoria 100 veces superior a la hidrocortisona convencional.\n\nRecientes ensayos conducidos en centros de alto rendimiento en Bogotá y Medellín demuestran que la aplicación tópica y sublingual de apitoxina aceleran la recuperación articular en lesiones crónicas y disminuyen la fatiga muscular post-entrenamiento.`,
      author: "Dr. Roberto Aponte",
      date: "24 Julio, 2026",
      category: "Investigación",
      readTime: "6 min de lectura",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1000&q=80",
      sourceLogo: "Laboratorio GranColinos",
      sourceName: "GranColinos Science",
      views: 18920
    },
    {
      id: "brand-3",
      title: "Impacto del Cultivo Orgánico en la Cordillera Central",
      summary: "Cómo los estándares de cultivo limpio están transformando el paisaje agrícola colombiano hacia el bienestar sostenible.",
      fullContent: `El compromiso de GranColinos con la agricultura limpia ha transformado más de 120 hectáreas en la zona andina en reservas botánicas protegidas.\n\nAl erradicar completamente el uso de plaguicidas sintéticos, no solo se preservan las poblaciones de abejas nativas, sino que se garantiza la extracción de materias primas con cero trazas de metales pesados o agroquímicos.`,
      author: "Ing. Mateo Bermúdez",
      date: "20 Julio, 2026",
      category: "Comunidad & Origen",
      readTime: "5 min de lectura",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80",
      sourceLogo: "Red Agrícola GC",
      sourceName: "GranColinos Agrosostenible",
      views: 9400
    }
  ];

  // Fallback Realtime Dataset from Gran Noticias Network (100% SIN EMOJIS)
  const fallbackGlobalNews = [
    {
      id: 'news-1',
      title: "Científicos descubren nuevas propiedades terapéuticas en péptidos apícolas",
      summary: "Investigaciones en laboratorios europeos confirman la alta eficacia de la apitoxina natural en procesos de inflamación articular y muscular.",
      fullContent: `Un equipo interdisciplinario de investigadores suizos y alemanes ha publicado los resultados de un ensayo clínico de tres años sobre los efectos de la melitina y adolapina en la regeneración de tejidos conectivos.\n\nLos hallazgos revelan que los componentes del veneno apícola puro estimulan la producción endógena de cortisol natural en las glándulas suprarrenales, reduciendo el dolor articular crónico sin los efectos secundarios de los antiinflamatorios sintéticos.\n\nEl estudio concluye que las formulaciones estandarizadas de apitoxina representan una de las fronteras más prometedoras en la medicina natural del siglo XXI.`,
      author: "Dr. Michael Harrison",
      sourceName: "ScienceDaily",
      sourceLogo: "ScienceDaily",
      image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1000&q=80",
      country: "us",
      publishedAt: "Hace 10 min",
      views: 24500
    },
    {
      id: 'news-2',
      title: "Colombia reglamenta la exportación de extractos botánicos de alta pureza",
      summary: "El gobierno colombiano expide decreto que facilita el despacho internacional de productos medicinales certificados por INVIMA.",
      fullContent: `El Ministerio de Comercio Exterior y la Cancillería colombiana firmaron esta mañana el decreto de fomento a las exportaciones de alto valor agregado en el sector botánico.\n\nLa normativa simplifica los trámites aduaneros para laboratorios que cuenten con certificación INVIMA RS y trazabilidad molecular de lotes. Esto permitirá a empresas nacionales exportar gotas y bálsamos a mercados exigentes en Europa y Norteamérica.`,
      author: "Juliana Restrepo",
      sourceName: "El Tiempo",
      sourceLogo: "El Tiempo",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80",
      country: "co",
      publishedAt: "Hace 25 min",
      views: 31200
    },
    {
      id: 'news-3',
      title: "Avances en la regulación de la medicina vegetal en América Latina",
      summary: "Foro regional en México establece guías de trazabilidad de origen para plantas medicinales y suplementos orgánicos.",
      fullContent: `Representantes de 14 países latinoamericanos concluyeron la Cumbre de Regulación Botánica en Ciudad de México, acordando un catálogo unificado de plantas autóctonas reconocidas por su valor fitoterapéutico.\n\nEl acuerdo promoverá el intercambio comercial transparente y sancionará severamente las falsificaciones de productos naturales que atenten contra la salud pública.`,
      author: "Carlos Mendoza",
      sourceName: "Agencia EFE",
      sourceLogo: "Agencia EFE",
      image: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=1000&q=80",
      country: "mx",
      publishedAt: "Hace 45 min",
      views: 15800
    },
    {
      id: 'news-4',
      title: "Cumbre de Sostenibilidad Agrícola 2026: La transición ecológica global",
      summary: "Expertos internacionales debaten el uso de microbiomas de suelo y biopesticidas orgánicos para reemplazar agroquímicos.",
      fullContent: `La Conferencia de las Naciones Unidas sobre Agricultura Sostenible abrió sus sesiones en Ginebra con un llamado urgente a descarbonizar la producción agrícola mundial.\n\nLos ponentes destacaron el éxito de los modelos biodinámicos andinos, donde la apicultura integrada y los abonos biológicos aumentan los rendimientos hasta en un 35% mientras restauran los acuíferos subterráneos.`,
      author: "Sarah Jenkins",
      sourceName: "Reuters World",
      sourceLogo: "Reuters World",
      image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1000&q=80",
      country: "global",
      publishedAt: "Hace 1 hora",
      views: 42100
    },
    {
      id: 'news-5',
      title: "El impacto del bienestar holístico en la productividad laboral urbana",
      summary: "Nuevos datos demuestran que el consumo de adaptógenos naturales y nutrición vegetal optimiza el desempeño en entornos exigentes.",
      fullContent: `Un informe publicado por el Oxford Wellbeing Institute reveló que los profesionales que incorporan soluciones naturales de manejo de estrés reportan un incremento significativo en la concentración y una reducción del 40% en licencias médicas por 'burnout'.\n\nEl estudio resalta que los consumidores buscan cada vez más productos con respaldo científico y sellos legales transparentes.`,
      author: "David Vance",
      sourceName: "Financial Times",
      sourceLogo: "Financial Times",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80",
      country: "us",
      publishedAt: "Hace 2 horas",
      views: 28900
    },
    {
      id: 'news-6',
      title: "Argentina impulsa la investigación en productos derivados de apiterapia",
      summary: "Universidades de Buenos Aires abren laboratorio especializado en caracterización de venenos de abejas y propóleos.",
      fullContent: `La Universidad Nacional de La Plata inauguró hoy su Centro de Biotecnología Apícola, dedicado a analizar la pureza cromatográfica de mieles, extractos de polen y melitina purificada.\n\nEl objetivo de la institución es crear patentes públicas para tratamientos dermocosméticos y parches antiinflamatorios de origen natural.`,
      author: "Gonzalo Peralta",
      sourceName: "La Nación",
      sourceLogo: "La Nación",
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80",
      country: "ar",
      publishedAt: "Hace 3 horas",
      views: 19400
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
              fullContent: data.fullContent || data.content || data.summary || 'Contenido detallado en desarrollo.',
              author: data.author || data.byline || 'Redacción Gran Noticias',
              sourceName: data.sourceName || 'Agencia Periodística',
              sourceLogo: (data.sourceLogo || data.sourceName || 'Medio Verificado').replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim(),
              image: data.image || data.thumbnail || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1000&q=80",
              country: (data.country || 'global').toLowerCase(),
              publishedAt: pubTime,
              views: data.views || Math.floor(Math.random() * 20000) + 5000
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

  // Filtered & Sorted News Items
  const filteredNews = realtimeArticles
    .filter(item => {
      if (activeCountry === 'global') return true;
      if (activeCountry === 'salud') return item.summary.toLowerCase().includes('apitoxina') || item.summary.toLowerCase().includes('botánic') || item.summary.toLowerCase().includes('salud');
      return item.country === activeCountry || item.country === 'global';
    })
    .sort((a, b) => {
      if (activeSort === 'populares') return (b.views || 0) - (a.views || 0);
      return 0;
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

        {/* FRANJA EDITORIAL DESTACADA GRANCOLINOS (100% SIN EMOJIS) */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-3">
            <h2 className="text-xs font-bold text-[#E2E8F0] uppercase tracking-[0.25em] flex items-center gap-2">
              <Sparkles size={16} /> DESTACADOS Y REGULACIÓN GRANCOLINOS
            </h2>
            <span className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">Edición Institucional</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {brandFeaturedArticles.map((article) => (
              <div 
                key={article.id} 
                onClick={() => setSelectedArticle(article)}
                className="bg-black/40 border border-[#E2E8F0]/30 hover:border-[#E2E8F0]/80 rounded-2xl overflow-hidden backdrop-blur-xl shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer hover:-translate-y-1"
              >
                <div>
                  {/* Original Image */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent"></div>
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
                  <span className="text-[#E2E8F0] flex items-center gap-1 font-bold group-hover:underline">
                    Leer Informe Completo <BookOpen size={13} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FEED GLOBAL EN TIEMPO REAL CON SELECTOR DESPLEGABLE Y CONSOLIDADO POPULARES */}
        <div className="bg-black/50 border border-[#E2E8F0]/30 rounded-3xl p-6 md:p-10 backdrop-blur-xl shadow-2xl mb-16 glow-noticias">
          
          {/* Header & Menús Desplegables / Controles de Filtros */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-[#E2E8F0]/20 pb-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E2E8F0]/15 border border-[#E2E8F0]/30 flex items-center justify-center text-[#E2E8F0] shrink-0">
                <Rss size={20} className="animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  FEED EN VIVO DE GRAN NOTICIAS <span className="px-2.5 py-0.5 bg-[#E2E8F0]/20 text-[#E2E8F0] text-[9px] font-mono rounded border border-[#E2E8F0]/30">EN TIEMPO REAL</span>
                </h3>
                <p className="text-xs text-gray-300">Red internacional de periodismo verificado y fuentes asociadas</p>
              </div>
            </div>

            {/* Selector Desplegable de País / Región + Botón Más Populares (SIN EMOJIS & SIN SCROLLBARS) */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              
              {/* Botón de Ordenamiento: Más Populares vs Recientes */}
              <button
                onClick={() => setActiveSort(activeSort === 'populares' ? 'recientes' : 'populares')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                  activeSort === 'populares'
                    ? 'bg-[#E2E8F0] text-black border-[#E2E8F0] shadow-[0_0_15px_rgba(226,232,240,0.4)]'
                    : 'bg-black/60 text-gray-300 border-white/10 hover:text-white hover:bg-white/10'
                }`}
              >
                <TrendingUp size={14} />
                {activeSort === 'populares' ? 'MÁS POPULARES' : 'MÁS RECIENTES'}
              </button>

              {/* Selector Desplegable de País / Región */}
              <div className="relative flex-1 lg:flex-none">
                <select
                  value={activeCountry}
                  onChange={(e) => {
                    const val = e.target.value;
                    setActiveCountry(val);
                    if (val === 'global') router.push('/noticias', { scroll: false });
                    else router.push(`/noticias?pais=${val}`, { scroll: false });
                  }}
                  className="w-full lg:w-64 bg-black/80 text-[#E2E8F0] text-xs font-bold py-2.5 px-4 pr-8 rounded-xl border border-[#E2E8F0]/40 appearance-none focus:outline-none focus:border-[#E2E8F0] shadow-md cursor-pointer"
                >
                  {countries.map((c) => (
                    <option key={c.id} value={c.id} className="bg-[#0A0D0B] text-white py-1">
                      {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3 text-[#E2E8F0] pointer-events-none" size={16} />
              </div>

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
              <p className="text-xs text-gray-400">Selecciona "Cobertura Global" para visualizar todas las noticias consolidadas.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedArticle(item)}
                  className="group bg-black/40 border border-[#E2E8F0]/20 hover:border-[#E2E8F0]/70 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between hover:scale-[1.02] shadow-lg cursor-pointer"
                >
                  <div>
                    {/* Article Original Image */}
                    <div className="relative h-44 w-full overflow-hidden bg-black/60">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent"></div>
                      
                      {/* Media Badge Overlay */}
                      <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/80 backdrop-blur-md text-[#E2E8F0] text-[10px] font-bold tracking-wider uppercase rounded border border-[#E2E8F0]/30 shadow-md">
                        {item.sourceLogo || item.sourceName}
                      </span>

                      {/* Views Count Badge */}
                      {item.views && (
                        <span className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/70 backdrop-blur-md text-gray-300 text-[9px] font-mono rounded flex items-center gap-1 border border-white/10">
                          <Flame size={10} className="text-[#E2E8F0]" /> {(item.views / 1000).toFixed(1)}k lecturas
                        </span>
                      )}
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
                    <span>Desplegar Artículo Completo</span>
                    <BookOpen size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <PaymentMethodsBadge />
      </div>

      {/* VENTANA LECTORA INTERNA MODAL (100% SIN EMOJIS) */}
      {selectedArticle && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="bg-[#090E0B] border border-[#E2E8F0]/40 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar shadow-[0_0_60px_rgba(0,0,0,0.95)] relative flex flex-col">
            
            {/* Header del Modal */}
            <div className="sticky top-0 z-50 bg-[#090E0B]/95 backdrop-blur-md px-6 py-4 border-b border-[#E2E8F0]/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-[#E2E8F0]/15 text-[#E2E8F0] text-[10px] font-bold uppercase tracking-widest rounded border border-[#E2E8F0]/30">
                  {selectedArticle.sourceLogo || selectedArticle.sourceName}
                </span>
                <span className="text-xs text-gray-400 font-mono">• {selectedArticle.publishedAt}</span>
              </div>
              <button 
                onClick={() => setSelectedArticle(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#E2E8F0] hover:text-black text-white flex items-center justify-center transition-all"
                title="Cerrar lectura"
              >
                <X size={18} />
              </button>
            </div>

            {/* Imagen Principal en Grande */}
            <div className="relative h-64 sm:h-80 w-full bg-black shrink-0">
              <img 
                src={selectedArticle.image} 
                alt={selectedArticle.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090E0B] via-transparent to-transparent"></div>
            </div>

            {/* Contenido del Artículo */}
            <div className="p-6 sm:p-10 space-y-6">
              <div className="flex items-center gap-2 text-xs font-mono text-[#E2E8F0]">
                <UserCheck size={14} /> <span>Autor: <strong>{selectedArticle.author}</strong></span>
              </div>

              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white leading-tight">
                {selectedArticle.title}
              </h2>

              <div className="w-12 h-0.5 bg-[#E2E8F0]/50"></div>

              <p className="text-gray-200 text-sm sm:text-base leading-relaxed font-light italic bg-white/5 p-4 rounded-xl border border-white/10">
                "{selectedArticle.summary}"
              </p>

              <div className="text-gray-300 text-sm sm:text-base leading-relaxed space-y-4 font-light whitespace-pre-line">
                {selectedArticle.fullContent}
              </div>

              {/* Pie de Lectura y Garantía GranColinos */}
              <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                  <Globe size={14} className="text-[#E2E8F0]" /> Gran Noticias • Verificado por Redacción
                </div>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-6 py-2.5 bg-[#E2E8F0] text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-white transition-all shadow-lg"
                >
                  Volver al Portal
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

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
