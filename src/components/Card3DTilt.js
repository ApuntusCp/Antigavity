'use client';

import React, { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * Card3DTilt
 * Envoltorio de tarjeta con inclinación 3D en perspectiva,
 * profundidad de capas (transform-style: preserve-3d)
 * y destello de luz especular al pasar el cursor.
 */
export default function Card3DTilt({
  children,
  className = '',
  maxTilt = 12,
  glare = true,
}) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Física de resortes suaves para una sensación táctil de calidad
  const springConfig = { stiffness: 260, damping: 24, mass: 0.7 };
  const smoothX = useSpring(rawX, springConfig);
  const smoothY = useSpring(rawY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-maxTilt, maxTilt]);

  const glareX = useTransform(smoothX, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(smoothY, [-0.5, 0.5], [0, 100]);

  const glareBackground = useTransform(
    [glareX, glareY],
    ([gx, gy]) =>
      `radial-gradient(circle 300px at ${gx}% ${gy}%, rgba(255,255,255,0.2) 0%, rgba(212,175,55,0.1) 30%, transparent 65%)`
  );

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
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

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative ${className}`}
      style={{ perspective: 1000 }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        animate={isHovered ? { scale: 1.025 } : { scale: 1 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative w-full h-full"
      >
        {children}

        {/* Capa de reflejo especular en la superficie de la tarjeta */}
        {glare && (
          <motion.div
            style={{
              opacity: isHovered ? 1 : 0,
              background: glareBackground,
              mixBlendMode: 'overlay',
              transform: 'translateZ(30px)',
            }}
            className="absolute inset-0 pointer-events-none rounded-3xl transition-opacity duration-300 z-30"
          />
        )}
      </motion.div>
    </div>
  );
}
