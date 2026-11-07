import React, { useState, useRef, useEffect } from 'react';
import statePathsData from '../../data/indiaStatePaths.json';
import { REGIONS_DATA, RegionData } from '../../data/regionsData';
import { ArrowRight, MapPin, Sparkles, ChevronRight } from 'lucide-react';

interface InteractiveIndiaMapProps {
  onSelectRegion: (slug: string) => void;
  activeRegionSlug?: string;
}

export const InteractiveIndiaMap: React.FC<InteractiveIndiaMapProps> = ({
  onSelectRegion,
  activeRegionSlug,
}) => {
  const [selectedSlug, setSelectedSlug] = useState<string>(activeRegionSlug || 'ayodhya');
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const activeRegion =
    REGIONS_DATA.find((r) => r.slug === (hoveredSlug || selectedSlug)) || REGIONS_DATA[0];

  // Hotspot coordinates in the SVG viewBox space: -491.5 -522.36 1638.55 1852.41
  // Refined for geographical accuracy:
  const destinationPins: Record<string, { x: number; y: number; label: string }> = {
    ayodhya: { x: 370, y: 150, label: 'Ayodhya' },
    varanasi: { x: 440, y: 240, label: 'Varanasi' },
    bengal: { x: 640, y: 350, label: 'Kolkata & Bengal' },
    gujarat: { x: -80, y: 280, label: 'Gujarat' },
    goa: { x: 30, y: 730, label: 'Goa' },
    'tamil-nadu': { x: 260, y: 920, label: 'Tamil Nadu' },
  };

  const handleStateMouseEnter = (stateId: string, e: React.MouseEvent) => {
    // Find matching region
    let matched = REGIONS_DATA.find((r) => r.stateId.toLowerCase() === stateId.toLowerCase());
    if (stateId.toLowerCase() === 'uttar_pradesh') {
      // Default to Ayodhya or Varanasi depending on current
      matched = REGIONS_DATA.find((r) => r.slug === 'ayodhya');
    }
    if (matched) {
      setHoveredSlug(matched.slug);
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setTooltipPos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    }
  };

  const handleStateMouseLeave = () => {
    setHoveredSlug(null);
    setTooltipPos(null);
  };

  const handlePinClick = (slug: string) => {
    setSelectedSlug(slug);
    onSelectRegion(slug);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full py-16 sm:py-24 px-4 sm:px-8 lg:px-16 bg-gradient-to-b from-[#101C2B] via-[#0A131E] to-[#101C2B] select-none overflow-hidden"
    >
      {/* Editorial Section Header */}
      <div className="max-w-6xl mx-auto text-center mb-12 sm:mb-16">
        <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#E8A1BC] font-medium block mb-3">
          Cultural Cartography
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#F2EAE5] tracking-wide font-normal">
          Interactive Cultural Atlas
        </h2>
        <p className="font-display italic text-sm sm:text-base md:text-lg text-[#B8DAD3] max-w-2xl mx-auto mt-3 font-light leading-relaxed">
          Hover over regional destinations or state boundaries to discover how the festival of light adapts its spirit across the subcontinent.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left/Center: Interactive SVG Map (7 Cols) */}
        <div className="lg:col-span-7 relative flex items-center justify-center min-h-[520px] sm:min-h-[640px]">
          {/* Subtle Ambient Radial Backlight */}
          <div className="absolute inset-0 bg-radial-gradient from-[#B8DAD3]/10 via-[#101C2B]/50 to-transparent blur-3xl pointer-events-none" />

          {/* SVG Map of India with accurate state boundaries */}
          <div className="relative w-full max-w-[620px] aspect-[1638/1852]">
            <svg
              viewBox="-491.5 -522.36 1638.55 1852.41"
              className="w-full h-full filter drop-shadow-[0_15px_35px_rgba(0,0,0,0.6)]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter id="mapGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* State Boundaries Layer */}
              <g id="states-layer">
                {statePathsData
                  .filter((s) => s.id !== 'foreign_2_' && s.id !== 'water_2_')
                  .map((state) => {
                    const isTargetState = REGIONS_DATA.some(
                      (r) => r.stateId.toLowerCase() === state.id.toLowerCase()
                    );
                    const isStateActive =
                      activeRegion.stateId.toLowerCase() === state.id.toLowerCase();

                    return (
                      <path
                        key={state.id}
                        id={state.id}
                        d={state.d}
                        onMouseEnter={(e) => handleStateMouseEnter(state.id, e)}
                        onMouseLeave={handleStateMouseLeave}
                        onClick={() => {
                          const matched = REGIONS_DATA.find(
                            (r) => r.stateId.toLowerCase() === state.id.toLowerCase()
                          );
                          if (matched) handlePinClick(matched.slug);
                        }}
                        className={`transition-all duration-300 ${
                          isTargetState ? 'cursor-pointer' : 'cursor-default'
                        }`}
                        fill={
                          isStateActive
                            ? 'rgba(184, 218, 211, 0.22)'
                            : isTargetState
                            ? 'rgba(232, 161, 188, 0.12)'
                            : 'rgba(20, 34, 50, 0.75)'
                        }
                        stroke={
                          isStateActive
                            ? '#E8A1BC'
                            : isTargetState
                            ? '#B8DAD3'
                            : '#2C3E50'
                        }
                        strokeWidth={isStateActive ? 3.5 : isTargetState ? 2.2 : 1.2}
                      />
                    );
                  })}
              </g>

              {/* Destination Hotspots Pins */}
              <g id="pins-layer">
                {REGIONS_DATA.map((region) => {
                  const pin = destinationPins[region.slug];
                  if (!pin) return null;
                  const isCurrent = activeRegion.slug === region.slug;

                  return (
                    <g
                      key={region.id}
                      transform={`translate(${pin.x}, ${pin.y})`}
                      className="cursor-pointer group"
                      onClick={() => handlePinClick(region.slug)}
                      onMouseEnter={() => setHoveredSlug(region.slug)}
                      onMouseLeave={() => setHoveredSlug(null)}
                    >
                      {/* Outer Pulse Wave */}
                      <circle
                        r={isCurrent ? 28 : 20}
                        className={`transition-all duration-500 fill-none ${
                          isCurrent
                            ? 'stroke-[#E8A1BC] animate-ping opacity-60'
                            : 'stroke-[#B8DAD3]/40 group-hover:stroke-[#E8A1BC]'
                        }`}
                        strokeWidth="2"
                      />

                      {/* Main Glow Disc */}
                      <circle
                        r={isCurrent ? 14 : 10}
                        fill={isCurrent ? '#E8A1BC' : '#B8DAD3'}
                        className="transition-all duration-300 group-hover:scale-125"
                      />

                      {/* Core White Dot */}
                      <circle r="4" fill="#101C2B" />

                      {/* Destination Number Pip */}
                      <text
                        y="-22"
                        textAnchor="middle"
                        className={`font-serif text-[24px] tracking-wider fill-current select-none pointer-events-none transition-all duration-300 ${
                          isCurrent
                            ? 'text-[#F2EAE5] font-semibold'
                            : 'text-[#B8DAD3]/80 group-hover:text-[#E8A1BC]'
                        }`}
                      >
                        {region.name}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>

          {/* Floating Editorial Tooltip on Hover */}
          {tooltipPos && hoveredSlug && (
            <div
              className="absolute z-30 pointer-events-none hidden md:block p-3.5 rounded-xl bg-[#0A131E]/95 border border-[#B8DAD3]/30 shadow-2xl backdrop-blur-md max-w-xs transition-opacity duration-200"
              style={{
                left: `${Math.min(window.innerWidth - 300, tooltipPos.x + 20)}px`,
                top: `${tooltipPos.y - 10}px`,
              }}
            >
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#E8A1BC] font-medium block">
                {activeRegion.state}
              </span>
              <h4 className="font-serif text-lg text-[#F2EAE5] font-normal leading-tight">
                {activeRegion.name}
              </h4>
              <p className="text-xs text-[#F2EAE5]/75 line-clamp-2 mt-1 font-light">
                {activeRegion.shortDescription}
              </p>
            </div>
          )}
        </div>

        {/* Right: Rich Editorial Info Panel (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0A131E]/90 border border-[#B8DAD3]/20 shadow-2xl backdrop-blur-md space-y-6 relative overflow-hidden">
            {/* Top Eyebrow & Number */}
            <div className="flex items-center justify-between border-b border-[#343E50]/60 pb-4">
              <span className="text-xs uppercase tracking-[0.3em] text-[#E8A1BC] font-medium flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#B8DAD3]" />
                <span>{activeRegion.state}</span>
              </span>
              <span className="font-mono text-sm tracking-widest text-[#B8DAD3]">
                {activeRegion.number} / 06
              </span>
            </div>

            {/* Region Title & Tagline */}
            <div>
              <h3 className="font-serif text-3xl sm:text-4xl text-[#F2EAE5] font-normal leading-tight">
                {activeRegion.name}
              </h3>
              <p className="font-display italic text-base sm:text-lg text-[#B8DAD3] mt-1 font-light">
                {activeRegion.title}
              </p>
            </div>

            {/* Region Photo Preview */}
            <div className="relative rounded-2xl overflow-hidden h-48 sm:h-56 border border-[#343E50]/60 shadow-lg group">
              <img
                src={activeRegion.heroImage}
                alt={activeRegion.name}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A131E] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-3 left-4 right-4">
                <span className="text-[10px] uppercase tracking-widest text-[#E8A1BC] block font-light">
                  Sacred Tradition
                </span>
                <span className="font-serif text-sm text-[#F2EAE5]">
                  {activeRegion.tagline}
                </span>
              </div>
            </div>

            {/* Cultural Description */}
            <p className="text-xs sm:text-sm text-[#F2EAE5]/80 leading-relaxed font-light">
              {activeRegion.shortDescription}
            </p>

            {/* Deep Cultural Fact Badge */}
            <div className="p-3.5 rounded-xl bg-[#101C2B] border border-[#B8DAD3]/15 text-xs text-[#B8DAD3]/90 leading-relaxed font-light">
              <strong className="text-[#E8A1BC] font-medium block mb-1">
                Regional Distinction:
              </strong>
              {activeRegion.culturalFact}
            </div>

            {/* Primary Action Button to Enter Deep Dive */}
            <button
              onClick={() => onSelectRegion(activeRegion.slug)}
              className="w-full py-3.5 px-6 rounded-full border border-[#E8A1BC]/60 bg-[#E8A1BC]/15 hover:bg-[#E8A1BC]/25 text-[#F2EAE5] font-medium text-xs uppercase tracking-[0.22em] transition-all flex items-center justify-center space-x-2.5 focus:outline-none"
            >
              <span>Explore {activeRegion.name} Journey</span>
              <ArrowRight className="w-4 h-4 text-[#E8A1BC]" />
            </button>
          </div>

          {/* Quick Region Selector Pills for Touch & Desktop */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-5">
            {REGIONS_DATA.map((r) => {
              const isSelected = activeRegion.slug === r.slug;
              return (
                <button
                  key={r.slug}
                  onClick={() => handlePinClick(r.slug)}
                  className={`py-2 px-2.5 rounded-xl text-[11px] tracking-wider uppercase transition-all border text-center ${
                    isSelected
                      ? 'border-[#E8A1BC] bg-[#E8A1BC]/20 text-[#F2EAE5] font-medium'
                      : 'border-[#343E50]/40 text-[#B8DAD3]/70 hover:text-[#F2EAE5] hover:border-[#B8DAD3]/40'
                  }`}
                >
                  {r.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

