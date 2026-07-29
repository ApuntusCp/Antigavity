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

// Fetch products from Firebase Firestore (Cacheado por solicitud para evitar llamadas duplicadas)
export const fetchProducts = cache(async () => {
  try {
    const snapshot = await getDocs(collection(db, 'products'));
    
    const products = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        sku: data.sku || doc.id,
        name: data.name || data.title || 'Producto GranColinos',
        title: data.name || data.title || 'Producto GranColinos',
        price: data.price || 0,
        discountPrice: data.discountPrice || null,
        category: data.category || 'BIENESTAR',
        categoryGroup: data.categoryGroup || 'RELAJANTES MUSCULARES',
        stock: data.stock ?? 100,
        images: data.images && data.images.length > 0 ? data.images : (data.imageUrl ? [data.imageUrl] : []),
        imageUrl: data.images && data.images.length > 0 ? data.images[0] : (data.imageUrl || ''),
        description: data.description || 'Fórmula botánica premium desarrollada con los más altos estándares de calidad colombiana.',
        ...data
      };
    });

    products.sort((a, b) => {
      const timeA = a.createdAt?.seconds || (typeof a.createdAt === 'number' ? a.createdAt : 0);
      const timeB = b.createdAt?.seconds || (typeof b.createdAt === 'number' ? b.createdAt : 0);
      return timeB - timeA;
    });

    return products;
  } catch (error) {
    console.error("Error fetching products from Firebase:", error);
    return [];
  }
});

// Fetch blog posts from Firebase Firestore (Cacheado por solicitud)
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
        ...data,
        date: data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Fecha desconocida'
      };
    });
    
    return posts;
  } catch (error) {
    console.error("Error fetching blog posts from Firebase:", error);
    return [];
  }
});

// Fetch published client testimonials (Cacheado por solicitud)
export const fetchClientTestimonials = cache(async () => {
  try {
    const q = query(collection(db, 'community_messages'), where('isPublished', '==', true));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
});

// Fetch CMS page config published from GC Admin Editor Visual (Cacheado por solicitud)
export const fetchCMSPage = cache(async (pageId = 'home') => {
  try {
    const snap = await getDoc(doc(db, 'cms_pages', `${pageId}_production`));
    if (snap.exists()) {
      return snap.data(); // { blocks: [...], publishedAt, version }
    }
    return null;
  } catch (error) {
    console.error(`Error fetching CMS config for ${pageId}:`, error);
    return null;
  }
});

// Retro-compatibility (or specific use)
export const fetchHomeCMSConfig = () => fetchCMSPage('home');
