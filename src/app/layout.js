import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Image from "next/image";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata = {
  title: "GranColinos | Bienestar Premium",
  description: "CBD, bienestar y snacks naturales premium colombianos con calidad INVIMA certificada.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable} h-full scroll-smooth`}>
      <body className="font-sans bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light min-h-full flex flex-col antialiased">
        
        {/* Minimal Navigation */}
        <header className="w-full fixed top-0 z-50 bg-brand-light/90 dark:bg-brand-dark/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <Image 
                src="/Logos/GranColinos.Com.png" 
                alt="GranColinos Logo" 
                width={180} 
                height={50} 
                className="object-contain"
                priority
              />
            </a>
            
            <nav className="hidden md:flex gap-10 text-xs font-semibold tracking-[0.2em] uppercase">
              <a href="#catalogo" className="hover:text-brand-gold transition-colors duration-300">Catálogo</a>
              <a href="#origen" className="hover:text-brand-gold transition-colors duration-300">Origen</a>
              <a href="/blog" className="hover:text-brand-gold transition-colors duration-300">Journal</a>
            </nav>

            <div className="flex gap-6 items-center text-xs font-semibold tracking-[0.2em] uppercase">
              <button className="hover:text-brand-gold transition-colors duration-300">Cart (0)</button>
              <button className="hidden md:block hover:text-brand-gold transition-colors duration-300">Menu</button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow pt-24">
          {children}
        </main>

        {/* Minimal Luxury Footer */}
        <footer className="bg-brand-dark text-white py-24">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16">
            <div className="md:col-span-2">
              <h3 className="font-playfair text-3xl text-brand-gold mb-6">GranColinos</h3>
              <p className="text-gray-400 text-sm leading-loose max-w-sm">
                Bienestar premium y snacks naturales de alta gama en Colombia. Calidad INVIMA certificada.
              </p>
            </div>
            
            <div>
              <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-8 text-brand-gold">Explorar</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><a href="#catalogo" className="hover:text-white transition-colors duration-300">Catálogo Premium</a></li>
                <li><a href="#origen" className="hover:text-white transition-colors duration-300">Nuestra Esencia</a></li>
                <li><a href="/blog" className="hover:text-white transition-colors duration-300">Journal de Bienestar</a></li>
              </ul>
            </div>
            
            <div>
               <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-8 text-brand-gold">Legal & Soporte</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors duration-300">Términos de Servicio</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">Habeas Data (Privacidad)</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">Contacto Directo</a></li>
              </ul>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
            <p>&copy; {new Date().getFullYear()} GranColinos. Todos los derechos reservados.</p>
            <p className="mt-4 md:mt-0 tracking-widest">DISEÑADO CON EXCELENCIA</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
