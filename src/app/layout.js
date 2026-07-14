import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "../components/Providers";
import Header from "../components/Header";
import CartDrawer from "../components/CartDrawer";
import Analytics from "../components/Analytics";
import MaintenancePage from "../components/MaintenancePage";
import { isMaintenanceModeActive } from "../utils/maintenance";

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

export default async function RootLayout({ children }) {
  const inMaintenance = await isMaintenanceModeActive();

  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable} h-full scroll-smooth`}>
      <body className="font-sans bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light min-h-full flex flex-col antialiased">
        <Analytics />
        {inMaintenance ? (
          <MaintenancePage />
        ) : (
          <Providers>
            <Header />
            <CartDrawer />

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
                    <li><a href="/terminos-de-servicio" className="hover:text-white transition-colors duration-300">Términos de Servicio</a></li>
                    <li><a href="/habeas-data" className="hover:text-white transition-colors duration-300">Habeas Data (Privacidad)</a></li>
                    <li><a href="/contacto" className="hover:text-white transition-colors duration-300">Contacto Directo</a></li>
                  </ul>
                </div>
              </div>
              
              <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                <p>&copy; {new Date().getFullYear()} GranColinos. Todos los derechos reservados.</p>
                <p className="mt-4 md:mt-0 tracking-widest">DISEÑADO CON EXCELENCIA</p>
              </div>
            </footer>
          </Providers>
        )}
      </body>
    </html>
  );
}
