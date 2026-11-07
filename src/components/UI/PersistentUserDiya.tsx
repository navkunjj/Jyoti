import React, { useState, useEffect } from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { diyaService } from '../../services/diyaService';
import { soundscape } from '../../utils/sound';
import confetti from 'canvas-confetti';

export const PersistentUserDiya: React.FC = () => {
  const [isLit, setIsLit] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);

  useEffect(() => {
    const checkState = () => {
      const state = diyaService.getUserDiyaState();
      setIsLit(state.isLit);
    };

    checkState();
    const unsubscribe = diyaService.subscribe(checkState);

    const handleCustomEvent = () => checkState();
    window.addEventListener('jyoti:diya-updated', handleCustomEvent);

    return () => {
      unsubscribe();
      window.removeEventListener('jyoti:diya-updated', handleCustomEvent);
    };
  }, []);

  if (!isLit) return null;

  const handleDiyaClick = () => {
    soundscape.playDiyaChime();
    setExpanded(!expanded);

    // Subtle celebratory sparkle burst around the bottom-right corner
    if (typeof window !== 'undefined') {
      confetti({
        particleCount: 22,
        spread: 45,
        origin: { x: 0.94, y: 0.92 },
        colors: ['#FFD182', '#FDB863', '#E98EAF', '#FFE29A'],
        ticks: 120,
        gravity: 0.8,
        scalar: 0.7,
      });
    }
  };

  return (
    <div
      className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-50 flex flex-col items-end select-none pointer-events-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Your Lit Diya"
    >
      {/* Refined Editorial Tooltip */}
      {(isHovered || expanded) && (
        <div className="mb-3 p-4 bg-[#140716]/95 backdrop-blur-md border border-white/15 shadow-2xl max-w-xs text-left animate-in fade-in duration-200">
          <div className="flex items-center space-x-2 text-xs font-serif text-[#F5ECE3] mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FDB863]" />
            <span>Living Flame · Diwali 2026</span>
          </div>
          <p className="text-xs text-[#9E8D9F] leading-relaxed font-sans">
            Your diya burns alongside thousands worldwide, united in the collective circle of light.
          </p>
        </div>
      )}

      {/* Main Interactive Floating Diya Button */}
      <button
        onClick={handleDiyaClick}
        className="group relative flex items-center justify-center p-3 rounded-full bg-[#18081a]/95 backdrop-blur-md border border-white/15 hover:border-[#FDB863]/60 shadow-xl transition-all duration-300 focus:outline-none"
        title="Your Lit Diya"
      >
        {/* Radiating Warm Glow Ring */}
        <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#FF8833]/30 via-[#FDB863]/40 to-[#FFE29A]/30 blur-md animate-pulse opacity-75 group-hover:opacity-100 transition-opacity" />

        {/* Diya SVG Icon & Realistic Radiant Flame */}
        <div className="relative w-10 h-10 flex items-center justify-center">
          {/* Flame Halo */}
          <div className="absolute top-1 w-6 h-6 rounded-full bg-[#FF8833]/50 blur-[5px] animate-ping opacity-60" />
          <div className="absolute top-1.5 w-4 h-5 rounded-full bg-[#FFE29A]/80 blur-[2px] animate-pulse" />

          {/* Diya Base and Wick SVG */}
          <svg
            viewBox="0 0 36 36"
            className="w-8 h-8 text-[#D4AF37] drop-shadow-[0_2px_8px_rgba(253,184,99,0.8)]"
            fill="none"
          >
            {/* Terracotta/Brass Base */}
            <path
              d="M4 21C4 26 10 30 18 30C26 30 32 26 32 21C32 19 28 19 18 19C8 19 4 19 4 21Z"
              fill="url(#diyaBaseGrad)"
              stroke="#E5C378"
              strokeWidth="1.2"
            />
            {/* Diya Rim Highlight */}
            <ellipse
              cx="18"
              cy="20.5"
              rx="13"
              ry="3"
              fill="#522718"
              stroke="#FDB863"
              strokeWidth="0.8"
            />
            {/* Oil Pool */}
            <ellipse cx="18" cy="20.5" rx="10" ry="2" fill="#D97706" opacity="0.8" />
            {/* Wick */}
            <path d="M18 20L18 15" stroke="#451A03" strokeWidth="1.5" strokeLinecap="round" />
            {/* Burning Flame */}
            <path
              d="M18 6C18 6 14 11 14 14.5C14 16.7 15.8 18.5 18 18.5C20.2 18.5 22 16.7 22 14.5C22 11 18 6 18 6Z"
              fill="url(#diyaFlameGrad)"
              className="animate-pulse"
            />
            {/* Inner White Flame Core */}
            <path
              d="M18 10C18 10 16 13 16 15C16 16.1 16.9 17 18 17C19.1 17 20 16.1 20 15C20 13 18 10 18 10Z"
              fill="#FFFFFF"
              opacity="0.9"
            />

            <defs>
              <linearGradient id="diyaBaseGrad" x1="4" y1="19" x2="32" y2="30" gradientUnits="userSpaceOnUse">
                <stop stopColor="#8A381A" />
                <stop offset="0.5" stopColor="#B45309" />
                <stop offset="1" stopColor="#69240F" />
              </linearGradient>
              <linearGradient id="diyaFlameGrad" x1="18" y1="6" x2="18" y2="18.5" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFE29A" />
                <stop offset="0.4" stopColor="#FDB863" />
                <stop offset="1" stopColor="#EA580C" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Tiny subtle status beacon */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFB84D] opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FDB863] border border-[#1b0a1a]" />
        </span>
      </button>
    </div>
  );
};

