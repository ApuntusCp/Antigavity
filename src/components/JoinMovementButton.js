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
        className="bg-brand-green/10 border border-brand-green/30 text-brand-green hover:bg-brand-green hover:text-black font-bold uppercase tracking-widest px-8 py-4 rounded-lg transition-all duration-300"
      >
        {text}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          
          <div className="relative w-full max-w-lg bg-[#0a0a0a] border border-brand-green/30 rounded-2xl p-8 shadow-2xl animate-fade-in-up">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white"
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-brand-green/10 rounded-xl flex items-center justify-center border border-brand-green/30">
                <Leaf className="text-brand-green" size={20} />
              </div>
              <h2 className="text-2xl font-playfair text-white">Registro de Militante</h2>
            </div>

            {success ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-brand-green/20 text-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">¡Tu solicitud ha sido enviada!</h3>
                <p className="text-gray-400">Nuestro equipo revisará tu motivación. Pronto te contactaremos para los siguientes pasos.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-gray-400 text-sm mb-6">
                  Gran Colinos no es para todos. Buscamos pioneros dispuestos a impulsar el cambio botánico y tecnológico en Colombia.
                </p>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Nombre Completo *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-green outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email *</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-green outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Teléfono / WhatsApp</label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-green outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">¿Por qué quieres unirte al movimiento? *</label>
                  <textarea 
                    required
                    rows={4}
                    value={formData.motivation}
                    onChange={e => setFormData({...formData, motivation: e.target.value})}
                    placeholder="Cuéntanos tu interés en la simbiosis botánica y tecnológica..."
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-green outline-none resize-none"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-brand-green text-black font-bold uppercase tracking-widest py-4 rounded-lg mt-4 hover:bg-green-400 transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 size={20} className="animate-spin" /> : 'Enviar Solicitud'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
