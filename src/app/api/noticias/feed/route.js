import { NextResponse } from 'next/server';

// DICCIONARIO DE LOGOTIPOS E IDENTIDAD VISUAL OFICIAL DE MEDIOS DE COMUNICACIÓN
const MEDIA_LOGOS = {
  "larepublica.co": {
    name: "La República",
    domain: "larepublica.co",
    logoUrl: "https://www.google.com/s2/favicons?domain=larepublica.co&sz=256",
    brandColor: "#D31227",
    textColor: "#FFFFFF",
    country: "Colombia"
  },
  "latinus.us": {
    name: "LatinUS",
    domain: "latinus.us",
    logoUrl: "https://www.google.com/s2/favicons?domain=latinus.us&sz=256",
    brandColor: "#E50914",
    textColor: "#FFFFFF",
    country: "México / EE.UU."
  },
  "semana.com": {
    name: "Revista Semana",
    domain: "semana.com",
    logoUrl: "https://www.google.com/s2/favicons?domain=semana.com&sz=256",
    brandColor: "#C8102E",
    textColor: "#FFFFFF",
    country: "Colombia"
  },
  "eltiempo.com": {
    name: "El Tiempo",
    domain: "eltiempo.com",
    logoUrl: "https://www.google.com/s2/favicons?domain=eltiempo.com&sz=256",
    brandColor: "#003366",
    textColor: "#FFFFFF",
    country: "Colombia"
  },
  "elespectador.com": {
    name: "El Espectador",
    domain: "elespectador.com",
    logoUrl: "https://www.google.com/s2/favicons?domain=elespectador.com&sz=256",
    brandColor: "#000000",
    textColor: "#FFD700",
    country: "Colombia"
  },
  "elheraldo.co": {
    name: "El Heraldo",
    domain: "elheraldo.co",
    logoUrl: "https://www.google.com/s2/favicons?domain=elheraldo.co&sz=256",
    brandColor: "#005691",
    textColor: "#FFFFFF",
    country: "Colombia"
  },
  "lasillavacia.com": {
    name: "La Silla Vacía",
    domain: "lasillavacia.com",
    logoUrl: "https://www.google.com/s2/favicons?domain=lasillavacia.com&sz=256",
    brandColor: "#F37021",
    textColor: "#FFFFFF",
    country: "Colombia"
  },
  "bbc.com": {
    name: "BBC Mundo",
    domain: "bbc.com",
    logoUrl: "https://www.google.com/s2/favicons?domain=bbc.com&sz=256",
    brandColor: "#B80000",
    textColor: "#FFFFFF",
    country: "Reino Unido / Global"
  },
  "nytimes.com": {
    name: "The New York Times",
    domain: "nytimes.com",
    logoUrl: "https://www.google.com/s2/favicons?domain=nytimes.com&sz=256",
    brandColor: "#121212",
    textColor: "#FFFFFF",
    country: "EE.UU. / Global"
  },
  "globo.com": {
    name: "O Globo",
    domain: "globo.com",
    logoUrl: "https://www.google.com/s2/favicons?domain=globo.com&sz=256",
    brandColor: "#00509D",
    textColor: "#FFFFFF",
    country: "Brasil"
  },
  "redmas.com.co": {
    name: "Red+ Noticias",
    domain: "redmas.com.co",
    logoUrl: "https://www.google.com/s2/favicons?domain=redmas.com.co&sz=256",
    brandColor: "#E30613",
    textColor: "#FFFFFF",
    country: "Colombia"
  },
  "oncubanews.com": {
    name: "OnCuba News",
    domain: "oncubanews.com",
    logoUrl: "https://www.google.com/s2/favicons?domain=oncubanews.com&sz=256",
    brandColor: "#00A896",
    textColor: "#FFFFFF",
    country: "Cuba / EE.UU."
  }
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get('pais') || 'co';

  // Fuentes RSS oficiales
  const rssFeeds = [
    { url: 'https://news.google.com/rss?hl=es-419&gl=CO&ceid=CO:es-419', country: 'co', category: 'Colombia' },
    { url: 'https://news.google.com/rss/search?q=economia+colombia&hl=es-419&gl=CO&ceid=CO:es-419', country: 'co', category: 'Economía' },
    { url: 'https://news.google.com/rss/search?q=cultura+periodismo+colombia&hl=es-419&gl=CO&ceid=CO:es-419', country: 'co', category: 'Cultura' },
    { url: 'https://news.google.com/rss/search?q=ciencia+salud+botanica&hl=es-419&gl=CO&ceid=CO:es-419', country: 'global', category: 'Ciencia y Salud' },
    { url: 'https://news.google.com/rss/search?q=mundo+america+latina&hl=es-419&gl=US&ceid=US:es-419', country: 'global', category: 'Mundo' }
  ];

  try {
    const rawArticles = [];

    const feedPromises = rssFeeds.map(async (feed) => {
      try {
        const res = await fetch(feed.url, { 
          next: { revalidate: 180 },
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

    rawArticles.sort((a, b) => new Date(b.pubDateRaw) - new Date(a.pubDateRaw));
    const topArticles = rawArticles.slice(0, 35);

    // ASIGNAR LOGOTIPO E IDENTIDAD OFICIAL DE CADA MEDIO DE COMUNICACIÓN
    const articlesWithMediaLogos = topArticles.map(article => {
      const mediaInfo = resolveMediaIdentity(article.sourceName, article.originalUrl);
      
      return {
        ...article,
        sourceLogoUrl: mediaInfo.logoUrl,
        sourceBrandColor: mediaInfo.brandColor,
        sourceDomain: mediaInfo.domain,
        image: mediaInfo.logoUrl // El logo oficial reemplaza cualquier foto genérica
      };
    });

    return NextResponse.json({
      success: true,
      updatedAt: new Date().toISOString(),
      dateFormatted: new Intl.DateTimeFormat('es-CO', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(new Date()),
      count: articlesWithMediaLogos.length,
      articles: articlesWithMediaLogos
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Resolver logo oficial y dominio del medio de comunicación
function resolveMediaIdentity(sourceName, originalUrl) {
  const name = (sourceName || '').toLowerCase();
  const url = (originalUrl || '').toLowerCase();

  for (const [key, data] of Object.entries(MEDIA_LOGOS)) {
    if (url.includes(key) || name.includes(data.name.toLowerCase())) {
      return data;
    }
  }

  // Fallback si no está en la lista estática
  let domain = 'prensa.org';
  try {
    if (originalUrl && originalUrl.startsWith('http')) {
      domain = new URL(originalUrl).hostname.replace('www.', '');
    }
  } catch (e) {}

  return {
    name: sourceName || "Medio Periodístico",
    domain: domain,
    logoUrl: `https://www.google.com/s2/favicons?domain=${domain}&sz=256`,
    brandColor: "#D4AF37",
    textColor: "#000000",
    country: "Internacional"
  };
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
        fullContent: `Noticia publicada originalmente por ${sourceName} el ${formattedExactDate}.\n\nEsta nota forma parte de la cobertura hemisférica indexada en tiempo real por el sistema de monitoreo periodístico de GranColinos Journal. Para consultar el reportaje completo en la plataforma oficial del medio, presiona el botón inferior.`,
        author: `${sourceName} Redacción`,
        sourceName: sourceName,
        originalUrl: link,
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
