import React, { useRef } from 'react';
import { ExploreIndiaHero } from '../components/ExploreIndia/ExploreIndiaHero';
import { InteractiveIndiaMap } from '../components/ExploreIndia/InteractiveIndiaMap';
import { DestinationDiscoveryStrip } from '../components/ExploreIndia/DestinationDiscoveryStrip';
import { CulturalFinale } from '../components/ExploreIndia/CulturalFinale';
import { useRouter } from '../router';

export const ExploreIndiaPage: React.FC = () => {
  const { navigate } = useRouter();
  const atlasRef = useRef<HTMLDivElement | null>(null);

  const handleScrollToAtlas = () => {
    if (atlasRef.current) {
      atlasRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectRegion = (slug: string) => {
    navigate(`/explore-india/${slug}`);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="relative min-h-screen bg-[#101C2B] text-[#F2EAE5] selection:bg-[#E8A1BC]/30 overflow-x-hidden">
      {/* 1. Editorial Hero */}
      <ExploreIndiaHero onScrollToAtlas={handleScrollToAtlas} />

      {/* 2. Interactive Cultural Atlas */}
      <div ref={atlasRef} id="atlas">
        <InteractiveIndiaMap onSelectRegion={handleSelectRegion} />
      </div>

      {/* 3. Destination Discovery Strip */}
      <DestinationDiscoveryStrip onSelectRegion={handleSelectRegion} />

      {/* 4. The Cultural Finale */}
      <CulturalFinale
        onBackToHome={handleBackToHome}
        onExploreRegion={handleSelectRegion}
      />
    </div>
  );
};

