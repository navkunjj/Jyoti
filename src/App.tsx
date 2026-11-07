import React, { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Navbar } from './components/Navigation/Navbar';
import { LeftChapterNav } from './components/ChapterNav/LeftChapterNav';
import { HeroSection } from './components/Hero/HeroSection';
import { ArtSection } from './components/ArtOfDiwali/ArtSection';
import { HorizontalRegionsSection } from './components/AcrossIndia/HorizontalRegionsSection';
import { CelebrationSection } from './components/Celebration/CelebrationSection';
import { WishesSection } from './components/Wishes/WishesSection';
import { Footer } from './components/Footer/Footer';
import { FireworksCanvas, useScrollFireworks } from './fireworks';
import { GlobalBackground } from './effects/background';

gsap.registerPlugin(ScrollTrigger);

export function App() {
  const [activeChapter, setActiveChapter] = useState('welcome');
  const [footerHeight, setFooterHeight] = useState<number>(0);
  const lenisRef = useRef<Lenis | null>(null);

  // Initialize automated direction-aware scroll fireworks
  useScrollFireworks();

  useEffect(() => {
    // 1. Initialize Lenis Smooth Scrolling
    const lenis = new Lenis({
      duration: 1.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    // 2. Set up ScrollTriggers for active chapter tracking
    const sections = ['welcome', 'art', 'across-india', 'celebration', 'wishes'];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      ScrollTrigger.create({
        trigger: el,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => setActiveChapter(id),
        onEnterBack: () => setActiveChapter(id),
      });
    });

    // Ensure all ScrollTrigger offsets are refreshed with Lenis
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      clearTimeout(refreshTimer);
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const handleNavigate = (sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (!target) return;

    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset: 0, duration: 1.4 });
    } else {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#061116] text-[#F3EAE2] overflow-x-hidden selection:bg-[#E98EAF]/30 selection:text-[#F3EAE2]">
      {/* 0. Continuous Scroll-Reactive Abstract Background System */}
      <GlobalBackground activeSection={activeChapter} />

      {/* Shared Fullscreen Fireworks Canvas (Automatic scroll-driven, pointer-events: none) */}
      <FireworksCanvas />

      {/* 1. Floating Top Navigation Bar */}
      <Navbar onNavigate={handleNavigate} activeSection={activeChapter} />

      {/* 2. Fixed Left Vertical Chapter Navigation */}
      <LeftChapterNav
        activeChapter={activeChapter}
        onSelectChapter={handleNavigate}
      />

      {/* 3. Main Storytelling Chapters (The Page that slides up) */}
      <main className="relative z-10 bg-[#061116]/80 shadow-[0_35px_90px_rgba(0,0,0,0.98)] border-b border-white/10">
        {/* Chapter 01 — Welcome Hero */}
        <HeroSection onBeginJourney={() => handleNavigate('art')} />

        {/* Chapter 02 — The Art of Diwali */}
        <ArtSection />

        {/* Chapter 03 — Diwali Across India (Pinned Horizontal Scroll) */}
        <HorizontalRegionsSection />

        {/* Chapter 04 — The Celebration (Emotions & Rituals) */}
        <CelebrationSection />

        {/* Chapter 05 — Send Wishes & Interactive Diya */}
        <WishesSection />
      </main>

      {/* Spacer that allows the page to slide up and reveal the stuck footer */}
      <div
        style={{ height: footerHeight ? `${footerHeight}px` : '220px' }}
        className="w-full pointer-events-none"
        aria-hidden="true"
      />

      {/* 4. Stuck Footer (Fixed at the bottom underneath the sliding page) */}
      <Footer onNavigate={handleNavigate} onHeightChange={setFooterHeight} />
    </div>
  );
}

export default App;
