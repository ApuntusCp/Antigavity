'use client';

import { useState } from 'react';
import { Leaf, X, Loader2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../utils/firebase';

export default function JoinMovementButton({ text = "Únete al Manifiesto" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    motivation: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.motivation) return;
    
    setLoading(true);
    try {
      await addDoc(collection(db, 'movement_members'), {
        ...formData,
        joinedAt: serverTimestamp(),
        status: 'Pendiente de Revisión'
      });
      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
        setFormData({ name: '', email: '', phone: '', motivation: '' });
      }, 3000);
    } catch (error) {
      console.error("Error al registrar integrante:", error);
      alert("Hubo un error al registrar tu solicitud. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-extrabold text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-white transition-all shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:scale-105 inline-flex items-center gap-2 cursor-pointer border border-[#D4AF37]/50"
      >
        <Leaf size={16} /> {text}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={() => setIsOpen(false)} />
          
          <div className="relative w-full max-w-lg bg-[#051208] border border-[#D4AF37]/40 rounded-3xl p-8 shadow-2xl animate-fade-in-up">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#D4AF37]/15 rounded-xl flex items-center justify-center border border-[#D4AF37]/40 text-[#D4AF37]">
                <Leaf size={20} />
              </div>
              <h2 className="text-2xl font-serif font-bold text-white">Registro de Militante</h2>
            </div>

            {success ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-[#D4AF37]/20 text-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#D4AF37]/40">
                  <Leaf size={32} />
                </div>
                <h3 className="text-xl font-serif font-bold text-white mb-2">¡Tu solicitud ha sido enviada!</h3>
                <p className="text-gray-300 text-sm">Nuestro equipo revisará tu motivación. Pronto te contactaremos para los siguientes pasos.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-gray-300 text-sm mb-6 font-light">
                  Gran Colinos no es para todos. Buscamos pioneros dispuestos a impulsar el cambio botánico y tecnológico en Colombia.
                </p>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-widest text-[#D4AF37] mb-2">Nombre Completo *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-[#030904] border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none font-mono text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-widest text-[#D4AF37] mb-2">Email *</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-[#030904] border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-widest text-[#D4AF37] mb-2">Teléfono / WhatsApp</label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-[#030904] border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none font-mono text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-widest text-[#D4AF37] mb-2">¿Por qué quieres unirte al movimiento? *</label>
                  <textarea 
                    required
                    rows={4}
                    value={formData.motivation}
                    onChange={e => setFormData({...formData, motivation: e.target.value})}
                    placeholder="Cuéntanos tu interés en la simbiosis botánica y tecnológica..."
                    className="w-full bg-[#030904] border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none resize-none font-mono text-sm"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-extrabold text-xs uppercase tracking-widest py-4 rounded-xl mt-4 hover:bg-white transition-all flex justify-center items-center gap-2 disabled:opacity-50 shadow-lg"
                >
                  {loading ? <Loader2 size={20} className="animate-spin" /> : 'Enviar Solicitud al Movimiento'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
