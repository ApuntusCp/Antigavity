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
    />
  );
}
