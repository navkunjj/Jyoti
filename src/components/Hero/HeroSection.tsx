import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { LotusIcon } from '../UI/LotusIcon';
import { FloatingPetals } from './FloatingPetals';
import { DiyaFlame } from '../UI/DiyaFlame';
import { soundscape } from '../../utils/sound';
import { ArrowDown, Sparkles, Moon } from 'lucide-react';
import confetti from 'canvas-confetti';

interface HeroSectionProps {
  onBeginJourney: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onBeginJourney }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const bgImageRef = useRef<HTMLImageElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const diyaWrapperRef = useRef<HTMLDivElement | null>(null);
  const lanternRef = useRef<HTMLDivElement | null>(null);

  const [diyaLit, setDiyaLit] = useState(true);
  const [diyaInteractions, setDiyaInteractions] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Subtle cinematic scale entrance for background image
      if (bgImageRef.current) {
        gsap.fromTo(
          bgImageRef.current,
          { scale: 1.08, filter: 'brightness(0.65)' },
          { scale: 1, filter: 'brightness(1)', duration: 2.4, ease: 'power2.out' }
        );
      }

      // 2. Hanging Lantern gentle pendulum sway
      if (lanternRef.current) {
        gsap.to(lanternRef.current, {
          rotation: 3,
          duration: 3.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          transformOrigin: 'top center',
        });
      }

      // 3. Staggered reveal of hero content
      const tl = gsap.timeline({ delay: 0.3 });

      tl.fromTo(
        '.hero-eyebrow',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }
      )
      .fromTo(
        '.hero-lotus',
        { scale: 0.6, opacity: 0, rotation: -15 },
        { scale: 1, opacity: 1, rotation: 0, duration: 1.2, ease: 'back.out(1.7)' },
        '-=0.8'
      )
      .fromTo(
        '.hero-title',
        { y: 40, opacity: 0, letterSpacing: '0.1em' },
        { y: 0, opacity: 1, letterSpacing: '0.22em', duration: 1.4, ease: 'power3.out' },
        '-=0.9'
      )
      .fromTo(
        '.hero-subtitle',
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
        '-=0.9'
      )
      .fromTo(
        '.hero-description',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
        '-=0.7'
      )
      .fromTo(
        '.hero-cta',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' },
        '-=0.6'
      )
      .fromTo(
        '.hero-diya-callout',
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: 'back.out(1.4)' },
        '-=0.5'
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleDiyaClick = () => {
    const nextState = !diyaLit;
    setDiyaLit(nextState);
    setDiyaInteractions((prev) => prev + 1);

    if (nextState) {
      soundscape.playDiyaChime();
      // Throw festive spark embers
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.85, x: 0.28 },
        colors: ['#FFE29A', '#FDB863', '#E98EAF', '#F4C4D2'],
        disableForReducedMotion: true,
      });
    }
  };

  return (
    <section
      id="welcome"
      ref={containerRef}
      className="relative w-full h-[100svh] min-h-[680px] overflow-hidden select-none flex items-center justify-center"
      aria-label="Diwali Welcome Hero"
    >
      {/* 1. Fullscreen Cinematic Background Edge-to-Edge */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          ref={bgImageRef}
          src="/assets/hero-diwali-reference.jpg"
          alt="Atmospheric Diwali celebration by the riverside palace ghats under twilight"
          className="w-full h-full object-cover object-center pointer-events-none will-change-transform"
        />

        {/* Ambient atmospheric contrast overlays to ensure high readability */}
        {/* Top subtle vignette for navbar */}
        <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#061116]/85 via-[#061116]/40 to-transparent pointer-events-none" />

        {/* Center radial vignette for high text legibility without flattening the artwork */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#061116]/35 to-[#061116]/75 pointer-events-none" />

        {/* Bottom subtle gradient for courtyard grounding */}
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#061116]/85 via-[#061116]/30 to-transparent pointer-events-none" />
      </div>

      {/* 2. Floating Bougainvillea Petals Wind Simulation */}
      <FloatingPetals />

      {/* 3. Left Side: Hanging Brass Lantern Decoration */}
      <div
        ref={lanternRef}
        className="absolute top-0 left-6 sm:left-12 lg:left-24 z-20 pointer-events-none hidden sm:block origin-top"
      >
        <svg
          width="70"
          height="190"
          viewBox="0 0 70 190"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Hanging Chain */}
          <line x1="35" y1="0" x2="35" y2="70" stroke="#FFE29A" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
          {/* Lantern Dome Cap */}
          <path d="M20 70 Q35 55 50 70 Z" fill="#FDB863" />
          <circle cx="35" cy="55" r="3" fill="#FFE29A" />
          {/* Lantern Glass Body */}
          <path
            d="M20 70 L15 115 L35 135 L55 115 L50 70 Z"
            fill="rgba(16, 44, 56, 0.65)"
            stroke="#FFE29A"
            strokeWidth="1.5"
          />
          {/* Inner Glowing Candle */}
          <circle cx="35" cy="100" r="14" fill="url(#lanternGlowHero)" />
          <path d="M35 92 Q37 97 35 102 Q33 97 35 92 Z" fill="#FFF" className="animate-flame" />
          {/* Bottom tassel */}
          <line x1="35" y1="135" x2="35" y2="165" stroke="#E98EAF" strokeWidth="1.5" />
          <circle cx="35" cy="168" r="4" fill="#D16D91" />

          <defs>
            <radialGradient id="lanternGlowHero" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFF2B2" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#FDB863" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#E98EAF" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* 4. Center Storytelling Hero Content */}
      <div
        ref={contentRef}
        className="relative z-20 max-w-4xl mx-auto px-6 sm:px-10 text-center flex flex-col items-center justify-center pt-12 pb-16"
      >
        {/* Eyebrow: A FESTIVAL OF LIGHTS */}
        <div className="hero-eyebrow flex items-center justify-center space-x-3 mb-4">
          <span className="w-8 sm:w-14 h-[1px] bg-gradient-to-r from-transparent to-[#E98EAF]" />
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.38em] text-[#F4C4D2] font-medium">
            A Festival of Lights
          </span>
          <span className="w-8 sm:w-14 h-[1px] bg-gradient-to-l from-transparent to-[#E98EAF]" />
        </div>

        {/* Elegant Lotus Symbol */}
        <div className="hero-lotus mb-4 sm:mb-5">
          <LotusIcon size={52} glow />
        </div>

        {/* Main Grand Heading: JYOTI */}
        <h1 className="hero-title font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-gradient-lotus tracking-[0.22em] font-normal leading-none drop-shadow-[0_4px_25px_rgba(0,0,0,0.7)] ml-3">
          JYOTI
        </h1>

        {/* Subtitle: A Spark of Diwali */}
        <h2 className="hero-subtitle font-display italic text-xl sm:text-2xl md:text-3xl text-[#FFE29A] tracking-wider mt-3 mb-5 font-light">
          A Spark of Diwali
        </h2>

        {/* Poetic Description */}
        <p className="hero-description text-sm sm:text-base md:text-lg text-[#F3EAE2]/85 font-light max-w-2xl leading-relaxed mb-8 tracking-wide drop-shadow-md">
          Discover the traditions, stories, and colors of Diwali — a festival that lights up India with hope, togetherness, and new beginnings.
        </p>

        {/* Primary Action Button */}
        <div className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onBeginJourney}
            className="group relative inline-flex items-center space-x-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#E98EAF] via-[#F4C4D2] to-[#FFE29A] text-[#061116] font-medium text-xs sm:text-sm uppercase tracking-[0.22em] shadow-[0_0_25px_rgba(233,142,175,0.4)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(253,184,99,0.7)] hover:scale-105 focus:outline-none"
          >
            <span>Begin the Journey</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1.5 font-bold">
              →
            </span>
          </button>

          {/* Diya status indicator */}
          <button
            onClick={handleDiyaClick}
            className="px-5 py-3 rounded-full border border-[#A99BBF]/40 hover:border-[#E98EAF] bg-[#061116]/60 backdrop-blur-sm text-[#F3EAE2] text-xs uppercase tracking-[0.18em] transition-all flex items-center space-x-2 focus:outline-none"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FDB863]" />
            <span>{diyaLit ? "Sacred Diya is Glowing" : "Light Sacred Diya"}</span>
          </button>
        </div>
      </div>

      {/* 5. Bottom Interactive Diya on the Rangoli Courtyard (matching reference image) */}
      <div
        ref={diyaWrapperRef}
        className="hero-diya-callout absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-16 lg:left-24 z-20 flex flex-col items-center"
      >
        <DiyaFlame
          isLit={diyaLit}
          size="lg"
          onClick={handleDiyaClick}
          className="transition-transform duration-300 hover:scale-110"
        />
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#F4C4D2]/80 mt-1 select-none font-light">
          {diyaLit ? "Touch Diya to kindle wish" : "Touch to rekindle light"}
        </p>
      </div>

      {/* 6. Subtle Scroll Prompt at bottom center */}
      <button
        onClick={onBeginJourney}
        className="absolute bottom-4 right-6 sm:right-12 z-20 hidden md:flex items-center space-x-2 text-[11px] tracking-[0.25em] uppercase text-[#A99BBF]/80 hover:text-[#F3EAE2] transition-colors focus:outline-none"
      >
        <span>Scroll to Explore</span>
        <ArrowDown className="w-3.5 h-3.5 text-[#E98EAF] animate-bounce" />
      </button>
    </section>
  );
};

