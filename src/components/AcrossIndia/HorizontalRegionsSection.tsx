import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RegionalCelebration } from '../../types';

gsap.registerPlugin(ScrollTrigger);

export const HorizontalRegionsSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<(HTMLElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const regions: RegionalCelebration[] = [
    {
      id: 'ayodhya',
      name: 'Ayodhya',
      title: "The Grand Deepotsav & Lord Rama's Return",
      location: 'Uttar Pradesh · Banks of Sarayu',
      era: 'Ancient Epic Tradition',
      description:
        'The historic cradle where the Diwali tradition began. Millions of earthen lamps line the stone ghats of the Sarayu river in unison, commemorating the return of Lord Rama, Sita, and Lakshmana to their ancestral kingdom after fourteen years in exile.',
      tradition:
        'Citizens illuminated every terrace with ghee-filled lamps so the royal chariot could be guided home under the moonless night.',
      quote: '“And Ayodhya wept with joy, every clay flame a beacon of righteous return.”',
      quoteSource: 'Ramacharitmanas lore',
      image: '/assets/ayodhya-deepotsav.jpg',
      highlights: ['2.2 Million Earthen Diyas', 'Sarayu River Maha Aarti', 'Deepotsav Festivities'],
      motif: 'Lotus & Arch',
    },
    {
      id: 'varanasi',
      name: 'Varanasi',
      title: 'Dev Deepawali — The Night of the Gods',
      location: 'Kashi · 84 Ghats of Ganga',
      era: 'Kartik Purnima Festival',
      description:
        'On the sacred stepped ghats of Varanasi, fifteen days after Diwali, the gods are believed to descend from the heavens to bathe in the holy waters. All 84 ghats glow with hundreds of thousands of earthen lamps while colossal multi-tiered brass aartis twirl before the eternal river.',
      tradition:
        'Priests in gold-embroidered dhotis chant Vedic hymns in deep baritone, sending floating leaf-diyas drifting downriver into the twilight.',
      quote: '“The river reflects not merely the night, but the stars the heavens lent to the earth.”',
      quoteSource: 'Kashi Khanda',
      image: '/assets/varanasi-ghats.jpg',
      highlights: ['84 Crescent Ghats Aglow', 'Dashashwamedh Brass Aarti', 'Sacred Conch Resonance'],
      motif: 'Crescent Moon & River',
    },
    {
      id: 'bengal',
      name: 'West Bengal',
      title: 'Shyama Puja — Invocation of Maa Kali',
      location: 'Kolkata & Rural Bengal',
      era: 'Midnight Devotion',
      description:
        'While much of India prays to Lakshmi for fortune, Bengal honors Maa Kali — the cosmic mother of fierce love and transformation. Performed during the deepest hour of the new moon night, the worship invokes inner fearlessness, truth, and the destruction of darkness.',
      tradition:
        'Shrines are adorned with garlands of 108 crimson hibiscus flowers, sweet offerings of Sondesh, and the rhythmic beat of sacred Dhaak drums.',
      quote: '“In the darkest hour, the Mother dissolves the veil of illusion with her radiant sword.”',
      quoteSource: 'Ramprasad Sen Hymns',
      image: '/assets/bengal-kali-puja.jpg',
      highlights: ['108 Crimson Hibiscus Garlands', 'Rhythmic Dhaak Drumming', 'Midnight Devotion'],
      motif: 'Hibiscus & Sacred Flame',
    },
    {
      id: 'south-india',
      name: 'South India',
      title: 'Naraka Chaturdashi & Dawn Ganga Snanam',
      location: 'Tamil Nadu & Karnataka',
      era: 'Brahma Muhurta Ritual',
      description:
        'In the southern states, Diwali dawns before sunrise. Families awake during Brahma Muhurta for Ganga Snanam — a ritual herbal oil bath symbolizing the cleansing of ego and renewed vitality, followed by silk attire and fragrant homemade sweets.',
      tradition:
        'Thresholds are inscribed with intricate rice flour kolams bordered in red brick-powder (Kaavi), and medicinal Deepavali Legiyam is consumed for digestive wellbeing.',
      quote: '“Bathe in the sacred oil before dawn, and greet the new year purified of darkness.”',
      quoteSource: 'Skanda Purana',
      image: '/assets/south-india-kolam.jpg',
      highlights: ['Auspicious Ganga Snanam', 'Kaavi & Kolam Mandalas', 'Deepavali Legiyam'],
      motif: 'Kolam Geometry',
    },
  ];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean) as HTMLElement[];
      const totalCards = cards.length;
      if (totalCards <= 1) return;

      if (!prefersReducedMotion) {
        // Total pinned scroll distance: page stays stuck while user scrubs through cards
        const scrollDistance = totalCards * window.innerHeight * 1.05;

        // Master 3D Scrub Timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            id: 'across-india-3d-deck',
            trigger: container,
            start: 'top top',
            end: () => `+=${scrollDistance}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const raw = self.progress * totalCards;
              const idx = Math.min(totalCards - 1, Math.floor(raw));
              setActiveIndex(idx);
            },
          },
        });

        // 3D Corner Entry Coordinates:
        // Cards enter from the corner: small (scale: 0.35), faded (opacity: 0), blurred, rotated in 3D perspective
        // They fly into the exact MIDDLE: scale: 1, opacity: 1, unblurred, fully focused and readable
        // Then exit towards the opposite corner as the next card swoops in.
        const cornerConfigs = [
          // Card 0: Starts in middle
          { enterX: 0, enterY: 0, enterRotY: 0, exitX: 42, exitY: -35, exitRotY: -20 },
          // Card 1: Enters from bottom-left corner, exits to top-right
          { enterX: -42, enterY: 35, enterRotY: 22, exitX: 42, exitY: -35, exitRotY: -20 },
          // Card 2: Enters from bottom-right corner, exits to top-left
          { enterX: 42, enterY: 35, enterRotY: -22, exitX: -42, exitY: -35, exitRotY: 20 },
          // Card 3: Enters from bottom-left corner, rests in middle
          { enterX: -42, enterY: 35, enterRotY: 22, exitX: 0, exitY: 0, exitRotY: 0 },
        ];

        // 1. Initial State for all cards
        cards.forEach((card, i) => {
          if (i === 0) {
            // Card 0 starts perfectly focused in the middle
            gsap.set(card, {
              xPercent: 0,
              yPercent: 0,
              scale: 1,
              opacity: 1,
              rotateY: 0,
              rotateX: 0,
              rotateZ: 0,
              filter: 'blur(0px) brightness(1)',
              zIndex: 20,
            });
          } else {
            // Subsequent cards wait in their respective corner: small, faded, rotated in 3D
            const cfg = cornerConfigs[i];
            gsap.set(card, {
              xPercent: cfg.enterX,
              yPercent: cfg.enterY,
              scale: 0.32,
              opacity: 0,
              rotateY: cfg.enterRotY,
              rotateX: 12,
              rotateZ: cfg.enterRotY > 0 ? -6 : 6,
              filter: 'blur(8px) brightness(0.3)',
              zIndex: 10 + i,
            });
          }
        });

        // 2. Build Choreographed Transitions
        // Each card holds focus in the middle, then transitions
        for (let i = 0; i < totalCards - 1; i++) {
          const currentCard = cards[i];
          const nextCard = cards[i + 1];
          const currentCfg = cornerConfigs[i];
          const nextCfg = cornerConfigs[i + 1];

          const transitionLabel = `trans-${i}`;

          // A. Hold period where current card remains stationary and focused in middle
          tl.to(currentCard, { duration: 0.5 });

          // B. Current card flies away into the opposite corner (faded, small, rotated)
          tl.to(
            currentCard,
            {
              xPercent: currentCfg.exitX,
              yPercent: currentCfg.exitY,
              scale: 0.32,
              opacity: 0,
              rotateY: currentCfg.exitRotY,
              rotateX: -12,
              rotateZ: currentCfg.exitRotY > 0 ? 6 : -6,
              filter: 'blur(8px) brightness(0.3)',
              ease: 'power2.inOut',
              duration: 1.2,
              zIndex: 10 + i,
            },
            transitionLabel
          );

          // C. Next card swoops in from the corner directly into the MIDDLE
          tl.to(
            nextCard,
            {
              xPercent: 0,
              yPercent: 0,
              scale: 1,
              opacity: 1,
              rotateY: 0,
              rotateX: 0,
              rotateZ: 0,
              filter: 'blur(0px) brightness(1)',
              ease: 'power2.inOut',
              duration: 1.2,
              zIndex: 30 + i,
            },
            transitionLabel
          );
        }

        // Final hold for the last card so it stays focused in the middle before unpinning
        tl.to(cards[totalCards - 1], { duration: 0.7 });
      } else {
        // Fallback for reduced motion: clean sequential display
        cards.forEach((card) => {
          gsap.set(card, { opacity: 1, scale: 1, xPercent: 0, yPercent: 0 });
        });
      }
    }, container);

    return () => ctx.revert();
  }, [regions.length]);

  const handleSelectRegion = (index: number) => {
    setActiveIndex(index);
    const container = containerRef.current;
    if (!container) return;

    const st = ScrollTrigger.getById('across-india-3d-deck');
    if (st) {
      // Calculate target progress where this card is fully focused in the middle
      const targetProgress = index / (regions.length - 1);
      const targetScroll = st.start + targetProgress * (st.end - st.start) * 0.92;
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      id="across-india"
      ref={containerRef}
      className="relative w-full bg-[#061116] text-[#F3EAE2] overflow-hidden select-none min-h-screen py-12 md:py-6 flex flex-col justify-center"
      aria-label="Chapter 03 Traditions Across India"
    >
      {/* Background Subtle Atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-gradient-to-tr from-[#E98EAF]/10 via-[#FFE29A]/5 to-transparent blur-3xl pointer-events-none" />

      {/* Decorative 3D Corner Ambient Flares */}
      <div className="absolute bottom-8 left-8 w-44 h-44 rounded-full bg-[#E98EAF]/10 blur-2xl pointer-events-none" />
      <div className="absolute top-12 right-8 w-44 h-44 rounded-full bg-[#FFE29A]/10 blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full px-6 sm:px-12 relative z-10 flex flex-col h-full justify-between">
        {/* Editorial Section Header */}
        <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-end justify-between border-b border-[#A99BBF]/15 pb-5 gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="w-6 h-[1px] bg-[#E98EAF]" />
              <span className="text-[11px] uppercase tracking-[0.32em] text-[#E98EAF] font-medium">
                Chapter 03 · Sacred Traditions
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#F3EAE2] font-normal leading-tight">
              Traditions Across India
            </h2>
          </div>

          {/* Quick Region Switcher / Story Indicator */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {regions.map((region, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={region.id}
                  onClick={() => handleSelectRegion(idx)}
                  className={`px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider font-sans transition-all duration-300 focus:outline-none ${
                    isActive
                      ? 'bg-white/15 text-white border border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                      : 'text-white/60 hover:text-white border border-transparent hover:border-white/20'
                  }`}
                  aria-label={`Jump to ${region.name}`}
                >
                  <span className="text-[10px] text-[#FFE29A] mr-1.5 font-mono">0{idx + 1}.</span>
                  {region.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3D Perspective Stage Container */}
        {/* The stage holds all cards at the center; GSAP swoops each card from the corner into the middle */}
        <div
          ref={stageRef}
          className="relative w-full max-w-5xl mx-auto h-[600px] sm:h-[640px] md:h-[580px] flex items-center justify-center"
          style={{ perspective: '1400px', transformStyle: 'preserve-3d' }}
        >
          {regions.map((region, idx) => (
            <article
              key={region.id}
              ref={(el) => (cardsRef.current[idx] = el)}
              className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden border border-[#A99BBF]/25 bg-[#0A1B22]/95 backdrop-blur-xl shadow-[0_25px_70px_rgba(0,0,0,0.9)] flex flex-col lg:flex-row transform-gpu origin-center will-change-transform transition-shadow duration-500 hover:border-[#FFE29A]/40"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Left Column: Authentic Heritage Photography */}
              <div
                className="relative w-full lg:w-[48%] h-64 sm:h-72 lg:h-full overflow-hidden flex-shrink-0"
                style={{ transform: 'translateZ(25px)' }}
              >
                <img
                  src={region.image}
                  alt={region.title}
                  className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0A1B22]/95 via-[#0A1B22]/20 to-transparent pointer-events-none" />

                {/* Region Badge Pill */}
                <div className="absolute top-5 left-5 px-3 py-1 rounded-full bg-[#061116]/80 backdrop-blur-md border border-white/20 text-[10px] uppercase tracking-[0.22em] text-white/90">
                  {region.era}
                </div>
              </div>

              {/* Right Column: Narrative Lore & Cultural Significance */}
              <div
                className="w-full lg:w-[52%] p-6 sm:p-8 lg:p-10 flex flex-col justify-between overflow-y-auto space-y-4"
                style={{ transform: 'translateZ(18px)' }}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-[0.25em] text-[#E98EAF] font-medium">
                      {region.location}
                    </span>
                    <span className="text-[11px] font-mono text-white/40 tracking-widest">
                      0{idx + 1} / 0{regions.length}
                    </span>
                  </div>

                  <h3 className="font-serif text-3xl sm:text-4xl text-[#F3EAE2] font-normal leading-tight">
                    {region.name}
                  </h3>

                  <h4 className="font-display italic text-base sm:text-lg text-[#FFE29A] font-light">
                    {region.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-[#F3EAE2]/85 leading-relaxed font-light pt-1">
                    {region.description}
                  </p>

                  {/* Sacred Scripture / Lore Quote */}
                  <blockquote className="pt-3 border-l-2 border-[#E98EAF]/60 pl-3.5 my-2 text-xs text-[#FFE29A]/90 italic font-serif leading-relaxed">
                    {region.quote}
                    <cite className="block text-[10px] font-sans not-italic text-white/50 mt-1 uppercase tracking-wider">
                      — {region.quoteSource}
                    </cite>
                  </blockquote>
                </div>

                {/* Cultural Highlights */}
                <div className="pt-3 border-t border-[#A99BBF]/15 text-xs text-white/70 flex flex-wrap gap-x-4 gap-y-1.5">
                  {region.highlights.map((h, i) => (
                    <span key={i} className="flex items-center space-x-1.5">
                      <span className="text-[#FFE29A]">•</span>
                      <span className="text-white/80 font-light">{h}</span>
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
