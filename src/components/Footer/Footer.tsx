import React, { useRef, useEffect } from 'react';
import { ArrowUp, Mail } from 'lucide-react';
import { DiyaLogo } from '../UI/DiyaLogo';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onHeightChange?: (height: number) => void;
  isFixed?: boolean;
  onScrollToTop?: () => void;
}

// Clean Lucide-compatible SVG icons for brand socials
const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onHeightChange,
  isFixed = false,
  onScrollToTop,
}) => {
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
    if (onScrollToTop) {
      onScrollToTop();
      return;
    }

    // If on a different page (non-homepage, e.g. /light-the-world or isFixed is false), scroll to the top of this page
    if (!isFixed || (typeof window !== 'undefined' && window.location.pathname !== '/')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // On the homepage, navigate to the welcome section (start of the app)
    onNavigate('welcome');
  };

  return (
    <footer
      id="site-footer"
      ref={footerRef}
      className={`${
        isFixed
          ? 'fixed bottom-0 left-0 right-0 z-[5]'
          : 'relative z-20 border-t border-white/10'
      } w-full bg-[#040C10] text-white py-10 sm:py-12 px-6 sm:px-12 lg:px-20 select-none overflow-hidden font-sans not-italic`}
    >
      <div className="max-w-7xl mx-auto w-full relative z-30 space-y-6">
        {/* Main Row: Brand, Navigation & Back to Top */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          {/* Brand & Tagline with Diya Logo */}
          <div>
            <div className="flex items-center space-x-3">
              <DiyaLogo className="w-8 h-auto" glow />
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
            <button
              onClick={() => onNavigate('light-the-world')}
              className="hover:text-[#FFE29A] transition-colors focus:outline-none"
            >
              Light the World
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

        {/* Bottom Row: Creator Attribution, Social Contacts & Greeting */}
        <div className="flex flex-col md:flex-row items-center justify-between text-xs text-white/60 gap-4 font-sans font-normal pt-1">
          {/* Creator Attribution */}
          <div className="flex items-center space-x-2">
            <span>© {new Date().getFullYear()} JYOTI</span>
            <span className="text-white/30">•</span>
            <span>Made by NAV</span>
          </div>

          {/* Contacts / Socials (GitHub, LinkedIn, Email) */}
          <div className="flex items-center space-x-4 sm:space-x-5 text-white/70">
            <a
              href="https://github.com/navkunjj"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 hover:text-white transition-colors"
              aria-label="GitHub Profile"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span className="text-[11px] tracking-wider uppercase">GitHub</span>
            </a>
            <span className="text-white/20">/</span>
            <a
              href="https://www.linkedin.com/in/navkunj-utpal/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 hover:text-white transition-colors"
              aria-label="LinkedIn Profile"
            >
              <LinkedinIcon className="w-3.5 h-3.5" />
              <span className="text-[11px] tracking-wider uppercase">LinkedIn</span>
            </a>
            <span className="text-white/20">/</span>
            <a
              href="mailto:nitishkumar19022007@gmail.com"
              className="flex items-center space-x-1.5 hover:text-white transition-colors"
              aria-label="Email Contact"
            >
              <Mail className="w-3.5 h-3.5" />
              <span className="text-[11px] tracking-wider uppercase">Contact</span>
            </a>
          </div>

          {/* Cultural Greeting */}
          <div className="text-xs text-white/70 font-sans font-normal tracking-wide">
            शुभ दीपावली · Deepavali
          </div>
        </div>
      </div>
    </footer>
  );
};
