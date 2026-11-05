import React, { useEffect } from 'react';
import { ArtPiece } from '../../types';
import { X, Sparkles, BookOpen } from 'lucide-react';
import { LotusIcon } from '../UI/LotusIcon';

interface ArtModalProps {
  art: ArtPiece | null;
  onClose: () => void;
}

export const ArtModal: React.FC<ArtModalProps> = ({ art, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (art) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [art, onClose]);

  if (!art) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-[#061116]/90 backdrop-blur-xl animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-[#102C38] to-[#0A1B22] border border-[#E98EAF]/30 rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 text-[#F3EAE2]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full border border-[#A99BBF]/30 hover:border-[#E98EAF] text-[#A99BBF] hover:text-[#F3EAE2] transition-colors focus:outline-none"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Visual Showcase */}
          <div className="relative rounded-xl overflow-hidden shadow-xl border border-[#A99BBF]/20 group">
            <img
              src={art.image}
              alt={art.title}
              className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#061116] via-transparent to-transparent opacity-70" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-[#102C38]/90 border border-[#E98EAF]/40 text-[#F4C4D2]">
                {art.category}
              </span>
            </div>
          </div>

          {/* Detailed Narrative */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <LotusIcon size={20} />
              <span className="text-xs uppercase tracking-[0.25em] text-[#E98EAF]">
                Sacred Tradition
              </span>
            </div>

            <h3 className="font-serif text-3xl sm:text-4xl text-[#F3EAE2]">
              {art.title}
            </h3>
            <p className="font-display italic text-[#FFE29A] text-lg -mt-2">
              {art.subtitle}
            </p>

            <p className="text-sm text-[#F3EAE2]/80 leading-relaxed font-light">
              {art.description}
            </p>

            {/* Historical context callout */}
            <div className="p-4 rounded-xl bg-[#061116]/60 border border-[#A99BBF]/15 space-y-1.5">
              <div className="flex items-center space-x-2 text-xs uppercase tracking-wider text-[#A99BBF]">
                <BookOpen className="w-3.5 h-3.5 text-[#FDB863]" />
                <span>Historical Context</span>
              </div>
              <p className="text-xs text-[#F3EAE2]/75 leading-relaxed">
                {art.historicalContext}
              </p>
            </div>

            {/* Spiritual Significance */}
            <div className="p-4 rounded-xl bg-[#E98EAF]/10 border border-[#E98EAF]/25 space-y-1.5">
              <div className="flex items-center space-x-2 text-xs uppercase tracking-wider text-[#F4C4D2]">
                <Sparkles className="w-3.5 h-3.5 text-[#E98EAF]" />
                <span>Spiritual Significance</span>
              </div>
              <p className="text-xs text-[#F3EAE2]/90 leading-relaxed">
                {art.significance}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {art.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] tracking-wider uppercase px-2.5 py-1 rounded bg-[#101B35] text-[#A99BBF] border border-[#A99BBF]/20"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

