// Web Audio API Synthesizer for RelationshipOS v1.0
// Guarantees 100% offline, zero-latency, high-fidelity ambient music and sound effects

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgOscillators: OscillatorNode[] = [];
  private bgGainNode: GainNode | null = null;
  private isPlayingBgm: boolean = false;
  private bgmInterval: any = null;

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.bgGainNode && this.ctx) {
      this.bgGainNode.gain.setTargetAtTime(this.isMuted ? 0 : 0.15, this.ctx.currentTime, 0.1);
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Soft romantic chime sound on button click
  public playClick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    // C5 to G5 pitch sparkle
    osc.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(783.99, this.ctx.currentTime + 0.08); // G5

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }

  // Heart particle pop sound
  public playHeartPop() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(659.25, this.ctx.currentTime); // E5
    osc.frequency.exponentialRampToValueAtTime(1046.50, this.ctx.currentTime + 0.12); // C6

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  // Error buzzer for Python syntax error easter egg
  public playErrorSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, this.ctx.currentTime);
    osc.frequency.setValueAtTime(120, this.ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
  }

  // Celebration fanfare chords for final screen
  public playCelebration() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C E G C E arpeggio
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx || this.isMuted) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.8);
      }, idx * 90);
    });
  }

  // Romantic ambient synth chord generator
  public startAmbientBGM() {
    if (this.isPlayingBgm) return;
    this.initCtx();
    if (!this.ctx) return;

    this.isPlayingBgm = true;
    this.bgGainNode = this.ctx.createGain();
    this.bgGainNode.gain.setValueAtTime(this.isMuted ? 0 : 0.1, this.ctx.currentTime);
    this.bgGainNode.connect(this.ctx.destination);

    // Warm chord progressions: Cmaj9 -> Am9 -> Fmaj7 -> Gsus4
    const chords = [
      [261.63, 329.63, 392.00, 493.88, 587.33], // Cmaj9 (C, E, G, B, D)
      [220.00, 261.63, 329.63, 392.00, 493.88], // Am9 (A, C, E, G, B)
      [174.61, 220.00, 261.63, 329.63, 392.00], // Fmaj7 (F, A, C, E, G)
      [196.00, 261.63, 392.00, 440.00, 587.33], // Gsus4 (G, C, G, A, D)
    ];

    let chordIdx = 0;

    const playChord = () => {
      if (!this.ctx || !this.isPlayingBgm || !this.bgGainNode) return;
      const currentChord = chords[chordIdx];
      chordIdx = (chordIdx + 1) % chords.length;

      currentChord.forEach((freq) => {
        const osc = this.ctx!.createOscillator();
        const noteGain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);

        // Soft attack and decay envelope
        noteGain.gain.setValueAtTime(0, this.ctx!.currentTime);
        noteGain.gain.linearRampToValueAtTime(0.04, this.ctx!.currentTime + 1.2);
        noteGain.gain.linearRampToValueAtTime(0, this.ctx!.currentTime + 4.8);

        osc.connect(noteGain);
        noteGain.connect(this.bgGainNode!);

        osc.start();
        osc.stop(this.ctx!.currentTime + 5.0);
      });
    };

    playChord();
    this.bgmInterval = setInterval(playChord, 5000);
  }

  public stopAmbientBGM() {
    this.isPlayingBgm = false;
    if (this.bgmInterval) clearInterval(this.bgmInterval);
  }
}

export const soundEngine = new SoundEngine();
