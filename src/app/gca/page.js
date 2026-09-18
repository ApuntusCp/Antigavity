import MaintenanceGuard from '@/components/MaintenanceGuard';
import GCAClient from './GCAClient';

export const metadata = {
  title: "Gran Colina Arquitectos | Estudio de Arquitectura & Construcción Premium",
  description: "Estudio de arquitectura de autor, diseño de interiores, paisajismo y construcción a gran escala. Dirigido por la visión ejecutiva de Aponte SAS.",
};

export default function GCAPage() {
  return (
    <MaintenanceGuard
      routeKey="/gca"
      defaultTitle="MÓDULO GRAN COLINA ARQUITECTOS EN CONSTRUCCIÓN"
      defaultSubtitle="Estamos perfeccionando nuestro estudio de arquitectura de autor, diseño de interiores y construcción premium a gran escala."
      defaultModuleName="Gran Colina Arquitectos (GCA)"
      defaultEstimatedDate="Indefinido / Próximamente"
      defaultStatusText="En Desarrollo Exclusivo"
      defaultQualityText="Estándar Aponte SAS"
      forceMaintenance={true}
    >
      <GCAClient />
    </MaintenanceGuard>
  );
}
