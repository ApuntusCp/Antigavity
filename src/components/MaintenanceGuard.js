'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../utils/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { useAuth } from './AuthProvider';
import UnderConstructionScreen from './UnderConstructionScreen';
import { ShieldCheck, Eye, EyeOff, Wrench, Unlock, Lock } from 'lucide-react';

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
    const unsub = onSnapshot(
      doc(db, 'settings', 'maintenance_config'),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data[routeKey]) {
            setConfig(data[routeKey]);
          }
        }
        setIsLoaded(true);
      },
      (err) => {
        console.log("Maintenance config sub err:", err);
        setIsLoaded(true);
      }
    );

    return () => unsub();
  }, [routeKey]);

  // Verificar si el usuario actual es el Administrador Principal (brayan.aponte1502@gmail.com o rol admin)
  const isAdmin = Boolean(
    user && (
      user.email === 'brayan.aponte1502@gmail.com' ||
      user.role === 'admin' ||
      user.isAdmin === true ||
      user.customProfile?.role === 'admin' ||
      user.customProfile?.isAdmin === true
    )
  );

  // Por defecto /periodismo-alternativo y /servicios inician en modo construcción a menos que se cambie en Firestore
  const isEnabled = config?.enabled ?? (routeKey === '/periodismo-alternativo' || routeKey === '/servicios');

  const constructionTitle = config?.title || defaultTitle || `MÓDULO DE ${routeKey.replace('/', '').toUpperCase()} EN CONSTRUCCIÓN`;
  const constructionSubtitle = config?.subtitle || defaultSubtitle || "Estamos perfeccionando este módulo con los más altos estándares de calidad.";
  const constructionModuleName = config?.moduleName || defaultModuleName || "GranColinos Digital";
  const constructionEstimatedDate = config?.estimatedDate || defaultEstimatedDate;
  const constructionStatusText = config?.statusText || "Desarrollo Activo";
  const constructionQualityText = config?.qualityText || "100% Verificado";

  // Si Mantenimiento está ACTIVADO y el usuario NO ES ADMINISTRADOR -> Mostrar pantalla de construcción
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

  // Si Mantenimiento está ACTIVADO y el usuario ES ADMINISTRADOR:
  if (isEnabled && isAdmin) {
    // Si no hay contenido hijo disponible o si no se ha activado la previsualización del contenido real, mostrar la Pantalla de Construcción con la Barra Flotante del Admin
    if (!children || !adminPreviewMode) {
      return (
        <div className="relative">
          {/* BARRA FLOTANTE ADMINISTRATIVA VISTA PREVIA */}
          <div className="fixed top-14 left-1/2 -translate-x-1/2 z-[100] bg-black/90 border border-[#D4AF37] px-4 py-2 rounded-full shadow-[0_0_30px_rgba(212,175,55,0.4)] backdrop-blur-md flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-[#D4AF37] font-bold uppercase tracking-wider">
              <Wrench size={14} className="animate-spin" /> VISTA ADMIN
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

    // Si Admin activó la previsualización del contenido real:
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

  // Si Mantenimiento está DESACTIVADO -> Mostrar contenido real normalmente
  return <>{children}</>;
}
