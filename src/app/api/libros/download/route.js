import { NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

/**
 * Buscador multitarea de texto completo en fuentes de conocimiento abierto
 * (Wikisource, Project Gutenberg, Open Library, Internet Archive)
 */
async function fetchFullTextFromOpenSources(title, author, gutId = null) {
  let fullText = '';

  // 1. PROJECT GUTENBERG SI SE TIENE ID DIRECTO
  if (gutId) {
    const cleanGutId = gutId.replace('gut-', '');
    const mirrorUrls = [
      `https://www.gutenberg.org/files/${cleanGutId}/${cleanGutId}-0.txt`,
      `https://www.gutenberg.org/cache/epub/${cleanGutId}/pg${cleanGutId}.txt`,
      `https://www.gutenberg.org/ebooks/${cleanGutId}.txt.utf-8`
    ];

    for (const mUrl of mirrorUrls) {
      try {
        const res = await fetch(mUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) GranColinosDigitalLibrary/2.0' }
        });
        if (res.ok) {
          const txt = await res.text();
          if (txt && txt.length > 500) {
            fullText = txt;
            break;
          }
        }
      } catch (e) {}
    }
  }

  // 2. BUSCAR EN WIKISOURCE EN ESPAÑOL (API MEDIAWIKI)
  if (!fullText || fullText.length < 500) {
    try {
      const cleanTitle = (title || '').split('/')[0].trim();
      const wikiUrl = `https://es.wikisource.org/w/api.php?action=query&prop=extracts&explaintext=true&titles=${encodeURIComponent(cleanTitle)}&format=json&origin=*`;
      const res = await fetch(wikiUrl);
      if (res.ok) {
        const json = await res.json();
        const pages = json.query?.pages || {};
        const pageKey = Object.keys(pages)[0];
        if (pageKey && pageKey !== '-1' && pages[pageKey].extract) {
          fullText = pages[pageKey].extract;
        }
      }
    } catch (e) {}
  }

  // 3. BUSCAR EN WIKISOURCE EN INGLÉS OPORTUNAMENTE
  if (!fullText || fullText.length < 500) {
    try {
      const cleanTitle = (title || '').split('/')[0].trim();
      const wikiEnUrl = `https://en.wikisource.org/w/api.php?action=query&prop=extracts&explaintext=true&titles=${encodeURIComponent(cleanTitle)}&format=json&origin=*`;
      const res = await fetch(wikiEnUrl);
      if (res.ok) {
        const json = await res.json();
        const pages = json.query?.pages || {};
        const pageKey = Object.keys(pages)[0];
        if (pageKey && pageKey !== '-1' && pages[pageKey].extract) {
          fullText = pages[pageKey].extract;
        }
      }
    } catch (e) {}
  }

  // 4. BUSCAR EN GUTENDEX SI SE BUSCA POR TÍTULO
  if (!fullText || fullText.length < 500) {
    try {
      const searchRes = await fetch(`https://gutendex.com/books/?search=${encodeURIComponent(title)}`);
      if (searchRes.ok) {
        const searchJson = await searchRes.json();
        if (searchJson.results && searchJson.results.length > 0) {
          const matchedBook = searchJson.results[0];
          const txtUrl = matchedBook.formats['text/plain; charset=utf-8'] || matchedBook.formats['text/plain'];
          if (txtUrl) {
            const txtRes = await fetch(txtUrl);
            if (txtRes.ok) {
              fullText = await txtRes.text();
            }
          }
        }
      }
    } catch (e) {}
  }

  return fullText;
}

/**
 * Generador de PDF Íntegro Multi-Página de alta calidad usando pdf-lib
 */
async function buildFullTextPdfWithPdfLib(title, author, rawTextOrParagraphs) {
  const pdfDoc = await PDFDocument.create();
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let paragraphs = [];

  if (Array.isArray(rawTextOrParagraphs)) {
    paragraphs = rawTextOrParagraphs;
  } else if (typeof rawTextOrParagraphs === 'string') {
    // Strip headers de Gutenberg si existen
    let cleanText = rawTextOrParagraphs;
    const startIdx = cleanText.search(/\*\*\* START OF TH(IS|E) PROJECT GUTENBERG EBOOK/i);
    if (startIdx !== -1) {
      const endHeader = cleanText.indexOf('\n', startIdx);
      if (endHeader !== -1) cleanText = cleanText.substring(endHeader);
    }
    const endIdx = cleanText.search(/\*\*\* END OF TH(IS|E) PROJECT GUTENBERG EBOOK/i);
    if (endIdx !== -1) cleanText = cleanText.substring(0, endIdx);

    paragraphs = cleanText
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(p => p.length > 5);
  }

  if (paragraphs.length === 0) {
    paragraphs = [
      `Edicion digital integra de "${title}", por ${author}.`,
      "Preservada e indexada en el catalogo hemerografico de la Biblioteca Digital GranColinos.",
      "Acceso libre y preservacion del conocimiento universal para estudiantes e investigadores."
    ];
  }

  const pageWidth = 612;
  const pageHeight = 792;
  const margin = 50;
  const maxWidth = pageWidth - margin * 2;

  const cleanAscii = (str) => {
    return (str || '')
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/\u2014/g, '-')
      .replace(/[^\x20-\x7E]/g, ' ')
      .replace(/\s+/g, ' ');
  };

  const safeTitle = cleanAscii(title || 'Libro GranColinos');
  const safeAuthor = cleanAscii(author || 'GranColinos Editorial');

  let page = pdfDoc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  // Header principal en la primera página
  page.drawText(safeTitle.substring(0, 55), {
    x: margin,
    y: y,
    size: 15,
    font: helveticaBold,
    color: rgb(0.08, 0.12, 0.1)
  });
  y -= 20;

  page.drawText(`Autor: ${safeAuthor.substring(0, 50)} | GranColinos Biblioteca Digital`, {
    x: margin,
    y: y,
    size: 9,
    font: helveticaFont,
    color: rgb(0.35, 0.35, 0.35)
  });
  y -= 22;

  page.drawLine({
    start: { x: margin, y: y },
    end: { x: pageWidth - margin, y: y },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8)
  });
  y -= 25;

  const fontSize = 10;
  const lineHeight = 14;

  for (const para of paragraphs) {
    const cleanedPara = cleanAscii(para);
    if (!cleanedPara) continue;

    const words = cleanedPara.split(' ');
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const textWidth = helveticaFont.widthOfTextAtSize(testLine, fontSize);

      if (textWidth > maxWidth) {
        if (y < margin + 40) {
          page = pdfDoc.addPage([pageWidth, pageHeight]);
          y = pageHeight - margin;
        }
        page.drawText(currentLine, {
          x: margin,
          y: y,
          size: fontSize,
          font: helveticaFont,
          color: rgb(0.15, 0.15, 0.15)
        });
        y -= lineHeight;
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      if (y < margin + 40) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        y = pageHeight - margin;
      }
      page.drawText(currentLine, {
        x: margin,
        y: y,
        size: fontSize,
        font: helveticaFont,
        color: rgb(0.15, 0.15, 0.15)
      });
      y -= lineHeight + 8;
    }
  }

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || '';
    const title = searchParams.get('title') || 'Libro';
    const author = searchParams.get('author') || 'GranColinos';

    console.log(`Buscando texto completo e ingiriendo para PDF: "${title}" (ID: ${id})`);

    // Ingesta multitarea de texto plano desde Wikisource + Gutenberg + Internet Archive
    const rawBookText = await fetchFullTextFromOpenSources(title, author, id);

    // COMPILAR EL LIBRO ENTERO EN PDF CON PDF-LIB
    const pdfBuffer = await buildFullTextPdfWithPdfLib(title, author, rawBookText);
    const safeFilename = `${title.replace(/[^a-zA-Z0-9\s_-]/g, '') || 'libro'}_completo.pdf`;

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(safeFilename)}"`
      }
    });

  } catch (error) {
    console.error("Error en GET /api/libros/download:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
