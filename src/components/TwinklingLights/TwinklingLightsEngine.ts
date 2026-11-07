import {
  LIGHT_PALETTE,
  LIGHT_SIZES,
  TWINKLE_VIEWPORT_CONFIG,
  LightColorDef,
  LightSizeTier,
} from './twinklingLights.config';

interface ViewportParticle {
  id: number;
  normalizedX: number; // 0.0 to 1.0 (relative to viewport width)
  normalizedY: number; // 0.0 to 1.0 (relative to viewport height)
  baseX: number;
  baseY: number;
  sizeTier: LightSizeTier;
  color: LightColorDef;
  spriteKey: string;

  // Twinkle dynamics
  frequency: number;   // rad/sec
  phase: number;       // 0 to 2*PI
  minAlpha: number;
  maxAlpha: number;
  twinkleStyle: number;// 0: sine pulse, 1: starlight shimmer, 2: asymmetric flare

  // Periodic random flare pulse (occasional bright surge)
  flareInterval: number; // seconds between flares
  flareDuration: number; // duration of flare
  flarePhaseOffset: number;

  // Cursor & physics offsets
  reaction: 'repel' | 'attract' | 'brighten';
  offsetX: number;
  offsetY: number;
  targetOffsetX: number;
  targetOffsetY: number;
  hoverAlphaGain: number;
  targetHoverAlphaGain: number;

  // Autonomous sway
  swayFreq: number;
  swayPhase: number;
}

export class TwinklingLightsEngine {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private animFrameId: number | null = null;

  // Offscreen pre-rendered sprites for 60/120 FPS performance
  private sprites: Map<string, HTMLCanvasElement> = new Map();

  // Active particle field
  private particles: ViewportParticle[] = [];

  // Viewport dimensions & DPR
  private width = 0;
  private height = 0;
  private dpr = 1;

  // Cursor tracking
  private mouse = {
    x: -9999,
    y: -9999,
    active: false,
    lastMoved: 0,
  };

  private prefersReducedMotion = false;
  private isDestroyed = false;

  // Bound listeners
  private handlePointerMoveBound = this.handlePointerMove.bind(this);
  private handlePointerLeaveBound = this.handlePointerLeave.bind(this);
  private handleResizeBound = this.handleResize.bind(this);

  constructor() {
    this.prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  public mount(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: true });
    if (!this.ctx) return;

    this.isDestroyed = false;

    // 1. Build high-luminance pre-rendered LED sprites
    this.buildSprites();

    // 2. Initialize viewport dimensions & generate particles
    this.handleResize();

    // 3. Attach passive pointer and resize listeners
    window.addEventListener('pointermove', this.handlePointerMoveBound, { passive: true });
    window.addEventListener('pointerleave', this.handlePointerLeaveBound, { passive: true });
    window.addEventListener('resize', this.handleResizeBound, { passive: true });

    // 4. Start continuous animation loop
    this.tick(performance.now());
  }

  public destroy(): void {
    this.isDestroyed = true;

    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    if (typeof window !== 'undefined') {
      window.removeEventListener('pointermove', this.handlePointerMoveBound);
      window.removeEventListener('pointerleave', this.handlePointerLeaveBound);
      window.removeEventListener('resize', this.handleResizeBound);
    }

    this.particles = [];
    this.sprites.clear();
    this.canvas = null;
    this.ctx = null;
  }

  /**
   * Pre-renders radiant, jewel-like miniature LED lights onto offscreen canvases.
   */
  private buildSprites(): void {
    if (typeof document === 'undefined') return;

    const sizes = Object.values(LIGHT_SIZES);

    for (const color of LIGHT_PALETTE) {
      for (const size of sizes) {
        const key = `${color.name}_${size.name}`;
        const spriteCanvas = document.createElement('canvas');
        const sizePx = size.spriteSize;

        spriteCanvas.width = sizePx;
        spriteCanvas.height = sizePx;

        const sCtx = spriteCanvas.getContext('2d');
        if (!sCtx) continue;

        const center = sizePx / 2;

        // Layer 1: Radiant translucent outer halo
        const glowGrad = sCtx.createRadialGradient(
          center,
          center,
          0,
          center,
          center,
          size.glowRadius
        );
        glowGrad.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.75)`);
        glowGrad.addColorStop(0.25, `rgba(${color.r}, ${color.g}, ${color.b}, 0.40)`);
        glowGrad.addColorStop(0.65, `rgba(${color.r}, ${color.g}, ${color.b}, 0.12)`);
        glowGrad.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);

        sCtx.beginPath();
        sCtx.arc(center, center, size.glowRadius, 0, Math.PI * 2);
        sCtx.fillStyle = glowGrad;
        sCtx.fill();

        // Layer 2: Saturated festive LED bulb body
        sCtx.beginPath();
        sCtx.arc(center, center, size.coreRadius * 1.35, 0, Math.PI * 2);
        sCtx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.95)`;
        sCtx.fill();

        // Layer 3: Brilliant incandescent white-hot micro filament
        sCtx.beginPath();
        sCtx.arc(center, center, Math.max(0.6, size.coreRadius * 0.72), 0, Math.PI * 2);
        sCtx.fillStyle = 'rgba(255, 255, 255, 1.0)';
        sCtx.fill();

        this.sprites.set(key, spriteCanvas);
      }
    }
  }

  /**
   * Distributes lights across the viewport using a jittered organic grid.
   * Guarantees 100–150 lights on desktop, 70–100 on tablet, and 40–60 on mobile.
   */
  private generateParticles(): void {
    if (this.width <= 0 || this.height <= 0) return;

    let targetCount = TWINKLE_VIEWPORT_CONFIG.density.desktop; // 130
    if (this.width < 640) {
      targetCount = TWINKLE_VIEWPORT_CONFIG.density.mobile; // 50
    } else if (this.width < 1024) {
      targetCount = TWINKLE_VIEWPORT_CONFIG.density.tablet; // 85
    }

    this.particles = [];

    // Form a jittered grid to prevent clustering in one corner or leaving huge voids
    const cols = Math.ceil(Math.sqrt(targetCount * (this.width / this.height)));
    const rows = Math.ceil(targetCount / cols);

    let id = 1;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (this.particles.length >= targetCount) break;

        // Jitter within cell with padding
        const cellNormX = (c + 0.15 + Math.random() * 0.7) / cols;
        const cellNormY = (r + 0.15 + Math.random() * 0.7) / rows;

        // Clamp to viewport
        const normalizedX = Math.min(0.97, Math.max(0.03, cellNormX));
        const normalizedY = Math.min(0.97, Math.max(0.03, cellNormY));

        // Size tier distribution:
        // 35% micro, 40% small, 18% medium, 7% accent
        const rSize = Math.random();
        let sizeTier: LightSizeTier;
        if (rSize < 0.35) sizeTier = LIGHT_SIZES.micro;
        else if (rSize < 0.75) sizeTier = LIGHT_SIZES.small;
        else if (rSize < 0.93) sizeTier = LIGHT_SIZES.medium;
        else sizeTier = LIGHT_SIZES.accent;

        // Pick color from weighted palette
        const color = this.pickWeightedColor();
        const spriteKey = `${color.name}_${sizeTier.name}`;

        // Frequency distribution:
        // 30% slow breathing (0.6 - 1.2 rad/s)
        // 45% moderate twinkling (1.8 - 3.4 rad/s)
        // 25% fast lively sparkle (4.2 - 7.0 rad/s)
        const rSpeed = Math.random();
        let frequency: number;
        if (rSpeed < 0.30) {
          frequency = 0.6 + Math.random() * 0.6;
        } else if (rSpeed < 0.75) {
          frequency = 1.8 + Math.random() * 1.6;
        } else {
          frequency = 4.2 + Math.random() * 2.8;
        }

        const phase = Math.random() * Math.PI * 2;
        const minAlpha = sizeTier.minAlphaBase + Math.random() * 0.10;
        const maxAlpha = Math.min(1.0, sizeTier.maxAlphaBase - Math.random() * 0.08);

        // Twinkle style
        const twinkleStyle = Math.floor(Math.random() * 3);

        // Flare pulse
        const flareInterval = 3.5 + Math.random() * 5.0; // every 3.5-8.5s
        const flareDuration = 0.5 + Math.random() * 0.5;
        const flarePhaseOffset = Math.random() * 10;

        // Reaction
        const rReaction = Math.random();
        const reaction =
          rReaction < 0.45 ? 'brighten' : rReaction < 0.75 ? 'repel' : 'attract';

        this.particles.push({
          id: id++,
          normalizedX,
          normalizedY,
          baseX: normalizedX * this.width,
          baseY: normalizedY * this.height,
          sizeTier,
          color,
          spriteKey,
          frequency,
          phase,
          minAlpha,
          maxAlpha,
          twinkleStyle,
          flareInterval,
          flareDuration,
          flarePhaseOffset,
          reaction,
          offsetX: 0,
          offsetY: 0,
          targetOffsetX: 0,
          targetOffsetY: 0,
          hoverAlphaGain: 0,
          targetHoverAlphaGain: 0,
          swayFreq: 0.8 + Math.random() * 0.8,
          swayPhase: Math.random() * Math.PI * 2,
        });
      }
    }
  }

  private pickWeightedColor(): LightColorDef {
    const total = LIGHT_PALETTE.reduce((sum, c) => sum + c.weight, 0);
    let rand = Math.random() * total;
    for (const c of LIGHT_PALETTE) {
      if (rand < c.weight) return c;
      rand -= c.weight;
    }
    return LIGHT_PALETTE[0];
  }

  private handlePointerMove(e: PointerEvent): void {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
    this.mouse.active = true;
    this.mouse.lastMoved = performance.now();
  }

  private handlePointerLeave(): void {
    this.mouse.active = false;
  }

  private handleResize(): void {
    if (!this.canvas) return;

    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);

    if (this.ctx) {
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.scale(this.dpr, this.dpr);
    }

    // Generate or scale particles to new viewport bounds
    this.generateParticles();
  }

  /**
   * Main 60/120 FPS continuous render loop.
   */
  private tick(timestamp: number): void {
    if (this.isDestroyed || !this.ctx || !this.canvas) return;

    // Check if cursor has been stationary
    if (
      this.mouse.active &&
      timestamp - this.mouse.lastMoved > TWINKLE_VIEWPORT_CONFIG.cursor.idleTimeoutMs
    ) {
      this.mouse.active = false;
    }

    const t = timestamp * 0.001; // seconds
    const ctx = this.ctx;

    // Clear entire viewport canvas
    ctx.clearRect(0, 0, this.width, this.height);

    const proxRadius = TWINKLE_VIEWPORT_CONFIG.cursor.proximityRadius;
    const maxRepel = TWINKLE_VIEWPORT_CONFIG.cursor.maxRepelDistance;
    const maxAttract = TWINKLE_VIEWPORT_CONFIG.cursor.maxAttractDistance;
    const hoverGain = TWINKLE_VIEWPORT_CONFIG.cursor.hoverAlphaGain;
    const lerpSpeed = TWINKLE_VIEWPORT_CONFIG.cursor.lerpSpeed;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // 1. Cursor Proximity Calculations
      let dist = 99999;
      let dx = 0;
      let dy = 0;

      if (this.mouse.active) {
        dx = p.baseX - this.mouse.x;
        dy = p.baseY - this.mouse.y;
        dist = Math.hypot(dx, dy);
      }

      if (this.mouse.active && dist < proxRadius) {
        const factor = 1 - dist / proxRadius;
        const smoothT = factor * factor * (3 - 2 * factor);

        if (p.reaction === 'repel') {
          const angle = Math.atan2(dy, dx);
          p.targetOffsetX = Math.cos(angle) * (maxRepel * smoothT);
          p.targetOffsetY = Math.sin(angle) * (maxRepel * smoothT);
          p.targetHoverAlphaGain = hoverGain * 0.5 * smoothT;
        } else if (p.reaction === 'attract') {
          const angle = Math.atan2(dy, dx);
          p.targetOffsetX = -Math.cos(angle) * (maxAttract * smoothT);
          p.targetOffsetY = -Math.sin(angle) * (maxAttract * smoothT);
          p.targetHoverAlphaGain = hoverGain * 0.5 * smoothT;
        } else {
          // brighten
          p.targetHoverAlphaGain = hoverGain * smoothT;
          p.targetOffsetX = 0;
          p.targetOffsetY = 0;
        }
      } else {
        p.targetOffsetX = 0;
        p.targetOffsetY = 0;
        p.targetHoverAlphaGain = 0;
      }

      // Spring lerp towards target
      p.offsetX += (p.targetOffsetX - p.offsetX) * lerpSpeed;
      p.offsetY += (p.targetOffsetY - p.offsetY) * lerpSpeed;
      p.hoverAlphaGain += (p.targetHoverAlphaGain - p.hoverAlphaGain) * lerpSpeed;

      // 2. Autonomous Gentle Sway (always active so lights feel organic)
      let ambientX = 0;
      let ambientY = 0;
      if (!this.prefersReducedMotion) {
        const swayT = t * p.swayFreq + p.swayPhase;
        ambientX = Math.sin(swayT) * TWINKLE_VIEWPORT_CONFIG.autonomous.swayAmplitude;
        ambientY = Math.cos(swayT * 0.8) * (TWINKLE_VIEWPORT_CONFIG.autonomous.swayAmplitude * 0.7);
      }

      const screenX = p.baseX + p.offsetX + ambientX;
      const screenY = p.baseY + p.offsetY + ambientY;

      // 3. Continuous Multi-Speed Sinusoidal Twinkle & Flare
      let alpha = 0.5;

      if (!this.prefersReducedMotion) {
        let wave = 0.5;

        if (p.twinkleStyle === 0) {
          // Sinusoidal pulse with power curve for distinct fade-in/fade-out
          const raw = Math.sin(t * p.frequency + p.phase) * 0.5 + 0.5;
          wave = Math.pow(raw, 1.4);
        } else if (p.twinkleStyle === 1) {
          // Starlight shimmer (dual harmonic)
          const w1 = Math.sin(t * p.frequency + p.phase);
          const w2 = Math.sin(t * p.frequency * 2.5 + p.phase * 1.5);
          wave = Math.max(0, (w1 * 0.65 + w2 * 0.35) * 0.5 + 0.5);
        } else {
          // Asymmetric flare (gentle rise, slow breathing decay)
          const norm = ((t * p.frequency * 0.5 + p.phase) % (Math.PI * 2)) / (Math.PI * 2);
          wave = norm < 0.3 ? (norm / 0.3) : Math.pow(1 - (norm - 0.3) / 0.7, 1.6);
        }

        // Periodic random flare burst (occasional surge of brightness)
        const flareCycle = (t + p.flarePhaseOffset) % p.flareInterval;
        let flareBonus = 0;
        if (flareCycle < p.flareDuration) {
          const flareProgress = flareCycle / p.flareDuration;
          flareBonus = Math.sin(flareProgress * Math.PI) * 0.35;
        }

        alpha = p.minAlpha + (p.maxAlpha - p.minAlpha) * wave + flareBonus;
      } else {
        alpha = (p.minAlpha + p.maxAlpha) * 0.5;
      }

      // Add hover gain and clamp between 0 and 1
      const finalAlpha = Math.min(1.0, Math.max(0.02, alpha + p.hoverAlphaGain));

      // 4. Render sprite onto canvas
      const sprite = this.sprites.get(p.spriteKey);
      if (sprite) {
        const halfSize = p.sizeTier.spriteSize / 2;
        ctx.globalAlpha = finalAlpha;
        ctx.drawImage(
          sprite,
          Math.round(screenX - halfSize),
          Math.round(screenY - halfSize)
        );
      }
    }

    ctx.globalAlpha = 1.0;

    // Continue loop
    this.animFrameId = requestAnimationFrame((ts) => this.tick(ts));
  }
}
