import { FireworkColor, FireworkType } from './types';
import { rgbaString } from './colors';

export interface RocketInitOptions {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  color: FireworkColor;
  secondaryColor?: FireworkColor;
  burstType?: FireworkType;
  particleCount?: number;
  speed?: number;
  direction?: 'vertical' | 'horizontal';
  onDetonate: (rocket: Rocket) => void;
  onTrailSpark?: (x: number, y: number, color: FireworkColor, vx?: number, vy?: number) => void;
}

export class Rocket {
  public inUse: boolean = false;

  public x: number = 0;
  public y: number = 0;
  public startX: number = 0;
  public startY: number = 0;
  public targetX: number = 0;
  public targetY: number = 0;

  public vx: number = 0;
  public vy: number = 0;
  public gravity: number = 0.16;
  public drag: number = 0.99;
  public direction: 'vertical' | 'horizontal' = 'vertical';

  public color: FireworkColor = { r: 255, g: 226, b: 154, hex: '#FFE29A' };
  public secondaryColor: FireworkColor | null = null;
  public burstType: FireworkType = 'chrysanthemum';
  public particleCount: number = 80;

  public onDetonate: ((rocket: Rocket) => void) | null = null;
  public onTrailSpark: ((x: number, y: number, color: FireworkColor, vx?: number, vy?: number) => void) | null = null;

  public trailHistory: Array<{ x: number; y: number }> = [];
  public maxTrail: number = 10;
  public wobblePhase: number = 0;
  public wobbleSpeed: number = 0.2;
  public life: number = 0;
  public maxFrames: number = 60;

  public init(opts: RocketInitOptions): void {
    this.inUse = true;
    this.x = opts.x;
    this.y = opts.y;
    this.startX = opts.x;
    this.startY = opts.y;
    this.targetX = opts.targetX;
    this.targetY = opts.targetY;
    this.direction = opts.direction || 'vertical';

    this.color = opts.color;
    this.secondaryColor = opts.secondaryColor || null;
    this.burstType = opts.burstType || 'chrysanthemum';
    this.particleCount = opts.particleCount ?? 80;

    this.onDetonate = opts.onDetonate;
    this.onTrailSpark = opts.onTrailSpark || null;

    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;

    if (this.direction === 'horizontal') {
      // Horizontal comet rocket for horizontal scroll storytelling
      const speed = (opts.speed ?? 14) * (dx < 0 ? -1 : 1);
      this.vx = speed;
      this.vy = (dy / Math.max(1, Math.abs(dx))) * Math.abs(speed);
      this.gravity = 0.03;
      this.drag = 0.994;
      this.maxFrames = Math.max(20, Math.min(80, Math.floor(Math.abs(dx) / Math.abs(speed))));
    } else {
      // Classic vertical launch
      this.gravity = 0.16;
      this.drag = 0.99;
      const distanceY = Math.abs(dy);
      // v^2 = u^2 + 2as -> u = sqrt(2 * a * s)
      const requiredVy = -Math.sqrt(Math.max(10, 2 * this.gravity * distanceY)) * (opts.speed ?? 1.05);
      const estimatedFrames = Math.max(15, Math.abs(requiredVy / this.gravity));

      this.vy = requiredVy;
      this.vx = dx / estimatedFrames;
      this.maxFrames = Math.floor(estimatedFrames * 1.1);
    }

    this.trailHistory = [];
    this.wobblePhase = Math.random() * Math.PI * 2;
    this.wobbleSpeed = 0.18 + Math.random() * 0.1;
    this.life = 0;
  }

  public update(): boolean {
    if (!this.inUse) return false;

    // Record trail
    this.trailHistory.push({ x: this.x, y: this.y });
    if (this.trailHistory.length > this.maxTrail) {
      this.trailHistory.shift();
    }

    // Natural subtle rocket wobble
    this.wobblePhase += this.wobbleSpeed;
    const wobble = Math.sin(this.wobblePhase) * 0.5;

    if (this.direction === 'horizontal') {
      this.vy += this.gravity + wobble * 0.3;
      this.vx *= this.drag;
      this.y += this.vy;
      this.x += this.vx;
    } else {
      this.vy += this.gravity;
      this.vx *= this.drag;
      this.x += this.vx + wobble;
      this.y += this.vy;
    }
    this.life++;

    // Emit glowing trail sparks in the wake
    if (this.onTrailSpark && Math.random() < 0.75) {
      const sparkVx = -this.vx * 0.2 + (Math.random() - 0.5) * 0.8;
      const sparkVy = -this.vy * 0.2 + (Math.random() - 0.5) * 0.8;
      this.onTrailSpark(
        this.x - this.vx * 0.3,
        this.y - this.vy * 0.3,
        this.color,
        sparkVx,
        sparkVy
      );
    }

    // Check detonation condition
    let shouldDetonate = false;

    if (this.direction === 'horizontal') {
      const hasPassedTarget =
        (this.vx > 0 && this.x >= this.targetX) ||
        (this.vx < 0 && this.x <= this.targetX) ||
        this.life >= this.maxFrames;
      shouldDetonate = hasPassedTarget;
    } else {
      const reachedApex = this.vy >= -0.8 || this.y <= this.targetY || this.life >= this.maxFrames;
      shouldDetonate = reachedApex || this.y < 40;
    }

    if (shouldDetonate) {
      if (this.onDetonate) {
        this.onDetonate(this);
      }
      this.inUse = false;
      return false;
    }

    return true;
  }

  public draw(ctx: CanvasRenderingContext2D, scrollX: number = 0, scrollY: number = 0): void {
    if (!this.inUse || this.trailHistory.length < 2) return;

    const screenX = this.x - scrollX;
    const screenY = this.y - scrollY;

    // Viewport cull
    if (
      screenY < -150 ||
      screenY > (typeof window !== 'undefined' ? window.innerHeight + 150 : 1200) ||
      screenX < -150 ||
      screenX > (typeof window !== 'undefined' ? window.innerWidth + 150 : 2000)
    ) {
      return;
    }

    // Draw glowing rocket tail
    ctx.beginPath();
    const startTail = this.trailHistory[0];
    ctx.moveTo(startTail.x - scrollX, startTail.y - scrollY);
    for (let i = 1; i < this.trailHistory.length; i++) {
      ctx.lineTo(this.trailHistory[i].x - scrollX, this.trailHistory[i].y - scrollY);
    }
    ctx.lineTo(screenX, screenY);

    ctx.strokeStyle = rgbaString(this.color, 0.75);
    ctx.lineWidth = 2.4;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Bright core head
    ctx.beginPath();
    ctx.arc(screenX, screenY, 2.4, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // Subtle ambient glow
    ctx.beginPath();
    ctx.arc(screenX, screenY, 6, 0, Math.PI * 2);
    ctx.fillStyle = rgbaString(this.color, 0.4);
    ctx.fill();
  }

  public reset(): void {
    this.inUse = false;
    this.trailHistory = [];
    this.onDetonate = null;
    this.onTrailSpark = null;
  }
}
