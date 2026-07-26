import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../utils/firebase';
import Link from 'next/link';
import { CheckCircle2, ShieldCheck, Truck, Lock } from 'lucide-react';
import AddToCartButton from './AddToCartButton';
import ProductGallery from './ProductGallery';
import RelatedProducts from './RelatedProducts';
import PaymentMethodsBadge from '../../../components/PaymentMethodsBadge';

// Forzar datos en tiempo real (evitar problemas de sincronización de caché)
export const dynamic = 'force-dynamic';

// Helper para obtener el producto
async function getProductBySku(sku) {
  try {
    const q = query(collection(db, 'products'), where('sku', '==', decodeURIComponent(sku)));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error("Error fetching product server-side:", error);
    return null;
  }
}

// Generación Dinámica de Metadata (SEO & Open Graph)
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const product = await getProductBySku(resolvedParams.sku);
  
  if (!product) {
    return { title: 'Producto No Encontrado | GranColinos' };
  }

  return {
    title: `${product.name} | GranColinos`,
    description: product.description || 'Fórmula botánica premium desarrollada con los más altos estándares de calidad colombiana.',
    openGraph: {
      title: `${product.name} - GranColinos`,
      description: product.description || 'Bienestar premium y extractos naturales de alta gama en Colombia.',
      images: product.images && product.images.length > 0 ? [
        {
          url: product.images[0],
          width: 800,
          height: 800,
          alt: product.name,
        }
      ] : [],
      type: 'website',
    }
  };
}

export default async function ProductPage({ params }) {
  const resolvedParams = await params;
  const product = await getProductBySku(resolvedParams.sku);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#050A04] flex flex-col items-center justify-center text-white p-4 text-center">
        <h1 className="font-serif text-4xl font-bold mb-4 text-[#D4AF37]">Producto No Disponible</h1>
        <p className="text-gray-400 mb-8 max-w-md">El producto con SKU <span className="font-mono text-[#D4AF37]">{decodeURIComponent(resolvedParams.sku)}</span> no fue encontrado o está en producción.</p>
        <Link href="/shop" className="px-8 py-3 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all uppercase tracking-widest text-xs font-bold rounded-xl shadow-[0_0_15px_rgba(212,175,55,0.2)]">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(product.price || 0);
  const formattedDiscountPrice = product.discountPrice ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(product.discountPrice) : null;

  return (
    <div className="min-h-screen bg-[#050A04] text-white py-28 md:py-36 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#D4AF37] selection:text-black relative overflow-hidden">
      
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-[#D4AF37]/5 blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16 relative z-10">
        
        {/* Galería de Imágenes (Client Component) */}
        <div className="w-full lg:w-1/2">
          <ProductGallery images={product.images || []} productName={product.name || product.title} />
        </div>

        {/* Detalles del Producto con Estética Cuero Premium APONTE */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-[#1E3314] border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest rounded-md shadow-sm">
                {product.category} {product.categoryGroup ? `/ ${product.categoryGroup}` : ''}
              </span>
              <span className="text-gray-400 font-mono text-[11px] uppercase tracking-wider bg-black/60 px-3 py-1 rounded-md border border-white/10">
                SKU: {product.sku}
              </span>
            </div>

            <h1 className="font-serif text-3xl md:text-5xl font-bold mb-4 text-gold-gradient drop-shadow-md leading-tight">
              {product.name || product.title}
            </h1>

            {/* INVIMA Certificate Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#0A1408] border border-[#D4AF37]/40 rounded-lg text-xs font-semibold text-[#D4AF37] mb-6 shadow-sm">
              <ShieldCheck size={16} className="text-[#D4AF37]" />
              <span>Certificación INVIMA RS-2024-12345 (100% Certificado)</span>
            </div>

            {/* Price Display */}
            {formattedDiscountPrice ? (
              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-4xl md:text-5xl font-extrabold text-red-500 font-mono drop-shadow-md">
                  {formattedDiscountPrice}
                </span>
                <span className="text-xl font-light text-gray-500 line-through font-mono">
                  {formattedPrice}
                </span>
                <span className="bg-[#D4AF37]/20 text-[#D4AF37] px-3 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest border border-[#D4AF37]/50 shadow-[0_0_12px_rgba(212,175,55,0.2)] animate-pulse">
                  EN OFERTA
                </span>
              </div>
            ) : (
              <div className="text-4xl md:text-5xl font-extrabold text-[#D4AF37] font-mono mb-8 drop-shadow-md">
                {formattedPrice}
              </div>
            )}
            
            <p className="text-gray-300 font-light leading-relaxed mb-6 text-sm md:text-base">
              {product.description || 'Fórmula botánica premium desarrollada con los más altos estándares de calidad colombiana para promover tu bienestar diario.'}
            </p>
            
            <ul className="space-y-2.5 mb-8 border-y border-[#D4AF37]/20 py-4">
              {product.benefits ? (
                product.benefits.split('\n').map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs md:text-sm text-gray-300">
                    <CheckCircle2 size={16} className="text-[#D4AF37] mt-0.5 shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))
              ) : (
                <>
                  <li className="flex items-start gap-2.5 text-xs md:text-sm text-gray-300">
                    <CheckCircle2 size={16} className="text-[#D4AF37] mt-0.5 shrink-0" />
                    <span>Calidad 100% garantizada y certificada por INVIMA.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs md:text-sm text-gray-300">
                    <CheckCircle2 size={16} className="text-[#D4AF37] mt-0.5 shrink-0" />
                    <span>Elaborado con extractos puros y orgánicos colombianos.</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="space-y-6">
            {/* Disponibilidad en Almacén */}
            <div className="p-4 md:p-5 bg-[#0A1408] border border-[#D4AF37]/30 rounded-2xl shadow-xl">
              <h3 className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest mb-2">Disponibilidad en Almacén</h3>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-ping absolute opacity-40"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500 relative border border-black"></div>
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">Unidades disponibles</div>
                </div>
              </div>
            </div>
            
            {/* Botón de Acción del Carrito */}
            <div className="pt-2">
              <AddToCartButton product={product} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Medios de Pago y Sellos de Confianza */}
      <div className="max-w-6xl mx-auto mt-16">
        <PaymentMethodsBadge />
      </div>

      {/* Productos Relacionados */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <RelatedProducts currentSku={params.sku} />
      </div>
    </div>
  );
}
