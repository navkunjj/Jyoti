import React from 'react';

interface LotusIconProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export const LotusIcon: React.FC<LotusIconProps> = ({
  className = "w-6 h-6",
  size = 24,
  glow = false
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${glow ? 'lotus-glow' : ''}`}
    >
      <defs>
        <linearGradient id="lotusCenterGrad" x1="24" y1="8" x2="24" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F4C4D2" />
          <stop offset="60%" stopColor="#E98EAF" />
          <stop offset="100%" stopColor="#A99BBF" />
        </linearGradient>
        <linearGradient id="lotusWingGrad" x1="12" y1="16" x2="36" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E98EAF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#102C38" stopOpacity="0.7" />
        </linearGradient>
      </defs>

      {/* Outermost Petals (Left and Right) */}
      <path
        d="M24 38 C14 36 6 30 6 22 C6 18 10 16 14 18 C18 20 22 28 24 38 Z"
        fill="url(#lotusWingGrad)"
        opacity="0.85"
      />
      <path
        d="M24 38 C34 36 42 30 42 22 C42 18 38 16 34 18 C30 20 26 28 24 38 Z"
        fill="url(#lotusWingGrad)"
        opacity="0.85"
      />

      {/* Middle Petals */}
      <path
        d="M24 39 C17 36 12 28 13 18 C13 14 17 12 20 15 C23 18 23.5 28 24 39 Z"
        fill="url(#lotusCenterGrad)"
        opacity="0.92"
      />
      <path
        d="M24 39 C31 36 36 28 35 18 C35 14 31 12 28 15 C25 18 24.5 28 24 39 Z"
        fill="url(#lotusCenterGrad)"
        opacity="0.92"
      />

      {/* Central Majestic Petal */}
      <path
        d="M24 8 C27 16 31 24 30 34 C30 39 24 41 24 41 C24 41 18 39 18 34 C17 24 21 16 24 8 Z"
        fill="url(#lotusCenterGrad)"
      />

      {/* Golden Diya Base at Center */}
      <path
        d="M17 38 C19 42 29 42 31 38 Z"
        fill="#FDB863"
      />
      {/* Tiny Core Flame */}
      <circle cx="24" cy="22" r="2.2" fill="#FFE29A" className="animate-pulse" />
    </svg>
  );
};

