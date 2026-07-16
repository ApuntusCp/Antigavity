"use client";

import { useState } from "react";
import { useAuth } from "../../components/AuthProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { db } from "../../utils/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'GC-';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

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
      const userCredential = await register(email, password);
      const user = userCredential.user;

      // 2. Generar cupón de bienvenida
      const newCode = generateCode();
      
      // 3. Guardar el cupón en Firestore
      await setDoc(doc(db, 'coupons', newCode), {
        code: newCode,
        type: 'PERCENTAGE',
        value: 10, // 10% de descuento
        maxUses: 1,
        usedCount: 0,
        active: true,
        isWelcomeCoupon: true,
        assignedTo: email.toLowerCase().trim(),
        createdAt: serverTimestamp()
      });

      // 4. Guardar cliente (CRM) en Firestore
      // Usamos el UID del usuario como ID del documento para facilitar la búsqueda
      await setDoc(doc(db, 'clients', user.uid), {
        uid: user.uid,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        couponCode: newCode,
        source: 'Club Registro',
        createdAt: serverTimestamp()
      });

      setSuccess(true);
      
      // Redirigir al dashboard de la comunidad después de 3 segundos
      setTimeout(() => {
        router.push("/comunidad");
      }, 3000);

    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError("Este correo electrónico ya está registrado. Por favor inicia sesión.");
      } else {
        setError("Ocurrió un error al registrarte: " + err.message);
      }
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-brand-light dark:bg-brand-dark flex items-center justify-center py-24 px-6 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-gold/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-md w-full relative z-10 fade-in text-center">
          <div className="bg-white dark:bg-[#111] p-10 rounded-2xl shadow-2xl border border-brand-gold/30">
            <CheckCircle className="w-20 h-20 text-brand-gold mx-auto mb-6 animate-in zoom-in" />
            <h1 className="font-playfair text-3xl text-brand-dark dark:text-white mb-4">¡Bienvenido al Club!</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Tu cuenta ha sido creada exitosamente. Hemos generado tu cupón de bienvenida.
            </p>
            <div className="flex items-center justify-center gap-2 text-brand-gold">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-bold tracking-widest uppercase">Redirigiendo...</span>
            </div>
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
        <div className="bg-white dark:bg-[#111] p-10 rounded-2xl shadow-2xl border border-gray-100 dark:border-white/5">
          <div className="text-center mb-8">
            <h1 className="font-playfair text-3xl text-brand-dark dark:text-white mb-2">Únete al Club</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 tracking-widest uppercase">Beneficios Exclusivos & Comunidad</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg flex items-start gap-3">
              <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-gray-600 dark:text-gray-400 mb-2">Nombre Completo</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-lg pl-12 pr-4 py-3 text-brand-dark dark:text-white focus:outline-none focus:border-brand-gold transition-colors"
                  placeholder="Tu Nombre"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-gray-600 dark:text-gray-400 mb-2">Correo Electrónico</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-lg pl-12 pr-4 py-3 text-brand-dark dark:text-white focus:outline-none focus:border-brand-gold transition-colors"
                  placeholder="tu@correo.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-gray-600 dark:text-gray-400 mb-2">Contraseña</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-lg pl-12 pr-4 py-3 text-brand-dark dark:text-white focus:outline-none focus:border-brand-gold transition-colors"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-gold hover:bg-yellow-500 text-brand-dark font-bold text-xs uppercase tracking-widest py-4 rounded-lg transition-colors flex justify-center items-center gap-2"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : "Crear mi Cuenta"}
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
