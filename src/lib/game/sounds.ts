/**
 * Gestor de efectos de sonido sintetizados con Web Audio API.
 * No requiere archivos de audio externos.
 */

export type SoundName =
  | "click"
  | "select"
  | "correct"
  | "wrong"
  | "tick"
  | "urgent"
  | "explode"
  | "defuse"
  | "start"
  | "cut";

class SoundFX {
  private ctx: AudioContext | null = null;
  private _muted = false;
  private listeners = new Set<() => void>();

  constructor() {
    if (typeof window !== "undefined") {
      this._muted = window.localStorage.getItem("paes-muted") === "1";
    }
  }

  get muted() {
    return this._muted;
  }

  /** Suscripción para useSyncExternalStore. */
  subscribe = (callback: () => void) => {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  };

  getMuted = () => this._muted;

  private emit() {
    for (const listener of this.listeners) listener();
  }

  /** Debe llamarse tras un gesto del usuario (política de autoplay). */
  init() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctor) return;
      this.ctx = new Ctor();
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
  }

  toggleMute(): boolean {
    this._muted = !this._muted;
    if (typeof window !== "undefined") {
      window.localStorage.setItem("paes-muted", this._muted ? "1" : "0");
    }
    this.emit();
    return this._muted;
  }

  private tone(
    freq: number,
    start: number,
    duration: number,
    type: OscillatorType,
    gain: number,
    endFreq?: number,
  ) {
    if (!this.ctx || this._muted) return;
    const t0 = this.ctx.currentTime + start;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, t0 + duration);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    osc.connect(g).connect(this.ctx.destination);
    osc.start(t0);
    osc.stop(t0 + duration + 0.05);
  }

  private noise(start: number, duration: number, gain: number, cutoff: number) {
    if (!this.ctx || this._muted) return;
    const t0 = this.ctx.currentTime + start;
    const frames = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, frames, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < frames; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
    }
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(cutoff, t0);
    filter.frequency.exponentialRampToValueAtTime(80, t0 + duration);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(gain, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    src.connect(filter).connect(g).connect(this.ctx.destination);
    src.start(t0);
  }

  play(name: SoundName) {
    if (this._muted) return;
    this.init();
    if (!this.ctx) return;
    switch (name) {
      case "click":
        this.tone(740, 0, 0.06, "square", 0.05);
        break;
      case "select":
        this.tone(520, 0, 0.08, "sine", 0.08, 780);
        break;
      case "correct":
        this.tone(660, 0, 0.1, "sine", 0.12);
        this.tone(990, 0.1, 0.16, "sine", 0.12);
        break;
      case "cut":
        this.tone(300, 0, 0.05, "sawtooth", 0.07);
        this.tone(1200, 0.03, 0.08, "sine", 0.06);
        this.tone(880, 0.12, 0.12, "sine", 0.08, 1320);
        break;
      case "wrong":
        this.tone(160, 0, 0.32, "sawtooth", 0.13, 90);
        break;
      case "tick":
        this.tone(1050, 0, 0.035, "square", 0.035);
        break;
      case "urgent":
        this.tone(1250, 0, 0.07, "square", 0.07);
        this.tone(1250, 0.12, 0.07, "square", 0.07);
        break;
      case "explode":
        this.noise(0, 1.1, 0.55, 900);
        this.tone(70, 0, 0.9, "sine", 0.4, 32);
        this.noise(0.05, 0.5, 0.25, 2500);
        break;
      case "defuse":
        this.tone(523, 0, 0.14, "sine", 0.12);
        this.tone(659, 0.14, 0.14, "sine", 0.12);
        this.tone(784, 0.28, 0.14, "sine", 0.12);
        this.tone(1047, 0.42, 0.34, "sine", 0.14);
        break;
      case "start":
        this.tone(440, 0, 0.12, "square", 0.09);
        this.tone(660, 0.14, 0.2, "square", 0.09);
        break;
    }
  }
}

export const sfx = new SoundFX();
