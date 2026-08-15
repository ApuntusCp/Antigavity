"use client";

import { useState } from "react";
import { useAuth } from "../../components/AuthProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, Loader2, AlertCircle, CheckCircle, Eye, EyeOff, Copy, ArrowRight, Sparkles } from "lucide-react";
import { updateProfile } from "firebase/auth";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [welcomeCoupon, setWelcomeCoupon] = useState("");
  const [copied, setCopied] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      // 1. Crear usuario en Firebase Auth
      const userCredential = await register(email.toLowerCase().trim(), password);
      const user = userCredential.user;

      // 2. Asignar displayName en el perfil de Auth
      try {
        await updateProfile(user, { displayName: name.trim() });
      } catch (profileErr) {
        console.warn("Could not update auth profile displayName:", profileErr);
      }

      // 3. Sincronizar con Firestore y GC Admin de forma segura en el servidor
      const response = await fetch('/api/club/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          name: name.trim(),
          email: email.toLowerCase().trim(),
          source: 'Club Registro'
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "No se pudo sincronizar el perfil con el Club.");
      }

      setWelcomeCoupon(data.couponCode || "GC-BIENVENIDO");
      setSuccess(true);

    } catch (err) {
      console.error("[Register Error]:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError("Este correo electrónico ya está registrado. Por favor inicia sesión con tu contraseña.");
      } else if (err.code === 'auth/invalid-email') {
        setError("El formato del correo electrónico no es válido.");
      } else if (err.code === 'auth/weak-password') {
        setError("La contraseña es muy débil. Debe tener al menos 6 caracteres.");
      } else {
        setError("Ocurrió un error al registrarte: " + (err.message || "Intenta nuevamente"));
      }
      setIsLoading(false);
    }
  };

  const copyCoupon = () => {
    if (welcomeCoupon) {
      navigator.clipboard.writeText(welcomeCoupon);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-brand-light dark:bg-brand-dark flex items-center justify-center py-24 px-6 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-gold/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-md w-full relative z-10 fade-in text-center">
          <div className="bg-white dark:bg-[#111] p-8 md:p-10 rounded-2xl shadow-2xl border border-brand-gold/40">
            <div className="inline-flex items-center justify-center p-3 bg-brand-gold/10 rounded-full mb-4 border border-brand-gold/30">
              <Sparkles className="w-10 h-10 text-brand-gold" />
            </div>
            
            <h1 className="font-playfair text-3xl text-brand-dark dark:text-white mb-2">¡Bienvenido al Club!</h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
              Tu cuenta ha sido creada exitosamente. Te obsequiamos un <strong className="text-brand-gold">10% de descuento</strong> en tu primera compra.
            </p>

            {welcomeCoupon && (
              <div className="bg-black/40 border border-brand-gold/40 rounded-xl p-5 mb-6 text-center">
                <span className="text-[10px] uppercase tracking-widest text-brand-gold font-bold block mb-1">
                  Tu Cupón Exclusivo de Bienvenida
                </span>
                <p className="text-2xl md:text-3xl font-mono font-black text-white tracking-widest mb-3">
                  {welcomeCoupon}
                </p>
                <button
                  type="button"
                  onClick={copyCoupon}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-brand-gold/20 hover:bg-brand-gold/30 text-brand-gold rounded-full text-xs font-bold uppercase tracking-wider border border-brand-gold/30 transition-all"
                >
                  {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                  {copied ? "¡Copiado al portapapeles!" : "Copiar Cupón"}
                </button>
              </div>
            )}

            <button
              onClick={() => router.push("/comunidad")}
              className="w-full bg-brand-gold hover:bg-yellow-500 text-brand-dark font-bold text-xs uppercase tracking-widest py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)]"
            >
              Ir a Mi Panel de Comunidad <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark flex items-center justify-center py-24 px-6 relative overflow-hidden">
      {/* Decorative blurred background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-gold/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-green/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10 fade-in mt-10">
        <div className="bg-white dark:bg-[#111] p-8 md:p-10 rounded-2xl shadow-2xl border border-gray-100 dark:border-white/5">
          <div className="text-center mb-8">
            <span className="inline-block px-3 py-1 bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-[10px] font-bold uppercase tracking-widest rounded-full mb-3">
              Membresía Exclusiva
            </span>
            <h1 className="font-playfair text-3xl text-brand-dark dark:text-white mb-2">Únete al Club</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 tracking-widest uppercase">
              10% OFF en tu primera compra + Envíos VIP
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 rounded-xl flex items-start gap-3">
              <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 dark:text-red-400 leading-snug">{error}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-gray-600 dark:text-gray-400 mb-2">
                Nombre Completo
              </label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-brand-dark dark:text-white focus:outline-none focus:border-brand-gold transition-colors text-sm"
                  placeholder="Tu Nombre y Apellido"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-gray-600 dark:text-gray-400 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-brand-dark dark:text-white focus:outline-none focus:border-brand-gold transition-colors text-sm"
                  placeholder="tu@correo.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl pl-12 pr-12 py-3.5 text-brand-dark dark:text-white focus:outline-none focus:border-brand-gold transition-colors text-sm"
                  placeholder="Mínimo 6 caracteres"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-gold transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-gold hover:bg-yellow-500 text-brand-dark font-bold text-xs uppercase tracking-widest py-4 rounded-xl transition-all flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.25)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Creando tu cuenta VIP...</span>
                </>
              ) : (
                "Crear mi Cuenta & Obtener 10% OFF"
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-gray-100 dark:border-white/10 pt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ¿Ya eres miembro?{" "}
              <Link href="/login" className="text-brand-gold hover:text-yellow-400 font-bold transition-colors">
                Inicia Sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
