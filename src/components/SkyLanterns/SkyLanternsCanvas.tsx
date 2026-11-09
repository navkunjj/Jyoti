import React, { useEffect, useRef } from 'react';
import { SkyLanternsEngine } from './SkyLanternsEngine';

interface SkyLanternsCanvasProps {
  className?: string;
}

/**
 * SkyLanternsCanvas:
 * Refined, tranquil traditional glowing paper sky lanterns.
 *
 * - Shows only 2–4 small/medium lanterns at a time across outer margins.
 * - Floats continuously upward at a slow, peaceful, natural speed.
 * - Completely independent of scroll progress (never sped up, bursted, or altered by scrolling).
 * - Guaranteed zero obstruction of central content, text, buttons, or cards.
 */
export const SkyLanternsCanvas: React.FC<SkyLanternsCanvasProps> = ({
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<SkyLanternsEngine | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new SkyLanternsEngine();
    engineRef.current = engine;
    engine.mount(canvas);

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none select-none w-full h-full z-[14] ${className}`}
      aria-hidden="true"
    />
  );
};
