import React from 'react';

interface RangoliPatternProps {
  className?: string;
  size?: number;
  opacity?: number;
}

export const RangoliPattern: React.FC<RangoliPatternProps> = ({
  className = '',
  size = 320,
  opacity = 0.85
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`overflow-visible select-none pointer-events-none ${className}`}
      style={{ opacity }}
    >
      <defs>
        <linearGradient id="rangoliLotusPink" x1="0" y1="0" x2="400" y2="400" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E98EAF" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#F4C4D2" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#A99BBF" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="rangoliGold" x1="0" y1="200" x2="400" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDB863" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#FFE29A" stopOpacity="0.8" />
        </linearGradient>
      </defs>

      {/* Concentric Outermost Decorative Ring */}
      <circle cx="200" cy="200" r="185" stroke="#E98EAF" strokeWidth="1" strokeDasharray="3 5" opacity="0.6" />
      <circle cx="200" cy="200" r="172" stroke="#F3EAE2" strokeWidth="1.5" opacity="0.75" />
      <circle cx="200" cy="200" r="158" stroke="#FDB863" strokeWidth="1" strokeDasharray="2 4" opacity="0.6" />

      {/* 16-point Outer Floral Petals */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i * 360) / 16;
        return (
          <g key={`petal-outer-${i}`} transform={`rotate(${angle} 200 200)`}>
            <path
              d="M200 35 C190 70 185 110 200 135 C215 110 210 70 200 35 Z"
              fill="url(#rangoliLotusPink)"
              opacity="0.5"
            />
            <circle cx="200" cy="32" r="3" fill="#F4C4D2" />
          </g>
        );
      })}

      {/* Middle Concentric Circle */}
      <circle cx="200" cy="200" r="115" stroke="#F3EAE2" strokeWidth="1.5" opacity="0.7" />
      <circle cx="200" cy="200" r="95" stroke="#E98EAF" strokeWidth="1.2" opacity="0.8" />

      {/* 8-point Lotus Mandala */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 360) / 8 + 22.5;
        return (
          <g key={`petal-mid-${i}`} transform={`rotate(${angle} 200 200)`}>
            <path
              d="M200 95 C180 125 180 155 200 170 C220 155 220 125 200 95 Z"
              fill="#E98EAF"
              opacity="0.65"
              stroke="#FFF"
              strokeWidth="0.8"
            />
            <circle cx="200" cy="115" r="2" fill="#FFE29A" />
          </g>
        );
      })}

      {/* Inner Geometrical Star / Ashtakon */}
      <polygon
        points="200,140 215,185 260,185 224,210 238,255 200,230 162,255 176,210 140,185 185,185"
        stroke="url(#rangoliGold)"
        strokeWidth="1.5"
        fill="rgba(233, 142, 175, 0.15)"
      />

      {/* Inner Central Core */}
      <circle cx="200" cy="200" r="32" fill="#102C38" stroke="#FFE29A" strokeWidth="1.5" />
      <circle cx="200" cy="200" r="18" fill="#D16D91" opacity="0.8" />
      <circle cx="200" cy="200" r="6" fill="#FFF" />
    </svg>
  );
};

