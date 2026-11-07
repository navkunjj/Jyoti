import { fireworks } from './engine';
import { PALETTE, getRandomAerialPair } from './colors';
import { FireworkType } from './types';

export class ScrollCrackerDirector {
  private lastScrollY: number = 0;
  private accumulatedDistance: number = 0;
  private crackerIndex: number = 0;
  private lastTriggerTime: number = 0;
  private isListening: boolean = false;

  // Threshold distance in pixels to trigger next cracker
  private triggerDistance: number = 320;
  // Minimum time between scroll cracker bursts (prevent spamming on hyper-fast wheel flicks)
  private minIntervalMs: number = 280;

  public start(): () => void {
    if (this.isListening) return () => {};
    this.isListening = true;
    this.lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    this.accumulatedDistance = 0;
    this.lastTriggerTime = Date.now();

    const handleScroll = () => {
      if (!this.isListening) return;
      const currentScrollY = window.scrollY;
      const delta = Math.abs(currentScrollY - this.lastScrollY);
      this.lastScrollY = currentScrollY;

      this.accumulatedDistance += delta;

      const now = Date.now();
      if (this.accumulatedDistance >= this.triggerDistance && now - this.lastTriggerTime >= this.minIntervalMs) {
        this.accumulatedDistance = 0;
        this.lastTriggerTime = now;
        this.triggerNextScrollCracker(currentScrollY);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      this.isListening = false;
      window.removeEventListener('scroll', handleScroll);
    };
  }

  private triggerNextScrollCracker(currentScrollY: number): void {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const height = typeof window !== 'undefined' ? window.innerHeight : 800;

    // Cycle through the complete Indian Diwali cracker types
    const crackerTypes: Array<'anar' | 'phuljhari' | 'chrysanthemum' | 'crackler' | 'peony' | 'willow'> = [
      'anar',
      'phuljhari',
      'chrysanthemum',
      'crackler',
      'peony',
      'willow',
    ];

    const currentType = crackerTypes[this.crackerIndex % crackerTypes.length];
    this.crackerIndex++;

    // Alternating positioning: Left gutter, Right gutter, Upper sky
    const isLeft = (this.crackerIndex % 2 === 0);
    const sideX = isLeft
      ? (width < 640 ? width * 0.18 : Math.random() * 120 + 80)
      : (width < 640 ? width * 0.82 : width - (Math.random() * 120 + 80));

    // World Y coordinate: anchored to the current scroll position so it sticks to the page!
    const worldY = currentScrollY + (height * (0.2 + Math.random() * 0.45));

    if (currentType === 'anar') {
      // Ground-based fountain erupting upwards from the section's lower area
      const anarWorldY = currentScrollY + height * 0.82;
      fireworks.fountain(sideX, anarWorldY, {
        durationMs: 3200,
        height: 15,
        color: PALETTE.warmGold,
        secondaryColor: PALETTE.copperEmber,
      });
    } else if (currentType === 'phuljhari') {
      // Handheld sizzler / sparkler anchored near the section margin
      fireworks.sparkler(sideX, worldY, {
        durationMs: 2800,
        color: isLeft ? PALETTE.diyaAmber : PALETTE.coolWhite,
      });
    } else if (currentType === 'crackler') {
      // Crackling patakha burst
      fireworks.burst(sideX, worldY, {
        type: 'crackler',
        color: PALETTE.coolWhite,
        secondaryColor: PALETTE.electricPink,
        particleCount: 75,
      });
    } else if (currentType === 'peony') {
      // Electric pink / violet spherical burst
      const [p1, p2] = getRandomAerialPair();
      fireworks.burst(sideX, worldY, {
        type: 'peony',
        color: p1,
        secondaryColor: p2,
        particleCount: 85,
      });
    } else if (currentType === 'willow') {
      // Weeping golden willow
      fireworks.burst(sideX, worldY, {
        type: 'willow',
        color: PALETTE.warmGold,
        secondaryColor: PALETTE.diyaAmber,
        particleCount: 90,
      });
    } else {
      // Chrysanthemum flower burst
      const [colPrimary, colSecondary] = getRandomAerialPair();
      fireworks.burst(sideX, worldY, {
        type: 'chrysanthemum',
        color: colPrimary,
        secondaryColor: colSecondary,
        particleCount: 90,
      });
    }
  }
}

export const scrollCrackerDirector = new ScrollCrackerDirector();

