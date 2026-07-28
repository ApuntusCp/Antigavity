import { Leaf, Cpu, Sun, ShieldCheck, TrendingUp, Sparkles } from "lucide-react";
import { fetchCMSPage } from "../../utils/firebase";
import JoinMovementButton from "../../components/JoinMovementButton";

export const revalidate = 30;

export const metadata = {
  title: "Movimiento Gran Colinos | Red Solarpunk",
  description: "Una simbiosis radical entre Naturaleza y Tecnología para el futuro de Colombia.",
};

export default async function MovimientoPage() {
  // ── try-catch: si Firebase falla, la página carga con contenido por defecto
  let cmsConfig = null;
  try {
    cmsConfig = await fetchCMSPage('movimiento');
  } catch (error) {
    console.error('[Movimiento] Error cargando CMS:', error);
  }
  const blocks = cmsConfig?.blocks || [];
  
  const heroBlock = blocks.find(b => b.type === 'movimiento_hero')?.content || {};
  // Whitelist de tags HTML seguros para el hero del movimiento.
  // Se permite <br/>, <strong>, <span> y <em> pero se elimina cualquier script,
  // evento on*, href javascript: u otro vector de XSS potencial.
  function sanitizeHeroHtml(html) {
    if (typeof html !== 'string') return '';
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/<(?!\/?(?:br|strong|em|span|b|i)[\s/>])[^>]+>/gi, '');
  }
  const heroTitleRaw = heroBlock.title || 'El Futuro es <br/><span class="text-gold-gradient font-black">Solarpunk &amp; Orgánico</span>';
  const heroTextRaw = heroBlock.text || 'El <strong>Movimiento Gran Colinos</strong> es un manifiesto vivo de soberanía. Nuestra meta es transformar la cultura de salud y dignidad en Colombia fusionando la sabiduría botánica con tecnología ética.';
  const heroTitle = sanitizeHeroHtml(heroTitleRaw);
  const heroText = sanitizeHeroHtml(heroTextRaw);
  const heroCta = heroBlock.cta || 'Únete al Manifiesto';

  const pillarBlocks = blocks.filter(b => b.type === 'movimiento_pillar').map(b => b.content);
  
  const defaultPillars = [
    { title: "Naturaleza Radical", text: "Rechazamos la explotación. Cultivamos pureza. Volvemos a las raíces de la tierra colombiana para extraer el verdadero bienestar, sin químicos ni atajos.", icon: <Leaf size={32} />, colorClass: "text-[#D4AF37]", bgClass: "bg-[#D4AF37]/15", borderHover: "hover:border-[#D4AF37]/60" },
    { title: "Tecnología Ética", text: "Utilizamos inteligencia artificial, trazabilidad y sistemas avanzados no para reemplazar lo humano, sino para potenciar el alcance de la medicina natural.", icon: <Cpu size={32} />, colorClass: "text-emerald-400", bgClass: "bg-emerald-500/15", borderHover: "hover:border-emerald-500/60" },
    { title: "Impacto Comunitario", text: "Para cambiar el país, debemos organizarnos. Gran Colinos promueve un marco social donde la salud mental y física sea un derecho inviolable.", icon: <TrendingUp size={32} />, colorClass: "text-[#D4AF37]", bgClass: "bg-[#D4AF37]/15", borderHover: "hover:border-[#D4AF37]/60" }
  ];

  const cyclicStyles = [
    { icon: <Leaf size={32} />, colorClass: "text-[#D4AF37]", bgClass: "bg-[#D4AF37]/15", borderHover: "hover:border-[#D4AF37]/60" },
    { icon: <Cpu size={32} />, colorClass: "text-emerald-400", bgClass: "bg-emerald-500/15", borderHover: "hover:border-emerald-500/60" },
    { icon: <TrendingUp size={32} />, colorClass: "text-[#D4AF37]", bgClass: "bg-[#D4AF37]/15", borderHover: "hover:border-[#D4AF37]/60" },
    { icon: <ShieldCheck size={32} />, colorClass: "text-emerald-400", bgClass: "bg-emerald-500/15", borderHover: "hover:border-emerald-500/60" }
  ];

  let pillarsToRender = defaultPillars;
  if (pillarBlocks.length > 0) {
    pillarsToRender = pillarBlocks.map((block, i) => {
      const style = cyclicStyles[i % cyclicStyles.length];
      return { ...style, title: block.title || 'Pilar', text: block.text || '' };
    });
  }

  return (
    <div className="min-h-screen theme-movimiento text-gray-200 font-sans overflow-hidden pt-32 pb-24 px-6 relative select-none">
      
      {/* Fondo de Estética Cuero Botánico Verde Esmeralda & Dorado GranColinos */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#D4AF37]/15 via-[#020502] to-black opacity-90 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-16">

        {/* Hero Section */}
        <section className="relative max-w-5xl mx-auto text-center z-10 fade-in space-y-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/15 text-[#D4AF37] text-xs font-mono font-extrabold tracking-[0.3em] uppercase shadow-md">
            <Sparkles size={14} /> MOVIMIENTO GRANCOLINOS <Cpu size={14} />
          </div>

          <h1 
            className="font-serif text-5xl md:text-8xl font-black text-white leading-tight drop-shadow-[0_4px_30px_rgba(212,175,55,0.3)] tracking-tight"
            dangerouslySetInnerHTML={{ __html: heroTitle }}
          />

          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto rounded-full shadow-[0_0_12px_rgba(212,175,55,0.8)]"></div>

          <p 
            className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto font-light leading-relaxed pt-2"
            dangerouslySetInnerHTML={{ __html: heroText }}
          />

          <div className="pt-4">
            <JoinMovementButton text={heroCta} />
          </div>
        </section>

        {/* Manifiesto Grid */}
        <section className="py-8 relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillarsToRender.map((pillar, index) => (
              <div 
                key={index} 
                className={`bg-[#051208]/85 p-10 rounded-3xl border border-white/10 backdrop-blur-xl transition-all duration-300 shadow-xl group ${pillar.borderHover} ${index === 1 ? 'mt-0 md:mt-8' : index === 2 ? 'mt-0 md:mt-16' : ''}`}
              >
                <div className={`w-16 h-16 ${pillar.bgClass} rounded-2xl flex items-center justify-center mb-8 ${pillar.colorClass} group-hover:scale-110 transition-transform shadow-lg border border-white/10`}>
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
        <section className="py-12 max-w-4xl mx-auto text-center relative z-10 bg-[#051208]/85 border border-[#D4AF37]/40 rounded-3xl p-8 md:p-12 backdrop-blur-xl shadow-2xl space-y-6">
          <Sun size={48} className="text-[#D4AF37] mx-auto opacity-90 drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]" />
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-white leading-snug">
            Colombia 2030: <br />
            <span className="text-gold-gradient font-black">Revolución Orgánica y Autonomía</span>
          </h2>
          <p className="text-gray-200 font-light leading-relaxed text-base md:text-lg max-w-2xl mx-auto">
            Visualizamos un país donde la medicina natural, la apitoxina y los extractos botánicos puros se combinan con la tecnología para garantizar salud, bienestar y soberanía comunitaria.
          </p>
        </section>

      </div>
    </div>
  );
}
