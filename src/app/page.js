import Image from "next/image";
import Link from "next/link";
import { fetchProducts, fetchHomeCMSConfig, fetchClientTestimonials } from "../utils/firebase";
import NewsletterForm from "../components/NewsletterForm";
import HeroSection from "../components/HeroSection";
import FadeInWhenVisible from "../components/FadeInWhenVisible";

export const revalidate = 30; // ISR: check for new CMS publishes every 30 seconds

export default async function Home() {
  const [products, cmsConfig, clientTestimonials] = await Promise.all([
    fetchProducts(),
    fetchHomeCMSConfig(),
    fetchClientTestimonials(),
  ]);

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
    <div className="flex flex-col min-h-screen">
      
      {/* Animated Hero Section with Variant Selector */}
      <HeroSection cmsConfig={cmsConfig} products={products} />

      {/* Philosophy / Space Section */}
      <section id="origen" className="py-32 md:py-48 bg-brand-light dark:bg-brand-dark px-6 relative overflow-hidden group">
        {/* Decorative elements for premium feel */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-brand-gold/5 blur-[120px] pointer-events-none transition-all duration-1000 group-hover:bg-brand-gold/10 group-hover:scale-110" />
        
        <FadeInWhenVisible className="max-w-4xl mx-auto text-center relative z-10 bg-white/30 dark:bg-black/30 backdrop-blur-md border border-brand-gold/10 p-12 md:p-20 rounded-3xl shadow-2xl transition-all duration-500 hover:shadow-brand-gold/5 hover:border-brand-gold/20">
          <h2 className="font-playfair text-4xl md:text-6xl text-brand-green dark:text-brand-gold mb-10 leading-snug drop-shadow-sm">
            El lujo reside en la pureza de los ingredientes y el tiempo que nos dedicamos.
          </h2>
          <div className="w-px h-32 bg-gradient-to-b from-brand-gold to-transparent mx-auto mb-10 transition-all duration-700 group-hover:h-40"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-loose max-w-2xl mx-auto font-light">
            GranColinos nace de la fusión entre la naturaleza colombiana y los estándares más exigentes de bienestar. Cada gota, cada extracto, es un testimonio de nuestra devoción por la calidad absoluta.
          </p>
        </FadeInWhenVisible>
      </section>

      {/* Dynamic Catalog Preview Section */}
      <section id="catalogo" className="py-24 bg-white dark:bg-[#1a1a1a] px-6 relative">
        <div className="max-w-7xl mx-auto">
          <FadeInWhenVisible className="flex flex-col md:flex-row justify-between items-end mb-20">
            <div>
              <span className="text-brand-gold text-xs font-bold tracking-[0.2em] uppercase mb-4 block">
                Selección Premium
              </span>
              <h2 className="font-playfair text-5xl text-brand-dark dark:text-white drop-shadow-lg">Catálogo Exclusivo</h2>
            </div>
            <a href="/shop" className="text-xs font-bold tracking-[0.2em] uppercase border-b border-brand-dark dark:border-white pb-1 mt-6 md:mt-0 hover:text-brand-gold hover:border-brand-gold transition-colors duration-300">
              Ver Todo
            </a>
          </FadeInWhenVisible>

          <div className="flex flex-wrap justify-center gap-12">
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center w-full py-20 px-4 bg-brand-light/50 dark:bg-black/30 rounded-2xl border border-gray-100 dark:border-white/5 backdrop-blur-sm">
                <span className="text-brand-gold mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                </span>
                <h3 className="font-playfair text-2xl text-brand-dark dark:text-white mb-2 text-center">Nuevos Ingredientes en Cultivo</h3>
                <p className="text-gray-500 font-sans text-sm w-full max-w-md text-center mb-6">
                  Nuestra próxima colección ultra-premium está siendo preparada. Suscríbete para acceso anticipado.
                </p>
                <div className="flex w-full max-w-sm">
                  <input type="email" placeholder="Correo electrónico" className="flex-1 bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-l-full px-6 text-sm focus:outline-none focus:border-brand-gold" />
                  <button className="bg-brand-dark dark:bg-white text-white dark:text-black font-bold uppercase tracking-wider text-xs px-6 py-3 rounded-r-full hover:bg-brand-gold hover:text-white transition-colors">
                    Avisarme
                  </button>
                </div>
              </div>
            ) : (
              products.slice(0, 3).map((product, index) => (
                <FadeInWhenVisible key={product.id} delay={index * 0.15} className="w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-2rem)] max-w-sm">
                  <Link href={`/product/${product.sku}`} className="group cursor-pointer block">
                    <div className="aspect-[3/4] bg-white dark:bg-black/30 mb-6 overflow-hidden relative rounded-xl border border-gray-100 dark:border-white/5 backdrop-blur-sm shadow-xl transition-all duration-700 group-hover:shadow-[0_20px_50px_rgba(212,175,55,0.1)] group-hover:border-brand-gold/30">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:opacity-0 transition-opacity duration-500 z-10" />
                      {product.images && product.images.length > 0 ? (
                        <Image 
                          src={product.images[0]}
                          alt={product.title || product.name || 'Producto GranColinos'}
                          fill
                          className="object-contain p-4 group-hover:scale-110 transition-transform duration-1000 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-[#0a0a0a]">
                          <div className="w-12 h-12 border-2 border-dashed border-gray-700 rounded-full mb-3"></div>
                          <span className="text-[10px] tracking-widest uppercase">Sin Imagen</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <h3 className="font-playfair text-2xl mb-2 text-brand-dark dark:text-white group-hover:text-brand-gold transition-colors duration-300">
                        {product.title || product.name}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm tracking-widest font-mono group-hover:text-white transition-colors duration-300">
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
      <section className="py-32 bg-brand-light dark:bg-[#080808] px-6 border-t border-white/5 relative overflow-hidden">
        {/* Subtle premium glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-brand-gold/5 blur-[150px] pointer-events-none rounded-full" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <FadeInWhenVisible className="text-center mb-20">
            <span className="text-brand-gold text-xs font-bold tracking-[0.2em] uppercase mb-4 block">
              Prueba Social Premium
            </span>
            <h2 className="font-playfair text-5xl text-brand-dark dark:text-white mb-8 drop-shadow-md">
              {testimonialsTitle}
            </h2>
            <div className="w-px h-16 bg-gradient-to-b from-brand-gold to-transparent mx-auto"></div>
          </FadeInWhenVisible>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsData.map((testimonial, i) => (
              <FadeInWhenVisible key={i} delay={i * 0.2}>
                <div className="h-full p-10 bg-white/50 dark:bg-black/40 backdrop-blur-xl border border-gray-100 dark:border-white/10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] hover:shadow-2xl hover:border-brand-gold/30 transition-all duration-500">
                  <div className="flex text-brand-gold mb-8 drop-shadow-sm">
                    {[1, 2, 3, 4, 5].map(star => (
                      <svg key={star} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 font-light italic leading-relaxed mb-10 relative">
                    <span className="text-6xl text-brand-gold absolute -top-8 -left-4 opacity-10 font-serif">"</span>
                    {testimonial.text}
                  </p>
                  <div className="flex items-center gap-4 mt-auto">
                    {testimonial.photoUrl ? (
                      <img src={testimonial.photoUrl} alt={testimonial.authorName || testimonial.name} className="w-12 h-12 rounded-full object-cover border border-brand-gold/50 shadow-inner" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-gold to-[#f0e6d2] flex items-center justify-center text-brand-dark font-bold text-lg shadow-inner">
                        {(testimonial.authorName || testimonial.name || "M")[0]}
                      </div>
                    )}
                    <div>
                      <h4 className="font-playfair text-brand-dark dark:text-white font-bold text-lg flex items-center gap-2">
                        {testimonial.authorName || testimonial.name || "Miembro"}
                        <svg className="w-4 h-4 text-brand-gold flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                      </h4>
                      <span className="text-[10px] text-brand-gold font-bold uppercase tracking-widest block">{testimonial.role || "Voz del Club"}</span>
                      <span className="text-[9px] text-gray-400 uppercase tracking-wider block mt-0.5">Voz del Club</span>
                    </div>
                  </div>
                </div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter / Club Section */}
      <section className="py-24 bg-[#0a0a0a] px-6 border-t border-white/5">
        <NewsletterForm />
      </section>
    </div>
  );
}
