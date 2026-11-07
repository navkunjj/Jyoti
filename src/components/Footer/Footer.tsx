import React, { useRef, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onHeightChange?: (height: number) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onHeightChange }) => {
  const footerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!footerRef.current) return;

    const measureHeight = () => {
      if (footerRef.current && onHeightChange) {
        onHeightChange(footerRef.current.offsetHeight);
      }
    };

    measureHeight();

    const resizeObserver = new ResizeObserver(measureHeight);
    resizeObserver.observe(footerRef.current);
    window.addEventListener('resize', measureHeight, { passive: true });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', measureHeight);
    };
  }, [onHeightChange]);

  const scrollToTop = () => {
    onNavigate('welcome');
  };

  return (
    <footer
      id="site-footer"
      ref={footerRef}
      className="fixed bottom-0 left-0 right-0 z-0 w-full bg-[#040C10] text-white py-10 sm:py-12 px-6 sm:px-12 lg:px-20 select-none overflow-hidden font-sans not-italic"
    >
      <div className="max-w-7xl mx-auto w-full relative z-10 space-y-6">
        {/* Main Row: Brand, Navigation & Back to Top */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          {/* Brand & Tagline */}
          <div>
            <div className="flex items-center space-x-3">
              <span className="font-sans font-semibold text-xl tracking-[0.2em] text-white uppercase">
                JYOTI
              </span>
              <span className="text-white/30 text-sm">|</span>
              <span className="text-xs uppercase tracking-[0.2em] text-white/70 font-normal">
                A Spark of Diwali
              </span>
            </div>
            <p className="text-xs text-white/60 font-normal mt-1.5 font-sans">
              An interactive tribute to light, heritage, and timeless celebration.
            </p>
          </div>

          {/* Clean Navigation Links */}
          <nav className="flex flex-wrap items-center gap-6 sm:gap-8 text-xs uppercase tracking-[0.2em] text-white/70 font-sans">
            <button
              onClick={() => onNavigate('welcome')}
              className="hover:text-white transition-colors focus:outline-none"
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('art')}
              className="hover:text-white transition-colors focus:outline-none"
            >
              Traditions
            </button>
            <button
              onClick={() => onNavigate('across-india')}
              className="hover:text-white transition-colors focus:outline-none"
            >
              Across India
            </button>
            <button
              onClick={() => onNavigate('celebration')}
              className="hover:text-white transition-colors focus:outline-none"
            >
              Stories
            </button>
            <button
              onClick={() => onNavigate('wishes')}
              className="hover:text-white transition-colors focus:outline-none"
            >
              Wishes
            </button>
          </nav>

          {/* Simple Back to Top Button */}
          <button
            onClick={scrollToTop}
            className="group flex items-center space-x-2 px-4 py-2 rounded-full border border-white/20 hover:border-white/60 text-xs uppercase tracking-wider text-white transition-all duration-300 focus:outline-none font-sans"
            aria-label="Scroll back to top"
          >
            <span>Top</span>
            <ArrowUp className="w-3.5 h-3.5 text-white group-hover:-translate-y-0.5 transition-transform duration-300" />
          </button>
        </div>

        {/* Bottom Row: Simple Copyright & Greeting */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 gap-3 font-sans font-normal">
          <p>© {new Date().getFullYear()} JYOTI. Crafted with reverence for Indian heritage, art & light.</p>
          <div className="text-xs text-white/70 font-sans font-normal tracking-wide">
            शुभ दीपावली · Deepavali
          </div>
        </div>
      </div>
    </footer>
  );
};
