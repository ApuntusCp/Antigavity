"use client";

import { useAuth } from "../../components/AuthProvider";
import { useState, useEffect } from "react";
import { db } from "../../utils/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";

export default function ComunidadPage() {
  const { user, ageVerified, verifyAge, loading } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  // Subscribe to messages if age is verified
  useEffect(() => {
    if (!ageVerified) return;

    const q = query(collection(db, "community_messages"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [ageVerified]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;
    
    setSending(true);
    try {
      await addDoc(collection(db, "community_messages"), {
        text: newMessage,
        uid: user.uid,
        createdAt: serverTimestamp(),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message", error);
      alert("Hubo un error al enviar el mensaje. Verifica tu conexión.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-brand-dark"><p className="text-brand-gold text-xs tracking-widest uppercase">Cargando...</p></div>;
  }

  // Age Gate (Age Verification)
  if (!ageVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-dark px-6">
        <div className="max-w-md w-full bg-[#1a1a1a] p-10 text-center fade-in border border-white/5 shadow-2xl">
          <h1 className="font-playfair text-3xl text-brand-gold mb-6">Acceso Restringido</h1>
          <p className="text-gray-400 font-light text-sm leading-relaxed mb-8">
            La comunidad de GranColinos trata temas sobre bienestar holístico y CBD. Por regulaciones legales, debes confirmar que eres mayor de edad para ingresar.
          </p>
          <div className="flex flex-col gap-4">
            <button 
              onClick={verifyAge}
              className="bg-brand-green text-white font-bold text-xs uppercase tracking-widest py-4 px-6 hover:bg-brand-gold hover:text-brand-dark transition-all duration-300"
            >
              Sí, tengo 18 años o más
            </button>
            <a 
              href="/"
              className="border border-white/10 text-gray-500 font-bold text-xs uppercase tracking-widest py-4 px-6 hover:text-white transition-colors duration-300"
            >
              No, soy menor de edad
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <header className="mb-12 text-center fade-in">
          <h1 className="font-playfair text-4xl text-brand-dark dark:text-white mb-4">Comunidad Exclusiva</h1>
          <p className="text-gray-500 text-sm tracking-widest uppercase">Bienestar, CBD & Experiencias</p>
        </header>

        {/* Message Input */}
        <div className="bg-white dark:bg-[#1a1a1a] p-6 mb-12 fade-in shadow-sm border border-gray-100 dark:border-white/5">
          <form onSubmit={handleSendMessage} className="flex flex-col gap-4">
            <textarea 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Comparte tu experiencia de bienestar con la comunidad..."
              className="w-full bg-transparent border-b border-gray-200 dark:border-gray-800 p-2 text-brand-dark dark:text-white focus:outline-none focus:border-brand-gold transition-colors resize-none font-light"
              rows="3"
              maxLength="500"
              required
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">{newMessage.length}/500</span>
              <button 
                type="submit"
                disabled={sending || !newMessage.trim()}
                className="bg-brand-dark dark:bg-white text-white dark:text-brand-dark text-xs font-bold uppercase tracking-widest py-3 px-8 hover:bg-brand-gold dark:hover:bg-brand-gold hover:text-brand-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {sending ? "Enviando..." : "Publicar"}
              </button>
            </div>
          </form>
        </div>

        {/* Message Feed */}
        <div className="space-y-6 fade-in delay-100">
          {messages.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-200 dark:border-gray-800">
              <p className="text-gray-500 text-sm">Aún no hay mensajes. ¡Sé el primero en compartir!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="bg-white dark:bg-[#1a1a1a] p-6 border border-gray-100 dark:border-white/5">
                <p className="text-gray-800 dark:text-gray-300 font-light leading-relaxed mb-4">
                  {msg.text}
                </p>
                <div className="text-[10px] text-gray-400 tracking-widest uppercase flex justify-between">
                  <span>Usuario Anónimo</span>
                  <span>{msg.createdAt?.toDate().toLocaleDateString('es-CO') || 'Justo ahora'}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
