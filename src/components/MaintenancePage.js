export default function MaintenancePage() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(135deg, #050505 0%, #0a0a0a 50%, #111 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        fontFamily: "'Inter', sans-serif",
        overflow: 'hidden',
      }}
    >
      {/* Fondo animado */}
      <div style={{
        position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none'
      }}>
        <div style={{
          position: 'absolute', top: '20%', left: '15%',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)',
          borderRadius: '50%', animation: 'pulse 4s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', right: '15%',
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 70%)',
          borderRadius: '50%', animation: 'pulse 6s ease-in-out infinite reverse',
        }} />
        {/* Grid lines */}
        <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.03 }}>
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#D4AF37" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Contenido central */}
      <div style={{ position: 'relative', textAlign: 'center', maxWidth: '600px', padding: '0 24px' }}>
        
        {/* Icono de construcción animado */}
        <div style={{
          width: '120px', height: '120px',
          margin: '0 auto 40px',
          background: 'rgba(212,175,55,0.08)',
          border: '1px solid rgba(212,175,55,0.25)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '52px',
          boxShadow: '0 0 60px rgba(212,175,55,0.12)',
          animation: 'float 3s ease-in-out infinite',
        }}>
          🚧
        </div>

        {/* Logo */}
        <p style={{
          fontSize: '11px', letterSpacing: '0.4em', color: '#D4AF37',
          fontWeight: '700', textTransform: 'uppercase', marginBottom: '16px',
          opacity: 0.8,
        }}>
          GranColinos
        </p>

        {/* Título */}
        <h1 style={{
          fontSize: 'clamp(32px, 5vw, 56px)',
          fontWeight: '800',
          color: '#ffffff',
          lineHeight: 1.1,
          marginBottom: '24px',
          letterSpacing: '-0.02em',
        }}>
          Estamos mejorando<br />
          <span style={{ color: '#D4AF37' }}>tu experiencia</span>
        </h1>

        {/* Descripción */}
        <p style={{
          color: '#9ca3af',
          fontSize: '16px',
          lineHeight: 1.8,
          marginBottom: '48px',
          maxWidth: '480px',
          margin: '0 auto 48px',
        }}>
          Nuestra tienda está en mantenimiento programado para ofrecerte una experiencia aún mejor.
          Volveremos muy pronto.
        </p>

        {/* Línea divisora dorada */}
        <div style={{
          width: '60px', height: '2px',
          background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
          margin: '0 auto 48px',
        }} />

        {/* Info de contacto */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '12px',
          padding: '16px 28px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
        }}>
          <span style={{ fontSize: '18px' }}>📲</span>
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '2px' }}>
              ¿Urgente? Escríbenos
            </p>
            <p style={{ fontSize: '14px', color: '#D4AF37', fontWeight: '600' }}>
              WhatsApp +57 302 769 7935
            </p>
          </div>
        </div>

        {/* Footer */}
        <p style={{
          marginTop: '48px',
          fontSize: '11px', color: '#374151',
          letterSpacing: '0.15em', textTransform: 'uppercase',
        }}>
          © {new Date().getFullYear()} GranColinos · Bienestar Premium
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
