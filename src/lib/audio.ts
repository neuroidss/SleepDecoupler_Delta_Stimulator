export class AudioEngine {
  private ctx: AudioContext | null = null;
  private oscL: OscillatorNode | null = null;
  private oscR: OscillatorNode | null = null;
  private gainL: GainNode | null = null;
  private gainR: GainNode | null = null;
  private merger: ChannelMergerNode | null = null;
  private masterGain: GainNode | null = null;

  async init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass({ latencyHint: 'playback' });
    }
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  start(carrierFreq: number, volume: number) {
    if (!this.ctx) return;

    this.stop(); // Clear any existing nodes

    this.masterGain = this.ctx.createGain();
    // Use an exponential curve for more natural volume control, mapped from 0-1 linear slider
    this.masterGain.gain.value = volume > 0 ? Math.pow(volume, 2) : 0;
    this.masterGain.connect(this.ctx.destination);

    this.merger = this.ctx.createChannelMerger(2);
    this.merger.connect(this.masterGain);

    // Use individual gain nodes to prevent clipping if the device downmixes to mono
    this.gainL = this.ctx.createGain();
    this.gainL.gain.value = 0.5;
    this.gainL.connect(this.merger, 0, 0);

    this.gainR = this.ctx.createGain();
    this.gainR.gain.value = 0.5;
    this.gainR.connect(this.merger, 0, 1);

    this.oscL = this.ctx.createOscillator();
    this.oscL.type = 'sine';
    this.oscL.frequency.value = carrierFreq;
    this.oscL.connect(this.gainL); // Connect to left channel

    this.oscR = this.ctx.createOscillator();
    this.oscR.type = 'sine';
    this.oscR.frequency.value = carrierFreq + 1; // Carrier + 1 Hz for Delta beat
    this.oscR.connect(this.gainR); // Connect to right channel

    this.oscL.start();
    this.oscR.start();
  }

  setVolume(volume: number) {
    if (this.masterGain && this.ctx) {
      const targetGain = volume > 0 ? Math.pow(volume, 2) : 0;
      this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.05);
    }
  }

  setFrequency(carrierFreq: number) {
    if (this.oscL && this.oscR && this.ctx) {
      this.oscL.frequency.setTargetAtTime(carrierFreq, this.ctx.currentTime, 0.05);
      this.oscR.frequency.setTargetAtTime(carrierFreq + 1, this.ctx.currentTime, 0.05);
    }
  }

  stop() {
    if (this.oscL) {
      try {
        this.oscL.stop();
      } catch (e) {
        // Ignore errors if already stopped
      }
      this.oscL.disconnect();
      this.oscL = null;
    }
    if (this.oscR) {
      try {
        this.oscR.stop();
      } catch (e) {
        // Ignore errors if already stopped
      }
      this.oscR.disconnect();
      this.oscR = null;
    }
    if (this.gainL) {
      this.gainL.disconnect();
      this.gainL = null;
    }
    if (this.gainR) {
      this.gainR.disconnect();
      this.gainR = null;
    }
    if (this.merger) {
      this.merger.disconnect();
      this.merger = null;
    }
    if (this.masterGain) {
      this.masterGain.disconnect();
      this.masterGain = null;
    }
  }
}
