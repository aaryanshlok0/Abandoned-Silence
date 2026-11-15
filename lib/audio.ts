// Ambient synthesizer and procedural sound effects using Web Audio API

class SoundSystem {
  private ctx: AudioContext | null = null
  private droneGain: GainNode | null = null
  private droneOsc1: OscillatorNode | null = null
  private droneOsc2: OscillatorNode | null = null
  private isMuted: boolean = true

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  public toggle(enable?: boolean): boolean {
    this.init()
    this.isMuted = enable !== undefined ? !enable : !this.isMuted
    if (!this.isMuted) {
      this.startDrone()
    } else {
      this.stopDrone()
    }
    return !this.isMuted
  }

  public get enabled(): boolean {
    return !this.isMuted
  }

  private startDrone() {
    if (!this.ctx || this.droneGain) return
    try {
      const now = this.ctx.currentTime
      const gain = this.ctx.createGain()
      gain.gain.setValueAtTime(0.001, now)
      gain.gain.exponentialRampToValueAtTime(0.06, now + 2)

      const filter = this.ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(140, now)

      const osc1 = this.ctx.createOscillator()
      osc1.type = 'sine'
      osc1.frequency.setValueAtTime(48, now) // deep space hum

      const osc2 = this.ctx.createOscillator()
      osc2.type = 'triangle'
      osc2.frequency.setValueAtTime(72, now) // ethereal fifth

      osc1.connect(filter)
      osc2.connect(filter)
      filter.connect(gain)
      gain.connect(this.ctx.destination)

      osc1.start()
      osc2.start()

      this.droneGain = gain
      this.droneOsc1 = osc1
      this.droneOsc2 = osc2
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  private stopDrone() {
    if (!this.ctx || !this.droneGain) return
    try {
      const now = this.ctx.currentTime
      this.droneGain.gain.setValueAtTime(this.droneGain.gain.value, now)
      this.droneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8)
      setTimeout(() => {
        this.droneOsc1?.stop()
        this.droneOsc2?.stop()
        this.droneOsc1 = null
        this.droneOsc2 = null
        this.droneGain = null
      }, 900)
    } catch {
      this.droneGain = null
    }
  }

  public playWarp() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return
    try {
      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      const filter = this.ctx.createBiquadFilter()

      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(280, now)
      filter.frequency.exponentialRampToValueAtTime(2400, now + 0.9)
      filter.frequency.exponentialRampToValueAtTime(320, now + 1.8)

      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(80, now)
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.8)
      osc.frequency.exponentialRampToValueAtTime(55, now + 1.8)

      gain.gain.setValueAtTime(0.001, now)
      gain.gain.exponentialRampToValueAtTime(0.12, now + 0.4)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start(now)
      osc.stop(now + 1.85)
    } catch {
      // Audio autoplay restriction safe fallback
    }
  }

  public playChirp() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return
    try {
      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(620, now)
      osc.frequency.exponentialRampToValueAtTime(1080, now + 0.14)

      gain.gain.setValueAtTime(0.08, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start(now)
      osc.stop(now + 0.3)
    } catch {
      // safe fallback
    }
  }
}

export const spaceAudio = new SoundSystem()
