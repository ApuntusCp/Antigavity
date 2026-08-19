"use client";

import React, { useState, useEffect } from 'react';
import { MessageSquare, Heart, CornerDownRight, Send, Filter, Sparkles, Shield, User, Loader2, Megaphone, Check, Trash2, Leaf, HelpCircle, Star, Users } from 'lucide-react';
import { RenderAvatar } from './AvatarPicker';
import VerificationBadge from './VerificationBadge';

const TAG_CONFIG = [
  { id: 'Todos', label: 'Todos', icon: Filter },
  { id: 'Testimonios', label: 'Testimonios', icon: Leaf },
  { id: 'Preguntas', label: 'Preguntas', icon: HelpCircle },
  { id: 'Opinión de Producto', label: 'Opinión de Producto', icon: Star },
  { id: 'Institucional', label: 'Institucional', icon: Megaphone }
];

export default function ForumSection({ user, clientData }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState('Todos');
  const [filterType, setFilterType] = useState('todos'); // 'todos' | 'institucional' | 'comunidad'
  
  // New Post Form state
  const [postText, setPostText] = useState('');
  const [postTag, setPostTag] = useState('Testimonios');
  const [submitting, setSubmitting] = useState(false);
  
  // Reply Form states
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);

  // Check if current user is admin / official account
  const isAdmin = Boolean(
    user && (
      user.email === 'brayan.aponte1502@gmail.com' ||
      user.email === 'grancolinos@gmail.com' ||
      clientData?.role === 'admin' ||
      clientData?.isAdmin === true ||
      clientData?.name?.toLowerCase().includes('aponte sas') ||
      clientData?.name?.toLowerCase().includes('oficial')
    )
  );

  // Fetch messages from API
  const fetchMessages = async () => {
    try {
      let url = `/api/club/messages`;
      const params = new URLSearchParams();
      if (selectedTag !== 'Todos') params.append('tag', selectedTag);
      if (filterType !== 'todos') params.append('postType', filterType);
      
      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success && Array.isArray(data.messages)) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedTag, filterType]);

  // Handle post creation
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!postText.trim() || !user) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/club/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          text: postText.trim(),
          authorName: clientData?.name || user.displayName || 'Miembro del Club',
          role: isAdmin ? 'Dirección General' : (clientData?.vipLevel ? `Miembro ${clientData.vipLevel}` : 'Voz del Club'),
          photoUrl: clientData?.photoUrl || null,
          avatarIconId: clientData?.avatarIconId || 'leaf',
          verifiedProfession: Boolean(clientData?.verifiedProfession),
          professionTitle: clientData?.professionTitle || null,
          tag: postTag,
          postType: isAdmin ? 'institucional' : 'comunidad'
        })
      });

      const data = await res.json();
      if (data.success) {
        setPostText('');
        fetchMessages();
      }
    } catch (err) {
      console.error("Error creating post:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle reaction toggle
  const handleToggleReaction = async (messageId) => {
    if (!user) return;

    // Optimistic UI update
    setMessages(prev => prev.map(m => {
      if (m.id === messageId) {
        const likedBy = Array.isArray(m.likedBy) ? m.likedBy : [];
        const hasLiked = likedBy.includes(user.uid);
        const newLikedBy = hasLiked ? likedBy.filter(id => id !== user.uid) : [...likedBy, user.uid];
        return {
          ...m,
          likedBy: newLikedBy,
          likesCount: newLikedBy.length
        };
      }
      return m;
    }));

    try {
      await fetch('/api/club/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, uid: user.uid })
      });
    } catch (err) {
      console.error("Error toggling reaction:", err);
      fetchMessages();
    }
  };

  // Handle reply submission
  const handleSendReply = async (messageId) => {
    if (!replyText.trim() || !user) return;

    setReplying(true);
    try {
      const res = await fetch('/api/club/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId,
          uid: user.uid,
          authorName: clientData?.name || user.displayName || 'Miembro del Club',
          text: replyText.trim(),
          avatarIconId: clientData?.avatarIconId || 'leaf',
          verifiedProfession: Boolean(clientData?.verifiedProfession)
        })
      });

      const data = await res.json();
      if (data.success) {
        setReplyText('');
        setActiveReplyId(null);
        fetchMessages();
      }
    } catch (err) {
      console.error("Error adding reply:", err);
    } finally {
      setReplying(false);
    }
  };

  // Handle delete message (Admin or Author)
  const handleDeleteMessage = async (messageId) => {
    if (!user) return;
    if (!confirm("¿Deseas eliminar este comentario del foro?")) return;

    // Optimistic removal
    setMessages(prev => prev.filter(m => m.id !== messageId));

    try {
      const res = await fetch('/api/club/messages', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId,
          uid: user.uid
        })
      });

      const data = await res.json();
      if (!data.success) {
        alert(data.error || "No se pudo eliminar el mensaje");
        fetchMessages();
      }
    } catch (err) {
      console.error("Error deleting message:", err);
      fetchMessages();
    }
  };

  // Handle delete reply (Admin or Author)
  const handleDeleteReply = async (messageId, replyId) => {
    if (!user) return;
    if (!confirm("¿Deseas eliminar esta respuesta?")) return;

    // Optimistic removal
    setMessages(prev => prev.map(m => {
      if (m.id === messageId) {
        return {
          ...m,
          replies: (m.replies || []).filter(r => r.id !== replyId)
        };
      }
      return m;
    }));

    try {
      const res = await fetch('/api/club/messages', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId,
          replyId,
          uid: user.uid
        })
      });

      const data = await res.json();
      if (!data.success) {
        alert(data.error || "No se pudo eliminar la respuesta");
        fetchMessages();
      }
    } catch (err) {
      console.error("Error deleting reply:", err);
      fetchMessages();
    }
  };

  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-xl fade-in">
      {/* Header */}
      <div className="p-6 md:p-8 border-b border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-black/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-playfair text-2xl text-brand-dark dark:text-white flex items-center gap-2.5 font-bold">
            <MessageSquare size={22} className="text-brand-gold" /> Foro y Voces del Club
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Espacio de diálogo, testimonios botánicos y comunicados oficiales.
          </p>
        </div>

        {/* Content Type Selector (Institucional vs Comunidad) */}
        <div className="inline-flex p-1 bg-black/50 border border-white/10 rounded-xl">
          <button
            onClick={() => setFilterType('todos')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              filterType === 'todos' ? 'bg-brand-gold text-brand-dark shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilterType('comunidad')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
              filterType === 'comunidad' ? 'bg-brand-gold text-brand-dark shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Users size={13} /> Comunidad
          </button>
          <button
            onClick={() => setFilterType('institucional')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
              filterType === 'institucional' ? 'bg-yellow-500 text-black shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Megaphone size={13} /> Oficial
          </button>
        </div>
      </div>

      {/* Tags Filter Bar */}
      <div className="px-6 py-3 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/10 flex items-center gap-2 overflow-x-auto custom-scrollbar">
        {TAG_CONFIG.map(tagItem => {
          const Icon = tagItem.icon;
          const isSelected = selectedTag === tagItem.id;
          return (
            <button
              key={tagItem.id}
              onClick={() => setSelectedTag(tagItem.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-brand-gold/20 text-brand-gold border border-brand-gold/50 shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon size={12} />
              <span>{tagItem.label}</span>
            </button>
          );
        })}
      </div>

      {/* Post Composer Form */}
      <div className="p-6 md:p-8 border-b border-gray-100 dark:border-white/10 bg-white dark:bg-[#141414]">
        <form onSubmit={handleCreatePost} className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
              <MessageSquare size={14} className="text-brand-gold" />
              <span>Crear Nueva Publicación</span>
            </span>

            {/* Tag selector for new post */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-gray-500 font-medium">Categoría:</span>
              <select
                id="forum-post-tag"
                name="postTag"
                value={postTag}
                onChange={e => setPostTag(e.target.value)}
                aria-label="Categoría del tema"
                className="bg-black/60 border border-white/15 text-white text-xs rounded-lg px-3 py-1.5 outline-none focus:border-brand-gold cursor-pointer font-medium"
              >
                <option value="Testimonios">Testimonios</option>
                <option value="Preguntas">Preguntas</option>
                <option value="Opinión de Producto">Opinión de Producto</option>
              </select>
            </div>
          </div>

          <textarea
            id="forum-post-text"
            name="postText"
            value={postText}
            onChange={e => setPostText(e.target.value)}
            placeholder="Comparte tu experiencia botánica, consulta con la comunidad o reseña un producto..."
            aria-label="Contenido del mensaje para la comunidad"
            rows="3"
            maxLength="600"
            className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-4 text-brand-dark dark:text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold transition-colors resize-none font-light text-sm"
            required
          />

          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 font-mono">{postText.length}/600</span>
            <button
              type="submit"
              disabled={submitting || !postText.trim()}
              className="bg-brand-gold hover:bg-yellow-500 text-brand-dark font-bold text-xs uppercase tracking-widest py-3 px-8 rounded-xl transition-all shadow-[0_0_15px_rgba(212,175,55,0.25)] flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={14} />}
              <span>Publicar en el Foro</span>
            </button>
          </div>
        </form>
      </div>

      {/* Messages Feed */}
      <div className="p-6 md:p-8 space-y-6">
        {loading ? (
          <div className="py-16 text-center text-gray-400 text-sm flex items-center justify-center gap-2">
            <Loader2 className="animate-spin text-brand-gold" size={20} />
            <span>Cargando conversaciones del club...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-gray-200 dark:border-white/10 rounded-2xl p-8">
            <MessageSquare size={40} className="text-gray-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">Aún no hay publicaciones con este filtro</h3>
            <p className="text-xs text-gray-400">Sé el primero en compartir tu experiencia en el Club.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isInstitutional = msg.postType === 'institucional' || msg.authorName?.toLowerCase().includes('aponte');
            const hasLiked = Array.isArray(msg.likedBy) && user && msg.likedBy.includes(user.uid);
            const likesCount = msg.likesCount || (Array.isArray(msg.likedBy) ? msg.likedBy.length : 0);
            const replies = Array.isArray(msg.replies) ? msg.replies : [];
            const isReplying = activeReplyId === msg.id;
            const canDelete = isAdmin || (user && msg.uid === user.uid);

            return (
              <div
                key={msg.id}
                className={`rounded-2xl transition-all p-6 relative group ${
                  isInstitutional
                    ? 'bg-gradient-to-br from-yellow-950/20 via-black to-[#0e160a] border-2 border-brand-gold/50 shadow-[0_0_25px_rgba(212,175,55,0.15)]'
                    : 'bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/5'
                }`}
              >
                {/* Institutional Header Banner */}
                {isInstitutional && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/20 border border-brand-gold/40 text-brand-gold text-[10px] font-bold uppercase tracking-widest mb-4">
                    <Megaphone size={12} /> Comunicado Oficial APONTE S.A.S.
                  </div>
                )}

                {/* Author row */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <RenderAvatar
                      photoUrl={msg.photoUrl}
                      avatarType={msg.photoUrl ? 'upload' : (msg.avatarIconId ? 'icon' : 'letter')}
                      avatarIconId={msg.avatarIconId || 'leaf'}
                      name={msg.authorName || msg.name}
                      size="md"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-sm font-bold tracking-wider uppercase ${isInstitutional ? 'text-brand-gold font-serif text-base' : 'text-brand-dark dark:text-white'}`}>
                          {msg.authorName || msg.name || 'Miembro del Club'}
                        </span>
                        <VerificationBadge verifiedProfession={msg.verifiedProfession} professionTitle={msg.professionTitle} />
                        {msg.uid === user?.uid && (
                          <span className="text-[9px] bg-brand-gold/20 text-brand-gold px-2 py-0.5 rounded-full font-bold">
                            TÚ
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-gray-500 font-medium">
                          {msg.role || 'Voz del Club'}
                        </span>
                        {msg.tag && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400">
                            {msg.tag.replace(/[^\w\s]/gi, '').trim()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-gray-500 font-mono shrink-0">
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' }) : 'Reciente'}
                    </span>

                    {/* Delete button (Admin or Author) */}
                    {canDelete && (
                      <button
                        type="button"
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                        title={isAdmin ? "Eliminar comentario como Administrador" : "Eliminar mi publicación"}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Message Body */}
                <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed font-light mb-5 whitespace-pre-line">
                  {msg.text}
                </p>

                {/* Action Bar (Reactions & Reply Trigger) */}
                <div className="flex items-center gap-4 pt-3 border-t border-gray-200/50 dark:border-white/5 text-xs text-gray-400">
                  <button
                    type="button"
                    onClick={() => handleToggleReaction(msg.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                      hasLiked
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                        : 'hover:bg-white/5 text-gray-400 hover:text-white border border-transparent'
                    }`}
                    title="Resonancia Botánica"
                  >
                    <Heart size={14} className={hasLiked ? 'fill-emerald-400 text-emerald-400' : ''} />
                    <span>{likesCount} {likesCount === 1 ? 'Resonancia' : 'Resonancias'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveReplyId(isReplying ? null : msg.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <CornerDownRight size={14} />
                    <span>{replies.length} {replies.length === 1 ? 'Respuesta' : 'Respuestas'}</span>
                  </button>
                </div>

                {/* Replies Thread (Single Level) */}
                {replies.length > 0 && (
                  <div className="mt-4 space-y-3 pl-4 md:pl-8 border-l-2 border-brand-gold/30">
                    {replies.map(reply => {
                      const canDeleteReply = isAdmin || (user && reply.uid === user.uid);
                      return (
                        <div key={reply.id} className="bg-black/30 border border-white/5 rounded-xl p-3.5 text-xs">
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-2">
                              <RenderAvatar
                                avatarType="icon"
                                avatarIconId={reply.avatarIconId || 'leaf'}
                                name={reply.authorName}
                                size="sm"
                              />
                              <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                                {reply.authorName}
                              </span>
                              <VerificationBadge verifiedProfession={reply.verifiedProfession} />
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-gray-500">
                                {reply.createdAt ? new Date(reply.createdAt).toLocaleDateString('es-CO') : ''}
                              </span>
                              {canDeleteReply && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteReply(msg.id, reply.id)}
                                  className="text-gray-500 hover:text-red-400 p-1 rounded transition-colors cursor-pointer"
                                  title="Eliminar respuesta"
                                >
                                  <Trash2 size={12} />
                                </button>
                              )}
                            </div>
                          </div>
                          <p className="text-gray-300 font-light pl-8 leading-relaxed">
                            {reply.text}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Reply Input Box (when active) */}
                {isReplying && (
                  <div className="mt-4 pl-4 md:pl-8 border-l-2 border-brand-gold flex items-center gap-2 animate-in fade-in">
                    <input
                      id={`reply-text-${msg.id}`}
                      name={`replyText-${msg.id}`}
                      type="text"
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder={`Responder a ${msg.authorName || 'este miembro'}...`}
                      aria-label={`Responder a ${msg.authorName || 'este miembro'}`}
                      maxLength="300"
                      className="flex-1 bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 outline-none focus:border-brand-gold"
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSendReply(msg.id);
                        }
                      }}
                    />
                    <button
                      type="button"
                      disabled={replying || !replyText.trim()}
                      onClick={() => handleSendReply(msg.id)}
                      className="bg-brand-gold hover:bg-yellow-500 text-brand-dark font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      {replying ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                      <span>Enviar</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
