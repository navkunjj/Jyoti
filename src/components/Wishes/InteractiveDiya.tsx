import React, { useState } from 'react';
import { DiyaFlame } from '../UI/DiyaFlame';
import { soundscape } from '../../utils/sound';
import { fireworks } from '../../fireworks';
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

      // Auspicious celebratory firework burst overhead
      const cx = typeof window !== 'undefined' ? window.innerWidth * 0.5 : 400;
      const cy = typeof window !== 'undefined' ? window.innerHeight * 0.28 : 250;
      fireworks.burst(cx, cy, {
        type: 'chrysanthemum',
        color: '#FFE29A',
        secondaryColor: '#E98EAF',
        particleCount: 85,
      });

      confetti({
        particleCount: 35,
        spread: 55,
        origin: { y: 0.65, x: 0.5 },
        colors: ['#FFE29A', '#FDB863', '#E98EAF', '#F4C4D2'],
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-[#0A1B22]/90 border border-[#A99BBF]/20 shadow-2xl backdrop-blur-md select-none text-center">
      <span className="text-xs uppercase tracking-[0.3em] text-[#E98EAF] font-medium mb-3 block">
        Ceremonial Diya
      </span>

      {/* Main Diya */}
      <div className="my-2 transition-transform duration-300 hover:scale-105 active:scale-95">
        <DiyaFlame
          size="xl"
          isLit={isLit}
          onClick={toggleDiya}
        />
      </div>

      {/* Description & Status */}
      <h4 className="font-serif text-2xl text-[#F3EAE2] mt-3 mb-1 font-normal">
        {isLit ? 'The Sacred Flame is Alive' : 'The Wick Awaits Your Touch'}
      </h4>
      <p className="text-xs text-[#A99BBF] max-w-sm mb-3 font-light">
        {isLit
          ? 'Touch the diya to rekindle your personal prayer into the night.'
          : 'Touch the clay bowl to awaken the auspicious spark and send warmth to all.'}
      </p>

      {/* Counter: Clean and minimal */}
      <div className="text-xs tracking-wider uppercase text-[#A99BBF]/80 pt-1 font-light">
        <strong className="text-[#FFE29A] font-mono font-medium mr-1.5">{blessingCount.toLocaleString()}</strong>
        Lamps Kindled Tonight
      </div>
    </div>
  );
};

