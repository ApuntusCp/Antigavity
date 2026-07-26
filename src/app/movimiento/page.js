import Image from "next/image";
import Link from "next/link";
import { Leaf, Cpu, Sun, Sprout, ShieldCheck, TrendingUp, Flame } from "lucide-react";
import { fetchCMSPage } from "../../utils/firebase";
import JoinMovementButton from "../../components/JoinMovementButton";
import PaymentMethodsBadge from "../../components/PaymentMethodsBadge";

export const revalidate = 30;

export const metadata = {
  title: "Movimiento Gran Colinos | Red Solarpunk",
  description: "Una simbiosis radical entre Naturaleza y Tecnología para el futuro de Colombia.",
};

export default async function MovimientoPage() {
  const cmsConfig = await fetchCMSPage('movimiento');
  const blocks = cmsConfig?.blocks || [];
  
  const heroBlock = blocks.find(b => b.type === 'movimiento_hero')?.content || {};
  const heroTitle = heroBlock.title || 'El Futuro es <br/><span style="color:#FF4D4D">Solarpunk & Orgánico</span>';
  const heroText = heroBlock.text || 'El <strong>Movimiento Gran Colinos</strong> es un manifiesto vivo de soberanía. Nuestra meta es transformar la cultura de salud y dignidad en Colombia fusionando la sabiduría botánica con tecnología ética.';
  const heroCta = heroBlock.cta || 'Únete al Manifiesto';

  const pillarBlocks = blocks.filter(b => b.type === 'movimiento_pillar').map(b => b.content);
  
  const defaultPillars = [
    { title: "Naturaleza Radical", text: "Rechazamos la explotación. Cultivamos pureza. Volvemos a las raíces de la tierra colombiana para extraer el verdadero bienestar, sin químicos ni atajos.", icon: <Leaf size={32} />, colorClass: "text-[#FF4D4D]", bgClass: "bg-[#FF4D4D]/10", borderHover: "hover:border-[#FF4D4D]/40" },
    { title: "Tecnología Ética", text: "Utilizamos inteligencia artificial, trazabilidad y sistemas avanzados no para reemplazar lo humano, sino para potenciar el alcance de la medicina natural.", icon: <Cpu size={32} />, colorClass: "text-[#D4AF37]", bgClass: "bg-[#D4AF37]/10", borderHover: "hover:border-[#D4AF37]/40" },
    { title: "Impacto Comunitario", text: "Para cambiar el país, debemos organizarnos. Gran Colinos promueve un marco social donde la salud mental y física sea un derecho inviolable.", icon: <TrendingUp size={32} />, colorClass: "text-[#FF6B35]", bgClass: "bg-[#FF6B35]/10", borderHover: "hover:border-[#FF6B35]/40" }
  ];

  const cyclicStyles = [
    { icon: <Leaf size={32} />, colorClass: "text-[#FF4D4D]", bgClass: "bg-[#FF4D4D]/10", borderHover: "hover:border-[#FF4D4D]/40" },
    { icon: <Cpu size={32} />, colorClass: "text-[#D4AF37]", bgClass: "bg-[#D4AF37]/10", borderHover: "hover:border-[#D4AF37]/40" },
    { icon: <TrendingUp size={32} />, colorClass: "text-[#FF6B35]", bgClass: "bg-[#FF6B35]/10", borderHover: "hover:border-[#FF6B35]/40" },
    { icon: <ShieldCheck size={32} />, colorClass: "text-blue-500", bgClass: "bg-blue-500/10", borderHover: "hover:border-blue-500/40" }
  ];

  let pillarsToRender = defaultPillars;
  if (pillarBlocks.length > 0) {
    pillarsToRender = pillarBlocks.map((block, i) => {
      const style = cyclicStyles[i % cyclicStyles.length];
      return { ...style, title: block.title || 'Pilar', text: block.text || '' };
    });
  }

  return (
    <div className="min-h-screen theme-movimiento text-gray-300 font-sans overflow-hidden pt-32 pb-24 px-6 relative">
      
      {/* Hero Section */}
      <section className="relative pb-20 max-w-5xl mx-auto text-center z-10 fade-in">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[#FF4D4D]/40 bg-[#FF4D4D]/10 text-[#FF4D4D] text-xs font-bold tracking-[0.3em] uppercase mb-8">
          <Flame size={14} /> MOVIMIENTO GRANCOLINOS <Cpu size={14} />
        </div>
        <h1 
          className="font-serif text-5xl md:text-8xl text-white mb-6 leading-tight drop-shadow-md"
          dangerouslySetInnerHTML={{ __html: heroTitle }}
        />
        <p 
          className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed mb-12"
          dangerouslySetInnerHTML={{ __html: heroText }}
        />
        <JoinMovementButton text={heroCta} />
      </section>

      {/* Manifiesto Grid */}
      <section className="py-16 relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillarsToRender.map((pillar, index) => (
            <div key={index} className={`bg-black/50 p-10 rounded-2xl border border-[#FF4D4D]/20 backdrop-blur-xl transition-all duration-300 group ${pillar.borderHover} ${index === 1 ? 'mt-0 md:mt-8' : index === 2 ? 'mt-0 md:mt-16' : ''}`}>
              <div className={`w-16 h-16 ${pillar.bgClass} rounded-2xl flex items-center justify-center mb-8 ${pillar.colorClass} group-hover:scale-110 transition-transform shadow-lg`}>
                {pillar.icon}
              </div>
              <h3 className="font-serif text-2xl text-white mb-4 font-bold">{pillar.title}</h3>
              <p className="text-gray-300 font-light leading-relaxed text-sm">
                {pillar.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Visión */}
      <section className="py-16 max-w-4xl mx-auto text-center relative z-10">
        <Sun size={48} className="text-[#FF4D4D] mx-auto mb-8 opacity-70" />
        <h2 className="font-serif text-3xl md:text-5xl text-white mb-8 font-bold">
          Colombia 2030: <br />
          <span className="text-[#FF4D4D]">Revolución Orgánica y Autonomía</span>
        </h2>
        <p className="text-gray-300 font-light leading-relaxed text-base md:text-lg mb-12">
          Visualizamos un país donde la medicina natural, la apitoxina y los extractos botánicos puros se combinan con la tecnología para garantizar salud, bienestar y soberanía comunitaria.
        </p>

        <PaymentMethodsBadge />
      </section>
    </div>
  );
}
