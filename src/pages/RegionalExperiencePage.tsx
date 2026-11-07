import React, { useEffect, useRef } from 'react';
import { REGIONS_DATA, RegionData } from '../data/regionsData';
import { useRouter } from '../router';
import { CulturalInteractionModule } from '../components/ExploreIndia/CulturalInteractionModule';
import { soundscape } from '../utils/sound';
import { fireworks } from '../fireworks';
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Calendar,
  Sparkles,
  Utensils,
  BookOpen,
  Palette,
  Volume2,
} from 'lucide-react';

interface RegionalExperiencePageProps {
  regionSlug: string;
}

export const RegionalExperiencePage: React.FC<RegionalExperiencePageProps> = ({
  regionSlug,
}) => {
  const { navigate } = useRouter();
  const region =
    REGIONS_DATA.find((r) => r.slug === regionSlug) || REGIONS_DATA[0];
  const nextRegion =
    REGIONS_DATA.find((r) => r.slug === region.nextRegionSlug) || REGIONS_DATA[0];

  const pageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Scroll to top on regional route transition
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Auspicious entrance burst for the regional arrival
    const timer = setTimeout(() => {
      const cx = typeof window !== 'undefined' ? window.innerWidth * 0.5 : 400;
      const cy = typeof window !== 'undefined' ? window.innerHeight * 0.25 : 200;
      fireworks.burst(cx, cy, {
        type: 'chrysanthemum',
        color: region.accentColor === '#B8DAD3' ? '#B8DAD3' : '#E8A1BC',
        secondaryColor: '#FFE29A',
        particleCount: 75,
      });
    }, 600);

    return () => clearTimeout(timer);
  }, [regionSlug]);

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-[#101C2B] text-[#F2EAE5] selection:bg-[#E8A1BC]/30 select-none pb-24"
    >
      {/* 1. Sticky Editorial Sub-Header Breadcrumb */}
      <nav className="sticky top-0 z-40 bg-[#0A131E]/90 backdrop-blur-md border-b border-[#343E50]/40 px-6 sm:px-12 py-3.5 flex items-center justify-between text-xs tracking-wider uppercase">
        <button
          onClick={() => navigate('/explore-india')}
          className="flex items-center space-x-2 text-[#B8DAD3] hover:text-[#F2EAE5] transition-colors focus:outline-none"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cultural Atlas</span>
        </button>

        <div className="flex items-center space-x-2 text-[#B8DAD3]/70 font-mono">
          <span>{region.number}</span>
          <span>/</span>
          <span className="text-[#F2EAE5] font-sans font-medium">{region.name}</span>
        </div>

        <button
          onClick={() => navigate(`/explore-india/${nextRegion.slug}`)}
          className="hidden sm:flex items-center space-x-1.5 text-[#E8A1BC] hover:text-[#F2EAE5] transition-colors focus:outline-none"
        >
          <span>Next: {nextRegion.name}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </nav>

      {/* A. Regional Hero Section */}
      <header className="relative w-full min-h-[75vh] flex items-end pb-16 sm:pb-24 px-6 sm:px-12 lg:px-20 overflow-hidden">
        {/* Full-width Cinematic Photography */}
        <div className="absolute inset-0 z-0">
          <img
            src={region.heroImage}
            alt={region.name}
            className="w-full h-full object-cover object-center filter brightness-[0.75]"
          />
          {/* Subtle multi-stop gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#101C2B] via-[#101C2B]/60 to-transparent" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#101C2B]/70" />
        </div>

        {/* Hero Narrative Typography */}
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex items-center space-x-3 text-xs tracking-[0.3em] uppercase text-[#E8A1BC] font-medium">
            <span className="font-mono text-sm text-[#B8DAD3]">{region.number}</span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-[#B8DAD3]" />
              <span>{region.state}</span>
            </span>
          </div>

          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#F2EAE5] font-normal leading-none">
            {region.name}
          </h1>

          <p className="font-display italic text-xl sm:text-2xl md:text-3xl text-[#B8DAD3] font-light">
            {region.title}
          </p>

          <p className="text-sm sm:text-base md:text-lg text-[#F2EAE5]/85 font-light max-w-2xl leading-relaxed pt-2">
            {region.shortDescription}
          </p>
        </div>
      </header>

      {/* Main Storytelling Body */}
      <main className="max-w-5xl mx-auto px-6 sm:px-10 space-y-24 pt-16">
        {/* B. The Story Section */}
        <section className="space-y-6 border-b border-[#343E50]/40 pb-16">
          <div className="flex items-center space-x-2 text-xs uppercase tracking-[0.25em] text-[#E8A1BC]">
            <BookOpen className="w-4 h-4 text-[#B8DAD3]" />
            <span>The Sacred Lore</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl text-[#F2EAE5] font-normal">
            Cultural & Philosophical Origin
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-4 rounded-2xl bg-[#0A131E]/80 border border-[#343E50]/60 space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-[#B8DAD3]/70 font-light block">
                Scriptural Source
              </span>
              <p className="font-serif text-sm text-[#F2EAE5]">
                {region.theStory.origin}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0A131E]/80 border border-[#343E50]/60 space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-[#B8DAD3]/70 font-light block">
                Philosophical Core
              </span>
              <p className="font-serif text-sm text-[#E8A1BC]">
                {region.theStory.philosophicalTheme}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0A131E]/80 border border-[#343E50]/60 space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-[#B8DAD3]/70 font-light block">
                Civilizational Context
              </span>
              <p className="font-serif text-sm text-[#B8DAD3]">
                {region.theStory.historicalEra}
              </p>
            </div>
          </div>

          <p className="text-base sm:text-lg text-[#F2EAE5]/85 leading-relaxed font-light pt-4">
            {region.theStory.narrative}
          </p>
        </section>

        {/* C. The Traditions Section */}
        <section className="space-y-6 border-b border-[#343E50]/40 pb-16">
          <div className="flex items-center space-x-2 text-xs uppercase tracking-[0.25em] text-[#E8A1BC]">
            <Calendar className="w-4 h-4 text-[#B8DAD3]" />
            <span>Rituals & Observances</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl text-[#F2EAE5] font-normal">
            The Living Traditions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            {region.traditions.map((t, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-3xl bg-[#0A131E]/90 border border-[#343E50]/60 space-y-3"
              >
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#B8DAD3] block">
                  {t.timing}
                </span>
                <h3 className="font-serif text-2xl text-[#F2EAE5] font-normal">
                  {t.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#F2EAE5]/75 leading-relaxed font-light">
                  {t.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* D. Art & Architectural Heritage */}
        <section className="space-y-6 border-b border-[#343E50]/40 pb-16">
          <div className="flex items-center space-x-2 text-xs uppercase tracking-[0.25em] text-[#E8A1BC]">
            <Palette className="w-4 h-4 text-[#B8DAD3]" />
            <span>Craft & Form</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl text-[#F2EAE5] font-normal">
            Art and Architectural Heritage
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
            <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-[#343E50] shadow-xl">
              <img
                src={region.secondaryImage}
                alt={region.artAndHeritage.craftName}
                className="w-full h-72 sm:h-80 object-cover object-center"
              />
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#E8A1BC] block">
                  Craft Tradition
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#F2EAE5]">
                  {region.artAndHeritage.craftName}
                </h3>
              </div>

              <div className="text-xs text-[#B8DAD3] space-y-1">
                <p>
                  <strong>Architecture:</strong> {region.artAndHeritage.architectureType}
                </p>
                <p>
                  <strong>Traditional Materials:</strong> {region.artAndHeritage.materials}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-[#F2EAE5]/80 leading-relaxed font-light pt-2">
                {region.artAndHeritage.description}
              </p>
            </div>
          </div>
        </section>

        {/* E. Festive Flavours Section */}
        <section className="space-y-6 border-b border-[#343E50]/40 pb-16">
          <div className="flex items-center space-x-2 text-xs uppercase tracking-[0.25em] text-[#E8A1BC]">
            <Utensils className="w-4 h-4 text-[#B8DAD3]" />
            <span>Culinary Offerings</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl text-[#F2EAE5] font-normal">
            Festive Flavours & Sacred Food
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            {region.festiveFlavours.map((dish, i) => (
              <div
                key={i}
                className="p-6 rounded-3xl bg-[#0A131E]/90 border border-[#343E50]/60 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#E8A1BC] bg-[#E8A1BC]/10 px-2.5 py-0.5 rounded-full border border-[#E8A1BC]/20">
                    {dish.category}
                  </span>
                  {dish.hindiName && (
                    <span className="font-serif text-sm text-[#B8DAD3]">
                      {dish.hindiName}
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-2xl text-[#F2EAE5]">
                  {dish.name}
                </h3>

                <p className="text-xs sm:text-sm text-[#F2EAE5]/75 leading-relaxed font-light">
                  {dish.description}
                </p>

                <div className="pt-2 border-t border-[#343E50]/30 text-[11px] text-[#B8DAD3]/70">
                  <span>Key Ingredients: </span>
                  <span className="text-[#F2EAE5]/90 font-light">
                    {dish.ingredients.join(' · ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* F. Cultural Interaction Module */}
        <section>
          <CulturalInteractionModule region={region} />
        </section>

        {/* G. Next Regional Destination Gateway */}
        <section className="pt-12 border-t border-[#343E50]/40">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#0A131E] via-[#101C2B] to-[#0A131E] border border-[#B8DAD3]/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#E8A1BC] font-medium block">
                Continue the Pilgrimage
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl text-[#F2EAE5]">
                Next: {nextRegion.name}
              </h3>
              <p className="font-display italic text-sm sm:text-base text-[#B8DAD3] font-light">
                {nextRegion.title}
              </p>
            </div>

            <button
              onClick={() => navigate(`/explore-india/${nextRegion.slug}`)}
              className="py-3.5 px-8 rounded-full border border-[#E8A1BC] bg-[#E8A1BC]/15 hover:bg-[#E8A1BC]/25 text-[#F2EAE5] text-xs uppercase tracking-[0.22em] transition-all flex items-center space-x-2.5 focus:outline-none flex-shrink-0"
            >
              <span>Journey to {nextRegion.name}</span>
              <ArrowRight className="w-4 h-4 text-[#E8A1BC]" />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

