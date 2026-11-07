export interface LightColorDef {
  name: string;
  r: number;
  g: number;
  b: number;
  hex: string;
  weight: number;
}

export const LIGHT_PALETTE: LightColorDef[] = [
  // 1. Warm White (Brilliant incandescent holiday gold-white)
  { name: 'warm-white', r: 255, g: 248, b: 235, hex: '#FFF8EB', weight: 26 },
  // 2. Soft Pink (Blush festive tone)
  { name: 'soft-pink', r: 255, g: 190, b: 210, hex: '#FFBED2', weight: 18 },
  // 3. Magenta (Rich festive lotus tone)
  { name: 'magenta', r: 240, g: 120, b: 180, hex: '#F078B4', weight: 16 },
  // 4. Violet (Twilight festive jewel tone)
  { name: 'violet', r: 190, g: 140, b: 255, hex: '#BE8CFF', weight: 14 },
  // 5. Cyan (Crisp festive teal-cyan)
  { name: 'cyan', r: 80, g: 235, b: 235, hex: '#50EBEB', weight: 10 },
  // 6. Subtle Blue (Evening sky tone)
  { name: 'blue', r: 100, g: 170, b: 255, hex: '#64AAFF', weight: 8 },
  // 7. Occasional Green (Emerald leaf festive accent)
  { name: 'green', r: 75, g: 215, b: 145, hex: '#4BD791', weight: 8 },
];

export interface LightSizeTier {
  name: 'micro' | 'small' | 'medium' | 'accent';
  coreRadius: number;
  glowRadius: number;
  spriteSize: number;
  minAlphaBase: number;
  maxAlphaBase: number;
}

export const LIGHT_SIZES: Record<'micro' | 'small' | 'medium' | 'accent', LightSizeTier> = {
  micro: {
    name: 'micro',
    coreRadius: 1.2,
    glowRadius: 7.5,
    spriteSize: 26,
    minAlphaBase: 0.08,
    maxAlphaBase: 0.85,
  },
  small: {
    name: 'small',
    coreRadius: 1.8,
    glowRadius: 11.5,
    spriteSize: 34,
    minAlphaBase: 0.12,
    maxAlphaBase: 0.92,
  },
  medium: {
    name: 'medium',
    coreRadius: 2.4,
    glowRadius: 16.5,
    spriteSize: 44,
    minAlphaBase: 0.16,
    maxAlphaBase: 0.98,
  },
  accent: {
    name: 'accent',
    coreRadius: 3.2,
    glowRadius: 23.0,
    spriteSize: 58,
    minAlphaBase: 0.22,
    maxAlphaBase: 1.0,
  },
};

export const TWINKLE_VIEWPORT_CONFIG = {
  // Density targets across screen widths
  density: {
    desktop: 130, // 100–150 light points on desktop
    tablet: 85,   // 70–100 on tablet
    mobile: 50,   // 40–60 on mobile
  },
  cursor: {
    proximityRadius: 150,     // Proximity interaction radius (pixels)
    maxRepelDistance: 10,     // Max drift away from cursor (pixels)
    maxAttractDistance: 5,    // Max drift towards cursor (pixels)
    hoverAlphaGain: 0.35,     // Brightness boost on hover
    lerpSpeed: 0.09,          // Spring ease factor
    idleTimeoutMs: 2000,      // Inactivity timeout
  },
  autonomous: {
    swaySpeed: 0.001,
    swayAmplitude: 1.2,
  },
};
