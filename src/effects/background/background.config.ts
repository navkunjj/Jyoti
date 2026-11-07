import { RibbonDefinition, SectionInfluence } from './background.types';

export const PALETTE = {
  blushPink: '#E98EAF',
  blushLight: '#F4C4D2',
  softViolet: '#9D84B7',
  mutedViolet: '#A99BBF',
  slateBlue: '#2C4F62',
  slateDark: '#1F3A48',
  coolIvory: '#F3EAE2',
  pureWhite: '#FFFFFF',
  deepNavy: '#061116',
  deepTeal: '#0A1B22',
};

export const SECTION_INFLUENCES: Record<string, SectionInfluence> = {
  welcome: {
    sectionId: 'welcome',
    verticalShift: 0,
    amplitudeMultiplier: 1.0,
    speedMultiplier: 1.0,
    colorTint: PALETTE.blushPink,
    opacityMultiplier: 1.0,
  },
  art: {
    sectionId: 'art',
    verticalShift: 0.08,
    amplitudeMultiplier: 1.12,
    speedMultiplier: 1.08,
    colorTint: PALETTE.mutedViolet,
    opacityMultiplier: 0.92,
  },
  'across-india': {
    sectionId: 'across-india',
    verticalShift: -0.06,
    amplitudeMultiplier: 1.2,
    speedMultiplier: 1.15,
    colorTint: PALETTE.slateBlue,
    opacityMultiplier: 0.95,
  },
  celebration: {
    sectionId: 'celebration',
    verticalShift: 0.05,
    amplitudeMultiplier: 1.22,
    speedMultiplier: 1.2,
    colorTint: PALETTE.blushPink,
    opacityMultiplier: 1.0,
  },
  wishes: {
    sectionId: 'wishes',
    verticalShift: -0.12,
    amplitudeMultiplier: 1.05,
    speedMultiplier: 0.95,
    colorTint: PALETTE.coolIvory,
    opacityMultiplier: 0.94,
  },
};

export const DEFAULT_RIBBONS: RibbonDefinition[] = [
  // Layer 1: Deep Ambient Background Waves
  {
    id: 'ribbon-back-1',
    layer: 'back',
    pointCount: 9,
    baseYRatio: 0.38,
    amplitude: 70,
    wavelength: 1.2,
    frequency: 0.0006,
    speed: 0.0005,
    thickness: 180,
    taper: true,
    depth: 0.2,
    color: {
      start: 'rgba(31, 58, 72, 0.35)', // Slate Dark
      mid: 'rgba(44, 79, 98, 0.45)',   // Slate Blue
      end: 'rgba(6, 17, 22, 0.1)',     // Deep Navy
      highlight: 'rgba(157, 132, 183, 0.25)',
      alpha: 0.45,
    },
    hasTrail: false,
  },
  {
    id: 'ribbon-back-2',
    layer: 'back',
    pointCount: 8,
    baseYRatio: 0.78,
    amplitude: 85,
    wavelength: 1.4,
    frequency: 0.0005,
    speed: -0.00045,
    thickness: 210,
    taper: true,
    depth: 0.3,
    color: {
      start: 'rgba(10, 27, 34, 0.4)',
      mid: 'rgba(44, 79, 98, 0.4)',
      end: 'rgba(157, 132, 183, 0.25)',
      highlight: 'rgba(233, 142, 175, 0.2)',
      alpha: 0.4,
    },
    hasTrail: false,
  },

  // Layer 2: Midground Expressive Flowing Ribbons
  {
    id: 'ribbon-mid-1',
    layer: 'mid',
    pointCount: 11,
    baseYRatio: 0.48,
    amplitude: 95,
    wavelength: 1.0,
    frequency: 0.00085,
    speed: 0.0008,
    thickness: 135,
    taper: true,
    depth: 0.65,
    color: {
      start: 'rgba(233, 142, 175, 0.48)', // Blush Pink
      mid: 'rgba(157, 132, 183, 0.52)',   // Soft Violet
      end: 'rgba(44, 79, 98, 0.3)',       // Slate Blue
      highlight: 'rgba(244, 196, 210, 0.7)',
      alpha: 0.6,
    },
    hasTrail: true,
    trailWidth: 2.0,
  },
  {
    id: 'ribbon-mid-2',
    layer: 'mid',
    pointCount: 10,
    baseYRatio: 0.62,
    amplitude: 80,
    wavelength: 1.1,
    frequency: 0.00075,
    speed: -0.0007,
    thickness: 115,
    taper: true,
    depth: 0.55,
    color: {
      start: 'rgba(169, 155, 191, 0.42)', // Muted Violet
      mid: 'rgba(44, 79, 98, 0.48)',     // Slate Blue
      end: 'rgba(233, 142, 175, 0.35)',  // Blush Pink
      highlight: 'rgba(243, 234, 226, 0.65)',
      alpha: 0.55,
    },
    hasTrail: true,
    trailWidth: 1.8,
  },

  // Layer 3: Foreground Luminous Light Trails & Filaments
  {
    id: 'ribbon-front-1',
    layer: 'front',
    pointCount: 12,
    baseYRatio: 0.54,
    amplitude: 110,
    wavelength: 0.9,
    frequency: 0.0011,
    speed: 0.001,
    thickness: 48,
    taper: true,
    depth: 0.9,
    color: {
      start: 'rgba(243, 234, 226, 0.7)', // Cool Ivory
      mid: 'rgba(244, 196, 210, 0.65)',  // Blush Light
      end: 'rgba(157, 132, 183, 0.45)',  // Soft Violet
      highlight: 'rgba(255, 255, 255, 0.95)',
      alpha: 0.75,
    },
    hasTrail: true,
    trailWidth: 2.8,
  },
];

export const MOBILE_RIBBONS: RibbonDefinition[] = DEFAULT_RIBBONS.filter(
  (r) => r.id === 'ribbon-back-1' || r.id === 'ribbon-mid-1' || r.id === 'ribbon-front-1'
).map((r) => ({
  ...r,
  pointCount: Math.min(r.pointCount, 8),
  amplitude: r.amplitude * 0.75,
  thickness: r.thickness * 0.75,
}));

export const CONFIG = {
  lerpDamping: 0.065,
  velocityDamping: 0.91,
  maxVelocityBonus: 1.8,
  parallaxStrength: 0.22,
  ambientGlowRadius: 360,
};

