import React, { useRef, useEffect } from 'react';
import { RibbonEngine } from './RibbonEngine';

interface BackgroundCanvasProps {
  engine: RibbonEngine | null;
}

export const BackgroundCanvas: React.FC<BackgroundCanvasProps> = ({ engine }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !engine) return;

    engine.attach(canvas);

    return () => {
      // engine lifecycle handled by GlobalBackground
    };
  }, [engine]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block pointer-events-none select-none"
      aria-hidden="true"
    />
  );
};

