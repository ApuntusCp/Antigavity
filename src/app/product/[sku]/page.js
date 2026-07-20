import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../utils/firebase';
import Link from 'next/link';
import { CheckCircle2, ShieldCheck, Truck } from 'lucide-react';
import AddToCartButton from './AddToCartButton';
import ProductGallery from './ProductGallery';
import RelatedProducts from './RelatedProducts';

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
      description: product.description || 'Bienestar premium y snacks naturales de alta gama en Colombia.',
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
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4 text-center">
        <h1 className="text-4xl font-bold mb-4 text-[#D4AF37]">Error 404</h1>
        <p className="text-gray-400 mb-8 max-w-md">El producto con SKU <span className="font-mono text-white">{decodeURIComponent(resolvedParams.sku)}</span> no fue encontrado o no está disponible en este momento.</p>
        <Link href="/" className="px-8 py-3 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors uppercase tracking-widest text-xs font-bold shadow-[0_0_15px_rgba(212,175,55,0.2)]">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-light dark:bg-[#050505] text-brand-dark dark:text-white py-32 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#D4AF37] selection:text-black">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16">
        
        {/* Galería de Imágenes (Client Component) */}
        <div className="w-full lg:w-1/2">
          <ProductGallery images={product.images || []} productName={product.name} />
        </div>

        {/* Detalles del Producto */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-brand-dark dark:text-white drop-shadow-lg">{product.name}</h1>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="px-3 py-1 bg-brand-gold text-brand-dark text-xs font-bold uppercase tracking-widest rounded-sm shadow-[0_0_10px_rgba(212,175,55,0.3)]">
                {product.category} {product.categoryGroup ? `/ ${product.categoryGroup}` : ''}
              </span>
              <span className="text-gray-500 font-mono text-xs uppercase tracking-wider bg-white dark:bg-white/5 px-3 py-1 rounded-sm border border-gray-200 dark:border-white/10">
                SKU: {product.sku}
              </span>
            </div>
            {product.discountPrice ? (
              <div className="flex flex-col gap-1 mb-8">
                <div className="text-2xl font-light text-gray-400 line-through">
                  {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(product.price || 0)}
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-5xl font-light text-red-500 font-bold drop-shadow-md">
                    {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(product.discountPrice)}
                  </div>
                  <div className="bg-brand-gold/20 text-brand-gold px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-widest border border-brand-gold/50 shadow-[0_0_15px_rgba(212,175,55,0.2)] animate-pulse">
                    En Oferta
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-5xl font-light text-brand-gold mb-8">
                {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(product.price || 0)}
              </div>
            )}
            
            <p className="text-gray-600 dark:text-gray-300 font-light leading-relaxed mb-6">
              {product.description || 'Fórmula botánica premium desarrollada con los más altos estándares de calidad colombiana para promover tu bienestar diario.'}
            </p>
            
            <ul className="space-y-2 mb-8">
              {product.benefits ? (
                product.benefits.split('\n').map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <CheckCircle2 size={16} className="text-brand-gold mt-0.5 shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))
              ) : (
                <>
                  <li className="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <CheckCircle2 size={16} className="text-brand-gold mt-0.5 shrink-0" />
                    <span>Calidad 100% garantizada y certificada.</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <CheckCircle2 size={16} className="text-brand-gold mt-0.5 shrink-0" />
                    <span>Elaborado con ingredientes puros y orgánicos.</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="space-y-6 flex-1">
            <div className="p-6 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/5 rounded-xl shadow-xl">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Disponibilidad en Almacén</h3>
              {product.stock > 0 ? (
                product.stock <= 5 ? (
                  <div className="flex items-center gap-4 bg-brand-gold/10 p-4 rounded-lg border border-brand-gold/30">
                    <div className="relative">
                      <div className="w-4 h-4 rounded-full bg-brand-gold animate-ping absolute opacity-40"></div>
                      <div className="w-4 h-4 rounded-full bg-brand-gold relative border-2 border-brand-light dark:border-black"></div>
                    </div>
                    <div>
                      <div className="text-brand-gold text-lg font-bold">¡Alta demanda!</div>
                      <div className="text-sm text-gray-800 dark:text-gray-300">Solo quedan {product.stock} unidades</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-4 h-4 rounded-full bg-green-500 animate-ping absolute opacity-40"></div>
                      <div className="w-4 h-4 rounded-full bg-green-500 relative border-2 border-brand-light dark:border-black"></div>
                    </div>
                    <div>
                      <div className="text-brand-dark dark:text-white text-lg font-medium">Disponible para envío</div>
                      <div className="text-sm text-gray-400">{product.stock} unidades en inventario</div>
                    </div>
                  </div>
                )
              ) : (
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)] border-2 border-brand-light dark:border-black"></div>
                  <div>
                    <div className="text-gray-800 dark:text-gray-300 text-lg font-medium">Agotado temporalmente</div>
                    <div className="text-sm text-gray-500">Estamos reponiendo el inventario</div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="pt-6 flex flex-col gap-4">
              {/* Client Component Button */}
              <AddToCartButton product={product} />
            </div>
          </div>
          
          <div className="mt-10 pt-8 border-t border-gray-200 dark:border-white/10 grid grid-cols-2 gap-6">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold mb-1">
                <ShieldCheck size={20} />
              </div>
              <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-dark dark:text-white">Pago Seguro</h4>
              <p className="text-[10px] text-gray-500">Transacciones protegidas con Bold</p>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold mb-1">
                <Truck size={20} />
              </div>
              <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-dark dark:text-white">Envío Nacional</h4>
              <p className="text-[10px] text-gray-500">Tarifa fija a toda Colombia</p>
            </div>
          </div>

        </div>
      </div>
      
      {/* Productos Relacionados */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <RelatedProducts currentSku={params.sku} />
      </div>
    </div>
  );
}
