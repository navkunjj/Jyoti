import React, { useEffect, useRef } from 'react';
import { fireworks } from './engine';

export const FireworksCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize fireworks canvas engine
    fireworks.init(canvas);

    const handleResize = () => {
      fireworks.resize();
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
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
