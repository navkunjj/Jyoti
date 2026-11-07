import React, { useState, useEffect } from 'react';
import { diyaService, GlobalDiyaStats, CountryStats } from '../../services/diyaService';
import { soundscape } from '../../utils/sound';
import confetti from 'canvas-confetti';

interface GlobalGoalCardProps {
  selectedCountry?: CountryStats | null;
  onDiyaLitSuccess?: () => void;
}

export const GlobalGoalCard: React.FC<GlobalGoalCardProps> = ({
  selectedCountry,
  onDiyaLitSuccess,
}) => {
  const [stats, setStats] = useState<GlobalDiyaStats>(diyaService.getGlobalStats());
  const [isUserLit, setIsUserLit] = useState<boolean>(false);
  const [isLighting, setIsLighting] = useState<boolean>(false);
  const [selectedCountryId, setSelectedCountryId] = useState<string>('356'); // India default
  const countries = diyaService.getCountries();

  useEffect(() => {
    const updateStats = () => {
      setStats(diyaService.getGlobalStats());
      const userState = diyaService.getUserDiyaState();
      setIsUserLit(userState.isLit);
    };

    updateStats();
    const unsub = diyaService.subscribe(updateStats);
    window.addEventListener('jyoti:diya-updated', updateStats);

    return () => {
      unsub();
      window.removeEventListener('jyoti:diya-updated', updateStats);
    };
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      setSelectedCountryId(selectedCountry.id);
    }
  }, [selectedCountry]);

  const percentage = Math.min(100, (stats.totalDiyas / stats.targetGoal) * 100);
  const remaining = Math.max(0, stats.targetGoal - stats.totalDiyas);

  const handleLightDiya = () => {
    if (isUserLit || isLighting) return;

    setIsLighting(true);
    soundscape.playDiyaChime();

    // Subtle, warm amber embers
    if (typeof window !== 'undefined') {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#FFE29A', '#FDB863', '#E98EAF'],
        ticks: 160,
        gravity: 0.8,
        scalar: 0.7,
      });
    }

    setTimeout(() => {
      const res = diyaService.lightDiya(selectedCountryId);
      setIsLighting(false);
      if (res.success && onDiyaLitSuccess) {
        onDiyaLitSuccess();
      }
    }, 400);
  };

  return (
    <div className="w-full space-y-8 select-none">
      {/* Editorial Header */}
      <div className="space-y-3">
        <div className="text-[11px] uppercase tracking-widest text-[#9E8D9F] font-sans">
          The Offering / Collective Journey
        </div>
        <h3 className="font-serif text-3xl sm:text-4xl text-[#F5ECE3] font-light tracking-tight">
          Toward One Million Lamps
        </h3>
        <p className="text-sm text-[#9E8D9F] font-sans leading-relaxed max-w-xl">
          Each diya kindled joins an ancient lineage of light dispelling the dark. When we reach one million offerings, the global circle is complete.
        </p>
      </div>

      {/* Slender Architectural Progress Track */}
      <div className="space-y-3 pt-2">
        <div className="flex items-baseline justify-between text-xs font-sans">
          <span className="text-[#F5ECE3]">
            <strong className="font-serif text-lg font-normal text-[#F5ECE3] mr-1.5">
              {stats.totalDiyas.toLocaleString()}
            </strong>
            <span className="text-[#9E8D9F]">of 1,000,000 diyas lit</span>
          </span>
          <span className="font-mono text-xs text-[#E6DACF]">
            {percentage.toFixed(1)}%
          </span>
        </div>

        {/* Minimal hairline progress track */}
        <div className="relative w-full h-1 bg-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#8C3A4D] via-[#FDB863] to-[#FFE29A] transition-all duration-1000 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="text-xs text-[#9E8D9F] font-sans">
          {remaining.toLocaleString()} diyas needed to fulfill the global circle of radiance.
        </div>
      </div>

      {/* Dedication Form & Handcrafted CTA */}
      <div className="pt-6 border-t border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          {/* Country Selection */}
          <div className="flex-1 max-w-sm space-y-2">
            <label className="block text-[11px] uppercase tracking-wider text-[#9E8D9F] font-sans">
              Dedicate offering from
            </label>
            <div className="relative">
              <select
                value={selectedCountryId}
                onChange={(e) => setSelectedCountryId(e.target.value)}
                disabled={isUserLit}
                className="w-full px-3.5 py-2.5 bg-[#140716] border border-white/15 text-[#F5ECE3] text-sm font-sans focus:outline-none focus:border-white/40 transition-colors appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {countries.map((c) => (
                  <option key={c.id} value={c.id} className="bg-[#140716] text-[#F5ECE3]">
                    {c.name} ({c.diyas.toLocaleString()} lit)
                  </option>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] text-[#9E8D9F]">
                ↓
              </div>
            </div>
          </div>

          {/* Handcrafted CTA Action */}
          <div className="flex flex-col sm:items-end">
            {isUserLit ? (
              <div className="px-5 py-3 border border-white/15 bg-[#160818] text-left sm:text-right">
                <div className="flex items-center space-x-2 text-xs text-[#F5ECE3] font-serif">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FDB863] shadow-[0_0_6px_#FDB863]" />
                  <span>Your flame is kindled</span>
                </div>
                <div className="text-[11px] text-[#9E8D9F] font-sans mt-0.5">
                  Recorded in the global tally for Diwali 2026.
                </div>
              </div>
            ) : (
              <button
                onClick={handleLightDiya}
                disabled={isLighting}
                className="group relative px-8 py-3.5 bg-[#1f0b22] hover:bg-[#280e2b] border border-[#8C4A60]/60 hover:border-[#FDB863]/60 text-[#F5ECE3] transition-all duration-300 focus:outline-none flex items-center space-x-3 cursor-pointer"
              >
                {/* Subtle flame indicator */}
                <span className="w-2 h-2 rounded-full bg-[#FDB863] shadow-[0_0_8px_#FDB863] group-hover:scale-125 transition-transform" />
                <span className="font-serif text-base tracking-wide font-normal">
                  {isLighting ? 'Kindling Flame...' : 'Kindle a Diya'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
