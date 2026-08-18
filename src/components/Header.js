'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthProvider";
import { User, LogOut, ShoppingCart, X, Search } from "lucide-react";
import { db } from "../utils/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import {
  IconTienda,
  IconNoticias,
  IconPeriodismo,
  IconLibros,
  IconBaseDatos,
  IconMovimiento,
  IconServicios,
  IconInfo,
  IconArquitectura,
  IconArtistas
} from "./DockIcons";

const DEFAULT_DOCK_ITEMS = [
  { id: 'tienda', name: 'TIENDA', href: '/shop', icon: IconTienda, color: '#D4AF37', activeClass: 'active-brasa-tienda' },
  { id: 'noticias', name: 'NOTICIAS', href: '/noticias', icon: IconNoticias, color: '#E2E8F0', activeClass: 'active-brasa-noticias' },
  { id: 'periodismo', name: 'PERIODISMO', href: '/periodismo-alternativo', icon: IconPeriodismo, color: '#FF6B35', activeClass: 'active-brasa-periodismo' },
  { id: 'libros', name: 'LIBROS', href: '/libros', icon: IconLibros, color: '#F3E5AB', activeClass: 'active-brasa-libros' },
  { id: 'datos', name: 'BASE DE DATOS', href: '/base-de-datos-global', icon: IconBaseDatos, color: '#00F0FF', activeClass: 'active-brasa-datos' },
  { id: 'movimiento', name: 'MOVIMIENTO', href: '/movimiento', icon: IconMovimiento, color: '#FF4D4D', activeClass: 'active-brasa-movimiento' },
  { id: 'artistas', name: 'ARTISTAS', href: '/artistas', icon: IconArtistas, color: '#E11D48', activeClass: 'active-brasa-artistas' },
  { id: 'arquitectura', name: 'ARQUITECTURA', href: '/gca', icon: IconArquitectura, color: '#FCD34D', activeClass: 'active-brasa-arquitectura' },
  { id: 'servicios', name: 'SERVICIOS', href: '/servicios', icon: IconServicios, color: '#A855F7', activeClass: 'active-brasa-servicios' },
  { id: 'informacion', name: 'INFO & PQR', href: '/informacion', icon: IconInfo, color: '#10B981', activeClass: 'active-brasa-info' },
];

export default function Header({ headerConfig = {} }) {
  const pathname = usePathname();
  const router = useRouter();
  const { cartItemCount, setIsCartOpen } = useCart();
  const { user, logout } = useAuth();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCenterIndex, setActiveCenterIndex] = useState(0);

  // Orden Dinámico en Tiempo Real (Sincronizado desde GC Admin)
  const [dockItems, setDockItems] = useState(DEFAULT_DOCK_ITEMS);

  const carouselRef = useRef(null);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'settings', 'navigation_order'),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data.orderedPaths && Array.isArray(data.orderedPaths)) {
            const orderMap = new Map(data.orderedPaths.map((p, idx) => [p, idx]));
            const sorted = [...DEFAULT_DOCK_ITEMS].sort((a, b) => {
              const idxA = orderMap.has(a.href) ? orderMap.get(a.href) : 999;
              const idxB = orderMap.has(b.href) ? orderMap.get(b.href) : 999;
              return idxA - idxB;
            });
            setDockItems(sorted);
          }
        }
      },
      (err) => console.log("Navigation order sub error:", err)
    );

    return () => unsub();
  }, []);

  const getActiveItem = () => {
    if (pathname.includes('/shop') || pathname.includes('/product') || pathname.includes('/tienda')) return 'tienda';
    if (pathname.includes('/noticias') || pathname.includes('/blog')) return 'noticias';
    if (pathname.includes('/periodismo')) return 'periodismo';
    if (pathname.includes('/libros')) return 'libros';
    if (pathname.includes('/base-de-datos')) return 'datos';
    if (pathname.includes('/movimiento')) return 'movimiento';
    if (pathname.includes('/artistas')) return 'artistas';
    if (pathname.includes('/gca')) return 'arquitectura';
    if (pathname.includes('/servicios')) return 'servicios';
    if (pathname.includes('/informacion') || pathname.includes('/pqr')) return 'informacion';
    return 'tienda';
  };

  const activeId = getActiveItem();

  // Escuchar el Scroll del Carrusel Móvil para Resaltar el Ícono Central (Throttled con rAF)
  const scrollRafRef = useRef(null);
  const handleScroll = () => {
    if (scrollRafRef.current) return;
    scrollRafRef.current = requestAnimationFrame(() => {
      scrollRafRef.current = null;
      if (!carouselRef.current) return;
      const container = carouselRef.current;
      const containerCenter = container.scrollLeft + container.clientWidth / 2;
      const children = Array.from(container.children);

      let closestIdx = 0;
      let closestDist = Infinity;

      children.forEach((child, idx) => {
        const childCenter = child.offsetLeft + child.clientWidth / 2;
        const dist = Math.abs(containerCenter - childCenter);
        if (dist < closestDist) {
          closestDist = dist;
          closestIdx = idx;
        }
      });

      setActiveCenterIndex((prevIdx) => (prevIdx !== closestIdx ? closestIdx : prevIdx));
    });
  };

  useEffect(() => {
    const activeIdx = dockItems.findIndex(item => item.id === activeId);
    if (activeIdx !== -1) {
      setActiveCenterIndex(activeIdx);
    }
  }, [pathname, dockItems, activeId]);

  return (
    <>
      {/* Header Superior Fijo Adaptativo sin Colisiones ni Solapamiento */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#050A07]/95 backdrop-blur-xl border-b border-[#D4AF37]/20 px-3 sm:px-6 py-2.5 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 h-10">
          
          {/* LOGO DE MARCA (Izquierda en Móvil, Centrado en Desktop) */}
          <div className="flex items-center shrink-0 pointer-events-auto md:absolute md:left-1/2 md:-translate-x-1/2">
            <Link href="/" className="flex items-center">
              {headerConfig.logoText ? (
                <span className="font-playfair text-base sm:text-lg font-bold text-gold-gradient tracking-wide">{headerConfig.logoText}</span>
              ) : (
                <Image 
                  src="/Logos/GranColinos.Com.png" 
                  alt="GranColinos Logo" 
                  width={140} 
                  height={36} 
                  className="w-28 sm:w-36 h-auto object-contain filter drop-shadow-[0_0_12px_rgba(212,175,55,0.55)] hover:scale-105 transition-transform"
                  priority
                />
              )}
            </Link>
          </div>

          {/* Acciones del Lado Derecho (Búsqueda, Usuario, Carrito) */}
          <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 ml-auto shrink-0 pointer-events-auto">
            {/* Buscador Rápido */}
            <div className="relative">
              {showSearch ? (
                <div className="flex items-center bg-black/90 border border-[#D4AF37]/60 rounded-full px-2.5 py-1 animate-in fade-in">
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchQuery.trim()) {
                        router.push(`/shop?q=${encodeURIComponent(searchQuery)}`);
                        setShowSearch(false);
                      }
                    }}
                    className="bg-transparent text-xs text-white placeholder-gray-400 focus:outline-none w-24 xs:w-32 md:w-40"
                    autoFocus
                  />
                  <button onClick={() => setShowSearch(false)} className="text-gray-400 hover:text-white ml-1">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowSearch(true)} 
                  className="p-1.5 text-gray-200 hover:text-[#D4AF37] transition-colors rounded-full hover:bg-[#D4AF37]/15"
                  title="Buscar"
                >
                  <Search size={17} />
                </button>
              )}
            </div>

            {/* Auth / Club (ADAPTATIVO - NUNCA SE COLISIONA CON EL LOGO) */}
            {user ? (
              <div className="flex items-center gap-1 shrink-0">
                <Link 
                  href="/comunidad" 
                  className="flex items-center gap-1 text-[9px] xs:text-[10px] font-bold tracking-wider uppercase text-[#D4AF37] border border-[#D4AF37]/40 px-2 py-1 xs:px-2.5 xs:py-1 sm:px-3 sm:py-1.5 rounded-full bg-[#D4AF37]/10 hover:bg-[#D4AF37] hover:text-black transition-all whitespace-nowrap"
                >
                  <User size={12} />
                  <span>MI CLUB</span>
                </Link>
                <button onClick={() => logout()} className="text-gray-400 hover:text-red-400 p-1" title="Cerrar Sesión">
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="flex items-center gap-1 text-[9px] xs:text-[10px] tracking-wider uppercase font-bold text-[#D4AF37] border border-[#D4AF37]/40 px-2 py-1 xs:px-2.5 xs:py-1 sm:px-3 sm:py-1.5 rounded-full bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 transition-all shrink-0 whitespace-nowrap"
              >
                <User size={12} />
                <span>Ingresar</span>
              </Link>
            )}

            {/* Carrito */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-1.5 text-gray-100 hover:text-[#D4AF37] transition-all rounded-full hover:bg-[#D4AF37]/15 shrink-0"
              title="Carrito de Compras"
            >
              <ShoppingCart size={18} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-black font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-[0_0_12px_rgba(212,175,55,0.9)] animate-pulse">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Floating Bottom Navigation Container */}
      <div className="fixed bottom-3 left-0 right-0 z-50 px-3 pointer-events-none flex justify-center">
        
        {/* CARRUSEL DE BURBUJAS FLOTANTES MÓVIL (<768px) - CÁPSULA COMPACTA PERFECTA */}
        <div className="md:hidden pointer-events-auto bg-[#050A07]/95 border border-[#D4AF37]/40 backdrop-blur-2xl rounded-full py-1 px-1.5 shadow-[0_10px_35px_rgba(0,0,0,0.95)] max-w-[340px] xs:max-w-[400px] w-full">
          <div
            ref={carouselRef}
            onScroll={handleScroll}
            className="flex items-center justify-start xs:justify-center gap-1 overflow-x-auto snap-x snap-mandatory scrollbar-none px-1 py-0.5"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {dockItems.map((item, idx) => {
              const IconComp = item.icon;
              const isSelectedActive = activeId === item.id;
              const isCentered = activeCenterIndex === idx;

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  prefetch={false}
                  className={`snap-center shrink-0 w-9 h-9 xs:w-10 xs:h-10 rounded-full flex items-center justify-center transition-all duration-300 border relative ${
                    isCentered || isSelectedActive
                      ? 'scale-110 border-white/60 shadow-[0_0_15px_rgba(212,175,55,0.6)] bg-white/15 z-10'
                      : 'scale-100 border-transparent text-gray-300 opacity-80 hover:opacity-100'
                  }`}
                  style={{ color: (isCentered || isSelectedActive) ? item.color : '#D4AF37' }}
                  aria-label={item.name}
                >
                  <IconComp className="w-4 h-4 xs:w-5 xs:h-5 shrink-0" style={{ color: (isCentered || isSelectedActive) ? item.color : '#D4AF37' }} />
                  {(isCentered || isSelectedActive) && (
                    <span className="absolute -top-6 bg-black/95 text-white text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border border-[#D4AF37]/50 whitespace-nowrap shadow-lg pointer-events-none">
                      {item.name}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* DOCK FLOTANTE DESKTOP (>=768px) */}
        <header className="hidden md:flex pointer-events-auto nav-pill-bottom-floating px-5 py-2.5 items-center justify-between transition-all duration-300 gap-3 shadow-2xl">
          <nav className="flex items-center justify-center gap-3 lg:gap-4 w-full">
            {dockItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeId === item.id;
              
              return (
                <div key={item.id} className="relative group flex items-center justify-center">
                  <Link
                    href={item.href}
                    prefetch={false}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border ${
                      isActive
                        ? `${item.activeClass} border-white/40 shadow-lg scale-110`
                        : 'border-transparent text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 hover:scale-105'
                    }`}
                    style={{ color: isActive ? item.color : undefined }}
                  >
                    <IconComp className="w-5 h-5 shrink-0" style={{ color: isActive ? item.color : undefined }} />
                  </Link>

                  {/* Tooltip con nombre de sección en hover */}
                  <span className="absolute -top-9 bg-black/95 text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-[#D4AF37]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-xl">
                    {item.name}
                  </span>
                </div>
              );
            })}
          </nav>
        </header>

      </div>
    </>
  );
}
