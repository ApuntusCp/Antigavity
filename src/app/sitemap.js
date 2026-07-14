import { collection, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';

export default async function sitemap() {
  const baseUrl = 'https://grancolinos.com';

  // Get all products to build dynamic URLs
  let products = [];
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    products = querySnapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error("Error generating sitemap for products:", error);
  }

  const productUrls = products.map((product) => ({
    url: `${baseUrl}/product/${encodeURIComponent(product.sku)}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  const staticUrls = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terminos-de-servicio`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/habeas-data`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  return [...staticUrls, ...productUrls];
}
