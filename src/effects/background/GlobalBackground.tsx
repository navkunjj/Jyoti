import React, { useEffect, useRef, useState } from 'react';
import { RibbonEngine } from './RibbonEngine';
import { BackgroundCanvas } from './BackgroundCanvas';
import { useScrollMotion } from './useScrollMotion';

interface GlobalBackgroundProps {
  activeSection?: string;
  className?: string;
}

export const GlobalBackground: React.FC<GlobalBackgroundProps> = ({
  activeSection,
  className = '',
}) => {
  const [engine, setEngine] = useState<RibbonEngine | null>(null);
  const engineRef = useRef<RibbonEngine | null>(null);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const newEngine = new RibbonEngine({
      reducedMotion: prefersReducedMotion,
      isMobile: typeof window !== 'undefined' ? window.innerWidth < 768 : false,
    });

    engineRef.current = newEngine;
    setEngine(newEngine);

    return () => {
      newEngine.destroy();
      engineRef.current = null;
      setEngine(null);
    };
  }, []);

  // Hook scroll reactivity into the persistent ribbon engine
  useScrollMotion({
    engine,
    activeSection,
  });

  return (
    <div
      className={`fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* 1. Deep Midnight Base Tint */}
      <div className="absolute inset-0 bg-[#061116] pointer-events-none" />

      {/* 2. One Persistent Continuous Ribbon Canvas */}
      <BackgroundCanvas engine={engine} />

      {/* 3. Subtle Vignette Depth Framing */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-[#040C10]/60 pointer-events-none" />
    </div>
  );
};

