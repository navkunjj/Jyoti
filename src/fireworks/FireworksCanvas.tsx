import React, { useEffect, useRef } from 'react';
import { fireworks } from './engine';
import { setupScrollFireworks } from './sequences';
import { scrollCrackerDirector } from './scrollCrackers';

export const FireworksCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize fireworks engine
    fireworks.init(canvas);

    // Setup section scroll triggers and continuous automatic scroll cracker director
    const cleanupTriggers = setupScrollFireworks();
    const cleanupScrollCrackers = scrollCrackerDirector.start();

    const handleResize = () => {
      fireworks.resize();
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      cleanupTriggers();
      cleanupScrollCrackers();
      window.removeEventListener('resize', handleResize);
      fireworks.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[28] w-full h-full select-none"
      aria-hidden="true"
    />
  );
};

