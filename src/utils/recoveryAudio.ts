// Procedural Ambient Sound Engine for Dhvani's Recovery Room
// High quality, 100% offline, zero-latency relaxing ambient audio using Web Audio API

class RecoveryAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  
  // Rain & Thunder nodes
  private rainGain: GainNode | null = null;
  private rainSource: AudioBufferSourceNode | null = null;
  private isRainPlaying: boolean = false;
  private thunderTimeout: number | null = null;

  // Ambient chords nodes
  private pianoGain: GainNode | null = null;
  private pianoInterval: number | null = null;
  private isPianoPlaying: boolean = false;

  // Cassette playback
  private cassetteGain: GainNode | null = null;
  private cassetteInterval: number | null = null;
  private isCassettePlaying: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (!this.masterGain && this.ctx) {
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.8, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
  }

  public setMuted(muted: boolean): boolean {
    this.isMuted = muted;
    if (this.ctx && this.masterGain) {
      const t = this.ctx.currentTime;
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.8, t, 0.2);
    }
    return this.isMuted;
  }

  public toggleMute(): boolean {
    return this.setMuted(!this.isMuted);
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // ─── Procedural Gentle Rain ───
  public startRain() {
    if (this.isRainPlaying) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    this.isRainPlaying = true;
    const sampleRate = this.ctx.sampleRate;
    const bufferSize = sampleRate * 3; // 3-second looping noise buffer
    const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    let lastOut = 0.0;
    // Generate pinkish noise with subtle variations
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Pink filter approximation
      lastOut = (lastOut * 0.95) + (white * 0.05);
      data[i] = lastOut * 0.7;
    }

    const rainSource = this.ctx.createBufferSource();
    rainSource.buffer = buffer;
    rainSource.loop = true;

    // Low-pass filter for cozy muffled indoor rain sound through the window
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(950, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.2, this.ctx.currentTime);

    // High-pass filter to remove uncomfortable sub-rumble
    const hpFilter = this.ctx.createBiquadFilter();
    hpFilter.type = 'highpass';
    hpFilter.frequency.setValueAtTime(180, this.ctx.currentTime);

    this.rainGain = this.ctx.createGain();
    this.rainGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.rainGain.gain.linearRampToValueAtTime(0.045, this.ctx.currentTime + 2.5);

    rainSource.connect(filter);
    filter.connect(hpFilter);
    hpFilter.connect(this.rainGain);
    this.rainGain.connect(this.masterGain);

    rainSource.start();
    this.rainSource = rainSource;

    // Schedule gentle distant thunder rumbles
    this.scheduleDistantThunder();
  }

  public setRainIntensity(level: 'soft' | 'normal' | 'silent') {
    if (!this.ctx || !this.rainGain) return;
    const target = level === 'silent' ? 0.0001 : level === 'soft' ? 0.018 : 0.045;
    this.rainGain.gain.setTargetAtTime(target, this.ctx.currentTime, 1.5);
  }

  public stopRain() {
    this.isRainPlaying = false;
    if (this.rainSource) {
      try {
        this.rainSource.stop();
        this.rainSource.disconnect();
      } catch (_) {}
      this.rainSource = null;
    }
    if (this.thunderTimeout) {
      clearTimeout(this.thunderTimeout);
      this.thunderTimeout = null;
    }
  }

  // ─── Distant Gentle Thunder ───
  public playDistantThunder() {
    if (!this.ctx || !this.masterGain || this.isMuted || !this.isRainPlaying) return;

    const sampleRate = this.ctx.sampleRate;
    const duration = 3.5;
    const bufferSize = Math.floor(sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (sampleRate * 1.5));
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(140, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + duration);

    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.03, now + 0.8);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    source.start(now);
  }

  private scheduleDistantThunder() {
    const delay = 18000 + Math.random() * 25000;
    this.thunderTimeout = window.setTimeout(() => {
      if (this.isRainPlaying) {
        this.playDistantThunder();
        this.scheduleDistantThunder();
      }
    }, delay);
  }

  // ─── Warm Lullaby Piano Progression ───
  public startAmbientPiano() {
    if (this.isPianoPlaying) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    this.isPianoPlaying = true;
    this.pianoGain = this.ctx.createGain();
    this.pianoGain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    this.pianoGain.connect(this.masterGain);

    // Warm, soothing chord progressions (Cmaj9, Am9, Fmaj7, Gsus4)
    const chords = [
      [261.63, 329.63, 392.00, 493.88, 587.33], // Cmaj9
      [220.00, 261.63, 329.63, 392.00, 493.88], // Am9
      [174.61, 220.00, 261.63, 329.63, 392.00], // Fmaj7
      [196.00, 261.63, 293.66, 392.00, 523.25], // Gsus4
    ];

    let chordIndex = 0;

    const playNextChord = () => {
      if (!this.ctx || !this.isPianoPlaying || !this.pianoGain) return;

      const currentChord = chords[chordIndex];
      const now = this.ctx.currentTime;

      currentChord.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const noteGain = this.ctx!.createGain();

        // Warm soft sine with gentle triangle warmth
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        noteGain.gain.setValueAtTime(0, now + idx * 0.12);
        noteGain.gain.linearRampToValueAtTime(0.015, now + idx * 0.12 + 0.3);
        noteGain.gain.setTargetAtTime(0.008, now + idx * 0.12 + 1.2, 1.2);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 6.0);

        osc.connect(noteGain);
        noteGain.connect(this.pianoGain!);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 6.1);
      });

      chordIndex = (chordIndex + 1) % chords.length;
    };

    playNextChord();
    this.pianoInterval = window.setInterval(playNextChord, 6500);
  }

  public stopAmbientPiano() {
    this.isPianoPlaying = false;
    if (this.pianoInterval) {
      clearInterval(this.pianoInterval);
      this.pianoInterval = null;
    }
  }

  // ─── Vintage Cassette Message Player ───
  public startCassetteLullaby(onComplete?: () => void) {
    if (this.isCassettePlaying) {
      this.stopCassetteLullaby();
      return;
    }

    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    this.isCassettePlaying = true;
    this.cassetteGain = this.ctx.createGain();
    this.cassetteGain.gain.setValueAtTime(0.07, this.ctx.currentTime);
    this.cassetteGain.connect(this.masterGain);

    // Sweet, tender melody (Like a gentle lullaby for Dhvani)
    const melody: [number, number][] = [
      [523.25, 0.8], // C5
      [659.25, 0.8], // E5
      [783.99, 1.2], // G5
      [880.00, 1.0], // A5
      [783.99, 1.2], // G5
      [659.25, 0.8], // E5
      [587.33, 1.0], // D5
      [523.25, 1.4], // C5
      [587.33, 0.8], // D5
      [659.25, 0.8], // E5
      [587.33, 1.0], // D5
      [523.25, 2.0], // C5
    ];

    let noteIdx = 0;
    let accumulatedTime = 0;

    melody.forEach(([freq, dur]) => {
      setTimeout(() => {
        if (!this.ctx || !this.isCassettePlaying || !this.cassetteGain) return;

        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        const t = this.ctx.currentTime;
        noteGain.gain.setValueAtTime(0, t);
        noteGain.gain.linearRampToValueAtTime(0.04, t + 0.05);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, t + dur * 0.9);

        osc.connect(noteGain);
        noteGain.connect(this.cassetteGain);

        osc.start(t);
        osc.stop(t + dur);

        noteIdx++;
        if (noteIdx === melody.length && onComplete) {
          setTimeout(onComplete, dur * 1000 + 500);
        }
      }, accumulatedTime * 1000);

      accumulatedTime += dur * 0.95;
    });
  }

  public stopCassetteLullaby() {
    this.isCassettePlaying = false;
    if (this.cassetteInterval) {
      clearInterval(this.cassetteInterval);
      this.cassetteInterval = null;
    }
  }

  public isCassetteActive(): boolean {
    return this.isCassettePlaying;
  }

  // ─── Sound Effects ───
  public playHeartBeat() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    // Soft lub-dub
    const playThump = (timeOffset: number, volume: number) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const t = this.ctx!.currentTime + timeOffset;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(65, t);
      osc.frequency.exponentialRampToValueAtTime(35, t + 0.18);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(volume, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(t);
      osc.stop(t + 0.23);
    };

    playThump(0, 0.12);
    playThump(0.18, 0.08);
  }

  public playCareItemClick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const t = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, t); // D5
    osc.frequency.exponentialRampToValueAtTime(880.00, t + 0.12); // A5

    gain.gain.setValueAtTime(0.05, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.35);
  }

  public playBloomGently() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((f, i) => {
      setTimeout(() => {
        if (!this.ctx || !this.masterGain || this.isMuted) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = this.ctx.currentTime;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.03, t + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(t);
        osc.stop(t + 0.65);
      }, i * 90);
    });
  }

  public playHugComplete() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const chord = [392.00, 493.88, 587.33, 783.99]; // G maj chord
    chord.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx || !this.masterGain || this.isMuted) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = this.ctx.currentTime;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.05, t + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(t);
        osc.stop(t + 1.25);
      }, idx * 110);
    });
  }

  public playRestModeTone() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const notes = [440, 392, 329.63, 261.63]; // Descending calm
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx || !this.masterGain || this.isMuted) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = this.ctx.currentTime;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.03, t + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.5);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(t);
        osc.stop(t + 1.6);
      }, idx * 250);
    });
  }

  // Cleanup all running sounds
  public cleanup() {
    this.stopRain();
    this.stopAmbientPiano();
    this.stopCassetteLullaby();
  }
}

export const recoveryAudio = new RecoveryAudioEngine();
