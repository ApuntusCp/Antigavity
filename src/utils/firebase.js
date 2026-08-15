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

// Fetch products from Firebase Firestore con PROYECCIÓN ESTRICTA (Sin sobre-exposición de datos)
export const fetchProducts = cache(async () => {
  try {
    const snapshot = await getDocs(collection(db, 'products'));
    
    const products = snapshot.docs.map(doc => {
      const data = doc.data();
      // Sanitización estricta: solo devolvemos campos públicos de presentación
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
        images: Array.isArray(data.images) && data.images.length > 0 ? data.images : (data.imageUrl ? [data.imageUrl] : []),
        imageUrl: Array.isArray(data.images) && data.images.length > 0 ? data.images[0] : (data.imageUrl || ''),
        description: data.description || 'Fórmula botánica premium desarrollada con los más altos estándares de calidad colombiana.',
        benefits: Array.isArray(data.benefits) ? data.benefits : null,
        isAvailable: (data.stock || 0) > 0,
        createdAt: data.createdAt?.seconds ? data.createdAt.seconds : 0
      };
    });

    products.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    return products;
  } catch (error) {
    console.error("Error fetching products from Firebase:", error);
    return [];
  }
});

// Fetch blog posts con proyección estricta
export const fetchBlogPosts = cache(async (category = null) => {
  try {
    const constraints = [orderBy('createdAt', 'desc')];
    if (category) {
      constraints.push(where('category', '==', category));
    }
    const q = query(collection(db, 'blog_posts'), ...constraints);
    const snapshot = await getDocs(q);
    
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
    
    return posts;
  } catch (error) {
    console.error("Error fetching blog posts from Firebase:", error);
    return [];
  }
});

// Fetch published client testimonials con proyección estricta
export const fetchClientTestimonials = cache(async () => {
  try {
    const q = query(collection(db, 'community_messages'), where('isPublished', '==', true));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
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
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
});

// Fetch CMS page config published from GC Admin
export const fetchCMSPage = cache(async (pageId = 'home') => {
  try {
    const snap = await getDoc(doc(db, 'cms_pages', `${pageId}_production`));
    if (snap.exists()) {
      const data = snap.data();
      return {
        blocks: Array.isArray(data.blocks) ? data.blocks : [],
        publishedAt: data.publishedAt || null,
        version: data.version || '1.0'
      };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching CMS config for ${pageId}:`, error);
    return null;
  }
});

export const fetchHomeCMSConfig = () => fetchCMSPage('home');
