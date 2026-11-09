// JYOTI — Refined Traditional Glowing Paper Sky Lanterns Canvas Engine
// Minimalist, peaceful, continuous ambient animation (2–4 lanterns across outer margins).
// Fully independent of scroll progress, slow natural speed, zero content obstruction.

import {
  LANTERN_PALETTE,
  LANTERN_SIZE_TIERS,
  LANTERN_CONFIG,
  LanternSizeTier,
} from './skyLanterns.config';

interface SkyLanternParticle {
  id: number;
  x: number;
  y: number;
  baseX: number;
  tier: LanternSizeTier;
  scale: number;
  alpha: number;
  currentAlpha: number;

  // Aerodynamics
  vy: number;
  swayPhase: number;
  swayFreq: number;
  swayAmp: number;
  tiltAngle: number;

  // Internal flame breathing
  burnerPhase: number;
  burnerSpeed: number;
  glowIntensity: number;

  // Lifecycle
  side: 'left' | 'right';
  respawnDelay: number;
  isWaitingRespawn: boolean;
}

export class SkyLanternsEngine {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private animFrameId: number | null = null;

  private width = 0;
  private height = 0;
  private dpr = 1;

  // Pre-rendered offscreen sprite cache
  private sprites: Map<string, HTMLCanvasElement> = new Map();

  // Exactly 2–4 lanterns
  private lanterns: SkyLanternParticle[] = [];

  private lastTime = 0;
  private isDestroyed = false;
  private prefersReducedMotion = false;

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

    this.dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);
    this.initSprites();
    this.handleResize();
    this.initLanterns();

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.handleResizeBound, { passive: true });
    }

    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  public destroy(): void {
    this.isDestroyed = true;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.handleResizeBound);
    }

    this.sprites.clear();
    this.lanterns = [];
    this.canvas = null;
    this.ctx = null;
  }

  private handleResizeBound = () => this.handleResize();

  private handleResize(): void {
    if (!this.canvas || !this.ctx) return;
    const rect = this.canvas.getBoundingClientRect();
    const w = rect.width || window.innerWidth;
    const h = rect.height || window.innerHeight;

    this.width = Math.max(w, 320);
    this.height = Math.max(h, 240);

    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    // Keep lanterns strictly positioned in outer margins
    this.lanterns.forEach((l) => {
      l.baseX = this.calculateEdgeX(l.side);
      l.x = l.baseX;
    });
  }

  /**
   * Calculate edge X coordinate (outer ~2% to 11% of viewport width)
   * Guaranteed never to overlap centered cards, text, or buttons.
   */
  private calculateEdgeX(side: 'left' | 'right'): number {
    const w = this.width || 1200;
    const margin = LANTERN_CONFIG.edgeMarginRatio;

    if (side === 'left') {
      return w * (0.015 + Math.random() * (margin - 0.02));
    } else {
      return w - w * (0.015 + Math.random() * (margin - 0.02));
    }
  }

  /**
   * Pre-render authentic traditional paper sky lantern sprites:
   * - Translucent parchment canopy with curved dome crown and tapering sides
   * - Volumetric internal burner illumination (bright gold at bottom to warm saffron at crown)
   * - 3D bamboo seams / ribs
   * - Bottom bamboo collar ring & glowing burner wick
   * - Soft warm ambient halo
   */
  private initSprites(): void {
    const tiers = Object.values(LANTERN_SIZE_TIERS);

    tiers.forEach((tier) => {
      const spriteCanvas = document.createElement('canvas');
      const pad = Math.ceil(tier.glowRadius * 1.5);
      const w = Math.ceil(tier.baseWidth * 2.2) + pad * 2;
      const h = Math.ceil(tier.baseHeight * 2.2) + pad * 2;
      spriteCanvas.width = w;
      spriteCanvas.height = h;

      const sctx = spriteCanvas.getContext('2d');
      if (sctx) {
        const cx = w / 2;
        const cy = h / 2;
        const lw = tier.baseWidth * 1.0;
        const lh = tier.baseHeight * 1.0;

        const topY = cy - lh * 0.48;
        const bottomY = cy + lh * 0.46;
        const topRadiusX = lw * 0.48;
        const bottomRadiusX = lw * 0.35;

        // 1. Soft Ambient Warm Bloom
        const bloomR = tier.glowRadius * 1.25;
        const bloomGrad = sctx.createRadialGradient(cx, cy + lh * 0.1, 0, cx, cy + lh * 0.1, bloomR);
        bloomGrad.addColorStop(0, 'rgba(255, 224, 130, 0.38)');
        bloomGrad.addColorStop(0.35, 'rgba(255, 179, 0, 0.22)');
        bloomGrad.addColorStop(0.7, 'rgba(244, 81, 30, 0.08)');
        bloomGrad.addColorStop(1, 'rgba(244, 81, 30, 0)');
        sctx.fillStyle = bloomGrad;
        sctx.beginPath();
        sctx.arc(cx, cy + lh * 0.1, bloomR, 0, Math.PI * 2);
        sctx.fill();

        // 2. Translucent Rice Paper Canopy Body
        sctx.save();
        sctx.beginPath();
        sctx.moveTo(cx - bottomRadiusX, bottomY);
        // Left side curve
        sctx.bezierCurveTo(
          cx - topRadiusX * 1.15, cy + lh * 0.1,
          cx - topRadiusX * 1.08, topY + lh * 0.15,
          cx - topRadiusX * 0.85, topY + lh * 0.04
        );
        // Top dome crown
        sctx.bezierCurveTo(
          cx - topRadiusX * 0.4, topY - lh * 0.05,
          cx + topRadiusX * 0.4, topY - lh * 0.05,
          cx + topRadiusX * 0.85, topY + lh * 0.04
        );
        // Right side curve
        sctx.bezierCurveTo(
          cx + topRadiusX * 1.08, topY + lh * 0.15,
          cx + topRadiusX * 1.15, cy + lh * 0.1,
          cx + bottomRadiusX, bottomY
        );
        // Bottom opening collar arc
        sctx.quadraticCurveTo(cx, bottomY + lh * 0.04, cx - bottomRadiusX, bottomY);
        sctx.closePath();

        // Volumetric Warm Illumination
        const paperGrad = sctx.createLinearGradient(cx, bottomY, cx, topY);
        paperGrad.addColorStop(0, LANTERN_PALETTE.paperBrightGold);
        paperGrad.addColorStop(0.24, LANTERN_PALETTE.paperWarmAmber);
        paperGrad.addColorStop(0.68, LANTERN_PALETTE.paperDeepSaffron);
        paperGrad.addColorStop(1, LANTERN_PALETTE.paperSunsetOrange);
        sctx.fillStyle = paperGrad;
        sctx.fill();

        // 3. Inner Burner Glow Core
        const coreFlare = sctx.createRadialGradient(
          cx, bottomY - lh * 0.12, 0,
          cx, bottomY - lh * 0.12, lw * 0.75
        );
        coreFlare.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        coreFlare.addColorStop(0.25, 'rgba(255, 245, 157, 0.78)');
        coreFlare.addColorStop(0.6, 'rgba(255, 179, 0, 0.32)');
        coreFlare.addColorStop(1, 'rgba(255, 112, 67, 0)');
        sctx.fillStyle = coreFlare;
        sctx.fill();

        // 4. Subtle Bamboo Ribbing / Seams
        sctx.lineWidth = Math.max(0.7, 1.1 * tier.scale);
        const ribOffsets = [-0.55, -0.22, 0.22, 0.55];
        ribOffsets.forEach((factor) => {
          sctx.beginPath();
          const bx = cx + bottomRadiusX * factor * 0.85;
          const tx = cx + topRadiusX * factor * 0.72;
          const mx = cx + topRadiusX * factor * 1.02;

          sctx.moveTo(bx, bottomY);
          sctx.quadraticCurveTo(mx, cy + lh * 0.05, tx, topY + lh * 0.03);
          sctx.strokeStyle = factor < 0 ? LANTERN_PALETTE.paperSeamDark : LANTERN_PALETTE.paperSeamLight;
          sctx.stroke();
        });

        // 5. Bottom Bamboo Collar Hoop
        sctx.beginPath();
        sctx.ellipse(cx, bottomY, bottomRadiusX, lh * 0.07, 0, 0, Math.PI * 2);
        sctx.fillStyle = LANTERN_PALETTE.paperRimDark;
        sctx.fill();
        sctx.strokeStyle = LANTERN_PALETTE.paperWarmAmber;
        sctx.lineWidth = Math.max(0.9, 1.3 * tier.scale);
        sctx.stroke();

        // 6. Burner Flame Teardrop
        const flameH = lh * 0.15;
        const flameW = lw * 0.13;
        const flameY = bottomY - lh * 0.05;

        const flameGrad = sctx.createLinearGradient(cx, flameY + flameH * 0.5, cx, flameY - flameH * 0.5);
        flameGrad.addColorStop(0, LANTERN_PALETTE.burnerOrange);
        flameGrad.addColorStop(0.5, LANTERN_PALETTE.burnerGold);
        flameGrad.addColorStop(1, LANTERN_PALETTE.burnerWhite);

        sctx.fillStyle = flameGrad;
        sctx.beginPath();
        sctx.moveTo(cx, flameY - flameH * 0.5);
        sctx.bezierCurveTo(cx + flameW, flameY, cx + flameW * 0.6, flameY + flameH * 0.5, cx, flameY + flameH * 0.5);
        sctx.bezierCurveTo(cx - flameW * 0.6, flameY + flameH * 0.5, cx - flameW, flameY, cx, flameY - flameH * 0.5);
        sctx.fill();

        sctx.restore();
        this.sprites.set(tier.name, spriteCanvas);
      }
    });
  }

  /**
   * Initialize exactly 3–4 lanterns placed along the left & right outer margins,
   * staggered vertically across the viewport so they drift continuously and naturally.
   */
  private initLanterns(): void {
    this.lanterns = [];
    const h = this.height || 800;

    const tierKeys: Array<'distant' | 'small' | 'medium'> = ['small', 'distant', 'medium', 'small'];
    const sides: Array<'left' | 'right'> = ['left', 'right', 'left', 'right'];

    // Vertical staging so they are spaced out gracefully across the screen
    const verticalStops = [0.22, 0.55, 0.85, 1.15];

    for (let i = 0; i < 4; i++) {
      const tierKey = tierKeys[i % tierKeys.length];
      const tier = LANTERN_SIZE_TIERS[tierKey];
      const side = sides[i % sides.length];
      const x = this.calculateEdgeX(side);
      const y = h * verticalStops[i];

      this.lanterns.push({
        id: i + 1,
        x,
        y,
        baseX: x,
        tier,
        scale: tier.scale * (0.92 + Math.random() * 0.16),
        alpha: tier.alpha,
        currentAlpha: 0, // fades in smoothly
        vy: tier.speedY * (0.9 + Math.random() * 0.2) * (this.prefersReducedMotion ? 0.35 : 1),
        swayPhase: Math.random() * Math.PI * 2,
        swayFreq: tier.swayFrequency * (0.85 + Math.random() * 0.3),
        swayAmp: tier.swayAmplitude * (0.85 + Math.random() * 0.3),
        tiltAngle: 0,
        burnerPhase: Math.random() * Math.PI * 2,
        burnerSpeed: 2.8 + Math.random() * 2.2,
        glowIntensity: 1,
        side,
        respawnDelay: 0,
        isWaitingRespawn: false,
      });
    }
  }

  /**
   * Main rendering loop (smooth 60/120 FPS, independent of scroll)
   */
  private loop = (time: number): void => {
    if (this.isDestroyed) return;

    const dt = Math.min((time - this.lastTime) / 1000, 0.1);
    this.lastTime = time;

    this.update(dt);
    this.render();

    this.animFrameId = requestAnimationFrame(this.loop);
  };

  private update(dt: number): void {
    const h = this.height;

    this.lanterns.forEach((l) => {
      // If waiting to respawn, count down delay
      if (l.isWaitingRespawn) {
        l.respawnDelay -= dt;
        if (l.respawnDelay <= 0) {
          l.isWaitingRespawn = false;
          // Alternate side or randomize occasionally
          l.side = Math.random() < 0.5 ? 'left' : 'right';
          // Pick a random tier for gentle natural variety
          const tiers: Array<'distant' | 'small' | 'medium'> = ['distant', 'small', 'medium'];
          const newTierKey = tiers[Math.floor(Math.random() * tiers.length)];
          l.tier = LANTERN_SIZE_TIERS[newTierKey];
          l.scale = l.tier.scale * (0.92 + Math.random() * 0.16);
          l.alpha = l.tier.alpha;
          l.currentAlpha = 0;
          l.vy = l.tier.speedY * (0.9 + Math.random() * 0.2) * (this.prefersReducedMotion ? 0.35 : 1);
          l.baseX = this.calculateEdgeX(l.side);
          l.x = l.baseX;
          l.y = h + 45 + Math.random() * 40;
          l.swayPhase = Math.random() * Math.PI * 2;
        }
        return;
      }

      // Smooth fade-in
      if (l.currentAlpha < l.alpha) {
        l.currentAlpha = Math.min(l.alpha, l.currentAlpha + dt * 0.6);
      }

      // Consistent, slow, natural upward flight (independent of scroll)
      l.y -= l.vy * 60 * dt;

      // Subtle horizontal breeze sway
      l.swayPhase += l.swayFreq * dt;
      const prevX = l.x;
      const swayOffset = Math.sin(l.swayPhase) * l.swayAmp;
      l.x = l.baseX + swayOffset;

      // Aerodynamic pendulum tilt
      const vx = l.x - prevX;
      const targetTilt = Math.max(-0.12, Math.min(0.12, vx * l.tier.tiltFactor));
      l.tiltAngle += (targetTilt - l.tiltAngle) * 0.1;

      // Subtle thermal convection breathing of flame
      l.burnerPhase += l.burnerSpeed * dt;
      l.glowIntensity = 0.95 + Math.sin(l.burnerPhase) * 0.05;

      // When floating out of the top, fade out and set up occasional respawn
      if (l.y < -65) {
        l.isWaitingRespawn = true;
        // Pause between 2.0 and 5.5 seconds before appearing again
        l.respawnDelay = 2.0 + Math.random() * 3.5;
      }
    });
  }

  private render(): void {
    const ctx = this.ctx;
    if (!ctx) return;

    ctx.clearRect(0, 0, this.width, this.height);

    this.lanterns.forEach((l) => {
      if (l.isWaitingRespawn || l.currentAlpha <= 0.01) return;

      const sprite = this.sprites.get(l.tier.name);
      if (!sprite) return;

      ctx.save();
      ctx.translate(l.x, l.y);
      ctx.rotate(l.tiltAngle);

      const renderScale = (l.scale / l.tier.scale) * l.glowIntensity;
      const sw = sprite.width * renderScale;
      const sh = sprite.height * renderScale;

      ctx.globalAlpha = l.currentAlpha;
      ctx.drawImage(sprite, -sw / 2, -sh / 2, sw, sh);
      ctx.restore();
    });
  }
}
