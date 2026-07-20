import Image from "next/image";
import Link from "next/link";
import { fetchProducts, fetchHomeCMSConfig } from "../utils/firebase";
import NewsletterForm from "../components/NewsletterForm";
import HeroSection from "../components/HeroSection";

export const revalidate = 30; // ISR: check for new CMS publishes every 30 seconds

export default async function Home() {
  const [products, cmsConfig] = await Promise.all([
    fetchProducts(),
    fetchHomeCMSConfig(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Animated Hero Section with Variant Selector */}
      <HeroSection cmsConfig={cmsConfig} />

      {/* Philosophy / Space Section */}
      <section id="origen" className="py-32 md:py-48 bg-brand-light dark:bg-brand-dark px-6">
        <div className="max-w-4xl mx-auto text-center fade-in delay-100">
          <h2 className="font-playfair text-3xl md:text-5xl text-brand-green dark:text-brand-gold mb-10 leading-snug">
            El lujo reside en la pureza de los ingredientes y el tiempo que nos dedicamos.
          </h2>
          <div className="w-px h-24 bg-brand-gold mx-auto mb-10"></div>
          <p className="text-gray-600 dark:text-gray-400 leading-loose max-w-2xl mx-auto">
            GranColinos nace de la fusión entre la naturaleza colombiana y los estándares más exigentes de bienestar. Cada gota, cada extracto, es un testimonio de nuestra devoción por la calidad absoluta.
          </p>
        </div>
      </section>

      {/* Dynamic Catalog Preview Section */}
      <section id="catalogo" className="py-24 bg-white dark:bg-[#1a1a1a] px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 fade-in">
            <div>
              <span className="text-brand-gold text-xs font-bold tracking-[0.2em] uppercase mb-4 block">
                Selección Premium
              </span>
              <h2 className="font-playfair text-4xl text-brand-dark dark:text-white">Catálogo Exclusivo</h2>
            </div>
            <a href="/shop" className="text-xs font-bold tracking-[0.2em] uppercase border-b border-brand-dark dark:border-white pb-1 mt-6 md:mt-0 hover:text-brand-gold hover:border-brand-gold transition-colors duration-300">
              Ver Todo
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {products.length === 0 ? (
              <p className="text-gray-500 font-sans tracking-widest uppercase text-sm col-span-3 text-center py-20">
                Catálogo en preparación.
              </p>
            ) : (
              products.slice(0, 3).map((product, index) => (
                <Link href={`/product/${product.sku}`} key={product.id} className={`group cursor-pointer fade-in delay-${(index % 3 + 1) * 100} block`}>
                  <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 mb-6 overflow-hidden relative">
                    <div className="absolute inset-0 bg-brand-green/5 group-hover:bg-transparent transition-colors duration-500 z-10" />
                    {product.images && product.images.length > 0 ? (
                      <Image 
                        src={product.images[0]}
                        alt={product.title || product.name || 'Producto GranColinos'}
                        fill
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-[#0a0a0a] border border-white/5 shadow-inner">
                        <div className="w-12 h-12 border-2 border-dashed border-gray-700 rounded-full mb-3"></div>
                        <span className="text-[10px] tracking-widest uppercase">Sin Imagen</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <h3 className="font-playfair text-xl mb-2 text-brand-dark dark:text-white group-hover:text-brand-gold transition-colors duration-300">
                      {product.title || product.name}
                    </h3>
                    <p className="text-brand-gold text-sm tracking-widest font-mono">
                      {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(product.price || 0)}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Testimonials / Social Proof Section */}
      <section className="py-24 bg-brand-light dark:bg-[#0a0a0a] px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 fade-in">
            <span className="text-brand-gold text-xs font-bold tracking-[0.2em] uppercase mb-4 block">
              Prueba Social Premium
            </span>
            <h2 className="font-playfair text-4xl text-brand-dark dark:text-white mb-6">
              Voces del Club
            </h2>
            <div className="w-px h-12 bg-brand-gold mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Carolina M.", role: "Miembro Oro", text: "La pureza de estos extractos ha cambiado mi rutina. Sentir que consumo algo 100% orgánico y colombiano no tiene precio." },
              { name: "Dr. Alejandro V.", role: "Miembro Plata", text: "Recomiendo Gran Colinos por su compromiso con la calidad. Es raro encontrar marcas con esta dedicación a la formulación botánica." },
              { name: "Sofía T.", role: "Miembro Bronce", text: "Desde el empaque hasta la última gota, todo grita exclusividad. Son más que productos, es un estilo de vida consciente." }
            ].map((testimonial, i) => (
              <div key={i} className={`p-8 bg-white dark:bg-black/40 border border-gray-100 dark:border-white/5 rounded-xl shadow-lg fade-in delay-${(i + 1) * 100}`}>
                <div className="flex text-brand-gold mb-6">
                  {[1, 2, 3, 4, 5].map(star => (
                    <svg key={star} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 font-light italic leading-relaxed mb-8 relative">
                  <span className="text-4xl text-brand-gold absolute -top-4 -left-2 opacity-20 font-serif">"</span>
                  {testimonial.text}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-gold to-brand-green flex items-center justify-center text-brand-dark font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <h4 className="font-playfair text-brand-dark dark:text-white font-bold">{testimonial.name}</h4>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest">{testimonial.role}</span>
                  </div>
                </div>
              </div>
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
