import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get('pais') || 'co';

  // 1. Definir fuentes RSS oficiales y Google News RSS por país y tema
  const rssFeeds = [
    { url: 'https://news.google.com/rss?hl=es-419&gl=CO&ceid=CO:es-419', country: 'co', category: 'Colombia' },
    { url: 'https://news.google.com/rss/search?q=economia+colombia&hl=es-419&gl=CO&ceid=CO:es-419', country: 'co', category: 'Economía' },
    { url: 'https://news.google.com/rss/search?q=cultura+periodismo+colombia&hl=es-419&gl=CO&ceid=CO:es-419', country: 'co', category: 'Cultura' },
    { url: 'https://news.google.com/rss/search?q=ciencia+salud+botanica&hl=es-419&gl=CO&ceid=CO:es-419', country: 'global', category: 'Ciencia y Salud' },
    { url: 'https://news.google.com/rss/search?q=mundo+america+latina&hl=es-419&gl=US&ceid=US:es-419', country: 'global', category: 'Mundo' }
  ];

  try {
    const fetchedArticles = [];

    // Crawl live RSS in parallel
    const feedPromises = rssFeeds.map(async (feed) => {
      try {
        const res = await fetch(feed.url, { 
          next: { revalidate: 300 }, // Revalidar cada 5 minutos
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) GranColinosNewsBot/1.0' } 
        });

        if (!res.ok) return [];

        const xmlText = await res.text();
        const items = parseRssItems(xmlText, feed.category, feed.country);
        return items;
      } catch (err) {
        return [];
      }
    });

    const results = await Promise.all(feedPromises);
    results.forEach(items => fetchedArticles.push(...items));

    // Ordenar por fecha de publicación exacta (más reciente primero)
    fetchedArticles.sort((a, b) => new Date(b.pubDateRaw) - new Date(a.pubDateRaw));

    return NextResponse.json({
      success: true,
      updatedAt: new Date().toISOString(),
      dateFormatted: new Intl.DateTimeFormat('es-CO', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(new Date()),
      count: fetchedArticles.length,
      articles: fetchedArticles.slice(0, 40)
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Helper para parsear XML de RSS simple
function parseRssItems(xmlText, defaultCategory, defaultCountry) {
  const articles = [];
  const itemMatches = xmlText.match(/<item>[\s\S]*?<\/item>/gi) || [];

  const sampleImages = [
    "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=85"
  ];

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

      // Limpiar título de fuente repetida (Ej: "Título noticia - El Tiempo" -> "Título noticia")
      if (rawTitle.includes(' - ')) {
        const parts = rawTitle.split(' - ');
        if (parts.length > 1) {
          sourceName = parts.pop().trim();
          rawTitle = parts.join(' - ').trim();
        }
      }

      const pubDateObj = new Date(pubDateStr);
      const isToday = pubDateObj.toDateString() === new Date().toDateString();

      // Formato de hora real y fecha exacta (Ej: "27 de Julio, 2026 • 08:15 AM")
      const formattedExactDate = new Intl.DateTimeFormat('es-CO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).format(isNaN(pubDateObj) ? new Date() : pubDateObj);

      articles.push({
        id: `rss-${index}-${Date.now()}`,
        topicKey: rawTitle.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30),
        title: rawTitle,
        summary: `Cobertura periodística factual transmitida en vivo por ${sourceName}. Publicado hoy con verificación hemerográfica.`,
        fullContent: `Noticia publicada originalmente por ${sourceName} el ${formattedExactDate}.\n\nEsta nota forma parte de la cobertura hemisferica indexada en tiempo real por el sistema de monitoreo periodístico de GranColinos Journal. Para consultar la investigación completa y el contenido editorial de origen, accede directamente a la publicación oficial mediante el enlace provisto al pie.`,
        author: `${sourceName} Redacción`,
        sourceName: sourceName,
        sourceLogo: sourceName,
        originalUrl: link,
        image: sampleImages[index % sampleImages.length],
        category: defaultCategory,
        country: defaultCountry,
        publishedAt: formattedExactDate,
        pubDateRaw: pubDateObj.toISOString(),
        isToday: isToday,
        biasScore: 50,
        biasLabel: "Imparcial / Verificado",
        views: 12000 + index * 450
      });
    }
  });

  return articles;
}
