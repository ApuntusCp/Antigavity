"use client";

import { useAuth } from "../../components/AuthProvider";
import { useState, useEffect } from "react";
import { db } from "../../utils/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { Crown, Gift, MessageSquare, ShieldCheck, Copy, CheckCircle, Loader2 } from "lucide-react";

export default function ClubGranColinosPage() {
  const { user, loading } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  
  const [clientData, setClientData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  // Cargar datos del cliente logueado
  useEffect(() => {
    if (!user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoadingData(false);
      return;
    }

    const fetchClientData = async () => {
      try {
        const docRef = doc(db, "clients", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setClientData(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching client data:", error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchClientData();
  }, [user]);

  // Suscribirse a mensajes
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "community_messages"), orderBy("createdAt", "desc"));
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
      // Sort manually just in case the null timestamp throws it at the end
      msgs.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;
    
    setSending(true);
    try {
      await addDoc(collection(db, "community_messages"), {
        text: newMessage,
        uid: user.uid,
        authorName: clientData?.name || "Miembro del Club",
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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading || loadingData) {
    return <div className="min-h-screen flex items-center justify-center bg-brand-dark"><Loader2 className="w-8 h-8 text-brand-gold animate-spin" /></div>;
  }

  // Vista para No Logueados (Invitados)
  if (!user) {
    return (
      <div className="min-h-screen bg-brand-light dark:bg-brand-dark flex items-center justify-center px-6 relative overflow-hidden py-24">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10 fade-in">
          <Crown className="w-16 h-16 text-brand-gold mx-auto mb-6" />
          <h1 className="font-playfair text-5xl md:text-6xl text-brand-dark dark:text-white mb-6">
            Club Gran Colinos
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl font-light max-w-2xl mx-auto mb-12">
            La comunidad exclusiva para amantes del bienestar holístico y CBD. Regístrate hoy y obtén acceso inmediato a beneficios únicos.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-16 text-left">
            <div className="bg-white/50 dark:bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-brand-gold/20">
              <Gift className="w-8 h-8 text-brand-gold mb-4" />
              <h3 className="text-brand-dark dark:text-white font-bold mb-2">Cupón de Bienvenida</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Recibe un 10% de descuento en tu primera compra al unirte.</p>
            </div>
            <div className="bg-white/50 dark:bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-brand-gold/20">
              <MessageSquare className="w-8 h-8 text-brand-gold mb-4" />
              <h3 className="text-brand-dark dark:text-white font-bold mb-2">Comunidad Privada</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Comparte experiencias y aprende con otras personas sobre el uso del CBD.</p>
            </div>
            <div className="bg-white/50 dark:bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-brand-gold/20">
              <ShieldCheck className="w-8 h-8 text-brand-gold mb-4" />
              <h3 className="text-brand-dark dark:text-white font-bold mb-2">Acceso Anticipado</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Entérate primero de nuevos lanzamientos y ediciones limitadas.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/registro"
              className="bg-brand-gold text-brand-dark font-bold text-xs uppercase tracking-widest py-4 px-10 rounded-full hover:bg-yellow-500 transition-colors"
            >
              Unirme al Club
            </Link>
            <Link 
              href="/login"
              className="border border-brand-gold/30 text-brand-dark dark:text-white font-bold text-xs uppercase tracking-widest py-4 px-10 rounded-full hover:border-brand-gold hover:text-brand-gold transition-colors"
            >
              Ya soy miembro
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Vista para Miembros Logueados
  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark py-24 px-6 relative">
      <div className="max-w-4xl mx-auto">
        
        {/* User Dashboard Header */}
        <div className="bg-gradient-to-br from-[#111] to-black p-8 rounded-2xl border border-brand-gold/20 mb-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden fade-in">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-[80px]" />
          
          <div className="relative z-10 text-center md:text-left flex flex-col md:flex-row gap-6 items-center">
            <div>
              <h1 className="font-playfair text-3xl text-white mb-3">
                Hola, {clientData?.name ? clientData.name.split(' ')[0] : 'Miembro'}
              </h1>
              <div className="flex items-center gap-3">
                <span className={`text-xs tracking-widest uppercase px-3 py-1 rounded-full border font-bold ${
                  clientData?.vipLevel === 'Oro' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50' :
                  clientData?.vipLevel === 'Plata' ? 'bg-gray-400/20 text-gray-300 border-gray-400/50' :
                  'bg-orange-700/20 text-orange-400 border-orange-700/50'
                }`}>
                  Rango: {clientData?.vipLevel || 'Bronce'}
                </span>
                <span className="text-brand-green text-xs tracking-widest uppercase bg-brand-green/20 px-3 py-1 rounded-full border border-brand-green/50">
                  {clientData?.ecoPoints || 0} Eco-Points
                </span>
              </div>
            </div>
          </div>

          {clientData?.couponCode && (
            <div className="relative z-10 bg-white/5 border border-brand-gold/30 p-4 rounded-xl flex items-center gap-6">
              <div>
                <p className="text-[10px] text-gray-400 tracking-widest uppercase mb-1">Tu Cupón Activo</p>
                <p className="text-2xl font-mono font-bold text-white tracking-widest">{clientData.couponCode}</p>
              </div>
              <button 
                onClick={() => copyToClipboard(clientData.couponCode)}
                className="bg-brand-gold text-brand-dark p-3 rounded-lg hover:bg-yellow-400 transition-colors"
                title="Copiar cupón"
              >
                {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
              </button>
            </div>
          )}
        </div>

        {/* Community Chat */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-xl fade-in delay-100">
          <div className="p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-black/20">
            <h2 className="font-playfair text-xl text-brand-dark dark:text-white flex items-center gap-2">
              <MessageSquare size={20} className="text-brand-gold" /> Foro del Club
            </h2>
          </div>

          <div className="p-6">
            <form onSubmit={handleSendMessage} className="flex flex-col gap-4 mb-8">
              <textarea 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Comparte tu experiencia con la comunidad..."
                className="w-full bg-transparent border border-gray-200 dark:border-gray-800 rounded-xl p-4 text-brand-dark dark:text-white focus:outline-none focus:border-brand-gold transition-colors resize-none font-light"
                rows="3"
                maxLength="500"
                required
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">{newMessage.length}/500</span>
                <button 
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="bg-brand-gold text-brand-dark text-xs font-bold uppercase tracking-widest py-3 px-8 rounded-full hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
                >
                  {sending ? <Loader2 size={16} className="animate-spin" /> : "Publicar"}
                </button>
              </div>
            </form>

            <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
              {messages.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
                  <p className="text-gray-500 text-sm">Aún no hay mensajes. ¡Sé el primero en compartir!</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`p-5 rounded-xl ${msg.uid === user.uid ? 'bg-brand-gold/5 border border-brand-gold/20 ml-8' : 'bg-gray-50 dark:bg-black/40 border border-gray-100 dark:border-white/5 mr-8'}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-gold to-brand-green flex items-center justify-center text-brand-dark font-bold text-xs">
                        {(msg.authorName || "C")[0].toUpperCase()}
                      </div>
                      <span className="text-xs font-bold tracking-widest uppercase text-brand-dark dark:text-gray-300">
                        {msg.authorName || "Miembro del Club"}
                      </span>
                      {msg.uid === user.uid && <span className="text-[9px] bg-brand-gold/20 text-brand-gold px-2 py-0.5 rounded-full ml-auto">TÚ</span>}
                    </div>
                    <p className="text-gray-800 dark:text-gray-300 font-light leading-relaxed">
                      {msg.text}
                    </p>
                    <div className="mt-4 text-[10px] text-gray-400 tracking-widest uppercase text-right">
                      {msg.createdAt?.toDate().toLocaleDateString('es-CO', { hour: '2-digit', minute: '2-digit' }) || 'Justo ahora'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
