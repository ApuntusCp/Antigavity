import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "../components/Providers";
import Header from "../components/Header";
import CartDrawer from "../components/CartDrawer";
import Analytics from "../components/Analytics";
import MaintenancePage from "../components/MaintenancePage";
import { fetchCMSPage } from "../utils/firebase";

export const dynamic = 'force-dynamic';

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
  description: "CBD, bienestar y extractos naturales premium colombianos con calidad INVIMA certificada.",
};

export default async function RootLayout({ children }) {
  const globalConfig = await fetchCMSPage('global');
  const blocks = globalConfig?.blocks || [];
  
  const maintenanceBlock = blocks.find(b => b.type === 'maintenance')?.content || {};
  const inMaintenance = maintenanceBlock.active || false;
  
  const headerBlock = blocks.find(b => b.type === 'header_config')?.content || {};
  const footerBlock = blocks.find(b => b.type === 'footer_config')?.content || {};

  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable} h-full scroll-smooth`}>
      <body className="font-sans text-white min-h-full flex flex-col antialiased bg-leather-global">
        <Analytics />
        {inMaintenance ? (
          <MaintenancePage customMessage={maintenanceBlock.message} />
        ) : (
          <Providers>
            {/* Main Content */}
            <main className="flex-grow">
              {children}
            </main>

            {/* Bottom Floating Navigation Header */}
            <Header headerConfig={headerBlock} />
            <CartDrawer />

            {/* Luxury Semi-Transparent Footer matching Leather background */}
            <footer className="bg-[#050A04]/85 backdrop-blur-xl border-t border-[#D4AF37]/30 text-white pt-20 pb-36 relative z-10">
              <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="md:col-span-2">
                  <h3 className="font-serif text-3xl text-gold-gradient mb-4 font-bold">{footerBlock.logoText || "GranColinos"}</h3>
                  <p className="text-gray-300 text-xs md:text-sm leading-loose max-w-sm font-light">
                    {footerBlock.description || "Bienestar premium y extractos naturales de alta gama en Colombia. Calidad INVIMA certificada."}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-6 text-[#D4AF37]">Explorar</h4>
                  <ul className="space-y-3 text-xs text-gray-300">
                    <li><a href="/#catalogo" className="hover:text-[#D4AF37] transition-colors duration-300">Catálogo Premium</a></li>
                    <li><a href="/shop" className="hover:text-[#D4AF37] transition-colors duration-300">Tienda Completa</a></li>
                    <li><a href="/blog" className="hover:text-[#D4AF37] transition-colors duration-300">Journal de Bienestar</a></li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-6 text-[#D4AF37]">Legal & Soporte</h4>
                  <ul className="space-y-3 text-xs text-gray-300">
                    <li><a href="/terminos-de-servicio" className="hover:text-[#D4AF37] transition-colors duration-300">Términos de Servicio</a></li>
                    <li><a href="/habeas-data" className="hover:text-[#D4AF37] transition-colors duration-300">Habeas Data (Privacidad)</a></li>
                    <li><a href="/contacto" className="hover:text-[#D4AF37] transition-colors duration-300">Contacto Directo</a></li>
                  </ul>
                </div>
              </div>
              
              <div className="max-w-7xl mx-auto px-6 mt-14 pt-6 border-t border-[#D4AF37]/20 flex flex-col md:flex-row justify-between items-center text-[11px] text-gray-400">
                <p>&copy; {new Date().getFullYear()} {footerBlock.copyright || "GRAN COLINOS SAS. TODOS LOS DERECHOS RESERVADOS."}</p>
                <p className="mt-3 md:mt-0 tracking-widest text-[#D4AF37]">DISEÑADO CON EXCELENCIA</p>
              </div>
            </footer>
          </Providers>
        )}
      </body>
    </html>
  );
}
