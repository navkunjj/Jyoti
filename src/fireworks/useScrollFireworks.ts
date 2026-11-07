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
    // 1. Choreographed Storytelling Triggers via GSAP ScrollTrigger (No physics drift)
    const triggers: ScrollTrigger[] = [];

    // A. Hero -> Stories Section Transition
    const celebrationSection = document.getElementById('celebration');
    if (celebrationSection) {
      triggers.push(
        ScrollTrigger.create({
          trigger: celebrationSection,
          start: 'top 75%',
          onEnter: () => {
            const now = Date.now();
            if (now - lastBurstTime.current > 1400) {
              lastBurstTime.current = now;
              // Auspicious weeping golden willow over the stories chapter
              fireworks.burstInSection('celebration', 0.5, 0.18, {
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

    // B. Wishes Section
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
      triggers.forEach((t) => t.kill());
    };
  }, []);
}

