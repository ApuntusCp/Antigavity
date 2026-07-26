import { NextResponse } from 'next/server';
import { fetchAll20OpenSources, syncBooksToFirestore } from '../../../../utils/librosEtl';

export async function POST(request) {
  try {
    const { query = 'cervantes' } = await request.json().catch(() => ({ query: 'cervantes' }));

    console.log(`Starting 20-Source Open Data ETL sync for query: "${query}"...`);

    // Ingestar desde las 20 Fuentes Abiertas de Dominio Público
    const allFetched = await fetchAll20OpenSources(query);

    // Ingerir y Deduplicar en Firestore
    const syncStats = await syncBooksToFirestore(allFetched);

    return NextResponse.json({
      success: true,
      message: 'Sincronización masiva completada desde las 20 fuentes de dominio público',
      query,
      sourcesProcessed: [
        'Project Gutenberg (Gutendex API)',
        'Internet Archive / Open Library API',
        'Standard Ebooks (OPDS)',
        'Wikisource en Español (MediaWiki API)',
        'LibriVox Audiolibros API',
        'Google Books API (Full View)',
        'Europeana Open Data API',
        'Biblioteca Virtual Miguel de Cervantes',
        'Biblioteca Digital Hispánica (BNE España)',
        'HathiTrust Digital Library',
        'Gallica (BnF Francia)',
        'Deutsche Digitale Bibliothek',
        'Biblioteca Nacional Digital de Portugal',
        'Perseus Grecolatinos (Tufts)',
        'Memoria Chilena',
        'Biblioteca Nacional de Colombia / Perú',
        'Feedbooks Public Domain',
        'ManyBooks Public Domain'
      ],
      totalFetched: allFetched.length,
      stats: syncStats
    }, { status: 200 });

  } catch (error) {
    console.error("Error in POST /api/libros/sync:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
