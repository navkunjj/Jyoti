import React from 'react';

interface GreetingCardPreviewProps {
  to: string;
  message: string;
  from: string;
  className?: string;
}

export const GreetingCardPreview: React.FC<GreetingCardPreviewProps> = ({
  to,
  message,
  from,
  className = '',
}) => {
  const displayTo = to.trim();
  const defaultWish =
    'May this Diwali bring happiness, good health, prosperity, and new beginnings into your life.';
  const displayMessage = message.trim();
  const hasCustomMessage = displayMessage && displayMessage !== defaultWish;
  const displayFrom = from.trim();

  // Responsive font scaling for names based on length
  const getToFontSizeClass = (len: number) => {
    if (len <= 8) return 'text-[clamp(16px,4.4cqw,34px)]';
    if (len <= 14) return 'text-[clamp(14px,3.6cqw,28px)]';
    return 'text-[clamp(12px,2.8cqw,22px)]';
  };

  const getFromFontSizeClass = (len: number) => {
    if (len <= 8) return 'text-[clamp(16px,4.4cqw,34px)]';
    if (len <= 14) return 'text-[clamp(14px,3.6cqw,28px)]';
    return 'text-[clamp(12px,2.8cqw,22px)]';
  };

  // Responsive font scaling for message based on length
  const getMessageFontSizeClass = (len: number) => {
    if (len <= 90) return 'text-[clamp(11px,2.6cqw,18px)] leading-relaxed';
    if (len <= 160) return 'text-[clamp(10px,2.2cqw,16px)] leading-relaxed';
    if (len <= 240) return 'text-[clamp(9px,1.9cqw,14px)] leading-snug';
    return 'text-[clamp(8.5px,1.6cqw,12px)] leading-tight';
  };

  return (
    <div
      className={`relative aspect-square w-full rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.65)] border border-[#E98EAF]/25 bg-[#FAF4E8] select-none ${className}`}
      style={{ containerType: 'inline-size' }}
    >
      {/* 1. High-Res Base Card Image (Diya, Golden Waves, Mandalas, Frame, Happy Diwali Calligraphy) */}
      <img
        src="/assets/diwali-card-base-1080.jpg"
        alt="Diwali Greeting Card"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none z-0"
        loading="eager"
        draggable={false}
      />

      {/* 2. Dynamic 'To' Recipient Name (Rendered only when user has typed a name) */}
      {/* Centered inside To cartouche at x: ~63.9%, y: ~26.4% */}
      {displayTo && (
        <div
          className="absolute flex items-center justify-center pointer-events-none z-10"
          style={{
            left: '63.9%',
            top: '26.4%',
            transform: 'translate(-50%, -50%)',
            width: '26%',
            height: '7%',
          }}
        >
          <span
            className={`font-serif italic font-semibold text-[#2A1618] text-center truncate max-w-full antialiased ${getToFontSizeClass(
              displayTo.length
            )}`}
            style={{
              fontFamily: '"Playfair Display", "Cormorant Garamond", Georgia, serif',
              textRendering: 'optimizeLegibility',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
            }}
          >
            {displayTo}
          </span>
        </div>
      )}

      {/* 3. Dynamic Custom Wish Message (Only rendered if user customized from base artwork text) */}
      {/* Centered between lotus ornament and diamond divider at x: ~66.8%, y: ~58.2% */}
      {hasCustomMessage && (
        <div
          className="absolute flex items-center justify-center pointer-events-none z-10 px-2 py-1 bg-[#FAF4E8]/95 backdrop-blur-[1px] rounded-lg"
          style={{
            left: '66.8%',
            top: '58.2%',
            transform: 'translate(-50%, -50%)',
            width: '44%',
            maxHeight: '18%',
          }}
        >
          <p
            className={`font-serif italic font-normal text-[#3A2A2E] text-center line-clamp-4 antialiased ${getMessageFontSizeClass(
              displayMessage.length
            )}`}
            style={{
              fontFamily: '"Playfair Display", "Cormorant Garamond", Georgia, serif',
              textRendering: 'optimizeLegibility',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
            }}
          >
            {displayMessage}
          </p>
        </div>
      )}

      {/* 4. Dynamic 'From' Sender Name (Rendered only when user has typed a name) */}
      {/* Centered inside From cartouche at x: ~69.6%, y: ~78.0% */}
      {displayFrom && (
        <div
          className="absolute flex items-center justify-center pointer-events-none z-10"
          style={{
            left: '69.6%',
            top: '78.0%',
            transform: 'translate(-50%, -50%)',
            width: '24%',
            height: '7%',
          }}
        >
          <span
            className={`font-serif italic font-semibold text-[#2A1618] text-center truncate max-w-full antialiased ${getFromFontSizeClass(
              displayFrom.length
            )}`}
            style={{
              fontFamily: '"Playfair Display", "Cormorant Garamond", Georgia, serif',
              textRendering: 'optimizeLegibility',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
            }}
          >
            {displayFrom}
          </span>
        </div>
      )}
    </div>
  );
};

