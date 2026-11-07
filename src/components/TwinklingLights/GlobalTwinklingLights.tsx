import React, { useEffect, useRef } from 'react';
import { TwinklingLightsEngine } from './TwinklingLightsEngine';

/**
 * GlobalTwinklingLights:
 * A unified, highly-performant background lighting canvas that renders
 * subtle, delicate, colourful blinking LED fairy lights throughout the JYOTI website.
 *
 * - Canvas 2D with pre-rendered offscreen sprites.
 * - Organic distribution framing headings, image perimeters, and negative spaces.
 * - Subtle cursor proximity reaction (gentle brightening, micro-drift, soft shimmer).
 * - Autonomous breeze sway on idle/touch devices.
 * - Seamless integration with GSAP ScrollTrigger and Lenis smooth scrolling.
 * - pointer-events: none ensures zero interference with user interactions.
 */
export const GlobalTwinklingLights: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<TwinklingLightsEngine | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new TwinklingLightsEngine();
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
      className="fixed inset-0 pointer-events-none z-[1] w-full h-full select-none"
      aria-hidden="true"
    />
  );
};

