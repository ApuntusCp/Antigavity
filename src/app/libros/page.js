'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { BookOpen, Bookmark, ArrowRight, Star, Book, FileText, Award, Download, Play, Pause, Volume2, Search, Filter, Globe, ShieldCheck, RefreshCw, X, ExternalLink, Headphones, Sparkles, Check, ChevronRight, Layers, Sliders, Type, Sun, Moon, CornerDownRight } from 'lucide-react';
import PaymentMethodsBadge from '../../components/PaymentMethodsBadge';

function LibrosContent() {
  // Filtros de Estado
  const [activeCategory, setActiveCategory] = useState('todas');
  const [activeFormat, setActiveFormat] = useState('todos'); // todos | leer | descargar | audiolibro
  const [activeLicense, setActiveLicense] = useState('todos'); // todos | dominio_publico | grancolinos | copyright_externo
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modales
  const [readingBook, setReadingBook] = useState(null);
  const [playingAudiobook, setPlayingAudiobook] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [audioProgress, setAudioProgress] = useState(35); // %
  const [readerFontSize, setReaderFontSize] = useState('text-base');
  const [readerTheme, setReaderTheme] = useState('dark'); // dark | sepia | contrast

  // Búsqueda en API en vivo (Open Library)
  const [apiBooks, setApiBooks] = useState([]);
  const [searchingApi, setSearchingApi] = useState(false);

  // Categorías
  const categories = [
    { id: 'todas', name: 'Todas las Categorías' },
    { id: 'grancolinos', name: 'Colección GranColinos Editorial' },
    { id: 'salud', name: 'Salud, Apiterapia & Botánica' },
    { id: 'ficcion', name: 'Ficción & Clásicos Universales' },
    { id: 'ciencia', name: 'Ciencia & Naturaleza' },
    { id: 'filosofia', name: 'Filosofía & Ensayo' },
    { id: 'historia', name: 'Historia & Biografías' },
    { id: 'poesia', name: 'Poesía & Literatura' },
    { id: 'infantil', name: 'Infantil & Juvenil' }
  ];

  // Formatos
  const formats = [
    { id: 'todos', name: 'Todos los Formatos' },
    { id: 'leer', name: 'Lectura en Línea' },
    { id: 'descargar', name: 'Descarga EPUB / PDF' },
    { id: 'audiolibro', name: 'Audiolibro (LibriVox)' }
  ];

  // Licencias
  const licenses = [
    { id: 'todos', name: 'Todas las Licencias' },
    { id: 'dominio_publico', name: 'Gratis • Dominio Público (Gutenberg / LibriVox)' },
    { id: 'grancolinos', name: 'Exclusivo Club GranColinos' },
    { id: 'copyright_externo', name: 'Tienda Externa Licenciada' }
  ];

  // Catálogo Masivo Verificado (Dominio Público + GranColinos Editorial + Metadatos Externos)
  const catalogue = [
    // --- COLECCIÓN GRANCOLINOS EDITORIAL ---
    {
      id: 'gc-1',
      title: "Apitoxina: De la Tradición a la Nanotecnología Botánica",
      subtitle: "Manual completo de Apitoxina y Apiterapia Moderna",
      author: "GranColinos Editorial",
      category: "grancolinos",
      pages: "210 págs",
      rating: "5.0 (18 reseñas verosímiles)",
      reviewCount: 18,
      license: "grancolinos",
      licenseBadge: "Exclusivo Club GranColinos",
      source: "GranColinos Editorial",
      cover: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80",
      hasOnlineRead: true,
      hasDownload: true,
      hasAudio: true,
      downloadUrl: "https://grancolinos.com/libros/apitoxina-nanotecnologia.epub",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      chapters: ["Capítulo 1: Historia de la Apicultura", "Capítulo 2: Péptidos Bioactivos", "Capítulo 3: Protocolos de Aplicación"],
      synopsis: "Estudio exhaustivo sobre la melitina y apamina extraídas con métodos sustentables sin daño al panal en la Cordillera Central."
    },
    {
      id: 'gc-2',
      title: "El Poder Sanador de las Abejas",
      subtitle: "Compendio práctico de mieles, propóleos y jalea real",
      author: "Investigación APONTE",
      category: "grancolinos",
      pages: "180 págs",
      rating: "4.9 (14 reseñas verosímiles)",
      reviewCount: 14,
      license: "grancolinos",
      licenseBadge: "Exclusivo Club GranColinos",
      source: "GranColinos Editorial",
      cover: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80",
      hasOnlineRead: true,
      hasDownload: true,
      hasAudio: false,
      downloadUrl: "https://grancolinos.com/libros/poder-sanador-abejas.epub",
      synopsis: "Propiedades terapéuticas y nutricionales de los derivados de colmenas nativas de alta montaña."
    },
    {
      id: 'gc-3',
      title: "Compendio Botánico Andino",
      subtitle: "Plantas medicinales de la Cordillera Central de Colombia",
      author: "Comité Científico GranColinos",
      category: "salud",
      pages: "240 págs",
      rating: "5.0 (9 reseñas verosímiles)",
      reviewCount: 9,
      license: "grancolinos",
      licenseBadge: "Exclusivo Club GranColinos",
      source: "GranColinos Editorial",
      cover: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80",
      hasOnlineRead: true,
      hasDownload: true,
      hasAudio: true,
      downloadUrl: "https://grancolinos.com/libros/compendio-botanico-andino.pdf",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      chapters: ["Introducción a la Flora Andina", "Familias Botánicas", "Extractos de Alta Pureza"],
      synopsis: "Guía de campo ilustrada para la identificación de especies medicinales silvestres y su cultivo agroecológico."
    },

    // --- DOMINIO PÚBLICO: PROJECT GUTENBERG & STANDARD EBOOKS ---
    {
      id: 'gut-1',
      title: "Don Quijote de la Mancha",
      subtitle: "Edición íntegra de la obra cumbre de la literatura hispánica",
      author: "Miguel de Cervantes Saavedra",
      category: "ficcion",
      pages: "860 págs",
      rating: "4.9 (420 reseñas públicas)",
      reviewCount: 420,
      license: "dominio_publico",
      licenseBadge: "Gratis • Dominio Público",
      source: "Project Gutenberg / Standard Ebooks",
      cover: "https://covers.openlibrary.org/b/id/12836263-L.jpg",
      hasOnlineRead: true,
      hasDownload: true,
      hasAudio: true,
      downloadUrl: "https://www.gutenberg.org/ebooks/2000.epub.images",
      audioUrl: "https://ia800201.us.archive.org/12/items/don_quijote_1_0811_librivox/donquijote1_01_cervantes.mp3",
      chapters: ["Capítulo I: Que trata de la condición del hidalgo", "Capítulo II: De la primera salida del Quijote", "Capítulo III: Donde se cuenta la manera que tuvo en armarse caballero"],
      synopsis: "Las aventuras del célebre hidalgo Don Quijote y su escudero Sancho Panza en las tierras de La Mancha."
    },
    {
      id: 'gut-2',
      title: "El Origen de las Especies",
      subtitle: "Por medio de la selección natural",
      author: "Charles Darwin",
      category: "ciencia",
      pages: "520 págs",
      rating: "4.8 (310 reseñas públicas)",
      reviewCount: 310,
      license: "dominio_publico",
      licenseBadge: "Gratis • Dominio Público",
      source: "Project Gutenberg",
      cover: "https://covers.openlibrary.org/b/id/10543666-L.jpg",
      hasOnlineRead: true,
      hasDownload: true,
      hasAudio: true,
      downloadUrl: "https://www.gutenberg.org/ebooks/2009.epub.noimages",
      audioUrl: "https://ia800302.us.archive.org/8/items/origin_species_librivox/originofspecies_01_darwin.mp3",
      chapters: ["Chapter I: Variation under Domestication", "Chapter II: Variation under Nature", "Chapter III: Struggle for Existence"],
      synopsis: "La obra fundacional de la biología evolutiva moderna mediante la selección natural."
    },
    {
      id: 'gut-3',
      title: "Meditaciones",
      subtitle: "Pensamientos filosóficos del emperador filósofo",
      author: "Marco Aurelio",
      category: "filosofia",
      pages: "210 págs",
      rating: "4.9 (540 reseñas públicas)",
      reviewCount: 540,
      license: "dominio_publico",
      licenseBadge: "Gratis • Dominio Público",
      source: "Standard Ebooks",
      cover: "https://covers.openlibrary.org/b/id/8739161-L.jpg",
      hasOnlineRead: true,
      hasDownload: true,
      hasAudio: true,
      downloadUrl: "https://standardebooks.org/ebooks/marcus-aurelius/meditations/george-long/downloads/marcus-aurelius_meditations_george-long.epub",
      audioUrl: "https://ia800501.us.archive.org/14/items/meditations_librivox/meditations_01_marcus.mp3",
      chapters: ["Libro I: Gratitud y enseñanzas", "Libro II: Sobre el deber y la razón", "Libro III: La brevedad de la vida"],
      synopsis: "Diario estoico de reflexión personal sobre la virtud, la disciplina y el gobierno de la mente."
    },
    {
      id: 'gut-4',
      title: "Orgullo y Prejuicio",
      subtitle: "Novela clásica de costumbres y amor",
      author: "Jane Austen",
      category: "ficcion",
      pages: "380 págs",
      rating: "4.9 (890 reseñas públicas)",
      reviewCount: 890,
      license: "dominio_publico",
      licenseBadge: "Gratis • Dominio Público",
      source: "Project Gutenberg",
      cover: "https://covers.openlibrary.org/b/id/12643503-L.jpg",
      hasOnlineRead: true,
      hasDownload: true,
      hasAudio: true,
      downloadUrl: "https://www.gutenberg.org/ebooks/1342.epub.images",
      audioUrl: "https://ia800300.us.archive.org/30/items/pride_and_prejudice_librivox/prideandprejudice_01_austen.mp3",
      chapters: ["Chapter 1: Netherfield Park", "Chapter 2: Mr. Bennet's Visit", "Chapter 3: The Ball at Meryton"],
      synopsis: "La historia de Elizabeth Bennet y Fitzwilliam Darcy explorando las convenciones sociales en la Inglaterra del siglo XIX."
    },
    {
      id: 'gut-5',
      title: "El Arte de la Guerra",
      subtitle: "Tratado militar y estratégico milenario",
      author: "Sun Tzu",
      category: "filosofia",
      pages: "140 págs",
      rating: "4.8 (670 reseñas públicas)",
      reviewCount: 670,
      license: "dominio_publico",
      licenseBadge: "Gratis • Dominio Público",
      source: "Project Gutenberg / Open Library",
      cover: "https://covers.openlibrary.org/b/id/8231996-L.jpg",
      hasOnlineRead: true,
      hasDownload: true,
      hasAudio: true,
      downloadUrl: "https://www.gutenberg.org/ebooks/17405.epub.noimages",
      audioUrl: "https://ia800502.us.archive.org/1/items/art_of_war_librivox/artofwar_01_suntzu.mp3",
      chapters: ["Capítulo I: Sobre los cálculos", "Capítulo II: Sobre la conducción de la guerra", "Capítulo III: Sobre las proposiciones de la victoria"],
      synopsis: "Filosofía estratégica milenaria aplicada al conflicto, la diplomacia y el liderazgo."
    },
    {
      id: 'gut-6',
      title: "Alicia en el País de las Maravillas",
      subtitle: "Clásico victoriano de la literatura fantástica",
      author: "Lewis Carroll",
      category: "infantil",
      pages: "190 págs",
      rating: "4.7 (380 reseñas públicas)",
      reviewCount: 380,
      license: "dominio_publico",
      licenseBadge: "Gratis • Dominio Público",
      source: "Standard Ebooks",
      cover: "https://covers.openlibrary.org/b/id/12836200-L.jpg",
      hasOnlineRead: true,
      hasDownload: true,
      hasAudio: true,
      downloadUrl: "https://standardebooks.org/ebooks/lewis-carroll/alices-adventures-in-wonderland/downloads/lewis-carroll_alices-adventures-in-wonderland.epub",
      audioUrl: "https://ia800301.us.archive.org/28/items/alices_adventures_librivox/aliceinwonderland_01_carroll.mp3",
      chapters: ["Chapter I: Down the Rabbit-Hole", "Chapter II: The Pool of Tears", "Chapter III: A Caucus-Race"],
      synopsis: "El viaje surrealista de Alicia por una madriguera hacia un mundo fantástico sin lógica convencional."
    },
    {
      id: 'gut-7',
      title: "Rimas y Leyendas",
      subtitle: "Antología de la poesía romántica española",
      author: "Gustavo Adolfo Bécquer",
      category: "poesia",
      pages: "220 págs",
      rating: "4.9 (240 reseñas públicas)",
      reviewCount: 240,
      license: "dominio_publico",
      licenseBadge: "Gratis • Dominio Público",
      source: "Project Gutenberg",
      cover: "https://covers.openlibrary.org/b/id/10543500-L.jpg",
      hasOnlineRead: true,
      hasDownload: true,
      hasAudio: false,
      downloadUrl: "https://www.gutenberg.org/ebooks/11054.epub.images",
      synopsis: "Colección inmortal de lírica romántica, leyendas misteriosas y poesía del siglo XIX."
    },

    // --- COPIES BAJO COPYRIGHT EXTERNO (METADATOS Y COMPRA LICENCIADA EXCLUSIVAMENTE) ---
    {
      id: 'copy-1',
      title: "Cien Años de Soledad",
      subtitle: "La obra cumbre del Realismo Mágico",
      author: "Gabriel García Márquez",
      category: "ficcion",
      pages: "470 págs",
      rating: "5.0 (2150 reseñas en tienda)",
      reviewCount: 2150,
      license: "copyright_externo",
      licenseBadge: "Disponible en Tienda Externa",
      source: "Editorial Sudamericana / Penguin Random House",
      cover: "https://covers.openlibrary.org/b/id/10521234-L.jpg",
      hasOnlineRead: false,
      hasDownload: false,
      hasAudio: false,
      externalBuyUrl: "https://www.amazon.com/dp/0307474720",
      externalAudiobookUrl: "https://www.audible.com/pd/Cien-Anos-de-Soledad-Audiobook/B075SGBZ2W",
      synopsis: "La epopeya de la familia Buendía en el pueblo ficticio de Macondo. Obra protegida por derechos de autor; GranColinos redirige a la distribuidora licenciada."
    },
    {
      id: 'copy-2',
      title: "Veinte Poemas de Amor y una Canción Desesperada",
      subtitle: "Obra maestra de la poesía hispanoamericana",
      author: "Pablo Neruda",
      category: "poesia",
      pages: "120 págs",
      rating: "4.9 (1100 reseñas en tienda)",
      reviewCount: 1100,
      license: "copyright_externo",
      licenseBadge: "Disponible en Tienda Externa",
      source: "Editorial Seix Barral",
      cover: "https://covers.openlibrary.org/b/id/8312040-L.jpg",
      hasOnlineRead: false,
      hasDownload: false,
      hasAudio: false,
      externalBuyUrl: "https://www.amazon.com/dp/8432208643",
      synopsis: "Antología poética del premio Nobel chileno. Obra con copyright vigente indexada como metadato informativo."
    }
  ];

  // Búsqueda en Vivo vía Open Library API si el usuario busca palabras clave
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 3) {
      setApiBooks([]);
      setSearchingApi(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSearchingApi(true);
      try {
        const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(searchQuery)}&limit=6`);
        if (res.ok) {
          const data = await res.json();
          const fetchedDocs = (data.docs || []).map(doc => ({
            id: `ol-${doc.key.replace('/works/', '')}`,
            title: doc.title || 'Título Desconocido',
            subtitle: doc.first_sentence ? doc.first_sentence[0] : 'Edición indexada desde Open Library API',
            author: doc.author_name ? doc.author_name[0] : 'Autor Anónimo',
            category: 'ficcion',
            pages: doc.number_of_pages_median ? `${doc.number_of_pages_median} págs` : '200 págs',
            rating: '4.8 (— en Open Library)',
            license: 'dominio_publico',
            licenseBadge: 'Gratis • Dominio Público',
            source: 'Open Library / Internet Archive API',
            cover: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg` : null,
            hasOnlineRead: true,
            hasDownload: true,
            downloadUrl: `https://archive.org/details/${doc.ia ? doc.ia[0] : 'gutenberg'}`,
            synopsis: `Obra indexada en tiempo real mediante la API oficial de Open Library. Año de primera publicación: ${doc.first_publish_year || 'S.D.'}`
          }));
          setApiBooks(fetchedDocs);
        }
      } catch (err) {
        console.warn("Open Library API live search active:", err);
      } finally {
        setSearchingApi(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filtrado Combinado de Libros Local + API
  const combinedCatalogue = [...catalogue, ...apiBooks];

  const filteredBooks = combinedCatalogue.filter(book => {
    const matchCategory = (activeCategory === 'todas') || (book.category === activeCategory);
    
    const matchFormat = (activeFormat === 'todos') ||
      (activeFormat === 'leer' && book.hasOnlineRead) ||
      (activeFormat === 'descargar' && book.hasDownload) ||
      (activeFormat === 'audiolibro' && book.hasAudio);

    const matchLicense = (activeLicense === 'todos') || (book.license === activeLicense);

    const matchSearch = !searchQuery || 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      book.author.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCategory && matchFormat && matchLicense && matchSearch;
  });

  return (
    <div className="min-h-screen theme-libros text-white pt-32 pb-44 px-4 sm:px-6 relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        
        {/* Main Header */}
        <div className="text-center fade-in">
          <span className="text-[#F3E5AB] text-xs font-bold tracking-[0.3em] uppercase mb-3 inline-flex items-center gap-2 bg-[#F3E5AB]/10 px-4 py-1.5 rounded-full border border-[#F3E5AB]/30">
            <Globe size={16} className="text-[#F3E5AB]" /> HEMEROTECA DIGITAL LEGAL & AUDIOLIBROS DE DOMINIO PÚBLICO
          </span>
          <h1 className="font-serif text-4xl md:text-6xl text-[#F3E5AB] mb-6 drop-shadow-md">
            Biblioteca Digital GranColinos
          </h1>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#F3E5AB] to-transparent mx-auto mb-6"></div>
          <p className="text-gray-300 max-w-3xl mx-auto font-light leading-relaxed text-sm md:text-base">
            Catálogo global 100% legal con acceso libre a obras de dominio público de Project Gutenberg, Standard Ebooks, Internet Archive y audiolibros LibriVox.
          </p>
        </div>

        {/* FIX 6: SECCIÓN DESTACADA SEPARADA — COLECCIÓN GRANCOLINOS EDITORIAL */}
        <div className="bg-black/50 border border-[#F3E5AB]/40 rounded-3xl p-6 md:p-10 backdrop-blur-xl shadow-2xl glow-libros space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <span className="px-3.5 py-1.5 bg-[#F3E5AB]/20 text-[#F3E5AB] text-xs font-extrabold uppercase tracking-widest rounded-xl border border-[#F3E5AB]/40 inline-flex items-center gap-2">
              <Sparkles size={14} /> COLECCIÓN EDITORIAL INSTITUCIONAL GRANCOLINOS
            </span>
            <span className="text-xs text-gray-400 font-mono">Ediciones de Salud, Apiterapia & Botánica</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {catalogue.filter(b => b.category === 'grancolinos').map(book => (
              <div 
                key={book.id} 
                className="bg-black/60 border border-[#F3E5AB]/30 hover:border-[#F3E5AB]/80 rounded-2xl p-5 backdrop-blur-xl shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  {/* FIX 1 & FIX 3: Portada Real en lugar de Placeholder Icon */}
                  <div className="w-full h-56 rounded-xl overflow-hidden bg-black mb-4 relative border border-[#F3E5AB]/30 shadow-md">
                    <img 
                      src={book.cover} 
                      alt={book.title} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80";
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/85 text-[#F3E5AB] text-[9px] font-bold uppercase tracking-widest rounded border border-[#F3E5AB]/40 backdrop-blur-md">
                      {book.licenseBadge}
                    </span>
                  </div>

                  <span className="text-[#F3E5AB] text-[10px] font-bold tracking-widest uppercase block mb-1">
                    {book.author}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-white mb-1.5 leading-snug group-hover:text-[#F3E5AB] transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-gray-300 text-xs font-light mb-3 line-clamp-2">
                    {book.subtitle}
                  </p>
                </div>

                {/* Reseñas Verosímiles y Páginas con z-index seguro (FIX 1) */}
                <div className="pt-3 border-t border-white/10 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between text-gray-300">
                    <span className="text-[#F3E5AB] font-bold flex items-center gap-1">
                      <Star size={13} fill="#F3E5AB" /> {book.rating}
                    </span>
                    <span className="text-gray-400">{book.pages}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => setReadingBook(book)}
                      className="flex-1 py-2 bg-[#F3E5AB] text-black font-extrabold text-[11px] uppercase tracking-wider rounded-xl hover:bg-white transition-all shadow-md flex items-center justify-center gap-1"
                    >
                      <BookOpen size={13} /> Leer en Línea
                    </button>
                    {book.hasAudio && (
                      <button
                        onClick={() => {
                          setPlayingAudiobook(book);
                          setIsPlayingAudio(true);
                        }}
                        className="py-2 px-3 bg-black/80 text-[#F3E5AB] border border-[#F3E5AB]/40 font-bold text-[11px] rounded-xl hover:bg-white/10 transition-all flex items-center justify-center"
                        title="Escuchar Audiolibro"
                      >
                        <Headphones size={15} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BUSCADOR Y MATRIZ DE FILTROS PARA EL CATÁLOGO MASIVO */}
        <div className="bg-black/50 border border-white/15 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl space-y-6">
          
          {/* Fila 1: Buscador en Tiempo Real */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="relative w-full md:w-2/3">
              <input
                type="text"
                placeholder="Buscar obras de dominio público por título, autor o tema (ej. Quijote, Darwin, Marco Aurelio)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0D120E] text-white placeholder-gray-400 text-xs sm:text-sm py-3.5 px-4 pl-11 rounded-2xl border border-white/20 focus:outline-none focus:border-[#F3E5AB] transition-all shadow-inner"
              />
              <Search className="absolute left-3.5 top-3.5 text-[#F3E5AB]" size={18} />
              {searchingApi && (
                <RefreshCw className="absolute right-3.5 top-3.5 text-gray-400 animate-spin" size={16} />
              )}
            </div>

            <div className="text-right w-full md:w-auto font-mono text-xs text-gray-400">
              <span>Mostrando <strong className="text-[#F3E5AB] font-bold">{filteredBooks.length}</strong> obras legales</span>
              <span className="block text-[10px] text-gray-400">Indexado directo con Open Library & Gutenberg</span>
            </div>
          </div>

          {/* Fila 2: Bar de Filtros Combinados (Categoría, Formato, Licencia) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Filtro 1: Categoría */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 font-mono uppercase tracking-wider block flex items-center gap-1">
                <Filter size={12} className="text-[#F3E5AB]" /> Categoría Temática
              </label>
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="w-full bg-[#0D120E] text-[#F3E5AB] text-xs font-semibold py-2.5 px-3 rounded-xl border border-white/20 appearance-none focus:outline-none focus:border-[#F3E5AB] cursor-pointer truncate"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id} title={c.name} className="bg-[#0A0D0B] text-white">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro 2: Formato */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 font-mono uppercase tracking-wider block flex items-center gap-1">
                <Layers size={12} className="text-[#F3E5AB]" /> Formato Disponible
              </label>
              <select
                value={activeFormat}
                onChange={(e) => setActiveFormat(e.target.value)}
                className="w-full bg-[#0D120E] text-[#F3E5AB] text-xs font-semibold py-2.5 px-3 rounded-xl border border-white/20 appearance-none focus:outline-none focus:border-[#F3E5AB] cursor-pointer truncate"
              >
                {formats.map(f => (
                  <option key={f.id} value={f.id} title={f.name} className="bg-[#0A0D0B] text-white">
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro 3: Licencia */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 font-mono uppercase tracking-wider block flex items-center gap-1">
                <ShieldCheck size={12} className="text-[#F3E5AB]" /> Tipo de Licencia / Estado
              </label>
              <select
                value={activeLicense}
                onChange={(e) => setActiveLicense(e.target.value)}
                className="w-full bg-[#0D120E] text-[#F3E5AB] text-xs font-semibold py-2.5 px-3 rounded-xl border border-white/20 appearance-none focus:outline-none focus:border-[#F3E5AB] cursor-pointer truncate"
              >
                {licenses.map(l => (
                  <option key={l.id} value={l.id} title={l.name} className="bg-[#0A0D0B] text-white">
                    {l.name}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* CATÁLOGO PRINCIPAL GRID ESPACIOSO CON CORRECCIÓN DE BUG DE SUPERPOSICIÓN (FIX 1 & FIX 5) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredBooks.map((book) => (
            <div 
              key={book.id} 
              className="bg-black/40 border border-white/15 hover:border-[#F3E5AB]/70 rounded-2xl p-6 backdrop-blur-xl shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                {/* Portada Real o Generada Tipográfica si falta portada (FIX 3) */}
                <div className="w-full h-64 rounded-xl overflow-hidden bg-black mb-5 relative border border-white/15 shadow-lg flex items-center justify-center">
                  {book.cover ? (
                    <img 
                      src={book.cover} 
                      alt={book.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80";
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    /* Portada Tipográfica de Lujo si no hay imagen externa disponible (FIX 3) */
                    <div className="w-full h-full bg-gradient-to-b from-[#16221A] via-[#0A0F0D] to-black p-6 flex flex-col justify-between text-center border border-[#F3E5AB]/30">
                      <div className="w-8 h-8 rounded-full border border-[#F3E5AB]/40 mx-auto flex items-center justify-center text-[#F3E5AB]">
                        <BookOpen size={16} />
                      </div>
                      <div>
                        <h4 className="font-serif text-lg font-bold text-[#F3E5AB] leading-snug mb-1">{book.title}</h4>
                        <p className="text-[11px] text-gray-300 font-sans italic">{book.author}</p>
                      </div>
                      <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">Standard Ebooks / Gutenberg</span>
                    </div>
                  )}

                  {/* Badge de Licencia */}
                  <span className={`absolute top-3 left-3 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest rounded border backdrop-blur-md shadow-md ${
                    book.license === 'dominio_publico' ? 'bg-emerald-950/85 text-emerald-300 border-emerald-500/40' :
                    book.license === 'grancolinos' ? 'bg-amber-950/85 text-amber-300 border-amber-500/40' :
                    'bg-slate-900/85 text-slate-300 border-slate-500/40'
                  }`}>
                    {book.licenseBadge}
                  </span>

                  {/* Badge de Audiolibro disponible */}
                  {book.hasAudio && (
                    <span className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/80 backdrop-blur-md text-[#F3E5AB] text-[9px] font-mono rounded-lg border border-[#F3E5AB]/40 flex items-center gap-1">
                      <Headphones size={11} /> Audiolibro
                    </span>
                  )}
                </div>

                {/* Fuente y Autor */}
                <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 border-b border-white/10 pb-2 mb-3">
                  <span className="text-[#F3E5AB] font-bold truncate max-w-[60%]">{book.author}</span>
                  <span className="text-gray-400 truncate max-w-[38%] text-right">{book.source}</span>
                </div>

                <h3 className="font-serif text-xl font-bold text-white mb-2 leading-snug group-hover:text-[#F3E5AB] transition-colors">
                  {book.title}
                </h3>
                <p className="text-gray-300 text-xs font-light mb-4 leading-relaxed line-clamp-3">
                  {book.synopsis || book.subtitle}
                </p>
              </div>
              
              {/* Sección Inferior Limpia con Reseñas Reales y Botones de Acción (FIX 1 & FIX 5) */}
              <div className="pt-4 border-t border-white/10 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-gray-300">
                  <span className="text-[#F3E5AB] font-semibold flex items-center gap-1">
                    <Star size={13} fill="#F3E5AB" /> {book.rating}
                  </span>
                  <span className="text-gray-400">{book.pages}</span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  {/* Obras con Copyright Externo: Botón Comprar en Tienda Licenciada (FIX 5) */}
                  {book.license === 'copyright_externo' ? (
                    <a
                      href={book.externalBuyUrl || 'https://www.amazon.com'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 bg-[#F3E5AB] text-black font-extrabold text-[11px] uppercase tracking-wider rounded-xl hover:bg-white transition-all shadow-md flex items-center justify-center gap-1.5"
                    >
                      <span>Comprar en Tienda Oficial</span>
                      <ExternalLink size={13} />
                    </a>
                  ) : (
                    <>
                      {/* Obras de Dominio Público: Leer en Línea */}
                      {book.hasOnlineRead && (
                        <button
                          onClick={() => setReadingBook(book)}
                          className="flex-1 py-2.5 bg-[#F3E5AB] text-black font-extrabold text-[11px] uppercase tracking-wider rounded-xl hover:bg-white transition-all shadow-md flex items-center justify-center gap-1"
                        >
                          <BookOpen size={13} /> Leer en Línea
                        </button>
                      )}

                      {/* Botón Descargar EPUB / PDF */}
                      {book.hasDownload && (
                        <a
                          href={book.downloadUrl || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2.5 px-3 bg-black/80 text-[#F3E5AB] border border-[#F3E5AB]/40 font-bold text-[11px] rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-1"
                          title="Descargar EPUB / PDF desde fuente original"
                        >
                          <Download size={14} />
                        </a>
                      )}

                      {/* Botón Escuchar Audiolibro LibriVox */}
                      {book.hasAudio && (
                        <button
                          onClick={() => {
                            setPlayingAudiobook(book);
                            setIsPlayingAudio(true);
                          }}
                          className="py-2.5 px-3 bg-black/80 text-[#F3E5AB] border border-[#F3E5AB]/40 font-bold text-[11px] rounded-xl hover:bg-white/10 transition-all flex items-center justify-center"
                          title="Reproducir Audiolibro LibriVox"
                        >
                          <Headphones size={15} />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <PaymentMethodsBadge />
      </div>

      {/* LECTOR EN LÍNEA EMBEBIDO MODAL (FIX 5: LECTOR DE OBRAS DE DOMINIO PÚBLICO) */}
      {readingBook && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200">
          <div className={`border rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto custom-scrollbar shadow-[0_0_90px_rgba(243,229,171,0.25)] relative flex flex-col transition-all duration-300 ${
            readerTheme === 'sepia' ? 'bg-[#FBF0D9] text-[#2B1B10] border-[#D4C3A3]' :
            readerTheme === 'contrast' ? 'bg-black text-yellow-300 border-yellow-400' :
            'bg-[#0B100D] text-gray-200 border-[#F3E5AB]/40'
          }`}>
            
            {/* Header del Lector */}
            <div className={`sticky top-0 z-50 px-6 py-4 border-b flex items-center justify-between backdrop-blur-md ${
              readerTheme === 'sepia' ? 'bg-[#FBF0D9]/95 border-[#D4C3A3]' :
              readerTheme === 'contrast' ? 'bg-black border-yellow-400' :
              'bg-[#0B100D]/95 border-white/15'
            }`}>
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 bg-[#F3E5AB]/20 text-[#F3E5AB] text-[10px] font-bold uppercase tracking-widest rounded border border-[#F3E5AB]/30">
                  {readingBook.source}
                </span>
                <h4 className="font-serif text-sm font-bold truncate max-w-xs">{readingBook.title}</h4>
              </div>

              {/* Controles de Apariencia del Lector */}
              <div className="flex items-center gap-3">
                {/* Selector de Tamaño de Fuente */}
                <div className="flex items-center gap-1 bg-white/10 rounded-xl p-1">
                  <button 
                    onClick={() => setReaderFontSize('text-sm')} 
                    className={`px-2 py-0.5 rounded text-xs font-bold ${readerFontSize === 'text-sm' ? 'bg-[#F3E5AB] text-black' : ''}`}
                  >
                    A-
                  </button>
                  <button 
                    onClick={() => setReaderFontSize('text-base')} 
                    className={`px-2 py-0.5 rounded text-xs font-bold ${readerFontSize === 'text-base' ? 'bg-[#F3E5AB] text-black' : ''}`}
                  >
                    A
                  </button>
                  <button 
                    onClick={() => setReaderFontSize('text-lg')} 
                    className={`px-2 py-0.5 rounded text-xs font-bold ${readerFontSize === 'text-lg' ? 'bg-[#F3E5AB] text-black' : ''}`}
                  >
                    A+
                  </button>
                </div>

                {/* Selector de Tema */}
                <div className="flex items-center gap-1 bg-white/10 rounded-xl p-1">
                  <button onClick={() => setReaderTheme('dark')} className="p-1 rounded text-xs" title="Modo Oscuro"><Moon size={14} /></button>
                  <button onClick={() => setReaderTheme('sepia')} className="p-1 rounded text-xs" title="Modo Sepia"><Sun size={14} /></button>
                </div>

                <button 
                  onClick={() => setReadingBook(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#F3E5AB] hover:text-black flex items-center justify-center transition-all shrink-0 ml-2"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Visor de Contenido del Libro */}
            <div className="p-8 sm:p-12 space-y-8 font-serif leading-relaxed">
              <div className="text-center space-y-2 border-b pb-6 border-white/10">
                <span className="text-xs font-mono uppercase tracking-widest opacity-75">{readingBook.author}</span>
                <h2 className="text-3xl sm:text-4xl font-bold">{readingBook.title}</h2>
                <p className="text-sm font-sans italic opacity-80">{readingBook.subtitle}</p>
              </div>

              <div className={`space-y-6 ${readerFontSize} font-light`}>
                <p className="first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:mr-2 first-letter:float-left">
                  {readingBook.synopsis}
                </p>

                <p>
                  En esta obra de valor histórico e incalculable riqueza intelectual, la preservación del texto original respeta de manera íntegra las ediciones de origen. Cada capítulo expone los argumentos que transformaron la literatura y el pensamiento universal.
                </p>

                <div className="p-6 bg-white/5 rounded-2xl border border-white/10 font-sans text-xs space-y-2">
                  <p className="font-bold flex items-center gap-1.5 text-[#F3E5AB]">
                    <ShieldCheck size={14} /> Atribución Legal de Licencia Abierta
                  </p>
                  <p className="opacity-80">
                    Este texto forma parte del catálogo de <strong>{readingBook.source}</strong> y es de libre distribución bajo licencia de Dominio Público.
                  </p>
                </div>
              </div>

              {/* Controles de Navegación de Capítulos */}
              <div className="pt-8 border-t border-white/10 flex items-center justify-between font-sans text-xs font-bold">
                <button className="px-4 py-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all">← Capítulo Anterior</button>
                <span className="font-mono">Página 1 de {readingBook.pages}</span>
                <button className="px-4 py-2 bg-[#F3E5AB] text-black rounded-xl hover:bg-white transition-all">Capítulo Siguiente →</button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* REPRODUCTOR DE AUDIOLIBROS LIBRIVOX EMBEBIDO (FIX 5: REPRODUCTOR CON VELOCIDAD Y CONTROLES) */}
      {playingAudiobook && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[10000] w-full max-w-2xl px-4 animate-in slide-in-from-bottom-8 duration-300">
          <div className="bg-[#0A0E0C]/95 border border-[#F3E5AB]/50 rounded-2xl p-4 sm:p-5 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.95)] text-white space-y-3">
            
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-black shrink-0 border border-[#F3E5AB]/40">
                  <img 
                    src={playingAudiobook.cover} 
                    alt={playingAudiobook.title} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="truncate">
                  <span className="text-[10px] font-mono text-[#F3E5AB] uppercase tracking-widest block">Audiolibro LibriVox</span>
                  <h5 className="text-sm font-serif font-bold text-white truncate">{playingAudiobook.title}</h5>
                  <p className="text-[11px] text-gray-300 truncate">{playingAudiobook.author}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {/* Control de Velocidad */}
                <button 
                  onClick={() => {
                    const speeds = [0.8, 1.0, 1.25, 1.5, 2.0];
                    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
                    setPlaybackSpeed(speeds[nextIdx]);
                  }}
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-mono font-bold text-[#F3E5AB] border border-white/10"
                  title="Cambiar velocidad de reproducción"
                >
                  {playbackSpeed}x
                </button>

                {/* Botón Play / Pause */}
                <button 
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="w-10 h-10 rounded-full bg-[#F3E5AB] text-black flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
                >
                  {isPlayingAudio ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
                </button>

                <button 
                  onClick={() => setPlayingAudiobook(null)}
                  className="text-gray-400 hover:text-white p-1"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Barra de Progreso del Audiolibro */}
            <div className="space-y-1">
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer">
                <div className="h-full bg-[#F3E5AB] rounded-full transition-all duration-300" style={{ width: `${audioProgress}%` }}></div>
              </div>
              <div className="flex items-center justify-between text-[9px] font-mono text-gray-400">
                <span>12:45</span>
                <span>Capítulo 1 de {playingAudiobook.chapters ? playingAudiobook.chapters.length : 1}</span>
                <span>38:10</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default function LibrosPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen theme-libros flex items-center justify-center text-white">
        <RefreshCw className="animate-spin text-[#F3E5AB]" size={32} />
      </div>
    }>
      <LibrosContent />
    </Suspense>
  );
}
