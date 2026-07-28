'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthProvider";
import { User, LogOut, ShoppingCart, X, Search } from "lucide-react";
import {
  IconTienda,
  IconNoticias,
  IconPeriodismo,
  IconLibros,
  IconBaseDatos,
  IconMovimiento,
  IconServicios,
  IconInfo
} from "./DockIcons";

const DOCK_ITEMS = [
  { id: 'tienda', name: 'TIENDA', href: '/shop', icon: IconTienda, color: '#D4AF37', activeClass: 'active-brasa-tienda' },
  { id: 'noticias', name: 'NOTICIAS', href: '/noticias', icon: IconNoticias, color: '#E2E8F0', activeClass: 'active-brasa-noticias' },
  { id: 'periodismo', name: 'PERIODISMO', href: '/periodismo-alternativo', icon: IconPeriodismo, color: '#FF6B35', activeClass: 'active-brasa-periodismo' },
  { id: 'libros', name: 'LIBROS', href: '/libros', icon: IconLibros, color: '#F3E5AB', activeClass: 'active-brasa-libros' },
  { id: 'datos', name: 'BASE DE DATOS', href: '/base-de-datos-global', icon: IconBaseDatos, color: '#00F0FF', activeClass: 'active-brasa-datos' },
  { id: 'movimiento', name: 'MOVIMIENTO', href: '/movimiento', icon: IconMovimiento, color: '#FF4D4D', activeClass: 'active-brasa-movimiento' },
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

  const carouselRef = useRef(null);



  const getActiveItem = () => {
    if (pathname.includes('/shop') || pathname.includes('/product') || pathname.includes('/tienda')) return 'tienda';
    if (pathname.includes('/noticias') || pathname.includes('/blog')) return 'noticias';
    if (pathname.includes('/periodismo')) return 'periodismo';
    if (pathname.includes('/libros')) return 'libros';
    if (pathname.includes('/base-de-datos')) return 'datos';
    if (pathname.includes('/movimiento')) return 'movimiento';
    if (pathname.includes('/servicios')) return 'servicios';
    if (pathname.includes('/informacion') || pathname.includes('/pqr')) return 'informacion';
    return 'tienda';
  };

  const activeId = getActiveItem();

  // Escuchar el Scroll del Carrusel Móvil para Resaltar el Ícono Central
  const handleScroll = () => {
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

    setActiveCenterIndex(closestIdx);
  };

  useEffect(() => {
    const activeIdx = DOCK_ITEMS.findIndex(item => item.id === activeId);
    if (activeIdx !== -1) {
      setActiveCenterIndex(activeIdx);
    }
  }, [pathname]);

  return (
    <>
      {/* Header Superior Fijo (Logo Centrado en la Geometría Exacta) */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#050A07]/90 backdrop-blur-xl border-b border-[#D4AF37]/20 px-4 py-3 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between relative h-10">
          
          {/* Lado Izquierdo Vacio/Equilibrado */}
          <div className="flex items-center gap-2"></div>

          {/* LOGO EN EL CENTRO EXACTO DEL ENCABEZADO */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-auto">
            <Link href="/" className="flex items-center gap-2">
              {headerConfig.logoText ? (
                <span className="font-playfair text-lg font-bold text-gold-gradient tracking-wide">{headerConfig.logoText}</span>
              ) : (
                <Image 
                  src="/Logos/GranColinos.Com.png" 
                  alt="GranColinos Logo" 
                  width={150} 
                  height={40} 
                  className="object-contain filter drop-shadow-[0_0_12px_rgba(212,175,55,0.55)] hover:scale-105 transition-transform"
                  priority
                />
              )}
            </Link>
          </div>

          {/* Acciones del Lado Derecho (Búsqueda, Usuario, Carrito) */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Buscador Rápido */}
            <div className="relative">
              {showSearch ? (
                <div className="flex items-center bg-black/90 border border-[#D4AF37]/60 rounded-full px-3 py-1 animate-in fade-in">
                  <input
                    type="text"
                    placeholder="Buscar en la red..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchQuery.trim()) {
                        router.push(`/shop?q=${encodeURIComponent(searchQuery)}`);
                        setShowSearch(false);
                      }
                    }}
                    className="bg-transparent text-xs text-white placeholder-gray-400 focus:outline-none w-28 md:w-40"
                    autoFocus
                  />
                  <button onClick={() => setShowSearch(false)} className="text-gray-400 hover:text-white ml-1">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowSearch(true)} 
                  className="p-2 text-gray-200 hover:text-[#D4AF37] transition-colors rounded-full hover:bg-[#D4AF37]/15"
                  title="Buscar"
                >
                  <Search size={18} />
                </button>
              )}
            </div>

            {/* Auth / Club */}
            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link 
                  href="/comunidad" 
                  className="text-[10px] font-bold tracking-widest uppercase text-[#D4AF37] border border-[#D4AF37]/40 px-3 py-1.5 rounded-full hover:bg-[#D4AF37] hover:text-black transition-all"
                >
                  MI CLUB
                </Link>
                <button onClick={() => logout()} className="text-gray-400 hover:text-red-400 p-1" title="Cerrar Sesión">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="hidden sm:flex items-center gap-1 text-[10px] tracking-wider uppercase font-bold text-[#D4AF37] border border-[#D4AF37]/30 px-3 py-1.5 rounded-full hover:bg-[#D4AF37]/20 transition-all"
              >
                <User size={14} /> Ingresar
              </Link>
            )}

            {/* Carrito */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-100 hover:text-[#D4AF37] transition-all rounded-full hover:bg-[#D4AF37]/15"
              title="Carrito de Compras"
            >
              <ShoppingCart size={19} />
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
      <div className="fixed bottom-4 left-0 right-0 z-50 px-2 sm:px-6 max-w-5xl mx-auto pointer-events-none">
        
        {/* CARRUSEL DE BURBUJAS FLOTANTES MÓVIL (<768px) */}
        <div className="md:hidden pointer-events-auto bg-[#050A07]/90 border border-[#D4AF37]/40 backdrop-blur-2xl rounded-full py-2.5 px-3 shadow-[0_10px_35px_rgba(0,0,0,0.9)]">
          <div
            ref={carouselRef}
            onScroll={handleScroll}
            className="flex items-center gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-none px-4 py-1"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {DOCK_ITEMS.map((item, idx) => {
              const IconComp = item.icon;
              const isSelectedActive = activeId === item.id;
              const isCentered = activeCenterIndex === idx;

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`snap-center shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 border relative ${
                    isCentered || isSelectedActive
                      ? 'scale-125 border-white/60 shadow-[0_0_20px_rgba(212,175,55,0.6)] bg-white/10 z-10'
                      : 'scale-90 border-transparent text-gray-400 opacity-70 hover:opacity-100'
                  }`}
                  style={{ color: (isCentered || isSelectedActive) ? item.color : '#D4AF37' }}
                  aria-label={item.name}
                >
                  <IconComp className="w-5 h-5 shrink-0" style={{ color: (isCentered || isSelectedActive) ? item.color : '#D4AF37' }} />
                  {(isCentered || isSelectedActive) && (
                    <span className="absolute -top-7 bg-black/90 text-white text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border border-[#D4AF37]/40 whitespace-nowrap shadow-md">
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
            {DOCK_ITEMS.map((item) => {
              const IconComp = item.icon;
              const isActive = activeId === item.id;
              
              return (
                <div key={item.id} className="relative group flex items-center justify-center">
                  <Link
                    href={item.href}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border ${
                      isActive
                        ? `${item.activeClass} border-white/40 shadow-lg scale-110`
                        : 'border-transparent text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 hover:scale-105'
                    }`}
                    style={{ color: isActive ? item.color : undefined }}
                    aria-label={item.name}
                  >
                    <IconComp className="w-5 h-5 shrink-0" style={{ color: isActive ? item.color : '#D4AF37' }} />
                  </Link>

                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#050505] text-white text-[10px] font-bold tracking-widest uppercase rounded-lg border border-[#D4AF37]/50 shadow-[0_0_15px_rgba(0,0,0,0.9)] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.name}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#050505]"></div>
                  </div>
                </div>
              );
            })}
          </nav>
        </header>
      </div>
    </>
  );
}
