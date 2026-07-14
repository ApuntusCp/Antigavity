export const metadata = {
  title: "Términos de Servicio | GranColinos",
  description: "Términos y condiciones de uso de la plataforma GranColinos.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto prose dark:prose-invert prose-brand">
        <h1 className="font-playfair text-4xl mb-8">Términos de Servicio</h1>
        <p className="text-sm text-gray-500 mb-8">Última actualización: {new Date().toLocaleDateString('es-CO')}</p>
        
        <h2 className="text-xl font-bold mt-8 mb-4">1. Aceptación de los Términos</h2>
        <p className="mb-4">
          Al acceder y utilizar el sitio web de GranColinos (grancolinos.com), usted acepta estar sujeto a estos Términos de Servicio, 
          todas las leyes y regulaciones aplicables en el territorio de la República de Colombia, y acepta que es responsable del 
          cumplimiento de las leyes locales aplicables.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-4">2. Productos y Salud (INVIMA)</h2>
        <p className="mb-4">
          Los productos comercializados en GranColinos cuentan con registro INVIMA. Sin embargo, la información proporcionada en 
          este sitio no sustituye el consejo médico profesional. Consulte a su médico antes de iniciar cualquier tratamiento con 
          nuestros productos, especialmente si está embarazada, amamantando, tiene una condición médica preexistente o toma 
          medicamentos recetados.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-4">3. Compras y Pagos</h2>
        <p className="mb-4">
          Todas las compras realizadas a través de nuestro sitio web están sujetas a disponibilidad de inventario. Utilizamos 
          <strong> Bold</strong> como nuestra pasarela de pagos segura. GranColinos no almacena datos de tarjetas de crédito o débito.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-4">4. Envíos y Devoluciones</h2>
        <p className="mb-4">
          Ofrecemos envíos a nivel nacional en Colombia con una tarifa fija. El tiempo estimado de entrega varía según la ciudad 
          de destino. Para cambios o devoluciones, el producto debe estar sellado, sin uso, y en las mismas condiciones en que se 
          recibió. Tiene un plazo legal de 5 días hábiles (Derecho de Retracto) desde la recepción del producto.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-4">5. Propiedad Intelectual</h2>
        <p className="mb-4">
          Todo el contenido de este sitio (textos, gráficos, logotipos, imágenes y software) es propiedad de GranColinos o de 
          sus proveedores de contenido y está protegido por las leyes de derechos de autor de Colombia e internacionales.
        </p>
      </div>
    </div>
  );
}
