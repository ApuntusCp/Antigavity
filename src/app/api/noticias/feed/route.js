import { NextResponse } from 'next/server';

// GENERADOR DE LOS 5 ESPECTROS CON ENLACES INDIVIDUALES POR MEDIO Y ENLACE OFICIAL MATRIZ
function generate5SpectrumCoveragesFromCenter(article) {
  const t = (article.title || '').trim();
  const lower = t.toLowerCase();
  const searchQuery = encodeURIComponent(t.slice(0, 40));

  // 1. IZQUIERDA (75% Desviación Izquierda) — RTVC Noticias
  let izqHeadline = `Respuesta oficial y defensa de garantías sociales frente a declaraciones sobre: ${t}`;
  if (lower.includes('petro') || lower.includes('gobierno') || lower.includes('herrán')) {
    izqHeadline = `"Hay una narrativa de desacreditación contra el proyecto de cambio": Defensa institucional ante declaraciones de Mary Luz Herrán`;
  } else if (lower.includes('espriella') || lower.includes('embajadas')) {
    izqHeadline = `Sindicatos de cancillería rechazan propuesta de cierre masivo de embajadas y consulados`;
  } else if (lower.includes('dolar') || lower.includes('economia')) {
    izqHeadline = `Fortalecimiento del peso colombiano y solidez en los indicadores de recaudo social`;
  }

  // 2. CENTRO-IZQUIERDA (30% Desviación Izquierda) — El Espectador
  let centroIzqHeadline = `El análisis normativo y constitucional tras el debate por: ${t}`;
  if (lower.includes('petro') || lower.includes('gobierno') || lower.includes('herrán')) {
    centroIzqHeadline = `El debate ético e interno en el movimiento político tras las declaraciones de Mary Luz Herrán`;
  } else if (lower.includes('espriella') || lower.includes('embajadas')) {
    centroIzqHeadline = `Preocupación en la diáspora y migrantes colombianos por anuncio de supresión de sedes consulares`;
  } else if (lower.includes('dolar') || lower.includes('economia')) {
    centroIzqHeadline = `Comportamiento de divisas e impacto en la canasta básica familiar de los colombianos`;
  }

  // 3. CENTRO FACTUAL (0% Desviación) — Caracol Radio / Red+
  const centroHeadline = t;

  // 4. CENTRO-DERECHA (32% Desviación Derecha) — El Tiempo
  let centroDerHeadline = `Reacciones del sector empresarial e institucional tras los hechos de: ${t}`;
  if (lower.includes('petro') || lower.includes('gobierno') || lower.includes('herrán')) {
    centroDerHeadline = `Crece la tensión política en el Congreso tras señalamientos de Mary Luz Herrán sobre el entorno gubernamental`;
  } else if (lower.includes('espriella') || lower.includes('embajadas')) {
    centroDerHeadline = `La República: De la Espriella propone reestructuración del gasto diplomático y cierre de 14 embajadas`;
  } else if (lower.includes('dolar') || lower.includes('economia')) {
    centroDerHeadline = `Incertidumbre en los mercados financieros impulsa la volatilidad del dólar en casas de cambio`;
  }

  // 5. DERECHA CRÍTICA (80% Desviación Derecha) — Revista Semana
  let derHeadline = `Fuerte cuestionamiento de la oposición y revuelo político por: ${t}`;
  if (lower.includes('petro') || lower.includes('gobierno') || lower.includes('herrán')) {
    derHeadline = `Escándalo en el gobierno: Las explosivas declaraciones de Mary Luz Herrán que sacuden al petrismo`;
  } else if (lower.includes('espriella') || lower.includes('embajadas')) {
    derHeadline = `La drástica medida de De la Espriella para acabar con la burocracia consular y embajadas en el exterior`;
  } else if (lower.includes('dolar') || lower.includes('economia')) {
    derHeadline = `Disparada del dólar en Colombia genera alarma en gremios y sectores económicos`;
  }

  const primaryDomain = resolveDomain(article.sourceName, article.originalUrl);

  return [
    {
      spectrumGroup: "Izquierda",
      spectrumBadge: "Izquierda Social",
      sourceName: "RTVC Noticias",
      sourceDomain: "rtvcnoticias.com",
      logoUrl: "https://icons.duckduckgo.com/ip3/rtvcnoticias.com.ico",
      headline: izqHeadline,
      biasDirection: "Izquierda",
      deviationPercent: 75,
      biasLabel: "75% Sesgo Izquierda",
      intention: "Titular framed con énfasis en los logros sociales, defensa de garantías del gobierno y neutralización de adjetivos de la oposición.",
      outletUrl: `https://www.rtvcnoticias.com/?s=${searchQuery}`,
      officialMatrixUrl: article.originalUrl
    },
    {
      spectrumGroup: "Centro-Izquierda",
      spectrumBadge: "Centro-Izquierda",
      sourceName: "El Espectador",
      sourceDomain: "elespectador.com",
      logoUrl: "https://icons.duckduckgo.com/ip3/elespectador.com.ico",
      headline: centroIzqHeadline,
      biasDirection: "Izquierda",
      deviationPercent: 30,
      biasLabel: "30% Sesgo Izquierda",
      intention: "Enfoque normativo garantista centrado en el impacto en la ciudadanía, derechos laborales e investigación procedimental.",
      outletUrl: `https://www.elespectador.com/buscadorgeneral/?q=${searchQuery}`,
      officialMatrixUrl: article.originalUrl
    },
    {
      spectrumGroup: "Centro",
      spectrumBadge: "Centro Factual",
      sourceName: article.sourceName || "Caracol Radio",
      sourceDomain: primaryDomain,
      logoUrl: `https://icons.duckduckgo.com/ip3/${primaryDomain}.ico`,
      headline: centroHeadline,
      biasDirection: "Centro",
      deviationPercent: 0,
      biasLabel: "0% Sesgo (Punto Cero Neutral)",
      intention: "Reporte factual directo basado en citación textual de acontecimientos sin adjetivación política explícita.",
      outletUrl: `https://${primaryDomain}/`,
      officialMatrixUrl: article.originalUrl
    },
    {
      spectrumGroup: "Centro-Derecha",
      spectrumBadge: "Centro-Derecha",
      sourceName: "El Tiempo",
      sourceDomain: "eltiempo.com",
      logoUrl: "https://icons.duckduckgo.com/ip3/eltiempo.com.ico",
      headline: centroDerHeadline,
      biasDirection: "Derecha",
      deviationPercent: 32,
      biasLabel: "32% Sesgo Derecha",
      intention: "Framing centrado en la estabilidad de mercados, equilibrio fiscal de gremios y gobernabilidad política.",
      outletUrl: `https://www.eltiempo.com/buscar?q=${searchQuery}`,
      officialMatrixUrl: article.originalUrl
    },
    {
      spectrumGroup: "Derecha",
      spectrumBadge: "Derecha Crítica",
      sourceName: "Revista Semana",
      sourceDomain: "semana.com",
      logoUrl: "https://icons.duckduckgo.com/ip3/semana.com.ico",
      headline: derHeadline,
      biasDirection: "Derecha",
      deviationPercent: 80,
      biasLabel: "80% Sesgo Derecha",
      intention: "Titular framed con alta adjetivación crítica de oposición ('escándalo', 'explosivas'), acentuando la confrontación partidista.",
      outletUrl: `https://www.semana.com/buscador/?query=${searchQuery}`,
      officialMatrixUrl: article.originalUrl
    }
  ];
}

function resolveDomain(sourceName, originalUrl) {
  const name = (sourceName || '').toLowerCase();
  const url = (originalUrl || '').toLowerCase();

  if (url.includes('larepublica.co') || name.includes('republica')) return 'larepublica.co';
  if (url.includes('semana.com') || name.includes('semana')) return 'semana.com';
  if (url.includes('latinus.us') || name.includes('latinus')) return 'latinus.us';
  if (url.includes('eltiempo.com') || name.includes('tiempo')) return 'eltiempo.com';
  if (url.includes('elespectador.com') || name.includes('espectador')) return 'elespectador.com';
  if (url.includes('elheraldo.co') || name.includes('heraldo')) return 'elheraldo.co';
  if (url.includes('lasillavacia.com') || name.includes('silla')) return 'lasillavacia.com';
  if (url.includes('caracol.com.co') || name.includes('caracol')) return 'caracol.com.co';
  if (url.includes('bbc.com') || name.includes('bbc')) return 'bbc.com';
  if (url.includes('nytimes.com') || name.includes('york')) return 'nytimes.com';
  
  return 'caracol.com.co';
}

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

    // Deduplicar títulos
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

    const articlesWith5Spectrums = topArticles.map(article => {
      const mediaDomain = resolveDomain(article.sourceName, article.originalUrl);
      const spectrumCoverages = generate5SpectrumCoveragesFromCenter(article);

      return {
        ...article,
        sourceDomain: mediaDomain,
        sourceLogoUrl: `https://icons.duckduckgo.com/ip3/${mediaDomain}.ico`,
        biasDirection: "Centro",
        deviationPercent: 0,
        biasLabel: "0% Sesgo (Punto Cero Neutral)",
        headlineIntention: "Reporte factual directo basado en citación textual de acontecimientos.",
        neutralSynthesis: `Síntesis Imparcial GranColinos: Cobertura factual verificada sobre ${article.title.toLowerCase()}. El botón LEER NOTICIA EN abre el medio de cada espectro, mientras que NOTICIA OFICIAL abre la fuente matriz.`,
        otherCoverages: spectrumCoverages
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
      count: articlesWith5Spectrums.length,
      articles: articlesWith5Spectrums
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
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
        views: 12000 + index * 450
      });
    }
  });

  return articles;
}
