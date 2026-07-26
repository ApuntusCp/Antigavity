import { NextResponse } from 'next/server';

/**
 * Algoritmo de Limpieza y Paginación de Texto Completo
 */
function cleanAndPaginateText(rawText, wordsPerPage = 280) {
  if (!rawText) return [];

  // Remove Gutenberg license headers and footers if present
  let cleaned = rawText;
  const startIdx = cleaned.search(/\*\*\* START OF TH(IS|E) PROJECT GUTENBERG EBOOK/i);
  if (startIdx !== -1) {
    const endHeader = cleaned.indexOf('\n', startIdx);
    if (endHeader !== -1) cleaned = cleaned.substring(endHeader);
  }

  const endIdx = cleaned.search(/\*\*\* END OF TH(IS|E) PROJECT GUTENBERG EBOOK/i);
  if (endIdx !== -1) {
    cleaned = cleaned.substring(0, endIdx);
  }

  // Remove excessive empty lines & HTML tags
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

    console.log(`Ingesting full text for book ID: "${id}"...`);

    let targetTxtUrl = null;

    if (id.startsWith('gut-')) {
      const gutId = id.replace('gut-', '');
      // Try Gutenberg raw plain text mirrors
      targetTxtUrl = `https://www.gutenberg.org/files/${gutId}/${gutId}-0.txt`;
    } else if (fetchUrl && fetchUrl.includes('gutenberg.org')) {
      targetTxtUrl = fetchUrl;
    }

    if (!targetTxtUrl) {
      return NextResponse.json({
        success: false,
        message: 'No direct text stream URL available for this work'
      }, { status: 400 });
    }

    // Server-side fetch bypassing CORS
    const res = await fetch(targetTxtUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) GranColinosDigitalLibrary/2.0'
      }
    });

    if (!res.ok) {
      // Try fallback URL for Gutenberg
      if (id.startsWith('gut-')) {
        const gutId = id.replace('gut-', '');
        const fallbackUrl = `https://www.gutenberg.org/cache/epub/${gutId}/pg${gutId}.txt`;
        const fallbackRes = await fetch(fallbackUrl);
        if (fallbackRes.ok) {
          const rawText = await fallbackRes.text();
          const paginated = cleanAndPaginateText(rawText);
          return NextResponse.json({
            success: true,
            totalPages: paginated.length,
            pages: paginated
          });
        }
      }

      return NextResponse.json({ success: false, message: 'Could not fetch remote book stream' }, { status: 404 });
    }

    const rawText = await res.text();
    const paginated = cleanAndPaginateText(rawText);

    return NextResponse.json({
      success: true,
      totalPages: paginated.length,
      pages: paginated
    });

  } catch (error) {
    console.error("Error in GET /api/libros/read:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
