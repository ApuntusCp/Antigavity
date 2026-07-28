'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Database, Globe, Search, Cpu, ShieldCheck, BookOpen, ExternalLink, Filter, Layers, Download, Check, Sparkles, FolderPlus, Bookmark, Copy, FileText, Sliders, X, RefreshCw, AlertCircle, Trash2, Edit3, ChevronRight, Share2, CornerDownRight } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import AcademicTrustBadge from '@/components/AcademicTrustBadge';

// COMPONENTE PRINCIPAL REPOSITORIO ACADÉMICO GLOBAL
function GlobalAcademicRepositoryContent() {
  const { user } = useAuth();

  // Estados de Búsqueda y Filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [activeDiscipline, setActiveDiscipline] = useState('todas');
  const [activeDocType, setActiveDocType] = useState('todos');
  const [activeLanguage, setActiveLanguage] = useState('todos');
  const [yearStart, setYearStart] = useState('2018');
  const [yearEnd, setYearEnd] = useState('2026');
  
  // Estado de Búsqueda Avanzada Booleana (Fase 10)
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [booleanOperator, setBooleanOperator] = useState('AND');
  const [exactPhrase, setExactPhrase] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');

  // Estado de Resultados y Carga
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sourcesConsulted, setSourcesConsulted] = useState([]);
  
  // Estado de Modal de Citación (Fase 7)
  const [selectedCitationPaper, setSelectedCitationPaper] = useState(null);
  const [copiedFormat, setCopiedFormat] = useState(null);

  // Estado de Carpetas de Proyecto de Investigación (Fase 8)
  const [researchFolders, setResearchFolders] = useState({});
  const [activeFolderModalPaper, setActiveFolderModalPaper] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFolderView, setSelectedFolderView] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Disciplinas Académicas
  const disciplines = [
    { id: 'todas', name: 'Todas las Disciplinas' },
    { id: 'Ciencias de la Salud', name: 'Ciencias de la Salud & Biomedicina' },
    { id: 'Ciencias Naturales', name: 'Ciencias Naturales & Botánica' },
    { id: 'Ingeniería', name: 'Ingeniería & Tecnología' },
    { id: 'Ciencias Sociales', name: 'Ciencias Sociales & Humanidades' },
    { id: 'Derecho', name: 'Derecho & Ciencias Políticas' },
    { id: 'Economía', name: 'Economía & Negocios' },
    { id: 'Agricultura', name: 'Ciencias Agropecuarias' }
  ];

  // Tipos de Documento
  const docTypes = [
    { id: 'todos', name: 'Todos los Documentos' },
    { id: 'Artículo', name: 'Artículo Científico / Peer-Reviewed' },
    { id: 'Revisión', name: 'Revisión Biomédica / Sistemática' },
    { id: 'Preprint', name: 'Preprint / Conferencia (arXiv/PMC)' }
  ];

  // Catálogo de Idiomas Globales e Históricos
  const languages = [
    { id: 'todos', name: 'Todos los Idiomas (Universal)' },
    { id: 'es', name: 'Español (Castellano)' },
    { id: 'en', name: 'English (Inglés)' },
    { id: 'la', name: 'Latín Clásico & Filosófico (Latinus)' },
    { id: 'he', name: 'Hebreo & Fuentes Talmúdicas (עברית)' },
    { id: 'el', name: 'Griego Clásico & Moderno (Ελληνικά)' },
    { id: 'fr', name: 'Francés (Français)' },
    { id: 'de', name: 'Alemán (Deutsch)' },
    { id: 'pt', name: 'Portugués (Português)' },
    { id: 'zh', name: 'Chino Tradicional & Simplificado (中文)' },
    { id: 'ru', name: 'Ruso (Русский)' },
    { id: 'ar', name: 'Árabe (العربية)' },
    { id: 'sa', name: 'Sánscrito (संस्कृतम्)' },
    { id: 'ja', name: 'Japonés (日本語)' },
    { id: 'it', name: 'Italiano (Italiano)' }
  ];

  // Cargar Carpetas Guardadas en LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('grancolinos_research_folders');
      if (saved) {
        setResearchFolders(JSON.parse(saved));
      } else {
        setResearchFolders({
          'Investigación Apiterapia & Botánica': []
        });
      }
    } catch (e) {}
  }, []);

  const saveFoldersToStorage = (updated) => {
    setResearchFolders(updated);
    try {
      localStorage.setItem('grancolinos_research_folders', JSON.stringify(updated));
    } catch (e) {}
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Ejecutar Consulta a la API de Búsqueda Académica Dinámica Multilingüe
  const executeAcademicSearch = async (
    queryToSearch, 
    disciplineToSearch = activeDiscipline, 
    docTypeToSearch = activeDocType,
    languageToSearch = activeLanguage
  ) => {
    setLoading(true);
    try {
      let finalQuery = queryToSearch !== undefined ? queryToSearch : searchQuery;

      if (showAdvancedSearch) {
        if (exactPhrase.trim()) finalQuery += ` "${exactPhrase.trim()}"`;
        if (authorFilter.trim()) finalQuery += ` author:${authorFilter.trim()}`;
      }

      const params = new URLSearchParams({
        q: finalQuery || '',
        disciplina: disciplineToSearch,
        tipo: docTypeToSearch,
        idioma: languageToSearch
      });

      const res = await fetch(`/api/academic/search?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setResults(json.data);
          setSourcesConsulted(json.sources_consulted || []);
        } else {
          setResults([]);
        }
      } else {
        setResults([]);
      }
    } catch (err) {
      console.warn("API academic search error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    executeAcademicSearch(searchQuery, activeDiscipline, activeDocType, activeLanguage);
  }, []);

  const handleDisciplineChange = (newDiscipline) => {
    setActiveDiscipline(newDiscipline);
    executeAcademicSearch(searchQuery, newDiscipline, activeDocType, activeLanguage);
  };

  const handleDocTypeChange = (newDocType) => {
    setActiveDocType(newDocType);
    executeAcademicSearch(searchQuery, activeDiscipline, newDocType, activeLanguage);
  };

  const handleLanguageChange = (newLanguage) => {
    setActiveLanguage(newLanguage);
    executeAcademicSearch(searchQuery, activeDiscipline, activeDocType, newLanguage);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setActiveQuery(searchQuery.trim());
    executeAcademicSearch(searchQuery.trim());
  };

  // GENERADOR DE CITAS APA 7ª EDICIÓN E ICONTEC (FASE 7)
  const generateCitations = (paper) => {
    if (!paper) return { apa: '', icontec: '' };

    const firstAuthor = paper.autores?.[0] || 'Autor Desconocido';
    const authorsFormattedApa = (paper.autores || []).join(', ');
    const authorsFormattedIcontec = (paper.autores || []).map(a => a.toUpperCase()).join('; ');
    const year = paper.anio || '2026';
    const title = paper.titulo || 'Sin título';
    const journal = paper.revista || 'Repositorio Académico';
    const doiOrUrl = paper.doi ? `https://doi.org/${paper.doi.replace(/^https?:\/\/doi\.org\//, '')}` : paper.url_original;

    // Formato APA 7ª Edición
    const apa = `${authorsFormattedApa}. (${year}). ${title}. ${journal}.${doiOrUrl ? ` ${doiOrUrl}` : ''}`;

    // Formato ICONTEC (Colombia)
    const icontec = `${authorsFormattedIcontec}. ${title}. En: ${journal}. ${year}.${doiOrUrl ? ` Disponible en: <${doiOrUrl}>` : ''}`;

    return { apa, icontec };
  };

  const copyToClipboard = (text, formatName) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(formatName);
    showToast(`Cita en formato ${formatName} copiada al portapapeles.`);
    setTimeout(() => setCopiedFormat(null), 2500);
  };

  // GESTIÓN DE CARPETAS DE PROYECTO (FASE 8)
  const createNewFolder = () => {
    if (!newFolderName.trim()) return;
    const name = newFolderName.trim();
    if (researchFolders[name]) {
      showToast('Ya existe una carpeta con este nombre.');
      return;
    }
    const updated = { ...researchFolders, [name]: [] };
    saveFoldersToStorage(updated);
    setNewFolderName('');
    showToast(`Carpeta "${name}" creada exitosamente.`);
  };

  const savePaperToFolder = (folderName, paper) => {
    const currentList = researchFolders[folderName] || [];
    if (currentList.some(p => p.id === paper.id)) {
      showToast(`El documento ya está guardado en "${folderName}".`);
      return;
    }
    const updated = {
      ...researchFolders,
      [folderName]: [...currentList, paper]
    };
    saveFoldersToStorage(updated);
    setActiveFolderModalPaper(null);
    showToast(`Documento guardado en carpeta "${folderName}".`);
  };

  const removePaperFromFolder = (folderName, paperId) => {
    const updated = {
      ...researchFolders,
      [folderName]: (researchFolders[folderName] || []).filter(p => p.id !== paperId)
    };
    saveFoldersToStorage(updated);
    showToast('Documento eliminado de la carpeta.');
  };

  const deleteFolder = (folderName) => {
    const updated = { ...researchFolders };
    delete updated[folderName];
    saveFoldersToStorage(updated);
    if (selectedFolderView === folderName) setSelectedFolderView(null);
    showToast(`Carpeta "${folderName}" eliminada.`);
  };

  // EXPORTACIÓN DE BIBLIOGRAFÍA .BIB / .RIS / TEXTO PLANO (FASE 9)
  const exportFolderBibliography = (folderName, format) => {
    const papers = researchFolders[folderName] || [];
    if (papers.length === 0) {
      showToast('La carpeta no contiene documentos para exportar.');
      return;
    }

    let exportContent = '';
    let filename = `${folderName.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
    let mimeType = 'text/plain';

    if (format === 'bibtex') {
      filename += '.bib';
      mimeType = 'application/x-bibtex';
      exportContent = papers.map((p, idx) => {
        const citeKey = `paper_${idx + 1}_${p.anio}`;
        const authors = (p.autores || []).join(' and ');
        return `@article{${citeKey},\n  author = {${authors}},\n  title = {${p.titulo}},\n  journal = {${p.revista}},\n  year = {${p.anio}},\n  url = {${p.url_original}}\n}`;
      }).join('\n\n');
    } else if (format === 'ris') {
      filename += '.ris';
      mimeType = 'application/x-research-info-systems';
      exportContent = papers.map(p => {
        const authorsLines = (p.autores || []).map(a => `AU  - ${a}`).join('\n');
        return `TY  - JOUR\nTI  - ${p.titulo}\n${authorsLines}\nJO  - ${p.revista}\nPY  - ${p.anio}\nUR  - ${p.url_original}\nER  - `;
      }).join('\n\n');
    } else if (format === 'apa') {
      filename += '_citas_APA7.txt';
      exportContent = papers.map(p => generateCitations(p).apa).join('\n\n');
    } else if (format === 'icontec') {
      filename += '_citas_ICONTEC.txt';
      exportContent = papers.map(p => generateCitations(p).icontec).join('\n\n');
    }

    const blob = new Blob([exportContent], { type: `${mimeType};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Exportado exitosamente en formato ${format.toUpperCase()}.`);
  };

  return (
    <div className="min-h-screen theme-noticias text-white pt-32 pb-36 px-4 sm:px-6 relative overflow-hidden select-none">
      
      {/* Fondo de Estética Cuero Botánico Verde Esmeralda & Dorado GranColinos */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#D4AF37]/15 via-[#020502] to-black opacity-90 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-10">

        {/* HERO PRINCIPAL — REPOSITORIO ACADÉMICO GLOBAL */}
        <div className="text-center space-y-4 fade-in">
          <div className="inline-flex items-center gap-2 bg-[#D4AF37]/15 px-4 py-1.5 rounded-full border border-[#D4AF37]/40 shadow-md">
            <Globe size={16} className="text-[#D4AF37]" />
            <span className="text-[#D4AF37] text-xs font-mono font-extrabold tracking-[0.25em] uppercase">
              REPOSITORIO GLOBAL DE INVESTIGACIÓN ACADÉMICA
            </span>
          </div>

          <h1 className="font-serif text-4xl md:text-6xl font-black text-gold-gradient uppercase tracking-tight drop-shadow-[0_4px_30px_rgba(212,175,55,0.4)]">
            Base de Datos Global de Investigación
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto rounded-full shadow-[0_0_12px_rgba(212,175,55,0.8)]"></div>

          <p className="text-gray-200 max-w-3xl mx-auto font-light leading-relaxed text-sm md:text-base">
            Buscador federado y libre de literatura científica internacional indexando publicaciones de OpenAlex, PubMed, arXiv, SciELO y repositorios universitarios en acceso abierto.
          </p>

          {/* AVISO DE CUMPLIMIENTO RIGUROSO DE DERECHOS DE AUTOR */}
          <div className="max-w-2xl mx-auto bg-[#051208]/85 border border-[#D4AF37]/30 rounded-2xl p-3.5 backdrop-blur-md flex items-center justify-center gap-3 text-xs text-center shadow-lg">
            <div className="flex items-center gap-2 text-gray-200">
              <ShieldCheck size={18} className="text-[#D4AF37] shrink-0" />
              <span>Indexación 100% Legal: Acceso a metadatos, resúmenes y enlaces directos a las fuentes universitarias originales.</span>
            </div>
          </div>
        </div>

        {/* BUSCADOR PRINCIPAL Y BUSCADOR AVANZADO BOOLEANO */}
        <div className="bg-[#051208]/85 border border-[#D4AF37]/40 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl space-y-6">
          
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-3.5 text-[#D4AF37]" size={20} />
                <input
                  type="text"
                  placeholder="Buscar artículos científicos, autores o temas (ej. 'apitoxina melitina', 'CBD botánica')..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#030904] border border-[#D4AF37]/35 rounded-2xl pl-12 pr-10 py-3.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] font-mono shadow-inner"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-extrabold text-xs uppercase tracking-widest rounded-2xl hover:bg-white transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {loading ? <RefreshCw className="animate-spin" size={16} /> : <Search size={16} />}
                <span>{loading ? 'Consultando...' : 'Buscar en Red Global'}</span>
              </button>
            </div>

            {/* BOTÓN TOGGLE BÚSQUEDA BOOLEANA AVANZADA */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                className="text-xs font-mono text-[#D4AF37] hover:underline flex items-center gap-1.5"
              >
                <Sliders size={14} />
                <span>{showAdvancedSearch ? 'Ocultar Filtros Booleanos Avanzados' : 'Búsqueda Booleana Avanzada (AND, OR, NOT, Campos)'}</span>
              </button>

              {user && (
                <button
                  type="button"
                  onClick={() => setSelectedFolderView('all')}
                  className="text-xs font-mono text-[#D4AF37] hover:underline flex items-center gap-1.5"
                >
                  <Bookmark size={14} />
                  <span>Mis Carpetas de Proyecto ({Object.keys(researchFolders).length})</span>
                </button>
              )}
            </div>

            {/* PANEL DE BÚSQUEDA BOOLEANA AVANZADA */}
            {showAdvancedSearch && (
              <div className="p-5 bg-[#030904] rounded-2xl border border-[#D4AF37]/35 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in text-xs font-mono">
                <div className="space-y-1.5">
                  <label className="text-gray-400">Operador Lógico:</label>
                  <select
                    value={booleanOperator}
                    onChange={(e) => setBooleanOperator(e.target.value)}
                    className="w-full bg-[#051208] text-[#D4AF37] py-2 px-3 rounded-xl border border-white/20 focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="AND">AND (Todas las palabras obligatorias)</option>
                    <option value="OR">OR (Cualquiera de las palabras)</option>
                    <option value="NOT">NOT (Excluir términos específicos)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-400">Frase Exacta entre Comillas:</label>
                  <input
                    type="text"
                    placeholder='Ej: "cambio climático"'
                    value={exactPhrase}
                    onChange={(e) => setExactPhrase(e.target.value)}
                    className="w-full bg-[#051208] text-white py-2 px-3 rounded-xl border border-white/20 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-400">Búsqueda por Autor Específico:</label>
                  <input
                    type="text"
                    placeholder="Ej: García, Aponte..."
                    value={authorFilter}
                    onChange={(e) => setAuthorFilter(e.target.value)}
                    className="w-full bg-[#051208] text-white py-2 px-3 rounded-xl border border-white/20 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>
            )}
          </form>

          {/* MATRIZ DE FILTROS SECUNDARIOS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-white/10 pt-4">
            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 font-mono uppercase tracking-wider block flex items-center gap-1">
                <Filter size={12} className="text-[#D4AF37]" /> Filtrar por Disciplina
              </label>
              <select
                value={activeDiscipline}
                onChange={(e) => handleDisciplineChange(e.target.value)}
                className="w-full bg-[#030904] text-[#D4AF37] text-xs font-semibold py-2.5 px-3 rounded-xl border border-white/20 appearance-none focus:outline-none focus:border-[#D4AF37] cursor-pointer"
              >
                {disciplines.map(d => (
                  <option key={d.id} value={d.id} className="bg-[#030904] text-white">{d.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 font-mono uppercase tracking-wider block flex items-center gap-1">
                <Globe size={12} className="text-[#D4AF37]" /> Idioma de la Fuente (Históricos & Modernos)
              </label>
              <select
                value={activeLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="w-full bg-[#030904] text-[#D4AF37] text-xs font-semibold py-2.5 px-3 rounded-xl border border-white/20 appearance-none focus:outline-none focus:border-[#D4AF37] cursor-pointer"
              >
                {languages.map(l => (
                  <option key={l.id} value={l.id} className="bg-[#030904] text-white">{l.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 font-mono uppercase tracking-wider block flex items-center gap-1">
                <Layers size={12} className="text-[#D4AF37]" /> Tipo de Publicación
              </label>
              <select
                value={activeDocType}
                onChange={(e) => handleDocTypeChange(e.target.value)}
                className="w-full bg-[#030904] text-[#D4AF37] text-xs font-semibold py-2.5 px-3 rounded-xl border border-white/20 appearance-none focus:outline-none focus:border-[#D4AF37] cursor-pointer"
              >
                {docTypes.map(t => (
                  <option key={t.id} value={t.id} className="bg-[#030904] text-white">{t.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* MENSAJE TOAST ALERTA */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-[9999] bg-[#D4AF37] text-black font-mono font-bold text-xs px-5 py-3 rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.6)] animate-in fade-in flex items-center gap-2">
            <Check size={16} /> {toastMessage}
          </div>
        )}

        {/* LISTADO DE RESULTADOS DE INVESTIGACIÓN */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 space-y-4">
            <RefreshCw className="animate-spin text-[#D4AF37]" size={36} />
            <div className="text-center font-mono space-y-1">
              <p className="text-sm font-bold text-[#D4AF37]">Consultando simultáneamente en OpenAlex, PubMed, arXiv y SciELO...</p>
              <p className="text-xs text-gray-400">Verificando metadatos y resúmenes de acceso abierto</p>
            </div>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-16 bg-[#051208]/85 rounded-3xl border border-white/10 p-8 space-y-4">
            <AlertCircle className="text-[#D4AF37] mx-auto mb-2" size={40} />
            <h3 className="text-lg font-bold text-white font-serif">No se encontraron artículos para "{activeQuery}"</h3>
            <p className="text-xs text-gray-300 max-w-md mx-auto font-light leading-relaxed">
              Intente simplificar la búsqueda o usar términos alternativos en español o inglés.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 font-mono text-xs text-gray-400">
              <span>Mostrando <strong className="text-[#D4AF37] font-bold">{results.length}</strong> publicaciones científicas halladas</span>
              <span className="hidden sm:inline">Fuentes activas: OpenAlex • PubMed • arXiv</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.map((paper) => {
                const citations = generateCitations(paper);
                return (
                  <div
                    key={paper.id}
                    className="bg-[#051208]/85 border border-white/10 hover:border-[#D4AF37]/70 rounded-3xl p-6 backdrop-blur-xl shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                        <span className="px-2.5 py-1 bg-[#D4AF37]/15 text-[#D4AF37] text-[9px] font-bold uppercase tracking-widest rounded border border-[#D4AF37]/35">
                          {paper.fuente_nombre}
                        </span>
                        <span className="text-[10px] font-mono text-gray-400">
                          {paper.anio} • {paper.disciplina}
                        </span>
                      </div>

                      <h3 className="font-serif text-lg font-bold text-white leading-snug group-hover:text-[#D4AF37] transition-colors">
                        {paper.titulo}
                      </h3>

                      <p className="text-[#D4AF37] text-xs font-mono font-semibold">
                        {(paper.autores || []).join(', ')}
                      </p>

                      <p className="text-gray-300 text-xs font-light leading-relaxed line-clamp-3 bg-black/40 p-3 rounded-xl border border-white/5 italic">
                        "{paper.abstract}"
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                      {/* BOTÓN: VER DOCUMENTO EN FUENTE ORIGINAL */}
                      <a
                        href={paper.url_original}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-extrabold text-[11px] uppercase tracking-wider rounded-xl hover:bg-white transition-all shadow-md flex items-center gap-1.5"
                      >
                        <span>Ver en Repositorio Oficial</span>
                        <ExternalLink size={13} />
                      </a>

                      <div className="flex items-center gap-2">
                        {/* BOTÓN: CITAR APA 7 & ICONTEC */}
                        <button
                          onClick={() => setSelectedCitationPaper(paper)}
                          className="px-3 py-2 bg-white/10 hover:bg-white/20 text-[#D4AF37] font-bold text-[11px] uppercase rounded-xl border border-white/10 transition-all flex items-center gap-1"
                          title="Generar Cita APA 7 o ICONTEC"
                        >
                          <FileText size={13} /> Citar
                        </button>

                        {/* BOTÓN: GUARDAR EN CARPETA */}
                        <button
                          onClick={() => setActiveFolderModalPaper(paper)}
                          className="px-3 py-2 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white font-bold text-[11px] uppercase rounded-xl border border-white/10 transition-all flex items-center gap-1"
                          title="Guardar en Carpeta de Investigación"
                        >
                          <Bookmark size={13} /> Guardar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MODAL DE MOTOR DE CITACIÓN APA 7ª E ICONTEC */}
        {selectedCitationPaper && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
            <div className="bg-[#051208] border border-[#D4AF37]/50 rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6 relative shadow-[0_0_90px_rgba(212,175,55,0.25)]">
              <button
                onClick={() => setSelectedCitationPaper(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
              >
                <X size={16} />
              </button>

              <div className="space-y-2 border-b border-[#D4AF37]/20 pb-4">
                <span className="px-3 py-1 bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest rounded border border-[#D4AF37]/40 inline-flex items-center gap-1">
                  <FileText size={12} /> MOTOR DE CITACIÓN ACADÉMICA AUTOMÁTICO
                </span>
                <h3 className="font-serif text-lg font-bold text-white leading-snug">{selectedCitationPaper.titulo}</h3>
              </div>

              <div className="space-y-4 font-mono text-xs">
                {/* CITA APA 7ª EDICIÓN */}
                <div className="p-4 bg-black/60 rounded-2xl border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-[#D4AF37] font-bold uppercase tracking-wider text-[11px]">
                    <span>Cita Estándar Internacional (APA 7ª Edición)</span>
                    <button
                      onClick={() => copyToClipboard(generateCitations(selectedCitationPaper).apa, 'APA 7')}
                      className="px-3 py-1 bg-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black rounded-lg border border-[#D4AF37]/40 transition-all flex items-center gap-1"
                    >
                      <Copy size={12} /> {copiedFormat === 'APA 7' ? '¡Copiado!' : 'Copiar Cita APA 7'}
                    </button>
                  </div>
                  <p className="text-gray-200 leading-relaxed italic bg-[#030904] p-3 rounded-xl border border-white/5">
                    {generateCitations(selectedCitationPaper).apa}
                  </p>
                </div>

                {/* CITA ICONTEC (COLOMBIA) */}
                <div className="p-4 bg-black/60 rounded-2xl border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-[#D4AF37] font-bold uppercase tracking-wider text-[11px]">
                    <span>Cita Norma Colombiana (ICONTEC NTC 1486 / 5613)</span>
                    <button
                      onClick={() => copyToClipboard(generateCitations(selectedCitationPaper).icontec, 'ICONTEC')}
                      className="px-3 py-1 bg-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black rounded-lg border border-[#D4AF37]/40 transition-all flex items-center gap-1"
                    >
                      <Copy size={12} /> {copiedFormat === 'ICONTEC' ? '¡Copiado!' : 'Copiar Cita ICONTEC'}
                    </button>
                  </div>
                  <p className="text-gray-200 leading-relaxed italic bg-[#030904] p-3 rounded-xl border border-white/5">
                    {generateCitations(selectedCitationPaper).icontec}
                  </p>
                </div>
              </div>

              <div className="pt-2 text-right">
                <button
                  onClick={() => setSelectedCitationPaper(null)}
                  className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase font-bold rounded-xl"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL DE GUARDAR EN CARPETA DE PROYECTO */}
        {activeFolderModalPaper && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
            <div className="bg-[#051208] border border-[#D4AF37]/50 rounded-3xl max-w-md w-full p-6 space-y-6 relative shadow-[0_0_90px_rgba(212,175,55,0.25)]">
              <button
                onClick={() => setActiveFolderModalPaper(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
              >
                <X size={16} />
              </button>

              <div className="space-y-2 border-b border-[#D4AF37]/20 pb-3">
                <span className="px-3 py-1 bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest rounded border border-[#D4AF37]/40 inline-flex items-center gap-1">
                  <Bookmark size={12} /> GUARDAR REFERENCIA EN CARPETA
                </span>
                <h3 className="font-serif text-sm font-bold text-white truncate">{activeFolderModalPaper.titulo}</h3>
              </div>

              {/* Crear Nueva Carpeta */}
              <div className="space-y-3 font-mono text-xs">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nombre de nueva carpeta..."
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className="flex-1 bg-[#030904] border border-[#D4AF37]/30 rounded-xl px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]"
                  />
                  <button
                    onClick={createNewFolder}
                    className="px-4 py-2 bg-[#D4AF37] text-black font-bold uppercase rounded-xl hover:bg-white transition-all shrink-0 flex items-center gap-1"
                  >
                    <FolderPlus size={14} /> Crear
                  </button>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-gray-400 block">Seleccione carpeta de destino:</label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {Object.keys(researchFolders).map(folderName => (
                      <button
                        key={folderName}
                        onClick={() => savePaperToFolder(folderName, activeFolderModalPaper)}
                        className="w-full p-3 bg-black/60 hover:bg-[#D4AF37]/20 border border-white/10 hover:border-[#D4AF37]/50 rounded-xl text-left font-semibold text-white flex items-center justify-between transition-all"
                      >
                        <span className="truncate">{folderName}</span>
                        <span className="text-[10px] text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded">
                          {researchFolders[folderName]?.length || 0} ítems
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL DE VISTA DE CARPETAS DE PROYECTO Y EXPORTACIÓN BIBTEX/RIS */}
        {selectedFolderView && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl animate-in fade-in">
            <div className="bg-[#051208] border border-[#D4AF37]/50 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-[0_0_90px_rgba(212,175,55,0.25)]">
              
              <div className="p-6 border-b border-[#D4AF37]/20 flex items-center justify-between">
                <div>
                  <span className="px-3 py-1 bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest rounded border border-[#D4AF37]/40 inline-flex items-center gap-1 mb-1">
                    <Bookmark size={12} /> CARPETAS DE PROYECTO DE INVESTIGACIÓN
                  </span>
                  <h3 className="font-serif text-xl font-bold text-white">Gestión de Referencias & Exportación BibTeX/RIS</h3>
                </div>

                <button
                  onClick={() => setSelectedFolderView(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#D4AF37] hover:text-black flex items-center justify-center transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {Object.keys(researchFolders).length === 0 ? (
                  <p className="text-center text-gray-400 font-mono text-xs py-8">No ha creado carpetas de proyecto aún.</p>
                ) : (
                  Object.keys(researchFolders).map(folderName => {
                    const folderItems = researchFolders[folderName] || [];
                    return (
                      <div key={folderName} className="bg-black/60 border border-white/15 rounded-2xl p-5 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                          <div>
                            <h4 className="font-mono text-sm font-bold text-[#D4AF37]">{folderName}</h4>
                            <span className="text-[10px] text-gray-400 font-mono">{folderItems.length} referencias guardadas</span>
                          </div>

                          {/* BOTONES DE EXPORTACIÓN BIBTEX / RIS / APA 7 */}
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => exportFolderBibliography(folderName, 'bibtex')}
                              className="px-3 py-1.5 bg-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black text-[10px] font-mono font-bold uppercase rounded-lg border border-[#D4AF37]/40 transition-all flex items-center gap-1"
                              title="Exportar archivo BibTeX (.bib) para Zotero / Mendeley / LaTeX"
                            >
                              <Download size={12} /> BibTeX (.bib)
                            </button>

                            <button
                              onClick={() => exportFolderBibliography(folderName, 'ris')}
                              className="px-3 py-1.5 bg-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black text-[10px] font-mono font-bold uppercase rounded-lg border border-[#D4AF37]/40 transition-all flex items-center gap-1"
                              title="Exportar archivo RIS (.ris) para Zotero / EndNote"
                            >
                              <Download size={12} /> RIS (.ris)
                            </button>

                            <button
                              onClick={() => exportFolderBibliography(folderName, 'apa')}
                              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white text-[10px] font-mono font-bold uppercase rounded-lg border border-white/10 transition-all flex items-center gap-1"
                            >
                              <Copy size={12} /> Citas APA 7 (TXT)
                            </button>

                            <button
                              onClick={() => deleteFolder(folderName)}
                              className="p-1.5 text-gray-400 hover:text-rose-400 transition-colors"
                              title="Eliminar carpeta"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>

                        {/* LISTADO DE ITEMS EN LA CARPETA */}
                        {folderItems.length === 0 ? (
                          <p className="text-xs font-mono text-gray-500 italic py-2">Carpeta vacía.</p>
                        ) : (
                          <div className="space-y-2 font-mono text-xs">
                            {folderItems.map(item => (
                              <div key={item.id} className="p-3 bg-[#030904] rounded-xl border border-white/5 flex items-center justify-between gap-3">
                                <div className="truncate">
                                  <p className="text-white font-bold truncate">{item.titulo}</p>
                                  <p className="text-gray-400 text-[10px] truncate">{(item.autores || []).join(', ')} • {item.anio}</p>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <a
                                    href={item.url_original}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 text-[#D4AF37] hover:bg-[#D4AF37]/20 rounded-lg"
                                    title="Ver en repositorio oficial"
                                  >
                                    <ExternalLink size={14} />
                                  </a>

                                  <button
                                    onClick={() => removePaperFromFolder(folderName, item.id)}
                                    className="p-1.5 text-gray-400 hover:text-rose-400 rounded-lg"
                                    title="Quitar de esta carpeta"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        <AcademicTrustBadge />
      </div>
    </div>
  );
}

export default function BaseDatosPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#020502] flex items-center justify-center text-white font-mono text-xs">
        <RefreshCw className="animate-spin text-[#D4AF37] mb-2" size={32} />
      </div>
    }>
      <GlobalAcademicRepositoryContent />
    </Suspense>
  );
}
