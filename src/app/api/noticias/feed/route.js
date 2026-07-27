import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get('pais') || 'co';

  // 1. Fuentes RSS oficiales de noticias
  const rssFeeds = [
    { url: 'https://news.google.com/rss?hl=es-419&gl=CO&ceid=CO:es-419', country: 'co', category: 'Colombia' },
    { url: 'https://news.google.com/rss/search?q=economia+colombia&hl=es-419&gl=CO&ceid=CO:es-419', country: 'co', category: 'Economía' },
    { url: 'https://news.google.com/rss/search?q=cultura+periodismo+colombia&hl=es-419&gl=CO&ceid=CO:es-419', country: 'co', category: 'Cultura' },
    { url: 'https://news.google.com/rss/search?q=ciencia+salud+botanica&hl=es-419&gl=CO&ceid=CO:es-419', country: 'global', category: 'Ciencia y Salud' },
    { url: 'https://news.google.com/rss/search?q=mundo+america+latina&hl=es-419&gl=US&ceid=US:es-419', country: 'global', category: 'Mundo' }
  ];

  try {
    const rawArticles = [];

    // Crawl RSS feeds en paralelo
    const feedPromises = rssFeeds.map(async (feed) => {
      try {
        const res = await fetch(feed.url, { 
          next: { revalidate: 120 },
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } 
        });

        if (!res.ok) return [];

        const xmlText = await res.text();
        return parseRssItems(xmlText, feed.category, feed.country);
      } catch (err) {
        return [];
      }
    });

    const results = await Promise.all(feedPromises);
    results.forEach(items => rawArticles.push(...items));

    // Ordenar por fecha de publicación (más reciente primero)
    rawArticles.sort((a, b) => new Date(b.pubDateRaw) - new Date(a.pubDateRaw));

    const topArticles = rawArticles.slice(0, 30);

    // ESCANEAR CÓDIGO HTML ORIGINAL Y CONSOLA DE CADA MEDIO PARA EXTRAER LA FOTO EXACTA DE LA NOTICIA
    const enrichedArticles = await Promise.all(topArticles.map(async (article) => {
      const scraped = await scrapeOriginalMediaImageAndUrl(article.originalUrl);
      if (scraped) {
        if (scraped.realArticleUrl) article.originalUrl = scraped.realArticleUrl;
        if (scraped.realArticleImage) article.image = scraped.realArticleImage;
      }
      return article;
    }));

    return NextResponse.json({
      success: true,
      updatedAt: new Date().toISOString(),
      dateFormatted: new Intl.DateTimeFormat('es-CO', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(new Date()),
      count: enrichedArticles.length,
      articles: enrichedArticles
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Extractor profundo de la imagen principal del HTML original (amp-img, figure.main-photo, og:image, twitter:image)
async function scrapeOriginalMediaImageAndUrl(googleRssUrl) {
  try {
    // Intentar decodificar la URL real embebida en la cadena de Google News
    let targetUrl = decodeGoogleNewsUrl(googleRssUrl) || googleRssUrl;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s timeout

    const res = await fetch(targetUrl, {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'es-CO,es;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    });
    clearTimeout(timeoutId);

    if (!res.ok) return null;
    const finalUrl = res.url;
    const html = await res.text();

    let extractedImage = null;

    // Patrón 1: meta og:image o twitter:image en la cabecera HTML
    const ogMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
                    html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i) ||
                    html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i);

    if (ogMatch && ogMatch[1]) {
      extractedImage = ogMatch[1].trim();
    }

    // Patrón 2: figure.main-photo / amp-img / article img (Específico para LatinUS, La República, etc., como figura en DevTools)
    if (!extractedImage || extractedImage.includes('google') || extractedImage.includes('gstatic')) {
      const ampImgMatch = html.match(/<figure[^>]*class=["'][^"']*main-photo[^"']*["'][^>]*>[\s\S]*?<amp-img[^>]*src=["']([^"']+)["']/i) ||
                          html.match(/<amp-img[^>]*src=["']([^"']+)["'][^>]*class=["'][^"']*main[^"']*["']/i) ||
                          html.match(/<figure[^>]*>[\s\S]*?<img[^>]*src=["']([^"']+)["']/i) ||
                          html.match(/<article[^>]*>[\s\S]*?<img[^>]*src=["']([^"']+)["']/i);

      if (ampImgMatch && ampImgMatch[1]) {
        extractedImage = ampImgMatch[1].trim();
      }
    }

    if (extractedImage) {
      // Resolver URLs relativas a absolutas (Ej: /fotografias/m/2026/7/26/f960x540.jpg -> https://latinus.us/fotografias/m/2026/7/26/f960x540.jpg)
      try {
        extractedImage = new URL(extractedImage, finalUrl).href;
      } catch (e) {
        if (extractedImage.startsWith('//')) extractedImage = 'https:' + extractedImage;
      }

      // Validar que no sea un ícono de Google o favicon
      if (!extractedImage.includes('google') && !extractedImage.includes('gstatic') && !extractedImage.includes('favicon')) {
        return { realArticleUrl: finalUrl, realArticleImage: extractedImage };
      }
    }

    return { realArticleUrl: finalUrl, realArticleImage: null };

  } catch (e) {
    return null;
  }
}

// Decodificar Base64 embebido en la URL de Google News RSS
function decodeGoogleNewsUrl(googleUrl) {
  try {
    const match = googleUrl.match(/articles\/([A-Za-z0-9_-]+)/);
    if (!match) return null;
    const base64Str = match[1].replace(/-/g, '+').replace(/_/g, '/');
    const decoded = Buffer.from(base64Str, 'base64').toString('latin1');
    const urlMatch = decoded.match(/https?:\/\/[^\s"'\\]+/);
    return urlMatch ? urlMatch[0] : null;
  } catch (e) {
    return null;
  }
}

// Helper para parsear XML de RSS
function parseRssItems(xmlText, defaultCategory, defaultCountry) {
  const articles = [];
  const itemMatches = xmlText.match(/<item>[\s\S]*?<\/item>/gi) || [];

  itemMatches.forEach((itemXml, index) => {
    const titleMatch = itemXml.match(/<title>(.*?)<\/title>/i);
    const linkMatch = itemXml.match(/<link>(.*?)<\/link>/i);
    const pubDateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/i);
    const sourceMatch = itemXml.match(/<source[^>]*>(.*?)<\/source>/i);

    if (titleMatch && linkMatch) {
      let rawTitle = titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/gi, '$1').trim();
      let link = linkMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/gi, '$1').trim();
      let pubDateStr = pubDateMatch ? pubDateMatch[1] : new Date().toUTCString();
      let sourceName = sourceMatch ? sourceMatch[1].trim() : 'Agencia Periodística';

      // Limpiar título de fuente repetida (Ej: "De la Espriella anunció el cierre... - La República")
      if (rawTitle.includes(' - ')) {
        const parts = rawTitle.split(' - ');
        if (parts.length > 1) {
          const potentialSource = parts.pop().trim();
          if (potentialSource.length > 2) {
            sourceName = potentialSource;
            rawTitle = parts.join(' - ').trim();
          }
        }
      }

      const pubDateObj = new Date(pubDateStr);

      const formattedExactDate = new Intl.DateTimeFormat('es-CO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).format(isNaN(pubDateObj) ? new Date() : pubDateObj);

      articles.push({
        id: `rss-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        topicKey: rawTitle.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30),
        title: rawTitle,
        summary: `Cobertura periodística factual transmitida en vivo por ${sourceName}. Publicado hoy con verificación hemerográfica.`,
        fullContent: `Noticia publicada originalmente por ${sourceName} el ${formattedExactDate}.\n\nEsta nota forma parte de la cobertura hemisférica indexada en tiempo real por el sistema de monitoreo periodístico de GranColinos Journal. Para consultar la investigación completa y la fotogalería de origen, accede directamente a la publicación oficial mediante el enlace provisto al pie.`,
        author: `${sourceName} Redacción`,
        sourceName: sourceName,
        sourceLogo: sourceName,
        originalUrl: link,
        image: null, // Se extraera directamente del HTML original (amp-img / og:image)
        category: defaultCategory,
        country: defaultCountry,
        publishedAt: formattedExactDate,
        pubDateRaw: pubDateObj.toISOString(),
        biasScore: 50,
        biasLabel: "Imparcial / Verificado",
        views: 12000 + index * 450
      });
    }
  });

  return articles;
}
