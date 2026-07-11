export default function BlogLayout({ children }) {
  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark">
      {/* Medical Disclaimer Banner */}
      <div className="bg-brand-green text-white px-6 py-3 text-center text-xs tracking-widest uppercase font-medium">
        <p className="max-w-7xl mx-auto">
          ⚠️ Aviso INVIMA: Los productos de GranColinos no son medicamentos y no suplen una alimentación equilibrada. 
          Consulte a su médico para usos terapéuticos del CBD.
        </p>
      </div>

      <div className="pt-10">
        {children}
      </div>
    </div>
  );
}
