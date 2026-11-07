import React, { useEffect, useState } from 'react';

interface ChapterItem {
  id: string;
  num: string;
  label: string;
}

interface LeftChapterNavProps {
  activeChapter: string;
  onSelectChapter: (id: string) => void;
}

export const LeftChapterNav: React.FC<LeftChapterNavProps> = ({
  activeChapter,
  onSelectChapter,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  const chapters: ChapterItem[] = [
    { id: 'welcome', num: '01', label: 'Welcome' },
    { id: 'across-india', num: '02', label: 'Across India' },
    { id: 'celebration', num: '03', label: 'The Celebration' },
    { id: 'wishes', num: '04', label: 'Wishes' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const progress = Math.min(1, Math.max(0, window.scrollY / totalScroll));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeIndex = chapters.findIndex((c) => c.id === activeChapter);

  return (
    <aside
      aria-label="Chapter Navigation"
      className="fixed left-6 lg:left-10 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col items-start select-none"
    >
      {/* Decorative vertical line container */}
      <div className="relative flex flex-col items-start">
        {/* Background Track Line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-[1.5px] bg-[#A99BBF]/20 rounded-full" />

        {/* Scroll Progress Fill Line */}
        <div
          className="absolute left-[7px] top-2 w-[1.5px] bg-gradient-to-b from-[#E98EAF] via-[#F4C4D2] to-[#FDB863] rounded-full transition-all duration-150 ease-out origin-top"
          style={{ height: `${Math.max(4, scrollProgress * 94)}%` }}
        />

        {/* Chapter Nodes */}
        <nav className="flex flex-col space-y-7 relative z-10">
          {chapters.map((chapter, idx) => {
            const isActive = activeChapter === chapter.id || (activeIndex === -1 && idx === 0);

            return (
              <button
                key={chapter.id}
                onClick={() => onSelectChapter(chapter.id)}
                className="group flex items-center space-x-3.5 text-left focus:outline-none py-1"
                aria-current={isActive ? 'step' : undefined}
              >
                {/* Node Pip / Indicator */}
                <div className="relative flex items-center justify-center w-4 h-4">
                  {/* Outer pulsating ring for active state */}
                  {isActive && (
                    <span className="absolute w-4 h-4 rounded-full border border-[#E98EAF] animate-ping opacity-60" />
                  )}
                  {/* Core Pip */}
                  <span
                    className={`block rounded-full transition-all duration-300 ${
                      isActive
                        ? 'w-2.5 h-2.5 bg-gradient-to-r from-[#E98EAF] to-[#FDB863] shadow-[0_0_10px_#E98EAF]'
                        : 'w-1.5 h-1.5 bg-[#A99BBF]/40 group-hover:bg-[#F3EAE2] group-hover:scale-125'
                    }`}
                  />
                </div>

                {/* Chapter Number & Label */}
                <div className="flex items-center space-x-2 text-[11px] tracking-[0.2em] uppercase transition-all duration-300">
                  <span
                    className={`font-mono transition-colors duration-300 ${
                      isActive
                        ? 'text-[#FDB863] font-medium'
                        : 'text-[#A99BBF]/60 group-hover:text-[#F3EAE2]'
                    }`}
                  >
                    {chapter.num}
                  </span>
                  <span className="text-[#A99BBF]/40">—</span>
                  <span
                    className={`font-sans whitespace-nowrap transition-all duration-300 ${
                      isActive
                        ? 'text-[#F3EAE2] font-medium translate-x-1 opacity-100'
                        : 'text-[#A99BBF]/70 opacity-60 group-hover:opacity-100 group-hover:text-[#F4C4D2] group-hover:translate-x-0.5'
                    }`}
                  >
                    {chapter.label}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

