"use client";

import React from 'react';
import { Leaf, Droplets, Sun, Sparkles, Shield, User, Check } from 'lucide-react';

export const THEME_AVATAR_ICONS = {
  leaf: { id: 'leaf', name: 'Hoja Botánica', icon: Leaf, bg: 'from-emerald-900/60 to-emerald-700/40', text: 'text-emerald-400' },
  droplet: { id: 'droplet', name: 'Gota CBD', icon: Droplets, bg: 'from-amber-900/60 to-amber-700/40', text: 'text-amber-400' },
  sun: { id: 'sun', name: 'Energía Solar', icon: Sun, bg: 'from-yellow-900/60 to-yellow-600/40', text: 'text-yellow-400' },
  sparkle: { id: 'sparkle', name: 'Esencia Áurea', icon: Sparkles, bg: 'from-brand-gold/40 to-yellow-500/30', text: 'text-brand-gold' },
  shield: { id: 'shield', name: 'Protector Holístico', icon: Shield, bg: 'from-green-950/80 to-emerald-900/60', text: 'text-emerald-300' },
};

export function RenderAvatar({ 
  photoUrl, 
  avatarType = 'letter', 
  avatarIconId = 'leaf', 
  name = 'Miembro', 
  size = 'md' 
}) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-20 h-20 text-xl',
    xl: 'w-24 h-24 text-2xl'
  };

  const iconSizes = {
    sm: 16,
    md: 22,
    lg: 36,
    xl: 42
  };

  if (avatarType === 'upload' && photoUrl) {
    return (
      <img 
        src={photoUrl} 
        alt={name} 
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-brand-gold/60 shadow-lg`} 
      />
    );
  }

  if (avatarType === 'icon' && THEME_AVATAR_ICONS[avatarIconId]) {
    const theme = THEME_AVATAR_ICONS[avatarIconId];
    const IconComponent = theme.icon;
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${theme.bg} border-2 border-brand-gold/50 flex items-center justify-center ${theme.text} shadow-lg shrink-0`}>
        <IconComponent size={iconSizes[size]} />
      </div>
    );
  }

  // Fallback: Initial letter with brand gradient
  const initial = (name || 'C')[0].toUpperCase();
  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-tr from-[#2D5016] via-[#1a380d] to-[#C9A227]/40 border-2 border-brand-gold/40 flex items-center justify-center text-white font-bold tracking-wider shadow-lg shrink-0`}>
      {initial}
    </div>
  );
}

export default function AvatarSelector({ 
  currentType, 
  currentIconId, 
  onSelectIcon, 
  onSelectType 
}) {
  return (
    <div className="space-y-4">
      <label className="block text-xs uppercase tracking-widest text-gray-400 font-bold">
        Elige tu Ícono de Identidad Botánica
      </label>
      <div className="grid grid-cols-5 gap-3">
        {Object.values(THEME_AVATAR_ICONS).map((item) => {
          const IconComp = item.icon;
          const isSelected = currentType === 'icon' && currentIconId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelectType('icon');
                onSelectIcon(item.id);
              }}
              className={`p-3 rounded-xl flex flex-col items-center gap-1.5 transition-all border ${
                isSelected 
                  ? 'bg-brand-gold/20 border-brand-gold shadow-[0_0_15px_rgba(212,175,55,0.3)] scale-105' 
                  : 'bg-black/40 border-white/10 hover:border-brand-gold/40 text-gray-400 hover:text-white'
              }`}
            >
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${item.bg} flex items-center justify-center ${item.text}`}>
                <IconComp size={20} />
              </div>
              <span className="text-[10px] text-center font-medium leading-tight line-clamp-1">{item.name}</span>
              {isSelected && <Check size={12} className="text-brand-gold" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
