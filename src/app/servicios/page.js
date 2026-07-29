'use client';

import React from 'react';
import MaintenanceGuard from '@/components/MaintenanceGuard';

export default function ServiciosPage() {
  return (
    <MaintenanceGuard
      routeKey="/servicios"
      defaultTitle="DIRECTORIO DE SERVICIOS & PROFESIONALES EN CONSTRUCCIÓN"
      defaultSubtitle="Estamos optimizando la red social profesional verificada y el sistema de acreditación de credenciales médicas, jurídicas y técnicas de GranColinos."
      defaultModuleName="Directorio de Servicios & Profesionales"
      defaultEstimatedDate="Agosto 2026"
    >
      <div className="min-h-screen pt-28 pb-16 px-6 max-w-5xl mx-auto text-white">
        <h1 className="text-4xl font-bold font-serif text-[#D4AF37] mb-4">Directorio de Servicios & Profesionales</h1>
        <p className="text-gray-300">Bienvenido al portal oficial de servicios y acreditaciones de GranColinos.</p>
      </div>
    </MaintenanceGuard>
  );
}
