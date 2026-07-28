import Image from "next/image";
import Link from "next/link";
import { fetchProducts, fetchHomeCMSConfig, fetchClientTestimonials } from "../utils/firebase";
import NewsletterForm from "../components/NewsletterForm";
import HeroSection from "../components/HeroSection";
import FadeInWhenVisible from "../components/FadeInWhenVisible";
import PaymentMethodsBadge from "../components/PaymentMethodsBadge";
import ShopAddToCartButton from "../components/ShopAddToCartButton";

export const revalidate = 30; // ISR: check for new CMS publishes every 30 seconds

export default async function Home() {
  // ── try-catch garantiza que un fallo de Firebase no crashee la página entera
  let products = [], cmsConfig = null, clientTestimonials = [];
  try {
    [products, cmsConfig, clientTestimonials] = await Promise.all([
      fetchProducts(),
      fetchHomeCMSConfig(),
      fetchClientTestimonials(),
    ]);
  } catch (error) {
    console.error('[Home] Error cargando datos de Firebase:', error);
    // La página renderiza con arrays vacíos como fallback
  }

  // Extraer configuración de testimonios del CMS
  let testimonialsData = [
    { name: "Carolina M.", role: "Miembro Oro", text: "La pureza de estos extractos ha cambiado mi rutina. Sentir que consumo algo 100% orgánico y colombiano no tiene precio." },
    { name: "Dr. Alejandro V.", role: "Miembro Plata", text: "Recomiendo Gran Colinos por su compromiso con la calidad. Es raro encontrar marcas con esta dedicación a la formulación botánica." },
    { name: "Sofía T.", role: "Miembro Bronce", text: "Desde el empaque hasta la última gota, todo grita exclusividad. Son más que productos, es un estilo de vida consciente." }
  ];
  let testimonialsTitle = "Voces del Club";

  if (clientTestimonials && clientTestimonials.length > 0) {
    testimonialsData = clientTestimonials;
  } else if (cmsConfig?.blocks && Array.isArray(cmsConfig.blocks)) {
    const testBlock = cmsConfig.blocks.find(b => b.type === 'testimonials');
    if (testBlock?.content) {
      if (testBlock.content.title) testimonialsTitle = testBlock.content.title;
      if (Array.isArray(testBlock.content.items) && testBlock.content.items.length > 0) {
        testimonialsData = testBlock.content.items;
      }
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      
      {/* Animated Hero Section with Variant Selector */}
      <HeroSection cmsConfig={cmsConfig} products={products} />

      {/* Philosophy / Space Section */}
      <section id="origen" className="py-28 md:py-36 bg-transparent px-6 relative overflow-hidden group">
        {/* Decorative elements for premium feel */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-[#D4AF37]/10 blur-[140px] pointer-events-none transition-all duration-1000 group-hover:bg-[#D4AF37]/20 group-hover:scale-110" />
        
        <FadeInWhenVisible className="max-w-4xl mx-auto text-center relative z-10 bg-black/25 backdrop-blur-xl border border-[#D4AF37]/25 p-10 md:p-16 rounded-3xl shadow-2xl transition-all duration-500 hover:shadow-[#D4AF37]/15 hover:border-[#D4AF37]/40">
          <h2 className="font-serif text-3xl md:text-5xl text-gold-gradient mb-8 leading-snug drop-shadow-md">
            El lujo reside en la pureza de los ingredientes y el tiempo que nos dedicamos.
          </h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-8 transition-all duration-700 group-hover:w-28"></div>
          <p className="text-gray-200 text-base md:text-lg leading-loose max-w-2xl mx-auto font-light">
            GranColinos nace de la fusión entre la naturaleza colombiana y los estándares más exigentes de bienestar. Cada gota, cada extracto, es un testimonio de nuestra devoción por la calidad absoluta.
          </p>
        </FadeInWhenVisible>
      </section>

      {/* Dynamic Catalog Preview Section */}
      <section id="catalogo" className="py-24 bg-transparent px-6 relative">
        <div className="max-w-7xl mx-auto">
          <FadeInWhenVisible className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div>
              <span className="text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-3 block">
                Selección Premium
              </span>
              <h2 className="font-serif text-4xl md:text-5xl text-gold-gradient drop-shadow-lg">Catálogo Exclusivo</h2>
            </div>
            <Link href="/shop" className="text-xs font-bold tracking-[0.2em] uppercase border-b border-[#D4AF37] text-[#D4AF37] pb-1 mt-6 md:mt-0 hover:text-white hover:border-white transition-colors duration-300">
              Ver Todo
            </Link>
          </FadeInWhenVisible>

          <div className="flex flex-wrap justify-center gap-10">
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center w-full py-20 px-4 bg-black/30 rounded-2xl border border-[#D4AF37]/30 backdrop-blur-md">
                <span className="text-[#D4AF37] mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                </span>
                <h3 className="font-serif text-2xl text-white mb-2 text-center">Nuevos Ingredientes en Cultivo</h3>
                <p className="text-gray-400 font-sans text-sm w-full max-w-md text-center mb-6">
                  Nuestra próxima colección ultra-premium está siendo preparada desde GC Admin.
                </p>
              </div>
            ) : (
              products.slice(0, 3).map((product, index) => (
                <FadeInWhenVisible key={product.id} delay={index * 0.15} className="w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-2rem)] max-w-sm">
                  <Link href={`/product/${product.sku}`} className="group cursor-pointer block">
                    <div className="aspect-[3/4] bg-black/30 mb-5 overflow-hidden relative rounded-2xl border border-white/10 backdrop-blur-md shadow-xl transition-all duration-700 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)] group-hover:border-emerald-500/50">
                      {product.images && product.images.length > 0 ? (
                        <Image 
                          src={product.images[0]}
                          alt={product.title || product.name || 'Producto GranColinos'}
                          fill
                          className="object-contain p-4 group-hover:scale-110 transition-transform duration-1000 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-black/40">
                          <span className="text-[10px] tracking-widest uppercase">Sin Imagen</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <h3 className="font-serif text-xl font-bold mb-1.5 text-white group-hover:text-[#D4AF37] transition-colors duration-300">
                        {product.title || product.name}
                      </h3>
                      <p className="text-[#D4AF37] text-sm tracking-widest font-mono font-bold">
                        {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(product.price || 0)}
                      </p>
                    </div>
                  </Link>
                </FadeInWhenVisible>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Testimonials / Social Proof Section */}
      <section className="py-28 bg-transparent px-6 border-t border-[#D4AF37]/20 relative overflow-hidden">
        {/* Subtle premium glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-[#D4AF37]/10 blur-[160px] pointer-events-none rounded-full" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <FadeInWhenVisible className="text-center mb-16">
            <span className="text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-3 block">
              Prueba Social Premium
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-gold-gradient mb-6 drop-shadow-md">
              {testimonialsTitle}
            </h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto"></div>
          </FadeInWhenVisible>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsData.map((testimonial, i) => (
              <FadeInWhenVisible key={i} delay={i * 0.2}>
                <div className="h-full p-8 bg-black/35 backdrop-blur-xl border border-[#D4AF37]/25 rounded-2xl shadow-xl hover:shadow-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-all duration-500 flex flex-col justify-between">
                  <div>
                    <div className="flex text-[#D4AF37] mb-6 drop-shadow-sm">
                      {[1, 2, 3, 4, 5].map(star => (
                        <svg key={star} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      ))}
                    </div>
                    <p className="text-gray-300 font-light italic leading-relaxed mb-8 text-sm">
                      "{testimonial.text}"
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#f0e6d2] flex items-center justify-center text-black font-bold text-base shadow-inner">
                      {(testimonial.name || testimonial.authorName || "M")[0]}
                    </div>
                    <div>
                      <h4 className="font-serif text-white font-bold text-sm flex items-center gap-1.5">
                        {testimonial.name || testimonial.authorName || "Miembro"}
                      </h4>
                      <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest block">{testimonial.role || "Voz del Club"}</span>
                    </div>
                  </div>
                </div>
              </FadeInWhenVisible>
            ))}
          </div>

          <PaymentMethodsBadge />
        </div>
      </section>

      {/* Newsletter / Club Section */}
      <section className="py-24 bg-transparent px-6 border-t border-[#D4AF37]/20 relative">
        <div className="max-w-4xl mx-auto text-center">
          <FadeInWhenVisible>
            <span className="text-[#D4AF37] text-xs font-bold tracking-[0.3em] uppercase mb-3 block">Únete al Club</span>
            <h2 className="font-serif text-3xl md:text-5xl text-white font-bold mb-6">Recibe 10% OFF en tu primera compra</h2>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-8 max-w-xl mx-auto font-light">
              Forma parte de la comunidad GranColinos para acceder a ofertas exclusivas, lanzamientos y guías de bienestar.
            </p>
            <NewsletterForm />
          </FadeInWhenVisible>
        </div>
      </section>
    </div>
  );
}
