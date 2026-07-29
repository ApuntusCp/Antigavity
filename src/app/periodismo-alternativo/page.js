'use client';

import React from 'react';
import MaintenanceGuard from '@/components/MaintenanceGuard';

export default function PeriodismoPage() {
  return (
    <MaintenanceGuard
      routeKey="/periodismo-alternativo"
      defaultTitle="MÓDULO DE PERIODISMO ALTERNATIVO EN CONSTRUCCIÓN"
      defaultSubtitle="Estamos preparando nuestra plataforma de podcasts de investigación sin censura, análisis territorial y voz libre e independiente."
      defaultModuleName="Periodismo Alternativo & Podcast"
      defaultEstimatedDate="Agosto 2026"
    />
  );
}
