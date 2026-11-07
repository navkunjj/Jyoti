import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { WorldMap } from './WorldMap';
import { GlobalGoalCard } from './GlobalGoalCard';
import { StatisticsSection } from './StatisticsSection';
import { TopCountriesLeaderboard } from './TopCountriesLeaderboard';
import { CountryStats, diyaService } from '../../services/diyaService';

interface LightTheWorldPageProps {
  onNavigateHome: () => void;
}

export const LightTheWorldPage: React.FC<LightTheWorldPageProps> = ({ onNavigateHome }) => {
  const pageRef = useRef<HTMLDivElement | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<CountryStats | null>(null);

  useEffect(() => {
    // Immediate scroll to top
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        '.ltw-label',
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.1 }
      )
      .fromTo(
        '.ltw-title',
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1 },
        '-=0.6'
      )
      .fromTo(
        '.ltw-lead',
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.0 },
        '-=0.7'
      )
      .fromTo(
        '.ltw-stats',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.0 },
        '-=0.6'
      )
      .fromTo(
        '.ltw-map',
        { opacity: 0 },
        { opacity: 1, duration: 1.2 },
        '-=0.6'
      )
      .fromTo(
        '.ltw-split',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.0 },
        '-=0.6'
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={pageRef}
      className="relative min-h-screen bg-transparent text-[#F5ECE3] overflow-x-hidden pt-28 sm:pt-36 pb-16 sm:pb-24 px-6 sm:px-12 lg:px-20 selection:bg-[#8C3A4D]/40 selection:text-[#F5ECE3]"
    >
      <div className="max-w-7xl mx-auto relative z-10 space-y-16 sm:space-y-24">
        {/* Left-Aligned Editorial Header */}
        <header className="space-y-8 max-w-5xl">
          <div className="ltw-label flex items-center space-x-3 text-xs uppercase tracking-widest text-[#9E8D9F] font-sans">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FDB863]" />
            <span>Universal Communion</span>
            <span className="text-white/20">/</span>
            <span>Diwali 2026</span>
          </div>

          <h1 className="ltw-title font-serif text-5xl sm:text-7xl lg:text-8xl font-light text-[#F5ECE3] tracking-tight leading-[0.96]">
            Light the <span className="font-serif italic font-normal text-[#E8DDD3]">World</span>
          </h1>

          <div className="ltw-lead grid grid-cols-1 md:grid-cols-12 gap-8 pt-2">
            <div className="md:col-span-8">
              <p className="font-serif text-lg sm:text-xl lg:text-2xl text-[#E8DDD3]/90 font-light leading-relaxed">
                On the darkest night of the autumn sky, a single flame alters the horizon. When kindled across every land and diaspora, our solitary prayers assemble into one continuous circle of human radiance.
              </p>
            </div>
            <div className="md:col-span-4 md:border-l md:border-white/10 md:pl-8 flex flex-col justify-end">
              <div className="font-serif italic text-sm text-[#9E8D9F] leading-relaxed">
                "दीपो हरति पापानि दीपो दैन्यं विनाशयेत् ।"
              </div>
              <div className="text-[11px] text-[#9E8D9F]/70 font-sans mt-1 uppercase tracking-wider">
                Brihadaranyaka Upanishad
              </div>
            </div>
          </div>
        </header>

        {/* Clean Typographic Metrics */}
        <section className="ltw-stats">
          <StatisticsSection />
        </section>

        {/* Uncaged World Map as Centerpiece */}
        <section className="ltw-map space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 px-1">
            <h2 className="font-serif text-2xl sm:text-3xl text-[#F5ECE3] font-light">
              The Living Map
            </h2>
            <div className="text-xs text-[#9E8D9F] font-sans">
              Interact to explore national offerings or select a country to dedicate flame
            </div>
          </div>

          <WorldMap
            onSelectCountry={(country) => setSelectedCountry(country)}
            selectedCountryId={selectedCountry?.id}
          />

          {/* Understated Country Detail Callout (when a country is selected) */}
          {selectedCountry && (
            <div className="py-4 px-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#140716]/60 animate-in fade-in duration-200">
              <div className="flex items-baseline space-x-3">
                <span className="font-serif text-xl text-[#F5ECE3]">
                  {selectedCountry.name}
                </span>
                <span className="font-mono text-xs text-[#9E8D9F] uppercase tracking-widest">
                  {selectedCountry.code}
                </span>
                <span className="text-white/20">·</span>
                <span className="text-sm font-sans text-[#E6DACF]">
                  <strong className="font-serif font-normal text-[#FDB863] mr-1">
                    {selectedCountry.diyas.toLocaleString()}
                  </strong>
                  flames burning
                </span>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => diyaService.lightDiya(selectedCountry.id)}
                  className="text-xs tracking-wider uppercase text-[#F5ECE3] hover:text-[#FFE29A] transition-colors focus:outline-none flex items-center space-x-1.5"
                >
                  <span>Kindle flame for {selectedCountry.name}</span>
                  <span>→</span>
                </button>
                <button
                  onClick={() => setSelectedCountry(null)}
                  className="text-xs text-[#9E8D9F] hover:text-[#F5ECE3] transition-colors focus:outline-none"
                  aria-label="Dismiss selection"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Asymmetric Open Split: The Journey & Roll of Nations */}
        <section className="ltw-split grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start pt-6">
          {/* Left Column: Toward One Million Lamps & Kindling (7 columns) */}
          <div className="lg:col-span-7">
            <GlobalGoalCard selectedCountry={selectedCountry} />
          </div>

          {/* Right Column: Roll of Nations (5 columns) */}
          <div className="lg:col-span-5 lg:border-l lg:border-white/10 lg:pl-12">
            <TopCountriesLeaderboard
              onSelectCountry={(country) => setSelectedCountry(country)}
              selectedCountryId={selectedCountry?.id}
            />
          </div>
        </section>

        {/* Return to Heritage Link */}
        <div className="pt-12 pb-4 border-t border-white/10 flex items-center justify-between text-xs text-[#9E8D9F] font-sans">
          <span className="hidden sm:inline">
            Universal Communion · Kartika Amavasya
          </span>
          <button
            onClick={onNavigateHome}
            className="hover:text-[#F5ECE3] transition-colors focus:outline-none tracking-wider uppercase text-[11px]"
          >
            ← Return to Heritage Stories
          </button>
        </div>
      </div>
    </div>
  );
};
