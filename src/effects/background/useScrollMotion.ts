import { useEffect, useRef } from 'react';
import { RibbonEngine } from './RibbonEngine';

interface UseScrollMotionOptions {
  engine: RibbonEngine | null;
  activeSection?: string;
}

export function useScrollMotion({ engine, activeSection }: UseScrollMotionOptions) {
  const lastScrollYRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // Sync active section when changed externally
  useEffect(() => {
    if (engine && activeSection) {
      engine.setSection(activeSection);
    }
  }, [engine, activeSection]);

  useEffect(() => {
    if (!engine) return;

    lastScrollYRef.current = window.scrollY;
    lastTimeRef.current = performance.now();

    const sections = ['welcome', 'art', 'across-india', 'celebration', 'wishes'];

    const handleScroll = () => {
      const now = performance.now();
      const currentScrollY = window.scrollY;
      const dt = Math.max((now - lastTimeRef.current) / 1000, 0.001);

      // Raw velocity in px/s, clamped to reasonable range
      const deltaY = currentScrollY - lastScrollYRef.current;
      const rawVelocity = Math.max(-2500, Math.min(2500, deltaY / dt));
      const direction: 1 | -1 | 0 = deltaY > 0 ? 1 : deltaY < 0 ? -1 : 0;

      lastScrollYRef.current = currentScrollY;
      lastTimeRef.current = now;

      // Calculate total page scroll progress (0 to 1)
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = docHeight > 0 ? Math.min(1, Math.max(0, currentScrollY / docHeight)) : 0;

      // Determine active section and local section progress
      let currentSection = sections[0];
      let sectionProgress = 0;

      for (let i = 0; i < sections.length; i++) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5) {
            currentSection = sections[i];
            const totalH = rect.height || window.innerHeight;
            sectionProgress = Math.min(1, Math.max(0, -rect.top / totalH));
            break;
          }
        }
      }

      engine.updateScroll({
        scrollY: currentScrollY,
        scrollProgress,
        velocity: rawVelocity * 0.002, // Normalized velocity metric for fluid response
        direction,
        activeSection: currentSection,
        sectionProgress,
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [engine]);
}

