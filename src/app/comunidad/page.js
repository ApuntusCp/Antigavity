"use client";

import { useAuth } from "../../components/AuthProvider";
import { useState, useEffect, useRef } from "react";
import { db, storage } from "../../utils/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Link from "next/link";
import { Crown, Gift, MessageSquare, ShieldCheck, Copy, CheckCircle, Loader2, Camera, Star, Settings } from "lucide-react";

export default function ClubGranColinosPage() {
  const { user, loading } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  
  const [clientData, setClientData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  // Estados Perfil / Testimonio
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [testimonialText, setTestimonialText] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const fileInputRef = useRef(null);

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
          const data = docSnap.data();
          setClientData(data);
          setProfileName(data.name || "");
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

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;
    try {
      setSavingProfile(true);
      const storageRef = ref(storage, `clients_avatars/${user.uid}_${Date.now()}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await updateDoc(doc(db, "clients", user.uid), { photoUrl: url });
      setClientData(prev => ({ ...prev, photoUrl: url }));
    } catch (error) {
      console.error("Error uploading photo", error);
      alert("No se pudo subir la foto.");
    } finally {
      setSavingProfile(false);
    }
  };

  const saveProfile = async () => {
    if (!user || !profileName.trim()) return;
    try {
      setSavingProfile(true);
      await updateDoc(doc(db, "clients", user.uid), { name: profileName });
      setClientData(prev => ({ ...prev, name: profileName }));
      setIsEditingProfile(false);
    } catch (error) {
      console.error("Error saving profile", error);
    } finally {
      setSavingProfile(false);
    }
  };

  const submitTestimonial = async (e) => {
    e.preventDefault();
    if (!testimonialText.trim() || !user) return;
    try {
      setSavingProfile(true);
      await addDoc(collection(db, "client_testimonials"), {
        uid: user.uid,
        name: clientData?.name || "Miembro",
        role: clientData?.vipLevel ? `Miembro ${clientData.vipLevel}` : "Miembro",
        photoUrl: clientData?.photoUrl || null,
        text: testimonialText,
        isPublished: false,
        createdAt: serverTimestamp()
      });
      setTestimonialText("");
      alert("¡Gracias! Tu testimonio ha sido enviado y será revisado por nuestro equipo para publicarlo en Voces del Club.");
      setIsEditingProfile(false);
    } catch (error) {
      console.error("Error submit testimonial", error);
      alert("Hubo un error al enviar tu testimonio.");
    } finally {
      setSavingProfile(false);
    }
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
            <div className="relative group">
              <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" className="hidden" />
              {clientData?.photoUrl ? (
                <img src={clientData.photoUrl} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-2 border-brand-gold/50 shadow-xl" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-brand-gold/20 to-brand-green/20 border-2 border-brand-gold/30 flex items-center justify-center text-brand-gold shadow-xl">
                  <User size={40} />
                </div>
              )}
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm cursor-pointer"
              >
                <Camera size={24} className="text-white" />
              </button>
            </div>

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

          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4">
            <button 
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="border border-white/20 text-gray-300 hover:text-white px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors"
            >
              <Settings size={14} /> Perfil
            </button>
            {clientData?.couponCode && (
              <div className="bg-white/5 border border-brand-gold/30 p-2 rounded-xl flex items-center gap-4 px-4">
                <div>
                  <p className="text-[9px] text-gray-400 tracking-widest uppercase mb-1">Tu Cupón</p>
                  <p className="text-lg font-mono font-bold text-white tracking-widest leading-none">{clientData.couponCode}</p>
                </div>
                <button 
                  onClick={() => copyToClipboard(clientData.couponCode)}
                  className="bg-brand-gold text-brand-dark p-2 rounded-lg hover:bg-yellow-400 transition-colors"
                  title="Copiar cupón"
                >
                  {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Settings Panel */}
        {isEditingProfile && (
          <div className="bg-[#111] rounded-2xl border border-brand-gold/30 p-8 mb-12 shadow-2xl fade-in relative">
            <h2 className="font-playfair text-2xl text-brand-gold mb-6 border-b border-white/10 pb-4">Personaliza tu Perfil</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-bold">Tu Apodo / Nombre</label>
                <input 
                  type="text" 
                  value={profileName} 
                  onChange={e => setProfileName(e.target.value)}
                  className="w-full bg-black border border-white/20 rounded-lg p-3 text-white focus:border-brand-gold outline-none transition-colors"
                />
                <button 
                  onClick={saveProfile}
                  disabled={savingProfile || !profileName.trim()}
                  className="mt-4 bg-brand-gold text-black font-bold text-xs uppercase tracking-widest px-6 py-2 rounded flex items-center gap-2 hover:bg-yellow-400 transition-colors disabled:opacity-50"
                >
                  {savingProfile ? <Loader2 size={14} className="animate-spin" /> : "Guardar Cambios"}
                </button>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-brand-gold mb-2 font-bold flex items-center gap-2">
                  <Star size={14} /> Ser Voz del Club
                </label>
                <p className="text-gray-400 text-sm mb-3">Cuéntale a la comunidad qué tal te han parecido nuestros productos. Tu testimonio podría ser destacado en nuestra página principal.</p>
                <form onSubmit={submitTestimonial}>
                  <textarea 
                    value={testimonialText}
                    onChange={e => setTestimonialText(e.target.value)}
                    placeholder="Escribe tu testimonio aquí..."
                    className="w-full bg-black border border-white/20 rounded-lg p-3 text-white focus:border-brand-gold outline-none transition-colors resize-none mb-3"
                    rows="3"
                    required
                  />
                  <button 
                    type="submit"
                    disabled={savingProfile || !testimonialText.trim()}
                    className="w-full bg-white/10 text-white font-bold text-xs uppercase tracking-widest px-6 py-2 rounded hover:bg-white/20 transition-colors disabled:opacity-50"
                  >
                    Enviar Testimonio
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

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
