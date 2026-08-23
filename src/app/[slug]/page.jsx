import { notFound } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import { cache } from 'react';
import { adminDb } from '@/utils/firebase-admin';
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
  Check,
  Shield,
  Clock,
  TrendingUp,
  Activity,
  CreditCard,
  Lock,
  Globe
} from 'lucide-react';

export const dynamic = 'force-dynamic';

// Helper ultra-seguro y universal para renderizar precios (string, número u objeto { monthly, annual, amount, currency, period })
function formatPrice(price) {
  if (!price && price !== 0) return '';
  if (typeof price === 'number') {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(price);
  }
  if (typeof price === 'string') {
    if (price.startsWith('$')) return price;
    const num = Number(price);
    if (!isNaN(num) && price.trim() !== '') {
      return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(num);
    }
    return price;
  }
  if (typeof price === 'object') {
    const amt = price.amount !== undefined ? price.amount : (price.monthly !== undefined ? price.monthly : price.annual);
    if (amt !== undefined) {
      const formatted = typeof amt === 'number'
        ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: price.currency || 'COP', maximumFractionDigits: 0 }).format(amt)
        : String(amt);
      const period = price.period || (price.monthly !== undefined ? '/mes' : (price.annual !== undefined ? '/año' : ''));
      return `${formatted} ${period}`.trim();
    }
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
      .replace(/^(www\.)?grancolinos\.com\/?/i, '')
      .replace(/^\//, '')
      .replace(/\/$/, '');

    const cleanSlug = raw.toLowerCase().replace(/[^a-z0-9-_]/g, '-');
    const lookupKeys = Array.from(new Set([cleanSlug, raw, raw.toLowerCase(), cleanSlug.replace(/-/g, '_')]));

    // 1. Intento primario con adminDb (Server-Side sin restricciones)
    for (const key of lookupKeys) {
      try {
        const snap = await adminDb.collection('gca_projects').doc(`page_${key}`).get();
        if (snap.exists) return snap.data();
      } catch (_) {}
      try {
        const snap = await adminDb.collection('gc_universal_pages').doc(key).get();
        if (snap.exists) return snap.data();
      } catch (_) {}
      try {
        const snap = await adminDb.collection('gca_projects').doc(`domain_${key}`).get();
        if (snap.exists) return snap.data();
      } catch (_) {}
    }

    // 2. Fallback con db de cliente
    for (const key of lookupKeys) {
      try {
        const snap = await getDoc(doc(db, 'gca_projects', `page_${key}`));
        if (snap.exists()) return snap.data();
      } catch (_) {}
      try {
        const snap = await getDoc(doc(db, 'gc_universal_pages', key));
        if (snap.exists()) return snap.data();
      } catch (_) {}
    }

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

  // Si la página tiene el HTML standalone precompilado por Master Studio, servir con 100% de fidelidad visual
  if (page.generatedHtml && typeof page.generatedHtml === 'string' && page.generatedHtml.includes('<!DOCTYPE html>')) {
    return (
      <div 
        dangerouslySetInnerHTML={{ __html: page.generatedHtml }} 
      />
    );
  }

  const bgColor = page.theme?.globalBgColor || '#030712';
  const bgImg = page.theme?.globalBgImageUrl || page.theme?.backgroundImageUrl;
  const blocks = page.blocks || [];

  const topbarBlock = blocks.find(b => b.type === 'announcement_topbar' && b.isVisible !== false);
  const whatsappBlock = blocks.find(b => b.type === 'whatsapp_floating_cta' && b.isVisible !== false);
  const has3DContent = blocks.some(b => b.type === 'menu3d' && b.isVisible !== false);

  return (
    <main 
      className="min-h-screen text-white relative overflow-hidden flex flex-col font-sans selection:bg-amber-400 selection:text-black"
      style={{
        backgroundColor: bgColor,
        backgroundImage: bgImg ? `url('${bgImg}')` : undefined,
        backgroundSize: bgImg ? 'cover' : undefined,
        backgroundPosition: bgImg ? 'center' : undefined,
        backgroundAttachment: bgImg ? 'fixed' : undefined,
      }}
    >
      {/* Script Google Model-Viewer para visualización 3D / WebXR en vivo */}
      {has3DContent && (
        <Script 
          src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js" 
          type="module"
          strategy="lazyOnload"
        />
      )}

      {/* ── 0. TOPBAR ANUNCIOS ── */}
      {topbarBlock && (
        <div className="w-full bg-black/95 border-b border-amber-500/30 text-amber-400 py-2.5 px-4 text-center font-bold text-xs uppercase tracking-widest shadow-2xl sticky top-0 z-50 flex items-center justify-center gap-2 backdrop-blur-md">
          <span className="text-amber-500 text-[10px]">▲</span> {topbarBlock.content?.text || topbarBlock.content?.announcementText || topbarBlock.content?.title || 'NUEVO LANZAMIENTO'} <span className="text-amber-500 text-[10px]">▲</span>
        </div>
      )}

      {/* Contenido Modular de Bloques */}
      <div className="flex-1 space-y-20 pb-28">
        {blocks.filter(b => b.isVisible !== false && b.type !== 'announcement_topbar' && b.type !== 'whatsapp_floating_cta').map((block, idx) => {
          const blockBg = block.style?.bgColor || block.style?.backgroundColor;
          const blockImg = block.style?.bgImageUrl || block.style?.backgroundImage || block.content?.backgroundImageUrl;

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
                <div className="pt-20 pb-16 px-6 max-w-5xl mx-auto text-center space-y-6">
                  {(block.content?.badgeText || block.content?.badge) && (
                    <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/30 backdrop-blur-md shadow-lg">
                      <Sparkles size={13} /> {block.content.badgeText || block.content.badge}
                    </div>
                  )}
                  <h1 
                    className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight uppercase font-serif"
                    style={{
                      color: '#F59E0B',
                      background: 'linear-gradient(135deg, #FDE68A 0%, #F59E0B 50%, #D97706 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '0 0 45px rgba(245, 158, 11, 0.45)'
                    }}
                  >
                    {block.content?.headline || block.title}
                  </h1>
                  <p className="text-gray-200 text-sm md:text-base max-w-3xl mx-auto font-semibold uppercase tracking-wider leading-relaxed opacity-95">
                    {block.content?.subheadline || block.subtitle || block.description}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                    {block.content?.ctaPrimaryText && (
                      <a
                        href={block.content?.ctaPrimaryUrl || '#'}
                        className="px-8 py-4 rounded-full font-black text-xs uppercase tracking-wider text-black bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 shadow-2xl shadow-amber-500/25 transition-all hover:scale-105 active:scale-95"
                      >
                        {block.content.ctaPrimaryText} →
                      </a>
                    )}
                    {block.content?.ctaSecondaryText && (
                      <a
                        href={block.content?.ctaSecondaryUrl || '#'}
                        className="px-8 py-4 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-xl shadow-lg transition-all hover:scale-105 active:scale-95"
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
                    <h2 className="text-3xl md:text-5xl font-black">{block.title || block.content?.title || 'Menú Gastronómico 3D'}</h2>
                    <p className="text-sm text-gray-400 max-w-xl mx-auto">{block.subtitle || block.content?.subtitle || 'Explora nuestros platos en realidad aumentada y 360 grados'}</p>
                  </div>
                  
                  {/* Grid de Platos / Items */}
                  {Array.isArray(block.content?.items) && block.content.items.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {block.content.items.map((item, iIdx) => {
                        const model3d = item.modelUrl || item.model3dUrl;
                        return (
                          <div key={item.id || iIdx} className="rounded-3xl bg-white/[0.03] border border-white/10 overflow-hidden hover:border-amber-500/50 hover:bg-white/[0.05] transition-all space-y-4 shadow-2xl flex flex-col justify-between group">
                            {/* Render 3D Model o Imagen */}
                            <div className="relative h-60 w-full overflow-hidden bg-black/40 flex items-center justify-center">
                              {model3d ? (
                                <model-viewer
                                  src={model3d}
                                  poster={item.photoUrl || undefined}
                                  alt={item.name}
                                  auto-rotate
                                  camera-controls
                                  ar
                                  ar-modes="webxr scene-viewer quick-look"
                                  shadow-intensity="1.2"
                                  exposure="1.1"
                                  style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
                                />
                              ) : item.photoUrl ? (
                                <img src={item.photoUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              ) : (
                                <div className="text-gray-600 flex flex-col items-center">
                                  <Box size={32} />
                                  <span className="text-[10px] mt-1">Vista 3D</span>
                                </div>
                              )}
                              <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/70 backdrop-blur-md text-amber-400 border border-amber-500/30">
                                3D / AR
                              </span>
                            </div>

                            <div className="p-6 pt-2 space-y-3 flex-1 flex flex-col justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                  <h3 className="text-lg font-black text-white">{item.name}</h3>
                                  {(item.price || item.price === 0) && (
                                    <span className="text-sm font-black text-amber-400 shrink-0 font-mono">
                                      {formatPrice(item.price)}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-400 leading-relaxed">{item.description}</p>
                              </div>
                              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                                  Ver en Realidad Aumentada <ArrowRight size={14} />
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
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
                        <p className="text-xs text-gray-400">{block.content?.role || block.content?.specialty || 'Atención y Reservas 24/7'}</p>
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

              {/* ── 4. PLANES Y PRECIOS (PRICING TIERS) ── */}
              {block.type === 'pricing_tiers' && (
                <div className="max-w-6xl mx-auto px-6 py-12">
                  <div className="text-center mb-12 space-y-3">
                    <h2 className="text-3xl md:text-5xl font-black">{block.title || block.content?.sectionTitle || block.content?.title || 'Planes & Experiencias'}</h2>
                    <p className="text-sm text-gray-400 max-w-xl mx-auto">{block.subtitle || block.content?.subtitle || 'Elige la opción que mejor se adapte a tus necesidades'}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {(Array.isArray(block.content?.tiers) ? block.content.tiers : [
                      { name: 'Starter 3D', price: 120000, description: 'Entrada + Plato Fuerte 3D' },
                      { name: 'Pro Autonomous', price: 290000, description: 'Menú degustación 5 tiempos + Maridaje IA', isPopular: true },
                      { name: 'Black VIP', price: 550000, description: 'Experiencia exclusiva para grupos' }
                    ]).map((tier, tIdx) => (
                      <div key={tier.id || tIdx} className={`p-8 rounded-3xl border transition-all space-y-6 shadow-xl flex flex-col justify-between ${tier.isPopular || tier.isFeatured ? 'bg-amber-500/10 border-amber-500/60 shadow-amber-500/10 relative scale-105' : 'bg-white/[0.02] border-white/10'}`}>
                        {(tier.isPopular || tier.isFeatured) && (
                          <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full bg-amber-500 text-black shadow-lg">
                            ★ Más Popular
                          </span>
                        )}
                        <div className="space-y-4">
                          <h3 className="text-xl font-black">{tier.name}</h3>
                          <div className="text-3xl md:text-4xl font-black text-amber-400 font-mono">{formatPrice(tier.price)}</div>
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

              {/* ── 5. CARACTERÍSTICAS / SERVICIOS (FEATURES_SERVICES) ── */}
              {block.type === 'features_services' && (
                <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
                  <div className="text-center space-y-3">
                    <h2 className="text-3xl md:text-5xl font-black">{block.title || block.content?.sectionTitle || 'Nuestras Características & Servicios'}</h2>
                    {(block.subtitle || block.content?.sectionSubtitle) && (
                      <p className="text-sm text-gray-400 max-w-xl mx-auto">{block.subtitle || block.content?.sectionSubtitle}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {(Array.isArray(block.content?.features) ? block.content.features : [
                      { id: '1', title: 'Velocidad Ultrarrápida', description: 'Carga instantánea optimizada para máxima conversión.' },
                      { id: '2', title: 'Modelos 3D Inmersivos', description: 'Realidad Aumentada de última generación sin descargas.' },
                      { id: '3', title: 'Agente Autónomo 24/7', description: 'Atención inteligente que nunca duerme ni pierde un lead.' }
                    ]).map((feat, fIdx) => (
                      <div key={feat.id || fIdx} className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-amber-500/50 space-y-3 transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                          <Zap size={22} />
                        </div>
                        <h3 className="text-lg font-black text-white">{feat.title}</h3>
                        <p className="text-xs text-gray-400 leading-relaxed">{feat.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── 6. MÉTRICAS / KPIS (STATS_KPIS) ── */}
              {block.type === 'stats_kpis' && (
                <div className="max-w-6xl mx-auto px-6 py-10">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    {(Array.isArray(block.content?.stats) ? block.content.stats : [
                      { value: '+350%', label: 'Aumento en Conversiones' },
                      { value: '24/7', label: 'Disponibilidad IA' },
                      { value: '4.9★', label: 'Calificación en Google' },
                      { value: '<1s', label: 'Respuesta Inmediata' }
                    ]).map((stat, sIdx) => (
                      <div key={stat.id || sIdx} className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 space-y-1">
                        <div className="text-3xl md:text-4xl font-black text-amber-400 font-mono">{stat.value}{stat.suffix || ''}</div>
                        <div className="text-xs text-gray-300 font-medium">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── 7. SELLOS DE CONFIANZA (TRUST_BANNER) ── */}
              {block.type === 'trust_banner' && (
                <div className="max-w-6xl mx-auto px-6 py-8">
                  <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-wrap items-center justify-around gap-6 text-xs text-gray-300 font-bold">
                    <span className="flex items-center gap-2">
                      <ShieldCheck size={18} className="text-emerald-400 shrink-0" />
                      <span>{block.content?.seal1 || 'Pagos Seguros SSL 256-Bit'}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-cyan-400 shrink-0" />
                      <span>{block.content?.seal2 || 'Verificación Oficial GranColinos'}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <Star size={18} className="text-amber-400 shrink-0" />
                      <span>{block.content?.seal3 || 'Garantía de Satisfacción 100%'}</span>
                    </span>
                  </div>
                </div>
              )}

              {/* ── 8. BOTONES DE ACCIÓN (CTA_BUTTONS) ── */}
              {block.type === 'cta_buttons' && (
                <div className="max-w-4xl mx-auto px-6 py-12 text-center space-y-6">
                  <h2 className="text-3xl md:text-5xl font-black">{block.title || '¿Listo para transformar tu experiencia?'}</h2>
                  {block.subtitle && <p className="text-sm text-gray-400 max-w-xl mx-auto">{block.subtitle}</p>}
                  <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                    <a
                      href={block.content?.ctaPrimaryUrl || '#'}
                      className="px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider text-black bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 shadow-2xl transition-all hover:scale-105 active:scale-95"
                    >
                      {block.content?.ctaPrimaryText || 'Comenzar Ahora'}
                    </a>
                    {block.content?.ctaSecondaryText && (
                      <a
                        href={block.content?.ctaSecondaryUrl || '#'}
                        className="px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-wider text-white bg-white/10 hover:bg-white/20 border border-white/10 transition-all hover:scale-105"
                      >
                        {block.content.ctaSecondaryText}
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* ── 9. PREGUNTAS FRECUENTES (FAQ) ── */}
              {block.type === 'faq_accordion' && (
                <div className="max-w-3xl mx-auto px-6 py-12 space-y-4">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-4xl font-black">{block.title || block.content?.title || 'Preguntas Frecuentes'}</h2>
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

              {/* ── 10. RESEÑAS 5★ GOOGLE ── */}
              {block.type === 'google_reviews' && (
                <div className="max-w-5xl mx-auto px-6 py-12">
                  <div className="text-center mb-10 space-y-2">
                    <div className="flex items-center justify-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={18} fill="currentColor" />
                      ))}
                    </div>
                    <h2 className="text-2xl md:text-4xl font-black">{block.title || block.content?.title || 'Lo que dicen nuestros clientes'}</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(Array.isArray(block.content?.reviews) ? block.content.reviews : [
                      { name: 'Alejandro Restrepo', text: 'La experiencia interactiva y los modelos 3D son increíbles. 100% recomendado.', stars: 5 },
                      { name: 'Valentina Gómez', text: 'Excelente servicio. El agente IA nos recomendó el maridaje perfecto. 10/10.', stars: 5 }
                    ]).map((rev, rIdx) => (
                      <div key={rIdx} className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 space-y-3 shadow-lg">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm">{rev.name || rev.authorName || 'Cliente Verificado'}</span>
                          <span className="text-xs text-amber-400">★★★★★</span>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">"{rev.text || rev.comment}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── 11. CAPTURA DE LEADS ── */}
              {block.type === 'lead_capture' && (
                <div className="max-w-xl mx-auto px-6 py-12">
                  <div className="p-8 rounded-3xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/15 space-y-6 text-center shadow-2xl">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-black">{block.title || block.content?.headline || 'Únete a Nuestra Comunidad VIP'}</h2>
                      <p className="text-xs text-gray-400">{block.subtitle || block.content?.subheadline || 'Recibe beneficios exclusivos y lanzamientos anticipados.'}</p>
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
                        {block.content?.ctaText || block.content?.buttonText || 'Suscribirme Ahora'}
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
      {whatsappBlock && (
        <a
          href={`https://wa.me/${(whatsappBlock.content?.phoneNumber || '573001234567').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappBlock.content?.defaultMessage || 'Hola, deseo más información')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black shadow-2xl transition-transform hover:scale-110 flex items-center justify-center cursor-pointer"
          aria-label="Contactar por WhatsApp"
        >
          <Phone size={24} fill="currentColor" />
        </a>
      )}
    </main>
  );
}
