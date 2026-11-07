import React from 'react';
import { DiyaLogo } from './DiyaLogo';

export { DiyaLogo };

interface LotusIconProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

/**
 * Re-exports the official JYOTI Diya Logo as the primary brand emblem
 * to ensure all legacy and modern call sites reflect the official Diya sign.
 */
export const LotusIcon: React.FC<LotusIconProps> = ({
  className = "w-8 h-auto",
  size,
  glow = true
}) => {
  return (
    <DiyaLogo
      size={size}
      glow={glow}
      className={className}
    />
  );
};
