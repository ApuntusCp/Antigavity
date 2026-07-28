'use client';

import { useState, useEffect } from 'react';
import { Playfair_Display, Inter } from "next/font/google";
import { PlusCircle, Search, Sparkles } from 'lucide-react';
import { db } from '../../utils/firebase';
import { collection, query, orderBy, getDocs, limit } from 'firebase/firestore';
import ArtistPost from '../../components/ArtistPost';
import CreatePostModal from '../../components/CreatePostModal';
import { useAuth } from '../../components/AuthProvider';

const playfair = Playfair_Display({ subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

export default function ArtistasFeed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Todos');

  const CATEGORIES = ['Todos', 'Pintura', 'Fotografía', 'Poesía', 'Escultura', 'Música', 'Graffiti', 'Manualidades'];

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, 'artist_posts'), orderBy('createdAt', 'desc'), limit(50));
      const snapshot = await getDocs(q);
      const fetchedPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filteredPosts = activeCategory === 'Todos' 
    ? posts 
    : posts.filter(p => p.category === activeCategory);

  return (
    <main className="min-h-screen bg-[#050A07] text-[#E2E8F0] pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4">
        
        {/* Header / Intro */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-[#D4AF37]/10 rounded-full mb-4 text-[#D4AF37]">
            <Sparkles size={28} />
          </div>
          <h1 className={`${playfair.className} text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF1C5] to-[#D4AF37] mb-4`}>
            Red de Artistas
          </h1>
          <p className={`${inter.className} text-gray-400 max-w-xl mx-auto`}>
            El lienzo digital de Colombia. Descubre, conecta e impulsa el talento local. Sube tu arte y deja que el mundo lo vea.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex overflow-x-auto hide-scrollbar gap-3 mb-8 pb-4 border-b border-[#D4AF37]/10">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat 
                  ? 'bg-[#D4AF37] text-black' 
                  : 'bg-[#111A13] text-gray-400 hover:text-[#D4AF37]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Feed */}
        <div className="space-y-8">
          {isLoading ? (
            <div className="text-center py-20 text-[#D4AF37]">Cargando obras maestras...</div>
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <ArtistPost key={post.id} post={post} />
            ))
          ) : (
            <div className="text-center py-20 bg-[#111A13] rounded-lg border border-[#D4AF37]/10">
              <p className="text-gray-400 mb-4">Aún no hay obras en esta categoría.</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="text-[#D4AF37] font-semibold hover:underline"
              >
                ¡Sé el primero en publicar!
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button (Create Post) */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-24 right-6 md:right-12 w-14 h-14 bg-[#D4AF37] text-black rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-110 transition-transform z-40"
      >
        <PlusCircle size={28} />
      </button>

      {/* Modal */}
      <CreatePostModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onPostCreated={fetchPosts}
      />
    </main>
  );
}
