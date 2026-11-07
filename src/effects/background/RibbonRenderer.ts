import { RibbonState } from './background.types';

export class RibbonRenderer {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  public setContext(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  /**
   * Clears the frame and draws all ribbon layers with smooth spline interpolation and luminous blending.
   */
  public render(
    states: RibbonState[],
    width: number,
    height: number,
    _scrollProgress: number,
    _ambientTint?: string
  ): void {
    const ctx = this.ctx;

    // 1. Clear previous frame cleanly
    ctx.clearRect(0, 0, width, height);

    // 2. Render each ribbon layer in back-to-front order
    for (let i = 0; i < states.length; i++) {
      const state = states[i];
      if (state.points.length < 3) continue;

      this.drawRibbonBody(ctx, state);

      if (state.def.hasTrail) {
        this.drawLightTrail(ctx, state);
      }
    }
  }

  /**
   * Draws the flowing translucent ribbon body as a smooth closed spline strip.
   */
  private drawRibbonBody(ctx: CanvasRenderingContext2D, state: RibbonState): void {
    const { upperPoints, lowerPoints, def } = state;
    const len = upperPoints.length;
    if (len < 3) return;

    ctx.save();
    ctx.globalCompositeOperation = def.layer === 'back' ? 'source-over' : 'screen';

    // Linear gradient spanning along the ribbon length
    const startPt = upperPoints[0];
    const endPt = upperPoints[len - 1];
    const grad = ctx.createLinearGradient(startPt.x, startPt.y, endPt.x, endPt.y);

    grad.addColorStop(0.0, def.color.start);
    grad.addColorStop(0.35, def.color.mid);
    grad.addColorStop(0.7, def.color.highlight);
    grad.addColorStop(1.0, def.color.end);

    ctx.fillStyle = grad;
    ctx.beginPath();

    // 1. Trace smooth upper curve
    ctx.moveTo(upperPoints[0].x, upperPoints[0].y);
    for (let i = 0; i < len - 1; i++) {
      const p0 = upperPoints[i];
      const p1 = upperPoints[i + 1];
      const midX = (p0.x + p1.x) / 2;
      const midY = (p0.y + p1.y) / 2;
      ctx.quadraticCurveTo(p0.x, p0.y, midX, midY);
    }
    ctx.lineTo(upperPoints[len - 1].x, upperPoints[len - 1].y);

    // 2. Connect to lower edge
    ctx.lineTo(lowerPoints[len - 1].x, lowerPoints[len - 1].y);

    // 3. Trace smooth lower curve in reverse
    for (let i = len - 1; i > 0; i--) {
      const p0 = lowerPoints[i];
      const p1 = lowerPoints[i - 1];
      const midX = (p0.x + p1.x) / 2;
      const midY = (p0.y + p1.y) / 2;
      ctx.quadraticCurveTo(p0.x, p0.y, midX, midY);
    }
    ctx.lineTo(lowerPoints[0].x, lowerPoints[0].y);

    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  /**
   * Draws a luminous light trail filament tracing the core axis of the ribbon.
   */
  private drawLightTrail(ctx: CanvasRenderingContext2D, state: RibbonState): void {
    const { points, def } = state;
    const len = points.length;
    if (len < 3) return;

    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    // Create glowing filament gradient
    const startPt = points[0];
    const endPt = points[len - 1];
    const trailGrad = ctx.createLinearGradient(startPt.x, startPt.y, endPt.x, endPt.y);

    trailGrad.addColorStop(0.0, 'rgba(255, 255, 255, 0.05)');
    trailGrad.addColorStop(0.25, def.color.highlight);
    trailGrad.addColorStop(0.55, 'rgba(255, 255, 255, 0.95)');
    trailGrad.addColorStop(0.85, def.color.mid);
    trailGrad.addColorStop(1.0, 'rgba(255, 255, 255, 0.05)');

    ctx.strokeStyle = trailGrad;
    ctx.lineWidth = (def.trailWidth || 2) * (0.8 + def.depth * 0.4);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Soft glow bloom for high-depth ribbons
    if (def.depth > 0.5) {
      ctx.shadowColor = def.color.highlight;
      ctx.shadowBlur = 10 * def.depth;
    }

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 0; i < len - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const midX = (p0.x + p1.x) / 2;
      const midY = (p0.y + p1.y) / 2;
      ctx.quadraticCurveTo(p0.x, p0.y, midX, midY);
    }
    ctx.lineTo(points[len - 1].x, points[len - 1].y);

    ctx.stroke();
    ctx.restore();
  }
}

