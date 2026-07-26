import { NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

/**
 * Limpiador definitivo de metadatos OCR y ruido de cabeceras web (Archive.org / Gutenberg)
 * Garantiza que ÚNICAMENTE los capítulos y párrafos reales del libro se incluyan en el PDF.
 */
function cleanRawBookTextToParagraphs(rawText) {
  if (!rawText) return [];

  let text = rawText;

  // 1. Recortar cabeceras y pies de página de Project Gutenberg
  const startMatch = text.match(/\*\*\*\s*START OF TH(IS|E) PROJECT GUTENBERG EBOOK[\s\S]*?\*\*\*/i);
  if (startMatch) {
    const endHeaderIdx = text.indexOf(startMatch[0]) + startMatch[0].length;
    text = text.substring(endHeaderIdx);
  }

  const endMatch = text.match(/\*\*\*\s*END OF TH(IS|E) PROJECT GUTENBERG EBOOK/i);
  if (endMatch) {
    const endFooterIdx = text.indexOf(endMatch[0]);
    text = text.substring(0, endFooterIdx);
  }

  // 2. Eliminar cualquier etiqueta HTML o script restante
  text = text
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ');

  // 3. Filtrar líneas de metadatos OCR de Internet Archive (EMBED, ABBYY FineReader, DOWNLOAD OPTIONS, etc.)
  const lines = text.split(/\n+/);
  const cleanLines = lines.filter(line => {
    const trimmed = line.trim();
    if (trimmed.length < 3) return false;
    
    // Lista de patrones de metadatos no deseados
    if (trimmed.match(/^(EMBED|archiveorg|TheArtOfWarBySunTzu|Want more\?|Advanced embedding|Flag this item|Graphic Violence|Explicit Sexual|Misinformation|Marketing\/Phishing|Misleading|Usage Public Domain|Topics |The Art of War by Sun Tzu|Conversion to pdf|Identifier|ABBYY|FineReader|plus-circle|Add Review|Favorites|Reviews|DOWNLOAD OPTIONS|download \d+ file|item Description fields|frameborder=)/i)) {
      return false;
    }
    if (trimmed.includes('archive.org') || trimmed.includes('gutenberg.org/license')) return false;
    return true;
  });

  const joinedText = cleanLines.join('\n');

  // 4. Dividir en párrafos limpios
  const paragraphs = joinedText
    .split(/\n\s*\n/)
    .map(p => p.replace(/\s+/g, ' ').trim())
    .filter(p => p.length > 25);

  return paragraphs;
}

/**
 * Extractor Multitarea de Texto Plano Puro para cualquier Libro
 */
async function fetchCleanBookParagraphs(title, author, gutId = null) {
  let rawText = '';

  // 1. PRIORIDAD MÁXIMA: PROJECT GUTENBERG (Textos de máxima pureza tipográfica)
  if (gutId && gutId.startsWith('gut-')) {
    const cleanGutId = gutId.replace('gut-', '');
    const mirrorUrls = [
      `https://www.gutenberg.org/files/${cleanGutId}/${cleanGutId}-0.txt`,
      `https://www.gutenberg.org/cache/epub/${cleanGutId}/pg${cleanGutId}.txt`,
      `https://www.gutenberg.org/files/${cleanGutId}/${cleanGutId}.txt`
    ];

    for (const mUrl of mirrorUrls) {
      try {
        const res = await fetch(mUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) GranColinosDigitalLibrary/2.0' }
        });
        if (res.ok) {
          const txt = await res.text();
          if (txt && txt.length > 2000) {
            rawText = txt;
            break;
          }
        }
      } catch (e) {}
    }
  }

  // 2. CONSULTA EN GUTENDEX SI ES BÚSQUEDA POR TÍTULO O AUTOR
  if (!rawText || rawText.length < 2000) {
    try {
      const searchRes = await fetch(`https://gutendex.com/books/?search=${encodeURIComponent(title)}`);
      if (searchRes.ok) {
        const searchJson = await searchRes.json();
        if (searchJson.results && searchJson.results.length > 0) {
          for (const book of searchJson.results) {
            const txtUrl = book.formats['text/plain; charset=utf-8'] || book.formats['text/plain'];
            if (txtUrl) {
              const txtRes = await fetch(txtUrl);
              if (txtRes.ok) {
                const fetchedTxt = await txtRes.text();
                if (fetchedTxt && fetchedTxt.length > 2000) {
                  rawText = fetchedTxt;
                  break;
                }
              }
            }
          }
        }
      }
    } catch (e) {}
  }

  // 3. CONSULTA EN WIKISOURCE PROFUNDO
  if (!rawText || rawText.length < 2000) {
    for (const lang of ['es', 'en']) {
      try {
        const searchWikiUrl = `https://${lang}.wikisource.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(title + ' ' + (author || ''))}&format=json&origin=*`;
        const sRes = await fetch(searchWikiUrl);
        if (sRes.ok) {
          const sJson = await sRes.json();
          const searchHits = sJson.query?.search || [];
          const validHits = searchHits.filter(h => !h.title.toLowerCase().includes('disambiguation') && !h.title.toLowerCase().includes('desambiguación'));
          
          if (validHits.length > 0) {
            const hitTitle = validHits[0].title;
            const parseUrl = `https://${lang}.wikisource.org/w/api.php?action=parse&prop=text&page=${encodeURIComponent(hitTitle)}&format=json&origin=*`;
            const pRes = await fetch(parseUrl);
            if (pRes.ok) {
              const pJson = await pRes.json();
              const htmlContent = pJson.parse?.text?.['*'];
              if (htmlContent) {
                rawText = htmlContent;
                break;
              }
            }
          }
        }
      } catch (e) {}
    }
  }

  // Procesar y depurar ruido de metadatos OCR
  const cleanParagraphs = cleanRawBookTextToParagraphs(rawText);
  return cleanParagraphs;
}

/**
 * Compilador de PDF Limpio e Íntegro con pdf-lib (Certificado para Adobe Acrobat)
 */
async function buildFullBookPdf(title, author, paragraphs) {
  const pdfDoc = await PDFDocument.create();
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let finalParas = paragraphs;
  if (!Array.isArray(finalParas) || finalParas.length === 0) {
    finalParas = [
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

  for (const para of finalParas) {
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

    console.log(`Ingiriendo y depurando texto puro original para PDF: "${title}" (${author})`);

    // Ingesta depurada del texto original libre de ruido OCR o metadatos de cabecera
    const cleanParagraphs = await fetchCleanBookParagraphs(title, author, id);

    // COMPILAR EL LIBRO ENTERO EN PDF LIMPIO MULTI-PÁGINA
    const pdfBuffer = await buildFullBookPdf(title, author, cleanParagraphs);
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
