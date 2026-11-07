import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RegionalCelebration } from '../../types';

gsap.registerPlugin(ScrollTrigger);

export const HorizontalRegionsSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
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

    const isDesktop = window.innerWidth >= 768;

    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean) as HTMLElement[];
      const totalCards = cards.length;
      if (totalCards <= 1) return;

      if (isDesktop && !prefersReducedMotion) {
        // Desktop Experience: Pinned 3D Parallax Stacking Cards
        // Card 0 starts in place. Each subsequent card rises from yPercent: 110 and stacks over previous card.
        const scrollDistance = (totalCards - 1) * window.innerHeight * 0.9;

        const tl = gsap.timeline({
          scrollTrigger: {
            id: 'across-india-deck',
            trigger: container,
            start: 'top top',
            end: () => `+=${scrollDistance}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const raw = self.progress * (totalCards - 1);
              const idx = Math.min(totalCards - 1, Math.round(raw));
              setActiveIndex(idx);
            },
          },
        });

        // Initialize positions: card 0 rests; cards 1..N-1 are positioned below
        cards.forEach((card, i) => {
          if (i > 0) {
            gsap.set(card, { yPercent: 115, scale: 1, opacity: 0.9 });
          }
        });

        for (let i = 1; i < totalCards; i++) {
          const currentCard = cards[i];
          const prevCard = cards[i - 1];

          // Current card rises up to overlap previous card
          tl.to(
            currentCard,
            {
              yPercent: 0,
              opacity: 1,
              ease: 'power2.inOut',
              duration: 1.2,
            },
            `step-${i}`
          );

          // Previous card gently scales down and dims into the background stack
          tl.to(
            prevCard,
            {
              scale: 0.94,
              filter: 'brightness(0.35) blur(1.5px)',
              ease: 'power2.inOut',
              duration: 1.2,
            },
            `step-${i}`
          );
        }
      } else {
        // Mobile / Reduced Motion: Fluid vertical entrance reveals for each card
        cards.forEach((card) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        });
      }
    }, container);

    return () => ctx.revert();
  }, [regions.length]);

  const handleSelectRegion = (index: number) => {
    setActiveIndex(index);
    const container = containerRef.current;
    if (!container) return;

    const st = ScrollTrigger.getById('across-india-deck');
    if (st) {
      const targetProgress = index / (regions.length - 1);
      const targetScroll = st.start + targetProgress * (st.end - st.start);
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth',
      });
    } else {
      const targetCard = cardsRef.current[index];
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <section
      id="across-india"
      ref={containerRef}
      className="relative w-full bg-[#061116] text-[#F3EAE2] overflow-hidden select-none min-h-screen py-16 md:py-8 flex flex-col justify-center"
      aria-label="Chapter 02 Traditions Across India"
    >
      {/* Background Subtle Atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-[#E98EAF]/10 via-[#FFE29A]/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full px-6 sm:px-12 relative z-10 flex flex-col h-full justify-between">
        {/* Editorial Section Header */}
        <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-end justify-between border-b border-[#A99BBF]/15 pb-5 gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="w-6 h-[1px] bg-[#E98EAF]" />
              <span className="text-[11px] uppercase tracking-[0.32em] text-[#E98EAF] font-medium">
                Chapter 02 · Sacred Traditions
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

        {/* Card Deck Container */}
        {/* On desktop: fixed-height stacking stage where cards overlap via GSAP scrub */}
        {/* On mobile: standard vertical flow of cards */}
        <div className="relative w-full max-w-5xl mx-auto min-h-[580px] md:h-[580px] lg:h-[580px]">
          {regions.map((region, idx) => (
            <article
              key={region.id}
              ref={(el) => (cardsRef.current[idx] = el)}
              style={{ zIndex: 10 + idx }}
              className="w-full h-full md:absolute md:inset-0 mb-8 md:mb-0 rounded-3xl overflow-hidden border border-[#A99BBF]/20 bg-[#0A1B22]/95 backdrop-blur-md shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col lg:flex-row transition-shadow duration-500 hover:border-[#FFE29A]/30"
            >
              {/* Left Column: Authentic Heritage Photography */}
              <div className="relative w-full lg:w-[48%] h-64 sm:h-72 lg:h-full overflow-hidden flex-shrink-0">
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
              <div className="w-full lg:w-[52%] p-6 sm:p-8 lg:p-10 flex flex-col justify-between overflow-y-auto space-y-4">
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
