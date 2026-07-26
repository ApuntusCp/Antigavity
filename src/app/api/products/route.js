import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
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
        price: data.price || 0,
        discountPrice: data.discountPrice || null,
        category: data.category || 'BIENESTAR',
        categoryGroup: data.categoryGroup || 'RELAJANTES MUSCULARES',
        stock: data.stock || 100,
        images: data.images || (data.imageUrl ? [data.imageUrl] : []),
        imageUrl: data.images && data.images.length > 0 ? data.images[0] : (data.imageUrl || ''),
        description: data.description || 'Fórmula botánica premium desarrollada con los más altos estándares de calidad colombiana.',
        benefits: data.benefits || null,
        isAvailable: (data.stock || 0) > 0
      };
    });

    return NextResponse.json({
      success: true,
      count: products.length,
      products: products
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Cache-Control': 'no-store, max-age=0'
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
