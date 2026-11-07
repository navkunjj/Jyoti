import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArtPiece } from '../../types';
import { ArtModal } from './ArtModal';
import { soundscape } from '../../utils/sound';
import { ArrowRight } from 'lucide-react';

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
      subtitle: 'Sacred Threshold Mandalas',
      category: 'Threshold Art',
      description:
        'Created with consecrated rice flour, fine mineral powders, and flower petals, rangolis form geometric portals designed to attract Lakshmi, the goddess of grace and prosperity, into the home.',
      historicalContext:
        'Rooted in the ancient Chitralakshana treatise, rangoli is an unbroken artistic lineage dating back over 3,000 years across Vedic literature.',
      significance:
        'The sacred symmetry reflects the cosmic balance of the universe, welcoming guests while symbolically feeding small birds and insects at dawn.',
      image: '/assets/art-rangoli.jpg',
      accentColor: '#E98EAF',
      tags: ['Mandala', 'Rice Flour', 'Symmetry'],
    },
    {
      id: 'madhubani',
      title: 'Madhubani Painting',
      subtitle: 'Ancient Mithila Narratives',
      category: 'Folk Heritage',
      description:
        'Practiced by women of Bihar and Nepal, Madhubani paintings capture mythological epics, the celestial sun and moon, and festive lamp-lit scenes with fine bamboo nibs and natural mineral dyes.',
      historicalContext:
        'Tradition recounts that King Janaka commissioned Mithila painters to decorate the entire kingdom during the divine wedding of Rama and Sita.',
      significance:
        'Each stroke symbolizes life, fertility, and cosmic order, leaving no blank space as an ode to abundance and sacred reverence.',
      image: '/assets/art-madhubani.jpg',
      accentColor: '#A99BBF',
      tags: ['Mithila', 'Natural Dyes', 'Epic Lore'],
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
      tags: ['Terracotta', 'Pancha Bhoota', 'Clay Lamps'],
    },
    {
      id: 'flowers',
      title: 'Phoolon Ki Sajawat',
      subtitle: 'Torans & Floral Garlandry',
      category: 'Natural Adornment',
      description:
        'Golden marigold (Genda), fragrant jasmine, and bougainvillea woven together with sacred mango leaves create threshold torans that purify the entrance and perfume the festive breeze.',
      historicalContext:
        'Ancient Ayurvedic treatises celebrate marigold for its natural cleansing and mood-elevating fragrances during seasonal transitions.',
      significance:
        'The fiery orange of the marigold evokes renunciation of negative ego and surrendering to the divine sun energy.',
      image: '/assets/art-flowers.jpg',
      accentColor: '#F4C4D2',
      tags: ['Marigold', 'Toran', 'Mango Leaves'],
    },
    {
      id: 'kolam',
      title: 'Sacred Kolams',
      subtitle: 'Geometric Devotion of Dawn',
      category: 'Threshold Geometries',
      description:
        'In Southern India, women wake before Brahma Muhurta to meticulously connect mathematical dot matrices with unbroken white lines of dry rice flour.',
      historicalContext:
        'Passed down maternally for millennia, kolams combine advanced mathematical symmetry with daily spiritual meditation.',
      significance:
        'Invites Bhoomi Devi (Mother Earth) blessings and symbolizes living in peaceful coexistence with the surrounding ecosystem.',
      image: '/assets/south-india-kolam.jpg',
      accentColor: '#102C38',
      tags: ['South India', 'Dot Grid', 'Math Art'],
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header entrance
      gsap.fromTo(
        headerRef.current,
        { y: 40, opacity: 0 },
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
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.12,
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
      className="relative z-20 w-full py-28 sm:py-36 px-6 sm:px-10 lg:px-16 bg-[#061116]/95 bg-gradient-to-b from-[#061116]/95 via-[#0A1B22]/85 to-[#102C38]/85 overflow-hidden select-none border-t border-[#A99BBF]/20 shadow-[0_-30px_70px_rgba(0,0,0,0.95)] backdrop-blur-[1px]"
      aria-label="Chapter 02 The Art of Diwali"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Editorial Section Header: Clean and dignified */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span className="text-xs uppercase tracking-[0.35em] text-[#E98EAF] font-medium block mb-3">
            Chapter 02 · Sacred Aesthetics
          </span>

          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#F3EAE2] tracking-wide mb-4 font-normal">
            The Art of Diwali
          </h2>

          <p className="font-display italic text-lg sm:text-xl text-[#FFE29A] mb-4 font-light">
            Geometric symmetry, natural pigments, and centuries of devotion crafted by hand
          </p>

          <p className="text-sm sm:text-base text-[#F3EAE2]/75 leading-relaxed font-light">
            Every motif rendered during Diwali carries centuries of ritual symbolism. From sacred threshold mandalas that welcome prosperity to the warmth of wheel-turned clay lamps, art is the heartbeat of the celebration.
          </p>
        </div>

        {/* Art Cards Editorial Grid: Clean architectural framing */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {artPieces.map((piece, index) => {
            const isFeatured = index === 0;
            return (
              <article
                key={piece.id}
                onClick={() => openArt(piece)}
                className={`art-card group relative rounded-2xl overflow-hidden cursor-pointer border border-[#A99BBF]/20 hover:border-[#E98EAF]/60 bg-[#061116]/80 backdrop-blur-md transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 ${
                  isFeatured ? 'md:col-span-2 lg:col-span-2' : ''
                }`}
              >
                {/* Clean Image Container */}
                <div className={`relative overflow-hidden ${isFeatured ? 'h-72 sm:h-96' : 'h-64 sm:h-72'}`}>
                  <img
                    src={piece.image}
                    alt={piece.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#061116] via-transparent to-transparent opacity-80" />
                </div>

                {/* Content Details: Clean typography */}
                <div className="p-6 sm:p-7 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[11px] uppercase tracking-[0.22em] text-[#E98EAF] font-medium block mb-1">
                      {piece.category}
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl text-[#F3EAE2] group-hover:text-[#F4C4D2] transition-colors mb-1 font-normal">
                      {piece.title}
                    </h3>
                    <p className="font-display italic text-[#FFE29A] text-sm mb-2 font-light">
                      {piece.subtitle}
                    </p>
                    <p className="text-xs sm:text-sm text-[#F3EAE2]/75 line-clamp-3 leading-relaxed font-light">
                      {piece.description}
                    </p>
                  </div>

                  {/* Bottom Footer: Minimalist link */}
                  <div className="pt-3 border-t border-[#A99BBF]/15 flex items-center justify-between text-xs">
                    <span className="text-[11px] tracking-wider uppercase text-[#A99BBF]/70 font-light">
                      {piece.tags[0]}
                    </span>

                    <span className="flex items-center space-x-1.5 text-[#E98EAF] group-hover:translate-x-1 transition-transform tracking-wider uppercase text-[11px] font-medium">
                      <span>Explore Craft</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Detail Modal Lightbox */}
      <ArtModal art={selectedArt} onClose={() => setSelectedArt(null)} />
    </section>
  );
};
