import { Particle, ParticleInitOptions } from './particle';
import { Rocket, RocketInitOptions } from './rocket';
import { EmitterManager } from './emitter';
import { fireworksAudio } from './audio';
import {
  FireworkColor,
  FireworkType,
  FireworkIntensity,
  FireworksConfig,
  LaunchOptions,
  BurstOptions,
  SparklerOptions,
  FountainOptions,
  EngineStats,
} from './types';
import { PALETTE, getRandomColor, getRandomAerialPair, parseColor } from './colors';

export class FireworksEngine {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private animationFrameId: number | null = null;

  // Pools
  private particlePool: Particle[] = [];
  private activeParticles: Particle[] = [];
  private rocketPool: Rocket[] = [];
  private activeRockets: Rocket[] = [];

  // Emitters
  private emitters: EmitterManager = new EmitterManager();

  // Directional scroll momentum
  private globalDriftX: number = 0;
  private globalDriftY: number = 0;

  // Config
  private config: FireworksConfig = {
    intensity: 'medium',
    ambientEnabled: true,
    soundEnabled: true,
    maxParticles: 2000,
    particleBudgetScale: 1.0,
    reducedMotion: false,
  };

  // Ambient Loop
  private ambientTimer: number | null = null;
  private isRunning: boolean = false;
  private isVisible: boolean = true;

  // Stats
  private lastTime: number = performance.now();
  private frameCount: number = 0;
  private currentFps: number = 60;

  constructor() {
    // Check reduced motion
    if (typeof window !== 'undefined' && window.matchMedia) {
      const media = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.config.reducedMotion = media.matches;
      media.addEventListener('change', (e) => {
        this.config.reducedMotion = e.matches;
      });
    }

    // Adapt particle budget for mobile
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      this.config.maxParticles = 900;
      this.config.particleBudgetScale = 0.55;
    }

    this.initPools();
  }

  private initPools(): void {
    const poolSize = this.config.maxParticles;
    for (let i = 0; i < poolSize; i++) {
      this.particlePool.push(new Particle());
    }
    for (let i = 0; i < 35; i++) {
      this.rocketPool.push(new Rocket());
    }
  }

  // Bind to Canvas
  public init(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: true });
    this.resize();

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.handleVisibilityChange);
    }

    this.start();

    if (this.config.ambientEnabled && !this.config.reducedMotion) {
      this.scheduleAmbient();
    }
  }

  public destroy(): void {
    this.stop();
    this.clear();
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }
    this.canvas = null;
    this.ctx = null;
  }

  private handleVisibilityChange = (): void => {
    this.isVisible = !document.hidden;
    if (this.isVisible) {
      this.lastTime = performance.now();
      if (!this.isRunning) this.start();
    } else {
      if (this.isRunning) this.stop();
    }
  };

  public resize = (): void => {
    if (!this.canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.canvas.width = Math.floor(width * dpr);
    this.canvas.height = Math.floor(height * dpr);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    if (this.ctx) {
      this.ctx.scale(dpr, dpr);
    }
  };

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.renderLoop();
  }

  public stop(): void {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.ambientTimer !== null) {
      clearTimeout(this.ambientTimer);
      this.ambientTimer = null;
    }
  }

  public clear(): void {
    for (let i = 0; i < this.activeParticles.length; i++) {
      this.activeParticles[i].reset();
      this.particlePool.push(this.activeParticles[i]);
    }
    this.activeParticles = [];

    for (let i = 0; i < this.activeRockets.length; i++) {
      this.activeRockets[i].reset();
      this.rocketPool.push(this.activeRockets[i]);
    }
    this.activeRockets = [];

    this.emitters.clear();

    if (this.ctx && this.canvas) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.ctx.clearRect(0, 0, this.canvas.width / dpr, this.canvas.height / dpr);
    }
  }

  // --- DIRECTIONAL SCROLL VELOCITY IMPULSE ---
  public applyScrollVelocity(_vx: number, _vy: number): void {
    // Physics momentum removed as requested
    this.globalDriftX = 0;
    this.globalDriftY = 0;
  }

  // --- PARTICLE SPAWNING HELPER ---
  public spawnParticle = (opts: ParticleInitOptions): void => {
    if (this.activeParticles.length >= this.config.maxParticles) {
      return;
    }

    const p = this.particlePool.pop();
    if (!p) return;

    p.init(opts);
    this.activeParticles.push(p);
  };

  // --- PUBLIC API METHODS ---

  // 1. Launch a Rocket (Vertical or Horizontal)
  public launch(options: LaunchOptions = {}): void {
    if (this.config.reducedMotion) return;
    if (!this.canvas) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const scrollX = typeof window !== 'undefined' ? window.scrollX : 0;
    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;

    const direction = options.direction || 'vertical';

    let startX: number;
    let startY: number;
    let targetX: number;
    let targetY: number;

    if (direction === 'horizontal') {
      startX = options.startX ?? (scrollX + (Math.random() < 0.5 ? 50 : width - 50));
      startY = options.startY ?? (scrollY + height * (0.25 + Math.random() * 0.35));
      targetX = options.targetX ?? (startX + (startX < scrollX + width / 2 ? width * 0.6 : -width * 0.6));
      targetY = options.targetY ?? (startY + (Math.random() - 0.5) * 60);
    } else {
      startX = options.startX ?? (scrollX + width * 0.2 + Math.random() * width * 0.6);
      startY = options.startY ?? (scrollY + height + 20);
      targetX = options.targetX ?? (startX + (Math.random() - 0.5) * (width * 0.2));
      targetY = options.targetY ?? (scrollY + height * (options.altitudeRatio ?? (0.2 + Math.random() * 0.25)));
    }

    const [pairPrimary, pairSecondary] = getRandomAerialPair();
    const color = options.color ? parseColor(options.color) : pairPrimary;
    const secondaryColor = options.secondaryColor ? parseColor(options.secondaryColor) : pairSecondary;
    const type: FireworkType = options.type || (Math.random() < 0.65 ? 'chrysanthemum' : (Math.random() < 0.5 ? 'peony' : 'willow'));

    const rocket = this.rocketPool.pop();
    if (!rocket) return;

    fireworksAudio.playRocketLaunch(startX - scrollX);

    rocket.init({
      x: startX,
      y: startY,
      targetX,
      targetY,
      direction,
      color,
      secondaryColor,
      burstType: type,
      particleCount: Math.floor((options.particleCount ?? 85) * this.config.particleBudgetScale),
      speed: options.speed,
      onTrailSpark: (tx, ty, sparkColor, spVx = 0, spVy = 0) => {
        this.spawnParticle({
          x: tx,
          y: ty,
          vx: spVx || (Math.random() - 0.5) * 0.6,
          vy: spVy || (0.8 + Math.random() * 0.8),
          color: sparkColor,
          secondaryColor: PALETTE.copperEmber,
          size: 1.4,
          life: 14 + Math.random() * 12,
          drag: 0.95,
          gravity: 0,
          trailLength: 2,
        });
      },
      onDetonate: (r) => {
        const biasX = direction === 'horizontal' ? r.vx * 0.25 : 0;
        this.burst(r.x, r.y, {
          color: r.color,
          secondaryColor: r.secondaryColor || undefined,
          type: r.burstType,
          particleCount: r.particleCount,
          isWorldCoord: true,
          directionalBiasX: biasX,
        });
      },
    });

    this.activeRockets.push(rocket);
  }

  // 2. Explode a Burst at specific coordinates
  public burst(x: number, y: number, options: BurstOptions = {}): void {
    if (this.config.reducedMotion) return;

    const scrollX = typeof window !== 'undefined' ? window.scrollX : 0;
    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    const worldX = options.isWorldCoord ? x : x + scrollX;
    const worldY = options.isWorldCoord ? y : y + scrollY;

    const type = options.type || 'chrysanthemum';
    const budgetCount = Math.floor((options.particleCount ?? 85) * this.config.particleBudgetScale);
    const burstOpts: BurstOptions = { ...options, particleCount: budgetCount };

    const size = (budgetCount > 100) ? 'large' : (budgetCount > 60 ? 'medium' : 'small');
    fireworksAudio.playBurst(worldX - scrollX, size);

    if (type === 'peony') {
      this.emitters.createPeony(this.spawnParticle, worldX, worldY, burstOpts);
    } else if (type === 'willow') {
      this.emitters.createWillow(this.spawnParticle, worldX, worldY, burstOpts);
      setTimeout(() => fireworksAudio.playCrackles(worldX - scrollX), 900);
    } else if (type === 'crackler') {
      this.emitters.createCrackler(this.spawnParticle, worldX, worldY, burstOpts);
      fireworksAudio.playCrackles(worldX - scrollX);
    } else {
      this.emitters.createChrysanthemum(this.spawnParticle, worldX, worldY, burstOpts);
      if (Math.random() < 0.5) {
        setTimeout(() => fireworksAudio.playCrackles(worldX - scrollX), 800);
      }
    }
  }

  // 3. Section / Element Anchor Burst
  public burstAtElement(element: HTMLElement, relX: number = 0.5, relY: number = 0.5, options: BurstOptions = {}): void {
    const rect = element.getBoundingClientRect();
    const scrollX = typeof window !== 'undefined' ? window.scrollX : 0;
    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    const worldX = rect.left + scrollX + rect.width * relX;
    const worldY = rect.top + scrollY + rect.height * relY;
    this.burst(worldX, worldY, { ...options, isWorldCoord: true });
  }

  public burstInSection(sectionId: string, relX: number = 0.5, relY: number = 0.3, options: BurstOptions = {}): void {
    const el = document.getElementById(sectionId);
    if (!el) return;
    this.burstAtElement(el, relX, relY, options);
  }

  // 4. Ignite a Sparkler (Phuljhari)
  public sparkler(x: number, y: number, options: SparklerOptions = {}): void {
    if (this.config.reducedMotion) return;
    const scrollX = typeof window !== 'undefined' ? window.scrollX : 0;
    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    const worldX = options.isWorldCoord ? x : x + scrollX;
    const worldY = options.isWorldCoord ? y : y + scrollY;

    fireworksAudio.playSparklerSizzle();
    this.emitters.startSparkler(worldX, worldY, options);
  }

  // 5. Ignite a Fountain (Anar)
  public fountain(x: number, y: number, options: FountainOptions = {}): void {
    if (this.config.reducedMotion) return;
    const scrollX = typeof window !== 'undefined' ? window.scrollX : 0;
    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    const worldX = options.isWorldCoord ? x : x + scrollX;
    const worldY = options.isWorldCoord ? y : y + scrollY;

    fireworksAudio.playSparklerSizzle();
    this.emitters.startAnar(worldX, worldY, options);
  }

  // 6. Ambient Scheduler
  public ambient(enabled: boolean): void {
    this.config.ambientEnabled = enabled;
    if (enabled && !this.ambientTimer && !this.config.reducedMotion) {
      this.scheduleAmbient();
    } else if (!enabled && this.ambientTimer) {
      clearTimeout(this.ambientTimer);
      this.ambientTimer = null;
    }
  }

  private scheduleAmbient = (): void => {
    if (!this.config.ambientEnabled || this.config.reducedMotion) return;

    const delay = Math.random() * 6000 + 7000;
    this.ambientTimer = window.setTimeout(() => {
      if (this.config.ambientEnabled && this.isVisible) {
        this.triggerAmbientBurst();
      }
      this.scheduleAmbient();
    }, delay);
  };

  private triggerAmbientBurst(): void {
    if (!this.canvas) return;
    const width = window.innerWidth;
    const height = window.innerHeight;

    const x = width * 0.15 + Math.random() * width * 0.7;
    const y = height * (0.15 + Math.random() * 0.22);

    const [col1, col2] = getRandomAerialPair();
    const type: FireworkType = Math.random() < 0.45 ? 'chrysanthemum' : (Math.random() < 0.5 ? 'peony' : 'willow');
    this.burst(x, y, {
      color: col1,
      secondaryColor: col2,
      type,
      particleCount: Math.floor(65 * this.config.particleBudgetScale),
      velocityScale: 3.5,
    });
  }

  // 7. Set Intensity
  public setIntensity(intensity: FireworkIntensity): void {
    this.config.intensity = intensity;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    if (intensity === 'low') {
      this.config.particleBudgetScale = isMobile ? 0.35 : 0.6;
      this.config.maxParticles = isMobile ? 600 : 1200;
    } else if (intensity === 'medium') {
      this.config.particleBudgetScale = isMobile ? 0.55 : 1.0;
      this.config.maxParticles = isMobile ? 900 : 2000;
    } else {
      this.config.particleBudgetScale = isMobile ? 0.8 : 1.4;
      this.config.maxParticles = isMobile ? 1200 : 2600;
    }
  }

  public getStats(): EngineStats {
    return {
      activeParticles: this.activeParticles.length,
      activeRockets: this.activeRockets.length,
      activeEmitters: this.emitters.getActiveCount(),
      fps: this.currentFps,
      poolAvailable: this.particlePool.length,
    };
  }

  // --- CORE RENDER LOOP ---
  private renderLoop = (): void => {
    if (!this.isRunning) return;

    const now = performance.now();
    this.frameCount++;
    if (now - this.lastTime >= 1000) {
      this.currentFps = Math.round((this.frameCount * 1000) / (now - this.lastTime));
      this.frameCount = 0;
      this.lastTime = now;
    }

    if (this.ctx && this.canvas) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = this.canvas.width / dpr;
      const height = this.canvas.height / dpr;

      this.ctx.clearRect(0, 0, width, height);
      this.ctx.globalCompositeOperation = 'lighter';

      const scrollX = typeof window !== 'undefined' ? window.scrollX : 0;
      const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;

      // 1. Update & Draw Rockets
      for (let i = this.activeRockets.length - 1; i >= 0; i--) {
        const r = this.activeRockets[i];
        if (r.update()) {
          r.draw(this.ctx, scrollX, scrollY);
        } else {
          this.activeRockets.splice(i, 1);
          r.reset();
          this.rocketPool.push(r);
        }
      }

      // 2. Update Continuous Emitters
      this.emitters.update(this.spawnParticle);

      // 3. Update & Draw Particles with directional scroll momentum
      for (let i = this.activeParticles.length - 1; i >= 0; i--) {
        const p = this.activeParticles[i];
        if (p.update(this.globalDriftX, this.globalDriftY)) {
          p.draw(this.ctx, scrollX, scrollY);
        } else {
          // Secondary crackles
          if (p.hasCrackles && Math.random() < 0.35 && this.activeParticles.length < this.config.maxParticles - 20) {
            for (let c = 0; c < 3; c++) {
              const a = Math.random() * Math.PI * 2;
              const spd = 1.0 + Math.random() * 2.2;
              this.spawnParticle({
                x: p.x,
                y: p.y,
                vx: Math.cos(a) * spd + this.globalDriftX,
                vy: Math.sin(a) * spd + this.globalDriftY,
                color: PALETTE.coolWhite,
                secondaryColor: PALETTE.diyaAmber,
                size: 1.2,
                life: 12 + Math.random() * 10,
                drag: 0.92,
                gravity: 0,
                trailLength: 2,
                flicker: true,
              });
            }
          }

          this.activeParticles.splice(i, 1);
          p.reset();
          this.particlePool.push(p);
        }
      }

      // Restore composite mode
      this.ctx.globalCompositeOperation = 'source-over';

      // Decay scroll momentum drift
      this.globalDriftX *= 0.90;
      this.globalDriftY *= 0.90;
    }

    this.animationFrameId = requestAnimationFrame(this.renderLoop);
  };
}

export const fireworks = new FireworksEngine();
