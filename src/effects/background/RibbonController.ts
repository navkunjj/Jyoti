import {
  RibbonDefinition,
  RibbonState,
  ScrollState,
  SectionInfluence,
} from './background.types';
import {
  DEFAULT_RIBBONS,
  MOBILE_RIBBONS,
  SECTION_INFLUENCES,
  CONFIG,
} from './background.config';

export class RibbonController {
  private states: RibbonState[] = [];
  private width: number = 1920;
  private height: number = 1080;
  private isMobile: boolean = false;
  private currentInfluence: SectionInfluence = SECTION_INFLUENCES.welcome;

  constructor() {
    this.initStates(DEFAULT_RIBBONS);
  }

  /**
   * Initializes or reconfigures ribbon states while preserving continuous phase.
   */
  public initStates(defs: RibbonDefinition[]): void {
    const existingPhases = new Map<string, number>();
    for (const s of this.states) {
      existingPhases.set(s.def.id, s.phase);
    }

    this.states = defs.map((def) => {
      const savedPhase = existingPhases.get(def.id) ?? Math.random() * 100;
      const points = [];
      const upperPoints = [];
      const lowerPoints = [];

      for (let i = 0; i < def.pointCount; i++) {
        points.push({ x: 0, y: 0, baseX: 0, baseY: 0, vx: 0, vy: 0 });
        upperPoints.push({ x: 0, y: 0 });
        lowerPoints.push({ x: 0, y: 0 });
      }

      return {
        def,
        points,
        upperPoints,
        lowerPoints,
        phase: savedPhase,
        currentAmplitude: def.amplitude,
        currentThickness: def.thickness,
        currentSpeed: def.speed,
        targetYOffset: 0,
        currentYOffset: 0,
      };
    });

    this.recalculateBasePoints();
  }

  /**
   * Adapts dimensions and preserves continuous animation coordinates.
   */
  public resize(width: number, height: number, isMobile: boolean): void {
    this.width = width;
    this.height = height;

    if (this.isMobile !== isMobile) {
      this.isMobile = isMobile;
      this.initStates(isMobile ? MOBILE_RIBBONS : DEFAULT_RIBBONS);
    } else {
      this.recalculateBasePoints();
    }
  }

  private recalculateBasePoints(): void {
    const marginX = this.width * 0.16;
    const effectiveWidth = this.width + marginX * 2;

    for (const state of this.states) {
      const count = state.points.length;
      const baseY = this.height * state.def.baseYRatio;

      for (let i = 0; i < count; i++) {
        const ratio = i / (count - 1);
        const baseX = -marginX + ratio * effectiveWidth;
        state.points[i].baseX = baseX;
        state.points[i].baseY = baseY;
      }
    }
  }

  /**
   * Sets the active section influence smoothly without sudden resets.
   */
  public setSection(sectionId: string): void {
    if (SECTION_INFLUENCES[sectionId]) {
      this.currentInfluence = SECTION_INFLUENCES[sectionId];
    }
  }

  /**
   * Updates physics, harmonic waves, scroll velocities, and spline control points.
   */
  public update(time: number, dt: number, scrollState: ScrollState): void {
    const influence = this.currentInfluence;
    const absVelocity = Math.abs(scrollState.smoothedVelocity);
    const velocityScale = Math.min(CONFIG.maxVelocityBonus, 1 + absVelocity * 0.08);

    for (const state of this.states) {
      const { def, points, upperPoints, lowerPoints } = state;
      const len = points.length;

      // 1. Smoothly interpolate section influences (LERP)
      const targetAmp = def.amplitude * influence.amplitudeMultiplier * velocityScale;
      state.currentAmplitude += (targetAmp - state.currentAmplitude) * CONFIG.lerpDamping;

      const targetOffset = influence.verticalShift * this.height * def.depth;
      state.currentYOffset += (targetOffset - state.currentYOffset) * CONFIG.lerpDamping;

      // 2. Advance continuous phase: scroll velocity accelerates drift in scroll direction
      const scrollPhaseDelta =
        scrollState.smoothedVelocity * 0.00045 * def.depth * (scrollState.direction || 1);
      const basePhaseDelta = def.speed * influence.speedMultiplier;
      state.phase += (basePhaseDelta + scrollPhaseDelta) * dt;

      // 3. Compute organic harmonic displacement for each control point
      for (let i = 0; i < len; i++) {
        const pt = points[i];
        const iNorm = i / (len - 1);

        // Multi-frequency harmonic wave equations (breathing, fluid undulation)
        const wave1 =
          Math.sin(state.phase * 2.2 + i * def.wavelength * 0.95) *
          state.currentAmplitude;
        const wave2 =
          Math.cos(state.phase * 1.4 + iNorm * 2.8) *
          (state.currentAmplitude * 0.38);

        // Global scroll progress wave (subtle continuous drift as page scrolls)
        const scrollWave =
          Math.sin(scrollState.scrollProgress * Math.PI * 3 + iNorm * 2.5) *
          (35 * def.depth);

        // Fluid inertia drag lag during active scroll motion
        const inertiaLag =
          -scrollState.smoothedVelocity *
          16 *
          def.depth *
          Math.sin(iNorm * Math.PI);

        // Slight lateral undulation
        const lateralWave = Math.cos(state.phase * 1.8 + iNorm * 2) * 14 * def.depth;

        pt.x = pt.baseX + lateralWave;
        pt.y = pt.baseY + state.currentYOffset + wave1 + wave2 + scrollWave + inertiaLag;
      }

      // 4. Calculate normal vectors to generate upper and lower ribbon boundaries
      for (let i = 0; i < len; i++) {
        const prev = points[Math.max(0, i - 1)];
        const next = points[Math.min(len - 1, i + 1)];

        const dx = next.x - prev.x;
        const dy = next.y - prev.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;

        // Normal unit vector (perpendicular to ribbon tangent)
        const nx = -dy / dist;
        const ny = dx / dist;

        // Tapered thickness: natural aerodynamic taper at ends, full in center
        const iNorm = i / (len - 1);
        const taperFactor = def.taper ? 0.3 + 0.7 * Math.sin(iNorm * Math.PI) : 1.0;
        const halfWidth = (def.thickness * taperFactor) / 2;

        upperPoints[i].x = points[i].x + nx * halfWidth;
        upperPoints[i].y = points[i].y + ny * halfWidth;

        lowerPoints[i].x = points[i].x - nx * halfWidth;
        lowerPoints[i].y = points[i].y - ny * halfWidth;
      }
    }
  }

  public getStates(): RibbonState[] {
    return this.states;
  }

  public getCurrentInfluence(): SectionInfluence {
    return this.currentInfluence;
  }
}

