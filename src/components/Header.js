'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthProvider";
import { User, LogOut, ShoppingCart, Menu, X, Search, LayoutGrid, Feather, Flame, Sparkles } from "lucide-react";

export default function Header({ headerConfig = {} }) {
  const { cartItemCount, setIsCartOpen } = useCart();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>
      {/* Floating Pill Navigation Container */}
      <div className="fixed top-4 left-0 right-0 z-50 px-4 md:px-8 max-w-7xl mx-auto pointer-events-none">
        <header className="pointer-events-auto nav-pill-floating px-6 py-3.5 flex items-center justify-between transition-all duration-300">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 relative z-50">
            {headerConfig.logoText ? (
              <span className="font-playfair text-2xl font-bold text-gold-gradient tracking-wide">{headerConfig.logoText}</span>
            ) : (
              <Image 
                src="/Logos/GranColinos.Com.png" 
                alt="GranColinos Logo" 
                width={170} 
                height={48} 
                className="object-contain filter drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]"
                priority
              />
            )}
          </Link>
          
          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/#catalogo" 
              className="text-xs uppercase tracking-widest font-semibold text-gray-300 hover:text-[#D4AF37] transition-all duration-300 flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-[#D4AF37]/10"
            >
              <LayoutGrid size={15} className="text-[#D4AF37]" /> Catálogo
            </Link>
            
            <Link 
              href="/shop" 
              className="text-xs uppercase tracking-widest font-semibold text-gray-300 hover:text-[#D4AF37] transition-all duration-300 flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-[#D4AF37]/10"
            >
              <Sparkles size={15} className="text-[#D4AF37]" /> Tienda
            </Link>

            <Link 
              href="/blog" 
              className="text-xs uppercase tracking-widest font-semibold text-gray-300 hover:text-[#D4AF37] transition-all duration-300 flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-[#D4AF37]/10"
            >
              <Feather size={15} className="text-[#D4AF37]" /> Journal
            </Link>

            <Link 
              href="/movimiento" 
              className="text-xs uppercase tracking-widest font-semibold text-gray-300 hover:text-[#D4AF37] transition-all duration-300 flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-[#D4AF37]/10"
            >
              <Flame size={15} className="text-[#D4AF37]" /> Movimiento
            </Link>
          </nav>

          {/* Action Icons: Search, User, Cart */}
          <div className="flex items-center gap-4">
            
            {/* Search Bar Toggle */}
            <div className="relative">
              {showSearch ? (
                <div className="flex items-center bg-black/80 border border-[#D4AF37]/50 rounded-full px-3 py-1 animate-in fade-in zoom-in-95">
                  <input
                    type="text"
                    placeholder="Buscar producto..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchQuery.trim()) {
                        window.location.href = `/shop?q=${encodeURIComponent(searchQuery)}`;
                      }
                    }}
                    className="bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none w-32 md:w-44"
                    autoFocus
                  />
                  <button onClick={() => setShowSearch(false)} className="text-gray-400 hover:text-white ml-1">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowSearch(true)} 
                  className="p-2 text-gray-300 hover:text-[#D4AF37] transition-colors rounded-full hover:bg-[#D4AF37]/10"
                  title="Buscar"
                >
                  <Search size={18} />
                </button>
              )}
            </div>

            {/* Auth / Club */}
            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <Link 
                  href="/comunidad" 
                  className="text-[11px] font-bold tracking-widest uppercase text-[#D4AF37] border border-[#D4AF37]/40 px-3 py-1 rounded-full hover:bg-[#D4AF37] hover:text-black transition-all"
                >
                  MI CLUB
                </Link>
                <button onClick={() => logout()} className="text-gray-400 hover:text-red-400 transition-colors" title="Cerrar Sesión">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="hidden md:flex items-center gap-1.5 text-xs tracking-wider uppercase font-semibold text-gray-300 hover:text-[#D4AF37] transition-colors"
              >
                <User size={16} /> Ingresar
              </Link>
            )}

            {/* Shopping Cart Button */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-200 hover:text-[#D4AF37] transition-all rounded-full hover:bg-[#D4AF37]/10"
              title="Carrito de Compras"
            >
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-black font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(212,175,55,0.8)] animate-pulse">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden text-gray-300 hover:text-[#D4AF37] p-1"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </header>

        {/* Mobile Dropdown Navigation */}
        {isMobileMenuOpen && (
          <div className="pointer-events-auto mt-2 bg-[#091208]/95 border border-[#D4AF37]/30 backdrop-blur-2xl rounded-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.9)] animate-in fade-in zoom-in-95 md:hidden">
            <nav className="flex flex-col gap-4 text-center font-serif text-lg tracking-wider text-white">
              <Link href="/#catalogo" onClick={toggleMobileMenu} className="hover:text-[#D4AF37] transition-colors flex items-center justify-center gap-2">
                <LayoutGrid size={18} className="text-[#D4AF37]" /> Catálogo Exclusivo
              </Link>
              <Link href="/shop" onClick={toggleMobileMenu} className="hover:text-[#D4AF37] transition-colors flex items-center justify-center gap-2">
                <Sparkles size={18} className="text-[#D4AF37]" /> Ver Toda la Tienda
              </Link>
              <Link href="/blog" onClick={toggleMobileMenu} className="hover:text-[#D4AF37] transition-colors flex items-center justify-center gap-2">
                <Feather size={18} className="text-[#D4AF37]" /> Journal de Bienestar
              </Link>
              <Link href="/movimiento" onClick={toggleMobileMenu} className="hover:text-[#D4AF37] transition-colors flex items-center justify-center gap-2">
                <Flame size={18} className="text-[#D4AF37]" /> Movimiento Gran Colinos
              </Link>
              
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
      </div>
    </>
  );
}
