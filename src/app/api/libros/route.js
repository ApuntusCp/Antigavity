import { NextResponse } from 'next/server';
import { collection, getDocs, query, orderBy, limit as firestoreLimit, where } from 'firebase/firestore';
import { db } from '../../../utils/firebase';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('categoria') || 'todas';
    const format = searchParams.get('formato') || 'todos';
    const license = searchParams.get('licencia') || 'todos';
    const searchQuery = (searchParams.get('q') || '').toLowerCase().trim();
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('limit') || '18', 10);

    // Consulta Firestore
    const catalogRef = collection(db, 'gran_libros_catalog');
    const qSnap = await getDocs(query(catalogRef, orderBy('createdAt', 'desc'), firestoreLimit(200)));

    let books = qSnap.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    }));

    // Aplicar Filtros en Memoria
    if (category !== 'todas') {
      books = books.filter(b => b.categoria === category);
    }

    if (format !== 'todos') {
      books = books.filter(b => {
        if (!b.formatos_disponibles) return false;
        if (format === 'leer') return b.formatos_disponibles.includes('html') || b.formatos_disponibles.includes('epub');
        if (format === 'descargar') return b.formatos_disponibles.includes('epub') || b.formatos_disponibles.includes('pdf');
        if (format === 'audiolibro') return b.formatos_disponibles.includes('audio');
        return true;
      });
    }

    if (license !== 'todos') {
      books = books.filter(b => b.licencia === license);
    }

    if (searchQuery) {
      books = books.filter(b => {
        const titleMatch = (b.titulo || '').toLowerCase().includes(searchQuery);
        const authorMatch = (b.autores || []).some(a => a.toLowerCase().includes(searchQuery));
        const synopsisMatch = (b.resumen || '').toLowerCase().includes(searchQuery);
        return titleMatch || authorMatch || synopsisMatch;
      });
    }

    // Paginación
    const total = books.length;
    const startIndex = (page - 1) * pageSize;
    const paginatedBooks = books.slice(startIndex, startIndex + pageSize);

    return NextResponse.json({
      success: true,
      total,
      page,
      pageSize,
      hasMore: startIndex + pageSize < total,
      data: paginatedBooks
    }, { status: 200 });

  } catch (error) {
    console.error("Error in GET /api/libros:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
