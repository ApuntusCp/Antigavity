// ── GranColinos Web: Universal Page Dynamic Renderer ─────────────────────────
// Renderizador en vivo para páginas, cartas 3D y agentes creados desde GC Admin

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/utils/firebase';
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

async function getUniversalPage(slug) {
  try {
    const raw = decodeURIComponent(slug).trim().replace(/^(https?:\/\/)+/gi, '').replace(/^grancolinos\.com\/?/i, '').replace(/^\//, '');
    const cleanSlug = raw.toLowerCase().replace(/[^a-z0-9-_]/g, '-');

    // 1. Direct ID matches
    for (const testId of [raw, cleanSlug, raw.toLowerCase()]) {
      const docSnap = await getDoc(doc(db, 'gc_universal_pages', testId));
      if (docSnap.exists()) return docSnap.data();
    }

    // 2. Query by 'slug'
    for (const testSlug of [raw, cleanSlug, raw.toLowerCase()]) {
      const q = query(collection(db, 'gc_universal_pages'), where('slug', '==', testSlug));
      const qSnap = await getDocs(q);
      if (!qSnap.empty) return qSnap.docs[0].data();
    }

    return null;
  } catch (error) {
    console.error(`[UniversalPage] Error obteniendo página ${slug}:`, error);
    return null;
  }
}

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

  // Si no existe la página en la base de datos, mostramos 404 estándar
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
                  {block.content?.subheadline && (
                    <p className="text-base md:text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
                      {block.content.subheadline}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                    {block.content?.ctaPrimaryText && (
                      <a
                        href={block.content?.ctaPrimaryUrl || '#contacto'}
                        className="px-8 py-3.5 rounded-2xl font-black text-sm text-black transition-all hover:scale-105 shadow-xl flex items-center gap-2"
                        style={{ backgroundColor: accentColor }}
                      >
                        {block.content.ctaPrimaryText} <ArrowRight size={16} />
                      </a>
                    )}
                    {block.content?.ctaSecondaryText && (
                      <a
                        href={block.content?.ctaSecondaryUrl || '#servicios'}
                        className="px-8 py-3.5 rounded-2xl font-bold text-sm text-white bg-white/5 border border-white/15 hover:bg-white/10 transition-all flex items-center gap-2"
                      >
                        {block.content.ctaSecondaryText}
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* ── 2. MENÚ GASTRONÓMICO & PLATOS 3D ── */}
              {block.type === 'menu3d' && (
                <div className="py-12 px-6 max-w-6xl mx-auto space-y-8">
                  <div className="text-center space-y-2">
                    <h2 className="text-3xl font-black">{block.title || 'Carta Digital 3D & Hologramas AR'}</h2>
                    {block.subtitle && <p className="text-gray-400 text-sm max-w-xl mx-auto">{block.subtitle}</p>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {(block.content?.dishes || [
                      { id: '1', name: 'Plato Insignia Gourmet', price: 45000, description: 'Experiencia gastronómica inmersiva con ingredientes de origen.', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80' },
                      { id: '2', name: 'Especialidad del Chef', price: 52000, description: 'Cocción lenta a las brasas con notas aromáticas botánicas.', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80' },
                      { id: '3', name: 'Postre de Autor Gran Colinos', price: 28000, description: 'Mousse artesanal de chocolate amargo y frutos silvestres.', image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&auto=format&fit=crop&q=80' }
                    ]).map((dish, i) => (
                      <div key={dish.id || i} className="group rounded-3xl bg-white/[0.03] border border-white/10 overflow-hidden hover:border-amber-400/50 transition-all">
                        <div className="h-48 bg-black/60 relative overflow-hidden flex items-center justify-center">
                          {dish.image ? (
                            <img src={dish.image} alt={dish.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <Box size={40} className="text-gray-600" />
                          )}
                          <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-xs font-bold text-amber-400">
                            ${Number(dish.price || 0).toLocaleString()} COP
                          </span>
                        </div>
                        <div className="p-6 space-y-2">
                          <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">{dish.name}</h3>
                          <p className="text-xs text-gray-400 leading-relaxed">{dish.description}</p>
                          <button 
                            className="w-full mt-4 py-2.5 rounded-xl font-bold text-xs text-black transition-all flex items-center justify-center gap-1.5"
                            style={{ backgroundColor: accentColor }}
                          >
                            <Box size={14} /> Ver en 3D / Realidad Aumentada
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── 3. SIMULADOR DE AGENTE IA ── */}
              {block.type === 'ai_agent_simulator' && (
                <div className="py-12 px-6 max-w-4xl mx-auto">
                  <div className="rounded-3xl bg-[#090e1a] border border-cyan-500/30 p-6 md:p-8 shadow-2xl space-y-6">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/40">
                          <Bot size={22} />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white flex items-center gap-2">
                            {block.content?.agentName || 'Asistente IA Autónomo'}
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          </h3>
                          <p className="text-xs text-cyan-300">En línea 24/7 • Respuestas instantáneas</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 max-w-lg text-xs text-gray-200">
                        {block.content?.welcomeMessage || '¡Hola! Soy el asistente inteligente de esta página. ¿En qué te puedo ayudar hoy?'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input 
                        type="text" 
                        placeholder="Escribe tu mensaje o pregunta aquí..." 
                        className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white outline-none focus:border-cyan-400"
                      />
                      <button className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs transition-all">
                        Enviar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ── 4. CARACTERÍSTICAS & SERVICIOS ── */}
              {block.type === 'features_services' && (
                <div className="py-12 px-6 max-w-5xl mx-auto space-y-8">
                  <div className="text-center space-y-2">
                    <h2 className="text-3xl font-black">{block.title || 'Propuesta de Valor & Servicios'}</h2>
                    {block.subtitle && <p className="text-gray-400 text-sm">{block.subtitle}</p>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {(block.content?.features || [
                      { id: '1', title: 'Velocidad Ultrarrápida', description: 'Carga instantánea optimizada para máxima conversión y retención.' },
                      { id: '2', title: 'Modelos 3D Inmersivos', description: 'Tecnología WebXR de última generación sin instalar aplicaciones.' },
                      { id: '3', title: 'Agente Autónomo 24/7', description: 'Atención inteligente que califica clientes y agenda citas de inmediato.' }
                    ]).map((f, i) => (
                      <div key={f.id || i} className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 space-y-3 hover:border-amber-400/40 transition-all">
                        <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
                          ✓
                        </div>
                        <h3 className="font-bold text-base text-white">{f.title}</h3>
                        <p className="text-xs text-gray-400 leading-relaxed">{f.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── 5. PREGUNTAS FRECUENTES (FAQ ACCORDION) ── */}
              {block.type === 'faq_accordion' && (
                <div className="py-12 px-6 max-w-3xl mx-auto space-y-4">
                  <h2 className="text-3xl font-black text-center mb-8">{block.title || 'Preguntas Frecuentes'}</h2>
                  <div className="space-y-3">
                    {(block.content?.items || [
                      { id: '1', question: '¿Cómo funciona la Carta 3D y el Agente IA?', answer: 'Tus clientes pueden ver tus productos en 3D en su móvil e interactuar con el asistente las 24 horas del día sin descargas.' },
                      { id: '2', question: '¿Es compatible con todos los dispositivos?', answer: 'Sí, 100% compatible con iPhone, Android, tablets y computadores de escritorio.' }
                    ]).map((item, i) => (
                      <details key={item.id || i} className="group p-5 rounded-2xl bg-white/[0.03] border border-white/10 open:bg-white/[0.06] select-none" open>
                        <summary className="font-bold text-sm text-white cursor-pointer flex items-center justify-between list-none">
                          <span>{item.question}</span>
                          <ChevronDown size={16} className="text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" />
                        </summary>
                        <p className="text-xs text-gray-300 mt-3 leading-relaxed pt-3 border-t border-white/5">
                          {item.answer}
                        </p>
                      </details>
                    ))}
                  </div>
                </div>
              )}

              {/* ── 6. RESEÑAS GOOGLE 5★ ── */}
              {block.type === 'google_reviews' && (
                <div className="py-12 px-6 max-w-4xl mx-auto text-center space-y-6">
                  <div className="inline-flex items-center gap-1.5 text-amber-400 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20 text-xs font-bold">
                    {'★'.repeat(5)} <span className="text-white ml-2">4.9 / 5.0 en Google Reviews</span>
                  </div>
                  <h2 className="text-3xl font-black">{block.title || 'Lo que dicen nuestros clientes'}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    {(block.content?.reviews || [
                      { id: '1', authorName: 'Carlos Gómez', text: 'La mejor experiencia tecnológica, el menú 3D dejó maravillados a nuestros clientes.' },
                      { id: '2', authorName: 'Mariana Restrepo', text: 'El agente responde de inmediato y nos triplicó las reservas en menos de un mes.' }
                    ]).map((rev, i) => (
                      <div key={rev.id || i} className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                        <div className="font-bold text-xs text-white">{rev.authorName}</div>
                        <div className="text-amber-400 text-xs">★★★★★</div>
                        <p className="text-xs text-gray-300 leading-relaxed">{rev.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── 7. SELLOS DE CONFIANZA ── */}
              {block.type === 'trust_banner' && (
                <div className="py-8 px-6 max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-8 text-xs text-gray-400 font-bold border-y border-white/5">
                  <span className="flex items-center gap-1.5 text-emerald-400"><ShieldCheck size={16} /> Certificado INVIMA</span>
                  <span className="flex items-center gap-1.5 text-cyan-400"><ShieldCheck size={16} /> SSL 256-Bit Seguro</span>
                  <span className="flex items-center gap-1.5 text-amber-400"><ShieldCheck size={16} /> 100% Calidad Garantizada</span>
                </div>
              )}

              {/* ── 8. WHATSAPP CTA FLOTANTE ── */}
              {block.type === 'whatsapp_floating_cta' && (
                <div className="fixed bottom-6 right-6 z-50 animate-bounce">
                  <a
                    href="https://wa.me/573000000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs shadow-2xl shadow-emerald-500/50 transition-all hover:scale-105"
                  >
                    <MessageSquare size={16} />
                    <span>WhatsApp Directo</span>
                  </a>
                </div>
              )}

            </section>
          );
        })}
      </div>
    </main>
  );
}
