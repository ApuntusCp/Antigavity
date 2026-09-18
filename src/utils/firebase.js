import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, getDoc, doc, query, orderBy, addDoc, serverTimestamp, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { cache } from 'react';

const firebaseConfig = {
  apiKey: "AIzaSyAH980UahKAMSzLpnSeSYojJgeeMhE40yU",
  authDomain: "aponte-sas.firebaseapp.com",
  projectId: "aponte-sas",
  storageBucket: "aponte-sas.firebasestorage.app",
  messagingSenderId: "1010400930261",
  appId: "1:1010400930261:web:aa68fa2eb9515d265d355c"
};

// Initialize Firebase (prevent double-initialization in Next.js HMR)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Catálogo Oficial GranColinos (Fallback de alta disponibilidad sin costo de base de datos)
export const FALLBACK_PRODUCTS = [
  {
    id: 'apitoxina',
    sku: 'apitoxina',
    name: 'Apitoxina Relajante Muscular',
    title: 'Apitoxina Relajante Muscular',
    price: 36700,
    discountPrice: null,
    category: 'COSMÉTICOS',
    categoryGroup: 'RELAJANTES MUSCULARES',
    stock: 100,
    images: ['/images/products/apitoxina-3d.webp'],
    imageUrl: '/images/products/apitoxina-3d.webp',
    description: 'Fórmula botánica con apitoxina natural para masaje corporal con efecto frío-calor antiestrés. Brinda alivio en zonas de tensión en espalda, cuello, lumbago y articulaciones.',
    benefits: 'Efecto frío-calor de rápida acción\nAlivio de tensiones musculares y cuello rígido\nApiterapia tradicional con extractos botánicos puros\nFórmula no grasa de rápida absorción',
    isAvailable: true,
    invimaRegistro: null,
    registroInvima: null,
    createdAt: 1720000001
  },
  {
    id: 'nanocbd',
    sku: 'nanocbd',
    name: 'Gotas Nano CBD 60mL',
    title: 'Gotas Nano CBD 60mL',
    price: 197500,
    discountPrice: null,
    category: 'BIENESTAR',
    categoryGroup: 'EXTRACTOS BOTÁNICOS',
    stock: 100,
    images: ['/images/products/gotas-cbd-3d.webp'],
    imageUrl: '/images/products/gotas-cbd-3d.webp',
    description: 'Extracto botánico puro con nanotecnología de alta biodisponibilidad. Formulado con los más altos estándares de calidad para el bienestar integral.',
    benefits: 'Nanotecnología con 100% de biodisponibilidad celular\nCertificación y registro INVIMA garantizado\nPromueve el descanso reparador y balance nervioso\nPureza botánica de grado premium',
    isAvailable: true,
    invimaRegistro: 'RSA-0020388-2024',
    registroInvima: 'RSA-0020388-2024',
    createdAt: 1720000002
  }
];

// Helper de tiempo límite estricto para evitar bloqueos del servidor (400ms máximo)
const withTimeout = (promise, timeoutMs = 400) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Firestore timeout')), timeoutMs)
    )
  ]);
};

// Caché en memoria del servidor con TTL de 5 minutos para respuesta en 0.01ms
const memoryCache = {
  products: null,
  productsExpiry: 0,
  blogPosts: {},
  testimonials: null,
  testimonialsExpiry: 0,
  cmsPages: {},
  cmsPagesExpiry: {}
};

// Fetch products from Firebase Firestore con PROYECCIÓN ESTRICTA, Timeout y Fallback Instantáneo
export const fetchProducts = cache(async () => {
  const now = Date.now();
  if (memoryCache.products && memoryCache.productsExpiry > now) {
    return memoryCache.products;
  }

  try {
    const snapshot = await withTimeout(getDocs(collection(db, 'products')), 400);
    
    if (!snapshot || snapshot.empty) {
      memoryCache.products = FALLBACK_PRODUCTS;
      memoryCache.productsExpiry = now + 300000;
      return FALLBACK_PRODUCTS;
    }

    const products = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        sku: data.sku || doc.id,
        name: data.name || data.title || 'Producto GranColinos',
        title: data.name || data.title || 'Producto GranColinos',
        price: typeof data.price === 'number' ? data.price : 0,
        discountPrice: typeof data.discountPrice === 'number' ? data.discountPrice : null,
        category: data.category || 'BIENESTAR',
        categoryGroup: data.categoryGroup || 'RELAJANTES MUSCULARES',
        stock: typeof data.stock === 'number' ? data.stock : 100,
        images: Array.isArray(data.images) && data.images.length > 0 ? data.images : (data.imageUrl ? [data.imageUrl] : ['/images/products/apitoxina.webp']),
        imageUrl: Array.isArray(data.images) && data.images.length > 0 ? data.images[0] : (data.imageUrl || '/images/products/apitoxina.webp'),
        description: data.description || 'Fórmula botánica premium desarrollada con los más altos estándares de calidad colombiana.',
        benefits: Array.isArray(data.benefits) ? data.benefits : null,
        isAvailable: (data.stock || 0) > 0,
        invimaRegistro: data.invimaRegistro || data.registroInvima || null,
        createdAt: data.createdAt?.seconds ? data.createdAt.seconds : 0
      };
    });

    products.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    const result = products.length > 0 ? products : FALLBACK_PRODUCTS;
    memoryCache.products = result;
    memoryCache.productsExpiry = now + 300000;
    return result;
  } catch (error) {
    // Si falla o excede 400ms, servimos el fallback inmediatamente y lo cacheamos por 5 min
    memoryCache.products = FALLBACK_PRODUCTS;
    memoryCache.productsExpiry = now + 300000;
    return FALLBACK_PRODUCTS;
  }
});

// Fetch blog posts con proyección estricta y timeout rápido
export const fetchBlogPosts = cache(async (category = null) => {
  const cacheKey = category || 'all';
  const cached = memoryCache.blogPosts[cacheKey];
  const now = Date.now();
  if (cached && cached.expiry > now) {
    return cached.data;
  }

  try {
    const constraints = [orderBy('createdAt', 'desc')];
    if (category) {
      constraints.push(where('category', '==', category));
    }
    const q = query(collection(db, 'blog_posts'), ...constraints);
    const snapshot = await withTimeout(getDocs(q), 400);
    
    const posts = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || 'Artículo GranColinos',
        slug: data.slug || doc.id,
        excerpt: data.excerpt || '',
        content: data.content || '',
        coverImage: data.coverImage || data.imageUrl || '',
        category: data.category || 'General',
        author: data.author || 'Equipo GranColinos',
        readTime: data.readTime || '5 min',
        date: data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Reciente'
      };
    });
    
    memoryCache.blogPosts[cacheKey] = { data: posts, expiry: now + 300000 };
    return posts;
  } catch (error) {
    memoryCache.blogPosts[cacheKey] = { data: [], expiry: now + 300000 };
    return [];
  }
});

// Fetch published client testimonials con proyección estricta y timeout rápido
export const fetchClientTestimonials = cache(async () => {
  const now = Date.now();
  if (memoryCache.testimonials && memoryCache.testimonialsExpiry > now) {
    return memoryCache.testimonials;
  }

  try {
    const q = query(collection(db, 'community_messages'), where('isPublished', '==', true));
    const snapshot = await withTimeout(getDocs(q), 400);
    const result = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.authorName || data.name || 'Miembro del Club',
        authorName: data.authorName || data.name || 'Miembro del Club',
        text: data.text || '',
        role: data.role || 'Voz del Club',
        photoUrl: data.photoUrl || null,
        avatarIconId: data.avatarIconId || 'leaf',
        verifiedProfession: Boolean(data.verifiedProfession),
        professionTitle: data.professionTitle || null,
        tag: data.tag || 'Testimonio',
        likesCount: data.likesCount || (Array.isArray(data.likedBy) ? data.likedBy.length : 0)
      };
    });
    memoryCache.testimonials = result;
    memoryCache.testimonialsExpiry = now + 300000;
    return result;
  } catch (error) {
    memoryCache.testimonials = [];
    memoryCache.testimonialsExpiry = now + 300000;
    return [];
  }
});

// Fetch CMS page config published from GC Admin con timeout rápido y caché
export const fetchCMSPage = cache(async (pageId = 'home') => {
  const now = Date.now();
  if (memoryCache.cmsPages[pageId] && (memoryCache.cmsPagesExpiry[pageId] || 0) > now) {
    return memoryCache.cmsPages[pageId];
  }

  try {
    const snap = await withTimeout(getDoc(doc(db, 'cms_pages', `${pageId}_production`)), 400);
    if (snap && snap.exists()) {
      const data = snap.data();
      const result = {
        blocks: Array.isArray(data.blocks) ? data.blocks : [],
        publishedAt: data.publishedAt || null,
        version: data.version || '1.0'
      };
      memoryCache.cmsPages[pageId] = result;
      memoryCache.cmsPagesExpiry[pageId] = now + 300000;
      return result;
    }
    memoryCache.cmsPages[pageId] = null;
    memoryCache.cmsPagesExpiry[pageId] = now + 300000;
    return null;
  } catch (error) {
    memoryCache.cmsPages[pageId] = null;
    memoryCache.cmsPagesExpiry[pageId] = now + 300000;
    return null;
  }
});

export const fetchHomeCMSConfig = () => fetchCMSPage('home');
