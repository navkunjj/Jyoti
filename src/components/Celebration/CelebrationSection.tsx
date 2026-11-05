import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CelebrationEmotion } from '../../types';
import { EmotionCard } from './EmotionCard';
import { RangoliPattern } from '../UI/RangoliPattern';
import { Heart, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const CelebrationSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);

  const emotions: CelebrationEmotion[] = [
    {
      id: 'deepdan',
      hindiTitle: 'दीपदान',
      englishTitle: 'Lighting the Diyas (Deepdan)',
      subtitle: 'Passing the spark from heart to heart',
      description:
        'As dusk surrenders to twilight, the elders and children gather with bronze thalis brimming with earthen lamps. One by one, every sill, parapet, step, and water urn receives a dancing flame. The darkness is not fought with wrath, but gently replaced with light.',
      image: '/assets/celebration-diyas.jpg',
      aspect: 'Ritual of Radiance',
      poeticNote:
        'A single lamp illuminates its own small circle, but ten thousand together turn the earthly night into a mirrored galaxy.',
    },
    {
      id: 'mithai',
      hindiTitle: 'मिष्ठान्न',
      englishTitle: 'Crafting Sweets (Mithai & Pakwaan)',
      subtitle: 'The sacred sweetness of shared labor',
      description:
        'Kitchens awaken days in advance to the intoxicating perfumes of crushed green cardamom, saffron strands simmering in thickened milk, and roasted chickpea flour in pure ghee. Boxes of diamond-cut Kaju Katli and syrup-soaked Gulab Jamun become currency of goodwill exchanged with neighbors and strangers alike.',
      image: '/assets/art-sweets.jpg',
      aspect: 'Alchemy of Gratitude',
      poeticNote:
        'In every sweet bestowed, bitterness of the passing year dissolves, replaced by renewed affection.',
    },
    {
      id: 'sajavat',
      hindiTitle: 'गृह सज्जा',
      englishTitle: 'Decorating Homes (Bandhanwar & Sajavat)',
      subtitle: 'Sanctifying spaces with nature & color',
      description:
        'Thresholds are washed with sacred water and lined with marigold garlands that ward off negativity. Brass urulis float fresh lotus blossoms and pink bougainvillea petals at entrances, inviting Goddess Lakshmi and Lord Ganesha to bless the hearth with lasting harmony.',
      image: '/assets/art-flowers.jpg',
      aspect: 'Threshold Adornment',
      poeticNote:
        'We beautify not for the applause of the world, but to prepare our sanctuaries for divine presence.',
    },
    {
      id: 'milan',
      hindiTitle: 'मिलन',
      englishTitle: 'Family Togetherness (Milan & Parivar)',
      subtitle: 'Generations woven into a single tapestry',
      description:
        'Loved ones travel hundreds of leagues across bustling train junctions and night skies to cross the ancestral threshold. Dressed in heirloom Banarasi weaves and crisp kurtas, grandparents tell stories of Rama’s Ayodhya while children marvel at the shimmering night sky.',
      image: '/assets/celebration-family.jpg',
      aspect: 'Kinship & Reunion',
      poeticNote:
        'Diwali is not merely a date upon the lunar calendar; it is the warm embrace that heals every distance.',
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal header
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
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="celebration"
      ref={containerRef}
      className="relative w-full py-28 sm:py-36 px-6 sm:px-12 lg:px-20 bg-gradient-to-b from-[#102C38] via-[#061116] to-[#0A1B22] overflow-hidden select-none"
      aria-label="Chapter 04 The Celebration"
    >
      {/* Decorative Rangoli Pattern Watermarks */}
      <div className="absolute top-1/4 -right-40 pointer-events-none opacity-10">
        <RangoliPattern size={500} />
      </div>
      <div className="absolute bottom-1/4 -left-40 pointer-events-none opacity-10">
        <RangoliPattern size={500} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Editorial Section Header */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-20 sm:mb-28">
          <div className="flex items-center justify-center space-x-3 mb-3">
            <Heart className="w-4 h-4 text-[#E98EAF]" />
            <span className="text-xs uppercase tracking-[0.35em] text-[#E98EAF] font-medium">
              Chapter 04 — Human Emotions
            </span>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#F3EAE2] tracking-wide mb-4">
            The Celebration
          </h2>

          <p className="font-display italic text-lg sm:text-xl text-[#FFE29A] mb-4 font-light">
            Beyond the lights: the warmth, togetherness, and generosity that define Diwali
          </p>

          <p className="text-sm sm:text-base text-[#F3EAE2]/75 leading-relaxed font-light">
            While lamps brighten the architecture of our homes, it is the spirit of charity, reconciliation, and joyous homecoming that illuminates the human soul.
          </p>
        </div>

        {/* Emotion Cards Stack */}
        <div className="flex flex-col space-y-16 sm:space-y-24">
          {emotions.map((emotion, idx) => (
            <EmotionCard key={emotion.id} emotion={emotion} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};

