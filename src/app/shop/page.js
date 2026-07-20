import Image from "next/image";
import Link from "next/link";
import { fetchProducts, fetchCMSPage } from "../../utils/firebase";

export const revalidate = 30; // ISR for shop page

export const metadata = {
  title: "Catálogo Premium | GranColinos",
  description: "Explora nuestra colección completa de bienestar premium y snacks naturales.",
};

export default async function ShopPage() {
  const [products, cmsConfig] = await Promise.all([
    fetchProducts(),
    fetchCMSPage('shop')
  ]);

  const headerBlock = cmsConfig?.blocks?.find(b => b.type === 'shop_header')?.content || {};
  
  const title = headerBlock.title || "Catálogo Premium";
  const subtitle = headerBlock.subtitle || "Colección Completa";
  const text = headerBlock.text || "Nuestra selección exclusiva de productos desarrollados con pureza botánica y los más altos estándares de calidad colombiana.";

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-20 fade-in">
          <span className="text-brand-gold text-xs font-bold tracking-[0.3em] uppercase mb-4 block">
            {subtitle}
          </span>
          <h1 className="font-playfair text-5xl md:text-7xl text-brand-dark dark:text-white mb-6">
            {title}
          </h1>
          <div className="w-px h-16 bg-brand-gold mx-auto mb-6"></div>
          <p className="text-gray-500 max-w-2xl mx-auto font-light leading-relaxed">
            {text}
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          {products.length === 0 ? (
            <div className="col-span-full py-32 text-center border border-dashed border-gray-200 dark:border-white/10">
              <p className="text-gray-500 font-sans tracking-widest uppercase text-sm">
                El catálogo se está actualizando.
              </p>
            </div>
          ) : (
            products.map((product, index) => (
              <Link href={`/product/${product.sku}`} key={product.id} className={`group cursor-pointer fade-in delay-${(index % 4 + 1) * 100} block`}>
                <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 mb-6 overflow-hidden relative shadow-sm hover:shadow-2xl transition-all duration-500">
                  <div className="absolute inset-0 bg-brand-green/5 group-hover:bg-transparent transition-colors duration-500 z-10" />
                  
                  {/* Stock Badge */}
                  {product.stock <= 0 && (
                    <div className="absolute top-4 right-4 z-20 bg-red-500/90 text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-sm">
                      Agotado
                    </div>
                  )}

                  {/* Discount Badge */}
                  {product.discountPrice && product.stock > 0 && (
                    <div className="absolute top-4 right-4 z-20 bg-brand-gold/90 text-brand-dark text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-sm">
                      Oferta
                    </div>
                  )}

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
                
                <div className="flex flex-col items-center text-center px-4">
                  <span className="text-gray-400 text-[9px] font-bold tracking-[0.2em] uppercase mb-2">
                    {product.category || 'Bienestar'}
                  </span>
                  <h3 className="font-playfair text-xl mb-3 text-brand-dark dark:text-white group-hover:text-brand-gold transition-colors duration-300">
                    {product.title || product.name}
                  </h3>
                  <div className="flex items-center gap-3">
                    {product.discountPrice ? (
                      <>
                        <span className="text-gray-500 text-xs tracking-widest font-mono line-through opacity-70">
                          {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(product.price || 0)}
                        </span>
                        <span className="text-red-400 text-sm tracking-widest font-mono font-bold">
                          {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(product.discountPrice)}
                        </span>
                      </>
                    ) : (
                      <span className="text-brand-gold text-sm tracking-widest font-mono">
                        {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(product.price || 0)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
