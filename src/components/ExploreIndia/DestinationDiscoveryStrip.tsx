import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { REGIONS_DATA, RegionData } from '../../data/regionsData';
import { ArrowRight, MapPin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface DestinationDiscoveryStripProps {
  onSelectRegion: (slug: string) => void;
}

export const DestinationDiscoveryStrip: React.FC<DestinationDiscoveryStripProps> = ({
  onSelectRegion,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;
    if (!isDesktop || !containerRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      if (!track) return;

      const getScrollDistance = () => track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: () => -getScrollDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1.1,
          start: 'top top',
          end: () => `+=${getScrollDistance()}`,
          invalidateOnRefresh: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#0A131E] overflow-hidden select-none py-16 md:py-0 border-t border-[#343E50]/40"
      aria-label="Destination Discovery Strip"
    >
      {/* Intro Header */}
      <div className="pt-20 pb-10 px-6 sm:px-12 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between border-b border-[#343E50]/40">
        <div>
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#E8A1BC] font-medium block mb-2">
            The Regional Odyssey
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#F2EAE5] font-normal">
            Destination Gallery
          </h2>
        </div>
        <p className="font-display italic text-[#B8DAD3] text-sm sm:text-base mt-3 md:mt-0 max-w-md font-light leading-relaxed">
          Six distinct chapters of light, courage, devotion, and feast across the subcontinent
        </p>
      </div>

      {/* Horizontal / Vertical Gallery Track */}
      <div
        ref={trackRef}
        className="flex flex-col md:flex-row flex-nowrap w-full md:w-max min-h-[85vh] items-center p-6 md:p-12 gap-8 md:gap-12"
      >
        {REGIONS_DATA.map((region, idx) => {
          // Asymmetrical card widths on desktop for editorial variety
          const isWide = idx % 2 === 0;

          return (
            <article
              key={region.id}
              className={`w-full ${
                isWide ? 'md:w-[72vw] lg:w-[62vw]' : 'md:w-[65vw] lg:w-[55vw]'
              } max-w-4xl h-auto md:h-[68vh] flex-shrink-0 rounded-3xl overflow-hidden border border-[#343E50]/50 bg-[#101C2B]/90 shadow-2xl relative flex flex-col lg:flex-row group transition-all duration-500 hover:border-[#E8A1BC]/50`}
            >
              {/* Left/Top: Large Full-Bleed Photograph */}
              <div className="relative w-full lg:w-1/2 h-64 sm:h-80 lg:h-full overflow-hidden">
                <img
                  src={region.heroImage}
                  alt={region.name}
                  className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#101C2B] via-transparent to-transparent pointer-events-none opacity-90" />
                <span className="absolute top-5 left-5 font-mono text-xs uppercase tracking-widest text-[#B8DAD3] bg-[#0A131E]/80 px-3 py-1 rounded-full border border-[#343E50]">
                  {region.number}
                </span>
              </div>

              {/* Right/Bottom: Story & Cultural Lore */}
              <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-[10px] uppercase tracking-[0.25em] text-[#E8A1BC] font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#B8DAD3]" />
                    <span>{region.state}</span>
                  </div>

                  <h3 className="font-serif text-3xl sm:text-4xl text-[#F2EAE5] font-normal leading-tight group-hover:text-[#E8A1BC] transition-colors">
                    {region.name}
                  </h3>
                  <h4 className="font-display italic text-base sm:text-lg text-[#B8DAD3] font-light">
                    {region.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-[#F2EAE5]/80 leading-relaxed font-light pt-2 line-clamp-4">
                    {region.theStory.narrative}
                  </p>

                  <div className="pt-3 border-t border-[#343E50]/40">
                    <span className="text-[10px] uppercase tracking-wider text-[#B8DAD3]/70 block mb-1">
                      Key Tradition
                    </span>
                    <p className="text-xs text-[#F2EAE5]/75 italic font-serif">
                      "{region.traditions[0].title}" — {region.traditions[0].timing}
                    </p>
                  </div>
                </div>

                {/* Explore Destination CTA Link */}
                <div className="pt-4 border-t border-[#343E50]/40">
                  <button
                    onClick={() => onSelectRegion(region.slug)}
                    className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.22em] text-[#E8A1BC] hover:text-[#F2EAE5] group-hover:translate-x-1.5 transition-all font-medium focus:outline-none"
                  >
                    <span>Step Into {region.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#E8A1BC]" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

