import { collection, query, limit, getDocs } from 'firebase/firestore';
import { db, FALLBACK_PRODUCTS } from '../../../utils/firebase';
import Image from 'next/image';
import Link from 'next/link';
import Card3DTilt from '../../../components/Card3DTilt';

export default async function RelatedProducts({ currentSku }) {
  let relatedProducts = [];
  const decodedSku = decodeURIComponent(currentSku).toLowerCase();

  try {
    const q = query(collection(db, 'products'), limit(4));
    const snapshot = await getDocs(q);
    
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      if ((data.sku || doc.id).toLowerCase() !== decodedSku) {
        relatedProducts.push({ id: doc.id, ...data });
      }
    });

    relatedProducts = relatedProducts.slice(0, 3);
  } catch (error) {
    // Silently fall back
  }

  if (relatedProducts.length === 0) {
    relatedProducts = FALLBACK_PRODUCTS.filter(p => p.sku.toLowerCase() !== decodedSku).slice(0, 3);
  }

  if (relatedProducts.length === 0) return null;

  return (
    <div className="mt-24 pt-16 border-t border-gray-200 dark:border-white/10">
      <h3 className="font-tussilago text-3xl mb-10 text-center text-brand-dark dark:text-white">Miembros del club también compraron...</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {relatedProducts.map(product => (
          <Card3DTilt key={product.sku} maxTilt={9}>
            <Link href={`/product/${encodeURIComponent(product.sku)}`} className="group flex flex-col h-full">
              <div className="aspect-[4/5] relative bg-[#0a0a0a] rounded-2xl overflow-hidden mb-4 border border-white/10 shadow-lg">
                {product.images && product.images.length > 0 ? (
                  <div className="relative w-full h-full" style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }}>
                    <Image 
                      src={product.images[0]} 
                      alt={product.name} 
                      fill 
                      className="object-contain p-3 transition-transform duration-700 group-hover:scale-105 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <span className="text-[10px] uppercase tracking-widest">Sin Imagen</span>
                  </div>
                )}
              </div>
              
              <h4 className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors mb-2">{product.name}</h4>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400 uppercase tracking-widest">{product.category}</span>
                <span className="text-[#D4AF37] font-mono font-bold">
                  {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(product.price)}
                </span>
              </div>
            </Link>
          </Card3DTilt>
        ))}
      </div>
    </div>
  );
}
