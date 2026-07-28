'use client';

import { useState, useEffect } from 'react';
import { Playfair_Display, Inter } from "next/font/google";
import { db } from '../../../../utils/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import ArtistPost from '../../../../components/ArtistPost';
import Link from 'next/link';
import { ArrowLeft, User } from 'lucide-react';

const playfair = Playfair_Display({ subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

export default function ArtistProfile({ params }) {
  const { uid } = params;
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [artistName, setArtistName] = useState('Artista GranColinos');

  useEffect(() => {
    const fetchArtistData = async () => {
      setIsLoading(true);
      try {
        const q = query(
          collection(db, 'artist_posts'),
          where('uid', '==', uid),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const fetchedPosts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setPosts(fetchedPosts);
        if (fetchedPosts.length > 0) {
          setArtistName(fetchedPosts[0].authorName);
        }
      } catch (error) {
        console.error("Error fetching artist profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtistData();
  }, [uid]);

  return (
    <main className="min-h-screen bg-[#050A07] text-[#E2E8F0] pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4">
        
        {/* Back Button */}
        <Link href="/artistas" className="inline-flex items-center gap-2 text-[#D4AF37] hover:text-white transition-colors mb-8">
          <ArrowLeft size={20} />
          <span>Volver al Feed</span>
        </Link>

        {/* Profile Header */}
        <div className="bg-[#111A13] border border-[#D4AF37]/20 rounded-xl p-8 text-center mb-10 shadow-[0_0_30px_rgba(212,175,55,0.05)]">
          <div className="w-24 h-24 mx-auto rounded-full bg-[#050A07] border-2 border-[#D4AF37] flex items-center justify-center mb-4">
            <User size={40} className="text-[#D4AF37]" />
          </div>
          <h1 className={`${playfair.className} text-3xl md:text-4xl text-white mb-2`}>
            {artistName}
          </h1>
          <p className="text-[#D4AF37] font-medium mb-4">Portafolio Oficial</p>
          <div className="flex justify-center gap-4 text-sm text-gray-400">
            <div><span className="font-bold text-white">{posts.length}</span> Obras</div>
          </div>
        </div>

        {/* Artist's Feed */}
        <div className="space-y-8">
          <h2 className={`${playfair.className} text-2xl text-[#D4AF37] mb-6 border-b border-[#D4AF37]/20 pb-2`}>
            Galería del Artista
          </h2>
          
          {isLoading ? (
            <div className="text-center py-10 text-[#D4AF37]">Cargando portafolio...</div>
          ) : posts.length > 0 ? (
            posts.map(post => (
              <ArtistPost key={post.id} post={post} />
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">
              Este artista aún no ha publicado obras.
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
