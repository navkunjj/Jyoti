import React, { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Navbar } from './components/Navigation/Navbar';
import { LeftChapterNav } from './components/ChapterNav/LeftChapterNav';
import { HeroSection } from './components/Hero/HeroSection';
import { CelebrationSection } from './components/Celebration/CelebrationSection';
import { WishesSection } from './components/Wishes/WishesSection';
import { LightTheWorldPage } from './components/LightTheWorld/LightTheWorldPage';
import { LightTheWorldBackground } from './components/LightTheWorld/LightTheWorldBackground';
import { PersistentUserDiya } from './components/UI/PersistentUserDiya';
import { Footer } from './components/Footer/Footer';
import { FireworksCanvas, useScrollFireworks } from './fireworks';
import { GlobalTwinklingLights } from './components/TwinklingLights/GlobalTwinklingLights';

gsap.registerPlugin(ScrollTrigger);

export function App() {
  const [currentPath, setCurrentPath] = useState<string>(() =>
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );
  const [activeChapter, setActiveChapter] = useState('welcome');
  const [footerHeight, setFooterHeight] = useState<number>(0);
  const lenisRef = useRef<Lenis | null>(null);

  // Initialize automated direction-aware scroll fireworks on homepage
  useScrollFireworks();

  // Listen to browser Back/Forward popstate
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Homepage-specific Lenis and ScrollTrigger lifecycle
  useEffect(() => {
    if (currentPath !== '/') {
      // Destroy any lingering Lenis or ScrollTriggers when not on homepage
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      ScrollTrigger.getAll().forEach((t) => t.kill());
      return;
    }

    // 0. Ensure manual scroll restoration & always start at home page on reload
    ScrollTrigger.clearScrollMemory('manual');
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });

    // 1. Initialize Lenis Smooth Scrolling for Homepage
    const lenis = new Lenis({
      duration: 1.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    // Reset Lenis to top immediately
    lenis.scrollTo(0, { immediate: true });

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    const handleBeforeUnload = () => {
      window.scrollTo(0, 0);
    };

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        window.scrollTo(0, 0);
        lenis.scrollTo(0, { immediate: true });
        setActiveChapter('welcome');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pageshow', handlePageShow);

    // 2. Set up ScrollTriggers for active chapter tracking
    const sections = ['welcome', 'celebration', 'wishes'];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      ScrollTrigger.create({
        trigger: el,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => setActiveChapter(id),
        onEnterBack: () => setActiveChapter(id),
        onLeaveBack: () => {
          if (id === 'celebration') {
            setActiveChapter('welcome');
          } else if (id === 'wishes') {
            setActiveChapter('celebration');
          }
        },
      });
    });

    // Ensure all ScrollTrigger offsets are refreshed with Lenis
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      clearTimeout(refreshTimer);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pageshow', handlePageShow);
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [currentPath]);

  const handleNavigate = (destination: string) => {
    if (destination === 'light-the-world') {
      window.history.pushState({}, '', '/light-the-world');
      setCurrentPath('/light-the-world');
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      return;
    }

    // Navigating back to homepage from another route
    if (currentPath !== '/') {
      window.history.pushState({}, '', '/');
      setCurrentPath('/');
      setTimeout(() => {
        const target = document.getElementById(destination);
        if (target) {
          if (lenisRef.current) {
            lenisRef.current.scrollTo(target, { offset: 0, duration: 1.4 });
          } else {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 150);
      return;
    }

    const target = document.getElementById(destination);
    if (!target) return;

    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset: 0, duration: 1.4 });
    } else {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isLightTheWorld = currentPath === '/light-the-world';

  return (
    <div className="relative min-h-screen bg-[#061116] text-[#F3EAE2] overflow-x-hidden selection:bg-[#E98EAF]/30 selection:text-[#F3EAE2]">
      {/* Background Layers */}
      {isLightTheWorld ? (
        /* Fixed Riverside Diwali Background with Continuous Sky Fireworks Layer */
        <LightTheWorldBackground />
      ) : (
        /* Dedicated Global Fixed Twinkling Lights & Fireworks Canvas for Homepage */
        <>
          <GlobalTwinklingLights />
          <FireworksCanvas />
        </>
      )}

      {/* Floating Glowing Diya Badge at Bottom-Right — Visible across all pages once lit */}
      <PersistentUserDiya />

      {/* 1. Floating Top Navigation Bar */}
      <Navbar
        onNavigate={handleNavigate}
        activeSection={isLightTheWorld ? 'light-the-world' : activeChapter}
      />

      {isLightTheWorld ? (
        /* Standalone "Light the World" Page */
        <div className="relative z-10 flex flex-col min-h-screen bg-transparent">
          <main className="flex-1">
            <LightTheWorldPage onNavigateHome={() => handleNavigate('welcome')} />
          </main>
          <Footer onNavigate={handleNavigate} isFixed={false} />
        </div>
      ) : (
        /* Original Homepage Experience */
        <>
          {/* 2. Fixed Left Vertical Chapter Navigation */}
          <LeftChapterNav
            activeChapter={activeChapter}
            onSelectChapter={handleNavigate}
          />

          {/* 3. Main Storytelling Chapters (The Page that slides up) */}
          <main className="relative z-10 shadow-[0_35px_90px_rgba(0,0,0,0.98)] border-b border-white/10">
            {/* Chapter 01 — Welcome Hero */}
            <HeroSection onBeginJourney={() => handleNavigate('celebration')} />

            {/* Chapter 02 — Stories & Sacred Rituals */}
            <CelebrationSection />

            {/* Chapter 03 — Send Wishes & Blessings */}
            <WishesSection />
          </main>

          {/* Spacer that allows the page to slide up and reveal the stuck footer */}
          <div
            style={{ height: footerHeight ? `${footerHeight}px` : '220px' }}
            className="w-full pointer-events-none"
            aria-hidden="true"
          />

          {/* 4. Stuck Footer (Fixed at the bottom underneath the sliding page) */}
          <Footer onNavigate={handleNavigate} onHeightChange={setFooterHeight} isFixed={true} />
        </>
      )}
    </div>
  );
}

export default App;
