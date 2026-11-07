import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fireworks } from './engine';
import { PALETTE, getRandomAerialPair } from './colors';

gsap.registerPlugin(ScrollTrigger);

export function useScrollFireworks() {
  const lastScrollY = useRef(0);
  const lastScrollTime = useRef(Date.now());
  const lastBurstTime = useRef(0);
  const horizontalLastX = useRef(0);

  useEffect(() => {
    // 1. Scroll Velocity & Momentum Tracking
    const handleScroll = () => {
      const currentY = window.scrollY;
      const now = Date.now();
      const dt = Math.max(1, now - lastScrollTime.current);
      const dy = currentY - lastScrollY.current;
      const velocityY = dy / dt; // px per ms

      // Impart vertical velocity to active particles
      fireworks.applyScrollVelocity(0, velocityY * 0.4);

      lastScrollY.current = currentY;
      lastScrollTime.current = now;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // 2. Choreographed Storytelling Triggers via GSAP ScrollTrigger
    const triggers: ScrollTrigger[] = [];

    // A. Hero -> Art Section Transition
    const artSection = document.getElementById('art');
    if (artSection) {
      triggers.push(
        ScrollTrigger.create({
          trigger: artSection,
          start: 'top 75%',
          onEnter: () => {
            const now = Date.now();
            if (now - lastBurstTime.current > 1400) {
              lastBurstTime.current = now;
              // Auspicious weeping golden willow over the art chapter
              fireworks.burstInSection('art', 0.5, 0.18, {
                type: 'willow',
                color: PALETTE.warmGold,
                secondaryColor: PALETTE.diyaAmber,
                particleCount: 95,
                velocityScale: 3.8,
              });
            }
          },
          onEnterBack: () => {
            const now = Date.now();
            if (now - lastBurstTime.current > 1400) {
              lastBurstTime.current = now;
              // Return burst over the Hero riverside palace ghats
              fireworks.burstInSection('welcome', 0.72, 0.32, {
                type: 'chrysanthemum',
                color: PALETTE.lotusPink,
                secondaryColor: PALETTE.warmGold,
                particleCount: 85,
              });
            }
          },
        })
      );
    }

    // B. Across India Horizontal Section: Direction-Aware Fireworks
    const acrossIndiaSection = document.getElementById('across-india');
    if (acrossIndiaSection) {
      // Find region cards within horizontal section
      const regionCards = acrossIndiaSection.querySelectorAll('article');

      triggers.push(
        ScrollTrigger.create({
          trigger: acrossIndiaSection,
          start: 'top 20%',
          end: 'bottom 80%',
          onUpdate: (self) => {
            const now = Date.now();
            // Determine scroll direction & speed
            const direction = self.direction; // 1 = scrolling down (content moves right-to-left), -1 = scrolling up (left-to-right)
            const velocity = Math.abs(self.getVelocity());

            // Impart strong horizontal velocity drift to particles based on scroll direction
            const horizontalDrift = direction > 0 ? -1.6 : 1.6;
            fireworks.applyScrollVelocity(horizontalDrift * 15, 0);

            // Rate-limit bursts during horizontal scrolling to keep experience refined
            if (velocity > 120 && now - lastBurstTime.current > 2200) {
              lastBurstTime.current = now;

              // Find which region card is currently closest to center screen
              const screenCenterX = window.innerWidth / 2;
              let targetCard: HTMLElement | null = null;
              let minDistance = Infinity;

              regionCards.forEach((card) => {
                const rect = card.getBoundingClientRect();
                const cardCenterX = rect.left + rect.width / 2;
                const dist = Math.abs(cardCenterX - screenCenterX);
                if (dist < minDistance) {
                  minDistance = dist;
                  targetCard = card as HTMLElement;
                }
              });

              if (targetCard) {
                const rect = (targetCard as HTMLElement).getBoundingClientRect();
                const worldX = rect.left + window.scrollX + rect.width * (0.3 + Math.random() * 0.4);
                const worldY = rect.top + window.scrollY + rect.height * 0.22;

                // Horizontal launch traveling in the direction of the scroll
                const launchStartX = direction > 0
                  ? rect.right + window.scrollX + 60
                  : rect.left + window.scrollX - 60;
                const launchTargetX = direction > 0
                  ? rect.left + window.scrollX - 40
                  : rect.right + window.scrollX + 40;

                const [colPrimary, colSecondary] = getRandomAerialPair();

                // Directional rocket traveling horizontally across the destination card
                fireworks.launch({
                  startX: launchStartX,
                  startY: worldY + (Math.random() - 0.5) * 40,
                  targetX: launchTargetX,
                  targetY: worldY,
                  direction: 'horizontal',
                  speed: 15,
                  color: colPrimary,
                  secondaryColor: colSecondary,
                  type: 'peony',
                  particleCount: 80,
                });
              }
            }
          },
        })
      );
    }

    // C. Celebration Section (Human Emotions)
    const celebrationSection = document.getElementById('celebration');
    if (celebrationSection) {
      triggers.push(
        ScrollTrigger.create({
          trigger: celebrationSection,
          start: 'top 70%',
          onEnter: () => {
            const now = Date.now();
            if (now - lastBurstTime.current > 1400) {
              lastBurstTime.current = now;
              // Warm golden & electric pink celebratory burst
              fireworks.burstInSection('celebration', 0.5, 0.15, {
                type: 'chrysanthemum',
                color: PALETTE.diyaAmber,
                secondaryColor: PALETTE.lotusPink,
                particleCount: 90,
              });
            }
          },
        })
      );
    }

    // D. Wishes Section
    const wishesSection = document.getElementById('wishes');
    if (wishesSection) {
      triggers.push(
        ScrollTrigger.create({
          trigger: wishesSection,
          start: 'top 65%',
          onEnter: () => {
            const now = Date.now();
            if (now - lastBurstTime.current > 1400) {
              lastBurstTime.current = now;
              // Grand double chrysanthemum blooming over the sacred shloka
              fireworks.burstInSection('wishes', 0.42, 0.12, {
                type: 'chrysanthemum',
                color: PALETTE.warmGold,
                secondaryColor: PALETTE.starlightIvory,
                particleCount: 95,
              });
              setTimeout(() => {
                fireworks.burstInSection('wishes', 0.58, 0.14, {
                  type: 'peony',
                  color: PALETTE.lotusPink,
                  secondaryColor: PALETTE.coolWhite,
                  particleCount: 80,
                });
              }, 400);
            }
          },
        })
      );
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      triggers.forEach((t) => t.kill());
    };
  }, []);
}
