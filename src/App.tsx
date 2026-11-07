import React, { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { RouterProvider, useRouter } from './router';
import { Navbar } from './components/Navigation/Navbar';
import { LeftChapterNav } from './components/ChapterNav/LeftChapterNav';
import { HeroSection } from './components/Hero/HeroSection';
import { ArtSection } from './components/ArtOfDiwali/ArtSection';
import { HorizontalRegionsSection } from './components/AcrossIndia/HorizontalRegionsSection';
import { CelebrationSection } from './components/Celebration/CelebrationSection';
import { WishesSection } from './components/Wishes/WishesSection';
import { Footer } from './components/Footer/Footer';
import { FireworksCanvas, useScrollFireworks } from './fireworks';

import { ExploreIndiaPage } from './pages/ExploreIndiaPage';
import { RegionalExperiencePage } from './pages/RegionalExperiencePage';

gsap.registerPlugin(ScrollTrigger);

function AppContent() {
  const { pathname, params, navigate } = useRouter();
  const [activeChapter, setActiveChapter] = useState('welcome');
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

    // 2. Set up ScrollTriggers for active chapter tracking on homepage
    if (pathname === '/') {
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
    }

    return () => {
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [pathname]);

  const handleNavigate = (sectionId: string) => {
    if (pathname !== '/') {
      navigate(`/#${sectionId}`);
      return;
    }

    const target = document.getElementById(sectionId);
    if (!target) return;

    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset: 0, duration: 1.4 });
    } else {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Determine view based on route
  const isExploreIndiaMain = pathname === '/explore-india';
  const isRegionalDetail = pathname.startsWith('/explore-india/') && Boolean(params.region);

  return (
    <div className="relative min-h-screen bg-[#061116] text-[#F3EAE2] overflow-x-hidden selection:bg-[#E98EAF]/30 selection:text-[#F3EAE2]">
      {/* Shared Fullscreen Fireworks Canvas */}
      <FireworksCanvas />

      {/* Floating Top Navigation Bar */}
      <Navbar onNavigate={handleNavigate} activeSection={activeChapter} />

      {/* View 1: Explore India Regional Deep Dive (/explore-india/:region) */}
      {isRegionalDetail && (
        <RegionalExperiencePage regionSlug={params.region} />
      )}

      {/* View 2: Explore India Cultural Atlas Main (/explore-india) */}
      {isExploreIndiaMain && (
        <ExploreIndiaPage />
      )}

      {/* View 3: Primary Homepage (/) */}
      {!isExploreIndiaMain && !isRegionalDetail && (
        <>
          {/* Fixed Left Vertical Chapter Navigation */}
          <LeftChapterNav
            activeChapter={activeChapter}
            onSelectChapter={handleNavigate}
          />

          <main>
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
        </>
      )}

      {/* Graceful Global Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export function App() {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  );
}

export default App;
