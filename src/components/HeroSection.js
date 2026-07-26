"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FastAverageColor } from 'fast-average-color';
import Link from 'next/link';

// --- CONFIGURACIÓN DE ANIMACIÓN ---
const EASE = [0.65, 0, 0.35, 1];
const TRANSITION       = { duration: 0.7, ease: EASE };
const PRODUCT_TRANSITION = { duration: 0.7, ease: EASE, delay: 0.05 };

// --- DATOS POR DEFECTO ---
const DEFAULT_VARIANTS = [
  {
    id: 'gomas',
    name: 'Gomas Orgánicas GC',
    tagline: 'Energía y vitalidad diaria con Jengibre y Cúrcuma',
    price: '$28.500',
    colorBg: 'transparent',
    colorAccent: '#D4AF37',
    image: '/Muestras/preview (1).webp',
    decorations: [],
  },
  {
    id: 'apitoxina',
    name: 'Apitoxina Relajante',
    tagline: 'Alivio muscular profundo y 100% natural',
    price: '$36.700',
    colorBg: 'transparent',
    colorAccent: '#D4AF37',
    image: '/Muestras/preview (4).webp',
    decorations: [],
  },
  {
    id: 'nanocbd',
    name: 'Gotas Nano CBD',
    tagline: 'Biodisponibilidad del 100% con Nanotecnología',
    price: '$197.500',
    colorBg: 'transparent',
    colorAccent: '#7BA05B',
    image: '/Muestras/preview.webp',
    decorations: [],
  },
];

export default function HeroSection({ cmsConfig = null, products = [] }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [dynamicColors, setDynamicColors] = useState({});

  let heroOverride = null;

  if (cmsConfig?.blocks && Array.isArray(cmsConfig.blocks)) {
    const heroBlock = cmsConfig.blocks.find(b => b.type === 'hero');
    if (heroBlock?.content) {
      heroOverride = {
        bgImage: heroBlock.content.bgUrl || null,
        title: heroBlock.content.title || null,
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
        decorations: [],
        colorBg: 'transparent',
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
              bg: 'transparent'
            }
          }));
        })
        .catch(e => console.error("Error extracting color", e));
    });
  }, [VARIANTS]);

  const activeVariant = VARIANTS[activeIdx] || VARIANTS[0];
  const currentAccentColor = dynamicColors[activeVariant.id]?.accent || activeVariant.colorAccent;

  return (
    <section className="relative w-full h-screen min-h-[650px] overflow-hidden text-white pt-16">
      
      {/* Dynamic Ambient Glow overlay with 22% opacity to let leather texture show 100% */}
      <div 
        className="absolute inset-0 z-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 backdrop-blur-[2px] transition-all duration-1000"
      />

      {/* Hero Background Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 blur-[140px] pointer-events-none rounded-full transition-colors duration-1000"
        style={{ backgroundColor: `${currentAccentColor}22` }}
      />

      {/* Tipografía gigante de fondo */}
      <div className="absolute inset-0 z-[2] flex items-center justify-center overflow-hidden pointer-events-none select-none opacity-[0.04]">
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

      {/* Contenido principal */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full pt-12">

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
              <p className="text-[10px] uppercase tracking-widest text-white/50 font-medium">Elige tu presentación</p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                {VARIANTS.map((v, i) => (
                  <button
                    key={v.id}
                    onClick={() => setActiveIdx(i)}
                    className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                      activeIdx === i
                        ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.4)] scale-105'
                        : 'bg-black/40 text-white/70 hover:bg-black/60 border border-white/10'
                    }`}
                  >
                    {v.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Precios y Botón CTA */}
            <div className="flex items-center gap-6 mt-10">
              <div className="flex flex-col">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeVariant.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={TRANSITION}
                    className="flex items-baseline gap-3"
                  >
                    {activeVariant.oldPrice && (
                      <span className="text-gray-400 font-mono text-sm line-through">
                        {activeVariant.oldPrice}
                      </span>
                    )}
                    <span className="text-3xl font-mono font-bold text-gold-gradient">
                      {activeVariant.price}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>

              <Link
                href={`/product/${activeVariant.sku || activeVariant.id}`}
                className="px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest bg-white text-black hover:bg-[#D4AF37] hover:text-black transition-all duration-300 shadow-[0_0_25px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)]"
              >
                Comprar Ahora
              </Link>
            </div>
          </div>

          {/* Lado Derecho: Imagen del Producto */}
          <div className="relative flex items-center justify-center h-[350px] md:h-[450px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeVariant.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={PRODUCT_TRANSITION}
                className="relative w-full h-full max-w-lg"
              >
                <img
                  src={activeVariant.image}
                  alt={activeVariant.name}
                  className="w-full h-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
                />
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
