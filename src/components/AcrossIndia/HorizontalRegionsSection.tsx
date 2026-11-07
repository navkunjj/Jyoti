import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RegionalCelebration } from '../../types';

gsap.registerPlugin(ScrollTrigger);

export const HorizontalRegionsSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

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
    const isDesktop = window.innerWidth >= 768;
    if (!isDesktop || !containerRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      if (!track) return;

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
      className="relative w-full bg-[#061116] overflow-hidden select-none py-16 md:py-0"
      aria-label="Chapter 03 Diwali Across India"
    >
      {/* Intro Header: Pure refined editorial */}
      <div className="pt-20 pb-10 px-6 sm:px-12 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between border-b border-[#A99BBF]/15">
        <div>
          <span className="text-xs uppercase tracking-[0.35em] text-[#E98EAF] font-medium block mb-2">
            Chapter 03 · Regional Tapestry
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#F3EAE2] font-normal">
            Diwali Across India
          </h2>
        </div>
        <p className="font-display italic text-[#FFE29A] text-sm sm:text-base mt-3 md:mt-0 max-w-md font-light leading-relaxed">
          Four distinct regional celebrations of the victory of light, united across the subcontinent
        </p>
      </div>

      {/* Horizontal Track: Clean, architectural framing */}
      <div
        ref={trackRef}
        className="flex flex-col md:flex-row flex-nowrap w-full md:w-max min-h-[90vh] items-center p-6 md:p-12 gap-8 md:gap-12"
      >
        {regions.map((region) => (
          <article
            key={region.id}
            className="w-full md:w-[80vw] lg:w-[70vw] max-w-5xl h-auto md:h-[72vh] flex-shrink-0 rounded-2xl overflow-hidden border border-[#A99BBF]/20 bg-[#0A1B22]/90 shadow-2xl relative flex flex-col lg:flex-row"
          >
            {/* Left/Top: Clean Photography without floating stickers */}
            <div className="relative w-full lg:w-1/2 h-64 sm:h-80 lg:h-full overflow-hidden">
              <img
                src={region.image}
                alt={region.title}
                className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0A1B22]/90 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Right/Bottom: Story Narrative & Cultural Heritage */}
            <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col justify-between overflow-y-auto space-y-6">
              <div className="space-y-3">
                {/* Location & Tradition Eyebrow */}
                <div className="text-[11px] uppercase tracking-[0.25em] text-[#E98EAF] font-medium">
                  {region.location}
                </div>

                <h3 className="font-serif text-3xl sm:text-4xl text-[#F3EAE2] font-normal leading-tight">
                  {region.name}
                </h3>
                <h4 className="font-display italic text-base sm:text-lg text-[#F4C4D2] font-light">
                  {region.title}
                </h4>

                <p className="text-xs sm:text-sm text-[#F3EAE2]/80 leading-relaxed font-light pt-2">
                  {region.description}
                </p>

                {/* Cultural Lore Quote */}
                <blockquote className="pt-3 border-t border-[#A99BBF]/15 text-xs text-[#FFE29A]/85 italic font-serif leading-relaxed">
                  {region.quote}
                  <cite className="block text-[10px] font-sans not-italic text-[#A99BBF] mt-1 uppercase tracking-wider">
                    — {region.quoteSource}
                  </cite>
                </blockquote>
              </div>

              {/* Minimal Key Aspects (clean typography instead of chip tags) */}
              <div className="pt-4 border-t border-[#A99BBF]/15 text-xs text-[#A99BBF] flex flex-wrap gap-x-4 gap-y-1">
                {region.highlights.map((h, i) => (
                  <span key={i} className="flex items-center space-x-1.5">
                    <span className="text-[#E98EAF]">•</span>
                    <span className="text-[#F3EAE2]/80 font-light">{h}</span>
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
