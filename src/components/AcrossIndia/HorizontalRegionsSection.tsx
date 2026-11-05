import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RegionalCelebration } from '../../types';
import { LotusIcon } from '../UI/LotusIcon';
import { MapPin, Calendar, Sparkles, Compass } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const HorizontalRegionsSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const regions: RegionalCelebration[] = [
    {
      id: 'ayodhya',
      name: 'Ayodhya',
      title: "The Grand Deepotsav & Lord Rama's Return",
      location: 'Uttar Pradesh — Banks of Sarayu',
      era: 'Ancient Epic Tradition',
      description:
        'The historic cradle where the Diwali legend ignited. Over two million clay lamps illuminate the stone ghats of the Sarayu river in unison, commemorating Lord Rama, Sita, and Lakshmana returning to their kingdom after fourteen years of exile.',
      tradition:
        'Citizens illuminated every terrace with ghee-filled lamps so the royal chariot could be guided home under the moonless night.',
      quote: '“And Ayodhya wept with joy, every clay flame a beacon of righteous return.”',
      quoteSource: 'Ramacharitmanas lore',
      image: '/assets/ayodhya-deepotsav.jpg',
      highlights: ['2.2+ Million Earthen Diyas', 'Sarayu River Maha Aarti', 'Ayodhya Deepotsav'],
      motif: 'Lotus & Arch',
    },
    {
      id: 'varanasi',
      name: 'Varanasi',
      title: 'Dev Deepawali — The Night of the Gods',
      location: 'Kashi — 84 Ghats of Ganga',
      era: 'Kartik Purnima Festival',
      description:
        'On the sacred stepped ghats of Varanasi, fifteen days after Diwali, the gods are believed to descend from heaven to bathe in the Ganga. All 84 ghats glow with hundreds of thousands of earthen lamps while colossal multi-tiered brass aartis twirl before the eternal river.',
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
      era: 'Midnight Tantric Rites',
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
      location: 'Tamil Nadu, Karnataka, Andhra & Kerala',
      era: 'Brahma Muhurta Ritual',
      description:
        'In the southern states, Diwali dawns before sunrise. Families awake during Brahma Muhurta for Ganga Snanam — a ritual herbal oil bath symbolizing the washing away of ego, sins, and lethargy, followed by fresh silk attire and fragrant homemade sweets.',
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
    // Only run pinned horizontal scroll on viewports wider than 768px
    const isDesktop = window.innerWidth >= 768;
    if (!isDesktop || !containerRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      if (!track) return;

      const totalPanels = regions.length;
      const getScrollDistance = () => track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: () => -getScrollDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1.1,
          start: 'top top',
          end: () => `+=${getScrollDistance()}`,
          invalidateOnRefresh: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [regions.length]);

  return (
    <section
      id="across-india"
      ref={containerRef}
      className="relative w-full bg-[#061116] overflow-hidden select-none"
      aria-label="Chapter 03 Diwali Across India"
    >
      {/* Intro Header for Section */}
      <div className="pt-20 pb-8 px-6 sm:px-12 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between border-b border-[#A99BBF]/15">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <Compass className="w-4 h-4 text-[#E98EAF]" />
            <span className="text-xs uppercase tracking-[0.32em] text-[#E98EAF] font-medium">
              Chapter 03 — Regional Tapestry
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#F3EAE2]">
            Diwali Across India
          </h2>
        </div>
        <p className="font-display italic text-[#FFE29A] text-sm sm:text-base mt-2 md:mt-0 max-w-md">
          One festive soul, celebrated in four magnificent regional traditions across the subcontinent
        </p>
      </div>

      {/* Horizontal Track (pinned on desktop, scrollable on mobile) */}
      <div
        ref={trackRef}
        className="flex flex-col md:flex-row flex-nowrap w-full md:w-max min-h-[100svh] items-center p-6 md:p-12 gap-8 md:gap-12"
      >
        {regions.map((region, idx) => (
          <div
            key={region.id}
            className="w-full md:w-[82vw] lg:w-[72vw] max-w-5xl h-auto md:h-[75vh] flex-shrink-0 rounded-3xl overflow-hidden border border-[#A99BBF]/25 bg-gradient-to-br from-[#102C38] via-[#0A1B22] to-[#101B35] shadow-2xl relative flex flex-col lg:flex-row group"
          >
            {/* Left/Top: Panoramic Background Image with Parallax Vibe */}
            <div className="relative w-full lg:w-1/2 h-64 sm:h-80 lg:h-full overflow-hidden">
              <img
                src={region.image}
                alt={region.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-transparent via-[#0A1B22]/50 to-[#0A1B22]" />

              {/* Watermark Region Index */}
              <div className="absolute top-6 left-6 font-mono text-5xl font-light text-[#F3EAE2]/20 select-none">
                0{idx + 1}
              </div>

              {/* Region Label Pill */}
              <div className="absolute bottom-6 left-6 flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#061116]/80 backdrop-blur-md border border-[#E98EAF]/40">
                <MapPin className="w-3.5 h-3.5 text-[#E98EAF]" />
                <span className="text-xs uppercase tracking-[0.2em] text-[#F3EAE2] font-medium">
                  {region.location}
                </span>
              </div>
            </div>

            {/* Right/Bottom: Story Narrative & Cultural Heritage */}
            <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <LotusIcon size={18} />
                  <span className="text-xs uppercase tracking-[0.25em] text-[#FDB863] font-medium">
                    {region.era}
                  </span>
                </div>

                <h3 className="font-serif text-3xl sm:text-4xl text-[#F3EAE2] leading-tight">
                  {region.name}
                </h3>
                <h4 className="font-display italic text-lg sm:text-xl text-[#F4C4D2] -mt-1 font-light">
                  {region.title}
                </h4>

                <p className="text-xs sm:text-sm text-[#F3EAE2]/80 leading-relaxed font-light">
                  {region.description}
                </p>

                {/* Cultural Lore Callout */}
                <div className="p-4 rounded-xl bg-[#061116]/60 border border-[#A99BBF]/20 text-xs text-[#F3EAE2]/85 italic">
                  {region.quote}
                  <span className="block text-[11px] font-sans not-italic text-[#A99BBF] mt-1">
                    — {region.quoteSource}
                  </span>
                </div>
              </div>

              {/* Highlights List */}
              <div className="pt-6 border-t border-[#A99BBF]/15 mt-6">
                <span className="text-[11px] uppercase tracking-[0.25em] text-[#A99BBF] block mb-2 font-medium">
                  Cultural Highlights
                </span>
                <div className="flex flex-wrap gap-2">
                  {region.highlights.map((h, i) => (
                    <span
                      key={i}
                      className="text-[11px] tracking-wider px-3 py-1 rounded-full bg-[#102C38]/90 text-[#F4C4D2] border border-[#E98EAF]/30 flex items-center space-x-1.5"
                    >
                      <Sparkles className="w-3 h-3 text-[#FDB863]" />
                      <span>{h}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

