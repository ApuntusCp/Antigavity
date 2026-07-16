"use client";

import { useState } from "react";
import { useAuth } from "../../components/AuthProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      router.push("/comunidad");
    } catch (err) {
      console.error(err);
      setError("Credenciales inválidas. Por favor, verifica tu correo y contraseña.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark flex items-center justify-center py-24 px-6 relative overflow-hidden">
      {/* Decorative blurred background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-gold/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-green/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10 fade-in">
        <div className="bg-white dark:bg-[#111] p-10 rounded-2xl shadow-2xl border border-gray-100 dark:border-white/5">
          <div className="text-center mb-8">
            <h1 className="font-playfair text-3xl text-brand-dark dark:text-white mb-2">Bienvenido de Vuelta</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 tracking-widest uppercase">Club Gran Colinos</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg flex items-start gap-3">
              <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
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
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-gold hover:bg-yellow-500 text-brand-dark font-bold text-xs uppercase tracking-widest py-4 rounded-lg transition-colors flex justify-center items-center gap-2"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : "Iniciar Sesión"}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-gray-100 dark:border-white/10 pt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ¿No eres miembro aún?{" "}
              <Link href="/registro" className="text-brand-gold hover:text-yellow-400 font-bold transition-colors">
                Únete al Club
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
