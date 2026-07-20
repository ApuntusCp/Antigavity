"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FastAverageColor } from 'fast-average-color';
import Link from 'next/link';

// --- CONFIGURACIÓN DE ANIMACIÓN ---
const EASE = [0.65, 0, 0.35, 1];
const TRANSITION       = { duration: 0.7, ease: EASE };
const PRODUCT_TRANSITION = { duration: 0.7, ease: EASE, delay: 0.05 };

// --- DATOS POR DEFECTO (se sobreescriben con cmsConfig del Editor Visual) ---
const DEFAULT_VARIANTS = [
  {
    id: 'gomas',
    name: 'Gomas Orgánicas GC',
    tagline: 'Energía y vitalidad diaria con Jengibre y Cúrcuma',
    price: '$28.500',
    colorBg: '#361517',
    colorAccent: '#D4AF37',
    image: '/Muestras/preview (1).webp',
    decorations: [
      { id: 'd1', src: '/Muestras/preview (2).webp', pos: 'top-10 left-[10%]' },
      { id: 'd2', src: '/Muestras/preview (3).webp', pos: 'bottom-20 right-[15%]' },
    ],
  },
  {
    id: 'apitoxina',
    name: 'Apitoxina Relajante',
    tagline: 'Alivio muscular profundo y 100% natural',
    price: '$36.700',
    colorBg: '#2b2311',
    colorAccent: '#D4AF37',
    image: '/Muestras/preview (4).webp',
    decorations: [
      { id: 'd3', src: '/Muestras/preview (5).webp', pos: 'top-20 right-[10%]' },
      { id: 'd4', src: '/Muestras/preview (6).webp', pos: 'bottom-10 left-[15%]' },
    ],
  },
  {
    id: 'nanocbd',
    name: 'Gotas Nano CBD',
    tagline: 'Biodisponibilidad del 100% con Nanotecnología',
    price: '$197.500',
    colorBg: '#1A2E0A',
    colorAccent: '#7BA05B',
    image: '/Muestras/preview.webp',
    decorations: [
      { id: 'd5', src: '/Muestras/preview (7).webp', pos: 'top-16 left-[20%]' },
      { id: 'd6', src: '/Muestras/preview (8).webp', pos: 'bottom-16 right-[20%]' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HeroSection — acepta cmsConfig del Editor Visual de GC Admin y el inventario real.
// ─────────────────────────────────────────────────────────────────────────────
export default function HeroSection({ cmsConfig = null, products = [] }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [dynamicColors, setDynamicColors] = useState({});

  // ── Extraer overrides del Editor Visual ──
  let heroOverride = null;
  let bannerOverride = null;

  if (cmsConfig?.blocks && Array.isArray(cmsConfig.blocks)) {
    const heroBlock   = cmsConfig.blocks.find(b => b.type === 'hero');
    const bannerBlock = cmsConfig.blocks.find(b => b.type === 'banner');

    if (heroBlock?.content) {
      heroOverride = {
        bgImage: heroBlock.content.bgUrl   || null,
        title:   heroBlock.content.title   || null,
      };
    }
    if (bannerBlock?.content) {
      bannerOverride = {
        text:      bannerBlock.content.text      || null,
        bgColor:   bannerBlock.content.bgColor   || null,
        textColor: bannerBlock.content.textColor || null,
      };
    }
  }

  const VARIANTS = useMemo(() => {
    if (products && products.length > 0) {
      return products.slice(0, 3).map(p => ({
        id: p.id,
        name: p.title || p.name,
        tagline: p.category || 'Colección Premium',
        sku: p.sku || p.id,
        price: p.discountPrice 
                 ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(p.discountPrice)
                 : new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(p.price || 0),
        oldPrice: p.discountPrice ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(p.price || 0) : null,
        image: p.images?.[0] || '/Muestras/preview.webp',
        decorations: [], // Can generate dynamic decorations if needed
        colorBg: '#0a0a0a',
        colorAccent: '#D4AF37'
      }));
    }
    return DEFAULT_VARIANTS;
  }, [products]);

  useEffect(() => {
    const fac = new FastAverageColor();
    VARIANTS.forEach(v => {
      fac.getColorAsync(v.image, { crossOrigin: 'anonymous' })
        .then(color => {
          setDynamicColors(prev => ({
            ...prev,
            [v.id]: {
              accent: color.hex,
              // Create a very dark version of the color for the background
              bg: `rgba(${Math.floor(color.value[0]*0.15)}, ${Math.floor(color.value[1]*0.15)}, ${Math.floor(color.value[2]*0.15)}, 1)`
            }
          }));
        })
        .catch(e => console.error("Error extracting color", e));
    });
    return () => fac.destroy();
  }, [VARIANTS]);

  const activeVariant = VARIANTS[activeIdx] || VARIANTS[0];
  const activeDynamicColor = dynamicColors[activeVariant?.id];
  const currentBgColor = activeDynamicColor?.bg || activeVariant?.colorBg;
  const currentAccentColor = activeDynamicColor?.accent || activeVariant?.colorAccent;

  const handleNext = () => setActiveIdx(prev => (prev + 1) % VARIANTS.length);
  const handlePrev = () => setActiveIdx(prev => (prev - 1 + VARIANTS.length) % VARIANTS.length);

  return (
    <>
      {/* ── BANNER PROMO (si existe en el Editor) ── */}
      {bannerOverride?.text && (
        <div
          className="w-full py-3 text-center text-xs font-bold tracking-[0.25em] uppercase"
          style={{
            backgroundColor: bannerOverride.bgColor  || '#D4AF37',
            color:            bannerOverride.textColor || '#050505',
          }}
        >
          {bannerOverride.text}
        </div>
      )}

      {/* ── HERO PRINCIPAL ── */}
      <section className="relative w-full h-[90vh] overflow-hidden flex items-center justify-center">

        {/* 1. Fondo con imagen del Editor si existe, o color sólido por variante */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeVariant.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="absolute inset-0 z-0"
            style={{
              backgroundColor: currentBgColor,
              ...(heroOverride?.bgImage
                ? {
                    backgroundImage: `url('${heroOverride.bgImage}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }
                : {}),
            }}
          />
        </AnimatePresence>

        {/* Overlay de gradiente */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/60 via-transparent to-black/70 pointer-events-none" />

        {/* 2. Tipografía gigante de fondo */}
        <div className="absolute inset-0 z-[2] flex items-center justify-center overflow-hidden pointer-events-none select-none opacity-[0.03]">
          <AnimatePresence mode="wait">
            <motion.span
              key={activeVariant.id}
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={TRANSITION}
              className="text-[15rem] md:text-[20rem] font-black uppercase whitespace-nowrap text-white font-serif tracking-tighter"
            >
              {activeVariant.name.split(' ')[0]}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* 3. Contenido principal */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">

          {/* Sello INVIMA temporalmente oculto hasta tener módulo legal
          <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center w-full">
            <p className="text-[10px] md:text-xs tracking-[0.35em] text-white/60 uppercase font-medium">
              CALIDAD INVIMA CERTIFICADA · RS-2024-12345
            </p>
          </div>
          */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full pt-16">

            {/* Lado Izquierdo */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, ...TRANSITION }}>
                <h1 className="text-5xl md:text-7xl font-serif font-bold text-white leading-tight mb-2">
                  <span style={{ color: currentAccentColor }} className="transition-colors duration-700">Gran</span>Colinos
                </h1>
                <div className="min-h-[4rem] overflow-visible">
                  <AnimatePresence mode="wait">
                    <motion.h2
                      key={activeVariant.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={TRANSITION}
                      className="text-3xl md:text-5xl font-light italic text-white/90"
                    >
                      {/* Título sobreescrito por el Editor si existe */}
                      {heroOverride?.title || activeVariant.name}
                    </motion.h2>
                  </AnimatePresence>
                </div>
              </motion.div>

              <div className="h-14 flex items-center mt-2">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={activeVariant.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={TRANSITION}
                    className="text-lg text-white/70 max-w-md"
                  >
                    {activeVariant.tagline}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Selector de variante */}
              <div className="flex flex-col gap-3 mt-8 items-center lg:items-start">
                <p className="text-[10px] uppercase tracking-widest text-white/40 font-medium">Elige tu presentación</p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                  {VARIANTS.map((v, i) => (
                    <button
                      key={v.id}
                      onClick={() => setActiveIdx(i)}
                      className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-500 border ${
                        activeIdx === i
                          ? 'bg-white text-black border-white shadow-lg'
                          : 'bg-transparent text-white/70 border-white/20 hover:border-white/50'
                      }`}
                    >
                      {v.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Navegación + Precio */}
              <div className="flex items-center gap-6 mt-10 justify-center lg:justify-start">
                <div className="flex gap-2">
                  <button onClick={handlePrev} className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button onClick={handleNext} className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeVariant.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={TRANSITION}
                    className="flex flex-col lg:flex-row items-center gap-4"
                  >
                    <div className="flex items-center gap-3">
                      {activeVariant.oldPrice && (
                        <span className="text-lg text-white/40 line-through tracking-tight font-light">
                          {activeVariant.oldPrice}
                        </span>
                      )}
                      <span 
                        className="text-4xl font-bold tracking-tight transition-colors duration-700"
                        style={{ color: currentAccentColor }}
                      >
                        {activeVariant.price}
                      </span>
                    </div>
                    <Link 
                      href={`/product/${activeVariant.sku || activeVariant.id}`}
                      className="px-8 py-2.5 rounded-full text-sm font-bold bg-white text-black hover:scale-105 transition-transform uppercase tracking-widest shadow-xl whitespace-nowrap flex-shrink-0"
                    >
                      Comprar Ahora
                    </Link>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Lado Derecho: Render del Producto */}
            <div className="relative w-full h-[50vh] lg:h-[80vh] flex items-center justify-center pointer-events-none mt-10 lg:mt-0">

              {/* Decorativos flotantes */}
              <AnimatePresence mode="wait">
                {activeVariant.decorations.map((dec, i) => (
                  <motion.div
                    key={`${activeVariant.id}-${dec.id}`}
                    initial={{ opacity: 0, y: i % 2 === 0 ? 20 : -20 }}
                    animate={{ opacity: 0.8, y: 0 }}
                    exit={{ opacity: 0, y: i % 2 === 0 ? -20 : 20 }}
                    transition={{ ...TRANSITION, delay: 0.1 + i * 0.05 }}
                    className={`absolute ${dec.pos} w-20 h-20 md:w-32 md:h-32 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl overflow-hidden`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={dec.src} alt="" className="w-[150%] h-[150%] object-cover opacity-70" />
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Producto principal */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeVariant.id}
                  initial={{ opacity: 0, scale: 0.85, rotate: -15, x: 120, y: -50, filter: 'blur(12px)' }}
                  animate={{ opacity: 1, scale: 1,    rotate: 0,   x: 0,   y: 0,   filter: 'blur(0px)' }}
                  exit={{   opacity: 0, scale: 1.15,  rotate: 15,  x: -120, y: 50,  filter: 'blur(12px)' }}
                  transition={PRODUCT_TRANSITION}
                  className="relative z-30 w-72 h-72 md:w-96 md:h-96"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeVariant.image}
                    alt={activeVariant.name}
                    className="w-full h-full object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.7)]"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
