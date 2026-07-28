'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin } from "lucide-react";
import { db } from '../utils/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function DynamicContact() {
  const [contactInfo, setContactInfo] = useState({
    email: 'soporte@grancolinos.com',
    phone: '+57 300 000 0000',
    address: 'Bogotá, Colombia\n(Operación Nacional)'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const docRef = doc(db, 'settings', 'contact_info');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setContactInfo({
            email: data.email || 'soporte@grancolinos.com',
            phone: data.phone || '+57 300 000 0000',
            address: data.address || 'Bogotá, Colombia\n(Operación Nacional)'
          });
        }
      } catch (error) {
        console.error("Error fetching contact info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
      <div className="flex flex-col items-center text-center p-8 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/5 rounded-sm">
        <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold mb-6">
          <Mail size={24} />
        </div>
        <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-2">Correo Electrónico</h3>
        <p className={`text-gray-500 font-mono text-sm ${loading ? 'animate-pulse bg-gray-200 dark:bg-gray-800 text-transparent rounded' : ''}`}>
          {contactInfo.email}
        </p>
      </div>
      
      <div className="flex flex-col items-center text-center p-8 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/5 rounded-sm shadow-[0_0_30px_rgba(212,175,55,0.05)]">
        <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold mb-6">
          <Phone size={24} />
        </div>
        <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-2">WhatsApp / Teléfono</h3>
        <p className={`text-gray-500 font-mono text-sm ${loading ? 'animate-pulse bg-gray-200 dark:bg-gray-800 text-transparent rounded' : ''}`}>
          {contactInfo.phone}
        </p>
      </div>
      
      <div className="flex flex-col items-center text-center p-8 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/5 rounded-sm">
        <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold mb-6">
          <MapPin size={24} />
        </div>
        <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-2">Ubicación</h3>
        <p className={`text-gray-500 font-mono text-sm whitespace-pre-line ${loading ? 'animate-pulse bg-gray-200 dark:bg-gray-800 text-transparent rounded' : ''}`}>
          {contactInfo.address}
        </p>
      </div>
    </div>
  );
}
