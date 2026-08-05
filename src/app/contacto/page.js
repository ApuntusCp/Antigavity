import { Mail, Phone, MapPin } from "lucide-react";
import DynamicContact from "../../components/DynamicContact";
import MaintenanceGuard from "../../components/MaintenanceGuard";

export const metadata = {
  title: "Contacto | GranColinos",
  description: "Contáctanos para atención al cliente y soporte.",
};

export default function ContactPage() {
  return (
    <MaintenanceGuard
      routeKey="/contacto"
      defaultTitle="MÓDULO DE CONTACTO DIRECTO EN CONSTRUCCIÓN"
      defaultSubtitle="Estamos preparando nuestros canales directos de atención."
      defaultModuleName="Contacto Directo"
      defaultEstimatedDate="Agosto 2026"
    >
      <div className="min-h-screen bg-brand-light dark:bg-brand-dark pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-playfair text-4xl mb-6 text-center text-brand-dark dark:text-white">Contacto Directo</h1>
          <div className="w-px h-12 bg-brand-gold mx-auto mb-12"></div>
          
          <DynamicContact />
        </div>
      </div>
    </MaintenanceGuard>
  );
}
