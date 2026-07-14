import { collection, query, limit, getDocs } from 'firebase/firestore';
import { db } from '../../../utils/firebase';
import Image from 'next/image';
import Link from 'next/link';

export default async function RelatedProducts({ currentSku }) {
  let relatedProducts = [];

  try {
    // For now, fetch 4 products and filter out the current one
    const q = query(collection(db, 'products'), limit(4));
    const snapshot = await getDocs(q);
    
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.sku !== decodeURIComponent(currentSku)) {
        relatedProducts.push({ id: doc.id, ...data });
      }
    });

    // Keep only 3
    relatedProducts = relatedProducts.slice(0, 3);
  } catch (error) {
    console.error("Error fetching related products:", error);
  }

  if (relatedProducts.length === 0) return null;

  return (
    <div className="mt-24 pt-16 border-t border-gray-200 dark:border-white/10">
      <h3 className="font-playfair text-3xl mb-10 text-center text-brand-dark dark:text-white">Explora También</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {relatedProducts.map(product => (
          <Link key={product.sku} href={`/product/${encodeURIComponent(product.sku)}`} className="group flex flex-col">
            <div className="aspect-[4/5] relative bg-white dark:bg-[#0a0a0a] rounded-sm overflow-hidden mb-4 border border-gray-200 dark:border-white/5">
              {product.images && product.images.length > 0 ? (
                <Image 
                  src={product.images[0]} 
                  alt={product.name} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <span className="text-[10px] uppercase tracking-widest">Sin Imagen</span>
                </div>
              )}
            </div>
            
            <h4 className="text-sm font-bold text-brand-dark dark:text-white mb-2">{product.name}</h4>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500 uppercase tracking-widest">{product.category}</span>
              <span className="text-brand-gold font-mono">
                {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(product.price)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
