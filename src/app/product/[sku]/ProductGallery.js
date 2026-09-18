'use client';

import { useState } from 'react';
import Image from 'next/image';
import Card3DTilt from '../../../components/Card3DTilt';

export default function ProductGallery({ images, productName }) {
  const [mainImage, setMainImage] = useState(images[0]);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-[#0a0a0a] rounded-xl border border-white/5 flex flex-col items-center justify-center text-gray-600 shadow-inner">
        <div className="w-16 h-16 border-2 border-dashed border-gray-700 rounded-full mb-4"></div>
        <span className="text-xs uppercase tracking-widest">Imagen no disponible</span>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <Card3DTilt maxTilt={12} className="w-full">
        <div className="aspect-square relative overflow-hidden bg-[#0a0a0a] rounded-2xl border border-white/10 ring-1 ring-white/10 shadow-2xl">
          <div className="relative w-full h-full" style={{ transform: 'translateZ(30px)', transformStyle: 'preserve-3d' }}>
            <Image 
              src={mainImage} 
              alt={productName}
              fill
              priority
              className="object-contain p-6 transition-transform duration-700 hover:scale-105 filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)]"
            />
          </div>
        </div>
      </Card3DTilt>
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-4 pt-2">
          {images.map((img, i) => (
            <div 
              key={i} 
              onClick={() => setMainImage(img)}
              className={`w-24 h-24 shrink-0 relative rounded-lg overflow-hidden border transition-all cursor-pointer ${mainImage === img ? 'border-brand-gold ring-2 ring-brand-gold opacity-100' : 'border-white/10 opacity-60 hover:opacity-100'}`}
            >
              <Image src={img} alt={`${productName} vista ${i+1}`} fill className="object-contain p-1" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
