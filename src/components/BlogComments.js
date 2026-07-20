"use client";

import { useState, useEffect } from "react";
import { db } from "../utils/firebase";
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { useAuth } from "./AuthProvider";
import { MessageSquare, Loader2, Crown } from "lucide-react";
import Link from "next/link";

export default function BlogComments({ postId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!postId) return;
    const q = query(
      collection(db, "blog_comments"),
      where("postId", "==", postId),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Fallback para createdAt localmente antes de sincronizar
          createdAt: data.createdAt ? data.createdAt : { toDate: () => new Date() }
        };
      });
      msgs.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());
      setComments(msgs);
    });

    return () => unsubscribe();
  }, [postId]);

  const handleSendComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    
    setSending(true);
    try {
      await addDoc(collection(db, "blog_comments"), {
        postId,
        text: newComment,
        uid: user.uid,
        authorName: user.displayName || "Miembro del Club",
        createdAt: serverTimestamp(),
      });
      setNewComment("");
    } catch (error) {
      console.error("Error sending comment", error);
      alert("Hubo un error al publicar el comentario.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mt-20 pt-16 border-t border-brand-gold/20">
      <h3 className="font-playfair text-2xl text-brand-dark dark:text-white flex items-center gap-2 mb-8">
        <MessageSquare size={24} className="text-brand-gold" /> Comentarios
      </h3>

      {user ? (
        <form onSubmit={handleSendComment} className="flex flex-col gap-4 mb-12">
          <textarea 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Añade tu perspectiva a este artículo..."
            className="w-full bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl p-4 text-brand-dark dark:text-white focus:outline-none focus:border-brand-gold transition-colors resize-none font-light"
            rows="3"
            maxLength="1000"
            required
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">{newComment.length}/1000</span>
            <button 
              type="submit"
              disabled={sending || !newComment.trim()}
              className="bg-brand-gold text-brand-dark text-xs font-bold uppercase tracking-widest py-3 px-8 rounded-full hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
            >
              {sending ? <Loader2 size={16} className="animate-spin" /> : "Publicar"}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-brand-gold/10 border border-brand-gold/30 rounded-xl p-6 text-center mb-12">
          <Crown className="w-8 h-8 text-brand-gold mx-auto mb-4" />
          <p className="text-brand-dark dark:text-white mb-4 font-light">Debes ser miembro del Club para comentar.</p>
          <Link href="/login" className="inline-block bg-brand-dark dark:bg-white text-brand-gold dark:text-brand-dark text-xs font-bold uppercase tracking-widest py-3 px-8 rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
            Iniciar Sesión
          </Link>
        </div>
      )}

      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center font-light italic">Sé el primero en compartir tu opinión.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="p-6 rounded-xl bg-gray-50 dark:bg-black/40 border border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-gold to-brand-green flex items-center justify-center text-brand-dark font-bold text-xs">
                  {(comment.authorName || "C")[0].toUpperCase()}
                </div>
                <span className="text-xs font-bold tracking-widest uppercase text-brand-dark dark:text-gray-300">
                  {comment.authorName || "Miembro del Club"}
                </span>
                {user && comment.uid === user.uid && <span className="text-[9px] bg-brand-gold/20 text-brand-gold px-2 py-0.5 rounded-full ml-auto">TÚ</span>}
              </div>
              <p className="text-gray-800 dark:text-gray-300 font-light leading-relaxed">
                {comment.text}
              </p>
              <div className="mt-4 text-[10px] text-gray-400 tracking-widest uppercase">
                {comment.createdAt?.toDate().toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) || 'Publicando...'}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
