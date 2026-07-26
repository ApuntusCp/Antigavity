'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthProvider";
import { User, LogOut, ShoppingCart, Menu, X, Search } from "lucide-react";
import {
  IconTienda,
  IconNoticias,
  IconPeriodismo,
  IconLibros,
  IconBaseDatos,
  IconMovimiento
} from "./DockIcons";

const DOCK_ITEMS = [
  { id: 'tienda', name: 'TIENDA', href: '/shop', icon: IconTienda, color: '#D4AF37', activeClass: 'active-brasa-tienda' },
  { id: 'noticias', name: 'NOTICIAS', href: '/noticias', icon: IconNoticias, color: '#E2E8F0', activeClass: 'active-brasa-noticias' },
  { id: 'periodismo', name: 'PERIODISMO', href: '/periodismo-alternativo', icon: IconPeriodismo, color: '#FF6B35', activeClass: 'active-brasa-periodismo' },
  { id: 'libros', name: 'LIBROS', href: '/libros', icon: IconLibros, color: '#F3E5AB', activeClass: 'active-brasa-libros' },
  { id: 'datos', name: 'BASE DATOS', href: '/base-de-datos-global', icon: IconBaseDatos, color: '#00F0FF', activeClass: 'active-brasa-datos' },
  { id: 'movimiento', name: 'MOVIMIENTO', href: '/movimiento', icon: IconMovimiento, color: '#FF4D4D', activeClass: 'active-brasa-movimiento' },
];

export default function Header({ headerConfig = {} }) {
  const pathname = usePathname();
  const { cartItemCount, setIsCartOpen } = useCart();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const getActiveItem = () => {
    if (pathname.includes('/shop') || pathname.includes('/product') || pathname.includes('/tienda')) return 'tienda';
    if (pathname.includes('/noticias') || pathname.includes('/blog')) return 'noticias';
    if (pathname.includes('/periodismo')) return 'periodismo';
    if (pathname.includes('/libros')) return 'libros';
    if (pathname.includes('/base-de-datos')) return 'datos';
    if (pathname.includes('/movimiento')) return 'movimiento';
    return 'tienda';
  };

  const activeId = getActiveItem();

  return (
    <>
      {/* Bottom Floating Pill Navigation Container */}
      <div className="fixed bottom-4 left-0 right-0 z-50 px-2 sm:px-4 md:px-8 max-w-7xl mx-auto pointer-events-none">
        
        {/* Mobile Dropdown Navigation */}
        {isMobileMenuOpen && (
          <div className="pointer-events-auto mb-3 bg-[#080F07]/95 border border-[#D4AF37]/40 backdrop-blur-2xl rounded-2xl p-6 shadow-[0_-20px_50px_rgba(0,0,0,0.95)] animate-in fade-in slide-in-from-bottom-5 md:hidden">
            <nav className="flex flex-col gap-3.5 text-center font-serif text-base tracking-wider text-white">
              {DOCK_ITEMS.map((item) => {
                const IconComp = item.icon;
                const isActive = activeId === item.id;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={toggleMobileMenu}
                    className={`flex items-center justify-center gap-3 py-2 px-4 rounded-xl transition-all ${
                      isActive ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40' : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    <IconComp className="w-5 h-5" style={{ color: isActive ? item.color : 'inherit' }} />
                    <span className="font-bold uppercase text-xs tracking-widest">{item.name}</span>
                  </Link>
                );
              })}
              
              <div className="border-t border-[#D4AF37]/20 pt-4 mt-2">
                {user ? (
                  <div className="flex flex-col gap-3">
                    <Link href="/comunidad" onClick={toggleMobileMenu} className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                      Mi Perfil de Club
                    </Link>
                    <button onClick={() => { logout(); toggleMobileMenu(); }} className="text-xs text-red-400 uppercase tracking-widest">
                      Cerrar Sesión
                    </button>
                  </div>
                ) : (
                  <Link href="/login" onClick={toggleMobileMenu} className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] flex items-center justify-center gap-2">
                    <User size={16} /> Iniciar Sesión / Registrarse
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}

        <header className="pointer-events-auto nav-pill-bottom-floating px-3 sm:px-5 py-2.5 flex items-center justify-between transition-all duration-300 gap-2 overflow-x-auto custom-scrollbar">
          
          {/* Logo constante en Dorado */}
          <Link href="/" className="flex items-center gap-2 shrink-0 relative z-50">
            {headerConfig.logoText ? (
              <span className="font-playfair text-xl font-bold text-gold-gradient tracking-wide">{headerConfig.logoText}</span>
            ) : (
              <Image 
                src="/Logos/GranColinos.Com.png" 
                alt="GranColinos Logo" 
                width={150} 
                height={40} 
                className="object-contain filter drop-shadow-[0_0_10px_rgba(212,175,55,0.45)]"
                priority
              />
            )}
          </Link>
          
          {/* Desktop 6 Navigation Items with Intelligent Glow */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-3 overflow-x-auto">
            {DOCK_ITEMS.map((item) => {
              const IconComp = item.icon;
              const isActive = activeId === item.id;
              
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`relative text-[10px] lg:text-xs uppercase tracking-widest font-semibold transition-all duration-300 flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
                    isActive
                      ? `${item.activeClass} border border-white/20 shadow-md font-bold`
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                  style={{ color: isActive ? item.color : undefined }}
                >
                  <IconComp className="w-4 h-4 shrink-0" style={{ color: isActive ? item.color : '#D4AF37' }} />
                  <span className="whitespace-nowrap">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Action Icons: Search, User, Cart (Constant Gold Theme) */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            
            {/* Search Bar Toggle */}
            <div className="relative">
              {showSearch ? (
                <div className="flex items-center bg-black/90 border border-[#D4AF37]/60 rounded-full px-3 py-1 animate-in fade-in zoom-in-95">
                  <input
                    type="text"
                    placeholder="Buscar en la red..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchQuery.trim()) {
                        window.location.href = `/shop?q=${encodeURIComponent(searchQuery)}`;
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
                  className="p-1.5 text-gray-200 hover:text-[#D4AF37] transition-colors rounded-full hover:bg-[#D4AF37]/15"
                  title="Buscar"
                >
                  <Search size={17} />
                </button>
              )}
            </div>

            {/* Auth / Club */}
            {user ? (
              <div className="hidden lg:flex items-center gap-2">
                <Link 
                  href="/comunidad" 
                  className="text-[10px] font-bold tracking-widest uppercase text-[#D4AF37] border border-[#D4AF37]/40 px-3 py-1 rounded-full hover:bg-[#D4AF37] hover:text-black transition-all"
                >
                  MI CLUB
                </Link>
                <button onClick={() => logout()} className="text-gray-400 hover:text-red-400 transition-colors" title="Cerrar Sesión">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="hidden lg:flex items-center gap-1 text-[11px] tracking-wider uppercase font-semibold text-gray-200 hover:text-[#D4AF37] transition-colors"
              >
                <User size={15} /> Ingresar
              </Link>
            )}

            {/* Shopping Cart Button */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-1.5 text-gray-100 hover:text-[#D4AF37] transition-all rounded-full hover:bg-[#D4AF37]/15"
              title="Carrito de Compras"
            >
              <ShoppingCart size={19} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-black font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-[0_0_12px_rgba(212,175,55,0.9)] animate-pulse">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden text-gray-200 hover:text-[#D4AF37] p-1"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </header>
      </div>
    </>
  );
}
