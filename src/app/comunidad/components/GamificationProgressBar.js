"use client";

import React, { useState } from 'react';
import { Sparkles, HelpCircle, X, ShoppingBag, MessageSquare, Users, Recycle, Award } from 'lucide-react';

export default function GamificationProgressBar({ ecoPoints = 0, vipLevel = 'Bronce' }) {
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Thresholds
  // Bronce: 0 - 199 (Next: Plata @ 200)
  // Plata: 200 - 499 (Next: Oro @ 500)
  // Oro: 500+ (Max tier)
  let currentTier = 'Bronce';
  let nextTier = 'Plata';
  let minPoints = 0;
  let maxPoints = 200;
  let progressPercent = 0;
  let pointsRemaining = 0;

  if (ecoPoints >= 500) {
    currentTier = 'Oro';
    nextTier = null;
    minPoints = 500;
    maxPoints = 500;
    progressPercent = 100;
    pointsRemaining = 0;
  } else if (ecoPoints >= 200) {
    currentTier = 'Plata';
    nextTier = 'Oro';
    minPoints = 200;
    maxPoints = 500;
    progressPercent = Math.min(100, Math.round(((ecoPoints - 200) / 300) * 100));
    pointsRemaining = 500 - ecoPoints;
  } else {
    currentTier = 'Bronce';
    nextTier = 'Plata';
    minPoints = 0;
    maxPoints = 200;
    progressPercent = Math.min(100, Math.round((ecoPoints / 200) * 100));
    pointsRemaining = 200 - ecoPoints;
  }

  return (
    <div className="w-full bg-black/40 border border-brand-gold/20 rounded-xl p-4 my-3">
      {/* Header Info */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-brand-gold shrink-0" />
          <span className="text-xs font-bold uppercase tracking-wider text-white">
            Progreso de Rango: <strong className="text-brand-gold">{currentTier}</strong>
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowHelpModal(true)}
          className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-brand-gold transition-colors font-medium cursor-pointer"
        >
          <HelpCircle size={13} />
          <span>¿Cómo ganar puntos?</span>
        </button>
      </div>

      {/* Progress Bar Container */}
      <div className="relative w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/5">
        <div 
          className="h-full bg-gradient-to-r from-emerald-600 via-yellow-500 to-brand-gold rounded-full transition-all duration-700 ease-out shadow-[0_0_12px_rgba(212,175,55,0.4)]"
          style={{ width: `${Math.max(5, progressPercent)}%` }}
        />
      </div>

      {/* Status Text */}
      <div className="flex items-center justify-between text-[11px] text-gray-400 mt-2 font-mono">
        <span>{ecoPoints} Eco-Points acumulados</span>
        {nextTier ? (
          <span className="text-brand-gold">
            {pointsRemaining} pts para <strong>{nextTier}</strong>
          </span>
        ) : (
          <span className="text-yellow-400 font-bold flex items-center gap-1">
            <Crown size={12} className="text-yellow-400" /> Rango Máximo VIP
          </span>
        )}
      </div>

      {/* Modal: ¿Cómo ganar puntos? */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#0d0d0d] border border-brand-gold/40 rounded-2xl p-6 md:p-8 shadow-2xl">
            <button
              onClick={() => setShowHelpModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
              <div className="p-3 bg-brand-gold/10 border border-brand-gold/30 rounded-xl text-brand-gold">
                <Award size={24} />
              </div>
              <div>
                <h3 className="font-playfair text-xl text-white font-bold">Mecánica de Eco-Points</h3>
                <p className="text-xs text-gray-400">Club Gran Colinos • Sistema de Gamificación</p>
              </div>
            </div>

            <div className="space-y-4 mb-6 text-sm">
              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                <ShoppingBag className="text-brand-gold shrink-0 mt-0.5" size={18} />
                <div>
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider">Compras en la Tienda</h4>
                  <p className="text-gray-400 text-xs mt-0.5">Recibes 1 Eco-Point por cada $1.000 COP en compras aprobadas.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                <Users className="text-emerald-400 shrink-0 mt-0.5" size={18} />
                <div>
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider">Invitar a un Amigo</h4>
                  <p className="text-gray-400 text-xs mt-0.5">Ganas 50 Eco-Points cuando tu amigo complete su primera compra.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                <MessageSquare className="text-amber-400 shrink-0 mt-0.5" size={18} />
                <div>
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider">Aportes en el Foro</h4>
                  <p className="text-gray-400 text-xs mt-0.5">20 Eco-Points por publicar tu testimonio o guía botánica.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                <Recycle className="text-green-400 shrink-0 mt-0.5" size={18} />
                <div>
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider">Retorno de Envases</h4>
                  <p className="text-gray-400 text-xs mt-0.5">30 Eco-Points por envase reciclado en puntos autorizados.</p>
                </div>
              </div>
            </div>

            <div className="bg-black/60 border border-brand-gold/30 rounded-xl p-3 text-center">
              <span className="text-[11px] text-gray-300">
                Los rangos <strong className="text-white">Bronce (0-199)</strong>, <strong className="text-gray-300">Plata (200-499)</strong> y <strong className="text-yellow-400">Oro (500+)</strong> desbloquean descuentos automáticos y envíos gratis de por vida.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
