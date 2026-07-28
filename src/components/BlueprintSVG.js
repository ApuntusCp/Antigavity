'use client';

export default function BlueprintSVG() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20 z-10">
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="goldGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FFF1C5" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.8" />
          </linearGradient>
          <pattern id="archGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#D4AF37" strokeWidth="0.5" strokeOpacity="0.15" />
            <circle cx="60" cy="60" r="1.5" fill="#D4AF37" fillOpacity="0.3" />
          </pattern>
        </defs>

        {/* Isometric Grid Background */}
        <rect width="100%" height="100%" fill="url(#archGrid)" />

        {/* Animated Blueprint Drawing Lines */}
        <g stroke="url(#goldGlow)" fill="none" strokeWidth="1">
          {/* Main Axis Lines */}
          <line x1="100" y1="450" x2="1340" y2="450" strokeDasharray="8,8" opacity="0.5" />
          <line x1="720" y1="50" x2="720" y2="850" strokeDasharray="8,8" opacity="0.5" />

          {/* Concentric Architectural Circles */}
          <circle cx="720" cy="450" r="280" strokeWidth="1" strokeDasharray="4,6" opacity="0.4" className="animate-[spin_90s_linear_infinite]" />
          <circle cx="720" cy="450" r="360" strokeWidth="0.75" opacity="0.25" />
          <circle cx="720" cy="450" r="140" strokeWidth="1.5" strokeDasharray="12,12" opacity="0.6" className="animate-[spin_60s_linear_infinite_reverse]" />

          {/* Geometric Crosshair Elements */}
          <polygon points="720,170 730,190 710,190" fill="#D4AF37" opacity="0.6" />
          <polygon points="720,730 730,710 710,710" fill="#D4AF37" opacity="0.6" />
          <polygon points="440,450 460,440 460,460" fill="#D4AF37" opacity="0.6" />
          <polygon points="1000,450 980,440 980,460" fill="#D4AF37" opacity="0.6" />

          {/* Diagonal Structural Guides */}
          <line x1="200" y1="100" x2="1240" y2="800" strokeWidth="0.5" opacity="0.3" />
          <line x1="1240" y1="100" x2="200" y2="800" strokeWidth="0.5" opacity="0.3" />

          {/* Corner Blueprint Markers */}
          <g opacity="0.7">
            <path d="M 60 120 L 60 60 L 120 60" strokeWidth="2" />
            <path d="M 1380 120 L 1380 60 L 1320 60" strokeWidth="2" />
            <path d="M 60 780 L 60 840 L 120 840" strokeWidth="2" />
            <path d="M 1380 780 L 1380 840 L 1320 840" strokeWidth="2" />
          </g>
        </g>
      </svg>
    </div>
  );
}
