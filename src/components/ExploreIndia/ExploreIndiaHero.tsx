import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { LotusIcon } from '../UI/LotusIcon';
import { ArrowDown, Compass } from 'lucide-react';

interface ExploreIndiaHeroProps {
  onScrollToAtlas: () => void;
}

export const ExploreIndiaHero: React.FC<ExploreIndiaHeroProps> = ({ onScrollToAtlas }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const leftColRef = useRef<HTMLDivElement | null>(null);
  const rightColRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      tl.fromTo(
        '.atlas-eyebrow',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
      )
      .fromTo(
        '.atlas-heading',
        { y: 35, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' },
        '-=0.7'
      )
      .fromTo(
        '.atlas-subheading',
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out' },
        '-=0.7'
      )
      .fromTo(
        '.atlas-desc',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
        '-=0.7'
      )
      .fromTo(
        '.atlas-artwork',
        { scale: 1.08, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.6, ease: 'power2.out' },
        '-=1.2'
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[90vh] lg:min-h-screen pt-32 pb-20 px-6 sm:px-12 lg:px-20 bg-[#101C2B] overflow-hidden select-none flex items-center"
      aria-label="Explore India Editorial Hero"
    >
      {/* Background Architectural Watermarks */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#142336]/60 via-[#101C2B]/80 to-[#101C2B] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
        {/* Left Column: Editorial Storytelling Typography (7 cols) */}
        <div ref={leftColRef} className="lg:col-span-7 space-y-6">
          <div className="atlas-eyebrow flex items-center space-x-3">
            <Compass className="w-4 h-4 text-[#B8DAD3]" />
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#E8A1BC] font-medium">
              Cultural Atlas of India · Diwali Edition
            </span>
          </div>

          <h1 className="atlas-heading font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#F2EAE5] font-normal leading-none tracking-tight">
            One Land. <br />
            <span className="italic text-[#E8A1BC]">Many Lights.</span>
          </h1>

          <p className="atlas-subheading font-display italic text-lg sm:text-xl md:text-2xl text-[#B8DAD3] font-light max-w-xl">
            Discover the beautiful diversity of India’s Diwali traditions, where every region celebrates light in its own way.
          </p>

          <p className="atlas-desc text-xs sm:text-base text-[#F2EAE5]/75 leading-relaxed font-light max-w-lg">
            Diwali is not a single uniform ritual, but a magnificent constellation of regional stories, pre-dawn sacred baths, midnight Shakti devotions, and threshold sacred geometries woven across thousands of miles.
          </p>

          <div className="pt-4 flex items-center space-x-4">
            <button
              onClick={onScrollToAtlas}
              className="py-3 px-8 rounded-full border border-[#E8A1BC] bg-[#E8A1BC]/15 hover:bg-[#E8A1BC]/25 text-[#F2EAE5] text-xs uppercase tracking-[0.22em] transition-all flex items-center space-x-2 focus:outline-none"
            >
              <span>Explore Interactive Atlas</span>
              <ArrowDown className="w-3.5 h-3.5 text-[#E8A1BC]" />
            </button>
          </div>
        </div>

        {/* Right Column: Layered Architectural Visual (5 cols) */}
        <div ref={rightColRef} className="lg:col-span-5 relative">
          <div className="atlas-artwork relative rounded-3xl overflow-hidden border border-[#343E50]/70 shadow-2xl bg-[#0A131E] group aspect-[4/5] max-w-md mx-auto">
            {/* Main Architectural Visual */}
            <img
              src="/assets/varanasi-ghats.jpg"
              alt="Traditional Indian riverfront palace ghats illuminated by lamps"
              className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A131E] via-[#0A131E]/30 to-transparent" />

            {/* Bottom Caption Card */}
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#101C2B]/90 backdrop-blur-md border border-[#343E50]/60 space-y-1">
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#E8A1BC] font-medium block">
                Heritage Perspective
              </span>
              <p className="font-serif text-base text-[#F2EAE5]">
                Six Curated Regional Journeys
              </p>
              <p className="text-xs text-[#B8DAD3]/80 font-light">
                Ayodhya · Bengal · Varanasi · Goa · Gujarat · Tamil Nadu
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

