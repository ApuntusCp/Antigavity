import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const q = query(collection(db, 'products'));
    const snapshot = await getDocs(q);
    const products = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        sku: data.sku || doc.id,
        name: data.name || data.title || 'Producto GranColinos',
        title: data.name || data.title || 'Producto GranColinos',
        price: typeof data.price === 'number' ? data.price : 0,
        discountPrice: typeof data.discountPrice === 'number' ? data.discountPrice : null,
        category: data.category || 'BIENESTAR',
        categoryGroup: data.categoryGroup || 'RELAJANTES MUSCULARES',
        stock: typeof data.stock === 'number' ? data.stock : 100,
        images: Array.isArray(data.images) && data.images.length > 0 ? data.images : (data.imageUrl ? [data.imageUrl] : []),
        imageUrl: Array.isArray(data.images) && data.images.length > 0 ? data.images[0] : (data.imageUrl || ''),
        description: data.description || 'Fórmula botánica premium desarrollada con los más altos estándares de calidad colombiana.',
        benefits: Array.isArray(data.benefits) ? data.benefits : null,
        isAvailable: (data.stock || 0) > 0
      };
    });

    const origin = request.headers.get('origin');
    const allowedOrigins = ['https://grancolinos.com', 'https://www.grancolinos.com', 'http://localhost:3000'];
    const corsOrigin = origin && allowedOrigins.includes(origin) ? origin : 'https://grancolinos.com';

    return NextResponse.json({
      success: true,
      count: products.length,
      products: products
    }, {
      headers: {
        'Access-Control-Allow-Origin': corsOrigin,
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60'
      }
    });
  } catch (error) {
    console.error('Error in /api/products route:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      products: []
    }, { status: 500 });
  }
}
