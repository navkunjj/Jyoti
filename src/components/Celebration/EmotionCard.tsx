import React from 'react';
import { CelebrationEmotion } from '../../types';
import { LotusIcon } from '../UI/LotusIcon';
import { Sparkles, Heart } from 'lucide-react';

interface EmotionCardProps {
  emotion: CelebrationEmotion;
  index: number;
}

export const EmotionCard: React.FC<EmotionCardProps> = ({ emotion, index }) => {
  const isEven = index % 2 === 0;

  return (
    <div
      className={`flex flex-col ${
        isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
      } items-center gap-8 lg:gap-14 py-8 select-none`}
    >
      {/* Visual Image Layer with Parallax Frame */}
      <div className="w-full lg:w-1/2 relative group">
        <div className="relative rounded-3xl overflow-hidden border border-[#A99BBF]/25 shadow-2xl bg-[#061116]/60 backdrop-blur-md">
          {/* Main Visual */}
          <div className="h-72 sm:h-84 md:h-96 w-full overflow-hidden">
            <img
              src={emotion.image}
              alt={emotion.englishTitle}
              className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
              loading="lazy"
            />
          </div>

          {/* Atmospheric Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#061116] via-transparent to-transparent opacity-70" />

          {/* Hindi Title Watermark in corner */}
          <div className="absolute top-5 left-6 text-4xl sm:text-5xl font-serif text-[#F4C4D2]/25 font-bold tracking-widest pointer-events-none">
            {emotion.hindiTitle}
          </div>

          {/* Floating Pill Badge */}
          <div className="absolute bottom-5 left-6 flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#102C38]/90 backdrop-blur-md border border-[#E98EAF]/40">
            <Sparkles className="w-3.5 h-3.5 text-[#FDB863]" />
            <span className="text-[11px] uppercase tracking-[0.22em] text-[#F3EAE2] font-medium">
              {emotion.aspect}
            </span>
          </div>
        </div>

        {/* Decorative Floating Accent Border */}
        <div
          className={`absolute -inset-2.5 rounded-3xl border border-[#E98EAF]/20 -z-10 transition-transform duration-500 group-hover:scale-102 ${
            isEven ? 'translate-x-2 translate-y-2' : '-translate-x-2 translate-y-2'
          }`}
        />
      </div>

      {/* Narrative & Emotional Essence */}
      <div className="w-full lg:w-1/2 flex flex-col space-y-4">
        <div className="flex items-center space-x-2">
          <LotusIcon size={20} />
          <span className="text-xs uppercase tracking-[0.28em] text-[#E98EAF] font-medium">
            The Spirit of Diwali
          </span>
        </div>

        <h3 className="font-serif text-3xl sm:text-4xl text-[#F3EAE2]">
          {emotion.englishTitle}
        </h3>

        <h4 className="font-display italic text-lg sm:text-xl text-[#FFE29A] font-light">
          {emotion.subtitle}
        </h4>

        <p className="text-sm sm:text-base text-[#F3EAE2]/80 leading-relaxed font-light">
          {emotion.description}
        </p>

        {/* Poetic Note */}
        <div className="p-4 rounded-xl bg-[#102C38]/40 border-l-2 border-[#E98EAF] text-xs sm:text-sm text-[#F4C4D2] italic font-serif leading-relaxed">
          "{emotion.poeticNote}"
        </div>
      </div>
    </div>
  );
};

