import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { diyaService } from '../../services/diyaService';

export const StatisticsSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const totalRef = useRef<HTMLSpanElement | null>(null);
  const countriesRef = useRef<HTMLSpanElement | null>(null);
  const goalRef = useRef<HTMLSpanElement | null>(null);

  const [stats, setStats] = useState(diyaService.getGlobalStats());

  useEffect(() => {
    const updateStats = () => {
      setStats(diyaService.getGlobalStats());
    };
    const unsub = diyaService.subscribe(updateStats);
    window.addEventListener('jyoti:diya-updated', updateStats);
    return () => {
      unsub();
      window.removeEventListener('jyoti:diya-updated', updateStats);
    };
  }, []);

  // GSAP Counter Animation
  useEffect(() => {
    const counterObj = {
      total: 0,
      countries: 0,
      goal: 0,
    };

    const ctx = gsap.context(() => {
      gsap.to(counterObj, {
        total: stats.totalDiyas,
        countries: stats.countriesCount,
        goal: stats.targetGoal,
        duration: 2.2,
        ease: 'power2.out',
        onUpdate: () => {
          if (totalRef.current) {
            totalRef.current.innerText = Math.floor(counterObj.total).toLocaleString();
          }
          if (countriesRef.current) {
            countriesRef.current.innerText = Math.floor(counterObj.countries).toString();
          }
          if (goalRef.current) {
            goalRef.current.innerText = Math.floor(counterObj.goal).toLocaleString();
          }
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [stats.totalDiyas, stats.countriesCount, stats.targetGoal]);

  return (
    <div
      ref={containerRef}
      className="w-full pt-8 pb-12 border-b border-white/10 select-none"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {/* Metric 01 */}
        <div className="flex flex-col space-y-2">
          <div className="text-[11px] uppercase tracking-widest text-[#9E8D9F] font-sans">
            01 / Global Tally
          </div>
          <div className="flex items-baseline">
            <span
              ref={totalRef}
              className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-[#F5ECE3] tracking-tight"
            >
              {stats.totalDiyas.toLocaleString()}
            </span>
          </div>
          <div className="text-sm font-serif italic text-[#ECE0D4]">
            Flames Kindled Worldwide
          </div>
          <p className="text-xs text-[#9E8D9F]/80 leading-relaxed font-sans pt-1">
            Individual souls offering light across distances and oceans.
          </p>
        </div>

        {/* Metric 02 */}
        <div className="flex flex-col space-y-2 md:border-l md:border-white/10 md:pl-10">
          <div className="text-[11px] uppercase tracking-widest text-[#9E8D9F] font-sans">
            02 / Reach
          </div>
          <div className="flex items-baseline space-x-1">
            <span
              ref={countriesRef}
              className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-[#F5ECE3] tracking-tight"
            >
              {stats.countriesCount}
            </span>
            {stats.countriesCount > 0 && (
              <span className="font-serif text-3xl text-[#9E8D9F] font-light">
                +
              </span>
            )}
          </div>
          <div className="text-sm font-serif italic text-[#ECE0D4]">
            Participating Nations
          </div>
          <p className="text-xs text-[#9E8D9F]/80 leading-relaxed font-sans pt-1">
            Reaching across every major continent, timezone, and culture.
          </p>
        </div>

        {/* Metric 03 */}
        <div className="flex flex-col space-y-2 md:border-l md:border-white/10 md:pl-10">
          <div className="text-[11px] uppercase tracking-widest text-[#9E8D9F] font-sans">
            03 / Vision
          </div>
          <div className="flex items-baseline">
            <span
              ref={goalRef}
              className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-[#F5ECE3] tracking-tight"
            >
              {stats.targetGoal.toLocaleString()}
            </span>
          </div>
          <div className="text-sm font-serif italic text-[#ECE0D4]">
            The Collective Milestone
          </div>
          <p className="text-xs text-[#9E8D9F]/80 leading-relaxed font-sans pt-1">
            Uniting one million living flames into a single ring of hope.
          </p>
        </div>
      </div>
    </div>
  );
};
