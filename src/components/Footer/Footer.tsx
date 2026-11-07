import React, { useRef, useEffect } from 'react';
import { LotusIcon } from '../UI/LotusIcon';
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
      className="fixed bottom-0 left-0 right-0 z-0 w-full bg-[#040C10] text-[#F3EAE2] py-10 sm:py-12 px-6 sm:px-12 lg:px-20 select-none overflow-hidden"
    >
      {/* Background Subtle Ambience */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[180px] bg-gradient-to-t from-[#102C38]/30 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10 space-y-8">
        {/* Main Row: Brand, Editorial Message, Navigation & Back to Top */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-[#A99BBF]/15">
          {/* Brand & Editorial Epigraph */}
          <div className="flex items-center space-x-4">
            <LotusIcon size={32} glow />
            <div>
              <div className="flex items-baseline space-x-2">
                <span className="font-serif text-2xl tracking-[0.24em] text-[#F3EAE2] font-normal">
                  JYOTI
                </span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#A99BBF] font-light">
                  A Spark of Diwali
                </span>
              </div>
              <p className="text-xs text-[#FFE29A]/80 font-display italic mt-0.5 font-light">
                "May every flame kindled tonight outlast the darkness."
              </p>
            </div>
          </div>

          {/* Clean Editorial Navigation Links */}
          <nav className="flex flex-wrap items-center gap-6 sm:gap-8 text-xs uppercase tracking-[0.22em] text-[#A99BBF]">
            <button
              onClick={() => onNavigate('welcome')}
              className="hover:text-[#F3EAE2] transition-colors focus:outline-none"
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('art')}
              className="hover:text-[#F3EAE2] transition-colors focus:outline-none"
            >
              Traditions
            </button>
            <button
              onClick={() => onNavigate('across-india')}
              className="hover:text-[#F3EAE2] transition-colors focus:outline-none"
            >
              Across India
            </button>
            <button
              onClick={() => onNavigate('celebration')}
              className="hover:text-[#F3EAE2] transition-colors focus:outline-none"
            >
              Stories
            </button>
            <button
              onClick={() => onNavigate('wishes')}
              className="hover:text-[#F3EAE2] transition-colors focus:outline-none"
            >
              Wishes
            </button>
          </nav>

          {/* Discreet Back to Top Button */}
          <button
            onClick={scrollToTop}
            className="group flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-[#A99BBF]/20 hover:border-[#E98EAF]/60 text-xs uppercase tracking-wider text-[#A99BBF] hover:text-[#F3EAE2] transition-all duration-300 focus:outline-none"
            aria-label="Scroll back to top"
          >
            <span>Top</span>
            <ArrowUp className="w-3.5 h-3.5 text-[#E98EAF] group-hover:-translate-y-0.5 transition-transform duration-300" />
          </button>
        </div>

        {/* Bottom Metadata & Cultural Dedication */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-[#A99BBF]/60 gap-3 font-light">
          <p>
            Crafted with reverence for Indian heritage, art & light.
          </p>
          <div className="flex items-center space-x-2 font-serif text-sm text-[#FFE29A]/80 italic">
            <span>शुभ दीपावली · Deepavali</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
