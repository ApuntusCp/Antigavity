import { Mail, Phone, MapPin } from "lucide-react";

export const metadata = {
  title: "Contacto | GranColinos",
  description: "Contáctanos para atención al cliente y soporte.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-playfair text-4xl mb-6 text-center text-brand-dark dark:text-white">Contacto Directo</h1>
        <div className="w-px h-12 bg-brand-gold mx-auto mb-12"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="flex flex-col items-center text-center p-8 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/5 rounded-sm">
            <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold mb-6">
              <Mail size={24} />
            </div>
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-2">Correo Electrónico</h3>
            <p className="text-gray-500 font-mono text-sm">soporte@grancolinos.com</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-8 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/5 rounded-sm shadow-[0_0_30px_rgba(212,175,55,0.05)]">
            <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold mb-6">
              <Phone size={24} />
            </div>
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-2">WhatsApp / Teléfono</h3>
            <p className="text-gray-500 font-mono text-sm">+57 300 000 0000</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-8 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/5 rounded-sm">
            <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold mb-6">
              <MapPin size={24} />
            </div>
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-2">Ubicación</h3>
            <p className="text-gray-500 font-mono text-sm">Bogotá, Colombia<br/>(Operación Nacional)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
