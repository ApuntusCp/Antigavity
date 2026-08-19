"use client";

import { useAuth } from "../../components/AuthProvider";
import { useState, useEffect, useRef } from "react";
import { db, storage } from "../../utils/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Link from "next/link";
import { Crown, Gift, MessageSquare, ShieldCheck, Copy, CheckCircle, Loader2, Camera, Settings, User, Sparkles, Check } from "lucide-react";
import MaintenanceGuard from "../../components/MaintenanceGuard";

import AvatarSelector, { RenderAvatar } from "./components/AvatarPicker";
import VerificationBadge from "./components/VerificationBadge";
import GamificationProgressBar from "./components/GamificationProgressBar";
import BadgesAndHistory from "./components/BadgesAndHistory";
import ForumSection from "./components/ForumSection";

export default function ClubGranColinosPage() {
  const { user, loading } = useAuth();
  const [clientData, setClientData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  // Estados Perfil
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [selectedAvatarType, setSelectedAvatarType] = useState("icon"); // 'upload' | 'icon' | 'letter'
  const [selectedAvatarIconId, setSelectedAvatarIconId] = useState("leaf");
  const [savingProfile, setSavingProfile] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef(null);

  // Cargar datos del cliente logueado
  useEffect(() => {
    if (!user) {
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
          setProfileName(data.name || user.displayName || "");
          setSelectedAvatarType(data.avatarType || (data.photoUrl ? 'upload' : 'icon'));
          setSelectedAvatarIconId(data.avatarIconId || 'leaf');
        } else {
          // Si no existe aún en Firestore, aprovisionarlo de forma segura
          const res = await fetch('/api/club/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              uid: user.uid,
              name: user.displayName || user.email.split('@')[0],
              email: user.email,
              source: 'Club Comunidad'
            })
          });
          const json = await res.json();
          if (json.success && json.client) {
            setClientData(json.client);
            setProfileName(json.client.name || "");
            setSelectedAvatarType('icon');
            setSelectedAvatarIconId('leaf');
          }
        }
      } catch (error) {
        console.error("Error fetching client data:", error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchClientData();
  }, [user]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;
    try {
      setIsUploadingPhoto(true);
      const storageRef = ref(storage, `clients_avatars/${user.uid}_${Date.now()}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await updateDoc(doc(db, "clients", user.uid), { photoUrl: url, avatarType: 'upload' });
      setClientData(prev => ({ ...prev, photoUrl: url, avatarType: 'upload' }));
      setSelectedAvatarType('upload');
    } catch (error) {
      console.error("Error uploading photo", error);
      alert("No se pudo subir la foto: " + error.message);
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const saveProfile = async () => {
    if (!user || !profileName.trim()) return;
    try {
      setSavingProfile(true);
      const res = await fetch('/api/club/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          name: profileName.trim(),
          avatarType: selectedAvatarType,
          avatarIconId: selectedAvatarIconId
        })
      });

      const data = await res.json();
      if (data.success) {
        setClientData(prev => ({
          ...prev,
          name: profileName.trim(),
          avatarType: selectedAvatarType,
          avatarIconId: selectedAvatarIconId
        }));
        setIsEditingProfile(false);
      }
    } catch (error) {
      console.error("Error saving profile", error);
    } finally {
      setSavingProfile(false);
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-dark">
        <Loader2 className="w-8 h-8 text-brand-gold animate-spin" />
      </div>
    );
  }

  // Vista para No Logueados (Invitados)
  if (!user) {
    return (
      <MaintenanceGuard
        routeKey="/comunidad"
        defaultTitle="MÓDULO DE MI CLUB & COMUNIDAD EN CONSTRUCCIÓN"
        defaultSubtitle="Estamos afinando los servicios y beneficios del Club Gran Colinos."
        defaultModuleName="Mi Club & Registro"
        defaultEstimatedDate="Agosto 2026"
      >
        <div className="min-h-screen bg-brand-light dark:bg-brand-dark flex items-center justify-center px-6 relative overflow-hidden py-24">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold/10 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="max-w-4xl mx-auto text-center relative z-10 fade-in">
            <Crown className="w-16 h-16 text-brand-gold mx-auto mb-6" />
            <h1 className="font-playfair text-5xl md:text-6xl text-brand-dark dark:text-white mb-6">
              Club Gran Colinos
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl font-light max-w-2xl mx-auto mb-12">
              La comunidad exclusiva para amantes del bienestar holístico y botánica de alta pureza. Regístrate hoy y obtén acceso inmediato a beneficios únicos.
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
                <h3 className="text-brand-dark dark:text-white font-bold mb-2">Acceso VIP</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Entérate primero de nuevos lanzamientos, lotes especiales y eventos.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/registro"
                className="bg-brand-gold text-brand-dark font-bold text-xs uppercase tracking-widest py-4 px-10 rounded-full hover:bg-yellow-500 transition-colors shadow-lg"
              >
                Unirme al Club
              </Link>
              <Link 
                href="/login"
                className="border border-brand-gold/40 text-brand-dark dark:text-white font-bold text-xs uppercase tracking-widest py-4 px-10 rounded-full hover:border-brand-gold hover:text-brand-gold transition-colors"
              >
                Ya soy miembro
              </Link>
            </div>
          </div>
        </div>
      </MaintenanceGuard>
    );
  }

  // Vista para Miembros Logueados
  return (
    <MaintenanceGuard
      routeKey="/comunidad"
      defaultTitle="MÓDULO DE MI CLUB & COMUNIDAD EN CONSTRUCCIÓN"
      defaultSubtitle="Estamos afinando los servicios y beneficios del Club Gran Colinos."
      defaultModuleName="Mi Club & Registro"
      defaultEstimatedDate="Agosto 2026"
    >
      <div className="min-h-screen bg-brand-light dark:bg-brand-dark py-24 px-4 sm:px-6 relative">
        <div className="max-w-4xl mx-auto">
          
          {/* USER DASHBOARD HEADER */}
          <div className="bg-gradient-to-br from-[#111] to-black p-6 md:p-8 rounded-2xl border border-brand-gold/25 mb-8 shadow-2xl relative overflow-hidden fade-in">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-[80px]" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Profile info */}
              <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                {/* Avatar with upload trigger */}
                <div className="relative group">
                  <input id="avatar-photo-upload" name="avatarFile" type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" className="hidden" aria-label="Subir foto de perfil" />
                  
                  <RenderAvatar
                    photoUrl={clientData?.photoUrl}
                    avatarType={clientData?.avatarType || (clientData?.photoUrl ? 'upload' : 'icon')}
                    avatarIconId={clientData?.avatarIconId || 'leaf'}
                    name={clientData?.name}
                    size="xl"
                  />

                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingPhoto}
                    className={`absolute inset-0 bg-black/60 rounded-full flex items-center justify-center transition-opacity backdrop-blur-sm cursor-pointer ${isUploadingPhoto ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                    title="Subir foto de perfil"
                  >
                    {isUploadingPhoto ? <Loader2 size={24} className="text-brand-gold animate-spin" /> : <Camera size={22} className="text-white" />}
                  </button>
                </div>

                <div>
                  <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap mb-1">
                    <h1 className="font-playfair text-2xl md:text-3xl text-white font-bold">
                      {clientData?.name ? clientData.name : 'Miembro Gran Colinos'}
                    </h1>
                    <VerificationBadge 
                      verifiedProfession={clientData?.verifiedProfession} 
                      professionTitle={clientData?.professionTitle}
                      size="md"
                    />
                  </div>

                  <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                    <span className={`text-[11px] tracking-widest uppercase px-3 py-0.5 rounded-full border font-bold ${
                      clientData?.vipLevel === 'Oro' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' :
                      clientData?.vipLevel === 'Plata' ? 'bg-gray-400/20 text-gray-200 border-gray-400/50' :
                      'bg-orange-800/20 text-orange-300 border-orange-700/50'
                    }`}>
                      Rango {clientData?.vipLevel || 'Bronce'}
                    </span>
                    <span className="text-emerald-400 text-[11px] tracking-widest uppercase bg-emerald-950/60 px-3 py-0.5 rounded-full border border-emerald-500/40 font-mono">
                      {clientData?.ecoPoints || 0} Eco-Points
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions & Coupon */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button 
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="border border-white/20 text-gray-300 hover:text-white hover:border-brand-gold px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer bg-white/5"
                >
                  <Settings size={14} /> Personalizar
                </button>

                {clientData?.couponCode && (
                  <div className="bg-white/5 border border-brand-gold/30 p-2 rounded-xl flex items-center gap-3 px-4">
                    <div>
                      <p className="text-[9px] text-gray-400 tracking-widest uppercase mb-0.5">Cupón 10% OFF</p>
                      <p className="text-base font-mono font-bold text-white tracking-widest leading-none">{clientData.couponCode}</p>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(clientData.couponCode)}
                      className="bg-brand-gold text-brand-dark p-2 rounded-lg hover:bg-yellow-400 transition-colors cursor-pointer"
                      title="Copiar cupón"
                    >
                      {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* PROGRESS BAR DE GAMIFICACIÓN */}
            <GamificationProgressBar 
              ecoPoints={clientData?.ecoPoints || 0} 
              vipLevel={clientData?.vipLevel || 'Bronce'} 
            />
          </div>

          {/* PROFILE SETTINGS PANEL (Personalización) */}
          {isEditingProfile && (
            <div className="bg-[#111] rounded-2xl border border-brand-gold/40 p-6 md:p-8 mb-8 shadow-2xl fade-in relative max-w-xl mx-auto">
              <h2 className="font-playfair text-2xl text-brand-gold mb-6 border-b border-white/10 pb-3 text-center font-bold">
                Personaliza tu Identidad en el Club
              </h2>

              <div className="space-y-6">
                <div>
                  <label htmlFor="profile-public-name" className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-bold">
                    Nombre o Apodo Público
                  </label>
                  <input 
                    id="profile-public-name"
                    name="profileName"
                    type="text" 
                    value={profileName} 
                    onChange={e => setProfileName(e.target.value)}
                    className="w-full bg-black border border-white/20 rounded-xl p-3.5 text-white focus:border-brand-gold outline-none transition-colors text-sm"
                    placeholder="¿Cómo quieres que te llamemos?"
                  />
                </div>

                {/* Avatar Icon Selector */}
                <AvatarSelector
                  currentType={selectedAvatarType}
                  currentIconId={selectedAvatarIconId}
                  onSelectType={(t) => setSelectedAvatarType(t)}
                  onSelectIcon={(iconId) => setSelectedAvatarIconId(iconId)}
                />

                {/* Professional verification note */}
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-[11px] text-gray-400 flex items-start gap-2.5">
                  <ShieldCheck size={16} className="text-brand-gold shrink-0 mt-0.5" />
                  <span><strong>Verificación Profesional:</strong> Si eres médico, químico o profesional de la salud, puedes validar tus credenciales enviando tus soportes a GC Admin para habilitar tu badge oficial.</span>
                </div>

                <div className="flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="flex-1 border border-white/20 text-gray-400 hover:text-white font-bold text-xs uppercase tracking-widest py-3 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="button"
                    onClick={saveProfile}
                    disabled={savingProfile || !profileName.trim()}
                    className="flex-1 bg-brand-gold hover:bg-yellow-400 text-black font-bold text-xs uppercase tracking-widest py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.25)]"
                  >
                    {savingProfile ? <Loader2 size={16} className="animate-spin" /> : "Guardar Cambios"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* BADGES, PURCHASE HISTORY & REFERRAL CTA */}
          <BadgesAndHistory user={user} clientData={clientData} />

          {/* FORUM & CLUB VOICES */}
          <ForumSection user={user} clientData={clientData} />

        </div>
      </div>
    </MaintenanceGuard>
  );
}
