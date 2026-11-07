import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { soundscape } from '../../utils/sound';
import { Sparkles, Flame, Volume2, X } from 'lucide-react';

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  life: number;
}

interface Smoke {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
}

export const CrackerRocket: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rocketRef = useRef<HTMLDivElement | null>(null);

  // Position and Physics state stored in refs for 60fps raf loop without re-renders
  const stateRef = useRef({
    x: typeof window !== 'undefined' ? window.innerWidth * 0.8 : 500,
    y: typeof window !== 'undefined' ? window.innerHeight * 0.2 : 200,
    targetX: typeof window !== 'undefined' ? window.innerWidth * 0.8 : 500,
    targetY: typeof window !== 'undefined' ? window.innerHeight * 0.2 : 200,
    vx: 0,
    vy: 0,
    angle: -25,
    targetAngle: -25,
    scrollSpeed: 0,
    lastScrollY: 0,
    lastTime: Date.now(),
    isLooping: false,
    loopProgress: 0,
    hasBurstAtBottom: false,
  });

  const [isActive, setIsActive] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [burstCount, setBurstCount] = useState(0);

  // Sparks and Smoke Particle Pools
  const sparksRef = useRef<Spark[]>([]);
  const smokeRef = useRef<Smoke[]>([]);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Scroll tracking
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalScroll > 0 ? Math.min(1, Math.max(0, scrollY / totalScroll)) : 0;

      const now = Date.now();
      const dt = Math.max(1, now - stateRef.current.lastTime);
      const deltaScroll = Math.abs(scrollY - stateRef.current.lastScrollY);
      const speed = deltaScroll / dt;
      stateRef.current.scrollSpeed = Math.min(15, speed * 25);
      stateRef.current.lastScrollY = scrollY;
      stateRef.current.lastTime = now;

      // Play subtle propellant hiss on sudden high-speed scroll bursts
      if (speed > 2.5 && Math.random() < 0.2) {
        soundscape.playRocketWoosh();
      }

      // Calculate path with alternating serpentine curves across 5 chapters
      // Chapter 1 (p 0-0.2): Right side (80%) -> sweeping to Left
      // Chapter 2 (p 0.2-0.45): Left (15%) -> sweeping to Right (85%)
      // Chapter 3 (p 0.45-0.7): Right (85%) -> sweeping to Left (18%)
      // Chapter 4 (p 0.7-0.9): Left (18%) -> sweeping to Right (80%)
      // Chapter 5 (p 0.9-1.0): Right -> Center (50%)
      const oscillation = Math.cos(progress * Math.PI * 4.2);
      const marginX = Math.min(120, width * 0.12);
      const availableWidth = width - marginX * 2;

      // X coordinate alternates between right and left
      const nextTargetX = marginX + availableWidth * (0.5 + 0.44 * oscillation);

      // Y coordinate glides from upper region to lower-mid region as user scrolls
      const topY = height * 0.16;
      const bottomY = height * 0.72;
      const nextTargetY = topY + (bottomY - topY) * progress;

      stateRef.current.targetX = nextTargetX;
      stateRef.current.targetY = nextTargetY;

      // Check if reached bottom section for automatic grand celebration burst
      if (progress > 0.97 && !stateRef.current.hasBurstAtBottom) {
        stateRef.current.hasBurstAtBottom = true;
        triggerExplosion(stateRef.current.x, stateRef.current.y);
      } else if (progress < 0.9) {
        stateRef.current.hasBurstAtBottom = false;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Palette for Diwali sparkler sparks
    const sparkColors = ['#FFE29A', '#FDB863', '#FF6B00', '#FF3366', '#FFFFFF', '#F4C4D2'];

    // Main animation loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const state = stateRef.current;

      // 1. Physics interpolation (smooth lerp with momentum)
      const prevX = state.x;
      const prevY = state.y;

      const lerpFactor = 0.085;
      state.x += (state.targetX - state.x) * lerpFactor;
      state.y += (state.targetY - state.y) * lerpFactor;

      state.vx = state.x - prevX;
      state.vy = state.y - prevY;

      // Decay scroll speed
      state.scrollSpeed *= 0.92;

      // 2. Compute dynamic tilt angle based on velocity vector
      const speed = Math.hypot(state.vx, state.vy);
      if (!state.isLooping) {
        if (speed > 0.8) {
          // Point nose forward in trajectory direction
          // Rocket SVG is oriented with nose at (0, -height), tail pointing down
          // Angle 0 = pointing straight UP.
          // atan2(vy, vx) gives direction. Offset by 90deg so nose aligns with velocity vector.
          const movementAngle = (Math.atan2(state.vy, state.vx) * 180) / Math.PI + 90;
          state.targetAngle = movementAngle;
        } else {
          // Idle breathing tilt
          state.targetAngle = Math.sin(Date.now() * 0.002) * 8;
        }

        // Smooth angle lerping
        let diff = state.targetAngle - state.angle;
        while (diff < -180) diff += 360;
        while (diff > 180) diff -= 360;
        state.angle += diff * 0.1;
      } else {
        // Special 360 degree loop on click
        state.loopProgress += 0.08;
        state.angle += 28;
        if (state.loopProgress >= 1) {
          state.isLooping = false;
          state.loopProgress = 0;
        }
      }

      // Update rocket DOM position & rotation
      if (rocketRef.current) {
        const scale = window.innerWidth < 640 ? 0.75 : 1;
        rocketRef.current.style.transform = `translate3d(${state.x}px, ${state.y}px, 0) rotate(${state.angle}deg) scale(${scale})`;
      }

      // 3. Spawn Rocket Thruster Sparks from the nozzle
      // Rocket origin is at center. Tail nozzle is at distance ~65px backwards along rocket angle
      const rad = ((state.angle + 90) * Math.PI) / 180;
      const nozzleOffset = 70;
      const nozzleX = state.x - Math.cos(rad) * nozzleOffset;
      const nozzleY = state.y - Math.sin(rad) * nozzleOffset;

      // Spawn rate depends on motion / speed
      const intensity = Math.max(1, Math.floor(state.scrollSpeed * 0.8) + (speed > 1 ? 3 : 1));
      for (let i = 0; i < intensity; i++) {
        // Backward spray velocity
        const spread = (Math.random() - 0.5) * 0.8;
        const thrustSpeed = Math.random() * 4 + 3 + state.scrollSpeed * 0.5;
        const sparkAngle = rad + Math.PI + spread;

        sparksRef.current.push({
          x: nozzleX + (Math.random() - 0.5) * 6,
          y: nozzleY + (Math.random() - 0.5) * 6,
          vx: Math.cos(sparkAngle) * thrustSpeed + (Math.random() - 0.5) * 2,
          vy: Math.sin(sparkAngle) * thrustSpeed + Math.random() * 1.5,
          size: Math.random() * 2.8 + 1.2,
          color: sparkColors[Math.floor(Math.random() * sparkColors.length)],
          alpha: 1,
          decay: Math.random() * 0.035 + 0.02,
          life: 1,
        });
      }

      // Spawn smoke puffs when moving fast
      if (speed > 2.5 || state.scrollSpeed > 2) {
        smokeRef.current.push({
          x: nozzleX,
          y: nozzleY,
          vx: (Math.random() - 0.5) * 1.5,
          vy: Math.random() * 1.5 + 0.5,
          size: Math.random() * 6 + 4,
          alpha: 0.35,
          decay: 0.015,
        });
      }

      // 4. Render and update Smoke Puffs
      for (let i = smokeRef.current.length - 1; i >= 0; i--) {
        const sm = smokeRef.current[i];
        sm.x += sm.vx;
        sm.y += sm.vy;
        sm.size += 0.4;
        sm.alpha -= sm.decay;

        if (sm.alpha <= 0) {
          smokeRef.current.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(sm.x, sm.y, sm.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(169, 155, 191, ${sm.alpha * 0.35})`;
        ctx.fill();
      }

      // 5. Render and update Sparks
      for (let i = sparksRef.current.length - 1; i >= 0; i--) {
        const sp = sparksRef.current[i];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.vy += 0.12; // gravity pulling sparks gently down
        sp.vx *= 0.97;
        sp.life -= sp.decay;
        sp.alpha = Math.max(0, sp.life);

        if (sp.life <= 0) {
          sparksRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size * sp.alpha, 0, Math.PI * 2);
        ctx.fillStyle = sp.color;
        ctx.shadowColor = sp.color;
        ctx.shadowBlur = 8;
        ctx.globalAlpha = sp.alpha;
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isActive]);

  // Trigger grand firecracker explosion burst
  const triggerExplosion = (x: number, y: number) => {
    soundscape.playCrackerBurst();
    setBurstCount((c) => c + 1);

    const normX = x / window.innerWidth;
    const normY = y / window.innerHeight;

    // Aerial starburst
    confetti({
      particleCount: 50,
      spread: 80,
      origin: { x: normX, y: normY },
      colors: ['#FFE29A', '#FDB863', '#FF4500', '#E98EAF', '#F4C4D2', '#00F0FF'],
      ticks: 200,
      gravity: 0.8,
      scalar: 1.1,
    });

    // Secondary crackling sparkle spray
    setTimeout(() => {
      confetti({
        particleCount: 25,
        spread: 120,
        origin: { x: normX, y: normY },
        colors: ['#FFFFFF', '#FFE29A', '#FDB863'],
        shapes: ['circle'],
        scalar: 0.7,
      });
    }, 150);
  };

  const handleRocketClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    stateRef.current.isLooping = true;
    stateRef.current.loopProgress = 0;
    triggerExplosion(stateRef.current.x, stateRef.current.y);
  };

  if (!isActive) {
    return (
      <button
        onClick={() => setIsActive(true)}
        className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-[#102C38]/90 border border-[#E98EAF]/50 text-[#FFE29A] shadow-xl hover:scale-110 transition-all group flex items-center space-x-2 text-xs uppercase tracking-wider"
        title="Launch Diwali Cracker Rocket"
      >
        <Flame className="w-4 h-4 text-[#FF6B00] animate-bounce" />
        <span className="hidden sm:inline">Launch Rocket</span>
      </button>
    );
  }

  return (
    <>
      {/* 1. Fullscreen Canvas for Spark Particles and Smoke Plumes */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-30 pointer-events-none w-full h-full"
      />

      {/* 2. Realistic Indian Cracker Rocket SVG Element */}
      <div
        ref={rocketRef}
        onClick={handleRocketClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="fixed top-0 left-0 z-40 -translate-x-1/2 -translate-y-1/2 cursor-pointer select-none group will-change-transform"
        style={{ width: '80px', height: '190px' }}
        title="Click rocket to burst Diwali fireworks!"
      >
        {/* Hover Tooltip */}
        <div
          className={`absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full bg-[#061116]/90 border border-[#E98EAF] text-[10px] tracking-widest uppercase text-[#FFE29A] shadow-lg pointer-events-none transition-all duration-300 ${
            isHovered ? 'opacity-100 -translate-y-2' : 'opacity-0 translate-y-0'
          }`}
        >
          ✨ Click to Burst!
        </div>

        {/* Ambient Thruster Glow Halo */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-t from-[#FF6B00]/70 via-[#FDB863]/40 to-transparent blur-md pointer-events-none animate-pulse" />

        {/* Detailed Traditional Indian Cracker Rocket SVG */}
        <svg
          width="80"
          height="190"
          viewBox="0 0 80 190"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
        >
          <defs>
            {/* Nose Cone Glossy Red Gradient */}
            <linearGradient id="noseConeGrad" x1="40" y1="10" x2="60" y2="45" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FF4D4D" />
              <stop offset="50%" stopColor="#C9182B" />
              <stop offset="100%" stopColor="#800E13" />
            </linearGradient>

            {/* Cylinder Foil Body Gradient */}
            <linearGradient id="rocketBodyGrad" x1="28" y1="45" x2="52" y2="105" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1B3B4B" />
              <stop offset="35%" stopColor="#102C38" />
              <stop offset="70%" stopColor="#0B1D25" />
              <stop offset="100%" stopColor="#17313F" />
            </linearGradient>

            {/* Gold Foil Accent Bands */}
            <linearGradient id="goldFoilGrad" x1="28" y1="45" x2="52" y2="45" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FDB863" />
              <stop offset="50%" stopColor="#FFF2B2" />
              <stop offset="100%" stopColor="#C47E20" />
            </linearGradient>

            {/* Natural Bamboo Wood Stick Gradient */}
            <linearGradient id="bambooGrad" x1="39" y1="50" x2="43" y2="175" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#DDB892" />
              <stop offset="50%" stopColor="#B08968" />
              <stop offset="100%" stopColor="#7F5539" />
            </linearGradient>

            {/* Terracotta Nozzle */}
            <linearGradient id="nozzleClayGrad" x1="33" y1="105" x2="47" y2="114" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#9C4D38" />
              <stop offset="100%" stopColor="#5E2718" />
            </linearGradient>

            {/* Jet Exhaust Flame */}
            <radialGradient id="rocketFlameCore" cx="50%" cy="10%" r="90%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#FFE082" />
              <stop offset="65%" stopColor="#FF6D00" />
              <stop offset="100%" stopColor="#DD2C00" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* 1. BAMBOO GUIDE STICK (Baans ki Tili) extending full length */}
          <rect x="38.5" y="48" width="3" height="126" rx="1.5" fill="url(#bambooGrad)" />
          {/* Bamboo nodes / segments */}
          <line x1="38" y1="75" x2="42" y2="75" stroke="#7F5539" strokeWidth="1.2" />
          <line x1="38" y1="110" x2="42" y2="110" stroke="#7F5539" strokeWidth="1.2" />
          <line x1="38" y1="145" x2="42" y2="145" stroke="#7F5539" strokeWidth="1.2" />

          {/* 2. ROCKET CYLINDER BODY (Festive rolled paper casing) */}
          <rect x="29" y="45" width="22" height="60" rx="3" fill="url(#rocketBodyGrad)" stroke="#FFE29A" strokeWidth="0.8" />

          {/* Festive Gold & Crimson Diagonal Bands */}
          <path d="M29 55 L38 45 M29 70 L51 48 M29 85 L51 63 M29 100 L51 78 M37 105 L51 93" stroke="#FDB863" strokeWidth="1.2" opacity="0.85" />
          <path d="M29 62 L46 45 M29 77 L51 55 M29 92 L51 70" stroke="#E98EAF" strokeWidth="0.8" opacity="0.75" />

          {/* Rocket Brand Stamp: JYOTI */}
          <g transform="rotate(-90 40 75)">
            <text x="22" y="79" fill="#FFF8E7" fontSize="8" fontWeight="bold" fontFamily="serif" letterSpacing="2.5">
              JYOTI
            </text>
          </g>

          {/* Metallic Binding Rings tying the stick to the body */}
          <rect x="28" y="52" width="24" height="3" rx="1" fill="url(#goldFoilGrad)" />
          <rect x="28" y="96" width="24" height="3" rx="1" fill="url(#goldFoilGrad)" />

          {/* 3. POINTED CONICAL NOSE CONE */}
          {/* Base shadow */}
          <ellipse cx="40" cy="45" rx="12" ry="3.5" fill="#4A050B" />
          {/* Main cone */}
          <path d="M40 10 L52 45 C48 48 32 48 28 45 Z" fill="url(#noseConeGrad)" stroke="#FFE29A" strokeWidth="0.8" />
          {/* Glossy specular highlight reflection */}
          <path d="M40 13 L47 43 C44 45 39 44 38 43 Z" fill="#FFFFFF" opacity="0.35" />

          {/* 4. CLAY NOZZLE AT BASE */}
          <path d="M33 105 L47 105 L44 114 L36 114 Z" fill="url(#nozzleClayGrad)" stroke="#3E1408" strokeWidth="0.8" />

          {/* 5. INCANDESCENT THRUSTER JET FLAME */}
          <g className="origin-top animate-flame" style={{ transformOrigin: '40px 114px' }}>
            {/* Outer expanding orange-red plume */}
            <path
              d="M36 114 C33 130 30 145 40 162 C50 145 47 130 44 114 Z"
              fill="url(#rocketFlameCore)"
            />
            {/* Inner hot yellow-white plasma flame */}
            <path
              d="M37.5 114 C35 125 35 136 40 148 C45 136 45 125 42.5 114 Z"
              fill="#FFFFFF"
              opacity="0.9"
            />
            {/* Diamond tip core spark */}
            <circle cx="40" cy="120" r="2.5" fill="#FFE29A" className="animate-ping" />
          </g>
        </svg>
      </div>

      {/* 3. Subtle Rocket Controls Pill in Bottom Right */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center space-x-2 bg-[#061116]/80 backdrop-blur-md border border-[#A99BBF]/25 rounded-full p-1.5 shadow-xl select-none">
        <button
          onClick={(e) => {
            e.stopPropagation();
            stateRef.current.isLooping = true;
            stateRef.current.loopProgress = 0;
            triggerExplosion(stateRef.current.x, stateRef.current.y);
          }}
          className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#E98EAF]/25 to-[#FDB863]/25 hover:from-[#E98EAF]/40 hover:to-[#FDB863]/40 text-[#FFE29A] text-[11px] font-medium tracking-wider uppercase transition-all flex items-center space-x-1.5 focus:outline-none"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#FDB863]" />
          <span>Burst ({burstCount})</span>
        </button>

        <button
          onClick={() => setIsActive(false)}
          className="p-1.5 rounded-full text-[#A99BBF] hover:text-[#F3EAE2] transition-colors focus:outline-none"
          title="Dismiss Rocket"
          aria-label="Dismiss Rocket"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </>
  );
};
