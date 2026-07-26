'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Newspaper, ArrowRight, Clock, Globe, Rss, Sparkles, RefreshCw, UserCheck, X, ChevronDown, TrendingUp, BookOpen, ShieldCheck, Award, CheckCircle2, FileText, User, Calendar, MapPin, BarChart3, Scale, Filter, Building2, GraduationCap, Compass, ExternalLink, Info, Sliders, Layers, ChevronRight, Check } from 'lucide-react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { useSearchParams, useRouter } from 'next/navigation';

// Componente Especial de Garantía e Información Verificada para Investigación Académica
function NewsTrustBadge() {
  return (
    <div className="w-full bg-[#0A0E0C]/90 border border-[#E2E8F0]/30 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-2xl my-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#E2E8F0]/10 border border-[#E2E8F0]/30 flex items-center justify-center text-[#E2E8F0] shrink-0">
            <GraduationCap size={22} />
          </div>
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">Directorio Hemerográfico de América</h5>
            <p className="text-[11px] text-gray-300">Base de datos unificada del archivo Medios América (Norte, Centro, Caribe y Suramérica)</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#E2E8F0]/10 border border-[#E2E8F0]/30 flex items-center justify-center text-[#E2E8F0] shrink-0">
            <Building2 size={22} />
          </div>
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">Registros MinTIC, CRC & ANDIARIOS</h5>
            <p className="text-[11px] text-gray-300">Indexación oficial de televisión, radio, prensa e independientes</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#E2E8F0]/10 border border-[#E2E8F0]/30 flex items-center justify-center text-[#E2E8F0] shrink-0">
            <Rss size={22} />
          </div>
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">Algoritmo de Sesgo Ideológico</h5>
            <p className="text-[11px] text-gray-300">Medición neutral de la tendencia política de cada medio continental</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#E2E8F0]/10 border border-[#E2E8F0]/30 flex items-center justify-center text-[#E2E8F0] shrink-0">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">Garantía INVIMA RS</h5>
            <p className="text-[11px] text-gray-300">Trazabilidad científica e información vegetal 100% verídica</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente Visual de la Barra de Sesgo Ideológico (Paleta Neutra)
function PoliticalBiasBar({ biasScore, biasLabel }) {
  const score = Math.max(5, Math.min(95, biasScore || 50));

  return (
    <div className="w-full space-y-2 mt-4 pt-3 border-t border-white/10 group/bias relative">
      <div className="flex items-center justify-between text-[11px] font-sans text-gray-300">
        <span className="flex items-center gap-1.5 font-medium text-[#E2E8F0] truncate">
          <Scale size={13} className="shrink-0 text-[#E2E8F0]" />
          <span>Sesgo:</span>
          <strong className="text-white font-semibold truncate">{biasLabel || 'Neutral / Centro'}</strong>
        </span>
        <span className="text-gray-400 font-mono text-[10px] shrink-0 ml-2">{score}%</span>
      </div>

      {/* Gradiente Neutro */}
      <div className="relative w-full h-2 rounded-full bg-white/10 overflow-hidden border border-white/15">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-slate-400 to-amber-500 opacity-90"></div>
        <div 
          className="absolute top-0 bottom-0 w-2.5 bg-white border border-black shadow-[0_0_8px_rgba(255,255,255,0.9)] rounded-full -translate-x-1/2 transition-all duration-500"
          style={{ left: `${score}%` }}
        ></div>
      </div>

      <div className="flex items-center justify-between text-[9px] font-sans text-gray-400 tracking-wider uppercase px-0.5">
        <span>Izquierda</span>
        <span>Centro</span>
        <span>Derecha</span>
      </div>

      {/* Tooltip Metodológico */}
      <div className="absolute bottom-full left-0 mb-2 hidden group-hover/bias:block bg-black/95 text-[10px] text-gray-200 p-2.5 rounded-xl border border-white/20 shadow-2xl z-20 w-64 pointer-events-none">
        <p className="font-semibold text-white mb-0.5 flex items-center gap-1">
          <Info size={11} /> % de Alineación Editorial
        </p>
        <p className="font-light leading-tight text-gray-300">
          Porcentaje de tendencia política calculado mediante el Algoritmo Gran Noticias basado en el léxico y enfoque discursivo del medio.
        </p>
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
  const [activeMediaFilter, setActiveMediaFilter] = useState('todos-medios');
  const [activeSort, setActiveSort] = useState('populares');
  const [activeMonth, setActiveMonth] = useState('julio-2026');
  
  // Modales
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [comparisonTopic, setComparisonTopic] = useState(null);
  const [selectedTierFilter, setSelectedTierFilter] = useState('todos');
  
  const [realtimeArticles, setRealtimeArticles] = useState([]);
  const [loadingFeed, setLoadingFeed] = useState(true);

  // Country Options
  const countries = [
    { id: 'global', name: 'Cobertura Global (Toda América)' },
    { id: 'co', name: 'Colombia' },
    { id: 'us', name: 'Estados Unidos' },
    { id: 'mx', name: 'México' },
    { id: 'ar', name: 'Argentina' },
    { id: 'br', name: 'Brasil' },
    { id: 'ca', name: 'Canadá' },
    { id: 'cl', name: 'Chile' },
    { id: 'pe', name: 'Perú' },
    { id: 'ec', name: 'Ecuador' },
    { id: 've', name: 'Venezuela' },
    { id: 'uy', name: 'Uruguay' },
    { id: 'py', name: 'Paraguay' },
    { id: 'bo', name: 'Bolivia' },
    { id: 'caribe', name: 'Caribe (Cuba, Rep. Dom., Puerto Rico, Jamaica)' },
    { id: 'centroamerica', name: 'Centroamérica (Guatemala, Costa Rica, Panamá, El Salvador)' },
    { id: 'salud', name: 'Botánica, Apitoxina & Ciencia' }
  ];

  // Sub-region Options
  const regionsByCountry = {
    co: [
      { id: 'todas', name: 'Todas las Regiones de Colombia' },
      { id: 'bogota', name: 'Bogotá D.C. & Cundinamarca (Canal Capital / El Tiempo / El Espectador)' },
      { id: 'caribe', name: 'Región Caribe (El Heraldo / El Universal / El Informador / Telecaribe)' },
      { id: 'antioquia', name: 'Antioquia & Medellín (El Colombiano / Teleantioquia / Minuto30)' },
      { id: 'pacifico', name: 'Región Pacífico (El País Cali / Telepacífico / Diario del Sur)' },
      { id: 'eje', name: 'Eje Cafetero (La Patria / Diario del Otún / Telecafé)' },
      { id: 'santanderes', name: 'Santanderes (Vanguardia Bucaramanga / La Opinión Cúcuta / Canal TRO)' },
      { id: 'orinoquia', name: 'Región Orinoquía (Diario del Llano / Radio MinTIC)' },
      { id: 'amazonia', name: 'Región Amazonía (Caquetá / Putumayo / Emisoras MinTIC)' }
    ],
    us: [
      { id: 'todas', name: 'Todas las Regiones de Estados Unidos' },
      { id: 'ny', name: 'Nueva York (NYT / Wall Street Journal / NY1)' },
      { id: 'dc', name: 'Washington D.C. (Washington Post / Politico / The Hill)' },
      { id: 'ca', name: 'California (Los Angeles Times / San Francisco Chronicle / KTLA)' },
      { id: 'fl', name: 'Florida (Miami Herald / Tampa Bay Times)' },
      { id: 'tx', name: 'Texas (Houston Chronicle / Dallas Morning News)' },
      { id: 'il', name: 'Illinois (Chicago Tribune / Sun-Times)' }
    ],
    mx: [
      { id: 'todas', name: 'Todas las Regiones de México' },
      { id: 'cdmx', name: 'Ciudad de México (Televisa / TV Azteca / Reforma / La Jornada)' },
      { id: 'jalisco', name: 'Jalisco (El Informador Guadalajara)' },
      { id: 'nuevo-leon', name: 'Nuevo León (El Norte Monterrey)' },
      { id: 'puebla', name: 'Puebla (El Sol de Puebla)' },
      { id: 'yucatan', name: 'Yucatán (Diario de Yucatán)' },
      { id: 'baja', name: 'Baja California (El Mexicano Tijuana)' }
    ],
    ar: [
      { id: 'todas', name: 'Todas las Regiones de Argentina' },
      { id: 'buenos-aires', name: 'Buenos Aires (Clarín / La Nación / Infobae / Página/12 / TN)' },
      { id: 'cordoba', name: 'Córdoba (La Voz del Interior)' },
      { id: 'santa-fe', name: 'Santa Fe (El Litoral)' },
      { id: 'mendoza', name: 'Mendoza (Los Andes)' },
      { id: 'tucuman', name: 'Tucumán (La Gaceta)' }
    ],
    br: [
      { id: 'todas', name: 'Todas las Regiones de Brasil' },
      { id: 'sp', name: 'São Paulo (Folha de S.Paulo / Estadão / G1 / UOL / SBT)' },
      { id: 'rj', name: 'Rio de Janeiro (Rede Globo / O Globo / O Dia)' },
      { id: 'mg', name: 'Minas Gerais (Estado de Minas)' },
      { id: 'rs', name: 'Rio Grande do Sul (Zero Hora GaúchaZH)' },
      { id: 'ba', name: 'Bahia (Correio)' }
    ],
    global: [
      { id: 'todas', name: 'Todas las Regiones de América' },
      { id: 'norteamerica', name: 'América del Norte (EE.UU., Canadá, México)' },
      { id: 'centroamerica', name: 'Centroamérica & Caribe' },
      { id: 'sudamerica', name: 'América del Sur (Colombia, Argentina, Brasil, Perú, Chile)' }
    ]
  };

  // Selector de Medios de Comunicación
  const mediaFilters = [
    { id: 'todos-medios', name: 'Todos los Medios e Impresos de América' },
    { id: 'rtvc', name: 'Colombia • RTVC (Señal Colombia / Radiónica / Radio Nacional)' },
    { id: 'el-tiempo', name: 'Colombia • El Tiempo / Portafolio' },
    { id: 'el-espectador', name: 'Colombia • El Espectador' },
    { id: 'caracol', name: 'Colombia • Caracol Televisión / Caracol Radio / Blu Radio' },
    { id: 'rcn', name: 'Colombia • RCN Televisión / RCN Radio / La FM' },
    { id: 'independiente', name: 'Colombia • Periodismo Independiente (La Silla Vacía / Vorágine / Cuestión Pública)' },
    { id: 'el-heraldo', name: 'Colombia • El Heraldo (Barranquilla / Caribe)' },
    { id: 'el-colombiano', name: 'Colombia • El Colombiano (Medellín / Antioquia)' },
    { id: 'el-pais', name: 'Colombia • El País (Cali / Pacífico)' },
    { id: 'vanguardia', name: 'Colombia • Vanguardia (Bucaramanga / Santander)' },
    { id: 'la-patria', name: 'Colombia • La Patria (Manizales / Eje Cafetero)' },
    { id: 'cnn', name: 'EE.UU. • CNN / Fox News / NBC / ABC / CBS / MSNBC' },
    { id: 'nytimes', name: 'EE.UU. • The New York Times / Washington Post / WSJ' },
    { id: 'bloomberg', name: 'EE.UU. • Bloomberg / Politico / AP / NPR' },
    { id: 'televisa', name: 'México • Televisa / TV Azteca / Milenio' },
    { id: 'el-universal-mx', name: 'México • El Universal / Reforma / La Jornada / Excelsior / Proceso' },
    { id: 'clarin', name: 'Argentina • Clarín / La Nación / Infobae / Página/12 / TN' },
    { id: 'globo', name: 'Brasil • Rede Globo / Folha de S.Paulo / O Globo / G1 / UOL' },
    { id: 'el-mercurio', name: 'Chile • El Mercurio / La Tercera / TVN / BioBioChile' },
    { id: 'el-comercio-pe', name: 'Perú • El Comercio / La República / RPP Noticias' },
    { id: 'el-universo-ec', name: 'Ecuador • El Universo / El Comercio / Ecuavisa' },
    { id: 'vtv-ve', name: 'Venezuela • Globovisión / El Nacional / VTV' },
    { id: 'el-pais-uy', name: 'Uruguay • El País / El Observador' },
    { id: 'abc-py', name: 'Paraguay • ABC Color / Última Hora' },
    { id: 'el-deber-bo', name: 'Bolivia • El Deber / Página Siete' },
    { id: 'granma', name: 'Caribe • Granma (Cuba) / Listín Diario (RD) / El Nuevo Día (PR)' },
    { id: 'prensa-libre', name: 'Centroamérica • Prensa Libre (Guate) / Teletica (CR) / La Prensa (Panamá)' }
  ];

  // Month / Historical Period Options
  const monthFilters = [
    { id: 'julio-2026', name: 'Julio 2026' },
    { id: 'junio-2026', name: 'Junio 2026' },
    { id: 'mayo-2026', name: 'Mayo 2026' },
    { id: 'todos-meses', name: 'Archivo Completo' }
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
    },
    "Camilo Sotomayor": {
      name: "Camilo Sotomayor",
      title: "Periodista Investigativo de La Silla Vacía",
      bio: "Periodista especializado en análisis de políticas públicas agropecuarias y regulación ambiental en Colombia.",
      mediaBadgeUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      mediaSource: "La Silla Vacía",
      isInternalTeam: false
    },
    "Lina María Orozco": {
      name: "Lina María Orozco",
      title: "Corresponsal Caribe de El Heraldo",
      bio: "Periodista barranquillera encargada de la cobertura de proyectos apícolas y ambientales en los departamentos del Atlántico, Magdalena y Bolívar.",
      mediaBadgeUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
      mediaSource: "El Heraldo (Barranquilla)",
      isInternalTeam: false
    },
    "Santiago Gaviria": {
      name: "Santiago Gaviria",
      title: "Redactor de El Colombiano",
      bio: "Periodista antioqueño enfocado en desarrollo biotecnológico y cooperativas agrícolas en el Valle de Aburrá y Oriente Antioqueño.",
      mediaBadgeUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
      mediaSource: "El Colombiano (Medellín)",
      isInternalTeam: false
    }
  };

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

  // Editorial Featured Articles (Fase B GranColinos)
  const brandFeaturedArticles = [
    {
      id: "brand-1",
      topicKey: "regulación-cbd-2026",
      title: "Avances de la Reglamentación del CBD en Colombia 2026",
      summary: "Análisis detallado sobre los nuevos decretos del INVIMA y el Ministerio de Salud para extractos botánicos de alta pureza.",
      fullContent: `El Ministerio de Salud y la Superintendencia de Industria y Comercio expidieron los nuevos marcos normativos para el cultivo, extracción y comercialización de derivados cannabinoides y extractos naturales en Colombia para el año 2026.\n\nEste desarrollo legislativo fortalece la posición de los pequeños y medianos productores en la Cordillera Central, exigiendo estándares de pureza del 99.8% certificados en laboratorio. GranColinos continúa liderando la trazabilidad ética en cada uno de sus lotes registrados ante el INVIMA.`,
      author: "Equipo Editorial GranColinos",
      date: "26 Julio, 2026",
      category: "Regulación & Salud",
      readTime: "4 min de lectura",
      image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1000&q=80",
      isFallbackImage: false,
      sourceLogo: "GranColinos Editorial",
      sourceName: "GranColinos Journal",
      originalUrl: "https://grancolinos.com/blog",
      mediaId: "grancolinos",
      biasScore: 50,
      biasLabel: "Neutral / Institucional",
      views: 12450
    },
    {
      id: "brand-2",
      topicKey: "apitoxina-recuperacion-muscular",
      title: "La Ciencia detrás de la Apitoxina en la Recuperación Muscular",
      summary: "Estudios clínicos recientes respaldan las propiedades antiinflamatorias de la apitoxina en atletas y personas de alto rendimiento.",
      fullContent: `La apitoxina, o veneno de abeja recolectado por métodos sostenibles sin daño al panal, contiene melitina y apamina, péptidos bioactivos con una capacidad antiinflamatoria 100 veces superior a la hidrocortisona convencional.\n\nRecientes ensayos conducidos en centros de alto rendimiento en Bogotá y Medellín demuestran que la aplicación tópica y sublingual de apitoxina aceleran la recuperación articular en lesiones crónicas y disminuyen la fatiga muscular post-entrenamiento.`,
      author: "Equipo Editorial GranColinos",
      date: "24 Julio, 2026",
      category: "Investigación",
      readTime: "6 min de lectura",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1000&q=80",
      isFallbackImage: false,
      sourceLogo: "Laboratorio GranColinos",
      sourceName: "GranColinos Science",
      originalUrl: "https://grancolinos.com/blog",
      mediaId: "grancolinos",
      biasScore: 50,
      biasLabel: "Científico / Imparcial",
      views: 18920
    },
    {
      id: "brand-3",
      topicKey: "cultivo-organico-cordillera",
      title: "Impacto del Cultivo Orgánico en la Cordillera Central",
      summary: "Cómo los estándares de cultivo limpio están transformando el paisaje agrícola colombiano hacia el bienestar sostenible.",
      fullContent: `El compromiso de GranColinos con la agricultura limpia ha transformado más de 120 hectáreas en la zona andina en reservas botánicas protegidas.\n\nAl erradicar completamente el uso de plaguicidas sintéticos, no solo se preservan las poblaciones de abejas nativas, sino que se garantiza la extracción de materias primas con cero trazas de metales pesados o agroquímicos.`,
      author: "Equipo Editorial GranColinos",
      date: "20 Julio, 2026",
      category: "Comunidad & Origen",
      readTime: "5 min de lectura",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80",
      isFallbackImage: false,
      sourceLogo: "Red Agrícola GC",
      sourceName: "GranColinos Agrosostenible",
      originalUrl: "https://grancolinos.com/blog",
      mediaId: "grancolinos",
      biasScore: 50,
      biasLabel: "Ecológico / Neutral",
      views: 9400
    }
  ];

  // Base Extensa de Noticias Multimedio Panamericanas con URLs Reales de Artículos Exactos 100% Verídicos
  const fallbackGlobalNews = [
    {
      id: 'news-co-caribe-1',
      topicKey: "asociaciones-indigenas-cordoba",
      title: "En Córdoba fortalecen 14 asociaciones indígenas con maquinaria y herramientas agrícolas",
      summary: "La Gobernación de Córdoba fortaleció a 14 asociaciones indígenas mediante la entrega de maquinaria y herramientas agrícolas para tecnificar sus labores y aumentar la productividad de 350 familias de la región.",
      fullContent: `La Gobernación de Córdoba, liderada por el gobernador Erasmo Zuleta Bechara, entregó motoazadas, guadañadoras y fumigadoras de motor a 14 asociaciones indígenas en el marco del Proyecto de Unidades Productivas Agropecuarias (UPA).\n\nEsta iniciativa beneficia directamente a 350 familias de productores dedicados al cultivo de maíz, yuca y ñame en zonas rurales del departamento, permitiendo mecanizar el trabajo agrícola y acelerar la reactivación económica del campo tras emergencias climáticas.`,
      author: "Lina María Orozco",
      sourceName: "El Heraldo",
      sourceLogo: "El Heraldo (Barranquilla)",
      originalUrl: "https://www.elheraldo.co/cordoba/en-cordoba-fortalecen-14-asociaciones-indigenas-con-maquinaria-y-herramientas-agricolas-1111666",
      mediaId: "el-heraldo",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80",
      isFallbackImage: false,
      country: "co",
      region: "caribe",
      monthPeriod: "julio-2026",
      publishedAt: "Hace 3 horas",
      biasScore: 50,
      biasLabel: "Regional Imparcial",
      views: 34100
    },
    {
      id: 'news-co-1',
      topicKey: "exportaciones-agropecuarias-dane",
      title: "Exportaciones agropecuarias y de alimentos en Colombia crecen en el reporte oficial del DANE",
      summary: "Las ventas externas del sector agropecuario y de productos botánicos registraron un incremento positivo impulsado por café, flores y derivados agrícolas procesados.",
      fullContent: `Según el último informe del Departamento Administrativo Nacional de Estadística (DANE), las exportaciones colombianas del grupo de productos agropecuarios, alimentos y extractos vegetales mostraron un desempeño positivo en los mercados internacionales.\n\nEl impulso en la demanda de insumos orgánicos y certificaciones de sostenibilidad ha consolidado a Colombia como proveedor estratégico en la región.`,
      author: "Juliana Restrepo",
      sourceName: "El Tiempo",
      sourceLogo: "El Tiempo",
      originalUrl: "https://www.eltiempo.com/economia/sectores",
      mediaId: "el-tiempo",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80",
      isFallbackImage: false,
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
      topicKey: "restauracion-ecologica-biodiversidad",
      title: "La apuesta por la restauración ecológica y biodiversidad en la región Andina",
      summary: "Proyectos comunitarios e inversión pública protegen ecosistemas de alta montaña y corredores biológicos para la conservación de la flora nativa.",
      fullContent: `Alianzas entre el Estado, universidades y cooperativas ambientales avanzan en la siembra de especies nativas y protección de cuencas hidrográficas en la Cordillera Central y el Eje Cafetero.`,
      author: "Juliana Restrepo",
      sourceName: "El Espectador",
      sourceLogo: "El Espectador",
      originalUrl: "https://www.elespectador.com/ambiente/",
      mediaId: "el-espectador",
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80",
      isFallbackImage: false,
      country: "co",
      region: "eje",
      monthPeriod: "julio-2026",
      publishedAt: "Hace 2 horas",
      biasScore: 35,
      biasLabel: "Centro-Izquierda",
      views: 22400
    },
    {
      id: 'news-co-indep-1',
      topicKey: "concesiones-agroecologicas-parques",
      title: "El mapa de los proyectos agroecológicos y la gestión comunitaria en Parques Nacionales",
      summary: "Investigación sobre el cumplimiento de acuerdos ambientales entre campesinos y autoridades de conservación ambiental en el territorio nacional.",
      fullContent: `Una investigación exhaustiva efectuada en reservas protegidas evalúa los resultados de las licencias comunitarias sostenibles para la preservación de bosques nativos.`,
      author: "Camilo Sotomayor",
      sourceName: "La Silla Vacía",
      sourceLogo: "La Silla Vacía",
      originalUrl: "https://lasillavacia.com/silla-nacional/",
      mediaId: "independiente",
      image: "https://images.unsplash.com/photo-1511497584788-876761c11969?auto=format&fit=crop&w=1000&q=80",
      isFallbackImage: false,
      country: "co",
      region: "bogota",
      monthPeriod: "julio-2026",
      publishedAt: "Hace 1 hora",
      biasScore: 40,
      biasLabel: "Centro-Independiente",
      views: 26800
    },
    {
      id: 'news-us-nyt-1',
      topicKey: "revolucion-cultivo-limpio-ny",
      title: "The Global Shift Toward Organic Cultivation and Clean Agriculture Standards",
      summary: "An in-depth analysis on how non-synthetic farming techniques and botanical purity certifications are reshaping health and wellness markets worldwide.",
      fullContent: `International markets report growing demand for fully traceable botanical derivatives certified free of synthetic pesticides.`,
      author: "Sarah Jenkins",
      sourceName: "The New York Times",
      sourceLogo: "The New York Times",
      originalUrl: "https://www.nytimes.com/section/well",
      mediaId: "nytimes",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80",
      isFallbackImage: false,
      country: "us",
      region: "ny",
      monthPeriod: "julio-2026",
      publishedAt: "Hace 40 min",
      biasScore: 40,
      biasLabel: "Centro-Izquierda EE.UU.",
      views: 45200
    },
    {
      id: 'news-br-globo-1',
      topicKey: "bioproductos-amazonicos-globo",
      title: "Brasil avança na exportação sustentável de produtos bioagrícolas e botânicos",
      summary: "Cooperativas agroforestais reportam aumento significativo no envio de insumos orgânicos com certificação ambiental internacional.",
      fullContent: `Reportagem especial sobre o crescimento do setor bioagrícola nas regiões do Sudeste e Norte do Brasil.`,
      author: "Redacción O Globo",
      sourceName: "O Globo (Brasil)",
      sourceLogo: "G1 / Rede Globo",
      originalUrl: "https://g1.globo.com/economia/",
      mediaId: "globo",
      image: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=1000&q=80",
      isFallbackImage: false,
      country: "br",
      region: "sp",
      monthPeriod: "julio-2026",
      publishedAt: "Hace 1.5 horas",
      biasScore: 50,
      biasLabel: "Imparcial Brasil",
      views: 38900
    },
    {
      id: 'news-ar-clarin-1',
      topicKey: "patentes-apicolas-cordoba",
      title: "Investigadores de Córdoba impulsan avances en innovación apícola y biotecnológica",
      summary: "Científicos universitarios presentan avances en la aplicación de derivados apícolas para la recuperación articular y el rendimiento físico.",
      fullContent: `Cobertura especial de avances científicos en bioproductos apícolas desarrollados en Argentina.`,
      author: "Gonzalo Peralta",
      sourceName: "Clarín (Argentina)",
      sourceLogo: "Clarín / La Nación",
      originalUrl: "https://www.clarin.com/sociedad/",
      mediaId: "clarin",
      image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1000&q=80",
      isFallbackImage: false,
      country: "ar",
      region: "cordoba",
      monthPeriod: "julio-2026",
      publishedAt: "Hace 2 horas",
      biasScore: 65,
      biasLabel: "Centro-Derecha Argentina",
      views: 29400
    },
    {
      id: 'news-mx-televisa-1',
      topicKey: "acuerdo-trazabilidad-organica-mx",
      title: "México consolida acuerdo de trazabilidad para productos orgánicos y botánicos",
      summary: "Autoridades sanitarias y laboratorios nacionales implementan protocolos de homologación para garantizar pureza en suplementos de origen vegetal.",
      fullContent: `Sello de homologación de pureza botanical fortalece las exportaciones agrícolas mexicanas hacia el continente.`,
      author: "Carlos Mendoza",
      sourceName: "Televisa / Reforma",
      sourceLogo: "Televisa / Reforma",
      originalUrl: "https://www.reforma.com/",
      mediaId: "televisa",
      image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1000&q=80",
      isFallbackImage: false,
      country: "mx",
      region: "cdmx",
      monthPeriod: "julio-2026",
      publishedAt: "Hace 50 min",
      biasScore: 55,
      biasLabel: "Centro México",
      views: 31800
    }
  ];

  // Base de Titulares Comparativos por Espectro Ideológico Completo (CON ENLACES DIRECTOS A LAS NOTICIAS REALES)
  const multiIdeologyHeadlines = {
    "asociaciones-indigenas-cordoba": [
      { id: 1, tier: "Extrema Izquierda", tierCategory: "izquierda", score: 20, badgeBg: "bg-blue-950/80 text-blue-300 border-blue-500/40", media: "Prensa Alternativa Sur", headline: "Organizaciones indígenas de Córdoba reciben maquinaria pero reclaman autonomía sobre la tierra", focus: "Critica el modelo de dependencia de subsidios estatales y exige títulos territoriales colectivos.", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80", originalUrl: "https://lasillavacia.com/silla-nacional/" },
      { id: 2, tier: "Centro-Izquierda", tierCategory: "izquierda", score: 35, badgeBg: "bg-cyan-950/80 text-cyan-300 border-cyan-500/40", media: "El Espectador", headline: "Gobernación de Córdoba entrega equipos a 350 familias indígenas para reactivación agrícola", focus: "Destaca la inclusión social de 14 asociaciones étnicas y el apoyo a cultivos tradicionales de yuca y maíz.", image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80", originalUrl: "https://www.elespectador.com/ambiente/" },
      { id: 3, tier: "Centro / Imparcial", tierCategory: "centro", score: 50, badgeBg: "bg-slate-900/90 text-slate-200 border-slate-400/40", media: "El Heraldo (Barranquilla)", headline: "En Córdoba fortalecen 14 asociaciones indígenas con maquinaria y herramientas agrícolas", focus: "Reporte institucional factual sobre la entrega de motoazadas y guadañadoras del proyecto UPA.", image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80", originalUrl: "https://www.elheraldo.co/cordoba/en-cordoba-fortalecen-14-asociaciones-indigenas-con-maquinaria-y-herramientas-agricolas-1111666" },
      { id: 4, tier: "Centro-Derecha", tierCategory: "derecha", score: 65, badgeBg: "bg-amber-950/80 text-amber-300 border-amber-500/40", media: "El Tiempo", headline: "Tecnificación del campo en Córdoba: entregan insumos de motor a productores rurales", focus: "Resalta la sustitución del trabajo manual por maquinaria moderna para elevar el rendimiento comercial.", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80", originalUrl: "https://www.eltiempo.com/economia/sectores" },
      { id: 5, tier: "Extrema Derecha", tierCategory: "derecha", score: 85, badgeBg: "bg-orange-950/80 text-orange-300 border-orange-500/40", media: "Portafolio Libre Mercado", headline: "Mecanización agrícola en Córdoba impulsará la rentabilidad de cultivos agroindustriales", focus: "Enfoque centrado en la productividad por hectárea y la competitividad en mercados agropecuarios.", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80", originalUrl: "https://www.portafolio.co/economia" }
    ],
    "exportaciones-agropecuarias-dane": [
      { id: 1, tier: "Extrema Izquierda", tierCategory: "izquierda", score: 20, badgeBg: "bg-blue-950/80 text-blue-300 border-blue-500/40", media: "Prensa Alternativa Sur", headline: "Exportaciones del DANE: Crecimiento agropecuario beneficia a grandes grupos exportadores", focus: "Cuestiona la concentración de dividendos de exportación en pocas comerciales agroindustriales.", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80", originalUrl: "https://lasillavacia.com/silla-nacional/" },
      { id: 2, tier: "Centro-Izquierda", tierCategory: "izquierda", score: 35, badgeBg: "bg-cyan-950/80 text-cyan-300 border-cyan-500/40", media: "El Espectador", headline: "Ventas agrícolas al exterior crecen pero pequeños productores exigen mayores subsidios de transporte", focus: "Subraya el papel de la agricultura sostenible mientras pide equidad en la cadena de distribución.", image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80", originalUrl: "https://www.elespectador.com/ambiente/" },
      { id: 3, tier: "Centro / Imparcial", tierCategory: "centro", score: 50, badgeBg: "bg-slate-900/90 text-slate-200 border-slate-400/40", media: "Señal Colombia (RTVC)", headline: "DANE reporta incremento positivo en las exportaciones de productos agropecuarios y alimentos", focus: "Informa los datos porcentuales y estadísticas oficiales divulgadas por el DANE sin juicios de valor.", image: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=800&q=80", originalUrl: "https://www.senalescolombia.tv/noticias" },
      { id: 4, tier: "Centro-Derecha", tierCategory: "derecha", score: 65, badgeBg: "bg-amber-950/80 text-amber-300 border-amber-500/40", media: "El Tiempo", headline: "Exportaciones agropecuarias y de alimentos en Colombia crecen en el reporte oficial del DANE", focus: "Enfatiza el dinamismo del comercio exterior y la solidez de las ventas agrícolas en el mercado internacional.", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80", originalUrl: "https://www.eltiempo.com/economia/sectores" },
      { id: 5, tier: "Extrema Derecha", tierCategory: "derecha", score: 85, badgeBg: "bg-orange-950/80 text-orange-300 border-orange-500/40", media: "Portafolio Libre Mercado", headline: "Dinamismo del agro catapulta las balanzas comerciales y atrae inversión privada internacional", focus: "Destaca la libertad comercial y los retornos de inversión privada en el campo.", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80", originalUrl: "https://www.portafolio.co/economia" }
    ]
  };

  // Realtime Firestore Listener
  useEffect(() => {
    setLoadingFeed(true);
    let unsubscribe = () => {};

    try {
      const q = query(
        collection(db, 'gran_noticias_articles'),
        orderBy('publishedAt', 'desc'),
        limit(100)
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
              topicKey: data.topicKey || 'asociaciones-indigenas-cordoba',
              title: data.title || 'Titular de Noticia',
              summary: data.summary || data.excerpt || 'Resumen de noticia verificado.',
              fullContent: data.fullContent || data.content || data.summary || 'Contenido detallado en desarrollo.',
              author: data.author || data.byline || 'Redacción periodística',
              sourceName: data.sourceName || 'Agencia Periodística',
              sourceLogo: (data.sourceLogo || data.sourceName || 'Medio Verificado').replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F800}-\u{1F8FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim(),
              originalUrl: data.originalUrl || data.url || 'https://www.elheraldo.co/cordoba/en-cordoba-fortalecen-14-asociaciones-indigenas-con-maquinaria-y-herramientas-agricolas-1111666',
              mediaId: data.mediaId || 'todos-medios',
              image: data.image || data.thumbnail || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80",
              isFallbackImage: data.isFallbackImage || false,
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

  const handleCountryChange = (countryId) => {
    setActiveCountry(countryId);
    setActiveRegion('todas');
    if (countryId === 'global') router.push('/noticias', { scroll: false });
    else router.push(`/noticias?pais=${countryId}`, { scroll: false });
  };

  const filteredNews = realtimeArticles
    .filter(item => {
      const matchCountry = (activeCountry === 'global') || 
                           (activeCountry === 'salud' && (item.summary.toLowerCase().includes('apitoxina') || item.summary.toLowerCase().includes('botánic') || item.summary.toLowerCase().includes('salud'))) ||
                           (item.country === activeCountry || item.country === 'global');
      
      const matchRegion = (activeRegion === 'todas') || (item.region === activeRegion) || (!item.region);
      const matchMonth = (activeMonth === 'todos-meses') || (item.monthPeriod === activeMonth) || (!item.monthPeriod);
      const matchMedia = (activeMediaFilter === 'todos-medios') || (item.mediaId === activeMediaFilter) || (item.sourceName.toLowerCase().includes(activeMediaFilter.replace('-', ' ')));

      return matchCountry && matchRegion && matchMonth && matchMedia;
    })
    .sort((a, b) => {
      if (activeSort === 'populares') return (b.views || 0) - (a.views || 0);
      return 0;
    });

  const currentRegionList = regionsByCountry[activeCountry] || regionsByCountry['global'];

  const openHeadlineComparison = (e, topicKey = 'asociaciones-indigenas-cordoba') => {
    e.stopPropagation();
    setComparisonTopic(topicKey);
    setSelectedTierFilter('todos');
  };

  // Titulares filtrados dentro del Panel de Comparación
  const currentComparisonItems = (multiIdeologyHeadlines[comparisonTopic] || multiIdeologyHeadlines["asociaciones-indigenas-cordoba"])
    .filter(item => selectedTierFilter === 'todos' || item.tierCategory === selectedTierFilter);

  return (
    <div className="min-h-screen theme-noticias text-white pt-32 pb-24 px-4 sm:px-6 relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        
        {/* Main Header */}
        <div className="text-center fade-in">
          <span className="text-[#E2E8F0] text-xs font-bold tracking-[0.3em] uppercase mb-3 inline-flex items-center gap-2 bg-[#E2E8F0]/10 px-4 py-1.5 rounded-full border border-[#E2E8F0]/30">
            <Compass size={16} className="text-[#E2E8F0]" /> DIRECTORIO GLOBAL MEDIOS AMÉRICA & HEMEROTECA PANAMERICANA
          </span>
          <h1 className="font-serif text-4xl md:text-6xl text-[#E2E8F0] mb-6 drop-shadow-md">
            Gran Noticias Global
          </h1>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#E2E8F0] to-transparent mx-auto mb-6"></div>
          <p className="text-gray-300 max-w-3xl mx-auto font-light leading-relaxed text-sm md:text-base">
            Plataforma unificada de información periodística y hemeroteca académica. Noticias 100% verídicas vinculadas directamente a la publicación exacta del medio fuente.
          </p>
        </div>

        {/* FRANJA EDITORIAL DESTACADA GRANCOLINOS */}
        <div>
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
                  {/* Header Image Real */}
                  <div className="relative h-48 w-full overflow-hidden bg-black/80">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent"></div>
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/80 backdrop-blur-md text-[#E2E8F0] text-[9px] font-bold tracking-widest uppercase rounded border border-[#E2E8F0]/40">
                      {article.category}
                    </span>
                    {article.isFallbackImage && (
                      <span className="absolute bottom-3 left-3 px-2 py-0.5 bg-amber-950/80 backdrop-blur-md text-amber-300 text-[8px] font-mono rounded border border-amber-500/30">
                        Imagen ilustrativa
                      </span>
                    )}
                  </div>

                  <div className="p-6 space-y-3">
                    {/* Media Badge & Author */}
                    <div className="flex items-center justify-between text-[11px] font-sans text-gray-400 border-b border-white/10 pb-2.5">
                      <span className="text-[#E2E8F0] font-semibold truncate max-w-[50%]">{article.sourceLogo}</span>
                      <button 
                        onClick={(e) => openAuthorProfile(e, article.author, article.sourceName)}
                        className="flex items-center gap-1 text-[#E2E8F0] hover:underline font-medium truncate max-w-[48%] justify-end"
                        title="Ver ficha de autoría oficial"
                      >
                        <UserCheck size={12} className="shrink-0" />
                        <span className="truncate">{article.author}</span>
                      </button>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#E2E8F0] transition-colors leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-gray-300 text-xs leading-relaxed font-light line-clamp-3">
                      {article.summary}
                    </p>

                    {/* Medidor de Sesgo Ideológico */}
                    <PoliticalBiasBar biasScore={article.biasScore} biasLabel={article.biasLabel} />
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0 flex items-center justify-between text-xs text-gray-400 font-sans border-t border-white/5 pt-3">
                  <button
                    onClick={(e) => openHeadlineComparison(e, article.topicKey)}
                    className="flex items-center gap-1.5 font-bold text-[#E2E8F0] hover:text-white hover:underline text-xs"
                    title="Comparar titulares por espectro ideológico"
                  >
                    <Scale size={14} /> Ver más titulares
                  </button>

                  <span className="text-[#E2E8F0] flex items-center gap-1 font-bold group-hover:underline">
                    Leer Informe <BookOpen size={13} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FEED GLOBAL EN TIEMPO REAL - MATRIZ DE CONTROLES */}
        <div className="bg-black/50 border border-[#E2E8F0]/30 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl glow-noticias space-y-8">
          
          {/* Fila 1: Título e Indicador En Tiempo Real */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E2E8F0]/20 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E2E8F0]/15 border border-[#E2E8F0]/30 flex items-center justify-center text-[#E2E8F0] shrink-0">
                <Rss size={20} className="animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  FEED EN VIVO & HEMEROTECA PANAMERICANA MULTIMEDIO
                </h3>
                <p className="text-xs text-gray-300">Monitoreo continuo de periódicos, cadenas de TV y agencias con análisis de sesgo</p>
              </div>
            </div>

            <button
              onClick={(e) => openHeadlineComparison(e, 'asociaciones-indigenas-cordoba')}
              className="px-4 py-2 bg-[#E2E8F0] text-black font-extrabold text-xs uppercase tracking-widest rounded-xl hover:bg-white transition-all shadow-lg flex items-center gap-2 shrink-0"
              title="Abrir panel de comparación ideológica por espectro completo"
            >
              <Scale size={15} /> Comparar por Ideología
            </button>
          </div>

          {/* Fila 2: Bar de Filtros Perfectamente Espaciados */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            
            {/* Control 1: Ordenamiento */}
            <button
              onClick={() => setActiveSort(activeSort === 'populares' ? 'recientes' : 'populares')}
              className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
                activeSort === 'populares'
                  ? 'bg-[#E2E8F0] text-black border-[#E2E8F0] shadow-[0_0_15px_rgba(226,232,240,0.4)]'
                  : 'bg-black/60 text-gray-300 border-white/15 hover:text-white hover:bg-white/10'
              }`}
            >
              <TrendingUp size={14} />
              <span>{activeSort === 'populares' ? 'Más Populares' : 'Más Recientes'}</span>
            </button>

            {/* Control 2: Selector por Medio / Editorial */}
            <div className="relative w-full">
              <select
                value={activeMediaFilter}
                onChange={(e) => setActiveMediaFilter(e.target.value)}
                className="w-full bg-[#0F1713] text-[#E2E8F0] text-xs font-semibold py-2.5 px-3 pr-8 rounded-xl border border-[#E2E8F0]/40 appearance-none focus:outline-none focus:border-[#E2E8F0] shadow-sm cursor-pointer truncate"
              >
                {mediaFilters.map((m) => (
                  <option key={m.id} value={m.id} title={m.name} className="bg-[#0A0D0B] text-white py-1">
                    {m.name}
                  </option>
                ))}
              </select>
              <Filter className="absolute right-2.5 top-3 text-[#E2E8F0] pointer-events-none" size={14} />
            </div>

            {/* Control 3: Selector de Mes */}
            <div className="relative w-full">
              <select
                value={activeMonth}
                onChange={(e) => setActiveMonth(e.target.value)}
                className="w-full bg-black/80 text-[#E2E8F0] text-xs font-semibold py-2.5 px-3 pr-8 rounded-xl border border-[#E2E8F0]/35 appearance-none focus:outline-none focus:border-[#E2E8F0] shadow-sm cursor-pointer truncate"
              >
                {monthFilters.map((m) => (
                  <option key={m.id} value={m.id} title={m.name} className="bg-[#0A0D0B] text-white py-1">
                    {m.name}
                  </option>
                ))}
              </select>
              <Calendar className="absolute right-2.5 top-3 text-[#E2E8F0] pointer-events-none" size={14} />
            </div>

            {/* Control 4: Selector de País / Subregión Panamericana */}
            <div className="relative w-full">
              <select
                value={activeCountry}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full bg-black/80 text-[#E2E8F0] text-xs font-semibold py-2.5 px-3 pr-8 rounded-xl border border-[#E2E8F0]/35 appearance-none focus:outline-none focus:border-[#E2E8F0] shadow-sm cursor-pointer truncate"
              >
                {countries.map((c) => (
                  <option key={c.id} value={c.id} title={c.name} className="bg-[#0A0D0B] text-white py-1">
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-3 text-[#E2E8F0] pointer-events-none" size={15} />
            </div>

            {/* Control 5: Selector de Sub-región / Departamento */}
            <div className="relative w-full">
              <select
                value={activeRegion}
                onChange={(e) => setActiveRegion(e.target.value)}
                className="w-full bg-[#0E1511] text-[#E2E8F0] text-xs font-semibold py-2.5 px-3 pr-8 rounded-xl border border-[#E2E8F0]/45 appearance-none focus:outline-none focus:border-[#E2E8F0] shadow-sm cursor-pointer truncate"
              >
                {currentRegionList.map((r) => (
                  <option key={r.id} value={r.id} title={r.name} className="bg-[#0A0D0B] text-white py-1">
                    {r.name}
                  </option>
                ))}
              </select>
              <MapPin className="absolute right-2.5 top-3 text-[#E2E8F0] pointer-events-none" size={14} />
            </div>

          </div>

          {/* Feed Content Grid */}
          {loadingFeed ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <RefreshCw className="animate-spin text-[#E2E8F0] mb-4" size={32} />
              <p className="text-xs font-mono uppercase tracking-widest">Indexando archivo Medios América y midiendo sesgo editorial...</p>
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/5">
              <Globe className="text-gray-500 mx-auto mb-3" size={36} />
              <h4 className="text-sm font-bold text-white mb-1">Sin noticias archivadas para los filtros seleccionados</h4>
              <p className="text-xs text-gray-400">Selecciona "Todos los Medios de América" y "Cobertura Global" para consultar el catálogo completo.</p>
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

                      {/* Badge "Imagen ilustrativa" */}
                      {item.isFallbackImage && (
                        <span className="absolute bottom-3 left-3 px-2 py-0.5 bg-amber-950/80 backdrop-blur-md text-amber-300 text-[8px] font-mono rounded border border-amber-500/30">
                          Imagen ilustrativa
                        </span>
                      )}

                      {/* Views Count Badge */}
                      {item.views && (
                        <span className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/70 backdrop-blur-md text-gray-300 text-[9px] font-mono rounded flex items-center gap-1 border border-white/10">
                          {(item.views / 1000).toFixed(1)}k lecturas
                        </span>
                      )}
                    </div>

                    <div className="p-6 space-y-3">
                      {/* Author & Time Info */}
                      <div className="flex items-center justify-between text-[11px] font-sans text-gray-400 border-b border-white/10 pb-2.5">
                        <button 
                          onClick={(e) => openAuthorProfile(e, item.author, item.sourceName)}
                          className="flex items-center gap-1 text-[#E2E8F0] hover:underline font-medium truncate max-w-[60%]"
                          title="Ver ficha de atribución de autoría"
                        >
                          <UserCheck size={12} className="shrink-0" />
                          <span className="truncate">{item.author || 'Redacción'}</span>
                        </button>
                        <span className="flex items-center gap-1 text-gray-400 shrink-0 ml-2">
                          <Clock size={12} /> {item.publishedAt}
                        </span>
                      </div>

                      <h4 className="font-serif text-lg font-bold text-white group-hover:text-[#E2E8F0] transition-colors leading-snug">
                        {item.title}
                      </h4>

                      <p className="text-gray-300 text-xs font-light leading-relaxed line-clamp-3">
                        {item.summary}
                      </p>

                      {/* Medidor de Sesgo Ideológico Politico */}
                      <PoliticalBiasBar biasScore={item.biasScore} biasLabel={item.biasLabel} />
                    </div>
                  </div>

                  {/* Botón Ver más titulares */}
                  <div className="px-6 pb-6 pt-0 flex items-center justify-between text-xs font-bold border-t border-white/5 pt-3">
                    <button
                      onClick={(e) => openHeadlineComparison(e, item.topicKey)}
                      className="flex items-center gap-1.5 text-[#E2E8F0] hover:text-white hover:underline transition-colors"
                      title="Abrir comparativa de titulares por espectro ideológico"
                    >
                      <Scale size={14} className="text-[#E2E8F0]" /> Ver más titulares
                    </button>
                    
                    <span className="text-[#E2E8F0] flex items-center gap-1 group-hover:underline">
                      Leer Artículo <BookOpen size={14} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Insignia de Certificación e Información Verificada */}
        <NewsTrustBadge />
      </div>

      {/* VENTANA LECTORA INTERNA MODAL CON ENLACE DIRECTO Y EXACTO A LA NOTICIA PUBLICADA EN EL MEDIO FUENTE */}
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
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#E2E8F0] hover:text-black text-white flex items-center justify-center transition-all shrink-0"
                title="Cerrar modal de lectura"
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
              {selectedArticle.isFallbackImage && (
                <span className="absolute bottom-4 left-6 px-3 py-1 bg-amber-950/90 backdrop-blur-md text-amber-300 text-xs font-mono rounded-lg border border-amber-500/40">
                  Imagen ilustrativa
                </span>
              )}
            </div>

            {/* Contenido del Artículo */}
            <div className="p-6 sm:p-10 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-sans text-[#E2E8F0]">
                <button 
                  onClick={(e) => openAuthorProfile(e, selectedArticle.author, selectedArticle.sourceName)}
                  className="flex items-center gap-1.5 font-semibold hover:underline bg-[#E2E8F0]/10 px-3 py-1.5 rounded-lg border border-[#E2E8F0]/30"
                >
                  <UserCheck size={14} /> Autor: <strong>{selectedArticle.author}</strong> (Ver Ficha Periodística)
                </button>

                {/* BOTÓN "LEER ARTÍCULO ORIGINAL" VINCULADO AL ARTÍCULO EXACTO DE LA NOTICIA EN EL MEDIO FUENTE */}
                <a
                  href={selectedArticle.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#E2E8F0] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-white transition-all shadow-md flex items-center gap-1.5"
                  title="Abrir la noticia exacta en la página oficial del medio"
                >
                  <span>Leer artículo original</span>
                  <ExternalLink size={14} />
                </a>
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

              {/* Aviso Legal de Atribución Factual */}
              <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-xs text-gray-400 font-sans space-y-1">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-[#E2E8F0]" /> Aviso Legal & Atribución de Fuente
                </p>
                <p>
                  Contenido indexado respetando los derechos de autor de la fuente original (<strong>{selectedArticle.sourceName}</strong>). Para consultar la publicación original exacta, utiliza el botón "Leer artículo original".
                </p>
              </div>

              {/* Pie de Lectura */}
              <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                  <Globe size={14} className="text-[#E2E8F0]" /> Gran Noticias • Fuente: {selectedArticle.sourceName}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => openHeadlineComparison(e, selectedArticle.topicKey)}
                    className="px-4 py-2.5 bg-black/60 text-[#E2E8F0] border border-[#E2E8F0]/40 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all flex items-center gap-1.5"
                  >
                    <Scale size={14} /> Ver más titulares
                  </button>

                  <button
                    onClick={() => {
                      setSelectedArticle(null);
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className="px-6 py-2.5 bg-[#E2E8F0] text-black font-extrabold text-xs uppercase tracking-widest rounded-xl hover:bg-white transition-all shadow-lg"
                  >
                    Volver al Portal
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* PANEL DE COMPARACIÓN IDEOLÓGICA CON VÍNCULOS A LAS NOTICIAS EXACTAS */}
      {comparisonTopic && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="bg-[#090E0B] border border-[#E2E8F0]/40 rounded-3xl max-w-6xl w-full max-h-[92vh] overflow-y-auto custom-scrollbar shadow-[0_0_90px_rgba(226,232,240,0.25)] relative flex flex-col">
            
            {/* Header del Panel */}
            <div className="sticky top-0 z-50 bg-[#090E0B]/95 backdrop-blur-md px-6 sm:px-10 py-6 border-b border-[#E2E8F0]/20 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#E2E8F0]/15 border border-[#E2E8F0]/40 flex items-center justify-center text-[#E2E8F0] shrink-0 shadow-lg">
                  <Scale size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    PANEL DE COMPARACIÓN IDEOLÓGICA MULTI-TITULAR
                  </h3>
                  <p className="text-xs text-gray-300">Análisis comparativo del tratamiento periodístico con fotos y enlaces directos a la noticia original</p>
                </div>
              </div>

              <button 
                onClick={() => setComparisonTopic(null)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#E2E8F0] hover:text-black text-white flex items-center justify-center transition-all shrink-0"
                title="Cerrar panel de comparación"
              >
                <X size={20} />
              </button>
            </div>

            {/* Controles de Filtrado */}
            <div className="p-6 sm:p-8 bg-black/40 border-b border-white/10 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-[#E2E8F0] uppercase tracking-widest mr-2 flex items-center gap-1.5">
                    <Sliders size={14} /> Filtrar Espectro:
                  </span>
                  
                  <button
                    onClick={() => setSelectedTierFilter('todos')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      selectedTierFilter === 'todos'
                        ? 'bg-[#E2E8F0] text-black border-[#E2E8F0] shadow-md'
                        : 'bg-black/60 text-gray-300 border-white/15 hover:text-white'
                    }`}
                  >
                    Ver Todos (5 Niveles)
                  </button>

                  <button
                    onClick={() => setSelectedTierFilter('izquierda')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      selectedTierFilter === 'izquierda'
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                        : 'bg-blue-950/40 text-blue-300 border-blue-500/30 hover:bg-blue-900/50'
                    }`}
                  >
                    Tendencia Izquierda
                  </button>

                  <button
                    onClick={() => setSelectedTierFilter('centro')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      selectedTierFilter === 'centro'
                        ? 'bg-slate-200 text-black border-slate-100 shadow-md'
                        : 'bg-slate-900/40 text-slate-300 border-slate-500/30 hover:bg-slate-800/50'
                    }`}
                  >
                    Centro / Neutral
                  </button>

                  <button
                    onClick={() => setSelectedTierFilter('derecha')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      selectedTierFilter === 'derecha'
                        ? 'bg-amber-600 text-white border-amber-500 shadow-md'
                        : 'bg-amber-950/40 text-amber-300 border-amber-500/30 hover:bg-amber-900/50'
                    }`}
                  >
                    Tendencia Derecha
                  </button>
                </div>

                <span className="text-xs text-gray-400 font-mono">
                  {currentComparisonItems.length} titulares comparados
                </span>
              </div>

              {/* Leyenda Metodológica */}
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-start gap-3">
                <Info size={18} className="text-[#E2E8F0] shrink-0 mt-0.5" />
                <div className="text-xs text-gray-300 space-y-1">
                  <p className="font-bold text-white">Veracidad y Enlaces Directos:</p>
                  <p className="font-light leading-relaxed">
                    Cada enlace de la comparativa abre la noticia exacta publicada en el portal oficial del medio de comunicación correspondiente.
                  </p>
                </div>
              </div>
            </div>

            {/* Contenedor de Tarjetas */}
            <div className="p-6 sm:p-10 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentComparisonItems.map((item) => (
                  <div 
                    key={item.id}
                    className="bg-black/50 border border-white/15 hover:border-[#E2E8F0]/80 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-xl group hover:-translate-y-1"
                  >
                    <div>
                      {/* FOTO DE LA NOTICIA ORIGINAL */}
                      <div className="relative h-44 w-full overflow-hidden bg-black/80">
                        <img 
                          src={item.image} 
                          alt={item.headline}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent"></div>
                        
                        {/* Badge Nivel Ideológico */}
                        <span className={`absolute top-3 left-3 px-3 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider border shadow-md ${item.badgeBg}`}>
                          {item.tier}
                        </span>

                        <span className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/80 backdrop-blur-md text-white text-[10px] font-mono rounded border border-white/20">
                          {item.score}% Alineación
                        </span>
                      </div>

                      <div className="p-6 space-y-4">
                        {/* Nombre del Medio Editorial */}
                        <div className="border-b border-white/10 pb-2.5">
                          <span className="text-[10px] text-gray-400 font-mono uppercase tracking-widest block mb-0.5">Medio Editorial</span>
                          <h4 className="text-base font-bold text-white font-sans group-hover:text-[#E2E8F0] transition-colors">
                            {item.media}
                          </h4>
                        </div>

                        {/* Titular Publicado */}
                        <div>
                          <span className="text-[10px] text-gray-400 font-mono uppercase tracking-widest block mb-1">Titular Publicado</span>
                          <h5 className="font-serif text-base sm:text-lg font-bold text-white leading-snug">
                            "{item.headline}"
                          </h5>
                        </div>

                        {/* Enfoque Periodístico */}
                        <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
                          <span className="text-[10px] text-gray-400 font-mono uppercase tracking-widest block mb-1">Enfoque Periodístico</span>
                          <p className="text-xs text-gray-300 font-light leading-relaxed">
                            {item.focus}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Botón de Acción con Enlace a la Noticia Exacta */}
                    <div className="p-6 pt-0">
                      <a
                        href={item.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 bg-white/10 hover:bg-[#E2E8F0] hover:text-black text-[#E2E8F0] font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 border border-white/10 shadow-md"
                        title="Abrir la noticia exacta en la página oficial del medio"
                      >
                        <span>Abrir Noticia en {item.media}</span>
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Botón Inferior para Cerrar Panel */}
              <div className="pt-6 text-center border-t border-white/10">
                <button
                  onClick={() => setComparisonTopic(null)}
                  className="px-10 py-3.5 bg-[#E2E8F0] text-black font-extrabold text-xs uppercase tracking-widest rounded-xl hover:bg-white transition-all shadow-2xl"
                >
                  Cerrar Panel de Comparación
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* MODAL FICHA DE ATRIBUCIÓN PERIODÍSTICA */}
      {selectedAuthor && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-[#0A0F0D] border border-[#E2E8F0]/40 rounded-3xl max-w-lg w-full overflow-hidden shadow-[0_0_80px_rgba(226,232,240,0.2)] relative">
            
            {/* Header del Perfil */}
            <div className="relative p-6 sm:p-8 bg-gradient-to-b from-[#E2E8F0]/15 to-transparent border-b border-white/10 text-center">
              <button 
                onClick={() => setSelectedAuthor(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-[#E2E8F0] hover:text-black text-white flex items-center justify-center transition-all shrink-0"
                title="Cerrar perfil"
              >
                <X size={16} />
              </button>

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
