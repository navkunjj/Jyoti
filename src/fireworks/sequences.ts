import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fireworks } from './engine';
import { PALETTE } from './colors';

gsap.registerPlugin(ScrollTrigger);

// Cooldown tracking to prevent rapid duplicate triggers
const triggerTimestamps: Record<string, number> = {};
const COOLDOWN_MS = 2500;

function canTrigger(sectionKey: string): boolean {
  const now = Date.now();
  const last = triggerTimestamps[sectionKey] || 0;
  if (now - last < COOLDOWN_MS) {
    return false;
  }
  triggerTimestamps[sectionKey] = now;
  return true;
}

export function triggerHeroFireworks(): void {
  if (!canTrigger('hero')) return;

  const w = window.innerWidth;
  const h = window.innerHeight;

  // Graceful distant chrysanthemum over the right-side palace ghats
  setTimeout(() => {
    fireworks.burst(w * 0.72, h * 0.24, {
      color: PALETTE.lotusPink,
      secondaryColor: PALETTE.warmGold,
      type: 'chrysanthemum',
      particleCount: 85,
    });
  }, 400);
}

export function triggerArtFireworks(): void {
  if (!canTrigger('art')) return;

  const w = window.innerWidth;
  const h = window.innerHeight;

  // Staggered elegant burst pair
  fireworks.burst(w * 0.3, h * 0.28, {
    color: PALETTE.amethystViolet,
    secondaryColor: PALETTE.lotusPink,
    type: 'peony',
    particleCount: 75,
  });

  setTimeout(() => {
    fireworks.burst(w * 0.7, h * 0.24, {
      color: PALETTE.warmGold,
      secondaryColor: PALETTE.starlightIvory,
      type: 'willow',
      particleCount: 85,
    });
  }, 400);
}

export function triggerRegionFireworks(regionIdx: number): void {
  const key = `region-${regionIdx}`;
  if (!canTrigger(key)) return;

  const w = window.innerWidth;
  const h = window.innerHeight;

  if (regionIdx === 0) {
    // Ayodhya: Golden Deepotsav cracker burst
    fireworks.burst(w * 0.48, h * 0.24, {
      color: PALETTE.warmGold,
      secondaryColor: PALETTE.diyaAmber,
      type: 'chrysanthemum',
      particleCount: 95,
    });
    setTimeout(() => {
      fireworks.burst(w * 0.52, h * 0.28, {
        color: PALETTE.coolWhite,
        type: 'crackler',
        particleCount: 70,
      });
    }, 300);
  } else if (regionIdx === 1) {
    // Varanasi: Dev Deepawali ghat river burst
    fireworks.burst(w * 0.65, h * 0.25, {
      color: PALETTE.cobaltBlue,
      secondaryColor: PALETTE.diyaAmber,
      type: 'willow',
      particleCount: 90,
    });
  } else if (regionIdx === 2) {
    // West Bengal: Electric pink & crimson celebration
    fireworks.burst(w * 0.5, h * 0.26, {
      color: PALETTE.electricPink,
      secondaryColor: PALETTE.amethystViolet,
      type: 'peony',
      particleCount: 85,
    });
  } else {
    // South India: Traditional Anar ground fountain on lower screen
    fireworks.fountain(w * 0.5, h * 0.88, {
      durationMs: 3800,
      height: 15,
      color: PALETTE.warmGold,
      secondaryColor: PALETTE.copperEmber,
    });
  }
}

export function triggerCelebrationFireworks(): void {
  if (!canTrigger('celebration')) return;

  const w = window.innerWidth;
  const h = window.innerHeight;

  // Dual celebratory burst
  fireworks.burst(w * 0.32, h * 0.24, {
    color: PALETTE.electricPink,
    secondaryColor: PALETTE.starlightIvory,
    type: 'peony',
    particleCount: 85,
  });

  setTimeout(() => {
    fireworks.burst(w * 0.68, h * 0.26, {
      color: PALETTE.warmGold,
      secondaryColor: PALETTE.diyaAmber,
      type: 'willow',
      particleCount: 95,
    });
  }, 350);
}

export function triggerWishesFireworks(): void {
  if (!canTrigger('wishes')) return;

  const w = window.innerWidth;
  const h = window.innerHeight;

  // Celebratory crackler burst welcoming the final prayer
  fireworks.burst(w * 0.5, h * 0.2, {
    color: PALETTE.coolWhite,
    secondaryColor: PALETTE.electricPink,
    type: 'crackler',
    particleCount: 75,
  });
}

// Master ScrollTrigger setup linking each section smoothly
export function setupScrollFireworks(): () => void {
  const triggers: ScrollTrigger[] = [];

  // 1. Hero
  const heroEl = document.getElementById('welcome');
  if (heroEl) {
    triggers.push(
      ScrollTrigger.create({
        trigger: heroEl,
        start: 'top 30%',
        onEnter: () => triggerHeroFireworks(),
      })
    );
  }

  // 2. Art Section
  const artEl = document.getElementById('art');
  if (artEl) {
    triggers.push(
      ScrollTrigger.create({
        trigger: artEl,
        start: 'top 60%',
        onEnter: () => triggerArtFireworks(),
        onEnterBack: () => triggerArtFireworks(),
      })
    );
  }

  // 3. Across India Section
  const indiaEl = document.getElementById('across-india');
  if (indiaEl) {
    triggers.push(
      ScrollTrigger.create({
        trigger: indiaEl,
        start: 'top 55%',
        onEnter: () => triggerRegionFireworks(0),
        onEnterBack: () => triggerRegionFireworks(1),
      })
    );
  }

  // 4. Celebration Section
  const celebEl = document.getElementById('celebration');
  if (celebEl) {
    triggers.push(
      ScrollTrigger.create({
        trigger: celebEl,
        start: 'top 60%',
        onEnter: () => triggerCelebrationFireworks(),
        onEnterBack: () => triggerCelebrationFireworks(),
      })
    );
  }

  // 5. Wishes Section
  const wishEl = document.getElementById('wishes');
  if (wishEl) {
    triggers.push(
      ScrollTrigger.create({
        trigger: wishEl,
        start: 'top 65%',
        onEnter: () => triggerWishesFireworks(),
      })
    );
  }

  // Cleanup all triggers
  return () => {
    triggers.forEach((t) => t.kill());
  };
}

