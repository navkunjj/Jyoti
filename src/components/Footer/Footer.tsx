import React, { useRef } from 'react';
import { LotusIcon } from '../UI/LotusIcon';
import { ArrowUp } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const footerRef = useRef<HTMLElement | null>(null);

  const scrollToTop = () => {
    onNavigate('welcome');
  };

  const festivalDays = [
    { day: 'Day 01', name: 'Dhanteras', desc: 'Welcoming prosperity & health with Lord Dhanvantari' },
    { day: 'Day 02', name: 'Choti Diwali', desc: 'Naraka Chaturdashi & pre-dawn cleansing rites' },
    { day: 'Day 03', name: 'Deepavali', desc: 'Lakshmi-Ganesha Puja under the sacred new moon' },
    { day: 'Day 04', name: 'Govardhan', desc: 'Annakut feast & gratitude to nature and cattle' },
    { day: 'Day 05', name: 'Bhai Dooj', desc: 'Celebrating eternal affection among siblings' },
  ];

  return (
    <footer
      id="site-footer"
      ref={footerRef}
      className="relative z-20 w-full min-h-[100svh] min-h-[680px] bg-[#040C10] border-t border-[#A99BBF]/20 text-[#F3EAE2] pt-16 sm:pt-20 pb-12 px-6 sm:px-12 lg:px-20 select-none overflow-hidden shadow-[0_-30px_70px_rgba(0,0,0,0.95)] flex flex-col justify-between"
    >
      {/* Background Subtle Radial Gradient */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-t from-[#102C38]/40 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col justify-between flex-grow space-y-12">
        {/* Five Days of Diwali Calendar */}
        <div className="border-b border-[#A99BBF]/15 pb-12">
          <div className="text-center mb-8">
            <span className="text-xs uppercase tracking-[0.3em] text-[#E98EAF] font-medium block mb-2">
              The Sacred Continuum
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#F3EAE2]">
              The Five Days of Diwali
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {festivalDays.map((item, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-[#061116]/80 border border-[#A99BBF]/20 flex flex-col justify-between hover:border-[#E98EAF]/60 transition-colors"
              >
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#FDB863]">
                    {item.day}
                  </span>
                  <h4 className="font-serif text-lg text-[#F4C4D2] mt-1 mb-1.5">
                    {item.name}
                  </h4>
                  <p className="text-xs text-[#F3EAE2]/70 leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Brand & Navigation Links */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-2">
          <div className="flex items-center space-x-4">
            <LotusIcon size={38} glow />
            <div>
              <span className="font-serif text-3xl tracking-[0.25em] text-[#F3EAE2]">
                JYOTI
              </span>
              <span className="block text-[10px] uppercase tracking-[0.35em] text-[#A99BBF] font-sans -mt-1 font-light">
                A Spark of Diwali
              </span>
            </div>
          </div>

          {/* Nav links */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 text-xs uppercase tracking-[0.2em] text-[#A99BBF]">
            <button onClick={() => onNavigate('welcome')} className="hover:text-[#F3EAE2] transition-colors">
              Home
            </button>
            <button onClick={() => onNavigate('art')} className="hover:text-[#F3EAE2] transition-colors">
              Traditions
            </button>
            <button onClick={() => onNavigate('across-india')} className="hover:text-[#F3EAE2] transition-colors">
              Across India
            </button>
            <button onClick={() => onNavigate('celebration')} className="hover:text-[#F3EAE2] transition-colors">
              Celebration
            </button>
            <button onClick={() => onNavigate('wishes')} className="hover:text-[#F3EAE2] transition-colors">
              Wishes
            </button>
          </div>

          {/* Back to top button */}
          <button
            onClick={scrollToTop}
            className="flex items-center space-x-2 px-4 py-2 rounded-full border border-[#A99BBF]/30 hover:border-[#E98EAF] text-xs uppercase tracking-wider text-[#A99BBF] hover:text-[#F3EAE2] transition-colors focus:outline-none"
            aria-label="Scroll back to top"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Copyright & Cultural Dedication */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-[#A99BBF]/70 pt-6 border-t border-[#A99BBF]/15 gap-4">
          <p className="flex items-center space-x-1.5">
            <span>Crafted with reverence for Indian heritage, art & light.</span>
          </p>
          <div className="flex items-center space-x-2 text-[#FFE29A] font-serif text-sm italic">
            <span>शुभ दीपावली · May light triumph over all darkness</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
