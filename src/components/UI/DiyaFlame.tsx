import React from 'react';

interface DiyaFlameProps {
  isLit?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
  showRays?: boolean;
}

export const DiyaFlame: React.FC<DiyaFlameProps> = ({
  isLit = true,
  size = 'md',
  className = '',
  onClick,
  showRays = true
}) => {
  const sizeMap = {
    sm: { w: 40, h: 48, flameScale: 0.7 },
    md: { w: 64, h: 76, flameScale: 1.0 },
    lg: { w: 100, h: 120, flameScale: 1.5 },
    xl: { w: 160, h: 190, flameScale: 2.2 }
  };

  const { w, h, flameScale } = sizeMap[size];

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex flex-col items-center justify-center select-none ${onClick ? 'cursor-pointer group' : ''} ${className}`}
      style={{ width: `${w}px`, height: `${h}px` }}
      title={onClick ? (isLit ? "Click to extinguish" : "Click to light the Diya") : "Diya"}
    >
      {/* Outer Ambient Radial Halo */}
      {isLit && (
        <div
          className="absolute -top-4 rounded-full pointer-events-none transition-all duration-700 animate-pulse-subtle"
          style={{
            width: `${w * 2.4}px`,
            height: `${w * 2.4}px`,
            background: 'radial-gradient(circle, rgba(253, 184, 99, 0.45) 0%, rgba(233, 142, 175, 0.2) 40%, rgba(16, 44, 56, 0) 70%)',
            transform: 'translateY(-15%)',
          }}
        />
      )}

      {/* SVG Diya with Terracotta/Brass Base & Flame */}
      <svg
        width={w}
        height={h}
        viewBox="0 0 100 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          <radialGradient id="flameInner" cx="50%" cy="80%" r="60%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#FFF2B2" />
            <stop offset="70%" stopColor="#FFB300" />
            <stop offset="100%" stopColor="#FF5722" />
          </radialGradient>

          <radialGradient id="flameOuter" cx="50%" cy="80%" r="70%">
            <stop offset="0%" stopColor="#FFE082" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#FF9800" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#D84315" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="bowlGrad" x1="10" y1="75" x2="90" y2="115" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A65337" />
            <stop offset="50%" stopColor="#7E3A25" />
            <stop offset="100%" stopColor="#461E14" />
          </linearGradient>

          <linearGradient id="brassRim" x1="15" y1="75" x2="85" y2="82" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FDB863" />
            <stop offset="50%" stopColor="#FFE29A" />
            <stop offset="100%" stopColor="#C47E20" />
          </linearGradient>
        </defs>

        {/* FLAME SECTION */}
        {isLit ? (
          <g className="animate-flame" style={{ transformOrigin: '50px 75px' }}>
            {/* Outer soft aura */}
            <path
              d="M50 15 C58 35 68 50 68 66 C68 76 60 80 50 80 C40 80 32 76 32 66 C32 50 42 35 50 15 Z"
              fill="url(#flameOuter)"
              opacity="0.8"
            />
            {/* Main teardrop flame */}
            <path
              d="M50 24 C56 40 64 52 64 66 C64 74 57 78 50 78 C43 78 36 74 36 66 C36 52 44 40 50 24 Z"
              fill="url(#flameInner)"
            />
            {/* Core incandescent tongue */}
            <path
              d="M50 44 C53 52 56 60 56 68 C56 73 53 76 50 76 C47 76 44 73 44 68 C44 60 47 52 50 44 Z"
              fill="#FFFFFF"
              opacity="0.9"
            />
          </g>
        ) : (
          /* Unlit Wick */
          <path
            d="M50 72 C49 68 50 65 52 63"
            stroke="#2B2625"
            strokeWidth="3"
            strokeLinecap="round"
          />
        )}

        {/* DIYA BOWL */}
        {/* Shadow underneath */}
        <ellipse cx="50" cy="112" rx="36" ry="6" fill="#061116" opacity="0.6" />

        {/* Earthen Bowl Body */}
        <path
          d="M15 78 C20 102 34 112 50 112 C66 112 80 102 85 78 C85 78 50 82 15 78 Z"
          fill="url(#bowlGrad)"
        />

        {/* Rim of the Diya */}
        <ellipse cx="50" cy="78" rx="35" ry="6.5" fill="url(#brassRim)" />
        <ellipse cx="50" cy="78" rx="31" ry="4.5" fill="#3D1A10" />

        {/* Traditional carved notches on the rim */}
        <circle cx="28" cy="79" r="1.5" fill="#FFE29A" opacity="0.8" />
        <circle cx="38" cy="80.5" r="1.5" fill="#FFE29A" opacity="0.8" />
        <circle cx="50" cy="81" r="1.6" fill="#FFE29A" opacity="0.9" />
        <circle cx="62" cy="80.5" r="1.5" fill="#FFE29A" opacity="0.8" />
        <circle cx="72" cy="79" r="1.5" fill="#FFE29A" opacity="0.8" />

        {/* Carved spiral/motif on terracotta belly */}
        <path
          d="M32 94 Q50 102 68 94"
          stroke="#E98EAF"
          strokeWidth="1.2"
          strokeDasharray="2 3"
          opacity="0.65"
        />
      </svg>

      {/* Floating Sparkle Embers */}
      {isLit && showRays && (
        <div className="absolute -top-3 pointer-events-none w-full flex justify-center">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFE29A] animate-ping opacity-75" />
        </div>
      )}
    </div>
  );
};

