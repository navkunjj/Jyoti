import React, { useState } from 'react';
import { DiyaFlame } from '../UI/DiyaFlame';
import { soundscape } from '../../utils/sound';
import { Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface InteractiveDiyaProps {
  onLightChange?: (isLit: boolean) => void;
}

export const InteractiveDiya: React.FC<InteractiveDiyaProps> = ({ onLightChange }) => {
  const [isLit, setIsLit] = useState(true);
  const [blessingCount, setBlessingCount] = useState(108);

  const toggleDiya = () => {
    const nextState = !isLit;
    setIsLit(nextState);
    if (onLightChange) onLightChange(nextState);

    if (nextState) {
      soundscape.playDiyaChime();
      setBlessingCount((c) => c + 1);

      confetti({
        particleCount: 35,
        spread: 55,
        origin: { y: 0.65, x: 0.5 },
        colors: ['#FFE29A', '#FDB863', '#E98EAF', '#F4C4D2'],
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-3xl bg-gradient-to-b from-[#102C38]/60 to-[#061116]/80 border border-[#E98EAF]/30 shadow-2xl backdrop-blur-md select-none text-center">
      {/* Decorative Arch Crest */}
      <div className="mb-4 flex items-center space-x-2 text-xs uppercase tracking-[0.3em] text-[#E98EAF]">
        <Sparkles className="w-3.5 h-3.5 text-[#FDB863]" />
        <span>Kindle the Sacred Flame</span>
        <Sparkles className="w-3.5 h-3.5 text-[#FDB863]" />
      </div>

      {/* Main Diya */}
      <div className="my-3 transition-transform duration-300 hover:scale-105 active:scale-95">
        <DiyaFlame
          size="xl"
          isLit={isLit}
          onClick={toggleDiya}
        />
      </div>

      {/* Description & Status */}
      <h4 className="font-serif text-2xl text-[#F3EAE2] mt-4 mb-1">
        {isLit ? 'The Sacred Flame is Alive' : 'The Wick Awaits Your Touch'}
      </h4>
      <p className="text-xs text-[#A99BBF] max-w-sm mb-4">
        {isLit
          ? 'Touch the diya to extinguish or kindle your personal prayer into the night.'
          : 'Click the clay bowl to awaken the auspicious spark and send warmth to all.'}
      </p>

      {/* Counter */}
      <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#101B35] border border-[#A99BBF]/20 text-[11px] tracking-wider uppercase text-[#F4C4D2]">
        <span className="w-2 h-2 rounded-full bg-[#FDB863] animate-pulse" />
        <span>{blessingCount.toLocaleString()} Lamps Kindled Tonight</span>
      </div>
    </div>
  );
};

