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
  onDetonate: (rocket: Rocket) => void;
  onTrailSpark?: (x: number, y: number, color: FireworkColor) => void;
}

export class Rocket {
  public inUse: boolean = false;

  public x: number = 0;
  public y: number = 0;
  public targetX: number = 0;
  public targetY: number = 0;

  public vx: number = 0;
  public vy: number = 0;

  public color: FireworkColor = { r: 255, g: 226, b: 154, hex: '#FFE29A' };
  public secondaryColor: FireworkColor | null = null;
  public burstType: FireworkType = 'chrysanthemum';
  public particleCount: number = 80;

  public onDetonate: ((rocket: Rocket) => void) | null = null;
  public onTrailSpark: ((x: number, y: number, color: FireworkColor) => void) | null = null;

  public trailHistory: Array<{ x: number; y: number }> = [];
  public maxTrail: number = 8;
  public wobblePhase: number = 0;
  public wobbleSpeed: number = 0.2;
  public life: number = 0;

  public init(opts: RocketInitOptions): void {
    this.inUse = true;
    this.x = opts.x;
    this.y = opts.y;
    this.targetX = opts.targetX;
    this.targetY = opts.targetY;

    this.color = opts.color;
    this.secondaryColor = opts.secondaryColor || null;
    this.burstType = opts.burstType || 'chrysanthemum';
    this.particleCount = opts.particleCount ?? 80;

    this.onDetonate = opts.onDetonate;
    this.onTrailSpark = opts.onTrailSpark || null;

    // Calculate required upward velocity to reach apex
    const distanceY = this.targetY - this.y;
    const distanceX = this.targetX - this.x;
    
    // Physical launch calculation: initial upward velocity countered by gravity (0.16)
    const gravity = 0.16;
    // v^2 = u^2 + 2as -> u = sqrt(2 * a * s)
    const requiredVy = -Math.sqrt(Math.abs(2 * gravity * distanceY)) * (opts.speed ?? 1.05);
    const estimatedFrames = Math.abs(requiredVy / gravity);

    this.vy = requiredVy;
    this.vx = distanceX / estimatedFrames;

    this.trailHistory = [];
    this.wobblePhase = Math.random() * Math.PI * 2;
    this.wobbleSpeed = 0.15 + Math.random() * 0.1;
    this.life = 0;
  }

  public update(): boolean {
    if (!this.inUse) return false;

    // Store trail
    this.trailHistory.push({ x: this.x, y: this.y });
    if (this.trailHistory.length > this.maxTrail) {
      this.trailHistory.shift();
    }

    // Natural rocket wobble in flight
    this.wobblePhase += this.wobbleSpeed;
    const wobbleX = Math.sin(this.wobblePhase) * 0.45;

    // Physics
    this.vy += 0.16; // gravity slowing rocket ascent
    this.vx *= 0.99;
    this.x += this.vx + wobbleX;
    this.y += this.vy;
    this.life++;

    // Emit tail sparks
    if (this.onTrailSpark && Math.random() < 0.65) {
      this.onTrailSpark(
        this.x + (Math.random() - 0.5) * 3,
        this.y + 4 + Math.random() * 4,
        this.color
      );
    }

    // Check apex reached or descending
    const reachedApex = this.vy >= -0.8 || this.y <= this.targetY;
    if (reachedApex || this.y < 30) {
      if (this.onDetonate) {
        this.onDetonate(this);
      }
      this.inUse = false;
      return false;
    }

    return true;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    if (!this.inUse || this.trailHistory.length < 2) return;

    // Draw glowing rocket tail
    ctx.beginPath();
    ctx.moveTo(this.trailHistory[0].x, this.trailHistory[0].y);
    for (let i = 1; i < this.trailHistory.length; i++) {
      ctx.lineTo(this.trailHistory[i].x, this.trailHistory[i].y);
    }
    ctx.lineTo(this.x, this.y);

    ctx.strokeStyle = rgbaString(this.color, 0.7);
    ctx.lineWidth = 2.4;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Rocket head core
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // Glowing head aura
    ctx.beginPath();
    ctx.arc(this.x, this.y, 6, 0, Math.PI * 2);
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

