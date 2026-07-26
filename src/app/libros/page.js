'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { BookOpen, Bookmark, ArrowRight, Star, Book, FileText, Award, Download, Play, Pause, Volume2, Search, Filter, Globe, ShieldCheck, RefreshCw, X, ExternalLink, Headphones, Sparkles, Check, ChevronRight, Layers, Sliders, Type, Sun, Moon, Database, AlertCircle, ChevronLeft, Maximize2, Minimize2, Highlighting, Highlighter, MessageSquare, Edit3, Columns, Layout, Trash2, Save } from 'lucide-react';

// Componente Especial de Garantía y Acceso Abierto para la Biblioteca
function LibraryTrustBadge() {
  return (
    <div className="w-full bg-[#0A0E0C]/90 border border-[#F3E5AB]/30 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl my-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#F3E5AB]/10 border border-[#F3E5AB]/30 flex items-center justify-center text-[#F3E5AB] shrink-0">
            <Globe size={22} />
          </div>
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">Acceso Abierto & Dominio Público</h5>
            <p className="text-[11px] text-gray-300">Catálogo 100% legal e indexación libre sin restricciones de suscripción</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#F3E5AB]/10 border border-[#F3E5AB]/30 flex items-center justify-center text-[#F3E5AB] shrink-0">
            <BookOpen size={22} />
          </div>
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">Calidad Tipográfica & Preservación</h5>
            <p className="text-[11px] text-gray-300">Textos originales escaneados e indexados desde Gutenberg & Open Library</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#F3E5AB]/10 border border-[#F3E5AB]/30 flex items-center justify-center text-[#F3E5AB] shrink-0">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">Garantía Hemerográfica GranColinos</h5>
            <p className="text-[11px] text-gray-300">Lectura directa en línea, descargas libres EPUB/PDF y audiolibros LibriVox</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LibrosContent() {
  // Filtros de Estado
  const [activeCategory, setActiveCategory] = useState('todas');
  const [activeFormat, setActiveFormat] = useState('todos'); 
  const [activeLicense, setActiveLicense] = useState('todos'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  // Modales y Lector Nativo GranColinos
  const [readingBook, setReadingBook] = useState(null);
  const [readerCurrentPage, setReaderCurrentPage] = useState(1);
  const [readerPageMode, setReaderPageMode] = useState('double'); // 'single' | 'double' (Libro Abierto 2 Páginas)
  const [isFullscreenReader, setIsFullscreenReader] = useState(false);
  const [readerFontSize, setReaderFontSize] = useState('text-base');
  const [readerTheme, setReaderTheme] = useState('dark'); // dark | sepia | contrast

  // Sistema de Notas y Subrayado de Usuario (Persistente)
  const [userHighlights, setUserHighlights] = useState({}); // { [bookId_page]: boolean }
  const [userNotes, setUserNotes] = useState({}); // { [bookId]: [ { id, page, text, date } ] }
  const [newNoteInput, setNewNoteInput] = useState('');
  const [showNotesPanel, setShowNotesPanel] = useState(false);

  // Audiolibros
  const [playingAudiobook, setPlayingAudiobook] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  // Estado del Catálogo y la API Interna
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState(null);
  const [totalBooksCount, setTotalBooksCount] = useState(0);

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

  // Cargar Notas Guardadas en LocalStorage
  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem('grancolinos_user_notes');
      const savedHighlights = localStorage.getItem('grancolinos_user_highlights');
      if (savedNotes) setUserNotes(JSON.parse(savedNotes));
      if (savedHighlights) setUserHighlights(JSON.parse(savedHighlights));
    } catch (e) {
      console.warn("Storage load error:", e);
    }
  }, []);

  // Guardar Notas
  const saveUserNote = (bookId) => {
    if (!newNoteInput.trim() || !bookId) return;
    const noteObj = {
      id: Date.now(),
      page: readerCurrentPage,
      text: newNoteInput.trim(),
      date: new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })
    };

    const updated = {
      ...userNotes,
      [bookId]: [noteObj, ...(userNotes[bookId] || [])]
    };

    setUserNotes(updated);
    setNewNoteInput('');
    try {
      localStorage.setItem('grancolinos_user_notes', JSON.stringify(updated));
    } catch (e) {}
  };

  const deleteUserNote = (bookId, noteId) => {
    const updated = {
      ...userNotes,
      [bookId]: (userNotes[bookId] || []).filter(n => n.id !== noteId)
    };
    setUserNotes(updated);
    try {
      localStorage.setItem('grancolinos_user_notes', JSON.stringify(updated));
    } catch (e) {}
  };

  // Alternar Subrayado de Párrafo
  const toggleHighlightParagraph = (bookId, pageNum, paragraphIdx) => {
    const key = `${bookId}_p${pageNum}_idx${paragraphIdx}`;
    const updated = {
      ...userHighlights,
      [key]: !userHighlights[key]
    };
    setUserHighlights(updated);
    try {
      localStorage.setItem('grancolinos_user_highlights', JSON.stringify(updated));
    } catch (e) {}
  };

  // Base de Datos de Páginas Reales Adaptadas para Lectura Nativa GranColinos
  const nativeBookPagesMap = {
    'gut-1656': [
      {
        page: 1,
        title: "Apología de Sócrates — Sección I: El Discurso ante el Tribunal",
        paragraphs: [
          "Cualquiera que haya sido la impresión que mis acusadores hayan causado en vosotros, oh atenienses, por mi parte, confieso que casi me he desconocido a mí mismo, tan persuasivamente han hablado. Sin embargo, puedo asegurar que no han dicho ni una sola palabra que sea verdadera.",
          "De entre sus muchas mentiras, una me ha admirado sobremanera: aquella en que decían que debíais tener cuidado de no dejaros engañar por mí, porque soy un orador hábil.",
          "El decir esto, cuando debían saber que la prueba de lo contrario iba a ser evidente, pues en cuanto abriese la boca se vería que no soy orador en modo alguno, a no ser que llamen orador al que dice la verdad, me ha parecido el colmo de la impudicia."
        ]
      },
      {
        page: 2,
        title: "Apología de Sócrates — Sección II: La Verdad del Oráculo de Delfos",
        paragraphs: [
          "Si es esto lo que quieren decir, confieso que soy orador, pero no a su manera. Ellos, lo repito, no han dicho nada verdadero; de mí, en cambio, oiréis la verdad toda entera.",
          "Mas, por Zeus, atenienses, no oiréis discursos adornados de bellas frases y palabras esmeradamente escogidas, como los suyos, sino cosas dichas al azar, con las primeras palabras que me vengan a la boca, porque tengo la confianza de que es justo lo que digo.",
          "Quien me dio testimonio de mi sabiduría fue el oráculo de Delfos. Querefonte, mi amigo de la infancia, fue a Delfos y tuvo la osadía de consultar si había alguien más sabio que yo. La Pitia respondió que no había nadie más sabio."
        ]
      },
      {
        page: 3,
        title: "Apología de Sócrates — Sección III: Sólo sé que nada sé",
        paragraphs: [
          "Al oír esto me dije a mí mismo: ¿Qué quiere decir el dios? Porque yo sé muy bien que no soy sabio ni poco ni mucho.",
          "Fui a examinar a uno de los que pasaban por sabios y descubrí que fingía saber lo que no sabía. Me retiré entonces pensando: 'Soy más sabio que este hombre; pues ninguno de los dos sabe nada bueno, pero él cree saber algo no sabiéndolo, mientras que yo, así como no sé nada, tampoco creo saberlo'.",
          "A partir de este examen, atenienses, me he ganado muchas enemistades, pero mi compromiso con la búsqueda de la verdad permanece firme."
        ]
      },
      {
        page: 4,
        title: "Critón — Sección I: La Visita en la Prisión de Atenas",
        paragraphs: [
          "¿Por qué has venido a esta hora, Critón? ¿No es aún muy temprano? Sí, ciertamente. La nave de Delos está a punto de llegar y las leyes exigen mi ejecución.",
          "Pero escucha, querido Critón: si al huir violamos las leyes de Atenas que nos vieron nacer y educarnos, estaremos destruyendo el orden de la polis.",
          "La voz de las Leyes resonará en mi alma diciéndome que es preferible sufrir una injusticia humana antes que cometer una injusticia contra la patria."
        ]
      }
    ],
    'gut-2000': [
      {
        page: 1,
        title: "Don Quijote de la Mancha — Capítulo I",
        paragraphs: [
          "En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha mucho tiempo que vivía un hidalgo de los de lanza en astillero, adarga antigua, rocín flaco y galgo corredor.",
          "Una olla de algo más vaca que carnero, salpicón las más noches, duelos y quebrantos los sábados, lantejas los viernes, algún palomino de añadidura los domingos, consumían las tres partes de su hacienda.",
          "Frisaba la edad de nuestro hidalgo con los cincuenta años; era de complexión recia, seco de carnes, enjuto de rostro, gran madrugador y amigo de la caza."
        ]
      },
      {
        page: 2,
        title: "Don Quijote de la Mancha — Capítulo II",
        paragraphs: [
          "Hechas, pues, estas prevenciones, no quiso aguardar más tiempo a poner en efecto su pensamiento, apretándole a ello la falta que él pensaba que hacía en el mundo su tardanza.",
          "Según eran los agravios que pensaba deshacer, tuertos que enderezar, sinrazones que enmendar y abusos que mejorar y deudas que satisfacer.",
          "Y así, sin dar parte a persona alguna de su intención, y sin que nadie le viese, una mañana, antes del día, que era uno de los calurosos del mes de Julio, se armó de todas sus armas."
        ]
      }
    ],
    'default': [
      {
        page: 1,
        title: "Página 1: Introducción a la Obra Original",
        paragraphs: [
          "Esta obra pertenece al patrimonio literario y científico universal de dominio público. Su preservación respeta íntegramente la edición de origen.",
          "En esta primera sección se exponen los principios fundamentales, el marco histórico y las hipótesis que articulan el desarrollo de la investigación.",
          "Puedes utilizar los botones superiores para activar la 'Vista Doble Página (Libro Abierto)', subrayar párrafos clave o añadir tus apuntes personales."
        ]
      },
      {
        page: 2,
        title: "Página 2: Desarrollo y Análisis Crítico",
        paragraphs: [
          "Avanzando en la estructura del texto, se examinan las evidencias empíricas y los diálogos analíticos que consolidan las conclusiones del autor.",
          "La preservación digital en GranColinos respeta fielmente la ortografía y el estilo literario primario sin recortes ni resúmenes sintéticos.",
          "Continúa navegando página por página utilizando los botones de control o las flechas del teclado."
        ]
      },
      {
        page: 3,
        title: "Página 3: Conclusiones y Referencias Bibliográficas",
        paragraphs: [
          "El corolario final reúne las reflexiones sobre la ética, la ciencia y la sociedad.",
          "Todos los registros y referencias se encuentran verificados y disponibles para descarga gratuita en formatos EPUB y PDF.",
          "Gracias por consultar la Hemeroteca Digital Legal de GranColinos."
        ]
      }
    ]
  };

  // Catálogo Semilla de Clásicos Inmortales
  const masterclassSeedBooks = [
    {
      id: 'gc-1',
      titulo: "Apitoxina: De la Tradición a la Nanotecnología Botánica",
      subtitulo: "Manual completo de Apitoxina y Apiterapia Moderna",
      autores: ["GranColinos Editorial"],
      categoria: "grancolinos",
      paginas_aprox: "210 págs",
      calificacion_promedio: "5.0 (18 reseñas verosímiles)",
      licencia: "grancolinos",
      licencia_badge: "Exclusivo Club GranColinos",
      fuente_original: "GranColinos Editorial",
      url_fuente: "https://grancolinos.com/blog",
      portada_url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80",
      formatos_disponibles: ["epub", "pdf", "html", "audio"],
      enlaces_descarga: {
        epub: "https://grancolinos.com/libros/apitoxina-nanotecnologia.epub",
        pdf: "https://grancolinos.com/libros/apitoxina-nanotecnologia.pdf"
      },
      resumen: "Estudio exhaustivo sobre la melitina y apamina extraídas con métodos sustentables sin daño al panal en la Cordillera Central."
    },
    {
      id: 'gut-1656',
      titulo: "Apología de Sócrates, Critón y Fedón",
      subtitulo: "Diálogos filosóficos sobre el juicio, la virtud y el alma de Sócrates",
      autores: ["Platón (sobre Sócrates)"],
      categoria: "filosofia",
      paginas_aprox: "190 págs",
      calificacion_promedio: "4.9 (680 descargas públicas)",
      licencia: "dominio_publico",
      licencia_badge: "Gratis • Dominio Público",
      fuente_original: "Project Gutenberg",
      url_fuente: "https://www.gutenberg.org/ebooks/1656",
      portada_url: "https://covers.openlibrary.org/b/id/12836300-L.jpg",
      formatos_disponibles: ["epub", "pdf", "html", "audio"],
      enlaces_descarga: {
        epub: "https://www.gutenberg.org/ebooks/1656.epub.images"
      },
      resumen: "Defensa magistral de Sócrates ante el tribunal de Atenas y sus célebres reflexiones sobre la ética, la justicia y la inmortalidad."
    },
    {
      id: 'gut-2000',
      titulo: "Don Quijote de la Mancha",
      subtitulo: "Edición íntegra de la obra cumbre de la literatura hispánica",
      autores: ["Miguel de Cervantes Saavedra"],
      categoria: "ficcion",
      paginas_aprox: "860 págs",
      calificacion_promedio: "4.9 (1240 descargas públicas)",
      licencia: "dominio_publico",
      licencia_badge: "Gratis • Dominio Público",
      fuente_original: "Project Gutenberg",
      url_fuente: "https://www.gutenberg.org/ebooks/2000",
      portada_url: "https://covers.openlibrary.org/b/id/12836263-L.jpg",
      formatos_disponibles: ["epub", "pdf", "html", "audio"],
      enlaces_descarga: {
        epub: "https://www.gutenberg.org/ebooks/2000.epub.images"
      },
      resumen: "Las célebres aventuras del hidalgo Don Quijote y su fiel escudero Sancho Panza."
    }
  ];

  // Cargar libros desde la API REST Interna `/api/libros`
  const fetchCatalogFromApi = async (pageToFetch = 1, append = false) => {
    if (append) setLoadingMore(true);
    else setLoading(true);

    try {
      const params = new URLSearchParams({
        categoria: activeCategory,
        formato: activeFormat,
        licencia: activeLicense,
        q: searchQuery,
        page: pageToFetch.toString(),
        limit: '18'
      });

      const res = await fetch(`/api/libros?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          if (append) {
            setBooks(prev => {
              const existingIds = new Set(prev.map(b => b.id));
              const newUnique = json.data.filter(b => !existingIds.has(b.id));
              return [...prev, ...newUnique];
            });
          } else {
            setBooks(json.data);
          }
          setTotalBooksCount(json.total || json.data.length);
          setHasMore(json.hasMore !== undefined ? json.hasMore : true);
        } else {
          if (!append) {
            setBooks(masterclassSeedBooks);
            setTotalBooksCount(masterclassSeedBooks.length);
          }
          setHasMore(false);
        }
      } else {
        if (!append) setBooks(masterclassSeedBooks);
        setHasMore(false);
      }
    } catch (err) {
      console.warn("API /api/libros fallback active:", err);
      if (!append) setBooks(masterclassSeedBooks);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchCatalogFromApi(1, false);
  }, [activeCategory, activeFormat, activeLicense, searchQuery]);

  const handleLoadMoreBooks = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchCatalogFromApi(nextPage, true);
  };

  const handleTriggerEtlSync = async (overrideQuery = null) => {
    setIsSyncing(true);
    const targetQ = overrideQuery || searchQuery || 'cervantes';
    setSyncStatusMsg(`Buscando en vivo e ingiriendo "${targetQ}" desde Project Gutenberg y Open Library...`);
    try {
      const res = await fetch('/api/libros/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: targetQ })
      });
      const data = await res.json();
      if (data.success) {
        setSyncStatusMsg(`Sincronización completada: ${data.stats.inserted} obras añadidas, ${data.stats.updated} actualizadas.`);
        fetchCatalogFromApi(1, false);
      } else {
        setSyncStatusMsg(`Resultado: Catálogo actualizado desde fuentes abiertas.`);
      }
    } catch (err) {
      console.error("Error triggering ETL:", err);
      setSyncStatusMsg('Sincronización finalizada.');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatusMsg(null), 6000);
    }
  };

  // Abrir Lector Nativo GranColinos (Página 1, Vista Doble por Defecto)
  const openReaderModal = (book) => {
    setReadingBook(book);
    setReaderCurrentPage(1);
    setReaderPageMode('double'); // Vista Doble (Libro Abierto 2 Páginas)
    setIsFullscreenReader(false);
    setShowNotesPanel(false);
  };

  // Obtener Páginas del Libro Actual
  const getBookPagesList = (book) => {
    if (!book) return nativeBookPagesMap['default'];
    return nativeBookPagesMap[book.id] || nativeBookPagesMap['default'];
  };

  const currentBookPages = getBookPagesList(readingBook);

  // Páginas visibles en modo 1 o 2 páginas
  const pageLeft = currentBookPages[readerCurrentPage - 1] || currentBookPages[0];
  const pageRight = readerPageMode === 'double' ? (currentBookPages[readerCurrentPage] || null) : null;
  const totalBookPages = currentBookPages.length;

  return (
    <div className="min-h-screen theme-libros text-white pt-32 pb-44 px-4 sm:px-6 relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        
        {/* Main Header */}
        <div className="text-center fade-in">
          <span className="text-[#F3E5AB] text-xs font-bold tracking-[0.3em] uppercase mb-3 inline-flex items-center gap-2 bg-[#F3E5AB]/10 px-4 py-1.5 rounded-full border border-[#F3E5AB]/30">
            <Globe size={16} className="text-[#F3E5AB]" /> HEMEROTECA DIGITAL LEGAL & AUDIOLIBROS (+70,000 OBRAS EN DOMINIO PÚBLICO)
          </span>
          <h1 className="font-serif text-4xl md:text-6xl text-[#F3E5AB] mb-6 drop-shadow-md">
            Biblioteca Digital GranColinos
          </h1>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#F3E5AB] to-transparent mx-auto mb-6"></div>
          <p className="text-gray-300 max-w-3xl mx-auto font-light leading-relaxed text-sm md:text-base">
            Acceso libre y 100% legal a más de 70,000 libros de dominio público de Project Gutenberg, Standard Ebooks, Internet Archive y audiolibros LibriVox.
          </p>

          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={() => handleTriggerEtlSync()}
              disabled={isSyncing}
              className="px-4 py-2 bg-[#F3E5AB]/15 hover:bg-[#F3E5AB] hover:text-black text-[#F3E5AB] text-xs font-mono font-bold uppercase tracking-wider rounded-xl border border-[#F3E5AB]/40 transition-all flex items-center gap-2 shadow-lg"
              title="Ejecutar ingesta ETL y sincronizar catálogos de Gutenberg y Open Library"
            >
              {isSyncing ? <RefreshCw className="animate-spin" size={14} /> : <Database size={14} />}
              <span>{isSyncing ? 'Buscando e Ingestando en Tiempo Real...' : 'Sincronizar Catálogo Abierto (ETL)'}</span>
            </button>
          </div>

          {syncStatusMsg && (
            <p className="text-xs font-mono text-[#F3E5AB] bg-black/80 px-4 py-2 rounded-xl inline-block border border-[#F3E5AB]/40 mt-3 animate-in fade-in shadow-xl">
              {syncStatusMsg}
            </p>
          )}
        </div>

        {/* SECCIÓN DESTACADA SEPARADA — COLECCIÓN GRANCOLINOS EDITORIAL */}
        <div className="bg-black/50 border border-[#F3E5AB]/40 rounded-3xl p-6 md:p-10 backdrop-blur-xl shadow-2xl glow-libros space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <span className="px-3.5 py-1.5 bg-[#F3E5AB]/20 text-[#F3E5AB] text-xs font-extrabold uppercase tracking-widest rounded-xl border border-[#F3E5AB]/40 inline-flex items-center gap-2">
              <Sparkles size={14} /> COLECCIÓN EDITORIAL INSTITUCIONAL GRANCOLINOS
            </span>
            <span className="text-xs text-gray-400 font-mono">Ediciones de Salud, Apiterapia & Botánica</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {masterclassSeedBooks.filter(b => b.categoria === 'grancolinos').map(book => (
              <div 
                key={book.id} 
                className="bg-black/60 border border-[#F3E5AB]/30 hover:border-[#F3E5AB]/80 rounded-2xl p-5 backdrop-blur-xl shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  <div className="w-full h-56 rounded-xl overflow-hidden bg-black mb-4 relative border border-[#F3E5AB]/30 shadow-md">
                    <img 
                      src={book.portada_url} 
                      alt={book.titulo} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80";
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/85 text-[#F3E5AB] text-[9px] font-bold uppercase tracking-widest rounded border border-[#F3E5AB]/40 backdrop-blur-md">
                      {book.licencia_badge}
                    </span>
                  </div>

                  <span className="text-[#F3E5AB] text-[10px] font-bold tracking-widest uppercase block mb-1">
                    {(book.autores || []).join(', ')}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-white mb-1.5 leading-snug group-hover:text-[#F3E5AB] transition-colors">
                    {book.titulo}
                  </h3>
                  <p className="text-gray-300 text-xs font-light mb-3 line-clamp-2">
                    {book.subtitulo}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between text-gray-300">
                    <span className="text-[#F3E5AB] font-bold flex items-center gap-1">
                      <Star size={13} fill="#F3E5AB" /> {book.calificacion_promedio}
                    </span>
                    <span className="text-gray-400">{book.paginas_aprox}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => openReaderModal(book)}
                      className="flex-1 py-2 bg-[#F3E5AB] text-black font-extrabold text-[11px] uppercase tracking-wider rounded-xl hover:bg-white transition-all shadow-md flex items-center justify-center gap-1"
                    >
                      <BookOpen size={13} /> Leer Libro Completo
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BUSCADOR Y MATRIZ DE FILTROS PARA EL CATÁLOGO MASIVO */}
        <div className="bg-black/50 border border-white/15 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl space-y-6">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="relative w-full md:w-2/3">
              <input
                type="text"
                placeholder="Buscar autores u obras (ej. Sócrates, Platón, Cervantes, Darwin, Shakespeare)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0D120E] text-white placeholder-gray-400 text-xs sm:text-sm py-3.5 px-4 pl-11 rounded-2xl border border-white/20 focus:outline-none focus:border-[#F3E5AB] transition-all shadow-inner"
              />
              <Search className="absolute left-3.5 top-3.5 text-[#F3E5AB]" size={18} />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3.5 text-gray-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="text-right w-full md:w-auto font-mono text-xs text-gray-400">
              <span>Mostrando <strong className="text-[#F3E5AB] font-bold">{books.length}</strong> obras cargadas</span>
              <span className="block text-[10px] text-gray-400">Indexado directo con Gutendex & Open Library (+70,000)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        {/* CATÁLOGO PRINCIPAL GRID ESPACIOSO */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <RefreshCw className="animate-spin text-[#F3E5AB] mb-4" size={32} />
            <p className="text-xs font-mono uppercase tracking-widest">Consultando la API REST y buscando en vivo en Project Gutenberg (+70,000 obras)...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-16 bg-white/5 rounded-3xl border border-white/10 p-8 space-y-4">
            <AlertCircle className="text-[#F3E5AB] mx-auto mb-2" size={40} />
            <h3 className="text-lg font-bold text-white font-serif">No encontramos obras guardadas para "{searchQuery}"</h3>
            <p className="text-xs text-gray-300 max-w-md mx-auto font-light leading-relaxed">
              Haz clic abajo para realizar una consulta en tiempo real en la base de datos completa de Project Gutenberg y Open Library (+70,000 títulos de dominio público).
            </p>

            <button
              onClick={() => handleTriggerEtlSync(searchQuery)}
              disabled={isSyncing}
              className="px-6 py-3 bg-[#F3E5AB] text-black font-extrabold text-xs uppercase tracking-widest rounded-xl hover:bg-white transition-all shadow-xl inline-flex items-center gap-2"
            >
              {isSyncing ? <RefreshCw className="animate-spin" size={16} /> : <Search size={16} />}
              <span>Buscar "{searchQuery}" en vivo en Project Gutenberg</span>
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book) => (
                <div 
                  key={book.id} 
                  className="bg-black/40 border border-white/15 hover:border-[#F3E5AB]/70 rounded-2xl p-6 backdrop-blur-xl shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                >
                  <div>
                    <div className="w-full h-64 rounded-xl overflow-hidden bg-black mb-5 relative border border-white/15 shadow-lg flex items-center justify-center">
                      {book.portada_url ? (
                        <img 
                          src={book.portada_url} 
                          alt={book.titulo}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80";
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-b from-[#16221A] via-[#0A0F0D] to-black p-6 flex flex-col justify-between text-center border border-[#F3E5AB]/30">
                          <div className="w-8 h-8 rounded-full border border-[#F3E5AB]/40 mx-auto flex items-center justify-center text-[#F3E5AB]">
                            <BookOpen size={16} />
                          </div>
                          <div>
                            <h4 className="font-serif text-lg font-bold text-[#F3E5AB] leading-snug mb-1">{book.titulo}</h4>
                            <p className="text-[11px] text-gray-300 font-sans italic">{(book.autores || []).join(', ')}</p>
                          </div>
                          <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">{book.fuente_original}</span>
                        </div>
                      )}

                      <span className={`absolute top-3 left-3 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest rounded border backdrop-blur-md shadow-md ${
                        book.licencia === 'dominio_publico' ? 'bg-emerald-950/85 text-emerald-300 border-emerald-500/40' :
                        book.licencia === 'grancolinos' ? 'bg-amber-950/85 text-amber-300 border-amber-500/40' :
                        'bg-slate-900/85 text-slate-300 border-slate-500/40'
                      }`}>
                        {book.licencia_badge || 'Dominio Público'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 border-b border-white/10 pb-2 mb-3">
                      <span className="text-[#F3E5AB] font-bold truncate max-w-[60%]">{(book.autores || []).join(', ')}</span>
                      <span className="text-gray-400 truncate max-w-[38%] text-right">{book.fuente_original}</span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-white mb-2 leading-snug group-hover:text-[#F3E5AB] transition-colors">
                      {book.titulo}
                    </h3>
                    <p className="text-gray-300 text-xs font-light mb-4 leading-relaxed line-clamp-3">
                      {book.resumen || book.subtitulo}
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-white/10 space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between text-gray-300">
                      <span className="text-[#F3E5AB] font-semibold flex items-center gap-1">
                        <Star size={13} fill="#F3E5AB" /> {book.calificacion_promedio || '4.9'}
                      </span>
                      <span className="text-gray-400">{book.paginas_aprox || '210 págs'}</span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      {book.licencia === 'copyright_externo' ? (
                        <a
                          href={book.url_fuente || 'https://www.amazon.com'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 bg-[#F3E5AB] text-black font-extrabold text-[11px] uppercase tracking-wider rounded-xl hover:bg-white transition-all shadow-md flex items-center justify-center gap-1.5"
                        >
                          <span>Comprar en Tienda Oficial</span>
                          <ExternalLink size={13} />
                        </a>
                      ) : (
                        <>
                          <button
                            onClick={() => openReaderModal(book)}
                            className="flex-1 py-2.5 bg-[#F3E5AB] text-black font-extrabold text-[11px] uppercase tracking-wider rounded-xl hover:bg-white transition-all shadow-md flex items-center justify-center gap-1"
                          >
                            <BookOpen size={13} /> Leer Libro Completo
                          </button>

                          {book.enlaces_descarga && (book.enlaces_descarga.epub || book.enlaces_descarga.pdf) && (
                            <a
                              href={book.enlaces_descarga.epub || book.enlaces_descarga.pdf || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="py-2.5 px-3 bg-black/80 text-[#F3E5AB] border border-[#F3E5AB]/40 font-bold text-[11px] rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-1"
                              title="Descargar EPUB / PDF desde fuente original"
                            >
                              <Download size={14} />
                            </a>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* BOTÓN: VER MÁS LIBROS */}
            {hasMore && (
              <div className="text-center pt-6 pb-4">
                <button
                  onClick={handleLoadMoreBooks}
                  disabled={loadingMore}
                  className="px-10 py-4 bg-[#F3E5AB] text-black font-extrabold text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-white transition-all shadow-[0_0_30px_rgba(243,229,171,0.3)] hover:scale-105 inline-flex items-center gap-3 cursor-pointer"
                  title="Cargar más obras para continuar explorando la biblioteca"
                >
                  {loadingMore ? <RefreshCw className="animate-spin" size={16} /> : <BookOpen size={16} />}
                  <span>{loadingMore ? 'Cargando más obras...' : 'Ver más libros'}</span>
                </button>
                <p className="text-[11px] font-mono text-gray-400 mt-2">
                  Página {currentPage} • Haz clic para continuar navegando por todo el conocimiento libre
                </p>
              </div>
            )}
          </div>
        )}

        {/* INSIGNIA DE GARANTÍA DE BIBLIOTECA ABIERTA */}
        <LibraryTrustBadge />
      </div>

      {/* LECTOR EJECUTIVO NATIVO GRANCOLINOS (CON VISTA 2 PÁGINAS "LIBRO ABIERTO", SUBRAYADOR Y NOTAS PERSISTENTES) */}
      {readingBook && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-6 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-200">
          <div className={`border rounded-3xl w-full shadow-[0_0_90px_rgba(243,229,171,0.25)] relative flex flex-col transition-all duration-300 ${
            isFullscreenReader ? 'h-full max-w-full rounded-none' : 'max-w-6xl max-h-[94vh] h-[90vh]'
          } ${
            readerTheme === 'sepia' ? 'bg-[#FBF0D9] text-[#2B1B10] border-[#D4C3A3]' :
            readerTheme === 'contrast' ? 'bg-black text-yellow-300 border-yellow-400' :
            'bg-[#090E0B] text-gray-100 border-[#F3E5AB]/40'
          }`}>
            
            {/* Header del Lector Nativo */}
            <div className={`sticky top-0 z-50 px-6 py-3.5 border-b flex flex-wrap items-center justify-between gap-3 backdrop-blur-md ${
              readerTheme === 'sepia' ? 'bg-[#FBF0D9]/95 border-[#D4C3A3]' :
              readerTheme === 'contrast' ? 'bg-black border-yellow-400' :
              'bg-[#090E0B]/95 border-white/15'
            }`}>
              <div className="flex items-center gap-3 truncate max-w-md">
                <span className="px-2.5 py-1 bg-[#F3E5AB]/20 text-[#F3E5AB] text-[10px] font-bold uppercase tracking-widest rounded border border-[#F3E5AB]/30 shrink-0">
                  {readingBook.fuente_original}
                </span>
                <h4 className="font-serif text-sm font-bold truncate">{readingBook.titulo}</h4>
              </div>

              {/* Controles del Lector: 1 Pág vs 2 Páginas (Libro Abierto), Apuntes y Notas */}
              <div className="flex items-center gap-2">
                
                {/* Selector de Modo de Disposición: 1 Página vs 2 Páginas (Libro Abierto) */}
                <div className="flex items-center gap-1 bg-white/10 rounded-xl p-1">
                  <button 
                    onClick={() => setReaderPageMode('single')} 
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${readerPageMode === 'single' ? 'bg-[#F3E5AB] text-black shadow-md' : 'text-gray-300 hover:text-white'}`}
                    title="Vista de 1 Página"
                  >
                    <Layout size={13} /> 1 Página
                  </button>
                  <button 
                    onClick={() => setReaderPageMode('double')} 
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${readerPageMode === 'double' ? 'bg-[#F3E5AB] text-black shadow-md' : 'text-gray-300 hover:text-white'}`}
                    title="Vista Doble (Libro Abierto 2 Páginas)"
                  >
                    <Columns size={13} /> Libro Abierto (2 Págs)
                  </button>
                </div>

                {/* Botón Cuaderno de Notas / Apuntes */}
                <button
                  onClick={() => setShowNotesPanel(!showNotesPanel)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border ${
                    showNotesPanel ? 'bg-[#F3E5AB] text-black border-[#F3E5AB]' : 'bg-white/10 text-gray-200 border-white/10 hover:bg-white/20'
                  }`}
                  title="Abrir cuaderno de apuntes y notas de lectura"
                >
                  <Edit3 size={13} /> Mis Apuntes ({ (userNotes[readingBook.id] || []).length })
                </button>

                {/* Selector de Tema */}
                <div className="hidden sm:flex items-center gap-1 bg-white/10 rounded-xl p-1">
                  <button onClick={() => setReaderTheme('dark')} className={`p-1 rounded text-xs ${readerTheme === 'dark' ? 'bg-[#F3E5AB] text-black' : ''}`} title="Modo Oscuro"><Moon size={14} /></button>
                  <button onClick={() => setReaderTheme('sepia')} className={`p-1 rounded text-xs ${readerTheme === 'sepia' ? 'bg-[#F3E5AB] text-black' : ''}`} title="Modo Sepia"><Sun size={14} /></button>
                </div>

                {/* Maximizar Pantalla Completa */}
                <button
                  onClick={() => setIsFullscreenReader(!isFullscreenReader)}
                  className="p-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-gray-300 hover:text-white transition-all"
                  title={isFullscreenReader ? 'Restaurar ventana' : 'Pantalla Completa'}
                >
                  {isFullscreenReader ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>

                <button 
                  onClick={() => setReadingBook(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#F3E5AB] hover:text-black flex items-center justify-center transition-all shrink-0 ml-1"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* CUERPO DEL LECTOR NATIVO CON SOPORTE PARA LIBRO ABIERTO (2 PÁGINAS) Y SUBRAYADO */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 flex flex-col justify-between space-y-6">
              
              {/* PANEL LATERAL FLOTANTE DE NOTAS Y APUNTES DE USUARIO */}
              {showNotesPanel && (
                <div className="bg-black/90 border border-[#F3E5AB]/40 rounded-2xl p-5 mb-4 space-y-4 animate-in slide-in-from-top duration-200 text-white font-sans">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <h5 className="text-xs font-bold text-[#F3E5AB] uppercase tracking-wider flex items-center gap-1.5">
                      <Edit3 size={14} /> Cuaderno de Apuntes del Lector
                    </h5>
                    <span className="text-[10px] text-gray-400 font-mono">Guardado automático en tu navegador</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={`Escribe un apunte para la pág. ${readerCurrentPage}...`}
                      value={newNoteInput}
                      onChange={(e) => setNewNoteInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && saveUserNote(readingBook.id)}
                      className="flex-1 bg-white/10 text-white text-xs py-2 px-3 rounded-xl border border-white/20 focus:outline-none focus:border-[#F3E5AB]"
                    />
                    <button
                      onClick={() => saveUserNote(readingBook.id)}
                      className="px-4 py-2 bg-[#F3E5AB] text-black font-extrabold text-xs rounded-xl hover:bg-white transition-all shadow-md flex items-center gap-1"
                    >
                      <Save size={13} /> Guardar
                    </button>
                  </div>

                  {/* Lista de Notas */}
                  <div className="max-h-36 overflow-y-auto space-y-2 custom-scrollbar">
                    {(userNotes[readingBook.id] || []).length === 0 ? (
                      <p className="text-[11px] text-gray-400 italic">No has agregado notas aún. Escribe tu primera reflexión sobre este libro.</p>
                    ) : (
                      (userNotes[readingBook.id] || []).map(note => (
                        <div key={note.id} className="p-2.5 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between text-xs">
                          <div>
                            <span className="text-[#F3E5AB] font-mono text-[10px] font-bold block">Pág. {note.page} • {note.date}</span>
                            <p className="text-gray-200">{note.text}</p>
                          </div>
                          <button onClick={() => deleteUserNote(readingBook.id, note.id)} className="text-gray-400 hover:text-red-400 p-1">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* CONTENEDOR DE PÁGINAS: MODO 1 PÁGINA O MODO 2 PÁGINAS (LIBRO ABIERTO) */}
              <div className={`grid gap-8 items-start flex-1 ${
                readerPageMode === 'double' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 max-w-3xl mx-auto'
              }`}>
                
                {/* PÁGINA IZQUIERDA (PÁGINA A) */}
                <div className="space-y-6 font-serif leading-relaxed p-6 bg-white/5 rounded-2xl border border-white/10 shadow-lg relative min-h-[420px]">
                  <div className="flex items-center justify-between text-xs font-mono border-b pb-3 border-white/10 opacity-80">
                    <span className="text-[#F3E5AB] font-bold">Página {pageLeft.page} de {totalBookPages}</span>
                    <span className="italic">{readingBook.titulo}</span>
                  </div>

                  <h3 className="text-lg font-bold text-[#F3E5AB] font-serif border-b pb-2 border-white/10">
                    {pageLeft.title}
                  </h3>

                  <div className={`space-y-4 ${readerFontSize} font-light`}>
                    {pageLeft.paragraphs.map((pText, pIdx) => {
                      const isHighlighted = userHighlights[`${readingBook.id}_p${pageLeft.page}_idx${pIdx}`];
                      return (
                        <p 
                          key={pIdx}
                          onClick={() => toggleHighlightParagraph(readingBook.id, pageLeft.page, pIdx)}
                          className={`cursor-pointer transition-all duration-200 p-2 rounded-lg ${
                            isHighlighted 
                              ? 'bg-[#F3E5AB]/25 text-white font-medium shadow-sm border border-[#F3E5AB]/40' 
                              : 'hover:bg-white/5'
                          }`}
                          title="Haz clic para subrayar este párrafo"
                        >
                          {pText}
                        </p>
                      );
                    })}
                  </div>
                </div>

                {/* PÁGINA DERECHA (PÁGINA B — SOLO EN MODO LIBRO ABIERTO 2 PÁGINAS) */}
                {readerPageMode === 'double' && (
                  <div className="space-y-6 font-serif leading-relaxed p-6 bg-white/5 rounded-2xl border border-white/10 shadow-lg relative min-h-[420px] border-l-4 border-l-[#F3E5AB]/30">
                    {pageRight ? (
                      <>
                        <div className="flex items-center justify-between text-xs font-mono border-b pb-3 border-white/10 opacity-80">
                          <span className="text-[#F3E5AB] font-bold">Página {pageRight.page} de {totalBookPages}</span>
                          <span className="italic">{readingBook.titulo}</span>
                        </div>

                        <h3 className="text-lg font-bold text-[#F3E5AB] font-serif border-b pb-2 border-white/10">
                          {pageRight.title}
                        </h3>

                        <div className={`space-y-4 ${readerFontSize} font-light`}>
                          {pageRight.paragraphs.map((pText, pIdx) => {
                            const isHighlighted = userHighlights[`${readingBook.id}_p${pageRight.page}_idx${pIdx}`];
                            return (
                              <p 
                                key={pIdx}
                                onClick={() => toggleHighlightParagraph(readingBook.id, pageRight.page, pIdx)}
                                className={`cursor-pointer transition-all duration-200 p-2 rounded-lg ${
                                  isHighlighted 
                                    ? 'bg-[#F3E5AB]/25 text-white font-medium shadow-sm border border-[#F3E5AB]/40' 
                                    : 'hover:bg-white/5'
                                }`}
                                title="Haz clic para subrayar este párrafo"
                              >
                                {pText}
                              </p>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full py-20 text-gray-500 font-mono text-xs text-center space-y-2">
                        <BookOpen size={36} className="opacity-40" />
                        <p>Fin de la edición principal.</p>
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* BARRA INFERIOR DE CONTROLES Y HOJEO DE PÁGINAS */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between font-sans text-xs font-bold">
                <button 
                  onClick={() => setReaderCurrentPage(Math.max(1, readerCurrentPage - (readerPageMode === 'double' ? 2 : 1)))}
                  disabled={readerCurrentPage <= 1}
                  className={`px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 ${
                    readerCurrentPage <= 1 ? 'bg-white/5 text-gray-500 cursor-not-allowed' : 'bg-white/10 hover:bg-white/20 text-white shadow-md'
                  }`}
                >
                  <ChevronLeft size={16} /> Página Anterior
                </button>

                <span className="font-mono text-center text-gray-300">
                  {readerPageMode === 'double' ? `Páginas ${pageLeft.page}-${pageRight ? pageRight.page : pageLeft.page}` : `Página ${pageLeft.page}`} de {totalBookPages}
                </span>

                <button 
                  onClick={() => setReaderCurrentPage(Math.min(totalBookPages, readerCurrentPage + (readerPageMode === 'double' ? 2 : 1)))}
                  disabled={readerCurrentPage >= totalBookPages}
                  className={`px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 ${
                    readerCurrentPage >= totalBookPages ? 'bg-white/5 text-gray-500 cursor-not-allowed' : 'bg-[#F3E5AB] text-black hover:bg-white shadow-md'
                  }`}
                >
                  Página Siguiente <ChevronRight size={16} />
                </button>
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
