import { NextResponse } from 'next/server';
import { fetchGutendexCatalog, fetchOpenLibraryCatalog, syncBooksToFirestore } from '../../../../utils/librosEtl';

export async function POST(request) {
  try {
    const { query = 'cervantes', pages = 1 } = await request.json().catch(() => ({ query: 'cervantes', pages: 1 }));

    console.log(`Starting ETL sync for query: "${query}"...`);

    // 1. Fetch de Gutendex (Project Gutenberg API)
    const gutenbergBooks = await fetchGutendexCatalog(query, 1);

    // 2. Fetch de Open Library API (Internet Archive)
    const openLibraryBooks = await fetchOpenLibraryCatalog(query, 15);

    // 3. Unificar catálogo para ingesta
    const allFetched = [...gutenbergBooks, ...openLibraryBooks];

    // 4. Ingerir y Deduplicar en Firestore
    const syncStats = await syncBooksToFirestore(allFetched);

    return NextResponse.json({
      success: true,
      message: 'ETL Synchronization completed successfully',
      query,
      sourcesProcessed: ['Gutendex (Project Gutenberg)', 'Open Library (Internet Archive)'],
      totalFetched: allFetched.length,
      stats: syncStats
    }, { status: 200 });

  } catch (error) {
    console.error("Error in POST /api/libros/sync:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
