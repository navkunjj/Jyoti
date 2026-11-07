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
    for (let i = 0; i < 25; i++) {
      this.rocketPool.push(new Rocket());
    }
  }

  // Bind to Canvas
  public init(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: true });
    this.resize();

    // Visibility change handler
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
    // Return active particles to pool
    for (let i = 0; i < this.activeParticles.length; i++) {
      this.activeParticles[i].reset();
      this.particlePool.push(this.activeParticles[i]);
    }
    this.activeParticles = [];

    // Return active rockets to pool
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

  // --- PARTICLE SPAWNING HELPER ---
  public spawnParticle = (opts: ParticleInitOptions): void => {
    if (this.activeParticles.length >= this.config.maxParticles) {
      return; // Cap budget
    }

    const p = this.particlePool.pop();
    if (!p) return;

    p.init(opts);
    this.activeParticles.push(p);
  };

  // --- PUBLIC API METHODS ---

  // 1. Launch a Rocket
  public launch(options: LaunchOptions = {}): void {
    if (this.config.reducedMotion) return;
    if (!this.canvas) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const startX = options.startX ?? (width * 0.2 + Math.random() * width * 0.6);
    const startY = options.startY ?? (height + 15);
    const targetX = options.targetX ?? (startX + (Math.random() - 0.5) * (width * 0.25));
    
    // Altitude: default 20% to 45% from top of screen
    const targetY = options.targetY ?? (height * (options.altitudeRatio ?? (0.2 + Math.random() * 0.25)));

    const [pairPrimary, pairSecondary] = getRandomAerialPair();
    const color = options.color ? parseColor(options.color) : pairPrimary;
    const secondaryColor = options.secondaryColor ? parseColor(options.secondaryColor) : pairSecondary;
    const type: FireworkType = options.type || (Math.random() < 0.65 ? 'chrysanthemum' : (Math.random() < 0.5 ? 'peony' : 'willow'));

    const rocket = this.rocketPool.pop();
    if (!rocket) return;

    fireworksAudio.playRocketLaunch(startX);

    rocket.init({
      x: startX,
      y: startY,
      targetX,
      targetY,
      color,
      secondaryColor,
      burstType: type,
      particleCount: Math.floor((options.particleCount ?? 95) * this.config.particleBudgetScale),
      speed: options.speed,
      onTrailSpark: (tx, ty, sparkColor) => {
        this.spawnParticle({
          x: tx,
          y: ty,
          vx: (Math.random() - 0.5) * 0.6,
          vy: 0.8 + Math.random() * 0.8,
          color: sparkColor,
          secondaryColor: PALETTE.copperEmber,
          size: 1.4,
          life: 14 + Math.random() * 12,
          drag: 0.95,
          gravity: 0.05,
          trailLength: 2,
        });
      },
      onDetonate: (r) => {
        this.burst(r.x, r.y, {
          color: r.color,
          secondaryColor: r.secondaryColor || undefined,
          type: r.burstType,
          particleCount: r.particleCount,
        });
      },
    });

    this.activeRockets.push(rocket);
  }

  // 2. Explode a Burst at specific coordinates
  public burst(x: number, y: number, options: BurstOptions = {}): void {
    if (this.config.reducedMotion) return;

    const type = options.type || 'chrysanthemum';
    const budgetCount = Math.floor((options.particleCount ?? 85) * this.config.particleBudgetScale);
    const burstOpts: BurstOptions = { ...options, particleCount: budgetCount };

    // Play burst sound
    const size = (budgetCount > 100) ? 'large' : (budgetCount > 60 ? 'medium' : 'small');
    fireworksAudio.playBurst(x, size);

    if (type === 'peony') {
      this.emitters.createPeony(this.spawnParticle, x, y, burstOpts);
    } else if (type === 'willow') {
      this.emitters.createWillow(this.spawnParticle, x, y, burstOpts);
      setTimeout(() => fireworksAudio.playCrackles(x), 900);
    } else if (type === 'crackler') {
      this.emitters.createCrackler(this.spawnParticle, x, y, burstOpts);
      fireworksAudio.playCrackles(x);
    } else {
      // Default chrysanthemum
      this.emitters.createChrysanthemum(this.spawnParticle, x, y, burstOpts);
      if (Math.random() < 0.5) {
        setTimeout(() => fireworksAudio.playCrackles(x), 800);
      }
    }
  }

  // 3. Ignite a Sparkler (Phuljhari)
  public sparkler(x: number, y: number, options: SparklerOptions = {}): void {
    if (this.config.reducedMotion) return;
    fireworksAudio.playSparklerSizzle();
    this.emitters.startSparkler(x, y, options);
  }

  // 4. Ignite a Fountain (Anar)
  public fountain(x: number, y: number, options: FountainOptions = {}): void {
    if (this.config.reducedMotion) return;
    fireworksAudio.playSparklerSizzle();
    this.emitters.startAnar(x, y, options);
  }

  // 5. Ambient Scheduler
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

    // Interval between ambient bursts: 6 to 11 seconds for tasteful subtlety
    const delay = Math.random() * 5000 + 6000;
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

    // Tasteful, distant burst: smaller size, upper twilight sky
    const x = width * 0.15 + Math.random() * width * 0.7;
    const y = height * (0.15 + Math.random() * 0.25);

    // Random choice: either rocket launch or gentle high-altitude distant burst
    if (Math.random() < 0.6) {
      this.launch({
        startX: x + (Math.random() - 0.5) * 60,
        targetX: x,
        targetY: y,
        speed: 0.95,
        particleCount: Math.floor(65 * this.config.particleBudgetScale),
      });
    } else {
      const [col1, col2] = getRandomAerialPair();
      this.burst(x, y, {
        color: col1,
        secondaryColor: col2,
        type: Math.random() < 0.5 ? 'peony' : 'willow',
        particleCount: Math.floor(60 * this.config.particleBudgetScale),
        velocityScale: 3.5,
      });
    }
  }

  // 6. Set Intensity
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

    // Calculate FPS
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

      // Clear full canvas
      this.ctx.clearRect(0, 0, width, height);

      // Additive blending for fireworks sparks
      this.ctx.globalCompositeOperation = 'lighter';

      // 1. Update & Draw Rockets
      for (let i = this.activeRockets.length - 1; i >= 0; i--) {
        const r = this.activeRockets[i];
        if (r.update()) {
          r.draw(this.ctx);
        } else {
          this.activeRockets.splice(i, 1);
          r.reset();
          this.rocketPool.push(r);
        }
      }

      // 2. Update Continuous Emitters
      this.emitters.update(this.spawnParticle);

      // 3. Update & Draw Particles
      for (let i = this.activeParticles.length - 1; i >= 0; i--) {
        const p = this.activeParticles[i];
        if (p.update()) {
          p.draw(this.ctx);
        } else {
          // If particle died and has secondary crackles
          if (p.hasCrackles && Math.random() < 0.35 && this.activeParticles.length < this.config.maxParticles - 20) {
            for (let c = 0; c < 3; c++) {
              const a = Math.random() * Math.PI * 2;
              const spd = 1.0 + Math.random() * 2.2;
              this.spawnParticle({
                x: p.x,
                y: p.y,
                vx: Math.cos(a) * spd,
                vy: Math.sin(a) * spd,
                color: PALETTE.coolWhite,
                secondaryColor: PALETTE.diyaAmber,
                size: 1.2,
                life: 12 + Math.random() * 10,
                drag: 0.92,
                gravity: 0.05,
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

      // Restore standard composite mode
      this.ctx.globalCompositeOperation = 'source-over';
    }

    this.animationFrameId = requestAnimationFrame(this.renderLoop);
  };
}

export const fireworks = new FireworksEngine();
