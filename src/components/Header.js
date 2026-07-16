'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthProvider";
import { User } from "lucide-react";

export default function Header() {
  const { cartItemCount, setIsCartOpen } = useCart();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>
      <header className="w-full fixed top-0 z-40 bg-brand-light/90 dark:bg-brand-dark/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 relative z-50">
            <Image 
              src="/Logos/GranColinos.Com.png" 
              alt="GranColinos Logo" 
              width={180} 
              height={50} 
              className="object-contain"
              priority
            />
          </Link>
          
          <nav className="hidden md:flex gap-10 text-xs font-semibold tracking-[0.2em] uppercase">
            <Link href="/#catalogo" className="hover:text-brand-gold transition-colors duration-300">Catálogo</Link>
            <Link href="/#origen" className="hover:text-brand-gold transition-colors duration-300">Origen</Link>
            <Link href="/blog" className="hover:text-brand-gold transition-colors duration-300">Journal</Link>
          </nav>

          <div className="flex gap-6 items-center text-xs font-semibold tracking-[0.2em] uppercase relative z-50">
            {user ? (
              <div className="hidden md:flex items-center gap-4">
                <Link href="/comunidad" className="hover:text-brand-gold transition-colors duration-300">
                  Mi Club
                </Link>
                <button onClick={() => logout()} className="hover:text-red-400 transition-colors duration-300 text-[10px]">
                  Salir
                </button>
              </div>
            ) : (
              <Link href="/login" className="hidden md:flex items-center gap-1 hover:text-brand-gold transition-colors duration-300">
                <User size={14} /> Ingresar
              </Link>
            )}
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className="hover:text-brand-gold transition-colors duration-300 flex items-center gap-1"
            >
              Cart <span className="bg-brand-gold text-brand-dark px-1.5 py-0.5 rounded-full text-[10px]">{cartItemCount}</span>
            </button>
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden hover:text-brand-gold transition-colors duration-300"
            >
              {isMobileMenuOpen ? 'Cerrar' : 'Menu'}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`fixed inset-0 bg-brand-dark z-30 flex flex-col items-center justify-center transition-transform duration-500 ease-in-out ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'} md:hidden`}>
          <nav className="flex flex-col gap-8 text-center text-xl font-playfair tracking-widest uppercase text-white">
            <Link href="/#catalogo" onClick={toggleMobileMenu} className="hover:text-brand-gold transition-colors">Catálogo Premium</Link>
            <Link href="/#origen" onClick={toggleMobileMenu} className="hover:text-brand-gold transition-colors">Nuestra Esencia</Link>
            <Link href="/blog" onClick={toggleMobileMenu} className="hover:text-brand-gold transition-colors">Journal de Bienestar</Link>
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
