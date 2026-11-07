// JYOTI Soundscape & BGM Manager
// Plays the authentic Diwali soundtrack (/assets/jyoti-bgm.mp3) with smooth volume ramps
// and provides rich interactive sound effects (Diya chimes, lantern sparkles, fireworks).

class SoundscapeManager {
  private ctx: AudioContext | null = null;
  private bgm: HTMLAudioElement | null = null;
  private isMuted: boolean = true;
  private bgmVolume: number = 0.50; // Balanced ambient listening level
  private fadeFrameId: number | null = null;
  private listeners: Set<(playing: boolean) => void> = new Set();

  constructor() {
    // Lazily initialized on first user interaction to comply with browser audio policies
  }

  private initAudio() {
    if (!this.bgm && typeof Audio !== 'undefined') {
      const audio = new Audio('/assets/jyoti-bgm.mp3');
      audio.loop = true;
      audio.preload = 'auto';
      audio.volume = 0;
      this.bgm = audio;
    }

    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Subscribe to BGM play/pause state changes (e.g. for Navbar toggle icon).
   */
  public subscribe(cb: (playing: boolean) => void): () => void {
    this.listeners.add(cb);
    cb(this.getIsPlaying());
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notifyListeners(playing: boolean) {
    this.listeners.forEach((cb) => {
      try {
        cb(playing);
      } catch (err) {
        console.error('Soundscape listener error:', err);
      }
    });
  }

  public getIsPlaying(): boolean {
    return !this.isMuted && !!this.bgm && !this.bgm.paused;
  }

  /**
   * Toggles BGM play/pause with smooth volume ramp.
   */
  public toggle(): boolean {
    if (this.getIsPlaying()) {
      this.pauseBgm();
      return false;
    } else {
      this.playBgm();
      return true;
    }
  }

  /**
   * Smoothly plays the Diwali BGM track with volume fade-in.
   */
  public async playBgm(): Promise<boolean> {
    this.initAudio();
    if (!this.bgm) return false;

    try {
      this.clearFade();
      await this.bgm.play();
      this.isMuted = false;
      this.fadeVolume(this.bgmVolume, 1400);
      this.notifyListeners(true);
      return true;
    } catch (err) {
      console.warn('Audio play request blocked by browser policy:', err);
      this.isMuted = true;
      this.notifyListeners(false);
      return false;
    }
  }

  /**
   * Smoothly pauses the Diwali BGM track with volume fade-out.
   */
  public pauseBgm(): void {
    if (!this.bgm) return;

    this.clearFade();
    this.isMuted = true;
    this.fadeVolume(0, 700, () => {
      if (this.bgm) {
        this.bgm.pause();
      }
    });
    this.notifyListeners(false);
  }

  private clearFade() {
    if (this.fadeFrameId !== null && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(this.fadeFrameId);
      this.fadeFrameId = null;
    }
  }

  private fadeVolume(targetVol: number, durationMs: number, onComplete?: () => void) {
    if (!this.bgm) return;
    this.clearFade();

    const startVol = this.bgm.volume;
    const startTime = performance.now();

    const step = (now: number) => {
      if (!this.bgm) return;
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);

      // Smooth cubic ease curve
      const ease = progress * progress * (3 - 2 * progress);
      this.bgm.volume = Math.max(0, Math.min(1, startVol + (targetVol - startVol) * ease));

      if (progress < 1) {
        this.fadeFrameId = requestAnimationFrame(step);
      } else {
        this.fadeFrameId = null;
        if (onComplete) onComplete();
      }
    };

    this.fadeFrameId = requestAnimationFrame(step);
  }

  // ==========================================
  // Interactive Sound Effects (Synthesized FX)
  // ==========================================

  // Auspicious terrace/interactive diya lighting chime
  public playDiyaChime() {
    this.initAudio();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const noteTime = now + idx * 0.09;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.0001, noteTime);
      gain.gain.linearRampToValueAtTime(0.08, noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 1.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 1.7);
    });
  }

  // Lantern release sparkle chime
  public playLanternSound() {
    this.initAudio();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(392.0, now);
    osc.frequency.exponentialRampToValueAtTime(880.0, now + 1.5);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.06, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 2.1);
  }

  // Rocket propulsion whoosh
  public playRocketWoosh() {
    this.initAudio();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const bufferSize = Math.floor(this.ctx.sampleRate * 0.4);
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, now);
    filter.frequency.exponentialRampToValueAtTime(2400, now + 0.35);
    filter.Q.setValueAtTime(3.0, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
  }

  // Festive cracker burst / explosion sound
  public playCrackerBurst() {
    this.initAudio();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // 1. Low Thud / Bass pop
    const boomOsc = this.ctx.createOscillator();
    const boomGain = this.ctx.createGain();
    boomOsc.type = 'sine';
    boomOsc.frequency.setValueAtTime(140, now);
    boomOsc.frequency.exponentialRampToValueAtTime(35, now + 0.35);

    boomGain.gain.setValueAtTime(0.2, now);
    boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    boomOsc.connect(boomGain);
    boomGain.connect(this.ctx.destination);
    boomOsc.start(now);
    boomOsc.stop(now + 0.45);

    // 2. High frequency crackles / sparkles
    const crackleCount = 6;
    for (let i = 0; i < crackleCount; i++) {
      const crackleTime = now + 0.05 + Math.random() * 0.28;
      const crackleOsc = this.ctx.createOscillator();
      const crackleGain = this.ctx.createGain();

      crackleOsc.type = 'square';
      crackleOsc.frequency.setValueAtTime(1200 + Math.random() * 2000, crackleTime);

      crackleGain.gain.setValueAtTime(0.001, crackleTime);
      crackleGain.gain.linearRampToValueAtTime(0.04, crackleTime + 0.008);
      crackleGain.gain.exponentialRampToValueAtTime(0.0001, crackleTime + 0.04);

      crackleOsc.connect(crackleGain);
      crackleGain.connect(this.ctx.destination);

      crackleOsc.start(crackleTime);
      crackleOsc.stop(crackleTime + 0.05);
    }
  }
}

export const soundscape = new SoundscapeManager();
