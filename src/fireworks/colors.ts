import { FireworkColor } from './types';

// Curated cinematic Diwali palette (preserving the Midnight Teal & Lotus Pink atmosphere)
export const PALETTE: Record<string, FireworkColor> = {
  // Electric Pink / Lotus Pink
  lotusPink: { r: 233, g: 142, b: 175, hex: '#E98EAF' },
  electricPink: { r: 255, g: 64, b: 129, hex: '#FF4081' },
  fuchsiaFlash: { r: 255, g: 46, b: 147, hex: '#FF2E93' },

  // Violet / Muted Lavender
  lavenderMuted: { r: 169, g: 155, b: 191, hex: '#A99BBF' },
  amethystViolet: { r: 157, g: 78, b: 221, hex: '#9D4EDD' },
  royalPurple: { r: 124, g: 77, b: 255, hex: '#7C4DFF' },

  // Cobalt / Twilight Blue
  cobaltBlue: { r: 68, g: 138, b: 255, hex: '#448AFF' },
  deepSapphire: { r: 41, g: 121, b: 255, hex: '#2979FF' },
  celestialAzure: { r: 83, g: 109, b: 254, hex: '#536DFE' },

  // Cool White / Starlight Silver
  coolWhite: { r: 255, g: 255, b: 255, hex: '#FFFFFF' },
  silverIce: { r: 224, g: 247, b: 250, hex: '#E0F7FA' },
  starlightIvory: { r: 243, g: 234, b: 226, hex: '#F3EAE2' },

  // Natural Warm Spark Tones (Diya / Golden Embers)
  warmGold: { r: 253, g: 184, b: 99, hex: '#FDB863' },
  diyaAmber: { r: 255, g: 226, b: 154, hex: '#FFE29A' },
  champagneSpark: { r: 255, g: 213, b: 79, hex: '#FFD54F' },
  copperEmber: { r: 255, g: 136, b: 51, hex: '#FF8833' },

  // Subtle Cyan / Aqua
  subtleCyan: { r: 0, g: 229, b: 255, hex: '#00E5FF' },
  twilightTeal: { r: 16, g: 44, b: 56, hex: '#102C38' },
  emeraldSpark: { r: 100, g: 255, b: 218, hex: '#64FFDA' },
};

// Color palettes for different firework types
export const AERIAL_PALETTES: FireworkColor[][] = [
  [PALETTE.electricPink, PALETTE.diyaAmber, PALETTE.coolWhite],
  [PALETTE.amethystViolet, PALETTE.lotusPink, PALETTE.silverIce],
  [PALETTE.cobaltBlue, PALETTE.subtleCyan, PALETTE.coolWhite],
  [PALETTE.royalPurple, PALETTE.electricPink, PALETTE.warmGold],
  [PALETTE.subtleCyan, PALETTE.emeraldSpark, PALETTE.coolWhite],
  [PALETTE.lotusPink, PALETTE.lavenderMuted, PALETTE.warmGold],
  [PALETTE.deepSapphire, PALETTE.amethystViolet, PALETTE.diyaAmber],
];

export const SPARK_PALETTE: FireworkColor[] = [
  PALETTE.diyaAmber,
  PALETTE.warmGold,
  PALETTE.champagneSpark,
  PALETTE.coolWhite,
  PALETTE.copperEmber,
];

export const WILLOW_PALETTE: FireworkColor[] = [
  PALETTE.warmGold,
  PALETTE.diyaAmber,
  PALETTE.starlightIvory,
  PALETTE.lotusPink,
];

export function getRandomColor(palette: FireworkColor[] = Object.values(PALETTE)): FireworkColor {
  return palette[Math.floor(Math.random() * palette.length)];
}

export function getRandomAerialPair(): [FireworkColor, FireworkColor] {
  const chosen = AERIAL_PALETTES[Math.floor(Math.random() * AERIAL_PALETTES.length)];
  return [chosen[0], chosen[1] || chosen[0]];
}

export function parseColor(color: string | FireworkColor): FireworkColor {
  if (typeof color !== 'string') {
    return color;
  }
  if (color in PALETTE) {
    return PALETTE[color];
  }
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const bigint = parseInt(hex.length === 3 ? hex.split('').map(c => c + c).join('') : hex, 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
      hex: color,
    };
  }
  return PALETTE.warmGold;
}

export function rgbaString(c: FireworkColor, alpha: number): string {
  const safeAlpha = Math.max(0, Math.min(1, alpha));
  return `rgba(${c.r},${c.g},${c.b},${safeAlpha.toFixed(3)})`;
}

