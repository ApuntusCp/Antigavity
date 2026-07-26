export const metadata = {
  title: "Habeas Data & Tratamiento de Datos | GranColinos",
  description: "Política de privacidad, tratamiento de datos de Hojas de Vida y credenciales profesionales bajo la Ley 1581 de 2012.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#050A07] text-white pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto prose prose-invert">
        <h1 className="font-playfair text-4xl mb-4 text-[#D4AF37]">Política de Privacidad, Habeas Data y Módulo de Servicios</h1>
        <p className="text-sm text-gray-400 mb-8 font-mono">En cumplimiento de la Ley 1581 de 2012 y el Decreto 1377 de 2013 en Colombia</p>
        
        <h2 className="text-xl font-bold mt-8 mb-4 text-[#D4AF37]">1. Identificación del Responsable</h2>
        <p className="mb-4 text-gray-300">
          GranColinos (operado por APONTE S.A.S., NIT 901.839.201-4) es el responsable del tratamiento de los datos personales suministrados por titulares en la tienda, repositorios académicos, módulo de servicios profesionales y peticiones de soporte.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-4 text-[#D4AF37]">2. Tratamiento Especial de Datos en el Módulo de Servicios (Red Profesional)</h2>
        <p className="mb-4 text-gray-300">
          Para los usuarios que registran su Perfil Profesional en la sección de Servicios (`/servicios`), GranColinos recolecta con consentimiento explícito y separado:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-300">
          <li><strong>Hojas de Vida Estructuradas:</strong> Datos de experiencia laboral, títulos académicos, certificaciones y proyectos de portafolio.</li>
          <li><strong>Documentos de Verificación:</strong> Números de Tarjeta Profesional / Registro Sanitario (para profesiones reguladas) y Cédula de Ciudadanía. Estos documentos se usan exclusivamente para la validación administrativa interna en GC Admin y no se publican sin autorización.</li>
          <li><strong>Derecho de Supresión Total:</strong> El profesional puede solicitar la eliminación completa e irreversible de su perfil profesional, CV y documentos cargados en cualquier momento.</li>
        </ul>

        <h2 className="text-xl font-bold mt-8 mb-4 text-[#D4AF37]">3. Descargo de Responsabilidad sobre Servicios de Terceros</h2>
        <p className="mb-4 text-gray-300">
          GranColinos indexa y verifica administrativamente la validez formal de las credenciales reportadas por profesionales aprobados. Sin embargo, GranColinos y APONTE S.A.S. no garantizan ni asumen responsabilidad legal directa por la prestación de servicios, contratos, honorarios o asesorías efectuadas entre usuarios y profesionales independientes a través de la red.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-4 text-[#D4AF37]">4. Derechos de los Titulares (Habeas Data)</h2>
        <p className="mb-4 text-gray-300">
          De acuerdo con la legislación colombiana, todo titular de información tiene derecho a:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-300">
          <li>Conocer, actualizar y rectificar sus datos personales.</li>
          <li>Solicitar prueba de la autorización otorgada para el tratamiento de datos.</li>
          <li>Ser informado sobre el uso que se ha dado a sus datos personales.</li>
          <li>Revocar la autorización y/o solicitar la supresión del dato (supresión de perfil/CV).</li>
          <li>Acceder en forma gratuita a sus datos personales almacenados.</li>
        </ul>

        <h2 className="text-xl font-bold mt-8 mb-4 text-[#D4AF37]">5. Canal de PQR y Atención al Ciudadano</h2>
        <p className="mb-4 text-gray-300">
          Para ejercer sus derechos sobre el tratamiento de datos personales o radicar una PQR, puede utilizar el formulario oficial en <a href="/informacion" className="text-[#10B981] underline">grancolinos.com/informacion</a>, donde recibirá radicado con plazo legal de respuesta de 15 días hábiles.
        </p>
      </div>
    </div>
  );
}
