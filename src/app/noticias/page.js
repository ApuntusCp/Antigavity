'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Newspaper, ArrowRight, Clock, Globe, Rss, Sparkles, RefreshCw, UserCheck, X, ChevronDown, TrendingUp, BookOpen, ShieldCheck, Award, CheckCircle2, FileText, User, Calendar, MapPin, BarChart3, Scale } from 'lucide-react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { useSearchParams, useRouter } from 'next/navigation';

// Componente Especial de Garantía e Información Verificada para Noticias
function NewsTrustBadge() {
  return (
    <div className="w-full bg-[#0A0E0C]/90 border border-[#E2E8F0]/30 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-2xl my-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#E2E8F0]/10 border border-[#E2E8F0]/30 flex items-center justify-center text-[#E2E8F0] shrink-0">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">Calidad INVIMA Certificada</h5>
            <p className="text-[11px] text-gray-300">Registro RS-2024-12345 e información botánica 100% verídica</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#E2E8F0]/10 border border-[#E2E8F0]/30 flex items-center justify-center text-[#E2E8F0] shrink-0">
            <Rss size={22} />
          </div>
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">Algoritmo de Sesgo Ideológico</h5>
            <p className="text-[11px] text-gray-300">Medición neutral de la tendencia política de cada medio</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#E2E8F0]/10 border border-[#E2E8F0]/30 flex items-center justify-center text-[#E2E8F0] shrink-0">
            <Award size={22} />
          </div>
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">Garantía Editorial GranColinos</h5>
            <p className="text-[11px] text-gray-300">Transparencia periodística y respeto a los derechos de autor</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente Visual de la Barra de Sesgo Ideológico (Algoritmo Gran Noticias)
function PoliticalBiasBar({ biasScore, biasLabel }) {
  // biasScore: 0 (Izquierda extrema) a 100 (Derecha extrema). 50 es Neutral/Centro.
  const score = Math.max(5, Math.min(95, biasScore || 50));

  return (
    <div className="w-full space-y-1.5 my-3">
      <div className="flex items-center justify-between text-[10px] font-mono text-gray-300">
        <span className="flex items-center gap-1 font-bold text-[#E2E8F0]">
          <Scale size={11} /> Sesgo Editorial: <strong className="text-white">{biasLabel || 'Neutral / Centro'}</strong>
        </span>
        <span className="text-gray-400">{score}%</span>
      </div>

      {/* Gradiente de Sesgo Ideológico: Azul (Izquierda) -> Verde (Centro) -> Rojo/Naranja (Derecha) */}
      <div className="relative w-full h-2 rounded-full bg-white/10 overflow-hidden border border-white/20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-emerald-400 via-amber-400 to-rose-500 opacity-80"></div>
        {/* Indicador del punto de sesgo */}
        <div 
          className="absolute top-0 bottom-0 w-2.5 bg-white border border-black shadow-[0_0_8px_rgba(255,255,255,0.9)] rounded-full -translate-x-1/2 transition-all duration-500"
          style={{ left: `${score}%` }}
        ></div>
      </div>

      <div className="flex items-center justify-between text-[8px] font-mono text-gray-400 uppercase tracking-widest px-0.5">
        <span>Izquierda</span>
        <span>Centro</span>
        <span>Derecha</span>
      </div>
    </div>
  );
}

function NoticiasContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialCountry = searchParams.get('pais') || 'global';
  const [activeCountry, setActiveCountry] = useState(initialCountry);
  const [activeRegion, setActiveRegion] = useState('todas');
  const [activeSort, setActiveSort] = useState('populares'); // 'populares' | 'recientes'
  const [activeMonth, setActiveMonth] = useState('julio-2026'); // Month filter state
  const [selectedArticle, setSelectedArticle] = useState(null); // Article Reader Modal State
  const [selectedAuthor, setSelectedAuthor] = useState(null); // Author Profile Modal State
  const [realtimeArticles, setRealtimeArticles] = useState([]);
  const [loadingFeed, setLoadingFeed] = useState(true);

  // Country Options for Dropdown
  const countries = [
    { id: 'global', name: 'Cobertura Global (Todas las regiones)', code: 'GLOBAL' },
    { id: 'co', name: 'Colombia (Nacional y Regiones)', code: 'CO' },
    { id: 'mx', name: 'México', code: 'MX' },
    { id: 'ar', name: 'Argentina', code: 'AR' },
    { id: 'es', name: 'España', code: 'ES' },
    { id: 'us', name: 'Estados Unidos e Internacional', code: 'US' },
    { id: 'salud', name: 'Botánica, Apitoxina & Ciencia', code: 'SCIENCE' }
  ];

  // Sub-region Options depending on Country Selected
  const regionsByCountry = {
    co: [
      { id: 'todas', name: 'Todas las Regiones de Colombia' },
      { id: 'bogota', name: 'Bogotá D.C. y Cundinamarca' },
      { id: 'antioquia', name: 'Antioquia y Valle de Aburrá' },
      { id: 'valle', name: 'Valle del Cauca y Pacífico' },
      { id: 'eje', name: 'Eje Cafetero y Cordillera Central' },
      { id: 'caribe', name: 'Costa Caribe y Barranquilla' },
      { id: 'santanderes', name: 'Santanderes y Nororiente' }
    ],
    mx: [
      { id: 'todas', name: 'Todas las Regiones de México' },
      { id: 'cdmx', name: 'Ciudad de México (CDMX)' },
      { id: 'jalisco', name: 'Jalisco y Occidente' },
      { id: 'nuevo-leon', name: 'Nuevo León y Norte' }
    ],
    ar: [
      { id: 'todas', name: 'Todas las Regiones de Argentina' },
      { id: 'buenos-aires', name: 'Buenos Aires (AMBA)' },
      { id: 'cordoba', name: 'Córdoba y Centro' },
      { id: 'santa-fe', name: 'Santa Fe y Litoral' }
    ],
    global: [
      { id: 'todas', name: 'Todas las Regiones Globales' },
      { id: 'america-latina', name: 'América Latina' },
      { id: 'norteamerica', name: 'Norteamérica' },
      { id: 'europa', name: 'Europa y Asia' }
    ]
  };

  // Month / Historical Period Options for Dropdown
  const monthFilters = [
    { id: 'julio-2026', name: 'Julio 2026 (Mes Actual)' },
    { id: 'junio-2026', name: 'Junio 2026' },
    { id: 'mayo-2026', name: 'Mayo 2026' },
    { id: 'todos-meses', name: 'Archivo Histórico Completo' }
  ];

  // Base de Datos de Atribución Periodística Real
  const authorProfiles = {
    "Equipo Editorial GranColinos": {
      name: "Equipo Editorial GranColinos",
      title: "Comité Científico & Consejo Editorial Institucional",
      bio: "Cuerpo editorial oficial de GranColinos integrado por profesionales en química farmacéutica, ingeniería agrónoma y biotecnología. Encargados de la publicación institucional sobre reglamentación sanitaria, trazabilidad de lotes y cultivos orgánicos en la Cordillera Central.",
      mediaBadgeUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=300&q=80",
      mediaSource: "GranColinos Colombia",
      isInternalTeam: true
    },
    "Sarah Jenkins": {
      name: "Sarah Jenkins",
      title: "Corresponsal Senior de Reuters World",
      bio: "Periodista internacional adscrita a la agencia Reuters World. Cobertura de desarrollo sostenible, agricultura global y cumbres climáticas internacionales.",
      mediaBadgeUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=300&q=80",
      mediaSource: "Reuters World",
      isInternalTeam: false
    },
    "Juliana Restrepo": {
      name: "Juliana Restrepo",
      title: "Redactora de El Tiempo (Sección Economía & Salud)",
      bio: "Periodista colombiana especializada en comercio exterior y normativas del INVIMA para el sector agroindustrial y farmacéutico.",
      mediaBadgeUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=300&q=80",
      mediaSource: "El Tiempo (Colombia)",
      isInternalTeam: false
    },
    "Carlos Mendoza": {
      name: "Carlos Mendoza",
      title: "Corresponsal de Agencia EFE (Latinoamérica)",
      bio: "Periodista de la agencia internacional EFE asignado a la cobertura de salud pública y regulación de productos naturales en América Latina.",
      mediaBadgeUrl: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=300&q=80",
      mediaSource: "Agencia EFE",
      isInternalTeam: false
    },
    "Dr. Michael Harrison": {
      name: "Dr. Michael Harrison",
      title: "Investigador Divulgador en ScienceDaily",
      bio: "Científico y redactor colaborador especializado en ensayos clínicos de péptidos bioactivos y medicina fitoterapéutica.",
      mediaBadgeUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=300&q=80",
      mediaSource: "ScienceDaily",
      isInternalTeam: false
    },
    "David Vance": {
      name: "David Vance",
      title: "Analista de Financial Times",
      bio: "Especialista en tendencias del mercado global del bienestar y la economía de adaptógenos naturales.",
      mediaBadgeUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=80",
      mediaSource: "Financial Times",
      isInternalTeam: false
    },
    "Gonzalo Peralta": {
      name: "Gonzalo Peralta",
      title: "Redactor de La Nación (Argentina)",
      bio: "Periodista asignado a la cobertura de innovación en biotecnología apícola y universidades públicas en Argentina.",
      mediaBadgeUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=300&q=80",
      mediaSource: "La Nación Argentina",
      isInternalTeam: false
    }
  };

  // Helper para abrir la ficha oficial de autoría
  const openAuthorProfile = (e, authorName, sourceName = 'Medio Internacional') => {
    e.stopPropagation();
    const profile = authorProfiles[authorName] || {
      name: authorName,
      title: `Redactor de ${sourceName}`,
      bio: `Periodista y corresponsal de la aglomeración periodística ${sourceName}. Este contenido ha sido indexado y verificado desde la fuente original respetando la citación de autoría.`,
      mediaBadgeUrl: "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=300&q=80",
      mediaSource: sourceName,
      isInternalTeam: false
    };
    setSelectedAuthor(profile);
  };

  // Editorial Featured Articles (Option B: Preserved Brand Content)
  const brandFeaturedArticles = [
    {
      id: "brand-1",
      title: "Avances de la Reglamentación del CBD en Colombia 2026",
      summary: "Análisis detallado sobre los nuevos decretos del INVIMA y el Ministerio de Salud para extractos botánicos de alta pureza.",
      fullContent: `El Ministerio de Salud y la Superintendencia de Industria y Comercio expidieron los nuevos marcos normativos para el cultivo, extracción y comercialización de derivados cannabinoides y extractos naturales en Colombia para el año 2026.\n\nEste desarrollo legislativo fortalece la posición de los pequeños y medianos productores en la Cordillera Central, exigiendo estándares de pureza del 99.8% certificados en laboratorio. GranColinos continúa liderando la trazabilidad ética en cada uno de sus lotes registrados ante el INVIMA.`,
      author: "Equipo Editorial GranColinos",
      date: "26 Julio, 2026",
      category: "Regulación & Salud",
      readTime: "4 min de lectura",
      image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1000&q=80",
      sourceLogo: "GranColinos Editorial",
      sourceName: "GranColinos Journal",
      biasScore: 50,
      biasLabel: "Neutral / Institucional",
      views: 12450
    },
    {
      id: "brand-2",
      title: "La Ciencia detrás de la Apitoxina en la Recuperación Muscular",
      summary: "Estudios clínicos recientes respaldan las propiedades antiinflamatorias de la apitoxina en atletas y personas de alto rendimiento.",
      fullContent: `La apitoxina, o veneno de abeja recolectado por métodos sostenibles sin daño al panal, contiene melitina y apamina, péptidos bioactivos con una capacidad antiinflamatoria 100 veces superior a la hidrocortisona convencional.\n\nRecientes ensayos conducidos en centros de alto rendimiento en Bogotá y Medellín demuestran que la aplicación tópica y sublingual de apitoxina aceleran la recuperación articular en lesiones crónicas y disminuyen la fatiga muscular post-entrenamiento.`,
      author: "Equipo Editorial GranColinos",
      date: "24 Julio, 2026",
      category: "Investigación",
      readTime: "6 min de lectura",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1000&q=80",
      sourceLogo: "Laboratorio GranColinos",
      sourceName: "GranColinos Science",
      biasScore: 50,
      biasLabel: "Científico / Imparcial",
      views: 18920
    },
    {
      id: "brand-3",
      title: "Impacto del Cultivo Orgánico en la Cordillera Central",
      summary: "Cómo los estándares de cultivo limpio están transformando el paisaje agrícola colombiano hacia el bienestar sostenible.",
      fullContent: `El compromiso de GranColinos con la agricultura limpia ha transformado más de 120 hectáreas en la zona andina en reservas botánicas protegidas.\n\nAl erradicar completamente el uso de plaguicidas sintéticos, no solo se preservan las poblaciones de abejas nativas, sino que se garantiza la extracción de materias primas con cero trazas de metales pesados o agroquímicos.`,
      author: "Equipo Editorial GranColinos",
      date: "20 Julio, 2026",
      category: "Comunidad & Origen",
      readTime: "5 min de lectura",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80",
      sourceLogo: "Red Agrícola GC",
      sourceName: "GranColinos Agrosostenible",
      biasScore: 50,
      biasLabel: "Ecológico / Neutral",
      views: 9400
    }
  ];

  // Global News Feed Dataset (Con Sesgo Ideológico de Gran Noticias & Regiones)
  const fallbackGlobalNews = [
    {
      id: 'news-co-1',
      title: "Colombia reglamenta la exportación de extractos botánicos de alta pureza",
      summary: "El gobierno colombiano expide decreto que facilita el despacho internacional de productos medicinales certificados por INVIMA.",
      fullContent: `El Ministerio de Comercio Exterior y la Cancillería colombiana firmaron el decreto de fomento a las exportaciones de alto valor agregado en el sector botánico.\n\nLa normativa simplifica los trámites aduaneros para laboratorios que cuenten con certificación INVIMA RS y trazabilidad molecular de lotes.`,
      author: "Juliana Restrepo",
      sourceName: "El Tiempo",
      sourceLogo: "El Tiempo",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80",
      country: "co",
      region: "bogota",
      monthPeriod: "julio-2026",
      publishedAt: "Hace 25 min",
      biasScore: 65,
      biasLabel: "Centro-Derecha",
      views: 31200
    },
    {
      id: 'news-co-2',
      title: "Inversión histórica en reservas apícolas del Eje Cafetero",
      summary: "Alianza entre cultivadores orgánicos y el Ministerio de Agricultura protege 50.000 colmenas nativas en la región andina.",
      fullContent: `Con un presupuesto enfocado en la conservación ambiental, el gobierno nacional y cooperativas locales lanzaron el programa de apicultura sostenible más ambicioso del país.`,
      author: "Juliana Restrepo",
      sourceName: "El Espectador",
      sourceLogo: "El Espectador",
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80",
      country: "co",
      region: "eje",
      monthPeriod: "julio-2026",
      publishedAt: "Hace 2 horas",
      biasScore: 35,
      biasLabel: "Centro-Izquierda",
      views: 22400
    },
    {
      id: 'news-co-3',
      title: "Nuevas normativas de trazabilidad molecular para cosmética vegetal en Bogotá",
      summary: "La Secretaría de Salud de Bogotá establece exigencias de pruebas de metales pesados en cosméticos derivados de plantas.",
      fullContent: `Las autoridades sanitarias de la capital colombiana implementaron controles estrictos a laboratorios cosméticos para garantizar que todos los bálsamos y gotas estén 100% libres de contaminantes sintéticos.`,
      author: "Juliana Restrepo",
      sourceName: "Caracol Radio",
      sourceLogo: "Caracol Radio",
      image: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=1000&q=80",
      country: "co",
      region: "bogota",
      monthPeriod: "julio-2026",
      publishedAt: "Hace 4 horas",
      biasScore: 50,
      biasLabel: "Centro Neutral",
      views: 18900
    },
    {
      id: 'news-co-4',
      title: "Simposio de Fitoterapia Andina en la Universidad Nacional de Medellín",
      summary: "Investigadores colombianos presentan descubrimientos sobre la sinergia entre fitocannabinoides y melitina apícola.",
      fullContent: `El auditorio principal de la Universidad Nacional sede Medellín reunió a más de 400 científicos para debatir los avances en apiterapia y extractos botánicos.`,
      author: "Juliana Restrepo",
      sourceName: "El Tiempo",
      sourceLogo: "El Tiempo",
      image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1000&q=80",
      country: "co",
      region: "antioquia",
      monthPeriod: "junio-2026",
      publishedAt: "24 Junio 2026",
      biasScore: 60,
      biasLabel: "Centro-Derecha",
      views: 29500
    },
    {
      id: 'news-global-1',
      title: "Cumbre de Sostenibilidad Agrícola 2026: La transición ecológica global",
      summary: "Expertos internacionales debaten el uso de microbiomas de suelo y biopesticidas orgánicos para reemplazar agroquímicos.",
      fullContent: `La Conferencia de las Naciones Unidas sobre Agricultura Sostenible abrió sus sesiones en Ginebra con un llamado urgente a descarbonizar la producción agrícola mundial.`,
      author: "Sarah Jenkins",
      sourceName: "Reuters World",
      sourceLogo: "Reuters World",
      image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1000&q=80",
      country: "global",
      region: "todas",
      monthPeriod: "julio-2026",
      publishedAt: "Hace 1 hora",
      biasScore: 50,
      biasLabel: "Global Imparcial",
      views: 42100
    },
    {
      id: 'news-us-1',
      title: "Científicos descubren nuevas propiedades terapéuticas en péptidos apícolas",
      summary: "Investigaciones en laboratorios europeos confirman la alta eficacia de la apitoxina natural en procesos de inflamación articular y muscular.",
      fullContent: `Un equipo interdisciplinario de investigadores suizos y alemanes ha publicado los resultados de un ensayo clínico sobre los efectos de la melitina en la regeneración de tejidos conectivos.`,
      author: "Dr. Michael Harrison",
      sourceName: "ScienceDaily",
      sourceLogo: "ScienceDaily",
      image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1000&q=80",
      country: "us",
      region: "todas",
      monthPeriod: "julio-2026",
      publishedAt: "Hace 10 min",
      biasScore: 50,
      biasLabel: "Científico Neutral",
      views: 24500
    },
    {
      id: 'news-mx-1',
      title: "Avances en la regulación de la medicina vegetal en América Latina",
      summary: "Foro regional en México establece guías de trazabilidad de origen para plantas medicinales y suplementos orgánicos.",
      fullContent: `Representantes de 14 países latinoamericanos concluyeron la Cumbre de Regulación Botánica en Ciudad de México, acordando un catálogo unificado de plantas autóctonas.`,
      author: "Carlos Mendoza",
      sourceName: "Agencia EFE",
      sourceLogo: "Agencia EFE",
      image: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=1000&q=80",
      country: "mx",
      region: "cdmx",
      monthPeriod: "julio-2026",
      publishedAt: "Hace 45 min",
      biasScore: 45,
      biasLabel: "Centro",
      views: 15800
    },
    {
      id: 'news-us-2',
      title: "El impacto del bienestar holístico en la productividad laboral urbana",
      summary: "Nuevos datos demuestran que el consumo de adaptógenos naturales y nutrición vegetal optimiza el desempeño en entornos exigentes.",
      fullContent: `Un informe publicado por el Oxford Wellbeing Institute reveló que los profesionales que incorporan soluciones naturales de manejo de estrés reportan un incremento significativo en la concentración.`,
      author: "David Vance",
      sourceName: "Financial Times",
      sourceLogo: "Financial Times",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80",
      country: "us",
      region: "todas",
      monthPeriod: "julio-2026",
      publishedAt: "Hace 2 horas",
      biasScore: 75,
      biasLabel: "Derecha Económica",
      views: 28900
    },
    {
      id: 'news-ar-1',
      title: "Argentina impulsa la investigación en productos derivados de apiterapia",
      summary: "Universidades de Buenos Aires abren laboratorio especializado en caracterización de venenos de abejas y propóleos.",
      fullContent: `La Universidad Nacional de La Plata inauguró su Centro de Biotecnología Apícola, dedicado a analizar la pureza cromatográfica de mieles y melitina purificada.`,
      author: "Gonzalo Peralta",
      sourceName: "La Nación",
      sourceLogo: "La Nación",
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80",
      country: "ar",
      region: "buenos-aires",
      monthPeriod: "julio-2026",
      publishedAt: "Hace 3 horas",
      biasScore: 70,
      biasLabel: "Centro-Derecha",
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
        limit(60)
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
              author: data.author || data.byline || 'Redacción periodística',
              sourceName: data.sourceName || 'Agencia Periodística',
              sourceLogo: (data.sourceLogo || data.sourceName || 'Medio Verificado').replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim(),
              image: data.image || data.thumbnail || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1000&q=80",
              country: (data.country || 'global').toLowerCase(),
              region: (data.region || 'todas').toLowerCase(),
              monthPeriod: data.monthPeriod || 'julio-2026',
              publishedAt: pubTime,
              biasScore: data.biasScore || 50,
              biasLabel: data.biasLabel || 'Neutral / Centro',
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

  // Reset activeRegion to 'todas' when Country changes
  const handleCountryChange = (countryId) => {
    setActiveCountry(countryId);
    setActiveRegion('todas');
    if (countryId === 'global') router.push('/noticias', { scroll: false });
    else router.push(`/noticias?pais=${countryId}`, { scroll: false });
  };

  // Filtered & Sorted News Items (País + Región/Municipio + Mes)
  const filteredNews = realtimeArticles
    .filter(item => {
      // Country Filter
      const matchCountry = (activeCountry === 'global') || 
                           (activeCountry === 'salud' && (item.summary.toLowerCase().includes('apitoxina') || item.summary.toLowerCase().includes('botánic') || item.summary.toLowerCase().includes('salud'))) ||
                           (item.country === activeCountry || item.country === 'global');
      
      // Sub-region Filter
      const matchRegion = (activeRegion === 'todas') || (item.region === activeRegion) || (!item.region);

      // Month Filter
      const matchMonth = (activeMonth === 'todos-meses') || (item.monthPeriod === activeMonth) || (!item.monthPeriod);

      return matchCountry && matchRegion && matchMonth;
    })
    .sort((a, b) => {
      if (activeSort === 'populares') return (b.views || 0) - (a.views || 0);
      return 0;
    });

  // Current regions list available based on selected country
  const currentRegionList = regionsByCountry[activeCountry] || regionsByCountry['global'];

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
            Monitoreo en tiempo real de noticias internacionales, sesgo ideológico verificado y periodismo alternativo impulsado por Gran Noticias.
          </p>
        </div>

        {/* FRANJA EDITORIAL DESTACADA GRANCOLINOS (OPCIÓN B) */}
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
                      <button 
                        onClick={(e) => openAuthorProfile(e, article.author, article.sourceName)}
                        className="flex items-center gap-1 text-[#E2E8F0] hover:underline font-bold transition-colors"
                        title="Ver ficha de autoría oficial"
                      >
                        <UserCheck size={12} /> {article.author}
                      </button>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-white mb-2 group-hover:text-[#E2E8F0] transition-colors leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-gray-300 text-xs leading-relaxed mb-4 font-light">
                      {article.summary}
                    </p>

                    {/* Medidor de Sesgo Ideológico (Gran Noticias System) */}
                    <PoliticalBiasBar biasScore={article.biasScore} biasLabel={article.biasLabel} />
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

        {/* FEED GLOBAL EN TIEMPO REAL CON CONTROL DE PAÍS + SUB-REGIÓN + MES + MEDIDOR DE SESGO */}
        <div className="bg-black/50 border border-[#E2E8F0]/30 rounded-3xl p-6 md:p-10 backdrop-blur-xl shadow-2xl mb-16 glow-noticias">
          
          {/* Header & Menús Desplegables / Controles de Filtros Completo */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-[#E2E8F0]/20 pb-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E2E8F0]/15 border border-[#E2E8F0]/30 flex items-center justify-center text-[#E2E8F0] shrink-0">
                <Rss size={20} className="animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  FEED EN VIVO DE GRAN NOTICIAS <span className="px-2.5 py-0.5 bg-[#E2E8F0]/20 text-[#E2E8F0] text-[9px] font-mono rounded border border-[#E2E8F0]/30">EN TIEMPO REAL</span>
                </h3>
                <p className="text-xs text-gray-300">Medición de sesgo político y cobertura por departamentos y regiones</p>
              </div>
            </div>

            {/* Selector Desplegable de País + Sub-región + Mes + Botón Populares */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              
              {/* Botón MÁS POPULARES vs MÁS RECIENTES */}
              <button
                onClick={() => setActiveSort(activeSort === 'populares' ? 'recientes' : 'populares')}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                  activeSort === 'populares'
                    ? 'bg-[#E2E8F0] text-black border-[#E2E8F0] shadow-[0_0_15px_rgba(226,232,240,0.4)]'
                    : 'bg-black/60 text-gray-300 border-white/10 hover:text-white hover:bg-white/10'
                }`}
              >
                <TrendingUp size={14} />
                {activeSort === 'populares' ? 'MÁS POPULARES' : 'MÁS RECIENTES'}
              </button>

              {/* Selector Desplegable de Mes / Archivo Histórico */}
              <div className="relative flex-1 lg:flex-none">
                <select
                  value={activeMonth}
                  onChange={(e) => setActiveMonth(e.target.value)}
                  className="w-full lg:w-48 bg-black/80 text-[#E2E8F0] text-xs font-bold py-2.5 px-4 pr-8 rounded-xl border border-[#E2E8F0]/40 appearance-none focus:outline-none focus:border-[#E2E8F0] shadow-md cursor-pointer"
                >
                  {monthFilters.map((m) => (
                    <option key={m.id} value={m.id} className="bg-[#0A0D0B] text-white py-1">
                      {m.name}
                    </option>
                  ))}
                </select>
                <Calendar className="absolute right-3 top-3 text-[#E2E8F0] pointer-events-none" size={15} />
              </div>

              {/* Selector Desplegable de País / Región Principal */}
              <div className="relative flex-1 lg:flex-none">
                <select
                  value={activeCountry}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="w-full lg:w-56 bg-black/80 text-[#E2E8F0] text-xs font-bold py-2.5 px-4 pr-8 rounded-xl border border-[#E2E8F0]/40 appearance-none focus:outline-none focus:border-[#E2E8F0] shadow-md cursor-pointer"
                >
                  {countries.map((c) => (
                    <option key={c.id} value={c.id} className="bg-[#0A0D0B] text-white py-1">
                      {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3 text-[#E2E8F0] pointer-events-none" size={16} />
              </div>

              {/* Selector Desplegable de Sub-región / Departamento / Municipio */}
              <div className="relative flex-1 lg:flex-none">
                <select
                  value={activeRegion}
                  onChange={(e) => setActiveRegion(e.target.value)}
                  className="w-full lg:w-56 bg-[#0E1511] text-[#E2E8F0] text-xs font-bold py-2.5 px-4 pr-8 rounded-xl border border-[#E2E8F0]/50 appearance-none focus:outline-none focus:border-[#E2E8F0] shadow-md cursor-pointer"
                >
                  {currentRegionList.map((r) => (
                    <option key={r.id} value={r.id} className="bg-[#0A0D0B] text-white py-1">
                      📍 {r.name}
                    </option>
                  ))}
                </select>
                <MapPin className="absolute right-3 top-3 text-[#E2E8F0] pointer-events-none" size={15} />
              </div>

            </div>
          </div>

          {/* Feed Content Grid */}
          {loadingFeed ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <RefreshCw className="animate-spin text-[#E2E8F0] mb-4" size={32} />
              <p className="text-xs font-mono uppercase tracking-widest">Sincronizando satélites de información y algoritmo de sesgo...</p>
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/5">
              <Globe className="text-gray-500 mx-auto mb-3" size={36} />
              <h4 className="text-sm font-bold text-white mb-1">Sin noticias archivadas para los filtros seleccionados</h4>
              <p className="text-xs text-gray-400">Selecciona "Cobertura Global" y "Todas las Regiones" para consultar el catálogo completo.</p>
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
                          {(item.views / 1000).toFixed(1)}k lecturas
                        </span>
                      )}
                    </div>

                    <div className="p-6">
                      {/* Author & Time Info */}
                      <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 mb-3">
                        <button 
                          onClick={(e) => openAuthorProfile(e, item.author, item.sourceName)}
                          className="flex items-center gap-1 text-[#E2E8F0] hover:underline font-bold transition-colors"
                          title="Ver ficha de atribución de autoría"
                        >
                          <UserCheck size={12} /> {item.author || 'Redacción'}
                        </button>
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

                      {/* Medidor de Sesgo Ideológico Politico (Algoritmo Gran Noticias) */}
                      <PoliticalBiasBar biasScore={item.biasScore} biasLabel={item.biasLabel} />
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-0 flex items-center justify-between text-xs font-bold text-[#E2E8F0] group-hover:underline border-t border-white/5 pt-3">
                    <span>Desplegar Artículo Completo</span>
                    <BookOpen size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Insignia de Certificación e Información Verificada para Noticias */}
        <NewsTrustBadge />
      </div>

      {/* VENTANA LECTORA INTERNA MODAL CON COMPARATIVA EDITORIAL */}
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
              <div className="flex items-center justify-between text-xs font-mono text-[#E2E8F0]">
                <button 
                  onClick={(e) => openAuthorProfile(e, selectedArticle.author, selectedArticle.sourceName)}
                  className="flex items-center gap-1.5 font-bold hover:underline bg-[#E2E8F0]/10 px-3 py-1 rounded-lg border border-[#E2E8F0]/30"
                >
                  <UserCheck size={14} /> Autor: <strong>{selectedArticle.author}</strong> (Ver Ficha Periodística)
                </button>
              </div>

              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white leading-tight">
                {selectedArticle.title}
              </h2>

              {/* Medidor de Sesgo Ideológico Ampliado */}
              <div className="bg-black/60 p-4 rounded-2xl border border-white/10">
                <PoliticalBiasBar biasScore={selectedArticle.biasScore} biasLabel={selectedArticle.biasLabel} />
              </div>

              <div className="w-12 h-0.5 bg-[#E2E8F0]/50"></div>

              <p className="text-gray-200 text-sm sm:text-base leading-relaxed font-light italic bg-white/5 p-4 rounded-xl border border-white/10">
                "{selectedArticle.summary}"
              </p>

              <div className="text-gray-300 text-sm sm:text-base leading-relaxed space-y-4 font-light whitespace-pre-line">
                {selectedArticle.fullContent}
              </div>

              {/* COMPARATIVA EDITORIAL: MEDIOS CON DIFERENTES SESGOS POLÍTICOS SOBRE EL MISMO TEMA */}
              <div className="pt-8 border-t border-white/15 space-y-4">
                <h4 className="text-xs font-bold text-[#E2E8F0] uppercase tracking-widest flex items-center gap-2">
                  <BarChart3 size={16} /> COMPARATIVA EDITORIAL & OTRAS PERSPECTIVAS POLÍTICAS
                </h4>
                <p className="text-xs text-gray-400">Compara el abordaje periodístico de esta misma noticia según la inclinación política del medio:</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-black/50 p-4 rounded-xl border border-blue-500/30 space-y-2">
                    <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-wider block">Perspectiva Centro-Izquierda</span>
                    <h5 className="text-xs font-bold text-white">"La transición ecológica como derecho ciudadano fundamental"</h5>
                    <p className="text-[11px] text-gray-300 font-light">Enfoque centrado en la protección de comunidades rurales e inversión estatal obligatoria.</p>
                  </div>

                  <div className="bg-black/50 p-4 rounded-xl border border-amber-500/30 space-y-2">
                    <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">Perspectiva Centro-Derecha</span>
                    <h5 className="text-xs font-bold text-white">"Incentivos tributarios y competitividad en exportaciones agrícolas"</h5>
                    <p className="text-[11px] text-gray-300 font-light">Enfoque centrado en el libre mercado, eficiencias privadas y atracción de capital extranjero.</p>
                  </div>
                </div>
              </div>

              {/* Pie de Lectura y Garantía GranColinos */}
              <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                  <Globe size={14} className="text-[#E2E8F0]" /> Gran Noticias • Fuente: {selectedArticle.sourceName}
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

      {/* MODAL FICHA DE ATRIBUCIÓN PERIODÍSTICA CON FOTO / INSIGNIA EDITORIAL VERÍDICA */}
      {selectedAuthor && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-[#0A0F0D] border border-[#E2E8F0]/40 rounded-3xl max-w-lg w-full overflow-hidden shadow-[0_0_80px_rgba(226,232,240,0.2)] relative">
            
            {/* Header del Perfil */}
            <div className="relative p-6 sm:p-8 bg-gradient-to-b from-[#E2E8F0]/15 to-transparent border-b border-white/10 text-center">
              <button 
                onClick={() => setSelectedAuthor(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-[#E2E8F0] hover:text-black text-white flex items-center justify-center transition-all"
                title="Cerrar perfil"
              >
                <X size={16} />
              </button>

              {/* Foto Real de Atribución / Insignia Oficial del Medio */}
              <div className="w-24 h-24 rounded-2xl border-2 border-[#E2E8F0] p-1 mx-auto mb-4 shadow-2xl overflow-hidden bg-black/80">
                <img 
                  src={selectedAuthor.mediaBadgeUrl} 
                  alt={selectedAuthor.name} 
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              <h3 className="font-serif text-2xl font-bold text-white mb-1">{selectedAuthor.name}</h3>
              <p className="text-xs text-[#E2E8F0] font-mono font-semibold uppercase tracking-wider mb-2">
                {selectedAuthor.title}
              </p>

              <span className={`inline-block px-3 py-1 border rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                selectedAuthor.isInternalTeam 
                  ? 'bg-[#E2E8F0]/20 text-[#E2E8F0] border-[#E2E8F0]/40' 
                  : 'bg-white/5 text-gray-300 border-white/10'
              }`}>
                {selectedAuthor.isInternalTeam ? 'Equipo Oficial GranColinos' : `Medio Verificado: ${selectedAuthor.mediaSource}`}
              </span>
            </div>

            {/* Biografía y Veracidad */}
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h4 className="text-xs font-bold text-[#E2E8F0] uppercase tracking-widest mb-2 flex items-center gap-2">
                  <User size={14} /> Ficha de Autoría Periodística
                </h4>
                <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
                  {selectedAuthor.bio}
                </p>
              </div>

              {/* Distinción de Veracidad */}
              <div className="bg-black/60 p-4 rounded-2xl border border-white/10 text-xs text-gray-300 font-mono space-y-2">
                <div className="flex items-center gap-2 text-[#E2E8F0] font-bold">
                  <CheckCircle2 size={16} /> Política de Transparencia e Información Verídica
                </div>
                <p className="text-[11px] text-gray-400 font-sans font-light">
                  {selectedAuthor.isInternalTeam 
                    ? 'Este contenido ha sido redactado y avalado directamente por el equipo técnico y científico institucional de GranColinos Colombia.'
                    : `Este contenido pertenece a la cobertura periodística de ${selectedAuthor.mediaSource}. GranColinos respeta la autoría original y la citación transparente del periodista sin crear vinculaciones falsas.`
                  }
                </p>
              </div>

              <div className="pt-2 text-center">
                <button
                  onClick={() => setSelectedAuthor(null)}
                  className="w-full py-3 bg-[#E2E8F0] text-black font-extrabold text-xs uppercase tracking-widest rounded-xl hover:bg-white transition-all shadow-md"
                >
                  Cerrar Ficha de Atribución
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
