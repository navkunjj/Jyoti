import React from 'react';

interface JharokhaArchProps {
  className?: string;
  children?: React.ReactNode;
}

export const JharokhaArch: React.FC<JharokhaArchProps> = ({
  className = '',
  children
}) => {
  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      {/* Decorative Arch Crest SVG */}
      <svg
        width="140"
        height="28"
        viewBox="0 0 140 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="opacity-70 mb-2"
      >
        <path
          d="M10 26 C30 26 50 14 62 14 C66 14 68 8 70 2 C72 8 74 14 78 14 C90 14 110 26 130 26"
          stroke="#E98EAF"
          strokeWidth="1.5"
          fill="none"
        />
        <circle cx="70" cy="2" r="2.5" fill="#FFE29A" />
        <circle cx="45" cy="20" r="1.5" fill="#A99BBF" />
        <circle cx="95" cy="20" r="1.5" fill="#A99BBF" />
      </svg>
      {children}
    </div>
  );
};

