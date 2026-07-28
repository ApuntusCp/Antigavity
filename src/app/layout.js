import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "../components/Providers";
import Header from "../components/Header";
import CartDrawer from "../components/CartDrawer";
import Analytics from "../components/Analytics";
import MaintenancePage from "../components/MaintenancePage";
import { fetchCMSPage } from "../utils/firebase";
import { cache } from "react";
import Link from "next/link";

// ── Cachear la configuración global del CMS ──────────────────────────────────
// ANTES: force-dynamic forzaba SSR en CADA request → +300ms TTFB, alto costo Firestore.
// AHORA: React cache() reutiliza el resultado dentro de un mismo render tree
// y Next.js puede hacer ISR por página en lugar de SSR global.
const getCachedGlobalCMS = cache(() => fetchCMSPage('global'));
// Sin export const dynamic aquí → Next.js decide por página individualmente

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL('https://grancolinos.com'),
  title: {
    default: "GranColinos | Bienestar Premium Colombia",
    template: "%s | GranColinos",
  },
  description: "CBD, bienestar y extractos naturales premium colombianos con calidad INVIMA certificada.",
  keywords: ["CBD Colombia", "bienestar premium", "extractos naturales", "INVIMA", "GranColinos"],
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://grancolinos.com",
    siteName: "GranColinos",
    title: "GranColinos | Bienestar Premium Colombia",
    description: "CBD, bienestar y extractos naturales premium colombianos con calidad INVIMA certificada.",
  },
  twitter: {
    card: "summary_large_image",
    title: "GranColinos | Bienestar Premium Colombia",
    description: "CBD, bienestar y extractos naturales premium colombianos con calidad INVIMA certificada.",
    creator: "@grancolinos",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

// ── JSON-LD: Schema.org Organization ─────────────────────────────────────────
// Permite a Google mostrar información enriquecida (rich snippets) de la empresa
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "GranColinos",
  "url": "https://grancolinos.com",
  "logo": "https://grancolinos.com/Logos/GranColinos.Com.png",
  "description": "Tienda de bienestar premium, CBD y extractos naturales colombianos certificados por INVIMA.",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": "Spanish"
  },
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "CO"
  }
};

export default async function RootLayout({ children }) {
  const globalConfig = await getCachedGlobalCMS();
  const blocks = globalConfig?.blocks || [];
  
  const maintenanceBlock = blocks.find(b => b.type === 'maintenance')?.content || {};
  const inMaintenance = maintenanceBlock.active || false;
  
  const headerBlock = blocks.find(b => b.type === 'header_config')?.content || {};
  const footerBlock = blocks.find(b => b.type === 'footer_config')?.content || {};

  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable} h-full scroll-smooth`}>
      <head>
        {/* JSON-LD Organization Schema — rich snippets en Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
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
                    <li><Link href="/#catalogo" className="hover:text-[#D4AF37] transition-colors duration-300">Catálogo Premium</Link></li>
                    <li><Link href="/shop" className="hover:text-[#D4AF37] transition-colors duration-300">Tienda Completa</Link></li>
                    <li><Link href="/blog" className="hover:text-[#D4AF37] transition-colors duration-300">Journal de Bienestar</Link></li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-6 text-[#D4AF37]">Legal & Soporte</h4>
                  <ul className="space-y-3 text-xs text-gray-300">
                    <li><Link href="/terminos-de-servicio" className="hover:text-[#D4AF37] transition-colors duration-300">Términos de Servicio</Link></li>
                    <li><Link href="/habeas-data" className="hover:text-[#D4AF37] transition-colors duration-300">Habeas Data (Privacidad)</Link></li>
                    <li><Link href="/contacto" className="hover:text-[#D4AF37] transition-colors duration-300">Contacto Directo</Link></li>
                  </ul>
                </div>
              </div>
              
              <div className="max-w-7xl mx-auto px-6 mt-14 pt-6 border-t border-[#D4AF37]/20 flex flex-col md:flex-row justify-between items-center text-[11px] text-gray-400">
                <p suppressHydrationWarning>&copy; {new Date().getFullYear()} {footerBlock.copyright || "GRAN COLINOS SAS. TODOS LOS DERECHOS RESERVADOS."}</p>
                <p className="mt-3 md:mt-0 tracking-widest text-[#D4AF37]">DISEÑADO CON EXCELENCIA</p>
              </div>
            </footer>
          </Providers>
        )}
      </body>
    </html>
  );
}
