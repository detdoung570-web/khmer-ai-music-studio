// Web Audio API Procedural Synthesizer & Multi-Genre Music Player Engine

export interface PlaybackState {
  isPlaying: boolean;
  songId: string | null;
  elapsedSeconds: number;
  formattedTime: string;
  volume: number;
  vocalEnabled: boolean;
  bpm: number;
}

class MusicPreviewSynth {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying = false;
  private currentSongId: string | null = null;
  private timerId: any = null;
  private progressTimerId: any = null;
  private elapsed = 0;
  private volume = 0.8;
  private vocalEnabled = false;
  private currentBpm = 85;

  private onStateChange: ((state: PlaybackState) => void) | null = null;

  public setListener(fn: (state: PlaybackState) => void) {
    this.onStateChange = fn;
  }

  private notify() {
    if (this.onStateChange) {
      const mins = Math.floor(this.elapsed / 60);
      const secs = this.elapsed % 60;
      const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      this.onStateChange({
        isPlaying: this.isPlaying,
        songId: this.currentSongId,
        elapsedSeconds: this.elapsed,
        formattedTime: formatted,
        volume: this.volume,
        vocalEnabled: this.vocalEnabled,
        bpm: this.currentBpm,
      });
    }
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
    this.notify();
  }

  public toggleVocal() {
    this.vocalEnabled = !this.vocalEnabled;
    this.notify();
  }

  public playSong(song: { id: string; title?: string; style: string; bpm?: number; lyrics?: string }) {
    this.initContext();
    if (!this.ctx) return;

    if (this.isPlaying && this.currentSongId === song.id) {
      this.stop();
      return;
    }

    this.stop();
    this.isPlaying = true;
    this.currentSongId = song.id;
    this.elapsed = 0;

    // Extract exact BPM from style string or choose sensible default
    const bpmMatch = song.style.match(/(\d+)\s*BPM/i);
    const isKantrum = /kantrum|កន្ទ្រឹម|fast tempo|dance|club|edm/i.test(song.style) || /កន្ទ្រឹម|ញាក់/i.test(song.title || '');
    const isSad = /sad|ballad|melanchol|heartbreak|កម្សត់|ទឹកភ្នែក/i.test(song.style) || /ទឹកភ្នែក|ព្រាត់/i.test(song.title || '');
    const isRomantic = /sweet|romantic|love\s*ballad|រ៉ូមែនទិក|ផ្អែមល្ហែម|ស្នេហា/i.test(song.style) || /ផ្អែម|ស្នេហ៍|បេះដូង/i.test(song.title || '');
    const isLofi = /lo-fi|lofi|coffee|rainy\s*night|chill|កាហ្វេ|ភ្លៀង/i.test(song.style) || /កាហ្វេ|ភ្លៀង/i.test(song.title || '');
    const isWedding = /wedding|celebration|joyful|អាពាហ៍ពិពាហ៍|មង្គលការ|ភ្លេងការ/i.test(song.style) || /មង្គលការ|ផ្កាស្លា/i.test(song.title || '');
    const isRock = /rock|grunge|distorted|power/i.test(song.style);
    const isJazz = /jazz|blues|noir|soul/i.test(song.style);

    this.currentBpm = bpmMatch
      ? parseInt(bpmMatch[1], 10)
      : isKantrum
      ? 134
      : isWedding
      ? 106
      : isLofi
      ? 76
      : isRomantic
      ? 68
      : isSad
      ? 64
      : isRock
      ? 118
      : 80;

    const intervalMs = (60 / this.currentBpm) * 1000 * 0.5; // eighth notes

    // 9 distinct harmonic progressions mapped dynamically based on song attributes
    const seed = (song.title || song.id).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const progressionPool = [
      // 0: C Minor Sorrow (Cm, Ab, Eb, Bb)
      [[130.81, 155.56, 196.00], [103.83, 130.81, 155.56], [155.56, 196.00, 233.08], [116.54, 146.83, 174.61]],
      // 1: D Minor Ballad (Dm, Bb, F, C)
      [[146.83, 174.61, 220.00], [116.54, 146.83, 174.61], [174.61, 220.00, 261.63], [130.81, 164.81, 196.00]],
      // 2: A Minor Heartbreak (Am, F, C, G)
      [[110.00, 130.81, 164.81], [174.61, 220.00, 261.63], [130.81, 164.81, 196.00], [98.00, 123.47, 146.83]],
      // 3: E Minor Melancholy (Em, C, G, D)
      [[82.41, 123.47, 164.81], [130.81, 164.81, 196.00], [98.00, 146.83, 196.00], [146.83, 185.00, 220.00]],
      // 4: Khmer Traditional Pleng Ka & Wedding Joy (G, C, D, G)
      [[196.00, 246.94, 293.66], [130.81, 164.81, 196.00], [146.83, 185.00, 220.00], [196.00, 246.94, 293.66]],
      // 5: Khmer Kantrum Festive Dance (A, D, E, A)
      [[220.00, 277.18, 329.63], [146.83, 185.00, 220.00], [164.81, 207.65, 246.94], [220.00, 277.18, 329.63]],
      // 6: Jazz & Lofi 7ths (Gm7, C7, Fmaj7, Bbmaj7)
      [[196.00, 233.08, 293.66], [130.81, 164.81, 196.00], [174.61, 220.00, 261.63], [116.54, 146.83, 174.61]],
      // 7: Sweet Romantic Major (C, G, Am, F)
      [[130.81, 164.81, 196.00], [98.00, 123.47, 146.83], [110.00, 130.81, 164.81], [87.31, 109.99, 130.81]],
      // 8: Indie Folk Major (G, Em, C, D)
      [[98.00, 146.83, 196.00], [82.41, 123.47, 164.81], [130.81, 164.81, 196.00], [146.83, 185.00, 220.00]],
    ];

    let chords: number[][];
    if (isKantrum) {
      chords = progressionPool[5]; // High energy Kantrum A-D-E-A
    } else if (isWedding) {
      chords = progressionPool[4]; // Joyful Pleng Ka wedding G-C-D-G
    } else if (isRomantic) {
      chords = progressionPool[7]; // Sweet romantic ballad C-G-Am-F
    } else if (isLofi || isJazz) {
      chords = progressionPool[6]; // Mellow 7ths
    } else if (isSad) {
      chords = progressionPool[seed % 4]; // Cm, Dm, Am, or Em
    } else if (isRock) {
      chords = [
        [110.00, 164.81, 220.00], // A5
        [146.83, 220.00, 293.66], // D5
        [130.81, 196.00, 261.63], // C5
        [98.00, 146.83, 196.00],  // G5
      ];
    } else {
      chords = progressionPool[seed % progressionPool.length];
    }

    let step = 0;

    // Start elapsed counter
    this.progressTimerId = setInterval(() => {
      if (this.isPlaying) {
        this.elapsed += 1;
        this.notify();
      }
    }, 1000);

    // Optional Speech Vocal Recital
    if (this.vocalEnabled && song.lyrics && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanLines = song.lyrics
        .split('\n')
        .filter(l => l.trim().length > 0 && !l.trim().startsWith('['))
        .slice(0, 8)
        .join('. ');

      const utterance = new SpeechSynthesisUtterance(cleanLines);
      utterance.rate = this.currentBpm > 110 ? 1.1 : 0.88;
      utterance.pitch = isSad ? 0.92 : isKantrum ? 1.08 : 1.0;
      utterance.volume = this.volume;
      window.speechSynthesis.speak(utterance);
    }

    const playStep = () => {
      if (!this.isPlaying || !this.ctx) return;

      const chordIndex = Math.floor(step / 8) % chords.length;
      const chord = chords[chordIndex];
      const now = this.ctx.currentTime;

      // Play instrument layers based on genre
      if (isKantrum) {
        // Fast syncopated roneat arpeggios
        const noteIdx = step % chord.length;
        this.playNote(chord[noteIdx] * 2, now, 0.15, 'triangle', 0.08);

        // Punchy bass
        if (step % 2 === 0) {
          this.playBass(chord[0] * 0.5, now, 0.2, 0.16);
        }

        // Fast Kantrum Drum groove (134+ BPM)
        if (step % 4 === 0 || step % 4 === 3) {
          this.playKick(now);
        }
        if (step % 4 === 2) {
          this.playSnare(now);
        }
        this.playHiHat(now, true); // Chhing bell accent

      } else if (isSad) {
        // Gentle sustained pad on half notes
        if (step % 4 === 0) {
          chord.forEach((freq) => {
            this.playNote(freq * 1.5, now, 0.7, 'sine', 0.04);
          });
          // Deep mournful acoustic bass
          this.playBass(chord[0] * 0.5, now, 0.6, 0.11);
        }

        // Slow soft heartbeat ballad percussion
        if (step % 8 === 0) {
          this.playKick(now);
        }
        if (step % 8 === 4) {
          this.playSnare(now);
        }
        if (step % 2 === 0) {
          this.playHiHat(now, false);
        }

      } else {
        // Standard groove
        if (step % 2 === 0) {
          chord.forEach((freq) => {
            this.playNote(freq * 1.5, now, 0.45, isRock ? 'sawtooth' : 'sine', 0.04);
          });
          this.playBass(chord[0] * 0.5, now, 0.4, 0.12);
        }

        if (step % 4 === 0) {
          this.playKick(now);
        }
        if (step % 4 === 2) {
          this.playSnare(now);
        }
        this.playHiHat(now, false);
      }

      step = (step + 1) % 32;
      this.timerId = setTimeout(playStep, intervalMs);
    };

    playStep();
    this.notify();
  }

  private playNote(freq: number, time: number, duration: number, type: OscillatorType, gainVal: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.exponentialRampToValueAtTime(gainVal, time + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + duration);
  }

  private playBass(freq: number, time: number, duration: number, gainVal: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(gainVal, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + duration);
  }

  private playKick(time: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.frequency.setValueAtTime(140, time);
    osc.frequency.exponentialRampToValueAtTime(35, time + 0.12);

    gain.gain.setValueAtTime(0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.15);
  }

  private playSnare(time: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.frequency.setValueAtTime(180, time);
    oscGain.gain.setValueAtTime(0.12, time);
    oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
    osc.connect(oscGain);
    oscGain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.1);

    const bufferSize = this.ctx.sampleRate * 0.1;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(800, time);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.15, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    whiteNoise.start(time);
    whiteNoise.stop(time + 0.12);
  }

  private playHiHat(time: number, isChhing: boolean = false) {
    if (!this.ctx || !this.masterGain) return;
    const duration = isChhing ? 0.08 : 0.03;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = isChhing ? 'bandpass' : 'highpass';
    filter.frequency.setValueAtTime(isChhing ? 4500 : 7000, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(isChhing ? 0.07 : 0.04, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    source.start(time);
    source.stop(time + duration);
  }

  public stop() {
    this.isPlaying = false;
    this.currentSongId = null;
    this.elapsed = 0;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.progressTimerId) {
      clearInterval(this.progressTimerId);
      this.progressTimerId = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.notify();
  }

  public getStatus(): PlaybackState {
    const mins = Math.floor(this.elapsed / 60);
    const secs = this.elapsed % 60;
    const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    return {
      isPlaying: this.isPlaying,
      songId: this.currentSongId,
      elapsedSeconds: this.elapsed,
      formattedTime: formatted,
      volume: this.volume,
      vocalEnabled: this.vocalEnabled,
      bpm: this.currentBpm,
    };
  }
}

export const musicSynth = new MusicPreviewSynth();
