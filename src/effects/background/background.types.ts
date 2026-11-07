export type RibbonLayer = 'back' | 'mid' | 'front';

export interface RibbonPoint {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
}

export interface RibbonColor {
  start: string;
  mid: string;
  end: string;
  highlight: string;
  alpha: number;
}

export interface RibbonDefinition {
  id: string;
  layer: RibbonLayer;
  pointCount: number;
  baseYRatio: number;
  amplitude: number;
  wavelength: number;
  frequency: number;
  speed: number;
  thickness: number;
  taper: boolean;
  depth: number; // 0 (far background) to 1 (near foreground)
  color: RibbonColor;
  hasTrail?: boolean;
  trailWidth?: number;
}

export interface RibbonState {
  def: RibbonDefinition;
  points: RibbonPoint[];
  upperPoints: { x: number; y: number }[];
  lowerPoints: { x: number; y: number }[];
  phase: number;
  currentAmplitude: number;
  currentThickness: number;
  currentSpeed: number;
  targetYOffset: number;
  currentYOffset: number;
}

export interface ScrollState {
  scrollY: number;
  scrollProgress: number; // 0 to 1 across whole document
  velocity: number;
  smoothedVelocity: number;
  direction: 1 | -1 | 0; // 1 = down, -1 = up, 0 = still
  activeSection: string;
  sectionProgress: number; // 0 to 1 in active section
}

export interface SectionInfluence {
  sectionId: string;
  verticalShift: number; // Normalized -1 to 1 shift
  amplitudeMultiplier: number;
  speedMultiplier: number;
  colorTint: string; // Subtle ambient color modulation
  opacityMultiplier: number;
}

export interface BackgroundEngineOptions {
  reducedMotion?: boolean;
  isMobile?: boolean;
  dpr?: number;
}

