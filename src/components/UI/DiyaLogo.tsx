import React from 'react';

interface DiyaLogoProps {
  className?: string;
  size?: number;
  glow?: boolean;
  alt?: string;
}

export const DiyaLogo: React.FC<DiyaLogoProps> = ({
  className = "w-8 h-auto",
  size,
  glow = false,
  alt = "JYOTI Diya Logo"
}) => {
  const style = size ? { width: `${size}px`, height: 'auto' } : undefined;

  return (
    <img
      src="/assets/jyoti-logo.png"
      alt={alt}
      style={style}
      className={`object-contain inline-block select-none transition-all duration-300 ${
        glow ? 'drop-shadow-[0_0_14px_rgba(255,185,80,0.6)]' : ''
      } ${className}`}
      loading="eager"
      draggable={false}
    />
  );
};

