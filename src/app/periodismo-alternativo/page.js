'use client';

import React from 'react';
import MaintenanceGuard from '@/components/MaintenanceGuard';
import UnderConstructionScreen from '@/components/UnderConstructionScreen';

export default function PeriodismoPage() {
  return (
    <MaintenanceGuard
      routeKey="/periodismo-alternativo"
      defaultTitle="MÓDULO DE PERIODISMO ALTERNATIVO EN CONSTRUCCIÓN"
      defaultSubtitle="Estamos preparando nuestra plataforma de podcasts de investigación sin censura, análisis territorial y voz libre e independiente."
      defaultModuleName="Periodismo Alternativo & Podcast"
      defaultEstimatedDate="Agosto 2026"
    >
      <div className="min-h-screen pt-28 pb-16 px-6 max-w-5xl mx-auto text-white">
        <h1 className="text-4xl font-bold font-serif text-[#D4AF37] mb-4">Periodismo Alternativo & Podcast</h1>
        <p className="text-gray-300">Bienvenido al portal oficial de periodismo independiente de GranColinos.</p>
      </div>
    </MaintenanceGuard>
  );
}
