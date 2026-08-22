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
  Phone,
  Send,
  Award,
  Layers,
  Check
} from 'lucide-react';

export const dynamic = 'force-dynamic';

// Helper ultra-seguro para renderizar precios (string, número u objeto { amount, currency, period })
function formatPrice(price) {
  if (!price) return '';
  if (typeof price === 'string' || typeof price === 'number') return String(price);
  if (typeof price === 'object') {
    const amt = price.amount;
    const formatted = typeof amt === 'number'
      ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: price.currency || 'COP', maximumFractionDigits: 0 }).format(amt)
      : (amt || '');
    return `${formatted} ${price.period || ''}`.trim();
  }
  return '';
}

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

    // 1. Intento en colección gca_projects (autorizada con permisos de lectura/escritura)
    try {
      const gcaSnap = await getDoc(doc(db, 'gca_projects', `page_${cleanSlug}`));
      if (gcaSnap.exists()) return gcaSnap.data();

      if (raw !== cleanSlug) {
        const gcaOrigSnap = await getDoc(doc(db, 'gca_projects', `page_${raw}`));
        if (gcaOrigSnap.exists()) return gcaOrigSnap.data();
      }
    } catch (_) {}

    // 2. Intento directo en gc_universal_pages
    try {
      const docSnap = await getDoc(doc(db, 'gc_universal_pages', cleanSlug));
      if (docSnap.exists()) return docSnap.data();

      if (raw !== cleanSlug) {
        const origSnap = await getDoc(doc(db, 'gc_universal_pages', raw));
        if (origSnap.exists()) return origSnap.data();
      }
    } catch (_) {}

    return null;
  } catch (error) {
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

  if (!page) {
    notFound();
  }

  const bgColor = page.theme?.globalBgColor || '#030712';
  const blocks = page.blocks || [];

  const topbarBlock = blocks.find(b => b.type === 'announcement_topbar' && b.isVisible !== false);
  const whatsappBlock = blocks.find(b => b.type === 'whatsapp_floating_cta' && b.isVisible !== false);

  return (
    <main 
      className="min-h-screen text-white relative overflow-hidden flex flex-col font-sans"
      style={{ backgroundColor: bgColor }}
    >
      {/* ── 0. TOPBAR ANUNCIOS ── */}
      {topbarBlock && (
        <div className="w-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-black py-2.5 px-4 text-center font-black text-xs uppercase tracking-widest shadow-lg sticky top-0 z-50">
          {topbarBlock.content?.text || topbarBlock.content?.announcementText || topbarBlock.content?.title || '✨ NUEVA EXPERIENCIA DIGITAL INTERACTIVA DISPONIBLE'}
        </div>
      )}

      {/* Contenido Modular de Bloques */}
      <div className="flex-1 space-y-20 pb-28">
        {blocks.filter(b => b.isVisible !== false && b.type !== 'announcement_topbar' && b.type !== 'whatsapp_floating_cta').map((block, idx) => {
          const blockBg = block.style?.backgroundColor;
          const blockImg = block.style?.backgroundImage || block.content?.backgroundImageUrl;

          return (
            <section 
              key={block.id || idx} 
              className="relative z-10"
              style={{
                backgroundColor: blockBg || undefined,
                backgroundImage: blockImg ? `url(${blockImg})` : undefined,
                backgroundSize: blockImg ? 'cover' : undefined,
                backgroundPosition: blockImg ? 'center' : undefined,
              }}
            >
              
              {/* ── 1. HERO PRINCIPAL ── */}
              {block.type === 'hero' && (
                <div className="pt-24 pb-16 px-6 max-w-5xl mx-auto text-center space-y-6">
                  {(block.content?.badgeText || block.content?.badge) && (
                    <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      <Sparkles size={13} /> {block.content.badgeText || block.content.badge}
                    </div>
                  )}
                  <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-tight uppercase font-serif">
                    {block.content?.headline || block.title}
                  </h1>
                  <p className="text-gray-300 text-base md:text-xl max-w-3xl mx-auto font-medium leading-relaxed">
                    {block.content?.subheadline || block.description}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
                    {block.content?.ctaPrimaryText && (
                      <a
                        href={block.content?.ctaPrimaryUrl || '#'}
                        className="px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider text-black bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 shadow-2xl transition-all hover:scale-105 active:scale-95"
                      >
                        {block.content.ctaPrimaryText}
                      </a>
                    )}
                    {block.content?.ctaSecondaryText && (
                      <a
                        href={block.content?.ctaSecondaryUrl || '#'}
                        className="px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-wider text-white bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md transition-all hover:scale-105 active:scale-95"
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
                  <div className="text-center mb-12 space-y-3">
                    <span className="text-xs font-black text-amber-400 uppercase tracking-widest">Experiencia Inmersiva</span>
                    <h2 className="text-3xl md:text-5xl font-black">{block.content?.title || 'Menú Gastronómico 3D'}</h2>
                    <p className="text-sm text-gray-400 max-w-xl mx-auto">{block.content?.subtitle || 'Explora nuestros platos en realidad aumentada y 360 grados'}</p>
                  </div>
                  
                  {/* Grid de Platos / Items */}
                  {Array.isArray(block.content?.items) && block.content.items.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {block.content.items.map((item, iIdx) => (
                        <div key={item.id || iIdx} className="rounded-3xl bg-white/[0.03] border border-white/10 overflow-hidden hover:border-amber-500/50 hover:bg-white/[0.05] transition-all space-y-4 shadow-2xl flex flex-col justify-between">
                          {item.photoUrl && (
                            <div className="relative h-48 w-full overflow-hidden bg-black/40">
                              <img src={item.photoUrl} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                              <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/70 backdrop-blur-md text-amber-400 border border-amber-500/30">
                                3D / AR
                              </span>
                            </div>
                          )}
                          <div className="p-6 pt-2 space-y-3 flex-1 flex flex-col justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <h3 className="text-lg font-black text-white">{item.name}</h3>
                                {item.price && (
                                  <span className="text-sm font-black text-amber-400 shrink-0">
                                    {typeof item.price === 'number' ? `$${item.price.toLocaleString('es-CO')}` : formatPrice(item.price)}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-400 leading-relaxed">{item.description}</p>
                            </div>
                            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                                Ver en Realidad Aumentada <ArrowRight size={14} />
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {(Array.isArray(block.content?.categories) ? block.content.categories : ['Platos Fuertes', 'Mixología & Bebidas', 'Postres']).map((cat, cIdx) => (
                        <div key={cIdx} className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-amber-500/50 hover:bg-white/[0.05] transition-all space-y-4 shadow-xl">
                          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                            <Box size={26} />
                          </div>
                          <h3 className="text-xl font-black">{cat}</h3>
                          <p className="text-xs text-gray-400 leading-relaxed">Modelos 3D de alta definición listos para interactuar en Realidad Aumentada sobre tu mesa.</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── 3. SIMULADOR DE AGENTE IA ── */}
              {block.type === 'ai_agent_simulator' && (
                <div className="max-w-4xl mx-auto px-6 py-12">
                  <div className="p-8 md:p-10 rounded-3xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/15 space-y-6 shadow-2xl backdrop-blur-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shadow-lg shadow-emerald-500/10">
                        <Bot size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-black">{block.content?.name || block.content?.agentName || 'Asistente IA Autónomo'}</h3>
                        <p className="text-xs text-gray-400">{block.content?.role || 'Atención y Reservas 24/7'}</p>
                        <p className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 mt-0.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> En línea • Respuestas en tiempo real
                        </p>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-black/60 border border-white/5 space-y-4">
                      <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-gray-200 text-sm leading-relaxed">
                        {block.content?.greeting || block.content?.welcomeMessage || '¡Hola! Soy tu asistente inteligente. Puedo resolver dudas, ayudarte con reservas y sugerir recomendaciones.'}
                      </div>

                      {Array.isArray(block.content?.capabilities) && block.content.capabilities.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
                          {block.content.capabilities.map((cap, capIdx) => (
                            <div key={capIdx} className="flex items-center gap-2 text-xs text-gray-300 bg-white/[0.03] p-2 rounded-lg border border-white/5">
                              <Check size={13} className="text-emerald-400 shrink-0" />
                              <span>{cap}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ── 4. PLANES Y PRECIOS ── */}
              {block.type === 'pricing_tiers' && (
                <div className="max-w-6xl mx-auto px-6 py-12">
                  <div className="text-center mb-12 space-y-3">
                    <h2 className="text-3xl md:text-5xl font-black">{block.content?.sectionTitle || block.content?.title || 'Planes & Experiencias'}</h2>
                    <p className="text-sm text-gray-400 max-w-xl mx-auto">{block.content?.subtitle || 'Elige la opción que mejor se adapte a tus necesidades'}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {(Array.isArray(block.content?.tiers) ? block.content.tiers : [
                      { name: 'Starter 3D', price: '$85.000', description: 'Entrada + Plato Fuerte 3D' },
                      { name: 'Pro Autonomous', price: '$160.000', description: 'Menú degustación 5 tiempos + Maridaje IA', isPopular: true },
                      { name: 'Black VIP', price: '$350.000', description: 'Experiencia exclusiva para grupos' }
                    ]).map((tier, tIdx) => (
                      <div key={tier.id || tIdx} className={`p-8 rounded-3xl border transition-all space-y-6 shadow-xl flex flex-col justify-between ${tier.isPopular || tier.isFeatured ? 'bg-amber-500/10 border-amber-500/60 shadow-amber-500/10 relative scale-105' : 'bg-white/[0.02] border-white/10'}`}>
                        {(tier.isPopular || tier.isFeatured) && (
                          <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full bg-amber-500 text-black shadow-lg">
                            ★ Más Popular
                          </span>
                        )}
                        <div className="space-y-4">
                          <h3 className="text-xl font-black">{tier.name}</h3>
                          <div className="text-4xl font-black text-amber-400">{formatPrice(tier.price)}</div>
                          <p className="text-xs text-gray-400 leading-relaxed">{tier.description || tier.desc}</p>
                          {Array.isArray(tier.features) && tier.features.length > 0 && (
                            <ul className="space-y-2 pt-2">
                              {tier.features.map((feat, fIdx) => (
                                <li key={fIdx} className="text-xs text-gray-300 flex items-center gap-2">
                                  <Check size={13} className="text-amber-400 shrink-0" />
                                  <span>{feat}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <button className={`w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${tier.isPopular || tier.isFeatured ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg hover:brightness-110' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
                          {tier.ctaText || 'Seleccionar Plan'}
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
                    <h2 className="text-2xl md:text-4xl font-black">{block.content?.title || 'Preguntas Frecuentes'}</h2>
                  </div>
                  {(Array.isArray(block.content?.items) ? block.content.items : (Array.isArray(block.content?.faqs) ? block.content.faqs : [
                    { question: '¿Cómo funciona la visualización 3D y Realidad Aumentada?', answer: 'Puedes rotar, hacer zoom y proyectar cualquier plato sobre tu mesa usando la cámara de tu celular sin instalar aplicaciones.' },
                    { question: '¿Se requiere reserva previa?', answer: 'Sí, recomendamos reservar con 24 horas de antelación a través de nuestro Asistente IA o botón de WhatsApp.' },
                    { question: '¿Qué métodos de pago aceptan?', answer: 'Aceptamos transferencias bancarias, tarjetas de crédito, débito, Bold y PSE.' }
                  ])).map((faq, fIdx) => (
                    <details key={faq.id || fIdx} className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 group cursor-pointer hover:border-white/20 transition-all">
                      <summary className="font-bold text-sm text-gray-200 flex items-center justify-between">
                        {faq.question || faq.q}
                        <ChevronDown size={18} className="text-gray-400 group-open:rotate-180 transition-transform" />
                      </summary>
                      <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-white/5 leading-relaxed">
                        {faq.answer || faq.a}
                      </p>
                    </details>
                  ))}
                </div>
              )}

              {/* ── 6. RESEÑAS 5★ GOOGLE ── */}
              {block.type === 'google_reviews' && (
                <div className="max-w-5xl mx-auto px-6 py-12">
                  <div className="text-center mb-10 space-y-2">
                    <div className="flex items-center justify-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={18} fill="currentColor" />
                      ))}
                    </div>
                    <h2 className="text-2xl md:text-4xl font-black">{block.content?.title || 'Lo que dicen nuestros clientes'}</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(Array.isArray(block.content?.reviews) ? block.content.reviews : [
                      { name: 'Alejandro Restrepo', text: 'La experiencia interactiva y los modelos 3D son increíbles. 100% recomendado.', stars: 5 },
                      { name: 'Valentina Gómez', text: 'Excelente servicio. El agente IA nos recomendó el maridaje perfecto. 10/10.', stars: 5 }
                    ]).map((rev, rIdx) => (
                      <div key={rIdx} className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 space-y-3 shadow-lg">
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

              {/* ── 7. CAPTURA DE LEADS ── */}
              {block.type === 'lead_capture' && (
                <div className="max-w-xl mx-auto px-6 py-12">
                  <div className="p-8 rounded-3xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/15 space-y-6 text-center shadow-2xl">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-black">{block.content?.headline || 'Únete a Nuestra Comunidad VIP'}</h2>
                      <p className="text-xs text-gray-400">{block.content?.subheadline || 'Recibe beneficios exclusivos y lanzamientos anticipados.'}</p>
                    </div>
                    <form className="space-y-3">
                      <input 
                        type="email" 
                        placeholder="tu-correo@ejemplo.com" 
                        className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-gray-500 focus:outline-none focus:border-amber-500 text-center"
                      />
                      <button 
                        type="button"
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black text-xs uppercase tracking-wider hover:brightness-110 shadow-lg cursor-pointer"
                      >
                        {block.content?.buttonText || 'Suscribirme Ahora'}
                      </button>
                    </form>
                  </div>
                </div>
              )}

            </section>
          );
        })}
      </div>

      {/* Botón Flotante de WhatsApp */}
      <a
        href={`https://wa.me/${(whatsappBlock?.content?.phoneNumber || '573001234567').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappBlock?.content?.defaultMessage || 'Hola, deseo más información')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black shadow-2xl transition-transform hover:scale-110 flex items-center justify-center cursor-pointer"
        aria-label="Contactar por WhatsApp"
      >
        <Phone size={24} fill="currentColor" />
      </a>
    </main>
  );
}
