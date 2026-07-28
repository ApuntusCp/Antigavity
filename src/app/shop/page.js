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
  let products = [];
  let cmsConfig = null;

  try {
    const [fetchedProducts, fetchedCms] = await Promise.all([
      fetchProducts(),
      fetchCMSPage('shop')
    ]);
    products = fetchedProducts || [];
    cmsConfig = fetchedCms || null;
  } catch (err) {
    console.error("Error loading shop page:", err);
  }

  const headerBlock = cmsConfig?.blocks?.find(b => b.type === 'shop_header')?.content || {};
  
  const title = headerBlock.title || "Catálogo Exclusivo";
  const subtitle = headerBlock.subtitle || "Colección Premium GranColinos";
  const text = headerBlock.text || "Nuestra selección exclusiva de formulaciones botánicas y extractos puros desarrollados con los más altos estándares de calidad colombiana e INVIMA.";

  return (
    <div className="min-h-screen pt-32 pb-28 px-4 sm:px-6 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        
        {/* Header Centrado Estilo Luxury GranColinos (Misma iluminación tenue del Inicio) */}
        <div className="text-center max-w-3xl mx-auto space-y-4 fade-in">
          <span className="text-[#D4AF37] text-xs font-mono font-extrabold tracking-[0.3em] uppercase block">
            • {subtitle} •
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-black text-gold-gradient uppercase tracking-tight drop-shadow-[0_4px_30px_rgba(212,175,55,0.4)]">
            {title}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto rounded-full shadow-[0_0_12px_rgba(212,175,55,0.8)]"></div>
          <p className="text-gray-200 font-sans text-sm md:text-base font-light leading-relaxed">
            {text}
          </p>
        </div>

        {/* CATÁLOGO ORDENADO Y CENTRADO EN PANTALLA CON FONDO DE CUERO NATURAL */}
        <div className="flex flex-wrap justify-center items-stretch gap-8 max-w-7xl mx-auto">
          {products.length === 0 ? (
            <div className="w-full py-24 text-center border-2 border-dashed border-[#D4AF37]/40 bg-[#0A1408]/80 rounded-3xl backdrop-blur-xl">
              <Sparkles size={36} className="text-[#D4AF37] mx-auto mb-3 animate-pulse" />
              <p className="text-[#D4AF37] font-mono tracking-widest uppercase text-xs font-extrabold">
                El catálogo se está actualizando desde GC Admin.
              </p>
            </div>
          ) : (
            products.map((product) => {
              const formattedPrice = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(product.price || 0);
              const formattedOfferPrice = product.discountPrice ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(product.discountPrice) : null;
              
              const discountPercent = product.price && product.discountPrice 
                ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
                : null;

              return (
                <div 
                  key={product.id} 
                  className="w-full sm:w-[320px] md:w-[340px] group bg-[#0A1408]/90 border border-white/10 hover:border-emerald-500/50 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl transition-all duration-500 hover:shadow-[0_15px_45px_rgba(0,0,0,0.8)] flex flex-col justify-between hover:-translate-y-1.5"
                >
                  <div className="flex flex-col flex-1">
                    
                    {/* ENCABEZADO DE IMAGEN CON INSIGNIAS ORGANIZADAS VERTICALMENTE (SIN OVERLAP) */}
                    <div className="h-64 w-full bg-black/70 relative overflow-hidden border-b border-white/10">
                      
                      {/* Insignias Apiladas Arriba a la Izquierda */}
                      <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 items-start">
                        <span className="px-2.5 py-1 bg-black/85 backdrop-blur-md border border-white/15 text-[#D4AF37] text-[9px] font-mono font-bold uppercase tracking-wider rounded-lg shadow-md flex items-center gap-1">
                          <ShieldCheck size={12} className="text-[#D4AF37]" /> INVIMA CERTIFICADO
                        </span>

                        {product.discountPrice && (
                          <span className="px-2.5 py-1 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black text-[9px] font-mono font-extrabold uppercase tracking-widest rounded-lg shadow-md">
                            EN OFERTA
                          </span>
                        )}
                      </div>

                      {/* Porcentaje de Ahorro Arriba a la Derecha */}
                      {discountPercent && (
                        <div className="absolute top-3 right-3 z-20 bg-black/85 backdrop-blur-md border border-emerald-500/60 text-emerald-400 text-[10px] font-mono font-extrabold px-2.5 py-1 rounded-lg shadow-md">
                          -{discountPercent}% AHORRO
                        </div>
                      )}

                      <Link href={`/product/${product.sku}`} className="block w-full h-full relative">
                        {product.images && product.images.length > 0 ? (
                          <Image 
                            src={product.images[0]}
                            alt={product.title || product.name || 'Producto GranColinos'}
                            fill
                            className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-[#050A04]">
                            <Sparkles size={32} className="text-[#D4AF37] mb-2" />
                            <span className="text-[10px] font-mono tracking-widest uppercase text-gray-400">GranColinos Botánica</span>
                          </div>
                        )}
                      </Link>
                    </div>
                    
                    {/* CUERPO ORDENADO Y ELEGANTE DE LA FICHA EN VERDE BOTÁNICO */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/40 text-emerald-300 border border-white/10 text-[9px] font-mono font-extrabold tracking-widest uppercase">
                            {product.category || 'BIENESTAR'}
                          </span>
                          <span className="text-[10px] font-mono text-gray-400 font-bold">
                            SKU: {product.sku || 'GC-PROD'}
                          </span>
                        </div>

                        <Link href={`/product/${product.sku}`}>
                          <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#D4AF37] transition-colors leading-snug line-clamp-2 min-h-[50px]">
                            {product.title || product.name}
                          </h3>
                        </Link>
                      </div>

                      {/* PRECIOS Y STOCK */}
                      <div className="pt-2 border-t border-white/10 space-y-1">
                        <div className="flex items-baseline gap-2">
                          {formattedOfferPrice ? (
                            <>
                              <span className="text-[#D4AF37] text-2xl font-black font-mono">
                                {formattedOfferPrice}
                              </span>
                              <span className="text-gray-500 text-xs font-mono line-through">
                                {formattedPrice}
                              </span>
                            </>
                          ) : (
                            <span className="text-[#D4AF37] text-2xl font-black font-mono">
                              {formattedPrice}
                            </span>
                          )}
                        </div>

                        {(product.stock === undefined || product.stock > 0) && (
                          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-400">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span>Unidades disponibles para envío</span>
                          </div>
                        )}
                        {product.stock === 0 && (
                          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-red-400">
                            <span className="w-2 h-2 rounded-full bg-red-400"></span>
                            <span>Agotado temporalmente</span>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>

                  {/* BOTÓN AÑADIR AL CARRITO FULL WIDTH */}
                  <div className="p-5 pt-0">
                    <ShopAddToCartButton product={product} />
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* Sellos de Confianza y Métodos de Pago */}
        <PaymentMethodsBadge />

      </div>
    </div>
  );
}
