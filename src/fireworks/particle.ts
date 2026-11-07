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

    // Reset trail buffer to current coordinates
    for (let i = 0; i < 6; i++) {
      this.trailX[i] = this.x;
      this.trailY[i] = this.y;
    }
    this.trailIndex = 0;
    this.trailFilled = 1;
  }

  public update(driftX: number = 0, driftY: number = 0): boolean {
    if (!this.inUse) return false;

    // Record trail
    this.trailX[this.trailIndex] = this.x;
    this.trailY[this.trailIndex] = this.y;
    this.trailIndex = (this.trailIndex + 1) % this.trailLength;
    if (this.trailFilled < this.trailLength) {
      this.trailFilled++;
    }

    // Apply drag & gravity
    this.vx *= this.drag;
    this.vy *= this.drag;
    this.vy += this.gravity;

    // Apply scroll momentum drift (direction-aware responsiveness)
    if (driftX !== 0) this.vx += driftX;
    if (driftY !== 0) this.vy += driftY;

    // Willow air turbulence
    if (this.isWillow) {
      this.vx += (Math.random() - 0.5) * 0.04;
    }

    this.x += this.vx;
    this.y += this.vy;

    this.life--;
    if (this.life <= 0) {
      this.inUse = false;
      return false;
    }

    return true;
  }

  public draw(ctx: CanvasRenderingContext2D, scrollX: number = 0, scrollY: number = 0): void {
    if (!this.inUse || this.trailFilled < 1) return;

    const drawX = this.x - scrollX;
    const drawY = this.y - scrollY;

    // Viewport culling optimization
    const vWidth = typeof window !== 'undefined' ? window.innerWidth : 1600;
    const vHeight = typeof window !== 'undefined' ? window.innerHeight : 900;
    if (drawY < -120 || drawY > vHeight + 120 || drawX < -120 || drawX > vWidth + 120) {
      return;
    }

    const progress = 1 - this.life / this.maxLife; // 0 to 1
    let alpha = 1 - progress;

    if (this.flicker) {
      alpha *= 0.65 + Math.random() * 0.55;
    }

    // Color transition from primary to secondary as particle cools
    let currentColor = this.color;
    if (this.secondaryColor && progress > 0.45) {
      currentColor = this.secondaryColor;
    }

    // Fast light streak / trail line in world space offset by scroll
    const prevIdx = (this.trailIndex - 1 + this.trailLength) % this.trailLength;
    const prevX = this.trailX[prevIdx] - scrollX;
    const prevY = this.trailY[prevIdx] - scrollY;

    const currentSize = Math.max(0.6, this.size * (1 - progress * 0.5));

    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(drawX, drawY);
    ctx.strokeStyle = rgbaString(currentColor, alpha * 0.85);
    ctx.lineWidth = currentSize;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Bright core spark
    ctx.beginPath();
    ctx.arc(drawX, drawY, currentSize * 0.75, 0, Math.PI * 2);
    ctx.fillStyle = rgbaString(currentColor, alpha);
    ctx.fill();

    // High brightness initial flash for young particles
    if (progress < 0.15) {
      ctx.beginPath();
      ctx.arc(drawX, drawY, currentSize * 1.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${(0.6 * (1 - progress / 0.15)).toFixed(2)})`;
      ctx.fill();
    }
  }

  public reset(): void {
    this.inUse = false;
    this.trailFilled = 0;
  }
}
