import Image from "next/image";
import Link from "next/link";
import { fetchProducts, fetchCMSPage } from "../../utils/firebase";
import PaymentMethodsBadge from "../../components/PaymentMethodsBadge";
import ShopAddToCartButton from "../../components/ShopAddToCartButton";
import { ShieldCheck, Sparkles } from "lucide-react";

export const revalidate = 30; // ISR for shop page

export const metadata = {
  title: "Catálogo Exclusivo | GranColinos",
  description: "Explora nuestra colección completa de bienestar premium, CBD y extractos orgánicos certificados por INVIMA.",
};

export default async function ShopPage() {
  const [products, cmsConfig] = await Promise.all([
    fetchProducts(),
    fetchCMSPage('shop')
  ]);

  const headerBlock = cmsConfig?.blocks?.find(b => b.type === 'shop_header')?.content || {};
  
  const title = headerBlock.title || "Catálogo Exclusivo";
  const subtitle = headerBlock.subtitle || "Colección Premium GranColinos";
  const text = headerBlock.text || "Nuestra selección exclusiva de formulaciones botánicas y extractos puros desarrollados con los más altos estándares de calidad colombiana e INVIMA.";

  return (
    <div className="min-h-screen bg-[#050A04] pt-32 pb-24 px-6 relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-[#D4AF37]/5 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 fade-in">
          <span className="text-[#D4AF37] text-xs font-bold tracking-[0.3em] uppercase mb-3 block">
            {subtitle}
          </span>
          <h1 className="font-serif text-4xl md:text-6xl text-gold-gradient mb-6 drop-shadow-md">
            {title}
          </h1>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-6"></div>
          <p className="text-gray-300 max-w-2xl mx-auto font-light leading-relaxed text-sm md:text-base">
            {text}
          </p>
        </div>

        {/* Product Grid: Uniform Cards with Cuero Premium APONTE aesthetic */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.length === 0 ? (
            <div className="col-span-full py-24 text-center border border-dashed border-[#D4AF37]/30 bg-black/40 rounded-2xl">
              <p className="text-[#D4AF37] font-mono tracking-widest uppercase text-sm">
                El catálogo se está actualizando desde GC Admin.
              </p>
            </div>
          ) : (
            products.map((product, index) => {
              const formattedPrice = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(product.price || 0);
              const formattedOfferPrice = product.discountPrice ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(product.discountPrice) : null;
              
              return (
                <div 
                  key={product.id} 
                  className="group bg-[#0A1408]/90 border border-[#D4AF37]/30 hover:border-[#D4AF37] rounded-2xl overflow-hidden backdrop-blur-md shadow-2xl transition-all duration-500 hover:shadow-[0_10px_35px_rgba(212,175,55,0.25)] flex flex-col justify-between h-[450px]"
                >
                  <div>
                    {/* Image Container with Fixed Height & Badge */}
                    <div className="h-56 bg-black/50 relative overflow-hidden">
                      {/* INVIMA Badge */}
                      <div className="absolute top-3 left-3 z-20 bg-black/70 border border-[#D4AF37]/50 text-[#D4AF37] text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md backdrop-blur-md flex items-center gap-1">
                        <ShieldCheck size={12} className="text-[#D4AF37]" /> INVIMA CERTIFICADO
                      </div>

                      {/* Offer Badge */}
                      {product.discountPrice && (
                        <div className="absolute top-3 right-3 z-20 bg-[#D4AF37] text-black text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md shadow-md animate-pulse">
                          En Oferta
                        </div>
                      )}

                      <Link href={`/product/${product.sku}`} className="block w-full h-full">
                        {product.images && product.images.length > 0 ? (
                          <Image 
                            src={product.images[0]}
                            alt={product.title || product.name || 'Producto GranColinos'}
                            fill
                            className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-[#050A04]">
                            <Sparkles size={28} className="text-[#D4AF37] mb-2" />
                            <span className="text-[10px] tracking-widest uppercase">GranColinos</span>
                          </div>
                        )}
                      </Link>
                    </div>
                    
                    {/* Content Section */}
                    <div className="p-5 flex flex-col justify-between">
                      <div>
                        <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.2em] uppercase block mb-1.5">
                          {product.category || 'BIENESTAR'}
                        </span>
                        <Link href={`/product/${product.sku}`}>
                          <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#D4AF37] transition-colors duration-300 line-clamp-2 min-h-[44px]">
                            {product.title || product.name}
                          </h3>
                        </Link>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div>
                          {formattedOfferPrice ? (
                            <div className="flex items-baseline gap-2">
                              <span className="text-[#D4AF37] text-xl font-extrabold font-mono">
                                {formattedOfferPrice}
                              </span>
                              <span className="text-gray-500 text-xs font-mono line-through">
                                {formattedPrice}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[#D4AF37] text-xl font-extrabold font-mono">
                              {formattedPrice}
                            </span>
                          )}
                          <span className="text-[10px] text-green-400 font-semibold block mt-0.5">
                            🟢 Unidades disponibles
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <div className="p-4 pt-0">
                    <ShopAddToCartButton product={product} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Colombian Payment Trust Seals & Security Badge */}
        <PaymentMethodsBadge />

      </div>
    </div>
  );
}
