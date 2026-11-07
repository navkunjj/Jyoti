import React from 'react';
import { REGIONS_DATA } from '../../data/regionsData';
import { LotusIcon } from '../UI/LotusIcon';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

interface CulturalFinaleProps {
  onBackToHome: () => void;
  onExploreRegion: (slug: string) => void;
}

export const CulturalFinale: React.FC<CulturalFinaleProps> = ({
  onBackToHome,
  onExploreRegion,
}) => {
  return (
    <section className="relative w-full py-28 sm:py-36 px-6 sm:px-12 lg:px-20 bg-gradient-to-b from-[#0A131E] via-[#060D14] to-[#101C2B] overflow-hidden select-none border-t border-[#343E50]/40">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-[#B8DAD3]/10 via-[#E8A1BC]/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 text-center space-y-12">
        {/* Lotus Emblem */}
        <div className="flex justify-center">
          <LotusIcon size={44} glow />
        </div>

        {/* Editorial Grand Header */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#E8A1BC] font-medium block">
            The Subcontinental Tapestry
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#F2EAE5] font-normal leading-tight">
            Different traditions. <br />
            <span className="text-gradient-lotus italic">One beautiful celebration.</span>
          </h2>
          <p className="text-xs sm:text-base text-[#F2EAE5]/75 leading-relaxed font-light max-w-2xl mx-auto">
            From the midnight Shakta devotion of Bengal to the pre-dawn Brahma Muhurta Ganga Snanam in Tamil Nadu, from the colossal effigy bonfires of Goa to the endless clay flames along the Sarayu and Ganga — India’s festival of light is united in its eternal affirmation that darkness shall never triumph.
          </p>
        </div>

        {/* Six Regions Panoramic Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 pt-6">
          {REGIONS_DATA.map((r) => (
            <button
              key={r.slug}
              onClick={() => onExploreRegion(r.slug)}
              className="p-4 rounded-2xl bg-[#101C2B]/80 border border-[#343E50]/60 hover:border-[#E8A1BC] transition-all group flex flex-col items-center justify-between text-center space-y-2 focus:outline-none"
            >
              <span className="font-mono text-[10px] text-[#B8DAD3] tracking-widest">
                {r.number}
              </span>
              <span className="font-serif text-base text-[#F2EAE5] group-hover:text-[#E8A1BC] transition-colors">
                {r.name}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-[#B8DAD3]/60 font-light">
                {r.state}
              </span>
              <ArrowUpRight className="w-3 h-3 text-[#E8A1BC] opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>

        {/* Bottom Actions: Return to Main Journey */}
        <div className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onBackToHome}
            className="py-3 px-8 rounded-full border border-[#B8DAD3]/40 hover:border-[#E8A1BC] bg-[#101C2B]/70 text-[#F2EAE5] text-xs uppercase tracking-[0.2em] transition-all flex items-center space-x-2.5 focus:outline-none"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#B8DAD3]" />
            <span>Return to JYOTI Home</span>
          </button>
        </div>
      </div>
    </section>
  );
};

