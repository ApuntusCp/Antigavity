"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- CONFIGURACIÓN DE ANIMACIÓN (EASE Y TIMING) ---
const TRANSITION = {
  duration: 0.7,
  ease: [0.65, 0, 0.35, 1],
};

const PRODUCT_TRANSITION = {
  duration: 0.7,
  ease: [0.65, 0, 0.35, 1],
  delay: 0.05, // 50ms de desfase
};

// --- DATOS DE VARIANTES (Gomas Orgánicas y Apitoxina como principales) ---
const VARIANTS = [
  {
    id: 'gomas',
    name: 'Gomas Orgánicas GC',
    tagline: 'Energía y vitalidad diaria con Jengibre y Cúrcuma',
    price: '$28.500',
    colorBg: '#361517', // Rojo rubí oscuro
    colorAccent: '#D4AF37', // Dorado GranColinos
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
    colorBg: '#2b2311', // Tono oscuro dorado/ámbar
    colorAccent: '#D4AF37', // Dorado GranColinos
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
    colorBg: '#1A2E0A', // Verde oscuro GranColinos
    colorAccent: '#7BA05B', // Verde salvia
    image: '/Muestras/preview.webp',
    decorations: [
      { id: 'd5', src: '/Muestras/preview (7).webp', pos: 'top-16 left-[20%]' },
      { id: 'd6', src: '/Muestras/preview (8).webp', pos: 'bottom-16 right-[20%]' },
    ],
  }
];

export default function HeroSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeVariant = VARIANTS[activeIdx];

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % VARIANTS.length);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + VARIANTS.length) % VARIANTS.length);
  };

  return (
    <section className="relative w-full h-[90vh] overflow-hidden flex items-center justify-center">
      
      {/* 1. FONDO (Transición de Color - Wipe / Crossfade) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeVariant.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: TRANSITION.ease }}
          className="absolute inset-0 z-0"
          style={{ backgroundColor: activeVariant.colorBg }}
        />
      </AnimatePresence>
      
      {/* 2. TIPOGRAFÍA GIGANTE DE FONDO (Semi-visible) */}
      <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden pointer-events-none select-none opacity-[0.03]">
        <AnimatePresence mode="wait">
          <motion.h1
            key={activeVariant.id}
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={TRANSITION}
            className="text-[15rem] md:text-[20rem] font-black uppercase whitespace-nowrap text-white font-serif tracking-tighter"
          >
            {activeVariant.name.split(' ')[0]}
          </motion.h1>
        </AnimatePresence>
      </div>

      {/* 3. CAPA DE CONTENIDO PRINCIPAL (Producto + UI) */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
        
        {/* Sello INVIMA Estático */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 text-center w-full">
          <p className="text-xs md:text-sm tracking-[0.3em] text-white/60 uppercase font-medium">
            CALIDAD INVIMA CERTIFICADA · RS-2024-12345
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full pt-16">
          
          {/* Lado Izquierdo: Textos */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left z-30">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, ...TRANSITION }}
            >
              <h2 className="text-5xl md:text-7xl font-serif font-bold text-white leading-tight mb-4">
                <span style={{ color: activeVariant.colorAccent }} className="transition-colors duration-700">Gran</span>Colinos<br/>
                <span className="text-3xl md:text-5xl font-light italic mt-2 block opacity-90 h-16">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={activeVariant.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={TRANSITION}
                      className="block"
                    >
                      {activeVariant.name}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </h2>
            </motion.div>
            
            <div className="h-16 flex items-center">
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

            {/* Selector de Variante */}
            <div className="flex flex-col gap-4 mt-8 w-full items-center lg:items-start">
              <p className="text-xs uppercase tracking-widest text-white/50 font-medium">Elige tu presentación</p>
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
            
            {/* Navegación y Precio */}
            <div className="flex items-center gap-6 mt-12 w-full justify-center lg:justify-start">
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
                  className="text-4xl font-bold text-[#D4AF37] tracking-tight"
                >
                  {activeVariant.price}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Lado Derecho: Render del Producto y Decorativos */}
          <div className="relative w-full h-[50vh] lg:h-[80vh] flex items-center justify-center pointer-events-none mt-10 lg:mt-0">
            
            {/* Elementos Decorativos Flotantes */}
            <AnimatePresence mode="wait">
              {activeVariant.decorations.map((dec, i) => (
                <motion.div
                  key={`${activeVariant.id}-dec-${dec.id}`}
                  initial={{ opacity: 0, y: i % 2 === 0 ? 20 : -20 }}
                  animate={{ opacity: 0.8, y: 0 }}
                  exit={{ opacity: 0, y: i % 2 === 0 ? -20 : 20 }}
                  transition={{ ...TRANSITION, delay: 0.1 + (i * 0.05) }}
                  className={`absolute ${dec.pos} w-20 h-20 md:w-32 md:h-32 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl flex items-center justify-center overflow-hidden`}
                >
                  <img src={dec.src} alt="" className="w-[150%] h-[150%] object-cover opacity-70" onError={(e) => (e.currentTarget.style.display = 'none')} />
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Render del Producto Principal con Animación Sincronizada (Arco y Blur) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeVariant.id}
                initial={{ 
                  opacity: 0, 
                  scale: 0.85, 
                  rotate: -15, 
                  x: 120,
                  y: -50,
                  filter: 'blur(12px)'
                }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  rotate: 0, 
                  x: 0,
                  y: 0,
                  filter: 'blur(0px)'
                }}
                exit={{ 
                  opacity: 0, 
                  scale: 1.15, 
                  rotate: 15, 
                  x: -120,
                  y: 50,
                  filter: 'blur(12px)'
                }}
                transition={PRODUCT_TRANSITION}
                className="relative z-30 w-72 h-72 md:w-96 md:h-96"
              >
                {/* Botella / Empaque */}
                <img 
                  src={activeVariant.image} 
                  alt={activeVariant.name} 
                  className="w-full h-full object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.7)]"
                  onError={(e) => {
                    // Fallback visual si no carga la imagen
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement?.classList.add('bg-white/10', 'rounded-[3rem]', 'border', 'border-white/20', 'backdrop-blur-sm');
                  }}
                />
              </motion.div>
            </AnimatePresence>

          </div>
        </div>
      </div>
    </section>
  );
}
