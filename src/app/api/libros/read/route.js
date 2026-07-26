import { NextResponse } from 'next/server';

/**
 * Algoritmo de Limpieza y Paginación de Texto Real
 */
function cleanAndPaginateRealText(rawText, wordsPerPage = 280) {
  if (!rawText || rawText.length < 50) return [];

  let cleaned = rawText;
  
  // Strip Gutenberg header and footer markers
  const startIdx = cleaned.search(/\*\*\* START OF TH(IS|E) PROJECT GUTENBERG EBOOK/i);
  if (startIdx !== -1) {
    const endHeader = cleaned.indexOf('\n', startIdx);
    if (endHeader !== -1) cleaned = cleaned.substring(endHeader);
  }

  const endIdx = cleaned.search(/\*\*\* END OF TH(IS|E) PROJECT GUTENBERG EBOOK/i);
  if (endIdx !== -1) cleaned = cleaned.substring(0, endIdx);

  // Strip HTML tags and normalize whitespace
  cleaned = cleaned.replace(/<[^>]*>?/gm, '');
  const rawParagraphs = cleaned
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(p => p.length > 20);

  if (rawParagraphs.length === 0) return [];

  const pages = [];
  let currentPageParagraphs = [];
  let currentWordCount = 0;
  let pageNumber = 1;

  for (const para of rawParagraphs) {
    const wordCount = para.split(/\s+/).length;

    if (currentWordCount + wordCount > wordsPerPage && currentPageParagraphs.length > 0) {
      pages.push({
        page: pageNumber,
        title: `Página ${pageNumber}`,
        paragraphs: [...currentPageParagraphs]
      });
      pageNumber++;
      currentPageParagraphs = [para];
      currentWordCount = wordCount;
    } else {
      currentPageParagraphs.push(para);
      currentWordCount += wordCount;
    }
  }

  if (currentPageParagraphs.length > 0) {
    pages.push({
      page: pageNumber,
      title: `Página ${pageNumber}`,
      paragraphs: currentPageParagraphs
    });
  }

  return pages;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || '';
    const fetchUrl = searchParams.get('url') || '';

    console.log(`Ingesting real unabridged text for book ID: "${id}"...`);

    // 1. SI ES UNA OBRA DE PROJECT GUTENBERG
    if (id.startsWith('gut-')) {
      const gutId = id.replace('gut-', '');
      const mirrorUrls = [
        `https://www.gutenberg.org/files/${gutId}/${gutId}-0.txt`,
        `https://www.gutenberg.org/cache/epub/${gutId}/pg${gutId}.txt`,
        `https://www.gutenberg.org/ebooks/${gutId}.txt.utf-8`,
        `https://www.gutenberg.org/files/${gutId}/${gutId}.txt`
      ];

      for (const mUrl of mirrorUrls) {
        try {
          const res = await fetch(mUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) GranColinosDigitalLibrary/2.0' }
          });
          if (res.ok) {
            const rawText = await res.text();
            const paginated = cleanAndPaginateRealText(rawText);
            if (paginated.length > 0) {
              return NextResponse.json({
                success: true,
                isCopyrighted: false,
                totalPages: paginated.length,
                pages: paginated
              });
            }
          }
        } catch (e) {
          // Continuar con el siguiente mirror
        }
      }
    }

    // 2. SI ES UNA OBRA EN DOMINIO PÚBLICO CON URL DIRECTA
    if (fetchUrl && fetchUrl.includes('gutenberg.org')) {
      try {
        const res = await fetch(fetchUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) GranColinosDigitalLibrary/2.0' }
        });
        if (res.ok) {
          const rawText = await res.text();
          const paginated = cleanAndPaginateRealText(rawText);
          if (paginated.length > 0) {
            return NextResponse.json({
              success: true,
              isCopyrighted: false,
              totalPages: paginated.length,
              pages: paginated
            });
          }
        }
      } catch (e) {}
    }

    // 3. SI LA OBRA ES COMERCIAL / COPYRIGHT VIGENTE (Ej. "The 48 Laws of Power", "Psycho-Cybernetics")
    // O no dispone de texto plano de dominio público en abierto:
    return NextResponse.json({
      success: true,
      isCopyrighted: true,
      message: 'Esta obra cuenta con derechos de autor vigentes o protección de propiedad intelectual. GranColinos indexa metadatos oficiales y proporciona enlaces directos para la adquisición o lectura licenciada.',
      pages: []
    });

  } catch (error) {
    console.error("Error in GET /api/libros/read:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
