"use client";

import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function VerificationBadge({ verifiedProfession, professionTitle, size = 'sm' }) {
  if (!verifiedProfession) return null;

  return (
    <span 
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold tracking-wider uppercase shadow-[0_0_10px_rgba(16,185,129,0.2)] select-none"
      title={professionTitle ? `Profesional Verificado: ${professionTitle}` : "Acreditación Profesional Verificada"}
    >
      <ShieldCheck size={size === 'sm' ? 12 : 14} className="text-emerald-400 shrink-0" />
      <span>{professionTitle || "Verificado"}</span>
    </span>
  );
}
