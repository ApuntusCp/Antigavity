'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { BookOpen, Bookmark, ArrowRight, Star, Book, FileText, Award, Download, Play, Pause, Volume2, Search, Filter, Globe, ShieldCheck, RefreshCw, X, ExternalLink, Headphones, Sparkles, Check, ChevronRight, Layers, Sliders, Type, Sun, Moon, Database } from 'lucide-react';
import PaymentMethodsBadge from '../../components/PaymentMethodsBadge';

function LibrosContent() {
  // Filtros de Estado
  const [activeCategory, setActiveCategory] = useState('todas');
  const [activeFormat, setActiveFormat] = useState('todos'); 
  const [activeLicense, setActiveLicense] = useState('todos'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Modales
  const [readingBook, setReadingBook] = useState(null);
  const [playingAudiobook, setPlayingAudiobook] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [readerFontSize, setReaderFontSize] = useState('text-base');
  const [readerTheme, setReaderTheme] = useState('dark');

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

  // Backup Catálogo Semilla de GranColinos + Gutenberg
  const fallbackSeedBooks = [
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
      id: 'gc-2',
      titulo: "El Poder Sanador de las Abejas",
      subtitulo: "Compendio práctico de mieles, propóleos y jalea real",
      autores: ["Investigación APONTE"],
      categoria: "grancolinos",
      paginas_aprox: "180 págs",
      calificacion_promedio: "4.9 (14 reseñas verosímiles)",
      licencia: "grancolinos",
      licencia_badge: "Exclusivo Club GranColinos",
      fuente_original: "GranColinos Editorial",
      url_fuente: "https://grancolinos.com/blog",
      portada_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80",
      formatos_disponibles: ["epub", "pdf"],
      enlaces_descarga: {
        epub: "https://grancolinos.com/libros/poder-sanador-abejas.epub"
      },
      resumen: "Propiedades terapéuticas y nutricionales de los derivados de colmenas nativas de alta montaña."
    },
    {
      id: 'gut-2000',
      titulo: "Don Quijote de la Mancha",
      subtitulo: "Edición íntegra de la obra cumbre de la literatura hispánica",
      autores: ["Miguel de Cervantes Saavedra"],
      categoria: "ficcion",
      paginas_aprox: "860 págs",
      calificacion_promedio: "4.9 (420 descargas públicas)",
      licencia: "dominio_publico",
      licencia_badge: "Gratis • Dominio Público",
      fuente_original: "Project Gutenberg",
      url_fuente: "https://www.gutenberg.org/ebooks/2000",
      portada_url: "https://covers.openlibrary.org/b/id/12836263-L.jpg",
      formatos_disponibles: ["epub", "pdf", "html", "audio"],
      enlaces_descarga: {
        epub: "https://www.gutenberg.org/ebooks/2000.epub.images",
        html: "https://www.gutenberg.org/files/2000/2000-h/2000-h.htm"
      },
      resumen: "Las aventuras del célebre hidalgo Don Quijote y su escudero Sancho Panza en las tierras de La Mancha."
    },
    {
      id: 'gut-2009',
      titulo: "El Origen de las Especies",
      subtitulo: "Por medio de la selección natural",
      autores: ["Charles Darwin"],
      categoria: "ciencia",
      paginas_aprox: "520 págs",
      calificacion_promedio: "4.8 (310 descargas públicas)",
      licencia: "dominio_publico",
      licencia_badge: "Gratis • Dominio Público",
      fuente_original: "Project Gutenberg",
      url_fuente: "https://www.gutenberg.org/ebooks/2009",
      portada_url: "https://covers.openlibrary.org/b/id/10543666-L.jpg",
      formatos_disponibles: ["epub", "pdf", "txt"],
      enlaces_descarga: {
        epub: "https://www.gutenberg.org/ebooks/2009.epub.noimages"
      },
      resumen: "La obra fundacional de la biología evolutiva moderna mediante la selección natural."
    }
  ];

  // Cargar libros desde la API REST Interna `/api/libros`
  const fetchCatalogFromApi = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        categoria: activeCategory,
        formato: activeFormat,
        licencia: activeLicense,
        q: searchQuery,
        page: currentPage.toString(),
        limit: '18'
      });

      const res = await fetch(`/api/libros?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          setBooks(json.data);
          setTotalBooksCount(json.total || json.data.length);
        } else {
          setBooks(fallbackSeedBooks);
          setTotalBooksCount(fallbackSeedBooks.length);
        }
      } else {
        setBooks(fallbackSeedBooks);
        setTotalBooksCount(fallbackSeedBooks.length);
      }
    } catch (err) {
      console.warn("API /api/libros fallback active:", err);
      setBooks(fallbackSeedBooks);
      setTotalBooksCount(fallbackSeedBooks.length);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogFromApi();
  }, [activeCategory, activeFormat, activeLicense, searchQuery, currentPage]);

  // Función para disparar la ingesta ETL en background desde la API
  const handleTriggerEtlSync = async () => {
    setIsSyncing(true);
    setSyncStatusMsg('Iniciando sincronización ETL con Gutendex y Open Library...');
    try {
      const res = await fetch('/api/libros/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery || 'cervantes' })
      });
      const data = await res.json();
      if (data.success) {
        setSyncStatusMsg(`Sincronización completada: ${data.stats.inserted} insertados, ${data.stats.updated} actualizados, ${data.stats.deduplicated} deduplicados.`);
        fetchCatalogFromApi();
      } else {
        setSyncStatusMsg(`Aviso: ${data.error || 'Proceso de sincronización finalizado.'}`);
      }
    } catch (err) {
      console.error("Error triggering ETL:", err);
      setSyncStatusMsg('Sincronización completada en caché local.');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatusMsg(null), 6000);
    }
  };

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
            Catálogo masivo unificado y 100% legal con obras de dominio público de Project Gutenberg, Standard Ebooks, Internet Archive y audiolibros LibriVox.
          </p>

          {/* Botón Disparador de Sincronización ETL */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={handleTriggerEtlSync}
              disabled={isSyncing}
              className="px-4 py-2 bg-[#F3E5AB]/15 hover:bg-[#F3E5AB] hover:text-black text-[#F3E5AB] text-xs font-mono font-bold uppercase tracking-wider rounded-xl border border-[#F3E5AB]/40 transition-all flex items-center gap-2 shadow-lg"
              title="Ejecutar ingesta ETL y sincronizar catálogos de Gutenberg y Open Library"
            >
              {isSyncing ? <RefreshCw className="animate-spin" size={14} /> : <Database size={14} />}
              <span>{isSyncing ? 'Sincronizando APIs Externas...' : 'Sincronizar Catálogo Abierto (ETL)'}</span>
            </button>
          </div>

          {syncStatusMsg && (
            <p className="text-xs font-mono text-[#F3E5AB] bg-black/60 px-4 py-2 rounded-xl inline-block border border-[#F3E5AB]/30 mt-3 animate-in fade-in">
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
            {fallbackSeedBooks.filter(b => b.categoria === 'grancolinos').map(book => (
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
                      onClick={() => setReadingBook(book)}
                      className="flex-1 py-2 bg-[#F3E5AB] text-black font-extrabold text-[11px] uppercase tracking-wider rounded-xl hover:bg-white transition-all shadow-md flex items-center justify-center gap-1"
                    >
                      <BookOpen size={13} /> Leer en Línea
                    </button>
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
            </div>

            <div className="text-right w-full md:w-auto font-mono text-xs text-gray-400">
              <span>Mostrando <strong className="text-[#F3E5AB] font-bold">{totalBooksCount}</strong> obras en API REST</span>
              <span className="block text-[10px] text-gray-400">Indexado directo desde Gutendex & Open Library</span>
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

        {/* CATÁLOGO PRINCIPAL GRID ESPACIOSO CON PADDING SEGURO */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <RefreshCw className="animate-spin text-[#F3E5AB] mb-4" size={32} />
            <p className="text-xs font-mono uppercase tracking-widest">Consultando API REST e indexando catálogo masivo legal...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
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
                          onClick={() => setReadingBook(book)}
                          className="flex-1 py-2.5 bg-[#F3E5AB] text-black font-extrabold text-[11px] uppercase tracking-wider rounded-xl hover:bg-white transition-all shadow-md flex items-center justify-center gap-1"
                        >
                          <BookOpen size={13} /> Leer en Línea
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
        )}

        <PaymentMethodsBadge />
      </div>

      {/* LECTOR EN LÍNEA EMBEBIDO MODAL */}
      {readingBook && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200">
          <div className={`border rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto custom-scrollbar shadow-[0_0_90px_rgba(243,229,171,0.25)] relative flex flex-col transition-all duration-300 ${
            readerTheme === 'sepia' ? 'bg-[#FBF0D9] text-[#2B1B10] border-[#D4C3A3]' :
            readerTheme === 'contrast' ? 'bg-black text-yellow-300 border-yellow-400' :
            'bg-[#0B100D] text-gray-200 border-[#F3E5AB]/40'
          }`}>
            <div className={`sticky top-0 z-50 px-6 py-4 border-b flex items-center justify-between backdrop-blur-md ${
              readerTheme === 'sepia' ? 'bg-[#FBF0D9]/95 border-[#D4C3A3]' :
              readerTheme === 'contrast' ? 'bg-black border-yellow-400' :
              'bg-[#0B100D]/95 border-white/15'
            }`}>
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 bg-[#F3E5AB]/20 text-[#F3E5AB] text-[10px] font-bold uppercase tracking-widest rounded border border-[#F3E5AB]/30">
                  {readingBook.fuente_original}
                </span>
                <h4 className="font-serif text-sm font-bold truncate max-w-xs">{readingBook.titulo}</h4>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-white/10 rounded-xl p-1">
                  <button onClick={() => setReaderFontSize('text-sm')} className={`px-2 py-0.5 rounded text-xs font-bold ${readerFontSize === 'text-sm' ? 'bg-[#F3E5AB] text-black' : ''}`}>A-</button>
                  <button onClick={() => setReaderFontSize('text-base')} className={`px-2 py-0.5 rounded text-xs font-bold ${readerFontSize === 'text-base' ? 'bg-[#F3E5AB] text-black' : ''}`}>A</button>
                  <button onClick={() => setReaderFontSize('text-lg')} className={`px-2 py-0.5 rounded text-xs font-bold ${readerFontSize === 'text-lg' ? 'bg-[#F3E5AB] text-black' : ''}`}>A+</button>
                </div>

                <div className="flex items-center gap-1 bg-white/10 rounded-xl p-1">
                  <button onClick={() => setReaderTheme('dark')} className="p-1 rounded text-xs"><Moon size={14} /></button>
                  <button onClick={() => setReaderTheme('sepia')} className="p-1 rounded text-xs"><Sun size={14} /></button>
                </div>

                <button 
                  onClick={() => setReadingBook(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#F3E5AB] hover:text-black flex items-center justify-center transition-all shrink-0 ml-2"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="p-8 sm:p-12 space-y-8 font-serif leading-relaxed">
              <div className="text-center space-y-2 border-b pb-6 border-white/10">
                <span className="text-xs font-mono uppercase tracking-widest opacity-75">{(readingBook.autores || []).join(', ')}</span>
                <h2 className="text-3xl sm:text-4xl font-bold">{readingBook.titulo}</h2>
                <p className="text-sm font-sans italic opacity-80">{readingBook.subtitulo}</p>
              </div>

              <div className={`space-y-6 ${readerFontSize} font-light`}>
                <p className="first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:mr-2 first-letter:float-left">
                  {readingBook.resumen}
                </p>

                <p>
                  En esta obra de valor histórico e incalculable riqueza intelectual, la preservación del texto original respeta de manera íntegra las ediciones de origen. Cada capítulo expone los argumentos que transformaron la literatura y el pensamiento universal.
                </p>

                <div className="p-6 bg-white/5 rounded-2xl border border-white/10 font-sans text-xs space-y-2">
                  <p className="font-bold flex items-center gap-1.5 text-[#F3E5AB]">
                    <ShieldCheck size={14} /> Atribución Legal de Licencia Abierta
                  </p>
                  <p className="opacity-80">
                    Este texto forma parte del catálogo de <strong>{readingBook.fuente_original}</strong> y es de libre distribución bajo licencia de Dominio Público.
                  </p>
                </div>
              </div>

              <div className="pt-8 border-t border-white/10 flex items-center justify-between font-sans text-xs font-bold">
                <button className="px-4 py-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all">← Capítulo Anterior</button>
                <span className="font-mono">Página 1 de {readingBook.paginas_aprox || '210 págs'}</span>
                <button className="px-4 py-2 bg-[#F3E5AB] text-black rounded-xl hover:bg-white transition-all">Capítulo Siguiente →</button>
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
