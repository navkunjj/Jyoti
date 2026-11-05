// Ambient Soundscape and FX generator using Web Audio API
// Self-contained, zero external network dependency, elegant and meditative

class SoundscapeManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private masterGain: GainNode | null = null;
  private droneGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private lfo: OscillatorNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private chimeTimer: number | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggle(): boolean {
    this.initContext();
    if (this.isMuted) {
      this.startAmbient();
      this.isMuted = false;
    } else {
      this.stopAmbient();
      this.isMuted = true;
    }
    return !this.isMuted;
  }

  public getIsPlaying(): boolean {
    return !this.isMuted;
  }

  private startAmbient() {
    if (!this.ctx || !this.masterGain) return;

    // Fade in master gain smoothly
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.linearRampToValueAtTime(0.28, now + 2.5);

    // Create Indian Classical Tanpura drone (Root C, Fifth G, Octave C)
    const freqs = [130.81, 196.00, 261.63, 392.00];
    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(0.12, now);
    this.droneGain.connect(this.masterGain);

    // Sub filter for warm soothing texture
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(580, now);
    filter.Q.setValueAtTime(1.2, now);
    filter.connect(this.droneGain);

    freqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq + (idx === 1 ? 0.3 : 0), now); // slight chorus detune

      // Gentle tremolo
      const tremolo = this.ctx.createOscillator();
      const tremoloGain = this.ctx.createGain();
      tremolo.frequency.setValueAtTime(0.15 + idx * 0.05, now);
      tremoloGain.gain.setValueAtTime(0.04, now);
      tremolo.connect(tremoloGain.gain);
      tremolo.start();

      oscGain.gain.setValueAtTime(0.08 / freqs.length, now);
      osc.connect(filter);
      osc.start();
      this.oscillators.push(osc);
    });

    // Ambient River Murmur (Filtered Soft Pink Noise)
    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        output[i] = (b0 + b1 + b2) * 0.015;
      }
      this.noiseNode = this.ctx.createBufferSource();
      this.noiseNode.buffer = noiseBuffer;
      this.noiseNode.loop = true;

      const waterFilter = this.ctx.createBiquadFilter();
      waterFilter.type = 'bandpass';
      waterFilter.frequency.setValueAtTime(420, now);
      waterFilter.Q.setValueAtTime(0.8, now);

      const waterGain = this.ctx.createGain();
      waterGain.gain.setValueAtTime(0.025, now);

      this.noiseNode.connect(waterFilter);
      waterFilter.connect(waterGain);
      waterGain.connect(this.masterGain);
      this.noiseNode.start();
    } catch {
      // safe fallback if audio buffer creation is constrained
    }

    // Schedule gentle, meditative random temple bell / santoor chimes
    this.scheduleChimes();
  }

  private scheduleChimes() {
    const playNext = () => {
      if (this.isMuted) return;
      this.playMeditativePluck();
      // Schedule next chime between 4 to 9 seconds
      const delay = Math.random() * 5000 + 4000;
      this.chimeTimer = window.setTimeout(playNext, delay);
    };
    this.chimeTimer = window.setTimeout(playNext, 2500);
  }

  private playMeditativePluck() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    // Raga Bhupali / Pentatonic scale (C4, D4, E4, G4, A4, C5)
    const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 659.25];
    const pitch = scale[Math.floor(Math.random() * scale.length)];

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(pitch, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.frequency.exponentialRampToValueAtTime(300, now + 3.0);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.045, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 4.0);
  }

  private stopAmbient() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 1.2);

    if (this.chimeTimer) {
      clearTimeout(this.chimeTimer);
      this.chimeTimer = null;
    }

    setTimeout(() => {
      this.oscillators.forEach(osc => {
        try { osc.stop(); osc.disconnect(); } catch {}
      });
      this.oscillators = [];
      if (this.noiseNode) {
        try { this.noiseNode.stop(); this.noiseNode.disconnect(); } catch {}
        this.noiseNode = null;
      }
    }, 1300);
  }

  // Play auspicious diya lighting chime
  public playDiyaChime() {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    
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

  // Play lantern release sparkle
  public playLanternSound() {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(392.00, now);
    osc.frequency.exponentialRampToValueAtTime(880.00, now + 1.5);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.06, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 2.1);
  }
}

export const soundscape = new SoundscapeManager();

