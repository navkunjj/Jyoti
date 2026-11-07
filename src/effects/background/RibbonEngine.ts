import { RibbonController } from './RibbonController';
import { RibbonRenderer } from './RibbonRenderer';
import { ScrollState, BackgroundEngineOptions } from './background.types';

export class RibbonEngine {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private controller: RibbonController;
  private renderer: RibbonRenderer | null = null;

  private rafId: number | null = null;
  private lastTime: number = 0;
  private isRunning: boolean = false;
  private isDocumentVisible: boolean = true;

  private width: number = 0;
  private height: number = 0;
  private dpr: number = 1;

  private scrollState: ScrollState = {
    scrollY: 0,
    scrollProgress: 0,
    velocity: 0,
    smoothedVelocity: 0,
    direction: 0,
    activeSection: 'welcome',
    sectionProgress: 0,
  };

  private options: BackgroundEngineOptions;

  constructor(options: BackgroundEngineOptions = {}) {
    this.options = {
      reducedMotion: false,
      isMobile: false,
      dpr: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1,
      ...options,
    };
    this.controller = new RibbonController();
  }

  /**
   * Mounts the engine to a canvas element and starts the continuous rendering loop.
   */
  public attach(canvas: HTMLCanvasElement): void {
    if (this.canvas === canvas) return;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: true });

    if (!this.ctx) {
      console.warn('[RibbonEngine] Could not obtain 2D canvas context');
      return;
    }

    this.renderer = new RibbonRenderer(this.ctx);
    this.handleResize();

    // Event listeners
    window.addEventListener('resize', this.onResize, { passive: true });
    document.addEventListener('visibilitychange', this.onVisibilityChange);

    this.start();
  }

  /**
   * Starts the requestAnimationFrame loop.
   */
  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  /**
   * Stops the render loop.
   */
  public stop(): void {
    this.isRunning = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /**
   * Main 60fps render tick.
   */
  private loop = (currentTime: number): void => {
    if (!this.isRunning) return;

    this.rafId = requestAnimationFrame(this.loop);

    if (!this.isDocumentVisible) {
      this.lastTime = currentTime;
      return;
    }

    const dt = Math.min((currentTime - this.lastTime) / 1000, 0.1); // Cap dt to prevent jump after tab switch
    this.lastTime = currentTime;

    // Decay smoothed scroll velocity
    this.scrollState.smoothedVelocity +=
      (this.scrollState.velocity - this.scrollState.smoothedVelocity) * 0.12;
    this.scrollState.velocity *= 0.92;

    const timeScale = this.options.reducedMotion ? 0.25 : 1.0;
    const scaledDt = dt * timeScale;

    // 1. Update controller physics
    this.controller.update(currentTime * 0.001, scaledDt, this.scrollState);

    // 2. Render all ribbons
    if (this.renderer) {
      const states = this.controller.getStates();
      const influence = this.controller.getCurrentInfluence();
      this.renderer.render(
        states,
        this.width,
        this.height,
        this.scrollState.scrollProgress,
        influence.colorTint
      );
    }
  };

  /**
   * Seamlessly updates scroll motion metrics from Lenis/GSAP.
   */
  public updateScroll(partial: Partial<ScrollState>): void {
    if (partial.scrollY !== undefined) this.scrollState.scrollY = partial.scrollY;
    if (partial.scrollProgress !== undefined)
      this.scrollState.scrollProgress = partial.scrollProgress;
    if (partial.velocity !== undefined) this.scrollState.velocity = partial.velocity;
    if (partial.direction !== undefined) this.scrollState.direction = partial.direction;
    if (partial.activeSection !== undefined) {
      this.scrollState.activeSection = partial.activeSection;
      this.controller.setSection(partial.activeSection);
    }
    if (partial.sectionProgress !== undefined)
      this.scrollState.sectionProgress = partial.sectionProgress;
  }

  /**
   * Updates active section without any animation restart.
   */
  public setSection(sectionId: string): void {
    this.scrollState.activeSection = sectionId;
    this.controller.setSection(sectionId);
  }

  private onResize = (): void => {
    this.handleResize();
  };

  private handleResize(): void {
    if (!this.canvas) return;

    const rect = this.canvas.getBoundingClientRect();
    const w = rect.width || window.innerWidth;
    const h = rect.height || window.innerHeight;
    this.dpr = this.options.dpr || Math.min(window.devicePixelRatio || 1, 2);

    this.width = w;
    this.height = h;

    this.canvas.width = Math.floor(w * this.dpr);
    this.canvas.height = Math.floor(h * this.dpr);

    if (this.ctx) {
      this.ctx.resetTransform?.();
      this.ctx.scale(this.dpr, this.dpr);
    }

    const isMobile = w < 768;
    this.controller.resize(w, h, isMobile);
  }

  private onVisibilityChange = (): void => {
    this.isDocumentVisible = !document.hidden;
    if (this.isDocumentVisible) {
      this.lastTime = performance.now();
    }
  };

  /**
   * Cleans up canvas, event listeners, and animation loop.
   */
  public destroy(): void {
    this.stop();
    window.removeEventListener('resize', this.onResize);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    this.canvas = null;
    this.ctx = null;
    this.renderer = null;
  }
}

