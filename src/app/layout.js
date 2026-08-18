import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "../components/Providers";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CartDrawer from "../components/CartDrawer";
import Analytics from "../components/Analytics";
import MaintenancePage from "../components/MaintenancePage";
import { fetchCMSPage } from "../utils/firebase";
import { cache } from "react";

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

            {/* Luxury Modular Footer */}
            <Footer footerConfig={footerBlock} />
          </Providers>
        )}
      </body>
    </html>
  );
}
