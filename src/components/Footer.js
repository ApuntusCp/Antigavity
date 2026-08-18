'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, ShieldCheck, Lock, Sparkles, ArrowUpRight } from 'lucide-react';

export default function Footer({ footerConfig = {} }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#030704]/90 backdrop-blur-2xl border-t border-[#D4AF37]/30 text-white pt-20 pb-36 relative z-10 overflow-hidden">
      {/* Resplandor decorativo dorado de fondo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-32 bg-[#D4AF37]/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* FILA SUPERIOR: Logo, Misión & Contacto Rápido */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-[#D4AF37]/15">
          
          {/* Columna Marca & Identidad (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <Link href="/" prefetch={false} className="inline-block group">
              <Image 
                src="/Logos/GranColinos.Com.png" 
                alt="GranColinos" 
                width={190} 
                height={50} 
                className="h-10 w-auto object-contain filter drop-shadow-[0_0_15px_rgba(212,175,55,0.45)] group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
            
            <p className="text-gray-300 text-sm leading-relaxed font-light max-w-md">
              {footerConfig.description || "Fórmulas botánicas de alta gama, extractos puros y bienestar consciente desarrollados en Colombia bajo los más rigurosos estándares de pureza y calidad certificada."}
            </p>

            {/* Badges de Confianza Rápidos */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs text-gray-300 bg-black/40 border border-[#D4AF37]/25 px-3 py-1.5 rounded-full backdrop-blur-md">
                <ShieldCheck size={14} className="text-[#D4AF37]" />
                <span>Calidad INVIMA Certificada</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-300 bg-black/40 border border-[#D4AF37]/25 px-3 py-1.5 rounded-full backdrop-blur-md">
                <Lock size={14} className="text-[#D4AF37]" />
                <span>Pagos Seguros SSL</span>
              </div>
            </div>
          </div>

          {/* Columnas de Navegación del Ecosistema (7 Cols divididas en 3) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
            
            {/* Columna 1: Ecosistema & Tienda */}
            <div>
              <h4 className="text-xs font-bold tracking-[0.2em] uppercase mb-5 text-[#D4AF37] flex items-center gap-1.5">
                <Sparkles size={12} />
                <span>Ecosistema</span>
              </h4>
              <ul className="space-y-2.5 text-xs text-gray-300 font-light">
                <li>
                  <Link href="/shop" prefetch={false} className="hover:text-[#D4AF37] transition-colors duration-200 flex items-center gap-1 group">
                    <span>Tienda Oficial</span>
                    <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#D4AF37]" />
                  </Link>
                </li>
                <li>
                  <Link href="/#catalogo" prefetch={false} className="hover:text-[#D4AF37] transition-colors duration-200">
                    Catálogo Botánico
                  </Link>
                </li>
                <li>
                  <Link href="/noticias" prefetch={false} className="hover:text-[#D4AF37] transition-colors duration-200">
                    Noticias & Análisis
                  </Link>
                </li>
                <li>
                  <Link href="/periodismo-alternativo" prefetch={false} className="hover:text-[#D4AF37] transition-colors duration-200">
                    Periodismo Alternativo
                  </Link>
                </li>
                <li>
                  <Link href="/libros" prefetch={false} className="hover:text-[#D4AF37] transition-colors duration-200">
                    Biblioteca Digital
                  </Link>
                </li>
                <li>
                  <Link href="/base-de-datos-global" prefetch={false} className="hover:text-[#D4AF37] transition-colors duration-200">
                    Base de Datos Global
                  </Link>
                </li>
              </ul>
            </div>

            {/* Columna 2: Comunidad & Club */}
            <div>
              <h4 className="text-xs font-bold tracking-[0.2em] uppercase mb-5 text-[#D4AF37]">
                Comunidad
              </h4>
              <ul className="space-y-2.5 text-xs text-gray-300 font-light">
                <li>
                  <Link href="/comunidad" prefetch={false} className="hover:text-[#D4AF37] transition-colors duration-200 flex items-center gap-1 group">
                    <span>Mi Club GranColinos</span>
                    <span className="text-[9px] bg-[#D4AF37]/20 text-[#D4AF37] px-1.5 py-0.2 rounded font-mono font-bold">VIP</span>
                  </Link>
                </li>
                <li>
                  <Link href="/blog" prefetch={false} className="hover:text-[#D4AF37] transition-colors duration-200">
                    Journal de Bienestar
                  </Link>
                </li>
                <li>
                  <Link href="/movimiento" prefetch={false} className="hover:text-[#D4AF37] transition-colors duration-200">
                    Movimiento Social
                  </Link>
                </li>
                <li>
                  <Link href="/artistas" prefetch={false} className="hover:text-[#D4AF37] transition-colors duration-200">
                    Galería de Artistas
                  </Link>
                </li>
                <li>
                  <Link href="/gca" prefetch={false} className="hover:text-[#D4AF37] transition-colors duration-200">
                    Arquitectura GCA
                  </Link>
                </li>
                <li>
                  <Link href="/servicios" prefetch={false} className="hover:text-[#D4AF37] transition-colors duration-200">
                    Red de Servicios
                  </Link>
                </li>
              </ul>
            </div>

            {/* Columna 3: Legal & Soporte */}
            <div>
              <h4 className="text-xs font-bold tracking-[0.2em] uppercase mb-5 text-[#D4AF37]">
                Legal & Soporte
              </h4>
              <ul className="space-y-2.5 text-xs text-gray-300 font-light">
                <li>
                  <Link href="/informacion" prefetch={false} className="hover:text-[#D4AF37] transition-colors duration-200 flex items-center gap-1">
                    <span>Atención & PQR</span>
                  </Link>
                </li>
                <li>
                  <Link href="/terminos-de-servicio" prefetch={false} className="hover:text-[#D4AF37] transition-colors duration-200">
                    Términos de Servicio
                  </Link>
                </li>
                <li>
                  <Link href="/habeas-data" prefetch={false} className="hover:text-[#D4AF37] transition-colors duration-200">
                    Habeas Data (Privacidad)
                  </Link>
                </li>
                <li>
                  <Link href="/contacto" prefetch={false} className="hover:text-[#D4AF37] transition-colors duration-200">
                    Contacto Directo
                  </Link>
                </li>
              </ul>

              {/* Canal de Atención */}
              <div className="mt-6 pt-4 border-t border-white/10 space-y-2 text-[11px] text-gray-400">
                <div className="flex items-center gap-2">
                  <Mail size={12} className="text-[#D4AF37] shrink-0" />
                  <span className="truncate">soporte@grancolinos.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={12} className="text-[#D4AF37] shrink-0" />
                  <span>Bogotá D.C. • Colombia</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* FILA INTERMEDIA: Pasarelas de Pago Oficiales en Colombia */}
        <div className="py-8 border-b border-[#D4AF37]/15 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <span className="text-[11px] font-bold tracking-wider uppercase text-gray-400 block mb-1">
              Métodos de Pago Seguros
            </span>
            <p className="text-[11px] text-gray-400 font-light">
              Transacciones cifradas procesadas a través de pasarelas bancarias certificadas.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* PSE */}
            <div className="bg-black/60 border border-white/10 px-3 py-1.5 rounded-lg flex items-center justify-center hover:border-[#D4AF37]/50 transition-colors" title="PSE Pagos Seguros en Línea">
              <Image src="/images/payments/pse.svg" alt="PSE" width={36} height={18} className="h-5 w-auto object-contain" />
            </div>
            {/* Nequi */}
            <div className="bg-black/60 border border-white/10 px-3 py-1.5 rounded-lg flex items-center justify-center hover:border-[#D4AF37]/50 transition-colors" title="Nequi">
              <Image src="/images/payments/nequi.svg" alt="Nequi" width={55} height={18} className="h-5 w-auto object-contain" />
            </div>
            {/* Daviplata */}
            <div className="bg-black/60 border border-white/10 px-3 py-1.5 rounded-lg flex items-center justify-center hover:border-[#D4AF37]/50 transition-colors" title="DaviPlata">
              <Image src="/images/payments/daviplata.svg" alt="DaviPlata" width={55} height={18} className="h-5 w-auto object-contain" />
            </div>
            {/* Visa */}
            <div className="bg-black/60 border border-white/10 px-3 py-1.5 rounded-lg flex items-center justify-center hover:border-[#D4AF37]/50 transition-colors" title="Visa">
              <Image src="/images/payments/visa.svg" alt="Visa" width={38} height={18} className="h-5 w-auto object-contain" />
            </div>
            {/* Mastercard */}
            <div className="bg-black/60 border border-white/10 px-3 py-1.5 rounded-lg flex items-center justify-center hover:border-[#D4AF37]/50 transition-colors" title="Mastercard">
              <Image src="/images/payments/mastercard.svg" alt="Mastercard" width={30} height={18} className="h-5 w-auto object-contain" />
            </div>
            {/* Bold */}
            <div className="bg-black/60 border border-white/10 px-3 py-1.5 rounded-lg flex items-center justify-center hover:border-[#D4AF37]/50 transition-colors" title="Bold">
              <Image src="/images/payments/bold.svg" alt="Bold" width={42} height={18} className="h-5 w-auto object-contain" />
            </div>
          </div>
        </div>

        {/* FILA INFERIOR: Copyright & Calidad */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-gray-400 text-center md:text-left">
          <p suppressHydrationWarning>
            &copy; {currentYear} {footerConfig.copyright || "GRAN COLINOS SAS. TODOS LOS DERECHOS RESERVADOS."}
          </p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
            <p className="tracking-widest text-[#D4AF37] font-semibold text-[10px] uppercase">
              Diseñado con Excelencia • Colombia
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}
