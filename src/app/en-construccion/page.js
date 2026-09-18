import UnderConstructionScreen from '../../components/UnderConstructionScreen';

export const metadata = {
  title: 'En Construcción',
  description: 'Esta sección de GranColinos está en desarrollo. Regresa pronto.',
  robots: { index: false, follow: false },
};

// Esta página es un Server Component.
// El proxy.js le pasa los datos de la ruta en construcción como searchParams
// para no tener que hacer una segunda llamada a Firestore.
export default async function EnConstruccionPage(props) {
  const searchParams = await props.searchParams;
  const ruta = searchParams?.ruta || '/';
  const titulo = searchParams?.titulo || `MÓDULO ${ruta.replace(/^\//, '').toUpperCase()} EN CONSTRUCCIÓN`;
  const subtitulo = searchParams?.subtitulo || 'Estamos perfeccionando este módulo con los más altos estándares de calidad.';
  const modulo = searchParams?.modulo || 'GranColinos Digital';
  const fecha = searchParams?.fecha || 'Indefinido / Próximamente';
  const estado = searchParams?.estado || 'Desarrollo Activo';
  const calidad = searchParams?.calidad || '100% Verificado';

  return (
    <UnderConstructionScreen
      title={titulo}
      subtitle={subtitulo}
      moduleName={modulo}
      estimatedDate={fecha}
      statusText={estado}
      qualityText={calidad}
    />
  );
}
