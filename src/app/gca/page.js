import Image from "next/image";
import Link from "next/link";
import { Playfair_Display, Inter } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Gran Colina Arquitectos | Diseño y Construcción Premium",
  description: "Estudio de arquitectura, diseño de interiores y construcciones a gran escala. Dirigido por el CEO de Aponte SAS.",
};

export default function GCAPage() {
  return (
    <main className="min-h-screen bg-[#050A07] text-[#E2E8F0] selection:bg-[#D4AF37] selection:text-black overflow-hidden pt-20">
      
      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center border-b border-[#D4AF37]/20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#050A07]/80 via-[#050A07]/60 to-[#050A07] z-10" />
          <div 
            className="absolute inset-0 opacity-40 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/bg_leather.webp')" }}
          />
        </div>
        
        <div className="relative z-20 max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-[#D4AF37] tracking-[0.3em] text-sm md:text-base font-bold mb-6 uppercase">
            Estudio de Arquitectura
          </h2>
          <h1 className={`${playfair.className} text-5xl md:text-7xl lg:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF1C5] to-[#D4AF37] mb-8 leading-tight drop-shadow-2xl`}>
            Gran Colina<br />Arquitectos
          </h1>
          <p className={`${inter.className} text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed mb-12`}>
            Donde la naturaleza, el lujo y la geometría se encuentran para crear espacios atemporales.
          </p>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto" />
        </div>
      </section>

      {/* CEO Section */}
      <section className="py-24 relative">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-[3/4] w-full max-w-md mx-auto rounded-sm overflow-hidden border border-[#D4AF37]/30 shadow-[0_0_50px_rgba(212,175,55,0.1)] group">
              <div className="absolute inset-0 bg-gradient-to-t from-[#050A07] to-transparent z-10" />
              {/* Usamos un placeholder dorado para el CEO, el usuario puede cambiar la foto luego */}
              <div className="w-full h-full bg-[#111A13] flex items-center justify-center">
                 <span className="text-[#D4AF37]/50 text-6xl">GCA</span>
              </div>
            </div>
            
            <div>
              <h2 className={`${playfair.className} text-4xl md:text-5xl text-[#D4AF37] mb-6`}>
                Visión Directiva
              </h2>
              <h3 className="text-xl text-white mb-8 font-semibold tracking-wide">
                CEO, Aponte SAS & Fundador de Gran Colinos
              </h3>
              <div className={`${inter.className} space-y-6 text-gray-300 font-light text-lg leading-relaxed`}>
                <p>
                  Como mente creativa detrás del ecosistema Gran Colinos, mi visión siempre ha sido entrelazar el bienestar humano con la perfección de la naturaleza. 
                </p>
                <p>
                  Gran Colina Arquitectos nace como la máxima expresión de esta filosofía. No solo creamos productos botánicos; construimos los santuarios donde la vida transcurre. Desde el diseño de interiores meticuloso hasta el desarrollo de infraestructuras a gran escala, aplicamos el mismo rigor, lujo y conexión natural que define a Aponte SAS.
                </p>
                <p className="text-[#D4AF37] font-medium pt-4">
                  "La arquitectura no es solo construir; es esculpir el entorno para elevar el espíritu."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-[#0A100C] relative border-t border-b border-[#D4AF37]/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className={`${playfair.className} text-4xl md:text-5xl text-[#D4AF37] mb-4`}>
              Nuestros Servicios
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Soluciones integrales de diseño y construcción, ejecutadas con precisión milimétrica y materiales de la más alta calidad.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Diseño de Interiores",
                desc: "Creación de atmósferas exclusivas que combinan lujo, confort y elementos botánicos, transformando espacios vacíos en experiencias sensoriales.",
                icon: "✨"
              },
              {
                title: "Arquitectura Paisajística",
                desc: "Integración perfecta entre la estructura construida y el entorno natural. Diseñamos espacios exteriores que respiran y evolucionan.",
                icon: "🌿"
              },
              {
                title: "Construcción a Gran Escala",
                desc: "Desarrollo de proyectos comerciales y residenciales de alto impacto. Gestión integral de obra asegurando estándares mundiales.",
                icon: "🏗️"
              }
            ].map((service, i) => (
              <div key={i} className="bg-[#050A07] p-8 border border-[#D4AF37]/20 hover:border-[#D4AF37]/60 transition-colors duration-500 group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 text-4xl opacity-10 group-hover:opacity-30 transition-opacity">
                  {service.icon}
                </div>
                <h3 className={`${playfair.className} text-2xl text-white mb-4 group-hover:text-[#D4AF37] transition-colors`}>
                  {service.title}
                </h3>
                <p className="text-gray-400 font-light leading-relaxed">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050A07] z-10" />
        <div className="relative z-20 max-w-3xl mx-auto px-4">
          <h2 className={`${playfair.className} text-4xl md:text-6xl text-white mb-8`}>
            Construyamos el Futuro
          </h2>
          <p className="text-gray-300 mb-12 text-lg">
            Permítenos convertir tu visión en una obra maestra tangible. Agenda una consultoría privada de diseño con nuestro equipo.
          </p>
          <Link href="/contacto" className="inline-block bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black px-12 py-4 tracking-[0.2em] uppercase text-sm font-bold transition-all duration-300">
            Agendar Consultoría
          </Link>
        </div>
      </section>
    </main>
  );
}
