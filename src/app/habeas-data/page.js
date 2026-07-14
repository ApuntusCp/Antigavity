export const metadata = {
  title: "Habeas Data | GranColinos",
  description: "Política de privacidad y tratamiento de datos personales.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto prose dark:prose-invert prose-brand">
        <h1 className="font-playfair text-4xl mb-8">Política de Privacidad y Habeas Data</h1>
        <p className="text-sm text-gray-500 mb-8">En cumplimiento de la Ley 1581 de 2012</p>
        
        <h2 className="text-xl font-bold mt-8 mb-4">1. Identificación del Responsable</h2>
        <p className="mb-4">
          GranColinos es el responsable del tratamiento de los datos personales suministrados por los titulares (clientes, 
          usuarios, empleados y proveedores).
        </p>

        <h2 className="text-xl font-bold mt-8 mb-4">2. Finalidad de la Recolección de Datos</h2>
        <p className="mb-4">
          Los datos personales recopilados a través de nuestro sitio web (como nombre, correo electrónico, teléfono y dirección) 
          se utilizarán exclusivamente para:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Procesamiento y envío de pedidos.</li>
          <li>Envío de notificaciones sobre el estado de las compras.</li>
          <li>Comunicaciones de marketing, ofertas y lanzamientos (siempre que el usuario haya dado su consentimiento).</li>
          <li>Mejora de nuestros servicios y experiencia en la plataforma.</li>
        </ul>

        <h2 className="text-xl font-bold mt-8 mb-4">3. Derechos de los Titulares (Habeas Data)</h2>
        <p className="mb-4">
          De acuerdo con la legislación colombiana, todo titular de información tiene derecho a:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Conocer, actualizar y rectificar sus datos personales.</li>
          <li>Solicitar prueba de la autorización otorgada para el tratamiento de datos.</li>
          <li>Ser informado sobre el uso que se ha dado a sus datos personales.</li>
          <li>Revocar la autorización y/o solicitar la supresión del dato.</li>
          <li>Acceder en forma gratuita a sus datos personales que hayan sido objeto de Tratamiento.</li>
        </ul>

        <h2 className="text-xl font-bold mt-8 mb-4">4. Seguridad de la Información</h2>
        <p className="mb-4">
          GranColinos implementa medidas de seguridad técnicas y administrativas estrictas (incluyendo infraestructura en Google Firebase) 
          para proteger los datos personales contra acceso no autorizado, pérdida, alteración o destrucción.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-4">5. Contacto Peticiones y Reclamos</h2>
        <p className="mb-4">
          Para ejercer sus derechos sobre el tratamiento de datos personales, puede comunicarse con nosotros a través de nuestro canal 
          de soporte oficial.
        </p>
      </div>
    </div>
  );
}
