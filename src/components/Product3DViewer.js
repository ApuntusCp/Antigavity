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

  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, rawStartX: 0, rawStartY: 0 });

  if (currentSrc !== src) {
    setCurrentSrc(src);
    setFallbackToPng(false);
  }

  const activeImgSrc = fallbackToPng && currentSrc && currentSrc.endsWith('.webp')
    ? currentSrc.replace('.webp', '.png')
    : currentSrc;

  // Coordenadas normalizadas relativas al centro
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Resortes físicos para suavidad ultra fluida (60/120 fps)
  const springConfig = { stiffness: 220, damping: 20, mass: 0.75 };
  const smoothX = useSpring(rawX, springConfig);
  const smoothY = useSpring(rawY, springConfig);

  // Rotaciones 3D con volumen acentuado
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [22, -22]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-28, 28]);
  const rotateZ = useTransform(smoothX, [-0.5, 0.5], [-3, 3]);

  // Posición del reflejo dinámico de luz (Specular Glare)
  const glareX = useTransform(smoothX, [-0.5, 0.5], [15, 85]);
  const glareY = useTransform(smoothY, [-0.5, 0.5], [15, 85]);

  // Desplazamiento reactivo de la sombra de contacto 3D
  const shadowX = useTransform(smoothX, [-0.5, 0.5], [22, -22]);
  const shadowY = useTransform(smoothY, [-0.5, 0.5], [8, -8]);
  const shadowScale = useTransform(smoothY, [-0.5, 0.5], [0.88, 1.12]);

  // Gradiente dinámico de reflejo
  const glareBackground = useTransform(
    [glareX, glareY],
    ([gx, gy]) =>
      `radial-gradient(circle 260px at ${gx}% ${gy}%, rgba(255,255,255,0.9) 0%, rgba(212,175,55,0.35) 30%, transparent 70%)`
  );

  // Control de eventos de cursor y arrastre táctil/mouse
  const handlePointerDown = useCallback((e) => {
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      rawStartX: rawX.get(),
      rawStartY: rawY.get(),
    };
    if (e.currentTarget.setPointerCapture) {
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  }, [rawX, rawY]);

  const handlePointerMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    if (isDragging) {
      const deltaX = (e.clientX - dragStart.current.x) / (rect.width * 0.7);
      const deltaY = (e.clientY - dragStart.current.y) / (rect.height * 0.7);
      const nextX = Math.max(-0.6, Math.min(0.6, dragStart.current.rawStartX + deltaX));
      const nextY = Math.max(-0.6, Math.min(0.6, dragStart.current.rawStartY + deltaY));
      rawX.set(nextX);
      rawY.set(nextY);
    } else {
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      rawX.set(Math.max(-0.5, Math.min(0.5, x)));
      rawY.set(Math.max(-0.5, Math.min(0.5, y)));
    }
  }, [isDragging, rawX, rawY]);

  const handlePointerUp = useCallback((e) => {
    setIsDragging(false);
    if (e.currentTarget.releasePointerCapture && e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!isDragging) {
      setIsHovered(false);
      rawX.set(0);
      rawY.set(0);
    }
  }, [isDragging, rawX, rawY]);

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full h-full flex flex-col items-center justify-center select-none cursor-grab active:cursor-grabbing touch-none ${className}`}
      style={{ perspective: 1100 }}
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
        {/* Resplandor ambiental trasero suave y orgánico (sin recorte de bordes) */}
        <div
          className="absolute -inset-10 pointer-events-none transition-opacity duration-700"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${accentColor}35 0%, ${accentColor}12 40%, transparent 70%)`,
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

          {/* Reflejo Dinámico Especular (Specular Glare) enmascarado exactamente a la silueta del frasco */}
          <motion.div
            style={{
              opacity: isHovered ? 0.45 : 0,
              background: glareBackground,
              mixBlendMode: 'screen',
              transform: 'translateZ(65px)',
              WebkitMaskImage: `url("${activeImgSrc}")`,
              maskImage: `url("${activeImgSrc}")`,
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              maskPosition: 'center',
            }}
            className="absolute inset-4 pointer-events-none transition-opacity duration-300"
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
