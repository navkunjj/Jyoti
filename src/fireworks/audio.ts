import { soundscape } from '../utils/sound';

class FireworksAudioManager {
  private getContext(): AudioContext | null {
    // Rely on global AudioContext or create/resume safely
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;
    return new AudioCtx();
  }

  private isEnabled(): boolean {
    return soundscape.getIsPlaying();
  }

  // Calculate stereo pan (-1 to 1) based on screen X coordinate
  private getPan(screenX?: number): number {
    if (typeof screenX !== 'number' || typeof window === 'undefined') return 0;
    const norm = (screenX / window.innerWidth) * 2 - 1;
    return Math.max(-0.85, Math.min(0.85, norm));
  }

  // 1. Rocket launch woosh & ascending whistle
  public playRocketLaunch(screenX?: number): void {
    if (!this.isEnabled()) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as any).webkitAudioContext)();
      const now = ctx.currentTime;
      const pan = this.getPan(screenX);

      // Master for this effect
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.001, now);
      master.gain.linearRampToValueAtTime(0.09, now + 0.1);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      // Stereo panner
      if (ctx.createStereoPanner) {
        const panner = ctx.createStereoPanner();
        panner.pan.setValueAtTime(pan, now);
        master.connect(panner);
        panner.connect(ctx.destination);
      } else {
        master.connect(ctx.destination);
      }

      // Ascending whistle oscillator
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.8);
      osc.connect(master);
      osc.start(now);
      osc.stop(now + 1.2);

      // Noise hiss for rocket propulsion
      const bufferSize = ctx.sampleRate * 1.0;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.08;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1200, now);

      noise.connect(filter);
      filter.connect(master);
      noise.start(now);
      noise.stop(now + 1.0);

      setTimeout(() => {
        try { ctx.close(); } catch {}
      }, 1400);
    } catch {
      // Audio fallback safe
    }
  }

  // 2. Distant or close aerial explosion boom
  public playBurst(screenX?: number, size: 'small' | 'medium' | 'large' = 'medium'): void {
    if (!this.isEnabled()) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as any).webkitAudioContext)();
      const now = ctx.currentTime;
      const pan = this.getPan(screenX);

      const gainMultiplier = size === 'large' ? 0.22 : (size === 'medium' ? 0.15 : 0.09);

      const master = ctx.createGain();
      master.gain.setValueAtTime(0.001, now);
      master.gain.linearRampToValueAtTime(gainMultiplier, now + 0.03);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      if (ctx.createStereoPanner) {
        const panner = ctx.createStereoPanner();
        panner.pan.setValueAtTime(pan, now);
        master.connect(panner);
        panner.connect(ctx.destination);
      } else {
        master.connect(ctx.destination);
      }

      // Low frequency boom oscillator
      const boom = ctx.createOscillator();
      boom.type = 'sine';
      boom.frequency.setValueAtTime(size === 'large' ? 75 : 95, now);
      boom.frequency.exponentialRampToValueAtTime(32, now + 0.6);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, now);
      filter.frequency.exponentialRampToValueAtTime(60, now + 1.2);

      boom.connect(filter);
      filter.connect(master);
      boom.start(now);
      boom.stop(now + 1.8);

      // Subtle noise transient punch
      const bufferSize = ctx.sampleRate * 0.4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.08));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.connect(filter);
      noise.start(now);

      setTimeout(() => {
        try { ctx.close(); } catch {}
      }, 2000);
    } catch {
      // Audio fallback
    }
  }

  // 3. Crackling micro pops
  public playCrackles(screenX?: number): void {
    if (!this.isEnabled()) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as any).webkitAudioContext)();
      const now = ctx.currentTime;
      const count = 5 + Math.floor(Math.random() * 6);

      for (let i = 0; i < count; i++) {
        const timeOffset = Math.random() * 0.45;
        const popTime = now + timeOffset;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(800 + Math.random() * 1200, popTime);

        gain.gain.setValueAtTime(0.001, popTime);
        gain.gain.linearRampToValueAtTime(0.025, popTime + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, popTime + 0.04);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(popTime);
        osc.stop(popTime + 0.05);
      }

      setTimeout(() => {
        try { ctx.close(); } catch {}
      }, 700);
    } catch {}
  }

  // 4. Phuljhari sizzle / sparkler hiss
  public playSparklerSizzle(): void {
    if (!this.isEnabled()) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as any).webkitAudioContext)();
      const now = ctx.currentTime;

      const duration = 2.5;
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Crackling pink-ish noise
      let b0 = 0, b1 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99 * b0 + white * 0.05;
        b1 = 0.95 * b1 + white * 0.1;
        data[i] = (white * 0.5 + b0 + b1) * 0.04;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3200, now);
      filter.Q.setValueAtTime(1.8, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 0.3);
      gain.gain.linearRampToValueAtTime(0.03, now + duration - 0.5);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + duration);

      setTimeout(() => {
        try { ctx.close(); } catch {}
      }, (duration + 0.3) * 1000);
    } catch {}
  }
}

export const fireworksAudio = new FireworksAudioManager();

