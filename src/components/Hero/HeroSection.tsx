import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DiyaLogo } from '../UI/DiyaLogo';
import { FloatingPetals } from './FloatingPetals';
import { DiyaFlame } from '../UI/DiyaFlame';
import { soundscape } from '../../utils/sound';
import { fireworks } from '../../fireworks';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  onBeginJourney: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onBeginJourney }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const bgImageRef = useRef<HTMLImageElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const diyaWrapperRef = useRef<HTMLDivElement | null>(null);

  const [diyaLit, setDiyaLit] = useState(true);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      // 1. Initial entrance animation on page load
      const entranceTl = gsap.timeline({ delay: 0.2 });

      if (bgImageRef.current) {
        entranceTl.fromTo(
          bgImageRef.current,
          { scale: 1.06, filter: 'brightness(0.8)' },
          { scale: 1, filter: 'brightness(1)', duration: 2.2, ease: 'power2.out' }
        );
      }

      entranceTl.fromTo(
        '.hero-eyebrow',
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out' },
        '-=1.8'
      )
      .fromTo(
        '.hero-lotus',
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: 'power3.out' },
        '-=0.7'
      )
      .fromTo(
        '.hero-title',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.3, ease: 'power3.out' },
        '-=0.8'
      )
      .fromTo(
        '.hero-subtitle',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
        '-=0.8'
      )
      .fromTo(
        '.hero-description',
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
        '-=0.7'
      )
      .fromTo(
        '.hero-cta',
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' },
        '-=0.6'
      )
      .fromTo(
        '.hero-diya-callout',
        { opacity: 0 },
        { opacity: 1, duration: 1.2, ease: 'power2.out' },
        '-=0.5'
      );

      // 2. Exact Pinned Hero Scroll Reveal Interaction:
      // The homepage hero stays pinned and 100% stationary in its screen position.
      // All hero text (JYOTI heading, subtitle, description, CTA button) and background remain stationary (no movement or animation during scroll).
      // The incoming section (#celebration) slides upward from below and progressively covers the pinned hero.
      // Once the next section completely covers the hero, the pin releases and normal scrolling continues.
      if (!prefersReducedMotion && containerRef.current) {
        const heroEl = containerRef.current;
        const getHeroHeight = () => heroEl.offsetHeight || window.innerHeight;

        ScrollTrigger.create({
          id: 'hero-pinned-reveal',
          trigger: heroEl,
          start: 'top top',
          end: () => `+=${getHeroHeight()}`,
          pin: true,
          pinSpacing: false, // Allows subsequent section to slide upward and overlap the pinned hero
          scrub: 1, // Smooth synchronization with Lenis scrolling
          anticipatePin: 1,
          invalidateOnRefresh: true,
        });

        // Ensure ScrollTrigger refreshes when hero background image finishes loading
        if (bgImageRef.current) {
          if (bgImageRef.current.complete) {
            ScrollTrigger.refresh();
          } else {
            bgImageRef.current.addEventListener(
              'load',
              () => {
                ScrollTrigger.refresh();
              },
              { once: true }
            );
          }
        }
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleDiyaClick = () => {
    const nextState = !diyaLit;
    setDiyaLit(nextState);

    if (nextState) {
      soundscape.playDiyaChime();
      const diyaX = typeof window !== 'undefined' ? (window.innerWidth < 640 ? window.innerWidth * 0.5 : window.innerWidth * 0.18) : 200;
      const diyaY = typeof window !== 'undefined' ? window.innerHeight * 0.88 : 600;
      fireworks.sparkler(diyaX, diyaY, { durationMs: 2400 });
    }
  };

  return (
    <section
      id="welcome"
      ref={containerRef}
      className="relative z-10 w-full h-[100svh] min-h-[680px] overflow-hidden select-none flex items-center justify-center"
      aria-label="Diwali Welcome Hero"
    >
      {/* 1. Fullscreen Cinematic Background Edge-to-Edge */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          ref={bgImageRef}
          src="/assets/hero-diwali-reference.jpg"
          alt="Atmospheric Diwali celebration by riverside palace ghats under twilight"
          className="w-full h-full object-cover object-center pointer-events-none"
        />

        {/* Atmospheric contrast overlays to guarantee high editorial readability */}
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#061116]/80 via-[#061116]/30 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#061116]/30 to-[#061116]/75 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#061116]/85 via-[#061116]/35 to-transparent pointer-events-none" />
      </div>

      {/* 2. Floating Bougainvillea Petals Wind Simulation */}
      <FloatingPetals />

      {/* 3. Center Storytelling Hero Content (Completely stationary during scroll) */}
      <div
        ref={contentRef}
        className="relative z-30 max-w-3xl mx-auto px-6 sm:px-10 text-center flex flex-col items-center justify-center pt-8 pb-12"
      >
        {/* Eyebrow: A FESTIVAL OF LIGHTS */}
        <div className="hero-eyebrow flex items-center justify-center space-x-3 mb-5">
          <span className="w-8 sm:w-12 h-[1px] bg-[#E98EAF]/50" />
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.38em] text-[#F4C4D2] font-medium">
            A Festival of Lights
          </span>
          <span className="w-8 sm:w-12 h-[1px] bg-[#E98EAF]/50" />
        </div>

        {/* Sacred Diya Emblem (Logo & Sign of JYOTI) */}
        <div className="hero-lotus mb-4 flex justify-center">
          <DiyaLogo className="w-16 sm:w-20 md:w-24 h-auto" glow />
        </div>

        {/* Main Grand Heading: JYOTI */}
        <h1 className="hero-title font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-[#F3EAE2] tracking-[0.24em] font-normal leading-none drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)] ml-3">
          JYOTI
        </h1>

        {/* Subtitle: A Spark of Diwali */}
        <h2 className="hero-subtitle font-display italic text-xl sm:text-2xl md:text-3xl text-[#FFE29A] tracking-wider mt-3 mb-5 font-light">
          A Spark of Diwali
        </h2>

        {/* Poetic Editorial Description */}
        <p className="hero-description text-sm sm:text-base md:text-lg text-[#F3EAE2]/85 font-light max-w-xl leading-relaxed mb-8 tracking-wide drop-shadow-md">
          Discover the traditions, stories, and colors of Diwali — a festival that lights up India with hope, togetherness, and new beginnings.
        </p>

        {/* Refined Luxury Editorial CTA */}
        <div className="hero-cta flex items-center justify-center">
          <button
            onClick={() => {
              if (!soundscape.getIsPlaying()) {
                soundscape.playBgm();
              }
              onBeginJourney();
            }}
            className="group relative inline-flex items-center space-x-3 px-8 py-3.5 rounded-full border border-[#E98EAF]/50 bg-[#061116]/60 backdrop-blur-sm text-[#F3EAE2] font-medium text-xs sm:text-sm uppercase tracking-[0.22em] transition-all duration-300 hover:border-[#E98EAF] hover:bg-[#E98EAF]/15 focus:outline-none"
          >
            <span>Begin the Journey</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1.5 font-light">
              →
            </span>
          </button>
        </div>
      </div>

      {/* 4. Terrace Diya anchored to courtyard foreground */}
      <div
        ref={diyaWrapperRef}
        className="hero-diya-callout absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-14 lg:left-20 z-30 flex flex-col items-center"
      >
        <DiyaFlame
          isLit={diyaLit}
          size="lg"
          onClick={handleDiyaClick}
          className="transition-transform duration-300 hover:scale-105"
        />
        <p className="text-[9px] tracking-[0.22em] uppercase text-[#A99BBF] mt-1 select-none font-light">
          {diyaLit ? "Touch to quiet flame" : "Touch to kindle light"}
        </p>
      </div>

      {/* 5. Minimalist Editorial Scroll Cue */}
      <button
        onClick={onBeginJourney}
        className="absolute bottom-6 right-8 sm:right-12 z-30 hidden md:flex items-center space-x-2 text-[10px] tracking-[0.28em] uppercase text-[#A99BBF]/70 hover:text-[#F3EAE2] transition-colors focus:outline-none font-light"
      >
        <span>Scroll to Explore</span>
        <span>↓</span>
      </button>
    </section>
  );
};
