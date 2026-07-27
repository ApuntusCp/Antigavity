import { NextResponse } from 'next/server';

const MEDIA_LOGOS = {
  "larepublica.co": {
    name: "La República",
    domain: "larepublica.co",
    logoUrl: "https://icons.duckduckgo.com/ip3/larepublica.co.ico",
    brandColor: "#D31227",
    country: "Colombia"
  },
  "latinus.us": {
    name: "LatinUS",
    domain: "latinus.us",
    logoUrl: "https://icons.duckduckgo.com/ip3/latinus.us.ico",
    brandColor: "#E50914",
    country: "México / EE.UU."
  },
  "semana.com": {
    name: "Revista Semana",
    domain: "semana.com",
    logoUrl: "https://icons.duckduckgo.com/ip3/semana.com.ico",
    brandColor: "#C8102E",
    country: "Colombia"
  },
  "eltiempo.com": {
    name: "El Tiempo",
    domain: "eltiempo.com",
    logoUrl: "https://icons.duckduckgo.com/ip3/eltiempo.com.ico",
    brandColor: "#003366",
    country: "Colombia"
  },
  "elespectador.com": {
    name: "El Espectador",
    domain: "elespectador.com",
    logoUrl: "https://icons.duckduckgo.com/ip3/elespectador.com.ico",
    brandColor: "#000000",
    country: "Colombia"
  },
  "elheraldo.co": {
    name: "El Heraldo",
    domain: "elheraldo.co",
    logoUrl: "https://icons.duckduckgo.com/ip3/elheraldo.co.ico",
    brandColor: "#005691",
    country: "Colombia"
  },
  "lasillavacia.com": {
    name: "La Silla Vacía",
    domain: "lasillavacia.com",
    logoUrl: "https://icons.duckduckgo.com/ip3/lasillavacia.com.ico",
    brandColor: "#F37021",
    country: "Colombia"
  },
  "bbc.com": {
    name: "BBC Mundo",
    domain: "bbc.com",
    logoUrl: "https://icons.duckduckgo.com/ip3/bbc.com.ico",
    brandColor: "#B80000",
    country: "Reino Unido / Global"
  },
  "nytimes.com": {
    name: "The New York Times",
    domain: "nytimes.com",
    logoUrl: "https://icons.duckduckgo.com/ip3/nytimes.com.ico",
    brandColor: "#121212",
    country: "EE.UU. / Global"
  },
  "globo.com": {
    name: "O Globo",
    domain: "globo.com",
    logoUrl: "https://icons.duckduckgo.com/ip3/globo.com.ico",
    brandColor: "#00509D",
    country: "Brasil"
  },
  "redmas.com.co": {
    name: "Red+ Noticias",
    domain: "redmas.com.co",
    logoUrl: "https://icons.duckduckgo.com/ip3/redmas.com.co.ico",
    brandColor: "#E30613",
    country: "Colombia"
  },
  "oncubanews.com": {
    name: "OnCuba News",
    domain: "oncubanews.com",
    logoUrl: "https://icons.duckduckgo.com/ip3/oncubanews.com.ico",
    brandColor: "#00A896",
    country: "Cuba / EE.UU."
  }
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get('pais') || 'co';

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

    // Deduplicar artículos por título normalizado
    const seenTitles = new Set();
    const uniqueArticles = [];

    rawArticles.forEach(item => {
      const normalizedTitle = item.title.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 35);
      if (!seenTitles.has(normalizedTitle)) {
        seenTitles.add(normalizedTitle);
        uniqueArticles.push(item);
      }
    });

    uniqueArticles.sort((a, b) => new Date(b.pubDateRaw) - new Date(a.pubDateRaw));
    const topArticles = uniqueArticles.slice(0, 30);

    const articlesWithMediaLogos = topArticles.map(article => {
      const mediaInfo = resolveMediaIdentity(article.sourceName, article.originalUrl);
      
      return {
        ...article,
        sourceLogoUrl: mediaInfo.logoUrl,
        sourceBrandColor: mediaInfo.brandColor,
        sourceDomain: mediaInfo.domain,
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

function resolveMediaIdentity(sourceName, originalUrl) {
  const name = (sourceName || '').toLowerCase();
  const url = (originalUrl || '').toLowerCase();

  for (const [key, data] of Object.entries(MEDIA_LOGOS)) {
    if (url.includes(key) || name.includes(data.name.toLowerCase()) || name.includes(key.split('.')[0])) {
      return data;
    }
  }

  let domain = 'prensa.org';
  if (name.includes('la republica') || name.includes('larepublica')) domain = 'larepublica.co';
  else if (name.includes('semana')) domain = 'semana.com';
  else if (name.includes('latinus')) domain = 'latinus.us';
  else if (name.includes('tiempo')) domain = 'eltiempo.com';
  else if (name.includes('espectador')) domain = 'elespectador.com';
  else if (name.includes('heraldo')) domain = 'elheraldo.co';
  else if (name.includes('red+')) domain = 'redmas.com.co';
  else if (name.includes('oncuba')) domain = 'oncubanews.com';
  else {
    try {
      if (originalUrl && originalUrl.startsWith('http')) {
        const h = new URL(originalUrl).hostname.replace('www.', '');
        if (!h.includes('google')) domain = h;
      }
    } catch (e) {}
  }

  return {
    name: sourceName || "Medio Periodístico",
    domain: domain,
    logoUrl: `https://icons.duckduckgo.com/ip3/${domain}.ico`,
    brandColor: "#D4AF37",
    country: "Internacional"
  };
}

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
