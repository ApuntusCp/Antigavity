'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../utils/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { useAuth } from './AuthProvider';
import UnderConstructionScreen from './UnderConstructionScreen';
import { ShieldCheck, Eye } from 'lucide-react';

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

  // Por defecto /periodismo-alternativo inicia en mantenimiento a menos que se reconfigure en Firestore
  const isEnabled = config?.enabled ?? (routeKey === '/periodismo-alternativo');

  // Si Mantenimiento está ACTIVADO y el usuario NO ES ADMINISTRADOR -> Mostrar pantalla de construcción
  if (isEnabled && !isAdmin) {
    return (
      <UnderConstructionScreen 
        title={config?.title || defaultTitle || `MÓDULO DE ${routeKey.replace('/', '').toUpperCase()} EN CONSTRUCCIÓN`}
        subtitle={config?.subtitle || defaultSubtitle || "Estamos perfeccionando este módulo con los más altos estándares de calidad."}
        moduleName={config?.moduleName || defaultModuleName || "GranColinos Digital"}
        estimatedDate={config?.estimatedDate || defaultEstimatedDate}
      />
    );
  }

  // Si es Administrador o el Mantenimiento está DESACTIVADO -> Mostrar la página normal con distintivo Admin si aplica
  return (
    <>
      {isEnabled && isAdmin && (
        <div className="fixed top-16 right-4 z-50 bg-[#D4AF37] text-black text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full shadow-2xl flex items-center gap-1.5 animate-pulse">
          <Eye size={14} />
          <span>VISTA ADMIN (Mantenimiento Activo para usuarios)</span>
        </div>
      )}
      {children}
    </>
  );
}
