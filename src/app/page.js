import Image from "next/image";
import { fetchProducts } from "../utils/firebase";

export const revalidate = 60; // ISR: Revalidate catalog every 60 seconds

export default async function Home() {
  const products = await fetchProducts();

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* High-Impact Hero Section */}
      <section className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden bg-brand-dark fade-in">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-brand-dark z-10" />
          <div className="w-full h-full bg-brand-green/20" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl fade-in delay-300">
          <span className="text-brand-gold text-xs font-bold tracking-[0.3em] uppercase mb-6 block">
            Calidad INVIMA Certificada
          </span>
          <h1 className="font-playfair text-5xl md:text-7xl lg:text-8xl text-white font-normal leading-tight mb-8">
            La Esencia del <br/> Bienestar
          </h1>
          <p className="text-gray-300 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed mb-12">
            Descubre nuestra línea exclusiva de CBD y snacks naturales, diseñados para elevar tu rutina diaria con pureza inigualable.
          </p>
          
          <a href="#catalogo" className="inline-flex items-center justify-center px-10 py-4 border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-dark transition-all duration-500 text-xs font-bold tracking-[0.2em] uppercase">
            Explorar Colección
          </a>
        </div>
      </section>

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
                <div key={product.id} className={`group cursor-pointer fade-in delay-${(index % 3 + 1) * 100}`}>
                  <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 mb-6 overflow-hidden relative">
                    <div className="absolute inset-0 bg-brand-green/5 group-hover:bg-transparent transition-colors duration-500 z-10" />
                    {product.image ? (
                      <Image 
                        src={product.image}
                        alt={product.title || product.name || 'Producto GranColinos'}
                        fill
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs tracking-widest uppercase">
                        Sin Imagen
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <h3 className="font-playfair text-xl mb-2 text-brand-dark dark:text-white">
                      {product.title || product.name}
                    </h3>
                    <p className="text-brand-gold text-sm tracking-widest">
                      ${parseInt(product.price).toLocaleString('es-CO')} COP
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
