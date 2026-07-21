'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthProvider";
import { User, LogOut, ShoppingCart, Menu, X, Layers, LayoutGrid, Feather, Flame } from "lucide-react";

export default function Header({ headerConfig = {} }) {
  const { cartItemCount, setIsCartOpen } = useCart();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>
      <header className="w-full fixed top-0 z-40 bg-brand-light/90 dark:bg-brand-dark/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 relative z-50">
            {headerConfig.logoText ? (
              <span className="font-playfair text-2xl font-bold text-brand-dark dark:text-brand-gold">{headerConfig.logoText}</span>
            ) : (
              <Image 
                src="/Logos/GranColinos.Com.png" 
                alt="GranColinos Logo" 
                width={180} 
                height={50} 
                className="object-contain"
                priority
              />
            )}
          </Link>
          
          <nav className="hidden md:flex gap-8 items-center">
            <Link href="/#catalogo" className="relative group flex items-center justify-center w-12 h-12 rounded-full border border-transparent hover:border-brand-gold/20 hover:bg-brand-gold/5 transition-all duration-700">
              <LayoutGrid size={20} strokeWidth={1.2} className="text-gray-500 dark:text-gray-400 group-hover:text-brand-gold group-hover:scale-110 transition-all duration-500" />
              <span className="absolute -bottom-6 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 text-[9px] tracking-widest uppercase font-bold text-brand-gold whitespace-nowrap">Catálogo</span>
            </Link>
            <Link href="/blog" className="relative group flex items-center justify-center w-12 h-12 rounded-full border border-transparent hover:border-brand-gold/20 hover:bg-brand-gold/5 transition-all duration-700">
              <Feather size={20} strokeWidth={1.2} className="text-gray-500 dark:text-gray-400 group-hover:text-brand-gold group-hover:scale-110 transition-all duration-500" />
              <span className="absolute -bottom-6 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 text-[9px] tracking-widest uppercase font-bold text-brand-gold whitespace-nowrap">Journal</span>
            </Link>
            <Link href="/movimiento" className="relative group flex items-center justify-center w-12 h-12 rounded-full border border-transparent hover:border-brand-gold/20 hover:bg-brand-gold/5 transition-all duration-700">
              <Flame size={20} strokeWidth={1.2} className="text-brand-green group-hover:text-brand-gold group-hover:scale-110 transition-all duration-500" />
              <span className="absolute -bottom-6 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 text-[9px] tracking-widest uppercase font-bold text-brand-gold whitespace-nowrap">Movimiento</span>
            </Link>
          </nav>

          <div className="flex gap-6 items-center text-xs font-semibold tracking-[0.2em] uppercase relative z-50">
            {user ? (
              <div className="hidden md:flex items-center gap-4">
                <Link href="/comunidad" className="hover:text-brand-gold transition-colors duration-300 flex items-center gap-2">
                  MI CLUB
                </Link>
                <button onClick={() => logout()} className="hover:text-red-400 transition-colors duration-300" title="Salir">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link href="/login" className="hidden md:flex items-center gap-1 hover:text-brand-gold transition-colors duration-300">
                <User size={14} /> Ingresar
              </Link>
            )}
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className="hover:text-brand-gold transition-colors duration-300 flex items-center gap-2"
              title="Carrito"
            >
              <ShoppingCart size={16} /> <span className="bg-brand-gold text-brand-dark px-1.5 py-0.5 rounded-full text-[10px]">{cartItemCount}</span>
            </button>
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden hover:text-brand-gold transition-colors duration-300"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`fixed inset-0 bg-brand-dark z-30 flex flex-col items-center justify-center transition-transform duration-500 ease-in-out ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'} md:hidden`}>
          <nav className="flex flex-col gap-8 text-center text-xl font-playfair tracking-widest uppercase text-white">
            <Link href="/#catalogo" onClick={toggleMobileMenu} className="hover:text-brand-gold transition-colors flex items-center justify-center gap-3"><LayoutGrid size={24}/> Catálogo Premium</Link>
            <Link href="/blog" onClick={toggleMobileMenu} className="hover:text-brand-gold transition-colors flex items-center justify-center gap-3"><Feather size={24}/> Journal de Bienestar</Link>
            <Link href="/movimiento" onClick={toggleMobileMenu} className="text-brand-green hover:text-brand-gold transition-colors flex items-center justify-center gap-3"><Flame size={24}/> Movimiento Gran Colinos</Link>
            <Link href="/shop" onClick={toggleMobileMenu} className="hover:text-brand-gold transition-colors">Ver Todo</Link>
            <Link href="/comunidad" onClick={toggleMobileMenu} className="hover:text-brand-gold transition-colors">Club Gran Colinos</Link>
            {!user && (
              <Link href="/login" onClick={toggleMobileMenu} className="text-sm hover:text-brand-gold transition-colors mt-4">Iniciar Sesión</Link>
            )}
            {user && (
              <button onClick={() => { logout(); toggleMobileMenu(); }} className="text-sm text-gray-500 hover:text-red-400 transition-colors mt-4">
                Cerrar Sesión
              </button>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}
