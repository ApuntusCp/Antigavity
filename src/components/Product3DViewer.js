'use client';

import React, { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * Product3DViewer
 * Visor interactivo 3D con física de resortes (spring physics), inclinación
 * espacial reactiva al cursor, reflejo de luz dinámico (glare),
 * sombra de contacto 3D y suave levitación continua en reposo.
 */
export default function Product3DViewer({
  src,
  alt = 'Producto GranColinos',
  accentColor = '#D4AF37',
  className = '',
  priority = false,
}) {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [fallbackToPng, setFallbackToPng] = useState(false);

  if (currentSrc !== src) {
    setCurrentSrc(src);
    setFallbackToPng(false);
  }

  const activeImgSrc = fallbackToPng && currentSrc && currentSrc.endsWith('.webp')
    ? currentSrc.replace('.webp', '.png')
    : currentSrc;

  // Coordenadas normalizadas [-0.5, 0.5] relativas al centro
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Resortes físicos para suavidad ultra fluida (60/120 fps)
  const springConfig = { stiffness: 240, damping: 22, mass: 0.8 };
  const smoothX = useSpring(rawX, springConfig);
  const smoothY = useSpring(rawY, springConfig);

  // Rotaciones 3D
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [18, -18]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-22, 22]);
  const rotateZ = useTransform(smoothX, [-0.5, 0.5], [-2.5, 2.5]);

  // Posición del reflejo dinámico de luz (Specular Glare)
  const glareX = useTransform(smoothX, [-0.5, 0.5], [10, 90]);
  const glareY = useTransform(smoothY, [-0.5, 0.5], [10, 90]);

  // Desplazamiento opuesto de la sombra de contacto 3D
  const shadowX = useTransform(smoothX, [-0.5, 0.5], [16, -16]);
  const shadowY = useTransform(smoothY, [-0.5, 0.5], [6, -6]);
  const shadowScale = useTransform(smoothY, [-0.5, 0.5], [0.92, 1.08]);

  // Gradiente dinámico de reflejo
  const glareBackground = useTransform(
    [glareX, glareY],
    ([gx, gy]) =>
      `radial-gradient(circle 280px at ${gx}% ${gy}%, rgba(255,255,255,0.85) 0%, rgba(212,175,55,0.3) 30%, transparent 70%)`
  );

  // Control de eventos de ratón
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rawX.set(Math.max(-0.5, Math.min(0.5, x)));
    rawY.set(Math.max(-0.5, Math.min(0.5, y)));
  }, [rawX, rawY]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  const handleTouchMove = useCallback((e) => {
    if (!containerRef.current || e.touches.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = (touch.clientX - rect.left) / rect.width - 0.5;
    const y = (touch.clientY - rect.top) / rect.height - 0.5;
    rawX.set(Math.max(-0.5, Math.min(0.5, x)));
    rawY.set(Math.max(-0.5, Math.min(0.5, y)));
  }, [rawX, rawY]);

  const handleTouchEnd = useCallback(() => {
    setIsHovered(false);
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchStart={handleMouseEnter}
      onTouchEnd={handleTouchEnd}
      className={`relative w-full h-full flex flex-col items-center justify-center select-none cursor-grab active:cursor-grabbing ${className}`}
      style={{ perspective: 1200 }}
    >
      {/* Contenedor Flotante en Levitación Continua (Idle Float) */}
      <motion.div
        animate={
          isHovered
            ? { y: 0, scale: 1.05 }
            : {
                y: [-8, 8, -8],
                rotateZ: [-0.8, 0.8, -0.8],
                transition: {
                  duration: 5.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }
        }
        style={{
          transformStyle: 'preserve-3d',
          rotateX,
          rotateY,
          rotateZ,
        }}
        className="relative w-full h-full max-w-md max-h-[460px] flex items-center justify-center"
      >
        {/* Resplandor ambiental trasero vinculado al color acento */}
        <div
          className="absolute inset-0 rounded-full blur-[90px] opacity-40 transition-opacity duration-500 pointer-events-none"
          style={{
            backgroundColor: `${accentColor}33`,
            transform: 'translateZ(-40px)',
          }}
        />

        {/* Imagen del Producto con Elevación 3D */}
        <motion.div
          style={{
            transform: 'translateZ(60px)',
            transformStyle: 'preserve-3d',
          }}
          className="relative w-full h-full flex items-center justify-center p-4"
        >
          <img
            src={activeImgSrc}
            alt={alt}
            onError={() => setFallbackToPng(true)}
            className="max-w-full max-h-full object-contain filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.85)] pointer-events-none"
            loading={priority ? 'eager' : 'lazy'}
            draggable={false}
          />

          {/* Reflejo Dinámico Especular (Specular Glare) que sigue la luz del cursor */}
          <motion.div
            style={{
              opacity: isHovered ? 0.35 : 0,
              background: glareBackground,
              mixBlendMode: 'overlay',
              transform: 'translateZ(65px)',
            }}
            className="absolute inset-0 pointer-events-none rounded-3xl transition-opacity duration-300"
          />
        </motion.div>
      </motion.div>

      {/* Sombra de Contacto Espacial 3D debajo del Frasco */}
      <motion.div
        style={{
          x: shadowX,
          y: shadowY,
          scale: shadowScale,
          opacity: isHovered ? 0.75 : 0.45,
        }}
        className="w-48 md:w-64 h-6 bg-black/90 blur-xl rounded-[100%] pointer-events-none mt-[-15px] transition-opacity duration-500"
      />
    </div>
  );
}
