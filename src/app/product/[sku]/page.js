'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '../../../utils/firebase'
import Link from 'next/link'

export default function ProductRealtimePage() {
  const params = useParams()
  const skuParam = params.sku
  
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!skuParam) return
    
    const sku = decodeURIComponent(skuParam)
    const q = query(collection(db, 'products'), where('sku', '==', sku))
    
    // onSnapshot escucha los cambios EN TIEMPO REAL
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        setProduct(null)
      } else {
        const doc = snapshot.docs[0]
        setProduct({ id: doc.id, ...doc.data() })
      }
      setLoading(false)
    }, (error) => {
      console.error("Error escuchando el producto:", error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [skuParam])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-t-2 border-[#D4AF37] rounded-full animate-spin mb-4"></div>
          <p className="text-[#D4AF37] font-mono uppercase tracking-widest text-xs">Conectando con GranColinos en vivo...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4 text-center">
        <h1 className="text-4xl font-bold mb-4 text-[#D4AF37]">Error 404</h1>
        <p className="text-gray-400 mb-8 max-w-md">El producto con SKU <span className="font-mono text-white">{skuParam}</span> no fue encontrado o no está disponible en este momento.</p>
        <Link href="/" className="px-8 py-3 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors uppercase tracking-widest text-xs font-bold shadow-[0_0_15px_rgba(212,175,55,0.2)]">
          Volver a la tienda
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white py-24 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#D4AF37] selection:text-black relative">
      {/* Indicador de Tiempo Real */}
      <div className="absolute top-8 right-8 flex items-center gap-2 bg-[#D4AF37]/10 px-4 py-2 rounded-full border border-[#D4AF37]/30 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        <span className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-bold">Actualización en Vivo</span>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16">
        {/* Galería de Imágenes */}
        <div className="w-full lg:w-1/2">
          {product.images && product.images.length > 0 ? (
            <div className="grid gap-4">
              <div className="aspect-square relative overflow-hidden bg-[#0a0a0a] rounded-xl border border-white/5 ring-1 ring-white/10 shadow-2xl">
                <img 
                  src={product.images[0]} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-4 pt-2">
                  {product.images.map((img, i) => (
                    <div key={i} className="w-24 h-24 shrink-0 rounded-lg overflow-hidden border border-white/10 opacity-70 hover:opacity-100 transition-all cursor-pointer hover:ring-2 hover:ring-[#D4AF37]">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-square bg-[#0a0a0a] rounded-xl border border-white/5 flex flex-col items-center justify-center text-gray-600 shadow-inner">
              <div className="w-16 h-16 border-2 border-dashed border-gray-700 rounded-full mb-4"></div>
              <span className="text-xs uppercase tracking-widest">Imagen no disponible</span>
            </div>
          )}
        </div>

        {/* Detalles del Producto */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-white drop-shadow-lg">{product.name}</h1>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="px-3 py-1 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-widest rounded-sm shadow-[0_0_10px_rgba(212,175,55,0.3)]">
                {product.category} {product.categoryGroup ? `/ ${product.categoryGroup}` : ''}
              </span>
              <span className="text-gray-500 font-mono text-xs uppercase tracking-wider bg-white/5 px-3 py-1 rounded-sm border border-white/10">
                SKU: {product.sku}
              </span>
            </div>
            <div className="text-5xl font-light text-[#D4AF37] mb-8">
              {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(product.price || 0)}
            </div>
          </div>

          <div className="space-y-6 flex-1">
            <div className="p-6 bg-[#0a0a0a] border border-white/5 rounded-xl shadow-xl">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Disponibilidad en Almacén</h3>
              {product.stock > 0 ? (
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-4 h-4 rounded-full bg-green-500 animate-ping absolute opacity-40"></div>
                    <div className="w-4 h-4 rounded-full bg-green-500 relative border-2 border-black"></div>
                  </div>
                  <div>
                    <div className="text-white text-lg font-medium">Disponible para envío</div>
                    <div className="text-sm text-gray-400">{product.stock} unidades en inventario</div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)] border-2 border-black"></div>
                  <div>
                    <div className="text-gray-300 text-lg font-medium">Agotado temporalmente</div>
                    <div className="text-sm text-gray-500">Estamos reponiendo el inventario</div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="pt-6">
              <a 
                href={product.stock > 0 ? `https://wa.me/573000000000?text=Hola%20GranColinos,%20estoy%20interesado%20en%20adquirir%20el%20producto:%20${encodeURIComponent(product.name)}%20(SKU:%20${product.sku})` : '#'}
                target="_blank"
                rel="noopener noreferrer"
                style={{ pointerEvents: product.stock <= 0 ? 'none' : 'auto' }}
                className={`w-full py-5 flex items-center justify-center gap-3 text-black text-sm font-bold uppercase tracking-widest transition-all rounded-sm shadow-[0_0_30px_rgba(212,175,55,0.2)] ${product.stock > 0 ? 'bg-[#D4AF37] hover:bg-white hover:scale-[1.02]' : 'bg-gray-700 opacity-50 cursor-not-allowed text-gray-400'}`}
              >
                {product.stock > 0 ? (
                  <>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                    </svg>
                    Comprar por WhatsApp
                  </>
                ) : 'Sin Stock'}
              </a>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-[10px] text-gray-600 uppercase tracking-widest leading-loose">
              Autenticidad garantizada por GranColinos. Producto certificado con código de barras universal {product.barcode ? `(${product.barcode})` : ''}.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
