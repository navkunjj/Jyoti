import { FireworkColor } from './types';
import { rgbaString } from './colors';

export interface ParticleInitOptions {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: FireworkColor;
  secondaryColor?: FireworkColor;
  size?: number;
  life?: number;
  drag?: number;
  gravity?: number;
  trailLength?: number;
  flicker?: boolean;
  isWillow?: boolean;
  hasCrackles?: boolean;
}

export class Particle {
  public inUse: boolean = false;

  public x: number = 0;
  public y: number = 0;
  public vx: number = 0;
  public vy: number = 0;

  public color: FireworkColor = { r: 255, g: 255, b: 255, hex: '#ffffff' };
  public secondaryColor: FireworkColor | null = null;

  public size: number = 2;
  public life: number = 60;
  public maxLife: number = 60;
  public drag: number = 0.97;
  public gravity: number = 0.06;

  public flicker: boolean = false;
  public isWillow: boolean = false;
  public hasCrackles: boolean = false;

  // Trail history ring buffer
  public trailLength: number = 4;
  public trailX: number[] = [0, 0, 0, 0, 0, 0];
  public trailY: number[] = [0, 0, 0, 0, 0, 0];
  public trailIndex: number = 0;
  public trailFilled: number = 0;

  public init(opts: ParticleInitOptions): void {
    this.inUse = true;
    this.x = opts.x;
    this.y = opts.y;
    this.vx = opts.vx;
    this.vy = opts.vy;

    this.color = opts.color;
    this.secondaryColor = opts.secondaryColor || null;

    this.size = opts.size ?? (1.8 + Math.random() * 1.5);
    this.life = opts.life ?? Math.floor(40 + Math.random() * 40);
    this.maxLife = this.life;

    this.drag = opts.drag ?? 0.968;
    this.gravity = opts.gravity ?? 0.055;

    this.trailLength = Math.min(6, Math.max(1, opts.trailLength ?? 4));
    this.flicker = opts.flicker ?? (Math.random() < 0.25);
    this.isWillow = opts.isWillow ?? false;
    this.hasCrackles = opts.hasCrackles ?? false;

    // Reset trail
    for (let i = 0; i < 6; i++) {
      this.trailX[i] = this.x;
      this.trailY[i] = this.y;
    }
    this.trailIndex = 0;
    this.trailFilled = 1;
  }

  public update(): boolean {
    if (!this.inUse) return false;

    // Store current position in trail ring
    this.trailX[this.trailIndex] = this.x;
    this.trailY[this.trailIndex] = this.y;
    this.trailIndex = (this.trailIndex + 1) % this.trailLength;
    if (this.trailFilled < this.trailLength) {
      this.trailFilled++;
    }

    // Apply drag / friction
    this.vx *= this.drag;
    this.vy *= this.drag;

    // Apply gravity
    this.vy += this.gravity;

    // Willow slight air turbulence
    if (this.isWillow) {
      this.vx += (Math.random() - 0.5) * 0.04;
    }

    // Move
    this.x += this.vx;
    this.y += this.vy;

    this.life--;

    if (this.life <= 0) {
      this.inUse = false;
      return false;
    }

    return true;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    if (!this.inUse || this.trailFilled < 1) return;

    const progress = 1 - this.life / this.maxLife; // 0 to 1
    let alpha = 1 - progress;

    // Natural flicker effect for crackles and stars
    if (this.flicker) {
      alpha *= 0.65 + Math.random() * 0.55;
    }

    // Color transition: from primary to secondary color as it cools
    let currentColor = this.color;
    if (this.secondaryColor && progress > 0.45) {
      currentColor = this.secondaryColor;
    }

    // Draw high-speed light streak / trail
    const prevIdx = (this.trailIndex - 1 + this.trailLength) % this.trailLength;
    const prevX = this.trailX[prevIdx];
    const prevY = this.trailY[prevIdx];

    const currentSize = Math.max(0.6, this.size * (1 - progress * 0.5));

    // Fast light trail line
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = rgbaString(currentColor, alpha * 0.85);
    ctx.lineWidth = currentSize;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Bright core spark head
    ctx.beginPath();
    ctx.arc(this.x, this.y, currentSize * 0.75, 0, Math.PI * 2);
    // Core is slightly brighter/whiter
    ctx.fillStyle = rgbaString(currentColor, alpha);
    ctx.fill();

    // High brightness initial flash for young particles
    if (progress < 0.15) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, currentSize * 1.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${(0.6 * (1 - progress / 0.15)).toFixed(2)})`;
      ctx.fill();
    }
  }

  public reset(): void {
    this.inUse = false;
    this.trailFilled = 0;
  }
}
