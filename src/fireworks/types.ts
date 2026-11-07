export type FireworkType =
  | 'peony'
  | 'chrysanthemum'
  | 'willow'
  | 'crackler'
  | 'rocket'
  | 'phuljhari'
  | 'anar';

export type FireworkIntensity = 'low' | 'medium' | 'high';

export interface FireworkColor {
  r: number;
  g: number;
  b: number;
  hex: string;
}

export interface LaunchOptions {
  startX?: number;
  startY?: number;
  targetX?: number;
  targetY?: number;
  speed?: number;
  color?: string | FireworkColor;
  secondaryColor?: string | FireworkColor;
  type?: FireworkType;
  particleCount?: number;
  size?: number;
  altitudeRatio?: number; // 0.15 to 0.5 of viewport height
}

export interface BurstOptions {
  color?: string | FireworkColor;
  secondaryColor?: string | FireworkColor;
  type?: FireworkType;
  particleCount?: number;
  radius?: number;
  hasCrackles?: boolean;
  velocityScale?: number;
  trailLength?: number;
}

export interface SparklerOptions {
  durationMs?: number;
  intensity?: number;
  color?: string | FireworkColor;
}

export interface FountainOptions {
  durationMs?: number;
  height?: number;
  spread?: number;
  color?: string | FireworkColor;
  secondaryColor?: string | FireworkColor;
}

export interface FireworksConfig {
  intensity: FireworkIntensity;
  ambientEnabled: boolean;
  soundEnabled: boolean;
  maxParticles: number;
  particleBudgetScale: number;
  reducedMotion: boolean;
}

export interface EngineStats {
  activeParticles: number;
  activeRockets: number;
  activeEmitters: number;
  fps: number;
  poolAvailable: number;
}
