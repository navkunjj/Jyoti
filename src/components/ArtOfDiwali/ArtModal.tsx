import React, { useEffect } from 'react';
import { ArtPiece } from '../../types';
import { X } from 'lucide-react';

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
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0A1B22] border border-[#A99BBF]/20 rounded-2xl shadow-2xl p-6 sm:p-10 text-[#F3EAE2]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#A99BBF] hover:text-[#F3EAE2] transition-colors focus:outline-none"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Visual Showcase: Clean Framing without stickers */}
          <div className="relative rounded-xl overflow-hidden shadow-lg border border-[#A99BBF]/15">
            <img
              src={art.image}
              alt={art.title}
              className="w-full h-80 sm:h-96 object-cover object-center"
            />
          </div>

          {/* Editorial Narrative */}
          <div className="flex flex-col space-y-4">
            <span className="text-xs uppercase tracking-[0.3em] text-[#E98EAF] font-medium">
              {art.category}
            </span>

            <h3 className="font-serif text-3xl sm:text-4xl text-[#F3EAE2] font-normal leading-tight">
              {art.title}
            </h3>
            <p className="font-display italic text-[#FFE29A] text-lg -mt-2 font-light">
              {art.subtitle}
            </p>

            <p className="text-sm text-[#F3EAE2]/80 leading-relaxed font-light pt-1">
              {art.description}
            </p>

            {/* Historical Heritage Context */}
            <div className="pt-3 border-t border-[#A99BBF]/15 space-y-1">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#A99BBF] font-medium block">
                Historical Heritage
              </span>
              <p className="text-xs text-[#F3EAE2]/75 leading-relaxed font-light">
                {art.historicalContext}
              </p>
            </div>

            {/* Spiritual Significance */}
            <div className="pt-2 border-t border-[#A99BBF]/15 space-y-1">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#E98EAF] font-medium block">
                Sacred Significance
              </span>
              <p className="text-xs text-[#F4C4D2]/85 leading-relaxed font-light">
                {art.significance}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
