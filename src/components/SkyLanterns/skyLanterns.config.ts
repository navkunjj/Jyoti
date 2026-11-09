// JYOTI — Refined Traditional Glowing Paper Sky Lanterns Configuration
// Minimal, tranquil, edge-constrained sky lanterns with warm subtle glow

export interface LanternSizeTier {
  name: 'distant' | 'small' | 'medium';
  baseWidth: number;
  baseHeight: number;
  scale: number;
  alpha: number;
  glowRadius: number;
  speedY: number;
  swayAmplitude: number;
  swayFrequency: number;
  tiltFactor: number;
}

export const LANTERN_SIZE_TIERS: Record<string, LanternSizeTier> = {
  distant: {
    name: 'distant',
    baseWidth: 20,
    baseHeight: 28,
    scale: 0.52,
    alpha: 0.65,
    glowRadius: 24,
    speedY: 0.32,
    swayAmplitude: 8,
    swayFrequency: 0.65,
    tiltFactor: 0.04,
  },
  small: {
    name: 'small',
    baseWidth: 26,
    baseHeight: 37,
    scale: 0.72,
    alpha: 0.82,
    glowRadius: 32,
    speedY: 0.38,
    swayAmplitude: 11,
    swayFrequency: 0.8,
    tiltFactor: 0.05,
  },
  medium: {
    name: 'medium',
    baseWidth: 32,
    baseHeight: 45,
    scale: 0.88,
    alpha: 0.9,
    glowRadius: 42,
    speedY: 0.45,
    swayAmplitude: 14,
    swayFrequency: 0.95,
    tiltFactor: 0.06,
  },
};

export const LANTERN_PALETTE = {
  // Translucent Rice Paper Glow
  paperCoreWhite: '#FFFDE7',
  paperBrightGold: '#FFE082',
  paperWarmAmber: '#FFB300',
  paperDeepSaffron: '#FF8F00',
  paperSunsetOrange: '#F4511E',
  paperRimDark: '#3E1D0C',
  paperSeamDark: 'rgba(92, 33, 14, 0.35)',
  paperSeamLight: 'rgba(255, 235, 170, 0.25)',

  // Burner flame
  burnerWhite: '#FFFFFF',
  burnerGold: '#FFF59D',
  burnerOrange: '#FF6D00',

  // Outer ambient bloom
  bloomWarm: 'rgba(255, 179, 0, 0.3)',
  bloomOrange: 'rgba(244, 81, 30, 0.12)',
  bloomOuter: 'rgba(255, 138, 101, 0)',
};

export const LANTERN_CONFIG = {
  // Strict active count: only 2–4 lanterns across the screen
  minLanterns: 2,
  maxLanterns: 4,

  // Keep strictly along the outer gutters to never obstruct text/buttons/cards
  edgeMarginRatio: 0.12, // within outer 12% of screen width (left & right)

  // Natural float speed (pixels per frame at 60fps)
  baseFloatSpeed: 0.38,
};
