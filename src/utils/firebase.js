import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, getDoc, doc, query, orderBy, addDoc, serverTimestamp, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

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

// Fetch products from Firebase Firestore
export async function fetchProducts() {
  try {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data
      };
    });
  } catch (error) {
    console.error("Error fetching products from Firebase:", error);
    return [];
  }
}

// Fetch blog posts from Firebase Firestore
export async function fetchBlogPosts(category = null) {
  try {
    const q = query(collection(db, 'blog_posts'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    let posts = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Fecha desconocida'
      };
    });

    if (category) {
      // If a post doesn't have a category, we default it to 'tienda'
      posts = posts.filter(post => (post.category || 'tienda') === category);
    }
    
    return posts;
  } catch (error) {
    console.error("Error fetching blog posts from Firebase:", error);
    return [];
  }
}

// Fetch published client testimonials
export async function fetchClientTestimonials() {
  try {
    const q = query(collection(db, 'community_messages'), where('isPublished', '==', true));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
}

// Fetch CMS page config published from GC Admin Editor Visual
// Reads from cms_pages/{pageId}_production, written by Editor when user clicks "Publicar"
export async function fetchCMSPage(pageId = 'home') {
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
}

// Retro-compatibility (or specific use)
export const fetchHomeCMSConfig = () => fetchCMSPage('home');
