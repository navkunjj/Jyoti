import React, { useState, useEffect } from 'react';
import { fireworks } from './engine';
import { soundscape } from '../utils/sound';
import {
  triggerHeroFireworks,
  triggerArtFireworks,
  triggerRegionFireworks,
  triggerCelebrationFireworks,
  triggerWishesFireworks,
} from './sequences';
import { EngineStats, FireworkIntensity } from './types';
import { Sparkles, Play, Trash2, Volume2, VolumeX, Eye, X, Activity, Flame } from 'lucide-react';

export const FireworksDebugPanel: React.FC = () => {
  // Only available in development mode
  if (!import.meta.env.DEV) {
    return null;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [intensity, setIntensity] = useState<FireworkIntensity>('medium');
  const [ambientOn, setAmbientOn] = useState(true);
  const [stats, setStats] = useState<EngineStats>({
    activeParticles: 0,
    activeRockets: 0,
    activeEmitters: 0,
    fps: 60,
    poolAvailable: 2000,
  });

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setStats(fireworks.getStats());
    }, 250);
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleIntensityChange = (lvl: FireworkIntensity) => {
    setIntensity(lvl);
    fireworks.setIntensity(lvl);
  };

  const handleToggleAmbient = () => {
    const next = !ambientOn;
    setAmbientOn(next);
    fireworks.ambient(next);
  };

  const triggerType = (type: 'rocket' | 'peony' | 'chrysanthemum' | 'willow' | 'crackler' | 'phuljhari' | 'anar') => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const cx = w * 0.5;
    const cy = h * 0.35;

    if (type === 'rocket') {
      fireworks.launch();
    } else if (type === 'peony') {
      fireworks.burst(cx + (Math.random() - 0.5) * 200, cy, { type: 'peony' });
    } else if (type === 'chrysanthemum') {
      fireworks.burst(cx + (Math.random() - 0.5) * 200, cy, { type: 'chrysanthemum' });
    } else if (type === 'willow') {
      fireworks.burst(cx + (Math.random() - 0.5) * 200, cy, { type: 'willow' });
    } else if (type === 'crackler') {
      fireworks.burst(cx + (Math.random() - 0.5) * 200, cy, { type: 'crackler' });
    } else if (type === 'phuljhari') {
      fireworks.sparkler(cx, cy + 80, { durationMs: 3200 });
    } else if (type === 'anar') {
      fireworks.fountain(cx, h * 0.85, { durationMs: 4000 });
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 select-none font-sans text-xs">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-2 px-3.5 py-2 rounded-full bg-[#102C38]/90 hover:bg-[#102C38] border border-[#E98EAF]/40 text-[#F4C4D2] shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105"
          title="Open Fireworks Engine Debug HUD"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#FFE29A] animate-spin-slow" />
          <span className="font-mono text-[11px] tracking-wider uppercase">Fireworks HUD</span>
        </button>
      ) : (
        <div className="w-80 p-4 rounded-2xl bg-[#061116]/95 border border-[#E98EAF]/50 shadow-2xl backdrop-blur-xl text-[#F3EAE2] space-y-4 animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#A99BBF]/20 pb-2.5">
            <div className="flex items-center space-x-2">
              <Flame className="w-4 h-4 text-[#FDB863]" />
              <span className="font-serif tracking-wider text-sm font-medium text-[#FFE29A]">
                Fireworks Engine HUD
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded text-[#A99BBF] hover:text-[#F3EAE2]"
              aria-label="Close Debug Panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Real-time Performance & Stats */}
          <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-[#102C38]/40 border border-[#A99BBF]/15 font-mono text-[10px]">
            <div>
              <span className="text-[#A99BBF] block">FPS</span>
              <strong className={`${stats.fps > 50 ? 'text-green-400' : 'text-amber-400'} text-xs`}>
                {stats.fps}
              </strong>
            </div>
            <div>
              <span className="text-[#A99BBF] block">Particles</span>
              <strong className="text-[#F4C4D2] text-xs">
                {stats.activeParticles}
              </strong>
            </div>
            <div>
              <span className="text-[#A99BBF] block">Rockets</span>
              <strong className="text-[#FFE29A] text-xs">
                {stats.activeRockets}
              </strong>
            </div>
          </div>

          {/* Test Individual Types */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider text-[#A99BBF] block font-mono">
              Individual Types
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => triggerType('rocket')}
                className="px-2.5 py-1.5 rounded-lg bg-[#102C38]/80 hover:bg-[#102C38] border border-[#A99BBF]/30 text-left hover:border-[#E98EAF] transition-colors"
              >
                🚀 Rocket Launch
              </button>
              <button
                onClick={() => triggerType('chrysanthemum')}
                className="px-2.5 py-1.5 rounded-lg bg-[#102C38]/80 hover:bg-[#102C38] border border-[#A99BBF]/30 text-left hover:border-[#E98EAF] transition-colors"
              >
                🌼 Chrysanthemum
              </button>
              <button
                onClick={() => triggerType('peony')}
                className="px-2.5 py-1.5 rounded-lg bg-[#102C38]/80 hover:bg-[#102C38] border border-[#A99BBF]/30 text-left hover:border-[#E98EAF] transition-colors"
              >
                🌸 Peony Spherical
              </button>
              <button
                onClick={() => triggerType('willow')}
                className="px-2.5 py-1.5 rounded-lg bg-[#102C38]/80 hover:bg-[#102C38] border border-[#A99BBF]/30 text-left hover:border-[#E98EAF] transition-colors"
              >
                🌾 Weeping Willow
              </button>
              <button
                onClick={() => triggerType('phuljhari')}
                className="px-2.5 py-1.5 rounded-lg bg-[#102C38]/80 hover:bg-[#102C38] border border-[#A99BBF]/30 text-left hover:border-[#E98EAF] transition-colors"
              >
                ✨ Phuljhari Spark
              </button>
              <button
                onClick={() => triggerType('anar')}
                className="px-2.5 py-1.5 rounded-lg bg-[#102C38]/80 hover:bg-[#102C38] border border-[#A99BBF]/30 text-left hover:border-[#E98EAF] transition-colors"
              >
                🌋 Anar Fountain
              </button>
              <button
                onClick={() => triggerType('crackler')}
                className="col-span-2 px-2.5 py-1.5 rounded-lg bg-[#102C38]/80 hover:bg-[#102C38] border border-[#A99BBF]/30 text-left hover:border-[#E98EAF] transition-colors"
              >
                ⚡ Crackling Starburst
              </button>
            </div>
          </div>

          {/* Scroll Sequences Simulation */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider text-[#A99BBF] block font-mono">
              Test Section Sequences
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-[10px]">
              <button
                onClick={triggerHeroFireworks}
                className="p-1.5 rounded bg-[#101B35] border border-[#A99BBF]/20 hover:border-[#E98EAF]"
              >
                Hero
              </button>
              <button
                onClick={triggerArtFireworks}
                className="p-1.5 rounded bg-[#101B35] border border-[#A99BBF]/20 hover:border-[#E98EAF]"
              >
                Art
              </button>
              <button
                onClick={() => triggerRegionFireworks(0)}
                className="p-1.5 rounded bg-[#101B35] border border-[#A99BBF]/20 hover:border-[#E98EAF]"
              >
                Ayodhya
              </button>
              <button
                onClick={() => triggerRegionFireworks(1)}
                className="p-1.5 rounded bg-[#101B35] border border-[#A99BBF]/20 hover:border-[#E98EAF]"
              >
                Varanasi
              </button>
              <button
                onClick={triggerCelebrationFireworks}
                className="p-1.5 rounded bg-[#101B35] border border-[#A99BBF]/20 hover:border-[#E98EAF]"
              >
                Celebration
              </button>
              <button
                onClick={triggerWishesFireworks}
                className="p-1.5 rounded bg-[#101B35] border border-[#A99BBF]/20 hover:border-[#E98EAF]"
              >
                Wishes
              </button>
            </div>
          </div>

          {/* Config Controls */}
          <div className="space-y-2 pt-1 border-t border-[#A99BBF]/20">
            {/* Intensity */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#A99BBF]">Intensity:</span>
              <div className="flex space-x-1">
                {(['low', 'medium', 'high'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => handleIntensityChange(lvl)}
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono ${
                      intensity === lvl
                        ? 'bg-[#E98EAF] text-[#061116] font-bold'
                        : 'bg-[#102C38] text-[#A99BBF]'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Ambient Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#A99BBF]">Ambient Sky:</span>
              <button
                onClick={handleToggleAmbient}
                className={`px-2.5 py-0.5 rounded text-[10px] font-mono uppercase ${
                  ambientOn ? 'bg-green-500/20 text-green-300 border border-green-500/40' : 'bg-red-500/20 text-red-300 border border-red-500/40'
                }`}
              >
                {ambientOn ? 'Active' : 'Paused'}
              </button>
            </div>

            {/* Audio State */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#A99BBF]">Audio Sync:</span>
              <button
                onClick={() => soundscape.toggle()}
                className="flex items-center space-x-1 text-[10px] text-[#FFE29A]"
              >
                {soundscape.getIsPlaying() ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Sound On</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-[#A99BBF]" />
                    <span className="text-[#A99BBF]">Muted</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Clear Button */}
          <div className="pt-1">
            <button
              onClick={() => fireworks.clear()}
              className="w-full py-1.5 rounded-lg bg-[#E98EAF]/15 hover:bg-[#E98EAF]/25 text-[#F4C4D2] border border-[#E98EAF]/30 flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All Particles</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
