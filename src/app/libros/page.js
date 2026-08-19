'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { BookOpen, Bookmark, ArrowRight, Star, Book, FileText, Award, Download, Play, Pause, Volume2, Search, Filter, Globe, ShieldCheck, RefreshCw, X, ExternalLink, Headphones, Sparkles, Check, ChevronRight, Layers, Sliders, Type, Sun, Moon, Database, AlertCircle, ChevronLeft, Maximize2, Minimize2, Highlighting, Highlighter, MessageSquare, Edit3, Columns, Layout, Trash2, Save, Palette, PenTool, Eraser, RotateCcw, Lock, GraduationCap } from 'lucide-react';
import MaintenanceGuard from '../../components/MaintenanceGuard';

// Componente Especial de Garantía y Acceso Abierto para la Biblioteca
function LibraryTrustBadge() {
  return (
    <div className="w-full bg-[#051208]/85 border border-[#D4AF37]/40 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl my-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/35 flex items-center justify-center text-[#D4AF37] shrink-0">
            <Globe size={22} />
          </div>
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">Acceso Abierto & Dominio Público</h5>
            <p className="text-[11px] text-gray-300">Catálogo 100% legal e indexación libre sin restricciones de suscripción</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/35 flex items-center justify-center text-[#D4AF37] shrink-0">
            <BookOpen size={22} />
          </div>
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">Calidad Tipográfica & Preservación</h5>
            <p className="text-[11px] text-gray-300">Textos originales escaneados e indexados desde Gutenberg & Open Library</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/35 flex items-center justify-center text-[#D4AF37] shrink-0">
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

// COMPONENTE DE LÁPIZ LIBRE DE DIBUJO Y SUBRAYADO CANVAS
function FreehandPenCanvas({ color, strokeWidth, isPenActive, pageKey }) {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const lastPoint = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    try {
      const savedDrawing = localStorage.getItem(`grancolinos_drawing_${pageKey}`);
      if (savedDrawing) {
        const img = new Image();
        img.onload = () => ctx.drawImage(img, 0, 0);
        img.src = savedDrawing;
      }
    } catch (e) {}
  }, [pageKey]);

  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const dataUrl = canvas.toDataURL();
      localStorage.setItem(`grancolinos_drawing_${pageKey}`, dataUrl);
    } catch (e) {}
  };

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    if (!isPenActive) return;
    isDrawing.current = true;
    lastPoint.current = getCoordinates(e);
  };

  const draw = (e) => {
    if (!isDrawing.current || !isPenActive) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const currentPoint = getCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(currentPoint.x, currentPoint.y);

    if (color === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = strokeWidth * 3;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
      ctx.lineWidth = strokeWidth;
      ctx.globalAlpha = 0.5;
    }

    ctx.stroke();
    lastPoint.current = currentPoint;
  };

  const stopDrawing = () => {
    if (isDrawing.current) {
      isDrawing.current = false;
      saveCanvasState();
    }
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      onTouchStart={startDrawing}
      onTouchMove={draw}
      onTouchEnd={stopDrawing}
      className={`absolute inset-0 z-20 w-full h-full ${
        isPenActive ? 'cursor-crosshair pointer-events-auto' : 'pointer-events-none'
      }`}
    />
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
  const [loadingFullBookText, setLoadingFullBookText] = useState(false);
  const [activeFullBookPages, setActiveFullBookPages] = useState([]);
  const [isBookCopyrighted, setIsBookCopyrighted] = useState(false);
  const [readerCurrentPage, setReaderCurrentPage] = useState(1);
  const [readerPageMode, setReaderPageMode] = useState('double');
  const [isFullscreenReader, setIsFullscreenReader] = useState(false);
  const [readerFontSize, setReaderFontSize] = useState('text-base');
  const [readerTheme, setReaderTheme] = useState('dark');

  // Lápiz Libre de Dibujo y Subrayado Canvas
  const [isPenActive, setIsPenActive] = useState(false);
  const [penColor, setPenColor] = useState('#D4AF37');
  const [penStrokeWidth, setPenStrokeWidth] = useState(8);
  const [isEraser, setIsEraser] = useState(false);

  // Subrayado Multicolores de Párrafo y Notas
  const [activeHighlightColor, setActiveHighlightColor] = useState('gold');
  const [userHighlights, setUserHighlights] = useState({});
  const [userNotes, setUserNotes] = useState({});
  const [newNoteInput, setNewNoteInput] = useState('');
  const [showNotesPanel, setShowNotesPanel] = useState(false);

  // Estado del Catálogo y la API Interna
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState(null);

  // Paleta de Colores
  const highlightColorStyles = {
    gold: { name: 'Dorado', hex: '#D4AF37', bg: 'bg-[#D4AF37]/30 text-white border-[#D4AF37]/60 shadow-[0_0_12px_rgba(212,175,55,0.2)]', dot: 'bg-[#D4AF37]' },
    emerald: { name: 'Esmeralda', hex: '#10B981', bg: 'bg-emerald-500/30 text-emerald-100 border-emerald-400/60 shadow-[0_0_12px_rgba(16,185,129,0.2)]', dot: 'bg-emerald-400' },
    cyan: { name: 'Cian', hex: '#06B6D4', bg: 'bg-cyan-500/30 text-cyan-100 border-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.2)]', dot: 'bg-cyan-400' },
    purple: { name: 'Púrpura', hex: '#A855F7', bg: 'bg-purple-500/30 text-purple-100 border-purple-400/60 shadow-[0_0_12px_rgba(168,85,247,0.2)]', dot: 'bg-purple-400' },
    coral: { name: 'Coral', hex: '#F43F5E', bg: 'bg-rose-500/30 text-rose-100 border-rose-400/60 shadow-[0_0_12px_rgba(244,63,94,0.2)]', dot: 'bg-rose-400' }
  };

  // Categorías
  const categories = [
    { id: 'todas', name: 'Todas las Categorías' },
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
    { id: 'copyright_externo', name: 'Tienda Externa Licenciada' }
  ];

  // DESCARGA AUTOMÁTICA DIRECTA DE PDF SIN REDIRECCIONES EXTERNAS NI PESTAÑAS
  const handleDownloadAcademicPdf = (book) => {
    if (!book) return;
    const authorStr = (book.autores || []).join(', ');
    const targetUrl = book.enlaces_descarga?.pdf || '';

    // Disparar la API de descarga directa que sirve el buffer del archivo .PDF al ordenador del usuario
    const downloadApiUrl = `/api/libros/download?id=${encodeURIComponent(book.id)}&title=${encodeURIComponent(book.titulo)}&author=${encodeURIComponent(authorStr)}&url=${encodeURIComponent(targetUrl)}`;
    
    // Iniciar descarga automática transparente en navegador
    window.location.href = downloadApiUrl;
  };

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

  const toggleHighlightParagraph = (bookId, pageNum, paragraphIdx) => {
    const key = `${bookId}_p${pageNum}_idx${paragraphIdx}`;
    const currentVal = userHighlights[key];
    const nextVal = currentVal === activeHighlightColor ? null : activeHighlightColor;

    const updated = {
      ...userHighlights,
      [key]: nextVal
    };
    setUserHighlights(updated);
    try {
      localStorage.setItem('grancolinos_user_highlights', JSON.stringify(updated));
    } catch (e) {}
  };

  // Base de Datos de Obras Clásicas Semilla
  const seedRealBookPages = {
    'gut-1656': [
      {
        page: 1,
        title: "Apología de Sócrates — Discurso I ante el Tribunal de Atenas",
        paragraphs: [
          "Cualquiera que haya sido la impresión que mis acusadores hayan causado en vosotros, oh atenienses, por mi parte, confieso que casi me he desconocido a mí mismo, tan persuasivamente han hablado. Sin embargo, puedo asegurar que no han dicho ni una sola palabra que sea verdadera.",
          "De entre sus muchas mentiras, una me ha admirado sobremanera: aquella en que decían que debíais tener cuidado de no dejaros engañar por mí, porque soy un orador hábil.",
          "El decir esto, cuando debían saber que la prueba de lo contrario iba a ser evidente, pues en cuanto abriese la boca se vería que no soy orador en modo alguno, a no ser que llamen orador al que dice la verdad, me ha parecido el colmo de la impudicia."
        ]
      },
      {
        page: 2,
        title: "Apología de Sócrates — Discurso II: El Oráculo de Delfos",
        paragraphs: [
          "Si es esto lo que quieren decir, confieso que soy orador, pero no a su manera. Ellos, lo repito, no han dicho nada verdadero; de mí, en cambio, oiréis la verdad toda entera.",
          "Mas, por Zeus, atenienses, no oiréis discursos adornados de bellas frases y palabras esmeradamente escogidas, como los suyos, sino cosas dichas al azar, con las primeras palabras que me vengan a la boca, porque tengo la confianza de que es justo lo que digo.",
          "Quien me dio testimonio de mi sabiduría fue el oráculo de Delfos. Querefonte, mi amigo de la infancia, fue a Delfos y tuvo la osadía de consultar si había alguien más sabio que yo. La Pitia respondió que no había nadie más sabio."
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
      }
    ]
  };

  // Catálogo Semilla de Clásicos Inmortales
  const masterclassSeedBooks = [
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
          setHasMore(json.hasMore !== undefined ? json.hasMore : true);
        } else {
          if (!append) setBooks(masterclassSeedBooks);
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

  const openReaderModal = async (book) => {
    setReadingBook(book);
    setReaderCurrentPage(1);
    setReaderPageMode('double');
    setIsFullscreenReader(false);
    setShowNotesPanel(false);
    setIsPenActive(false);
    setIsBookCopyrighted(false);
    setLoadingFullBookText(true);

    try {
      const targetUrl = book.enlaces_descarga?.html || book.url_fuente || '';
      const readRes = await fetch(`/api/libros/read?id=${encodeURIComponent(book.id)}&url=${encodeURIComponent(targetUrl)}`);
      
      if (readRes.ok) {
        const readJson = await readRes.json();
        
        if (readJson.isCopyrighted) {
          setIsBookCopyrighted(true);
          setActiveFullBookPages([]);
        } else if (readJson.pages && readJson.pages.length > 0) {
          setIsBookCopyrighted(false);
          setActiveFullBookPages(readJson.pages);
        } else if (seedRealBookPages[book.id]) {
          setIsBookCopyrighted(false);
          setActiveFullBookPages(seedRealBookPages[book.id]);
        } else {
          setIsBookCopyrighted(true);
          setActiveFullBookPages([]);
        }
      } else {
        if (seedRealBookPages[book.id]) {
          setIsBookCopyrighted(false);
          setActiveFullBookPages(seedRealBookPages[book.id]);
        } else {
          setIsBookCopyrighted(true);
        }
      }
    } catch (err) {
      console.warn("Full text ingestion error:", err);
      if (seedRealBookPages[book.id]) {
        setIsBookCopyrighted(false);
        setActiveFullBookPages(seedRealBookPages[book.id]);
      } else {
        setIsBookCopyrighted(true);
      }
    } finally {
      setLoadingFullBookText(false);
    }
  };

  const currentBookPages = activeFullBookPages;
  const pageLeft = currentBookPages[readerCurrentPage - 1] || null;
  const pageRight = readerPageMode === 'double' ? (currentBookPages[readerCurrentPage] || null) : null;
  const totalBookPages = currentBookPages.length;

  return (
    <div className="min-h-screen theme-libros text-white pt-32 pb-44 px-4 sm:px-6 relative overflow-hidden select-none">
      
      {/* Fondo de Estética Cuero Botánico Verde Esmeralda & Dorado GranColinos */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#D4AF37]/15 via-[#020502] to-black opacity-90 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        
        {/* Main Header */}
        <div className="text-center fade-in">
          <span className="text-[#D4AF37] text-xs font-mono font-extrabold tracking-[0.3em] uppercase mb-3 inline-flex items-center gap-2 bg-[#D4AF37]/15 px-4 py-1.5 rounded-full border border-[#D4AF37]/40 shadow-md">
            <Globe size={16} className="text-[#D4AF37]" /> HEMEROTECA DIGITAL LEGAL & AUDIOLIBROS (+70,000 OBRAS EN DOMINIO PÚBLICO)
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-black text-gold-gradient uppercase tracking-tight drop-shadow-[0_4px_30px_rgba(212,175,55,0.4)] mb-6">
            Biblioteca Digital GranColinos
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-6 rounded-full shadow-[0_0_12px_rgba(212,175,55,0.8)]"></div>
          <p className="text-gray-200 max-w-3xl mx-auto font-light leading-relaxed text-sm md:text-base">
            Acceso libre y 100% legal a más de 70,000 libros de dominio público de Project Gutenberg, Standard Ebooks, Internet Archive y audiolibros LibriVox.
          </p>

          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={() => handleTriggerEtlSync()}
              disabled={isSyncing}
              className="px-5 py-2.5 bg-[#D4AF37]/15 hover:bg-gradient-to-r hover:from-[#D4AF37] hover:to-[#AA7C11] hover:text-black text-[#D4AF37] text-xs font-mono font-extrabold uppercase tracking-wider rounded-xl border border-[#D4AF37]/40 transition-all flex items-center gap-2 shadow-lg"
              title="Ejecutar ingesta ETL y sincronizar catálogos de Gutenberg y Open Library"
            >
              {isSyncing ? <RefreshCw className="animate-spin" size={14} /> : <Database size={14} />}
              <span>{isSyncing ? 'Buscando e Ingestando en Tiempo Real...' : 'Sincronizar Catálogo Abierto (ETL)'}</span>
            </button>
          </div>

          {syncStatusMsg && (
            <p className="text-xs font-mono text-[#D4AF37] bg-[#030904]/90 px-4 py-2 rounded-xl inline-block border border-[#D4AF37]/40 mt-3 animate-in fade-in shadow-xl">
              {syncStatusMsg}
            </p>
          )}
        </div>

        {/* BUSCADOR Y MATRIZ DE FILTROS PARA EL CATÁLOGO MASIVO */}
        <div className="bg-[#051208]/85 border border-[#D4AF37]/40 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl space-y-6">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="relative w-full md:w-2/3">
              <input
                id="libros-search-input"
                name="searchQuery"
                type="text"
                placeholder="Buscar autores u obras (ej. Sócrates, Platón, Cervantes, Darwin, Shakespeare)..."
                aria-label="Buscar autores u obras"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#030904] text-white placeholder-gray-400 text-xs sm:text-sm py-3.5 px-4 pl-11 rounded-2xl border border-white/20 focus:outline-none focus:border-[#D4AF37] transition-all shadow-inner font-mono"
              />
              <Search className="absolute left-3.5 top-3.5 text-[#D4AF37]" size={18} />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3.5 text-gray-400 hover:text-white"
                  aria-label="Limpiar búsqueda"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="text-right w-full md:w-auto font-mono text-xs text-gray-400">
              <span>Mostrando <strong className="text-[#D4AF37] font-bold">{books.length}</strong> obras cargadas</span>
              <span className="block text-[10px] text-gray-400">Indexado directo con Gutendex & Open Library (+70,000)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 font-mono uppercase tracking-wider block flex items-center gap-1">
                <Filter size={12} className="text-[#D4AF37]" /> Categoría Temática
              </label>
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="w-full bg-[#030904] text-[#D4AF37] text-xs font-semibold py-2.5 px-3 rounded-xl border border-white/20 appearance-none focus:outline-none focus:border-[#D4AF37] cursor-pointer truncate"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id} title={c.name} className="bg-[#030904] text-white">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 font-mono uppercase tracking-wider block flex items-center gap-1">
                <Layers size={12} className="text-[#D4AF37]" /> Formato Disponible
              </label>
              <select
                value={activeFormat}
                onChange={(e) => setActiveFormat(e.target.value)}
                className="w-full bg-[#030904] text-[#D4AF37] text-xs font-semibold py-2.5 px-3 rounded-xl border border-white/20 appearance-none focus:outline-none focus:border-[#D4AF37] cursor-pointer truncate"
              >
                {formats.map(f => (
                  <option key={f.id} value={f.id} title={f.name} className="bg-[#030904] text-white">
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 font-mono uppercase tracking-wider block flex items-center gap-1">
                <ShieldCheck size={12} className="text-[#D4AF37]" /> Tipo de Licencia / Estado
              </label>
              <select
                value={activeLicense}
                onChange={(e) => setActiveLicense(e.target.value)}
                className="w-full bg-[#030904] text-[#D4AF37] text-xs font-semibold py-2.5 px-3 rounded-xl border border-white/20 appearance-none focus:outline-none focus:border-[#D4AF37] cursor-pointer truncate"
              >
                {licenses.map(l => (
                  <option key={l.id} value={l.id} title={l.name} className="bg-[#030904] text-white">
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
            <RefreshCw className="animate-spin text-[#D4AF37] mb-4" size={32} />
            <p className="text-xs font-mono uppercase tracking-widest text-[#D4AF37]">Consultando la API REST y buscando en vivo en Project Gutenberg (+70,000 obras)...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-16 bg-[#051208]/85 rounded-3xl border border-white/10 p-8 space-y-4">
            <AlertCircle className="text-[#D4AF37] mx-auto mb-2" size={40} />
            <h3 className="text-lg font-bold text-white font-serif">No encontramos obras guardadas para "{searchQuery}"</h3>
            <p className="text-xs text-gray-300 max-w-md mx-auto font-light leading-relaxed">
              Haz clic abajo para realizar una consulta en tiempo real en la base de datos completa de Project Gutenberg y Open Library (+70,000 títulos de dominio público).
            </p>

            <button
              onClick={() => handleTriggerEtlSync(searchQuery)}
              disabled={isSyncing}
              className="px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-extrabold text-xs uppercase tracking-widest rounded-xl hover:bg-white transition-all shadow-xl inline-flex items-center gap-2"
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
                  className="bg-[#051208]/85 border border-white/10 hover:border-[#D4AF37]/70 rounded-2xl p-6 backdrop-blur-xl shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
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
                        <div className="w-full h-full bg-gradient-to-b from-[#0B1E10] via-[#051208] to-black p-6 flex flex-col justify-between text-center border border-[#D4AF37]/30">
                          <div className="w-8 h-8 rounded-full border border-[#D4AF37]/40 mx-auto flex items-center justify-center text-[#D4AF37]">
                            <BookOpen size={16} />
                          </div>
                          <div>
                            <h4 className="font-serif text-lg font-bold text-[#D4AF37] leading-snug mb-1">{book.titulo}</h4>
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
                      <span className="text-[#D4AF37] font-bold truncate max-w-[60%]">{(book.autores || []).join(', ')}</span>
                      <span className="text-gray-400 truncate max-w-[38%] text-right">{book.fuente_original}</span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-white mb-2 leading-snug group-hover:text-[#D4AF37] transition-colors">
                      {book.titulo}
                    </h3>
                    <p className="text-gray-300 text-xs font-light mb-4 leading-relaxed line-clamp-3">
                      {book.resumen || book.subtitulo}
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-white/10 space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between text-gray-300">
                      <span className="text-[#D4AF37] font-semibold flex items-center gap-1">
                        <Star size={13} fill="#D4AF37" /> {book.calificacion_promedio || '4.9'}
                      </span>
                      <span className="text-gray-400">{book.paginas_aprox || '220 págs'}</span>
                    </div>

                    <div className="pt-1">
                      <button
                        onClick={() => openReaderModal(book)}
                        className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <BookOpen size={15} /> LEER LIBRO COMPLETO
                      </button>
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
                  className="px-10 py-4 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-extrabold text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-white transition-all shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:scale-105 inline-flex items-center gap-3 cursor-pointer"
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

      {/* LECTOR EJECUTIVO NATIVO GRANCOLINOS (CON HERRAMIENTA DE LÁPIZ LIBRE Y BOTÓN DE DESCARGA DIRECTA AUTOMÁTICA EN DISPOSITIVO) */}
      {readingBook && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-6 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-200">
          <div className={`border rounded-3xl w-full shadow-[0_0_90px_rgba(212,175,55,0.25)] relative flex flex-col transition-all duration-300 ${
            isFullscreenReader ? 'h-full max-w-full rounded-none' : 'max-w-6xl max-h-[94vh] h-[90vh]'
          } ${
            readerTheme === 'sepia' ? 'bg-[#FBF0D9] text-[#2B1B10] border-[#D4C3A3]' :
            readerTheme === 'contrast' ? 'bg-black text-yellow-300 border-yellow-400' :
            'bg-[#051208] text-gray-100 border-[#D4AF37]/40'
          }`}>
            
            {/* Header del Lector Nativo */}
            <div className={`sticky top-0 z-50 px-6 py-3.5 border-b flex flex-wrap items-center justify-between gap-3 backdrop-blur-md ${
              readerTheme === 'sepia' ? 'bg-[#FBF0D9]/95 border-[#D4C3A3]' :
              readerTheme === 'contrast' ? 'bg-black border-yellow-400' :
              'bg-[#051208]/95 border-white/15'
            }`}>
              <div className="flex items-center gap-3 truncate max-w-md">
                <span className="px-2.5 py-1 bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest rounded border border-[#D4AF37]/30 shrink-0">
                  {readingBook.fuente_original}
                </span>
                <h4 className="font-serif text-sm font-bold truncate">{readingBook.titulo}</h4>
              </div>

              {!isBookCopyrighted && (
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                  <button
                    onClick={() => { setIsPenActive(!isPenActive); setIsEraser(false); }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isPenActive && !isEraser ? 'bg-[#D4AF37] text-black shadow-md' : 'text-gray-300 hover:text-white'
                    }`}
                    title="Activar trazo de lápiz libre"
                  >
                    <PenTool size={13} /> Lápiz Libre {isPenActive && !isEraser ? '(ON)' : ''}
                  </button>

                  <button
                    onClick={() => { setIsPenActive(true); setIsEraser(true); }}
                    className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                      isPenActive && isEraser ? 'bg-rose-500 text-white shadow-md' : 'text-gray-300 hover:text-white'
                    }`}
                    title="Borrador de trazos"
                  >
                    <Eraser size={14} />
                  </button>

                  <div className="flex items-center gap-1 border-l border-white/15 pl-2">
                    {Object.keys(highlightColorStyles).map(colorKey => (
                      <button
                        key={colorKey}
                        onClick={() => {
                          setPenColor(highlightColorStyles[colorKey].hex);
                          setActiveHighlightColor(colorKey);
                          setIsEraser(false);
                        }}
                        className={`w-4 h-4 rounded-full ${highlightColorStyles[colorKey].dot} transition-transform ${
                          penColor === highlightColorStyles[colorKey].hex ? 'scale-125 ring-2 ring-white' : 'opacity-60 hover:opacity-100'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Controles de Vista */}
              <div className="flex items-center gap-2">
                {!isBookCopyrighted && (
                  <div className="flex items-center gap-1 bg-white/10 rounded-xl p-1">
                    <button 
                      onClick={() => setReaderPageMode('single')} 
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${readerPageMode === 'single' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-gray-300 hover:text-white'}`}
                      title="Vista de 1 Página"
                    >
                      <Layout size={13} /> 1 Pág
                    </button>
                    <button 
                      onClick={() => setReaderPageMode('double')} 
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${readerPageMode === 'double' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-gray-300 hover:text-white'}`}
                      title="Vista Doble (Libro Abierto 2 Páginas)"
                    >
                      <Columns size={13} /> Libro Abierto (2 Págs)
                    </button>
                  </div>
                )}

                <a
                  href={readingBook.enlaces_descarga?.pdf || readingBook.enlaces_descarga?.epub || readingBook.url_fuente || readingBook.url_original || 'https://www.gutenberg.org'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-[#D4AF37]/20 hover:bg-[#D4AF37] hover:text-black text-[#D4AF37] text-xs font-mono font-bold uppercase rounded-xl border border-[#D4AF37]/40 transition-all flex items-center gap-1.5 shrink-0"
                  title="Abrir página oficial del repositorio para descargar la obra"
                >
                  <span>Descargar en Fuente Oficial</span>
                  <ExternalLink size={13} />
                </a>

                <button
                  onClick={() => setIsFullscreenReader(!isFullscreenReader)}
                  className="p-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-gray-300 hover:text-white transition-all"
                  title={isFullscreenReader ? 'Restaurar ventana' : 'Pantalla Completa'}
                >
                  {isFullscreenReader ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>

                <button 
                  onClick={() => setReadingBook(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#D4AF37] hover:text-black flex items-center justify-center transition-all shrink-0 ml-1"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* SI SE ESTÁ EXTRAYENDO EL TEXTO REAL DE LA OBRA */}
            {loadingFullBookText ? (
              <div className="flex flex-col items-center justify-center flex-1 py-20 text-gray-300 space-y-4">
                <RefreshCw className="animate-spin text-[#D4AF37]" size={36} />
                <div className="text-center font-mono space-y-1">
                  <p className="text-sm font-bold text-[#D4AF37]">Buscando e ingiriendo el texto plano original de la obra...</p>
                  <p className="text-xs text-gray-400">Verificando licencias de dominio público en Project Gutenberg & Internet Archive</p>
                </div>
              </div>
            ) : isBookCopyrighted ? (
              /* CASO OBRA COMERCIAL CON DESCARGA DIRECTA TRANSPARENTE AL ORDENADOR */
              <div className="flex-1 overflow-y-auto p-6 sm:p-12 flex flex-col items-center justify-center text-center max-w-3xl mx-auto space-y-6 w-full custom-scrollbar my-auto">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shadow-2xl shrink-0">
                  <Lock size={30} />
                </div>

                <div className="space-y-3 w-full">
                  <span className="px-3 py-1 bg-amber-950/80 text-amber-300 text-[10px] font-bold uppercase tracking-widest rounded-full border border-amber-500/40 inline-block">
                    Propiedad Intelectual & Copyright Activo
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white leading-snug max-w-2xl mx-auto break-words">
                    {readingBook.titulo}
                  </h3>
                  <p className="text-xs font-mono text-[#D4AF37]">Por {(readingBook.autores || []).join(', ')} • {readingBook.fuente_original}</p>
                  
                  <p className="text-gray-300 text-xs sm:text-sm font-light leading-relaxed max-w-xl mx-auto pt-2">
                    {readingBook.resumen || readingBook.subtitulo}
                  </p>
                </div>

                <div className="p-5 sm:p-6 bg-white/5 rounded-2xl border border-white/10 text-left font-sans text-xs space-y-2 w-full">
                  <p className="font-bold flex items-center gap-1.5 text-[#D4AF37]">
                    <ShieldCheck size={16} /> Cumplimiento de Licencias de Derechos de Autor
                  </p>
                  <p className="opacity-80 leading-relaxed text-[11px]">
                    Esta obra cuenta con derechos de autor o registro histórico vigente. En estricto cumplimiento con las leyes de propiedad intelectual, GranColinos indexa sus metadatos y te proporciona el enlace directo para su lectura o adquisición oficial en distribuidores autorizados.
                  </p>
                </div>

                {/* BOTÓN ÚNICO: IR A LA PÁGINA OFICIAL PARA DESCARGAR */}
                <div className="flex justify-center w-full pt-2 shrink-0">
                  <a
                    href={readingBook.enlaces_descarga?.pdf || readingBook.enlaces_descarga?.epub || readingBook.url_fuente || readingBook.url_original || 'https://www.gutenberg.org'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full max-w-md py-4 px-6 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-extrabold text-xs uppercase tracking-widest rounded-2xl hover:bg-white transition-all shadow-xl flex items-center justify-center gap-2"
                  >
                    <span>Ir a la Página Oficial para Descargar</span>
                    <ExternalLink size={15} />
                  </a>
                </div>
              </div>
            ) : (
              /* CUERPO DEL LECTOR NATIVO CON PÁGINAS REALES Y LÁPIZ LIBRE */
              <div className="flex-1 overflow-y-auto p-6 sm:p-10 flex flex-col justify-between space-y-6 relative">
                
                <div className={`grid gap-8 items-start flex-1 ${
                  readerPageMode === 'double' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 max-w-3xl mx-auto'
                }`}>
                  
                  {/* PÁGINA IZQUIERDA (PÁGINA A) */}
                  {pageLeft && (
                    <div className="space-y-6 font-serif leading-relaxed p-6 bg-white/5 rounded-2xl border border-white/10 shadow-lg relative min-h-[440px] overflow-hidden">
                      <FreehandPenCanvas 
                        color={isEraser ? 'eraser' : penColor}
                        strokeWidth={penStrokeWidth}
                        isPenActive={isPenActive}
                        pageKey={`${readingBook.id}_page_${pageLeft.page}`}
                      />

                      <div className="flex items-center justify-between text-xs font-mono border-b pb-3 border-white/10 opacity-80 relative z-10">
                        <span className="text-[#D4AF37] font-bold">Página {pageLeft.page} de {totalBookPages}</span>
                        <span className="italic">{readingBook.titulo}</span>
                      </div>

                      <h3 className="text-lg font-bold text-[#D4AF37] font-serif border-b pb-2 border-white/10 relative z-10">
                        {pageLeft.title}
                      </h3>

                      <div className={`space-y-4 ${readerFontSize} font-light relative z-10`}>
                        {pageLeft.paragraphs.map((pText, pIdx) => {
                          const colorKey = userHighlights[`${readingBook.id}_p${pageLeft.page}_idx${pIdx}`];
                          const highlightStyle = colorKey ? highlightColorStyles[colorKey]?.bg : 'hover:bg-white/5';
                          return (
                            <p 
                              key={pIdx}
                              onClick={() => !isPenActive && toggleHighlightParagraph(readingBook.id, pageLeft.page, pIdx)}
                              className={`transition-all duration-200 p-2.5 rounded-lg border border-transparent ${highlightStyle}`}
                            >
                              {pText}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* PÁGINA DERECHA (PÁGINA B) */}
                  {readerPageMode === 'double' && (
                    <div className="space-y-6 font-serif leading-relaxed p-6 bg-white/5 rounded-2xl border border-white/10 shadow-lg relative min-h-[440px] border-l-4 border-l-[#D4AF37]/30 overflow-hidden">
                      {pageRight ? (
                        <>
                          <FreehandPenCanvas 
                            color={isEraser ? 'eraser' : penColor}
                            strokeWidth={penStrokeWidth}
                            isPenActive={isPenActive}
                            pageKey={`${readingBook.id}_page_${pageRight.page}`}
                          />

                          <div className="flex items-center justify-between text-xs font-mono border-b pb-3 border-white/10 opacity-80 relative z-10">
                            <span className="text-[#D4AF37] font-bold">Página {pageRight.page} de {totalBookPages}</span>
                            <span className="italic">{readingBook.titulo}</span>
                          </div>

                          <h3 className="text-lg font-bold text-[#D4AF37] font-serif border-b pb-2 border-white/10 relative z-10">
                            {pageRight.title}
                          </h3>

                          <div className={`space-y-4 ${readerFontSize} font-light relative z-10`}>
                            {pageRight.paragraphs.map((pText, pIdx) => {
                              const colorKey = userHighlights[`${readingBook.id}_p${pageRight.page}_idx${pIdx}`];
                              const highlightStyle = colorKey ? highlightColorStyles[colorKey]?.bg : 'hover:bg-white/5';
                              return (
                                <p 
                                  key={pIdx}
                                  onClick={() => !isPenActive && toggleHighlightParagraph(readingBook.id, pageRight.page, pIdx)}
                                  className={`transition-all duration-200 p-2.5 rounded-lg border border-transparent ${highlightStyle}`}
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
                          <p>Fin del libro ({totalBookPages} págs reales).</p>
                        </div>
                      )}
                    </div>
                  )}

                </div>

                {/* BARRA INFERIOR DE CONTROLES */}
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
                    {readerPageMode === 'double' ? `Páginas ${pageLeft ? pageLeft.page : 1}-${pageRight ? pageRight.page : (pageLeft ? pageLeft.page : 1)}` : `Página ${pageLeft ? pageLeft.page : 1}`} de {totalBookPages} págs
                  </span>

                  <button 
                    onClick={() => setReaderCurrentPage(Math.min(totalBookPages, readerCurrentPage + (readerPageMode === 'double' ? 2 : 1)))}
                    disabled={readerCurrentPage >= totalBookPages}
                    className={`px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 ${
                      readerCurrentPage >= totalBookPages ? 'bg-white/5 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black hover:bg-white shadow-md'
                    }`}
                  >
                    Página Siguiente <ChevronRight size={16} />
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

export default function LibrosPage() {
  return (
    <MaintenanceGuard
      routeKey="/libros"
      defaultTitle="MÓDULO DE LIBROS & BIBLIOTECA EN CONSTRUCCIÓN"
      defaultSubtitle="Estamos digitalizando e indexando obras clásicas de acceso abierto."
      defaultModuleName="Libros & Biblioteca"
      defaultEstimatedDate="Agosto 2026"
    >
      <Suspense fallback={
        <div className="min-h-screen theme-libros flex items-center justify-center text-white">
          <RefreshCw className="animate-spin text-[#D4AF37]" size={32} />
        </div>
      }>
        <LibrosContent />
      </Suspense>
    </MaintenanceGuard>
  );
}
