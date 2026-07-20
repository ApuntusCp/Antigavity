import Image from "next/image";
import Link from "next/link";
import { Leaf, Cpu, Sun, Sprout, ShieldCheck, TrendingUp, Layers } from "lucide-react";
import { fetchCMSPage } from "../../utils/firebase";

export const revalidate = 30;

export const metadata = {
  title: "Movimiento Gran Colinos | Solar Punk",
  description: "Una simbiosis radical entre Naturaleza y Tecnología para el futuro de Colombia.",
};

export default async function MovimientoPage() {
  const cmsConfig = await fetchCMSPage('movimiento');
  const blocks = cmsConfig?.blocks || [];
  
  const heroBlock = blocks.find(b => b.type === 'movimiento_hero')?.content || {};
  const heroTitle = heroBlock.title || 'El Futuro es <br/><span style="color:#7BA05B">Solar Punk</span>';
  const heroText = heroBlock.text || 'El <strong>Movimiento Gran Colinos</strong> no es solo una marca. Es un manifiesto vivo. Nuestra meta es revolucionar la estructura política y social de Colombia fusionando el poder ancestral de la botánica con la tecnología de vanguardia.';
  const heroCta = heroBlock.cta || 'Únete al Manifiesto';

  const pillarBlocks = blocks.filter(b => b.type === 'movimiento_pillar').map(b => b.content);
  
  const defaultPillars = [
    { title: "Naturaleza Radical", text: "Rechazamos la explotación. Cultivamos pureza. Volvemos a las raíces de la tierra colombiana para extraer el verdadero bienestar, sin químicos ni atajos.", icon: <Leaf size={32} />, colorClass: "text-brand-green", bgClass: "bg-brand-green/10", borderHover: "hover:border-brand-green/30" },
    { title: "Tecnología Ética", text: "Utilizamos inteligencia artificial, trazabilidad y sistemas avanzados no para reemplazar lo humano, sino para potenciar el alcance de la medicina natural.", icon: <Cpu size={32} />, colorClass: "text-brand-gold", bgClass: "bg-brand-gold/10", borderHover: "hover:border-brand-gold/30" },
    { title: "Impacto Político", text: "Para cambiar el país, debemos legislar. Gran Colinos aspira a influir en la política colombiana creando un marco legal donde la salud mental y física sea un derecho, no un privilegio.", icon: <TrendingUp size={32} />, colorClass: "text-emerald-500", bgClass: "bg-emerald-500/10", borderHover: "hover:border-emerald-500/30" }
  ];

  const pillarsToRender = defaultPillars.map((def, i) => {
    if (pillarBlocks[i]) {
      return { ...def, title: pillarBlocks[i].title, text: pillarBlocks[i].text };
    }
    return def;
  });

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
          <h1 
            className="font-playfair text-5xl md:text-8xl text-white mb-6 leading-tight"
            dangerouslySetInnerHTML={{ __html: heroTitle }}
          />
          <p 
            className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed mb-12"
            dangerouslySetInnerHTML={{ __html: heroText }}
          />
          <button className="bg-brand-green/10 border border-brand-green/30 text-brand-green hover:bg-brand-green hover:text-black font-bold uppercase tracking-widest px-8 py-4 rounded-lg transition-all duration-300">
            {heroCta}
          </button>
        </div>
      </section>

      {/* Manifiesto Grid */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillarsToRender.map((pillar, index) => (
              <div key={index} className={`bg-[#0a0a0a] p-10 rounded-2xl border border-white/5 transition-colors group ${pillar.borderHover} ${index === 1 ? 'mt-0 md:mt-12' : index === 2 ? 'mt-0 md:mt-24' : ''}`}>
                <div className={`w-16 h-16 ${pillar.bgClass} rounded-2xl flex items-center justify-center mb-8 ${pillar.colorClass} group-hover:scale-110 transition-transform`}>
                  {pillar.icon}
                </div>
                <h3 className="font-playfair text-2xl text-white mb-4">{pillar.title}</h3>
                <p className="text-gray-400 font-light leading-relaxed">
                  {pillar.text}
                </p>
              </div>
            ))}
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
