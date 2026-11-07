import { FireworksConfig } from './types';
import { PALETTE } from './colors';

export const DEFAULT_FIREWORKS_CONFIG: FireworksConfig = {
  intensity: 'medium',
  ambientEnabled: true,
  soundEnabled: true,
  maxParticles: 2000,
  particleBudgetScale: 1.0,
  reducedMotion: false,
};

export const FIREWORKS_PALETTES = PALETTE;
