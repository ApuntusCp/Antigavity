import { notFound } from 'next/navigation';
import Link from 'next/link';
import { cache } from 'react';
import { db } from '@/utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { 
  Sparkles, 
  MessageSquare, 
  CheckCircle2, 
  Star, 
  ShieldCheck, 
  ArrowRight, 
  ExternalLink,
  ChevronDown,
  Box,
  Bot,
  Zap,
  Phone
} from 'lucide-react';

export const dynamic = 'force-dynamic';

// Usar cache() de React para que generateMetadata y el componente compartan la misma única petición en milisegundos
const getUniversalPage = cache(async (slug) => {
  if (!slug) return null;
  try {
    const raw = decodeURIComponent(slug)
      .trim()
      .replace(/^(https?:\/\/)+/gi, '')
      .replace(/^grancolinos\.com\/?/i, '')
      .replace(/^\//, '');

    const cleanSlug = raw.toLowerCase().replace(/[^a-z0-9-_]/g, '-');

    // 1. Intento directo por ID normalizado
    const docSnap = await getDoc(doc(db, 'gc_universal_pages', cleanSlug));
    if (docSnap.exists()) {
      return docSnap.data();
    }

    // 2. Si es diferente, intento por ID original
    if (raw !== cleanSlug) {
      const origSnap = await getDoc(doc(db, 'gc_universal_pages', raw));
      if (origSnap.exists()) {
        return origSnap.data();
      }
    }

    return null;
  } catch (error) {
    // Si no existe o hay error, retornar null de inmediato sin crashear el servidor
    return null;
  }
});

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = await getUniversalPage(slug);

  if (!page) {
    return {
      title: 'Página no encontrada | GranColinos',
    };
  }

  return {
    title: `${page.title || 'Página Universal'} | GranColinos`,
    description: page.description || 'Experiencia web interactiva con Carta 3D y Agente IA.',
    openGraph: {
      title: page.title,
      description: page.description,
    },
  };
}

export default async function DynamicUniversalPage({ params }) {
  const { slug } = await params;
  const page = await getUniversalPage(slug);

  // Si no existe la página en la base de datos, mostramos 404 estándar instantáneo
  if (!page) {
    notFound();
  }

  const bgColor = page.theme?.globalBgColor || '#030712';
  const accentColor = page.theme?.accentColor || '#D4AF37';
  const blocks = page.blocks || [];

  return (
    <main 
      className="min-h-screen text-white relative overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      {/* Contenido Modular de Bloques */}
      <div className="space-y-16 pb-24">
        {blocks.filter(b => b.isVisible !== false).map((block, idx) => {
          return (
            <section key={block.id || idx} className="relative z-10">
              
              {/* ── 1. HERO PRINCIPAL ── */}
              {block.type === 'hero' && (
                <div className="pt-24 pb-16 px-6 max-w-5xl mx-auto text-center space-y-6">
                  {block.content?.badge && (
                    <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      <Sparkles size={13} /> {block.content.badge}
                    </div>
                  )}
                  <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                    {block.content?.headline || block.title}
                  </h1>
                  <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
                    {block.content?.subheadline || block.description}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                    {block.content?.ctaPrimaryText && (
                      <a
                        href={block.content?.ctaPrimaryUrl || '#'}
                        className="px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider text-black bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 shadow-xl transition-all"
                      >
                        {block.content.ctaPrimaryText}
                      </a>
                    )}
                    {block.content?.ctaSecondaryText && (
                      <a
                        href={block.content?.ctaSecondaryUrl || '#'}
                        className="px-8 py-3.5 rounded-2xl font-bold text-sm text-white bg-white/10 hover:bg-white/15 border border-white/10 transition-all"
                      >
                        {block.content.ctaSecondaryText}
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* ── 2. CARTA Y MENÚ 3D ── */}
              {block.type === 'menu3d' && (
                <div className="max-w-6xl mx-auto px-6 py-12">
                  <div className="text-center mb-10 space-y-2">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Experiencia Inmersiva</span>
                    <h2 className="text-3xl font-black">{block.content?.title || 'Menú Gastronómico 3D'}</h2>
                    <p className="text-xs text-gray-400">{block.content?.subtitle || 'Explora nuestros platos en realidad aumentada'}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {(block.content?.categories || ['Platos Fuertes', 'Bebidas', 'Postres']).map((cat, cIdx) => (
                      <div key={cIdx} className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-amber-500/40 transition-all space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                          <Box size={22} />
                        </div>
                        <h3 className="text-lg font-black">{cat}</h3>
                        <p className="text-xs text-gray-400 leading-relaxed">Modelos 3D de alta definición listos para interactuar en Realidad Aumentada.</p>
                        <div className="pt-2">
                          <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                            Ver Platos <ArrowRight size={13} />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── 3. SIMULADOR DE AGENTE IA ── */}
              {block.type === 'ai_agent_simulator' && (
                <div className="max-w-4xl mx-auto px-6 py-12">
                  <div className="p-8 rounded-3xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/10 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                        <Bot size={20} />
                      </div>
                      <div>
                        <h3 className="text-base font-black">{block.content?.agentName || 'Agente de Asistencia Virtual'}</h3>
                        <p className="text-xs text-emerald-400">🟢 En línea • Tiempo de respuesta: Inmediato</p>
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3 text-xs">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-gray-200">
                        {block.content?.welcomeMessage || '¡Hola! ¿En qué puedo ayudarte hoy? Conozco todo sobre nuestro menú y servicios.'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── 4. PLANES Y PRECIOS ── */}
              {block.type === 'pricing_tiers' && (
                <div className="max-w-6xl mx-auto px-6 py-12">
                  <div className="text-center mb-10 space-y-2">
                    <h2 className="text-3xl font-black">{block.content?.title || 'Planes & Tarifas'}</h2>
                    <p className="text-xs text-gray-400">{block.content?.subtitle || 'Elige la opción que mejor se adapte a tus necesidades'}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {(block.content?.tiers || [
                      { name: 'Básico', price: '$29.000', desc: 'Ideal para comenzar' },
                      { name: 'Pro Premium', price: '$59.000', desc: 'El más popular', isFeatured: true },
                      { name: 'Empresarial', price: '$99.000', desc: 'Todo incluido' }
                    ]).map((tier, tIdx) => (
                      <div key={tIdx} className={`p-6 rounded-3xl border transition-all space-y-4 ${tier.isFeatured ? 'bg-amber-500/10 border-amber-500/50 shadow-2xl' : 'bg-white/[0.02] border-white/10'}`}>
                        {tier.isFeatured && (
                          <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500 text-black">Destacado</span>
                        )}
                        <h3 className="text-lg font-black">{tier.name}</h3>
                        <div className="text-3xl font-black text-amber-400">{tier.price}</div>
                        <p className="text-xs text-gray-400">{tier.desc}</p>
                        <button className="w-full py-2.5 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/20 text-white transition-all">
                          Seleccionar Plan
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── 5. PREGUNTAS FRECUENTES (FAQ) ── */}
              {block.type === 'faq_accordion' && (
                <div className="max-w-3xl mx-auto px-6 py-12 space-y-4">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-black">{block.content?.title || 'Preguntas Frecuentes'}</h2>
                  </div>
                  {(block.content?.faqs || [
                    { q: '¿Cómo puedo hacer un pedido?', a: 'Puedes realizar tu pedido directamente desde el menú 3D o vía WhatsApp.' },
                    { q: '¿Qué métodos de pago aceptan?', a: 'Aceptamos transferencias bancarias, tarjetas de crédito, débito y PSE.' },
                    { q: '¿Tienen cobertura a nivel nacional?', a: 'Sí, despachamos a las principales ciudades del país.' }
                  ]).map((faq, fIdx) => (
                    <details key={fIdx} className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 group cursor-pointer">
                      <summary className="font-bold text-sm text-gray-200 flex items-center justify-between">
                        {faq.q}
                        <ChevronDown size={16} className="text-gray-400 group-open:rotate-180 transition-transform" />
                      </summary>
                      <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-white/5 leading-relaxed">
                        {faq.a}
                      </p>
                    </details>
                  ))}
                </div>
              )}

              {/* ── 6. RESEÑAS 5★ GOOGLE ── */}
              {block.type === 'google_reviews' && (
                <div className="max-w-5xl mx-auto px-6 py-12">
                  <div className="text-center mb-8 space-y-2">
                    <div className="flex items-center justify-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill="currentColor" />
                      ))}
                    </div>
                    <h2 className="text-2xl font-black">{block.content?.title || 'Lo que dicen nuestros clientes'}</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(block.content?.reviews || [
                      { name: 'Carlos M.', text: 'Excelente servicio y calidad inigualable. 100% recomendado.', stars: 5 },
                      { name: 'Diana R.', text: 'La experiencia interactiva y los productos superaron mis expectativas.', stars: 5 }
                    ]).map((rev, rIdx) => (
                      <div key={rIdx} className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm">{rev.name}</span>
                          <span className="text-xs text-amber-400">★★★★★</span>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">"{rev.text}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </section>
          );
        })}
      </div>

      {/* Botón Flotante de WhatsApp */}
      <a
        href="https://wa.me/573000000000"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black shadow-2xl transition-transform hover:scale-110 flex items-center justify-center"
        aria-label="Contactar por WhatsApp"
      >
        <Phone size={22} fill="currentColor" />
      </a>
    </main>
  );
}
