import React, { useRef, useState } from 'react';
import { InteractiveDiya } from './InteractiveDiya';
import { WishGreetingCard } from './WishGreetingCard';
import { LotusIcon } from '../UI/LotusIcon';
import { Sparkles, Moon, Sun } from 'lucide-react';

interface FloatingLantern {
  id: number;
  x: number;
  text: string;
}

export const WishesSection: React.FC = () => {
  const [lanterns, setLanterns] = useState<FloatingLantern[]>([]);

  const handleReleaseLantern = (wishText: string) => {
    const newLantern: FloatingLantern = {
      id: Date.now() + Math.random(),
      x: Math.random() * 70 + 15, // between 15% and 85% width
      text: wishText,
    };

    setLanterns((prev) => [...prev, newLantern]);

    // Automatically remove after animation completes
    setTimeout(() => {
      setLanterns((prev) => prev.filter((l) => l.id !== newLantern.id));
    }, 9000);
  };

  return (
    <section
      id="wishes"
      className="relative w-full py-28 sm:py-36 px-6 sm:px-12 lg:px-20 bg-gradient-to-b from-[#0A1B22] via-[#061116] to-[#040C10] overflow-hidden select-none"
      aria-label="Chapter 05 Send Wishes and Blessings"
    >
      {/* Sky Lanterns Animation Layer */}
      <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
        {lanterns.map((l) => (
          <div
            key={l.id}
            className="absolute bottom-0 flex flex-col items-center animate-lantern-float"
            style={{
              left: `${l.x}%`,
              animation: 'floatLantern 8.5s ease-out forwards',
            }}
          >
            {/* Akash Kandil / Sky Lantern Visual */}
            <div className="relative flex flex-col items-center">
              {/* Outer soft glow */}
              <div className="w-16 h-20 rounded-2xl bg-gradient-to-t from-[#FF8833] via-[#FDB863] to-[#FFE29A] opacity-90 shadow-[0_0_35px_rgba(253,184,99,0.9)] flex items-center justify-center p-2">
                <span className="w-3 h-4 bg-white rounded-full animate-ping opacity-75" />
              </div>
              {/* Lantern tassel */}
              <div className="w-0.5 h-6 bg-[#E98EAF]/60" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#E98EAF]" />
            </div>
            {/* Wish text floating along */}
            <span className="text-[10px] text-[#FFE29A] bg-[#061116]/80 px-2 py-0.5 rounded-full mt-2 font-mono whitespace-nowrap opacity-80">
              {l.text}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes floatLantern {
          0% {
            transform: translateY(20px) scale(0.6) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
            transform: translateY(-80px) scale(0.9) rotate(2deg);
          }
          50% {
            transform: translateY(-50vh) scale(0.95) rotate(-2deg);
          }
          100% {
            transform: translateY(-110vh) scale(0.5) rotate(3deg);
            opacity: 0;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto relative z-10 space-y-20">
        {/* Sacred Shloka Header Banner */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <span className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#E98EAF]" />
            <LotusIcon size={26} glow />
            <span className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#E98EAF]" />
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#F3EAE2] mb-4">
            ॐ असतो मा सद्गमय ।
          </h2>
          <h3 className="font-serif text-2xl sm:text-3xl text-gradient-lotus mb-4">
            तमसो मा ज्योतिर्गमय । मृत्योर्मा अमृतं गमय ॥
          </h3>

          <p className="font-display italic text-base sm:text-lg text-[#FFE29A] mb-4">
            "Lead us from untruth to truth, from darkness into eternal light, from mortality to life immortal."
          </p>
          <span className="text-xs uppercase tracking-[0.25em] text-[#A99BBF]">
            — Brihadaranyaka Upanishad (I.iii.28)
          </span>
        </div>

        {/* Central Interactive Diya Kindling Station */}
        <div className="max-w-xl mx-auto">
          <InteractiveDiya />
        </div>

        {/* Custom Greeting Card & Sky Lantern Release Form */}
        <div className="pt-8">
          <WishGreetingCard onReleaseLantern={handleReleaseLantern} />
        </div>
      </div>
    </section>
  );
};

