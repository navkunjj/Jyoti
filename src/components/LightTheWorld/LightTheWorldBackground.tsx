import React, { useEffect, useRef } from 'react';

// Native dimensions of the uploaded riverside Diwali image
const IMAGE_WIDTH = 1024;
const IMAGE_HEIGHT = 542;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  color: string;
  size: number;
  friction: number;
  gravity: number;
  twinkle: boolean;
  shimmerOffset: number;
}

interface Flash {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  color: string;
}

interface Rocket {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  depth: number;
  trail: { x: number; y: number; alpha: number }[];
}

interface ExplosionBurst {
  depth: number;
  particles: Particle[];
  flash?: Flash;
}

// Vibrant Diwali night sky color schemes: Brilliant warm golds, radiant ambers, and festive crimson
const COLOR_THEMES = [
  // 1. Brilliant Imperial Gold
  {
    primary: '#FFEAA7',
    secondary: '#FDCB6E',
    accent: '#FFFFFF',
    flash: '#F9CA24',
  },
  // 2. Radiant Diya Amber & Fire
  {
    primary: '#FF9F43',
    secondary: '#F39C12',
    accent: '#FFF2CC',
    flash: '#E67E22',
  },
  // 3. Auspicious Pure Gold with White Stars
  {
    primary: '#FFF3BF',
    secondary: '#FFD43B',
    accent: '#FFFFFF',
    flash: '#FAB005',
  },
  // 4. Festive Ruby & Rose Gold
  {
    primary: '#FF7675',
    secondary: '#D63031',
    accent: '#FFEAA7',
    flash: '#E84118',
  },
  // 5. Golden Brocade / Weeping Willow
  {
    primary: '#F6E58D',
    secondary: '#FFBE76',
    accent: '#FFFFFF',
    flash: '#F0932B',
  },
];

export const LightTheWorldBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let vpWidth = window.innerWidth;
    let vpHeight = window.innerHeight;

    const setupCanvas = () => {
      vpWidth = window.innerWidth;
      vpHeight = window.innerHeight;
      canvas.width = vpWidth * dpr;
      canvas.height = vpHeight * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    setupCanvas();
    window.addEventListener('resize', setupCanvas, { passive: true });

    // Mathematical projection of background-size: cover into viewport coordinates
    const getCoverGeometry = () => {
      const imgAspect = IMAGE_WIDTH / IMAGE_HEIGHT; // ~1.889
      const vpAspect = vpWidth / vpHeight;

      let renderWidth: number;
      let renderHeight: number;
      let offsetX: number;
      let offsetY: number;

      if (vpAspect > imgAspect) {
        renderWidth = vpWidth;
        renderHeight = vpWidth / imgAspect;
        offsetX = 0;
        offsetY = (vpHeight - renderHeight) / 2;
      } else {
        renderHeight = vpHeight;
        renderWidth = vpHeight * imgAspect;
        offsetX = (vpWidth - renderWidth) / 2;
        offsetY = 0;
      }

      return { renderWidth, renderHeight, offsetX, offsetY };
    };

    // Calculate natural sky burst coordinates aligned with the background image
    const getSkyBurstCoord = () => {
      const { renderWidth, renderHeight, offsetX, offsetY } = getCoverGeometry();

      // Clamp horizontal normalized position u within visible image range on current screen
      const uVisibleMin = Math.max(0.08, -offsetX / renderWidth + 0.05);
      const uVisibleMax = Math.min(0.92, (vpWidth - offsetX) / renderWidth - 0.05);
      const u = uVisibleMin + Math.random() * (uVisibleMax - uVisibleMin);

      // Determine skyline threshold v based on image content at position u
      // Over the left river (u < 0.54): sky down to v ~ 0.44
      // Over distant ghats (0.54 <= u < 0.78): skyline is at v ~ 0.36
      // Over right palace spires (u >= 0.78): roofs rise up to v ~ 0.22
      let maxV: number;
      if (u < 0.54) {
        maxV = 0.44;
      } else if (u < 0.78) {
        maxV = 0.35;
      } else {
        maxV = 0.22;
      }

      const minV = 0.06;
      const v = minV + Math.random() * (maxV - minV);

      // Map to exact viewport pixels
      const x = offsetX + u * renderWidth;
      const y = offsetY + v * renderHeight;

      // Launch start position from the horizon / ghats level
      const launchY = offsetY + (maxV + 0.05) * renderHeight;
      const launchX = x + (Math.random() - 0.5) * 40;

      return { x, y, launchX, launchY };
    };

    const activeRockets: Rocket[] = [];
    const activeBursts: ExplosionBurst[] = [];

    // Launch an atmospheric distant rocket from behind the ghats
    const launchFirework = (targetPos?: { x: number; y: number }) => {
      const { x, y, launchX, launchY } = targetPos
        ? {
            x: targetPos.x,
            y: targetPos.y,
            launchX: targetPos.x + (Math.random() - 0.5) * 30,
            launchY: Math.min(vpHeight * 0.85, targetPos.y + 180 + Math.random() * 100),
          }
        : getSkyBurstCoord();

      const theme = COLOR_THEMES[Math.floor(Math.random() * COLOR_THEMES.length)];
      const depth = 0.6 + Math.random() * 0.4; // 0.6 to 1.0

      const travelY = launchY - y;
      const frames = Math.max(30, Math.floor(travelY / (4.5 * depth)));
      const vy = -travelY / frames;
      const vx = (x - launchX) / frames;

      activeRockets.push({
        x: launchX,
        y: launchY,
        targetX: x,
        targetY: y,
        vx,
        vy,
        alpha: 0.9,
        color: theme.primary,
        depth,
        trail: [],
      });
    };

    // Detonate rocket into hundreds of brilliant radial sparks
    const detonateRocket = (rocket: Rocket) => {
      const theme = COLOR_THEMES[Math.floor(Math.random() * COLOR_THEMES.length)];
      const depth = rocket.depth;

      // Realistic particle count: 85 to 140 particles
      const particleCount = Math.floor(85 + Math.random() * 55);
      const particles: Particle[] = [];

      // Radial spherical blast velocity
      const maxSpeed = 2.4 + Math.random() * 2.2;

      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        // Natural distribution: denser core, dispersing outwards
        const speed = (0.2 + Math.pow(Math.random(), 1.4) * 0.8) * maxSpeed;

        const colorRoll = Math.random();
        const color =
          colorRoll > 0.4
            ? theme.primary
            : colorRoll > 0.15
            ? theme.secondary
            : theme.accent;

        particles.push({
          x: rocket.targetX,
          y: rocket.targetY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          decay: 0.010 + Math.random() * 0.009,
          color,
          // Clearly visible spark size: 1.2px to 2.4px
          size: 1.2 + Math.random() * 1.2,
          friction: 0.962 + Math.random() * 0.012,
          gravity: 0.032 + Math.random() * 0.024,
          twinkle: Math.random() > 0.3,
          shimmerOffset: Math.random() * 10,
        });
      }

      // Soft ambient light bloom in the night sky around the burst
      const flash: Flash = {
        x: rocket.targetX,
        y: rocket.targetY,
        radius: 65 + Math.random() * 65,
        alpha: 0.45,
        color: theme.flash,
      };

      activeBursts.push({
        depth,
        particles,
        flash,
      });
    };

    // Launch initial fireworks immediately on page load
    launchFirework();
    setTimeout(launchFirework, 350);
    setTimeout(launchFirework, 750);

    let lastLaunch = performance.now();
    let nextDelay = 1100; // Frequent, continuous festive bursts

    const loop = (timestamp: number) => {
      // Clear canvas cleanly so the background image remains uncompromised
      ctx.clearRect(0, 0, vpWidth, vpHeight);

      // Launch management: steady festive rhythm (every 0.9s to 1.8s)
      if (timestamp - lastLaunch > nextDelay) {
        launchFirework();
        lastLaunch = timestamp;
        nextDelay = 900 + Math.random() * 1100;

        // Occasional double firework (distant pair across the sky)
        if (Math.random() < 0.35) {
          setTimeout(() => launchFirework(), 200 + Math.random() * 300);
        }
      }

      const timeSec = timestamp * 0.001;

      // 1. Update and render rising rockets (with visible golden spark trails)
      for (let i = activeRockets.length - 1; i >= 0; i--) {
        const r = activeRockets[i];
        r.x += r.vx;
        r.y += r.vy;

        // Gentle deceleration curve
        r.vy *= 0.985;

        r.trail.push({ x: r.x, y: r.y, alpha: r.alpha });
        if (r.trail.length > 7) r.trail.shift();

        // Draw glowing ascending spark trail
        ctx.save();
        if (r.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(r.trail[0].x, r.trail[0].y);
          for (let j = 1; j < r.trail.length; j++) {
            ctx.lineTo(r.trail[j].x, r.trail[j].y);
          }
          ctx.strokeStyle = `rgba(253, 184, 99, 0.75)`;
          ctx.lineWidth = 1.4;
          ctx.shadowColor = '#FDB863';
          ctx.shadowBlur = 6;
          ctx.stroke();
        }

        // Rocket head spark
        ctx.beginPath();
        ctx.arc(r.x, r.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = '#FFEAA7';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();

        // Trigger burst on reaching target altitude or upward stall
        if (r.y <= r.targetY || r.vy >= -0.4) {
          detonateRocket(r);
          activeRockets.splice(i, 1);
        }
      }

      // 2. Update and render expanding fireworks explosions
      for (let bIdx = activeBursts.length - 1; bIdx >= 0; bIdx--) {
        const burst = activeBursts[bIdx];

        // Draw soft ambient atmospheric flash bloom in the night sky
        if (burst.flash && burst.flash.alpha > 0.01) {
          ctx.save();
          const g = ctx.createRadialGradient(
            burst.flash.x,
            burst.flash.y,
            0,
            burst.flash.x,
            burst.flash.y,
            burst.flash.radius
          );
          g.addColorStop(0, `rgba(253, 203, 110, ${burst.flash.alpha * 0.5})`);
          g.addColorStop(0.4, `rgba(225, 112, 85, ${burst.flash.alpha * 0.2})`);
          g.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(burst.flash.x, burst.flash.y, burst.flash.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          burst.flash.alpha *= 0.86;
        }

        // Render bursting particles with warm radiant glow
        ctx.save();
        for (let pIdx = burst.particles.length - 1; pIdx >= 0; pIdx--) {
          const p = burst.particles[pIdx];

          p.x += p.vx;
          p.y += p.vy;
          p.vx *= p.friction;
          p.vy = p.vy * p.friction + p.gravity;
          p.alpha -= p.decay;

          if (p.alpha <= 0) {
            burst.particles.splice(pIdx, 1);
            continue;
          }

          // Shimmering twinkle
          let currentAlpha = p.alpha;
          if (p.twinkle) {
            const flicker = Math.sin(timeSec * 18 + p.shimmerOffset);
            if (flicker < -0.2) {
              currentAlpha *= 0.55;
            }
          }

          // Outer glowing halo
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 1.8, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, Math.min(1, currentAlpha * 0.45));
          ctx.fill();

          // Bright inner spark core
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 6;
          ctx.globalAlpha = Math.max(0, Math.min(1, currentAlpha));
          ctx.fill();
        }

        ctx.restore();

        // Remove empty bursts
        if (burst.particles.length === 0 && (!burst.flash || burst.flash.alpha <= 0.01)) {
          activeBursts.splice(bIdx, 1);
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    // Optional: Allow user to click anywhere on the sky to launch an instant cracker!
    const handleCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      // If clicked in the upper half (sky region), launch a firework directly there!
      if (clickY < vpHeight * 0.55) {
        launchFirework({ x: clickX, y: clickY });
      }
    };

    window.addEventListener('click', handleCanvasClick);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', setupCanvas);
      window.removeEventListener('click', handleCanvasClick);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Full-viewport fixed Riverside Diwali background image */}
      <div
        className="absolute inset-0 bg-cover bg-center filter brightness-[0.78] transform-gpu scale-[1.02]"
        style={{ backgroundImage: `url('/assets/light-the-world-bg.jpg')` }}
      />

      {/* 2. Deep plum/burgundy atmospheric base tint on the image */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#120413]/50 via-[#160618]/65 to-[#0e0410]/85 pointer-events-none" />

      {/* 3. Sky-Synchronized Fireworks Canvas (Placed ON TOP of the darkened background so sparks are bright and luminous!) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  );
};
