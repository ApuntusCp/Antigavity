import React from 'react';
import { BookOpen, Bookmark, ArrowRight, Star, Book, FileText, Award } from 'lucide-react';
import PaymentMethodsBadge from '../../components/PaymentMethodsBadge';

export const metadata = {
  title: 'Biblioteca & Libros | GranColinos',
  description: 'Colección de publicaciones, guías botánicas y obras de sabiduría natural.',
};

export default function LibrosPage() {
  const books = [
    {
      id: 1,
      title: "El Poder Sanador de las Abejas",
      subtitle: "Manual completo de Apitoxina y Apiterapia Moderna",
      author: "GranColinos Editorial",
      icon: <Award size={36} className="text-[#F3E5AB]" />,
      pages: "180 págs",
      rating: "5.0 / 5.0"
    },
    {
      id: 2,
      title: "Compendio Botánico Andino",
      subtitle: "Plantas medicinales de la Cordillera Central de Colombia",
      author: "Investigación APONTE",
      icon: <FileText size={36} className="text-[#F3E5AB]" />,
      pages: "240 págs",
      rating: "4.9 / 5.0"
    },
    {
      id: 3,
      title: "Filosofía del Lujo Puro",
      subtitle: "Ingredientes sagrados y la búsqueda de la longevidad",
      author: "Club GranColinos",
      icon: <Book size={36} className="text-[#F3E5AB]" />,
      pages: "150 págs",
      rating: "5.0 / 5.0"
    }
  ];

  return (
    <div className="min-h-screen theme-libros text-white pt-32 pb-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 fade-in">
          <span className="text-[#F3E5AB] text-xs font-bold tracking-[0.3em] uppercase mb-3 block flex items-center justify-center gap-2">
            <BookOpen size={16} className="text-[#F3E5AB]" /> BIBLIOTECA EDITORIAL
          </span>
          <h1 className="font-serif text-4xl md:text-6xl text-[#F3E5AB] mb-6 drop-shadow-md">
            Libros & Publicaciones
          </h1>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#F3E5AB] to-transparent mx-auto mb-6"></div>
          <p className="text-gray-300 max-w-2xl mx-auto font-light leading-relaxed text-sm md:text-base">
            Obras exclusivas sobre bienestar vegetal, salud apícola y sabiduría ancestral publicadas por GranColinos.
          </p>
        </div>

        {/* Featured Book Hero */}
        <div className="bg-black/50 border border-[#F3E5AB]/40 rounded-3xl p-8 md:p-12 backdrop-blur-xl shadow-2xl mb-16 glow-libros">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-36 h-48 rounded-2xl bg-gradient-to-br from-[#F3E5AB]/20 to-black border border-[#F3E5AB]/40 flex items-center justify-center text-[#F3E5AB] shadow-2xl shrink-0">
              <BookOpen size={56} />
            </div>
            
            <div className="space-y-4">
              <span className="px-3 py-1 bg-[#F3E5AB]/20 text-[#F3E5AB] text-[10px] font-extrabold uppercase tracking-widest rounded-md border border-[#F3E5AB]/40 inline-flex items-center gap-2">
                <Bookmark size={12} /> OBRA DESTACADA 2026
              </span>
              <h2 className="font-serif text-3xl font-bold text-white leading-tight">
                "Apitoxina: De la Tradición a la Nanotecnología Botánica"
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed font-light">
                Una guía imprescindible que explora el potencial antiinflamatorio de los péptidos de apitoxina en la medicina moderna. Disponible en edición digital y física de lujo.
              </p>
              <div className="flex items-center gap-4 text-xs font-mono text-[#F3E5AB]">
                <span>210 Páginas</span>
                <span>•</span>
                <span>Edición Coleccionista Tapa Dura</span>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de Libros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {books.map((book) => (
            <div key={book.id} className="bg-black/40 border border-[#F3E5AB]/20 hover:border-[#F3E5AB]/60 rounded-2xl p-6 backdrop-blur-xl shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-full h-40 rounded-xl bg-[#F3E5AB]/10 border border-[#F3E5AB]/20 flex items-center justify-center mb-6">
                  {book.icon}
                </div>
                <span className="text-[#F3E5AB] text-[10px] font-bold tracking-widest uppercase block mb-1">
                  {book.author}
                </span>
                <h3 className="font-serif text-xl font-bold text-white mb-2 leading-snug">
                  {book.title}
                </h3>
                <p className="text-gray-400 text-xs font-light mb-4">
                  {book.subtitle}
                </p>
              </div>
              
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                <span className="text-[#F3E5AB]">{book.rating}</span>
                <span className="text-gray-400">{book.pages}</span>
              </div>
            </div>
          ))}
        </div>

        <PaymentMethodsBadge />
      </div>
    </div>
  );
}
