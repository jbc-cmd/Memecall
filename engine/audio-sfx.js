/**
 * MemeCall Audio Synthesizer (Web Audio API)
 * Generates custom sound effects dynamically with 0 external dependencies.
 */
window.MemeAudioEngine = (function () {
  let audioCtx = null;
  let soundEnabled = true;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  return {
    setEnabled(enabled) {
      soundEnabled = enabled;
    },
    isEnabled() {
      return soundEnabled;
    },
    play(soundType) {
      if (!soundEnabled) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;

        switch (soundType) {
          case 'anime_sparkle': {
            // Magical high chime sequence
            const freqs = [1046.5, 1318.5, 1567.98, 2093.0];
            freqs.forEach((f, i) => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(f, now + i * 0.07);
              gain.gain.setValueAtTime(0.2, now + i * 0.07);
              gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.35);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start(now + i * 0.07);
              osc.stop(now + i * 0.07 + 0.4);
            });
            break;
          }

          case 'gigachad': {
            // Heavy powerful brass fanfare
            const chords = [130.81, 164.81, 196.0, 261.63]; // C minor / power chord
            chords.forEach(f => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'sawtooth';
              osc.frequency.setValueAtTime(f, now);
              gain.gain.setValueAtTime(0.18, now);
              gain.gain.linearRampToValueAtTime(0.25, now + 0.15);
              gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start(now);
              osc.stop(now + 0.95);
            });
            break;
          }

          case 'bruh': {
            // Deep low pitch drop "bruh" tone
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(140, now);
            osc.frequency.exponentialRampToValueAtTime(45, now + 0.45);
            gain.gain.setValueAtTime(0.35, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.55);
            break;
          }

          case 'scream': {
            // Fast dissonant shock chord
            [300, 420, 590, 850].forEach((freq, idx) => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'sawtooth';
              osc.frequency.setValueAtTime(freq + (idx % 2 === 0 ? 30 : -20), now);
              osc.frequency.linearRampToValueAtTime(freq * 1.5, now + 0.25);
              gain.gain.setValueAtTime(0.15, now);
              gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start(now);
              osc.stop(now + 0.5);
            });
            break;
          }

          case 'pew': {
            // Sci-fi laser gun / Finger gun
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(1200, now);
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.2);
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.25);
            break;
          }

          case 'mewing': {
            // Sleek synth glide
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(220, now);
            osc.frequency.linearRampToValueAtTime(440, now + 0.15);
            osc.frequency.linearRampToValueAtTime(330, now + 0.35);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.65);
            break;
          }

          case 'super_saiyan': {
            // Power up whoosh & vibration
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(80, now);
            osc.frequency.linearRampToValueAtTime(380, now + 0.5);
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.85);
            break;
          }

          case 'galaxy_brain': {
            // Cosmic ethereal ascending tones
            [440, 554.37, 659.25, 880, 1108.73].forEach((f, i) => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(f, now + i * 0.09);
              gain.gain.setValueAtTime(0.18, now + i * 0.09);
              gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.5);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start(now + i * 0.09);
              osc.stop(now + i * 0.09 + 0.55);
            });
            break;
          }

          case 'heart_pop': {
            // Cute bubbly pop
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(950, now + 0.12);
            gain.gain.setValueAtTime(0.28, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.3);
            break;
          }

          case 'salute': {
            // Patriotic bugle / trumpet fanfare (C - G - C)
            const notes = [261.63, 392.00, 523.25];
            notes.forEach((f, idx) => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'sawtooth';
              osc.frequency.setValueAtTime(f, now + idx * 0.12);
              gain.gain.setValueAtTime(0.2, now + idx * 0.12);
              gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.3);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start(now + idx * 0.12);
              osc.stop(now + idx * 0.12 + 0.35);
            });
            break;
          }

          default:
            break;
        }
      } catch (err) {
        console.warn('[MemeCall Audio] Error playing SFX:', err);
      }
    }
  };
})();
