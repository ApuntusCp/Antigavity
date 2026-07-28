import { useState } from 'react';
import { X, Image as ImageIcon, Video, Music, Type, Loader2 } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { db } from '../utils/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Nota: En MVP, las imágenes se pueden subir a Firebase Storage. 
// Para mantener el código simple aquí, simulamos la UI y dejamos la base para Storage.

export default function CreatePostModal({ isOpen, onClose, onPostCreated }) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Pintura');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const CATEGORIES = ['Pintura', 'Fotografía', 'Poesía', 'Escultura', 'Música', 'Graffiti', 'Manualidades'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Debes iniciar sesión para publicar.");
    if (!content.trim()) return alert("El contenido no puede estar vacío.");

    setIsSubmitting(true);
    try {
      const newPost = {
        uid: user.uid,
        authorName: user.displayName || user.email.split('@')[0],
        authorPhoto: user.photoURL || null,
        content: content.trim(),
        category,
        mediaUrl: null, // En fase 2 completa conectaremos a Firebase Storage
        likes: 0,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'artist_posts'), newPost);
      
      setContent('');
      onPostCreated();
      onClose();
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Hubo un error al publicar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0A100C] border border-[#D4AF37]/30 w-full max-w-lg rounded-xl overflow-hidden shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#D4AF37]/10">
          <h2 className="text-[#D4AF37] font-semibold tracking-wide">Nueva Publicación</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          
          {/* User Info */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#111A13] border border-[#D4AF37]/40 flex items-center justify-center overflow-hidden">
               <span className="text-[#D4AF37] text-sm font-bold">{user?.email?.charAt(0).toUpperCase() || 'A'}</span>
            </div>
            <div>
              <div className="text-white font-medium">{user?.displayName || 'Artista GranColinos'}</div>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="bg-transparent text-xs text-[#D4AF37] outline-none cursor-pointer mt-1"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat} className="bg-[#0A100C]">{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Text Area */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="¿Qué arte vas a compartir con el mundo hoy?"
            className="w-full h-32 bg-transparent text-white placeholder-gray-500 resize-none outline-none text-lg"
            maxLength={1000}
          />

          {/* Media Attachments (UI Only for MVP) */}
          <div className="flex items-center gap-4 py-4 border-t border-[#D4AF37]/10 text-[#D4AF37]">
            <button type="button" className="p-2 hover:bg-[#D4AF37]/10 rounded-full transition-colors group relative">
              <ImageIcon size={20} />
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Imagen</span>
            </button>
            <button type="button" className="p-2 hover:bg-[#D4AF37]/10 rounded-full transition-colors group relative">
              <Video size={20} />
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Video</span>
            </button>
            <button type="button" className="p-2 hover:bg-[#D4AF37]/10 rounded-full transition-colors group relative">
              <Music size={20} />
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Audio</span>
            </button>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isSubmitting || !content.trim()}
            className="w-full bg-[#D4AF37] text-black font-bold py-3 rounded-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FFF1C5] transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <><Loader2 className="animate-spin" size={20} /> Publicando...</>
            ) : (
              'Publicar Obra'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
