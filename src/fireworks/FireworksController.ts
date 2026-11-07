import { fireworks } from './engine';
import { LaunchOptions, BurstOptions, SparklerOptions, FountainOptions } from './types';
import { PALETTE } from './colors';

/**
 * High-level programmatic controller for the shared fireworks engine.
 * Allows components and sections to register anchors and trigger effects.
 */
export const FireworksController = {
  launch: (opts: LaunchOptions) => fireworks.launch(opts),
  burst: (x: number, y: number, opts?: BurstOptions) => fireworks.burst(x, y, opts),
  sparkler: (x: number, y: number, opts?: SparklerOptions) => fireworks.sparkler(x, y, opts),
  fountain: (x: number, y: number, opts?: FountainOptions) => fireworks.fountain(x, y, opts),
  burstAtElement: (el: HTMLElement, relX?: number, relY?: number, opts?: BurstOptions) =>
    fireworks.burstAtElement(el, relX, relY, opts),
  burstInSection: (sectionId: string, relX?: number, relY?: number, opts?: BurstOptions) =>
    fireworks.burstInSection(sectionId, relX, relY, opts),
  ambient: (enabled: boolean) => fireworks.ambient(enabled),
  stop: () => fireworks.stop(),
  clear: () => fireworks.clear(),
  setIntensity: (intensity: 'low' | 'medium' | 'high') => fireworks.setIntensity(intensity),
  getStats: () => fireworks.getStats(),
};

