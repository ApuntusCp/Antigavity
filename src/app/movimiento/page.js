import Image from "next/image";
import Link from "next/link";
import { Leaf, Cpu, Sun, Sprout, ShieldCheck, TrendingUp } from "lucide-react";

export const metadata = {
  title: "Movimiento Gran Colinos | Solar Punk",
  description: "Una simbiosis radical entre Naturaleza y Tecnología para el futuro de Colombia.",
};

export default function MovimientoPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-gray-300 font-sans selection:bg-brand-green/30 selection:text-brand-gold overflow-hidden">
      {/* Ambient Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-brand-green/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-brand-gold/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 md:pt-48 md:pb-32 overflow-hidden border-b border-white/5">
        <div className="max-w-5xl mx-auto text-center relative z-10 fade-in">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-brand-green/30 bg-brand-green/5 text-brand-green text-xs font-bold tracking-[0.3em] uppercase mb-8">
            <Sprout size={14} /> Simbiosis 2026 <Cpu size={14} />
          </div>
          <h1 className="font-playfair text-5xl md:text-8xl text-white mb-6 leading-tight">
            El Futuro es <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green via-brand-gold to-emerald-400">
              Solar Punk
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed mb-12">
            El <strong>Movimiento Gran Colinos</strong> no es solo una marca. Es un manifiesto vivo. 
            Nuestra meta es revolucionar la estructura política y social de Colombia fusionando 
            el poder ancestral de la botánica con la tecnología de vanguardia.
          </p>
          <button className="bg-brand-green/10 border border-brand-green/30 text-brand-green hover:bg-brand-green hover:text-black font-bold uppercase tracking-widest px-8 py-4 rounded-lg transition-all duration-300">
            Únete al Manifiesto
          </button>
        </div>
      </section>

      {/* Manifiesto Grid */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="bg-[#0a0a0a] p-10 rounded-2xl border border-white/5 hover:border-brand-green/30 transition-colors group">
              <div className="w-16 h-16 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-8 text-brand-green group-hover:scale-110 transition-transform">
                <Leaf size={32} />
              </div>
              <h3 className="font-playfair text-2xl text-white mb-4">Naturaleza Radical</h3>
              <p className="text-gray-400 font-light leading-relaxed">
                Rechazamos la explotación. Cultivamos pureza. Volvemos a las raíces de la tierra colombiana para extraer el verdadero bienestar, sin químicos ni atajos.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-[#0a0a0a] p-10 rounded-2xl border border-white/5 hover:border-brand-gold/30 transition-colors group mt-0 md:mt-12">
              <div className="w-16 h-16 bg-brand-gold/10 rounded-2xl flex items-center justify-center mb-8 text-brand-gold group-hover:scale-110 transition-transform">
                <Cpu size={32} />
              </div>
              <h3 className="font-playfair text-2xl text-white mb-4">Tecnología Ética</h3>
              <p className="text-gray-400 font-light leading-relaxed">
                Utilizamos inteligencia artificial, trazabilidad y sistemas avanzados no para reemplazar lo humano, sino para potenciar el alcance de la medicina natural.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-[#0a0a0a] p-10 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-colors group mt-0 md:mt-24">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-8 text-emerald-500 group-hover:scale-110 transition-transform">
                <TrendingUp size={32} />
              </div>
              <h3 className="font-playfair text-2xl text-white mb-4">Impacto Político</h3>
              <p className="text-gray-400 font-light leading-relaxed">
                Para cambiar el país, debemos legislar. Gran Colinos aspira a influir en la política colombiana creando un marco legal donde la salud mental y física sea un derecho, no un privilegio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visión */}
      <section className="py-24 px-6 border-t border-white/5 relative z-10 bg-gradient-to-b from-transparent to-[#020202]">
        <div className="max-w-4xl mx-auto text-center">
          <Sun size={48} className="text-brand-gold mx-auto mb-8 opacity-50" />
          <h2 className="font-playfair text-3xl md:text-5xl text-white mb-8">
            Colombia 2030: <br />
            <span className="text-gray-400">La Revolución Verde y Digital</span>
          </h2>
          <p className="text-gray-400 font-light leading-relaxed text-lg mb-12">
            Visualizamos ciudades colombianas donde los jardines verticales purifican el aire mientras servidores descentralizados aseguran la distribución equitativa de recursos. Un país donde la marihuana medicinal, la apitoxina y los adaptógenos son parte del sistema de salud pública, administrados con precisión milimétrica por tecnología colombiana.
          </p>
        </div>
      </section>
    </div>
  );
}
