import { Particle } from './particle';
import { FireworkColor, FireworkType, BurstOptions, SparklerOptions, FountainOptions } from './types';
import { PALETTE, SPARK_PALETTE, WILLOW_PALETTE, parseColor } from './colors';

export interface ContinuousEmitter {
  id: string;
  type: 'phuljhari' | 'anar';
  x: number;
  y: number;
  durationFrames: number;
  elapsedFrames: number;
  color: FireworkColor;
  secondaryColor?: FireworkColor;
  active: boolean;
  update: (spawnParticle: (opts: any) => void) => boolean;
}

export class EmitterManager {
  private activeEmitters: ContinuousEmitter[] = [];

  public update(spawnParticle: (opts: any) => void): void {
    this.activeEmitters = this.activeEmitters.filter(emitter => {
      return emitter.update(spawnParticle);
    });
  }

  public getActiveCount(): number {
    return this.activeEmitters.length;
  }

  public clear(): void {
    this.activeEmitters = [];
  }

  // --- BURST CREATORS (instant multi-particle explosions) ---

  public createPeony(
    spawnParticle: (opts: any) => void,
    x: number,
    y: number,
    opts: BurstOptions = {}
  ): void {
    const color = parseColor(opts.color || PALETTE.electricPink);
    const secondary = opts.secondaryColor ? parseColor(opts.secondaryColor) : PALETTE.diyaAmber;
    const count = opts.particleCount ?? 80;
    const baseSpeed = opts.velocityScale ?? 4.2;

    for (let i = 0; i < count; i++) {
      // 3D-projected sphere distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const speed = baseSpeed * (0.4 + Math.random() * 0.7);

      const vx = Math.sin(phi) * Math.cos(theta) * speed;
      const vy = (Math.sin(phi) * Math.sin(theta) * speed) * 0.95; // slight perspective compression

      spawnParticle({
        x,
        y,
        vx,
        vy,
        color,
        secondaryColor: secondary,
        size: 1.8 + Math.random() * 1.4,
        life: Math.floor(45 + Math.random() * 35),
        drag: 0.962,
        gravity: 0.05,
        trailLength: 4,
        flicker: Math.random() < 0.2,
      });
    }
  }

  public createChrysanthemum(
    spawnParticle: (opts: any) => void,
    x: number,
    y: number,
    opts: BurstOptions = {}
  ): void {
    const color = parseColor(opts.color || PALETTE.warmGold);
    const secondary = opts.secondaryColor ? parseColor(opts.secondaryColor) : PALETTE.lotusPink;
    const count = opts.particleCount ?? 110;
    const baseSpeed = opts.velocityScale ?? 5.5;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.2;
      // Multi-ring layers for deep chrysanthemum look
      const layer = (i % 3 === 0) ? 0.6 : (i % 3 === 1 ? 0.85 : 1.05);
      const speed = baseSpeed * layer * (0.85 + Math.random() * 0.3);

      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;

      spawnParticle({
        x,
        y,
        vx,
        vy,
        color,
        secondaryColor: secondary,
        size: 2.2 + Math.random() * 1.5,
        life: Math.floor(55 + Math.random() * 40),
        drag: 0.968, // slightly lower drag for long streaking trails
        gravity: 0.065,
        trailLength: 6, // longer streak
        hasCrackles: Math.random() < 0.3,
        flicker: Math.random() < 0.35,
      });
    }
  }

  public createWillow(
    spawnParticle: (opts: any) => void,
    x: number,
    y: number,
    opts: BurstOptions = {}
  ): void {
    const color = parseColor(opts.color || PALETTE.diyaAmber);
    const secondary = opts.secondaryColor ? parseColor(opts.secondaryColor) : PALETTE.starlightIvory;
    const count = opts.particleCount ?? 90;
    const baseSpeed = opts.velocityScale ?? 3.8;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = baseSpeed * (0.3 + Math.random() * 0.8);

      spawnParticle({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed * 0.85,
        color,
        secondaryColor: secondary,
        size: 1.6 + Math.random() * 1.4,
        life: Math.floor(75 + Math.random() * 45), // long lasting weeping embers
        drag: 0.978,
        gravity: 0.08, // heavier droop
        trailLength: 6,
        isWillow: true,
        flicker: Math.random() < 0.4,
      });
    }
  }

  public createCrackler(
    spawnParticle: (opts: any) => void,
    x: number,
    y: number,
    opts: BurstOptions = {}
  ): void {
    const color = parseColor(opts.color || PALETTE.coolWhite);
    const secondary = opts.secondaryColor ? parseColor(opts.secondaryColor) : PALETTE.electricPink;
    const count = opts.particleCount ?? 65;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (2.5 + Math.random() * 4.5);

      spawnParticle({
        x: x + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 10,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        secondaryColor: secondary,
        size: 1.4 + Math.random() * 1.8,
        life: Math.floor(25 + Math.random() * 30),
        drag: 0.94,
        gravity: 0.04,
        trailLength: 3,
        flicker: true,
        hasCrackles: true,
      });
    }
  }

  // --- CONTINUOUS EMITTERS (Phuljhari & Anar) ---

  public startSparkler(
    x: number,
    y: number,
    opts: SparklerOptions = {}
  ): ContinuousEmitter {
    const color = parseColor(opts.color || PALETTE.diyaAmber);
    const duration = Math.floor((opts.durationMs ?? 3000) / 16.6); // in frames (~60fps)
    const sparksPerFrame = Math.max(4, Math.floor(8 * (opts.intensity ?? 1)));

    const emitter: ContinuousEmitter = {
      id: `phuljhari-${Date.now()}-${Math.random()}`,
      type: 'phuljhari',
      x,
      y,
      durationFrames: duration,
      elapsedFrames: 0,
      color,
      active: true,
      update: (spawnParticle) => {
        emitter.elapsedFrames++;
        if (emitter.elapsedFrames >= emitter.durationFrames) {
          emitter.active = false;
          return false;
        }

        // Emit dense high-velocity needle sparks
        for (let i = 0; i < sparksPerFrame; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 2.5 + Math.random() * 5.5;
          const sparkColor = (Math.random() < 0.35)
            ? PALETTE.coolWhite
            : (Math.random() < 0.6 ? PALETTE.diyaAmber : PALETTE.warmGold);

          spawnParticle({
            x: emitter.x + (Math.random() - 0.5) * 4,
            y: emitter.y + (Math.random() - 0.5) * 4,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: sparkColor,
            secondaryColor: PALETTE.copperEmber,
            size: 1.2 + Math.random() * 1.4,
            life: Math.floor(12 + Math.random() * 18),
            drag: 0.91, // high drag slows needle sparks quickly
            gravity: 0.04,
            trailLength: 3,
            flicker: true,
          });
        }
        return true;
      },
    };

    this.activeEmitters.push(emitter);
    return emitter;
  }

  public startAnar(
    x: number,
    y: number,
    opts: FountainOptions = {}
  ): ContinuousEmitter {
    const color = parseColor(opts.color || PALETTE.warmGold);
    const secondary = parseColor(opts.secondaryColor || PALETTE.electricPink);
    const duration = Math.floor((opts.durationMs ?? 4200) / 16.6);
    const baseHeight = opts.height ?? 14;

    const emitter: ContinuousEmitter = {
      id: `anar-${Date.now()}-${Math.random()}`,
      type: 'anar',
      x,
      y,
      durationFrames: duration,
      elapsedFrames: 0,
      color,
      secondaryColor: secondary,
      active: true,
      update: (spawnParticle) => {
        emitter.elapsedFrames++;
        if (emitter.elapsedFrames >= emitter.durationFrames) {
          emitter.active = false;
          return false;
        }

        // Anar ramps up, peaks in middle, then fades gently
        const progress = emitter.elapsedFrames / emitter.durationFrames;
        const curve = Math.sin(progress * Math.PI); // 0 -> 1 -> 0
        const sparks = Math.floor((6 + curve * 14));

        for (let i = 0; i < sparks; i++) {
          // Narrow conical upward geyser
          const spreadAngle = -Math.PI / 2 + (Math.random() - 0.5) * 0.48; // roughly vertical
          const speed = (baseHeight * (0.65 + curve * 0.55)) * (0.75 + Math.random() * 0.45);

          const sparkColor = Math.random() < 0.25
            ? PALETTE.coolWhite
            : (Math.random() < 0.65 ? emitter.color : (emitter.secondaryColor || PALETTE.copperEmber));

          spawnParticle({
            x: emitter.x + (Math.random() - 0.5) * 8,
            y: emitter.y,
            vx: Math.cos(spreadAngle) * speed,
            vy: Math.sin(spreadAngle) * speed,
            color: sparkColor,
            secondaryColor: PALETTE.copperEmber,
            size: 1.5 + Math.random() * 1.5,
            life: Math.floor(40 + Math.random() * 35),
            drag: 0.972,
            gravity: 0.16, // heavy gravity causes geyser to arch and cascade down
            trailLength: 4,
            flicker: Math.random() < 0.35,
          });
        }
        return true;
      },
    };

    this.activeEmitters.push(emitter);
    return emitter;
  }
}
