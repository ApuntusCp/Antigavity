'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '../../../utils/firebase'
import Link from 'next/link'
import { useCart } from '../../../components/CartContext'
import { CheckCircle2, ShieldCheck, Truck } from 'lucide-react'

export default function ProductRealtimePage() {
  const params = useParams()
  const skuParam = params.sku
  const { addToCart } = useCart()
  
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
    <div className="min-h-screen bg-brand-light dark:bg-[#050505] text-brand-dark dark:text-white py-32 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#D4AF37] selection:text-black">

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
            <div className="text-5xl font-light text-brand-gold mb-8">
              {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(product.price || 0)}
            </div>
            
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
               <div className="pt-6 flex flex-col gap-4">
              <button 
                onClick={() => addToCart(product)}
                disabled={product.stock <= 0}
                className={`w-full py-5 flex items-center justify-center gap-3 text-brand-dark text-sm font-bold uppercase tracking-widest transition-all rounded-sm shadow-[0_0_30px_rgba(212,175,55,0.2)] ${product.stock > 0 ? 'bg-brand-gold hover:bg-white hover:scale-[1.02]' : 'bg-gray-700 opacity-50 cursor-not-allowed text-gray-400'}`}
              >
                {product.stock > 0 ? 'Añadir al Carrito' : 'Sin Stock'}
              </button>
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
    </div>
  )
}
