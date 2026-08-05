'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../utils/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { useAuth } from './AuthProvider';
import UnderConstructionScreen from './UnderConstructionScreen';
import { Wrench, Unlock, Lock } from 'lucide-react';

export default function MaintenanceGuard({
  routeKey,
  defaultTitle,
  defaultSubtitle,
  defaultModuleName,
  defaultEstimatedDate = "Agosto 2026",
  children
}) {
  const { user } = useAuth();
  const [config, setConfig] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [adminPreviewMode, setAdminPreviewMode] = useState(false);

  useEffect(() => {
    const cleanKey = routeKey.startsWith('/') ? routeKey : `/${routeKey}`;
    const noSlashKey = routeKey.replace(/^\//, '');

    const unsub = onSnapshot(
      doc(db, 'settings', 'maintenance_config'),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          // Buscar con slash, sin slash, o la clave tal como viene
          const routeData = data[cleanKey] ?? data[noSlashKey] ?? data[routeKey] ?? null;
          setConfig(routeData);
        } else {
          setConfig(null);
        }
        setIsLoaded(true);
      },
      (err) => {
        console.error('MaintenanceGuard Firestore error:', err);
        // En caso de error de Firestore, permitir acceso para no bloquear la página
        setConfig(null);
        setIsLoaded(true);
      }
    );

    return () => unsub();
  }, [routeKey]);

  // ─── CRITICAL GUARD ───────────────────────────────────────────────────────
  // No renderizar NADA hasta que Firestore confirme el estado de mantenimiento.
  // Sin esto, config=null en el primer render y el contenido siempre se muestra.
  // ──────────────────────────────────────────────────────────────────────────
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#040903] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          <span className="text-[#D4AF37] font-mono text-xs uppercase tracking-widest opacity-60">
            Verificando estado del sistema...
          </span>
        </div>
      </div>
    );
  }

  // ─── Detectar si es administrador ────────────────────────────────────────
  const isAdmin = Boolean(
    user && (
      user.email === 'brayan.aponte1502@gmail.com' ||
      user.role === 'admin' ||
      user.isAdmin === true ||
      user.customProfile?.role === 'admin' ||
      user.customProfile?.isAdmin === true
    )
  );

  // ─── Determinar si mantenimiento está activo ───────────────────────────
  // El proxy server-side (proxy.js) ya bloqueó el acceso para no-admins.
  // Este guard solo gestiona el bypass de admin (banner + toggle de preview).
  // Si config es null (sin registro en Firestore) → modo producción (no bloquear).
  const isEnabled = config?.enabled === true;

  const constructionTitle = config?.title || defaultTitle || `MÓDULO DE ${routeKey.replace(/^\//, '').toUpperCase()} EN CONSTRUCCIÓN`;
  const constructionSubtitle = config?.subtitle || defaultSubtitle || 'Estamos perfeccionando este módulo con los más altos estándares de calidad.';
  const constructionModuleName = config?.moduleName || defaultModuleName || 'GranColinos Digital';
  const constructionEstimatedDate = config?.estimatedDate || defaultEstimatedDate;
  const constructionStatusText = config?.statusText || 'Desarrollo Activo';
  const constructionQualityText = config?.qualityText || '100% Verificado';

  // ─── Mantenimiento ACTIVO + usuario NO ES ADMIN → pantalla de construcción
  if (isEnabled && !isAdmin) {
    return (
      <UnderConstructionScreen
        title={constructionTitle}
        subtitle={constructionSubtitle}
        moduleName={constructionModuleName}
        estimatedDate={constructionEstimatedDate}
        statusText={constructionStatusText}
        qualityText={constructionQualityText}
      />
    );
  }

  // ─── Mantenimiento ACTIVO + usuario ES ADMIN → pantalla admin con toggle
  if (isEnabled && isAdmin) {
    if (!children || !adminPreviewMode) {
      return (
        <div className="relative">
          <div className="fixed top-14 left-1/2 -translate-x-1/2 z-[100] bg-black/90 border border-[#D4AF37] px-4 py-2 rounded-full shadow-[0_0_30px_rgba(212,175,55,0.4)] backdrop-blur-md flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-[#D4AF37] font-bold uppercase tracking-wider">
              <Wrench size={14} className="animate-spin" /> VISTA ADMIN — MANTENIMIENTO ACTIVO
            </span>
            {children && (
              <button
                onClick={() => setAdminPreviewMode(true)}
                className="px-3 py-1 bg-[#D4AF37] hover:bg-white text-black font-extrabold rounded-full uppercase tracking-wider transition-all flex items-center gap-1 shadow-md"
              >
                <Unlock size={12} /> Ver Contenido Real (Admin)
              </button>
            )}
          </div>

          <UnderConstructionScreen
            title={constructionTitle}
            subtitle={constructionSubtitle}
            moduleName={constructionModuleName}
            estimatedDate={constructionEstimatedDate}
            statusText={constructionStatusText}
            qualityText={constructionQualityText}
          />
        </div>
      );
    }

    return (
      <>
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-[100] bg-black/90 border border-emerald-500 px-4 py-2 rounded-full shadow-[0_0_30px_rgba(16,185,129,0.4)] backdrop-blur-md flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase tracking-wider">
            <Unlock size={14} /> PREVISUALIZANDO CONTENIDO REAL (ADMIN)
          </span>
          <button
            onClick={() => setAdminPreviewMode(false)}
            className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 border border-amber-500/50 font-extrabold rounded-full uppercase tracking-wider transition-all flex items-center gap-1"
          >
            <Lock size={12} /> Ver Pantalla Construcción
          </button>
        </div>
        {children}
      </>
    );
  }

  // ─── Mantenimiento DESACTIVADO → mostrar contenido normal
  return <>{children}</>;
}
