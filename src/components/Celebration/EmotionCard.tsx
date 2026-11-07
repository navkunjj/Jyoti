import React from 'react';
import { CelebrationEmotion } from '../../types';

interface EmotionCardProps {
  emotion: CelebrationEmotion;
  index: number;
}

export const EmotionCard: React.FC<EmotionCardProps> = ({ emotion, index }) => {
  const isEven = index % 2 === 0;

  return (
    <article
      className={`flex flex-col ${
        isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
      } items-center gap-10 lg:gap-16 py-6 select-none`}
    >
      {/* Visual Image Layer: Clean, framed, no floating stickers */}
      <div className="w-full lg:w-1/2 relative">
        <div className="relative rounded-2xl overflow-hidden border border-[#A99BBF]/20 shadow-xl bg-[#061116]">
          <div className="h-72 sm:h-88 md:h-[400px] w-full overflow-hidden">
            <img
              src={emotion.image}
              alt={emotion.englishTitle}
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out hover:scale-105"
              loading="lazy"
            />
          </div>
          {/* Subtle gradient vignette at bottom of photo for visual grounding */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#061116]/60 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Narrative & Editorial Typography */}
      <div className="w-full lg:w-1/2 flex flex-col space-y-4">
        {/* Subtle Sanskrit/Hindi + Category Eyebrow */}
        <div className="flex items-center space-x-3 text-xs tracking-[0.25em] uppercase text-[#E98EAF]">
          <span className="font-serif font-semibold tracking-widest text-sm text-[#FFE29A]">
            {emotion.hindiTitle}
          </span>
          <span className="text-[#A99BBF]/40">•</span>
          <span className="text-[#A99BBF] font-light">
            {emotion.aspect}
          </span>
        </div>

        {/* Major Editorial Headline */}
        <h3 className="font-serif text-3xl sm:text-4xl text-[#F3EAE2] font-normal leading-tight">
          {emotion.englishTitle.replace(/\s*\([^)]*\)/g, '')}
        </h3>

        {/* Elegant Serif Italic Subtitle */}
        <p className="font-display italic text-base sm:text-lg text-[#F4C4D2]/90 font-light -mt-1">
          {emotion.subtitle}
        </p>

        {/* Refined Prose Description */}
        <p className="text-sm sm:text-base text-[#F3EAE2]/80 leading-relaxed font-light pt-1">
          {emotion.description}
        </p>

        {/* Subtle Poetic Thought */}
        <blockquote className="pt-3 border-t border-[#A99BBF]/15 font-serif italic text-sm text-[#FFE29A]/85 leading-relaxed">
          "{emotion.poeticNote}"
        </blockquote>
      </div>
    </article>
  );
};
