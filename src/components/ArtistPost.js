import Image from 'next/image';
import Link from 'next/link';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

export default function ArtistPost({ post }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes || 0);

  const handleLike = () => {
    // Aquí irá la lógica de Firebase para dar like
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  return (
    <article className="bg-[#050A07] border border-[#D4AF37]/20 rounded-lg overflow-hidden mb-8 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#D4AF37]/10">
        <Link href={`/artistas/perfil/${post.uid}`} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-[#111A13] border border-[#D4AF37]/40 flex items-center justify-center overflow-hidden">
            {post.authorPhoto ? (
              <img src={post.authorPhoto} alt={post.authorName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-[#D4AF37] text-sm font-bold">{post.authorName?.charAt(0) || 'A'}</span>
            )}
          </div>
          <div>
            <h3 className="text-[#E2E8F0] font-semibold group-hover:text-[#D4AF37] transition-colors">{post.authorName}</h3>
            <p className="text-xs text-gray-500">{post.category || 'Arte'}</p>
          </div>
        </Link>
        <button className="text-gray-500 hover:text-white transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Post Content (Image / Video / Text) */}
      <div className="relative w-full bg-black min-h-[300px] flex items-center justify-center">
        {post.mediaUrl ? (
          <img src={post.mediaUrl} alt="Obra de arte" className="w-full max-h-[600px] object-contain" />
        ) : (
          <div className="p-8 text-center text-gray-300 italic font-serif text-lg">
            {post.content}
          </div>
        )}
      </div>

      {/* Post Footer & Interactions */}
      <div className="p-4">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={handleLike} className={`transition-colors ${isLiked ? 'text-red-500' : 'text-white hover:text-red-400'}`}>
            <Heart size={24} fill={isLiked ? 'currentColor' : 'none'} />
          </button>
          <button className="text-white hover:text-[#D4AF37] transition-colors">
            <MessageCircle size={24} />
          </button>
          <button className="text-white hover:text-[#D4AF37] transition-colors">
            <Share2 size={24} />
          </button>
        </div>

        <div className="font-semibold text-white mb-2 text-sm">
          {likesCount} me gusta
        </div>

        {post.mediaUrl && post.content && (
          <div className="text-sm text-gray-300 mb-2">
            <span className="font-semibold text-white mr-2">{post.authorName}</span>
            {post.content}
          </div>
        )}

        <div className="text-xs text-gray-500 mt-2 uppercase tracking-wide">
          {post.createdAt ? new Date(post.createdAt?.seconds * 1000).toLocaleDateString() : 'Recientemente'}
        </div>
      </div>
    </article>
  );
}
