import { AuthProvider } from "../../components/AuthProvider";

export const metadata = {
  title: "Comunidad Exclusiva | GranColinos",
  description: "Espacio privado para la comunidad de GranColinos (+18).",
};

export default function ComunidadLayout({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
