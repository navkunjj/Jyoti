import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArtPiece } from '../../types';
import { ArtModal } from './ArtModal';
import { RangoliPattern } from '../UI/RangoliPattern';
import { LotusIcon } from '../UI/LotusIcon';
import { soundscape } from '../../utils/sound';
import { Sparkles, ArrowRight, Eye } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const ArtSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [selectedArt, setSelectedArt] = useState<ArtPiece | null>(null);

  const artPieces: ArtPiece[] = [
    {
      id: 'rangoli',
      title: 'Rangoli & Alpana',
      subtitle: 'Sacred Sacred Cosmic Mandalas',
      category: 'Threshold Art',
      description:
        'Created with consecrated rice flour, fine colored mineral powders, and fresh flower petals, rangolis form geometric portals designed to attract Lakshmi, the goddess of grace and prosperity, into the home.',
      historicalContext:
        'Rooted in the ancient Chitralakshana text, rangoli is an unbroken artistic lineage dating back over 3,000 years across Vedic literature.',
      significance:
        'The symmetry reflects the cosmic balance of the universe, welcoming guests while symbolically feeding small organisms at dawn.',
      image: '/assets/art-rangoli.jpg',
      accentColor: '#E98EAF',
      tags: ['Mandala', 'Rice Flour', 'Symmetry', 'Auspicious'],
    },
    {
      id: 'madhubani',
      title: 'Madhubani Art',
      subtitle: 'Ancient Mithila Narratives',
      category: 'Folk Heritage',
      description:
        'Practiced by women of Bihar and Nepal, Madhubani paintings capture mythological epics, the celestial sun and moon, and festive lamp-lit scenes with fine bamboo nibs and natural mineral dyes.',
      historicalContext:
        'Tradition recounts that King Janaka commissioned Mithila painters to decorate the entire kingdom during the marriage of Rama and Sita.',
      significance:
        'Each stroke symbolizes life, fertility, and cosmic order, leaving no blank space as an ode to abundance and sacred reverence.',
      image: '/assets/art-madhubani.jpg',
      accentColor: '#A99BBF',
      tags: ['Mithila', 'Natural Dyes', 'Epic Lore', 'Peacocks'],
    },
    {
      id: 'diyas',
      title: 'Mitti Ke Diye',
      subtitle: 'Terracotta Bearers of Light',
      category: 'Sacred Clay Craft',
      description:
        'Handcrafted by generational potters on manual wheels, these unglazed terracotta lamps hold pure mustard oil and hand-rolled cotton wicks, glowing through the darkest Amavasya night.',
      historicalContext:
        'Clay symbolizes the humble human body made of the five elements (Pancha Bhoota), while the flame represents the eternal Atman (soul).',
      significance:
        'A single diya has the power to kindle a thousand others without diminishing its own radiance, embodying selfless love.',
      image: '/assets/art-diya.jpg',
      accentColor: '#FDB863',
      tags: ['Terracotta', 'Pancha Bhoota', 'Clay Lamps', 'Sacred Oil'],
    },
    {
      id: 'flowers',
      title: 'Phoolon Ki Sajawat',
      subtitle: 'Torans & Floral Garlandry',
      category: 'Natural Adornment',
      description:
        'Golden marigold (Genda), fragrant jasmine, and bougainvillea woven together with sacred mango leaves create threshold torans that purify the entrance and perfume the festive breeze.',
      historicalContext:
        'Ancient Ayurvedic treatises celebrate marigold for its pest-repelling and mood-elevating fragrances during seasonal monsoon transitions.',
      significance:
        'The fiery orange of the marigold evokes renunciation of negative ego and surrendering to the divine sun energy.',
      image: '/assets/art-flowers.jpg',
      accentColor: '#F4C4D2',
      tags: ['Marigold', 'Toran', 'Mango Leaves', 'Fragrance'],
    },
    {
      id: 'kolam',
      title: 'Sacred Kolams',
      subtitle: 'Dawn Geometric Grids',
      category: 'Threshold Geometries',
      description:
        'In Southern India, women wake before Brahma Muhurta to meticulously connect mathematical dot matrices with unbroken white lines of dry rice flour.',
      historicalContext:
        'Passed down maternally for millennia, kolams combine advanced mathematical topology with daily spiritual meditation.',
      significance:
        'Invites Bhoomi Devi (Mother Earth) blessings and symbolizes living in peaceful coexistence with the surrounding ecosystem.',
      image: '/assets/south-india-kolam.jpg',
      accentColor: '#102C38',
      tags: ['South India', 'Dot Grid', 'Brahma Muhurta', 'Math Art'],
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header entrance
      gsap.fromTo(
        headerRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Grid cards entrance
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll('.art-card');
        gsap.fromTo(
          cards,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const openArt = (piece: ArtPiece) => {
    soundscape.playDiyaChime();
    setSelectedArt(piece);
  };

  return (
    <section
      id="art"
      ref={sectionRef}
      className="relative w-full py-28 sm:py-36 px-6 sm:px-10 lg:px-16 bg-gradient-to-b from-[#061116] via-[#0A1B22] to-[#102C38] overflow-hidden select-none"
      aria-label="Chapter 02 The Art of Diwali"
    >
      {/* Background Decorative Rangoli Watermark */}
      <div className="absolute -top-32 -right-32 pointer-events-none opacity-10">
        <RangoliPattern size={600} />
      </div>
      <div className="absolute -bottom-40 -left-36 pointer-events-none opacity-10">
        <RangoliPattern size={550} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Editorial Section Header */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="flex items-center justify-center space-x-3 mb-3">
            <span className="w-10 h-[1px] bg-[#E98EAF]/60" />
            <span className="text-xs uppercase tracking-[0.35em] text-[#E98EAF] font-medium">
              Chapter 02 — Sacred Aesthetics
            </span>
            <span className="w-10 h-[1px] bg-[#E98EAF]/60" />
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#F3EAE2] tracking-wide mb-4">
            The Art of Diwali
          </h2>

          <p className="font-display italic text-lg sm:text-xl text-[#FFE29A] mb-4 font-light">
            Geometric symmetry, natural pigments, and devotion crafted by hand
          </p>

          <p className="text-sm sm:text-base text-[#F3EAE2]/75 leading-relaxed font-light">
            Every motif rendered during Diwali carries centuries of ritual symbolism. From sacred threshold mandalas that welcome prosperity to the warmth of wheel-turned clay lamps, art is the heartbeat of the celebration.
          </p>
        </div>

        {/* Art Cards Editorial Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {artPieces.map((piece, index) => {
            const isFeatured = index === 0;
            return (
              <div
                key={piece.id}
                onClick={() => openArt(piece)}
                className={`art-card group relative rounded-2xl overflow-hidden cursor-pointer border border-[#A99BBF]/20 hover:border-[#E98EAF]/70 bg-[#061116]/80 backdrop-blur-md transition-all duration-500 hover:shadow-[0_15px_35px_-10px_rgba(233,142,175,0.25)] hover:-translate-y-1.5 ${
                  isFeatured ? 'md:col-span-2 lg:col-span-2' : ''
                }`}
              >
                {/* Image Container with Smooth Zoom on Hover */}
                <div className={`relative overflow-hidden ${isFeatured ? 'h-72 sm:h-96' : 'h-64 sm:h-72'}`}>
                  <img
                    src={piece.image}
                    alt={piece.title}
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#061116] via-[#061116]/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />

                  {/* Top Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="text-[10px] uppercase tracking-[0.25em] px-3 py-1 rounded-full bg-[#061116]/80 backdrop-blur-md border border-[#A99BBF]/30 text-[#F4C4D2]">
                      {piece.category}
                    </span>
                  </div>

                  {/* Quick Inspect Icon */}
                  <div className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-[#061116]/70 backdrop-blur-md border border-[#E98EAF]/40 flex items-center justify-center text-[#E98EAF] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-6 sm:p-7 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-2xl sm:text-3xl text-[#F3EAE2] group-hover:text-[#F4C4D2] transition-colors mb-1">
                      {piece.title}
                    </h3>
                    <p className="font-display italic text-[#FFE29A] text-sm mb-3">
                      {piece.subtitle}
                    </p>
                    <p className="text-xs sm:text-sm text-[#F3EAE2]/75 line-clamp-3 leading-relaxed font-light mb-4">
                      {piece.description}
                    </p>
                  </div>

                  {/* Bottom Footer */}
                  <div className="pt-3 border-t border-[#A99BBF]/15 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2 text-[#A99BBF]">
                      <Sparkles className="w-3.5 h-3.5 text-[#FDB863]" />
                      <span className="tracking-wider uppercase text-[11px]">
                        {piece.tags[0]}
                      </span>
                    </div>

                    <span className="flex items-center space-x-1.5 text-[#E98EAF] group-hover:translate-x-1 transition-transform tracking-wider uppercase text-[11px] font-medium">
                      <span>Explore Lore</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Modal Lightbox */}
      <ArtModal art={selectedArt} onClose={() => setSelectedArt(null)} />
    </section>
  );
};

