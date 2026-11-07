import React, { useState, useRef, useEffect } from 'react';
import { RegionData } from '../../data/regionsData';
import { soundscape } from '../../utils/sound';
import { fireworks } from '../../fireworks';
import { RotateCcw, Flame, Check } from 'lucide-react';

interface CulturalInteractionModuleProps {
  region: RegionData;
}

export const CulturalInteractionModule: React.FC<CulturalInteractionModuleProps> = ({ region }) => {
  const moduleType = region.interactiveModule.type;

  return (
    <div className="p-6 sm:p-10 rounded-3xl bg-[#0A131E]/90 border border-[#B8DAD3]/25 shadow-2xl backdrop-blur-md select-none">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#E8A1BC] font-medium block mb-2">
          Cultural Interaction · {region.name}
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl text-[#F2EAE5] font-normal">
          {region.interactiveModule.title}
        </h3>
        <p className="font-display italic text-sm text-[#B8DAD3] mt-1 font-light">
          {region.interactiveModule.subtitle}
        </p>
        <p className="text-xs text-[#F2EAE5]/70 mt-2 font-light">
          {region.interactiveModule.instruction}
        </p>
      </div>

      {/* Specific Module Render */}
      {moduleType === 'alpana-canvas' && <AlpanaCanvasModule />}
      {moduleType === 'kolam-generator' && <KolamMatrixModule />}
      {moduleType === 'rangoli-composer' && <RangoliComposerModule />}
      {moduleType === 'diya-multiplier' && <DeepotsavMultiplierModule />}
      {moduleType === 'ganga-deepdaan' && <GangaDeepdaanModule />}
      {moduleType === 'effigy-spark' && <EffigySparkModule />}
    </div>
  );
};

// 1. Bengal: Sacred Alpana Canvas
const AlpanaCanvasModule: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeCount, setStrokeCount] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw initial traditional motif template faintly
    ctx.fillStyle = '#101C2B';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(232, 161, 188, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 70, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 120, 0, Math.PI * 2);
    ctx.stroke();
  }, []);

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDraw = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.beginPath();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing && e.type !== 'mousedown' && e.type !== 'touchstart') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    // White rice flour stroke with natural soft bleed
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#F2EAE5';
    ctx.shadowColor = '#B8DAD3';
    ctx.shadowBlur = 6;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);

    setStrokeCount((c) => c + 1);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#101C2B';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setStrokeCount(0);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative rounded-2xl overflow-hidden border border-[#343E50] shadow-xl w-full max-w-lg aspect-square">
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="w-full h-full cursor-crosshair touch-none"
          onMouseDown={startDraw}
          onMouseUp={stopDraw}
          onMouseMove={draw}
          onTouchStart={startDraw}
          onTouchEnd={stopDraw}
          onTouchMove={draw}
        />
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={clearCanvas}
          className="px-4 py-2 rounded-full border border-[#343E50] text-[#B8DAD3] hover:text-[#F2EAE5] text-xs uppercase tracking-wider flex items-center space-x-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Cloth</span>
        </button>
        <span className="text-[11px] text-[#B8DAD3]/70 font-light">
          Rice Paste Strokes: {strokeCount}
        </span>
      </div>
    </div>
  );
};

// 2. Tamil Nadu: Brahma Muhurta Kolam Dot Grid Generator
const KolamMatrixModule: React.FC = () => {
  const gridSize = 5;
  const [activeLines, setActiveLines] = useState<Set<string>>(new Set());
  const [selectedDot, setSelectedDot] = useState<number | null>(null);

  const dots = Array.from({ length: gridSize * gridSize }, (_, i) => ({
    id: i,
    row: Math.floor(i / gridSize),
    col: i % gridSize,
  }));

  const handleDotClick = (id: number) => {
    soundscape.playDiyaChime();
    if (selectedDot === null) {
      setSelectedDot(id);
    } else {
      if (selectedDot !== id) {
        const lineKey = `${Math.min(selectedDot, id)}-${Math.max(selectedDot, id)}`;
        setActiveLines((prev) => {
          const next = new Set(prev);
          if (next.has(lineKey)) next.delete(lineKey);
          else next.add(lineKey);
          return next;
        });
      }
      setSelectedDot(null);
    }
  };

  const clearLines = () => {
    setActiveLines(new Set());
    setSelectedDot(null);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="p-6 sm:p-8 rounded-2xl bg-[#101C2B] border border-[#343E50] shadow-xl relative w-full max-w-sm aspect-square flex items-center justify-center">
        {/* Render lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none p-6 sm:p-8">
          {Array.from(activeLines).map((lineKey) => {
            const [p1, p2] = lineKey.split('-').map(Number);
            const r1 = Math.floor(p1 / gridSize);
            const c1 = p1 % gridSize;
            const r2 = Math.floor(p2 / gridSize);
            const c2 = p2 % gridSize;
            const x1 = `${(c1 / (gridSize - 1)) * 100}%`;
            const y1 = `${(r1 / (gridSize - 1)) * 100}%`;
            const x2 = `${(c2 / (gridSize - 1)) * 100}%`;
            const y2 = `${(r2 / (gridSize - 1)) * 100}%`;

            return (
              <line
                key={lineKey}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#F2EAE5"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="drop-shadow-[0_0_6px_#B8DAD3]"
              />
            );
          })}
        </svg>

        {/* Render Dots */}
        <div className="grid grid-cols-5 gap-6 sm:gap-8 relative z-10 w-full h-full justify-items-center items-center">
          {dots.map((dot) => {
            const isSelected = selectedDot === dot.id;
            return (
              <button
                key={dot.id}
                onClick={() => handleDotClick(dot.id)}
                className={`w-3.5 h-3.5 rounded-full transition-all focus:outline-none ${
                  isSelected
                    ? 'bg-[#E8A1BC] scale-150 shadow-[0_0_12px_#E8A1BC]'
                    : 'bg-[#B8DAD3]/60 hover:bg-[#F2EAE5] hover:scale-125'
                }`}
                aria-label={`Dot ${dot.id}`}
              />
            );
          })}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={clearLines}
          className="px-4 py-2 rounded-full border border-[#343E50] text-[#B8DAD3] hover:text-[#F2EAE5] text-xs uppercase tracking-wider flex items-center space-x-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Kolam</span>
        </button>
        <span className="text-[11px] text-[#B8DAD3]/70 font-light">
          Connected Loops: {activeLines.size}
        </span>
      </div>
    </div>
  );
};

// 3. Gujarat: Rangoli Color Palette Composer
const RangoliComposerModule: React.FC = () => {
  const pigments = [
    { name: 'Gulal Pink', color: '#E8A1BC' },
    { name: 'Sage Teal', color: '#B8DAD3' },
    { name: 'Haldi Gold', color: '#FFE29A' },
    { name: 'Peacock Indigo', color: '#343E50' },
    { name: 'Sindoor Red', color: '#D16D91' },
  ];
  const [selectedPigment, setSelectedPigment] = useState(pigments[0].color);
  const [petalColors, setPetalColors] = useState<string[]>(
    Array(8).fill('#1A2838')
  );

  const fillPetal = (idx: number) => {
    soundscape.playDiyaChime();
    setPetalColors((prev) => {
      const copy = [...prev];
      copy[idx] = selectedPigment;
      return copy;
    });
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Palette selector */}
      <div className="flex items-center space-x-3">
        <span className="text-xs uppercase tracking-wider text-[#B8DAD3]/80">
          Pigment:
        </span>
        {pigments.map((p) => (
          <button
            key={p.name}
            onClick={() => setSelectedPigment(p.color)}
            className={`w-7 h-7 rounded-full border-2 transition-transform focus:outline-none ${
              selectedPigment === p.color ? 'scale-125 border-[#F2EAE5]' : 'border-transparent'
            }`}
            style={{ backgroundColor: p.color }}
            title={p.name}
          />
        ))}
      </div>

      {/* Rangoli Octagonal Mandala */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
        <svg viewBox="0 0 200 200" className="w-full h-full filter drop-shadow-xl">
          {petalColors.map((col, i) => {
            const rot = i * 45;
            return (
              <g key={i} transform={`rotate(${rot} 100 100)`}>
                <path
                  d="M100,20 Q125,70 100,100 Q75,70 100,20 Z"
                  fill={col}
                  stroke="#343E50"
                  strokeWidth="1.5"
                  className="cursor-pointer transition-colors duration-300 hover:opacity-85"
                  onClick={() => fillPetal(i)}
                />
              </g>
            );
          })}
          <circle cx="100" cy="100" r="16" fill="#F2EAE5" stroke="#343E50" strokeWidth="2" />
        </svg>
      </div>

      <p className="text-[11px] text-[#B8DAD3]/70 font-light">
        Tap the 8 petals to fill with auspicious dry-powder hues.
      </p>
    </div>
  );
};

// 4. Ayodhya: Deepotsav Multiplier Module
const DeepotsavMultiplierModule: React.FC = () => {
  const [count, setCount] = useState(108);

  const kindleLamps = () => {
    soundscape.playDiyaChime();
    setCount((prev) => prev + 108);

    const x = typeof window !== 'undefined' ? window.innerWidth * 0.5 : 400;
    const y = typeof window !== 'undefined' ? window.innerHeight * 0.4 : 300;
    fireworks.burst(x, y, {
      type: 'chrysanthemum',
      color: '#FFE29A',
      secondaryColor: '#B8DAD3',
      particleCount: 75,
    });
  };

  return (
    <div className="flex flex-col items-center space-y-4 text-center">
      <div className="font-mono text-4xl sm:text-5xl text-[#FFE29A] tracking-widest font-semibold">
        {count.toLocaleString()}
      </div>
      <p className="text-xs uppercase tracking-[0.25em] text-[#B8DAD3]">
        Diyas Illuminated Along the Sarayu
      </p>
      <button
        onClick={kindleLamps}
        className="mt-2 py-3 px-8 rounded-full border border-[#E8A1BC] bg-[#E8A1BC]/15 hover:bg-[#E8A1BC]/25 text-[#F2EAE5] text-xs uppercase tracking-[0.22em] transition-all flex items-center space-x-2"
      >
        <Flame className="w-4 h-4 text-[#FFE29A]" />
        <span>Kindle Next Tier (+108 Diyas)</span>
      </button>
    </div>
  );
};

// 5. Varanasi: Ganga Deepdaan Floating Lamp Module
const GangaDeepdaanModule: React.FC = () => {
  const [floatingLamps, setFloatingLamps] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const releaseLamp = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    soundscape.playLanternSound();
    const newLamp = { id: Date.now(), x, y };
    setFloatingLamps((prev) => [...prev, newLamp]);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div
        onClick={releaseLamp}
        className="relative w-full max-w-xl h-60 rounded-2xl bg-gradient-to-b from-[#101C2B] via-[#0A131E] to-[#040C10] border border-[#343E50] overflow-hidden cursor-pointer shadow-inner"
      >
        {/* River current lines */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(#B8DAD3_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>

        {/* Floating leaf lamps */}
        {floatingLamps.map((lamp) => (
          <div
            key={lamp.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none transition-all duration-1000"
            style={{ left: `${lamp.x}%`, top: `${lamp.y}%` }}
          >
            {/* Flame */}
            <div className="w-2.5 h-3 bg-[#FFE29A] rounded-full animate-flame shadow-[0_0_12px_#FFE29A]" />
            {/* Earthen dona leaf */}
            <div className="w-6 h-2.5 rounded-full bg-[#343E50] border border-[#B8DAD3]/40 -mt-1" />
          </div>
        ))}

        <div className="absolute bottom-3 left-4 text-[10px] uppercase tracking-wider text-[#B8DAD3]/60 font-light">
          Click river surface to release a sacred Deepdaan
        </div>
      </div>
      <span className="text-xs text-[#B8DAD3]/70 font-light">
        Released to Mother Ganga: {floatingLamps.length} offerings
      </span>
    </div>
  );
};

// 6. Goa: Dawn Effigy Spark Module
const EffigySparkModule: React.FC = () => {
  const [ignited, setIgnited] = useState(false);

  const igniteDawn = () => {
    soundscape.playDiyaChime();
    setIgnited(true);

    const x = typeof window !== 'undefined' ? window.innerWidth * 0.5 : 400;
    const y = typeof window !== 'undefined' ? window.innerHeight * 0.45 : 300;
    fireworks.burst(x, y, {
      type: 'crackler',
      color: '#E8A1BC',
      secondaryColor: '#FFE29A',
      particleCount: 90,
    });
  };

  return (
    <div className="flex flex-col items-center space-y-4 text-center">
      <div className="w-24 h-24 rounded-full border border-[#B8DAD3]/30 flex items-center justify-center bg-[#101C2B] shadow-xl">
        <Flame
          className={`w-10 h-10 transition-colors ${
            ignited ? 'text-[#FFE29A] animate-pulse' : 'text-[#343E50]'
          }`}
        />
      </div>
      <p className="text-xs uppercase tracking-[0.25em] text-[#B8DAD3]">
        {ignited ? 'Narakasura Consigned to Dawn Flame' : 'Flint Awaiting Strike'}
      </p>
      <button
        onClick={igniteDawn}
        disabled={ignited}
        className="py-3 px-8 rounded-full border border-[#E8A1BC] bg-[#E8A1BC]/15 hover:bg-[#E8A1BC]/25 disabled:opacity-50 text-[#F2EAE5] text-xs uppercase tracking-[0.22em] transition-all"
      >
        {ignited ? 'Dawn of Light Awakened' : 'Strike Torch at Daybreak'}
      </button>
    </div>
  );
};

