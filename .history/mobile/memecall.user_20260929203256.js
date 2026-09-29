// ==UserScript==
// @name         MemeCall - AI Pose Meme Filter for Mobile & Desktop
// @namespace    https://github.com/jbc-cmd/Memecall
// @version      1.1.0
// @description  Pose-activated meme filters for Google Meet, Zoom, Teams, and video calls on Mobile & Desktop!
// @author       jbc-cmd
// @homepageURL  https://github.com/jbc-cmd/Memecall
// @match        *://meet.google.com/*
// @match        *://*.zoom.us/*
// @match        *://teams.microsoft.com/*
// @match        *://teams.live.com/*
// @match        *://classroom.google.com/*
// @match        *://discord.com/*
// @match        http://*/*
// @match        https://*/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
  'use strict';
  if (window.__MEMECALL_LOADED__) return;
  window.__MEMECALL_LOADED__ = true;

  console.log('📱 [MemeCall Mobile] Initializing complete MemeCall Mobile & Desktop Suite...');

  // ==========================================
  // 1. Audio SFX Synthesis Engine (Web Audio API) yeeeeah
  // ==========================================
  window.MemeAudioEngine = (function () {
    let audioCtx = null;
    let soundEnabled = true;

    function getAudioContext() {
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) audioCtx = new AudioContextClass();
      }
      if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
      return audioCtx;
    }

    return {
      setEnabled(e) { soundEnabled = e; },
      isEnabled() { return soundEnabled; },
      play(soundType) {
        if (!soundEnabled) return;
        try {
          const ctx = getAudioContext();
          if (!ctx) return;
          const now = ctx.currentTime;

          switch (soundType) {
            case 'anime_sparkle': {
              [1046.5, 1318.5, 1567.98, 2093.0].forEach((f, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(f, now + i * 0.07);
                gain.gain.setValueAtTime(0.2, now + i * 0.07);
                gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.35);
                osc.connect(gain); gain.connect(ctx.destination);
                osc.start(now + i * 0.07); osc.stop(now + i * 0.07 + 0.4);
              });
              break;
            }
            case 'gigachad': {
              [130.81, 164.81, 196.0, 261.63].forEach(f => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(f, now);
                gain.gain.setValueAtTime(0.18, now);
                gain.gain.linearRampToValueAtTime(0.25, now + 0.15);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
                osc.connect(gain); gain.connect(ctx.destination);
                osc.start(now); osc.stop(now + 0.95);
              });
              break;
            }
            case 'bruh': {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'triangle';
              osc.frequency.setValueAtTime(140, now);
              osc.frequency.exponentialRampToValueAtTime(45, now + 0.45);
              gain.gain.setValueAtTime(0.35, now);
              gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
              osc.connect(gain); gain.connect(ctx.destination);
              osc.start(now); osc.stop(now + 0.55);
              break;
            }
            case 'scream': {
              [300, 420, 590, 850].forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(freq + (idx % 2 === 0 ? 30 : -20), now);
                osc.frequency.linearRampToValueAtTime(freq * 1.5, now + 0.25);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
                osc.connect(gain); gain.connect(ctx.destination);
                osc.start(now); osc.stop(now + 0.5);
              });
              break;
            }
            case 'pew': {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'sawtooth';
              osc.frequency.setValueAtTime(1200, now);
              osc.frequency.exponentialRampToValueAtTime(100, now + 0.2);
              gain.gain.setValueAtTime(0.25, now);
              gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
              osc.connect(gain); gain.connect(ctx.destination);
              osc.start(now); osc.stop(now + 0.25);
              break;
            }
            case 'mewing': {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(220, now);
              osc.frequency.linearRampToValueAtTime(440, now + 0.15);
              osc.frequency.linearRampToValueAtTime(330, now + 0.35);
              gain.gain.setValueAtTime(0.2, now);
              gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
              osc.connect(gain); gain.connect(ctx.destination);
              osc.start(now); osc.stop(now + 0.65);
              break;
            }
            case 'super_saiyan': {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'sawtooth';
              osc.frequency.setValueAtTime(80, now);
              osc.frequency.linearRampToValueAtTime(380, now + 0.5);
              gain.gain.setValueAtTime(0.25, now);
              gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
              osc.connect(gain); gain.connect(ctx.destination);
              osc.start(now); osc.stop(now + 0.85);
              break;
            }
            case 'galaxy_brain': {
              [440, 554.37, 659.25, 880, 1108.73].forEach((f, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(f, now + i * 0.09);
                gain.gain.setValueAtTime(0.18, now + i * 0.09);
                gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.5);
                osc.connect(gain); gain.connect(ctx.destination);
                osc.start(now + i * 0.09); osc.stop(now + i * 0.09 + 0.55);
              });
              break;
            }
            case 'heart_pop': {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(600, now);
              osc.frequency.exponentialRampToValueAtTime(950, now + 0.12);
              gain.gain.setValueAtTime(0.28, now);
              gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
              osc.connect(gain); gain.connect(ctx.destination);
              osc.start(now); osc.stop(now + 0.3);
              break;
            }
            case 'salute': {
              [261.63, 392.00, 523.25].forEach((f, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(f, now + idx * 0.12);
                gain.gain.setValueAtTime(0.2, now + idx * 0.12);
                gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.3);
                osc.connect(gain); gain.connect(ctx.destination);
                osc.start(now + idx * 0.12); osc.stop(now + idx * 0.12 + 0.35);
              });
              break;
            }
            default:
              break;
          }
        } catch (e) {
          console.warn('[MemeCall Audio Error]', e);
        }
      }
    };
  })();

  // ==========================================
  // 2. Vector Graphics & Meme Assets Library (19 Memes)
  // ==========================================
  window.MemeAssets = (function () {
    function drawFloatingBanner(ctx, cx, cy, text, bgCol, textCol) {
      ctx.save();
      ctx.font = '900 22px sans-serif';
      const metrics = ctx.measureText(text);
      const bw = metrics.width + 40;
      const bh = 46;
      ctx.fillStyle = bgCol;
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.roundRect(cx - bw / 2, cy - bh / 2, bw, bh, 23);
      ctx.fill();
      ctx.fillStyle = textCol || '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, cx, cy);
      ctx.restore();
    }

    function drawGronkCreature(ctx, cx, cy, size, variant, time) {
      ctx.save();
      ctx.translate(cx, cy);
      const half = size * 0.5;

      // White Body
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#111111';
      ctx.lineWidth = Math.max(3, size * 0.02);
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      ctx.beginPath();
      ctx.moveTo(0, -half * 0.9);
      ctx.bezierCurveTo(half * 0.3, -half * 0.5, half * 0.75, 0, half * 0.88, half * 0.85);
      ctx.bezierCurveTo(half * 0.4, half * 0.95, -half * 0.4, half * 0.95, -half * 0.88, half * 0.85);
      ctx.bezierCurveTo(-half * 0.75, 0, -half * 0.3, -half * 0.5, 0, -half * 0.9);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Pink Nose
      const noseY = variant === 'smug' ? -half * 0.05 : -half * 0.15;
      ctx.fillStyle = '#f472b6';
      ctx.beginPath();
      ctx.ellipse(0, noseY, size * 0.09, size * 0.07, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      if (variant === 'smug') {
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-half * 0.3, -half * 0.35, size * 0.04, 0, Math.PI * 2);
        ctx.arc(half * 0.35, -half * 0.38, size * 0.045, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-half * 0.45, -half * 0.45);
        ctx.lineTo(-half * 0.18, -half * 0.42);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(half * 0.15, -half * 0.6);
        ctx.bezierCurveTo(half * 0.32, -half * 0.72, half * 0.48, -half * 0.68, half * 0.55, -half * 0.5);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-half * 0.55, half * 0.1);
        ctx.bezierCurveTo(-half * 0.2, half * 0.25, half * 0.3, half * 0.25, half * 0.58, half * 0.05);
        ctx.stroke();
      } else if (variant === 'scream') {
        [-half * 0.32, half * 0.32].forEach(ex => {
          ctx.fillStyle = '#000';
          ctx.beginPath();
          ctx.arc(ex, -half * 0.5, size * 0.1, 0, Math.PI * 2);
          ctx.fill();
        });
        const mw = size * 0.26;
        const mh = size * 0.42;
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.roundRect(-mw * 0.5, -half * 0.05, mw, mh, 16);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.fillRect(-mw * 0.28, -half * 0.05, mw * 0.26, mh * 0.28);
        ctx.fillRect(mw * 0.02, -half * 0.05, mw * 0.26, mh * 0.28);
      } else if (variant === 'lollipop') {
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-half * 0.28, -half * 0.38, size * 0.065, 0, Math.PI * 2);
        ctx.arc(half * 0.28, -half * 0.38, size * 0.065, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fb7185';
        ctx.beginPath();
        ctx.roundRect(-half * 0.15, half * 0.14, size * 0.16, size * 0.18, 12);
        ctx.fill();
        ctx.stroke();
        const hatY = -half * 0.85;
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(0, hatY, size * 0.18, Math.PI, 0);
        ctx.fill();
        ctx.stroke();
        ctx.save();
        ctx.translate(0, hatY - size * 0.12);
        ctx.rotate(time * 12);
        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        ctx.ellipse(0, 0, size * 0.22, size * 0.04, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (variant === 'beauty') {
        [-half * 0.28, half * 0.28].forEach(ex => {
          ctx.fillStyle = '#000';
          ctx.beginPath();
          ctx.arc(ex, -half * 0.4, size * 0.08, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 2.5;
          for (let l = -2; l <= 2; l++) {
            const angle = -Math.PI / 2 + l * 0.25;
            ctx.beginPath();
            ctx.moveTo(ex, -half * 0.4);
            ctx.lineTo(ex + Math.cos(angle) * size * 0.14, -half * 0.4 + Math.sin(angle) * size * 0.14);
            ctx.stroke();
          }
        });
        ctx.fillStyle = '#f472b6';
        ctx.beginPath();
        ctx.ellipse(0, half * 0.16, size * 0.09, size * 0.06, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else if (variant === 'nerd') {
        const gw = size * 0.32;
        const gh = size * 0.22;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 4;
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.strokeRect(-half * 0.45 - gw * 0.5, -half * 0.48, gw, gh);
        ctx.strokeRect(half * 0.45 - gw * 0.5, -half * 0.48, gw, gh);
        ctx.beginPath();
        ctx.moveTo(-half * 0.45 + gw * 0.5, -half * 0.38);
        ctx.lineTo(half * 0.45 - gw * 0.5, -half * 0.38);
        ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.fillRect(-size * 0.05, half * 0.1, size * 0.05, size * 0.08);
        ctx.fillRect(0, half * 0.1, size * 0.05, size * 0.08);
        ctx.strokeRect(-size * 0.05, half * 0.1, size * 0.05, size * 0.08);
        ctx.strokeRect(0, half * 0.1, size * 0.05, size * 0.08);
      } else if (variant === 'stare') {
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-half * 0.38, -half * 0.32, size * 0.045, 0, Math.PI * 2);
        ctx.arc(half * 0.38, -half * 0.32, size * 0.045, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-size * 0.1, half * 0.12);
        ctx.lineTo(size * 0.1, half * 0.12);
        ctx.stroke();
      } else if (variant === 'laugh') {
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(-half * 0.3, -half * 0.4, size * 0.07, Math.PI * 1.1, Math.PI * 1.9);
        ctx.arc(half * 0.3, -half * 0.4, size * 0.07, Math.PI * 1.1, Math.PI * 1.9);
        ctx.stroke();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.ellipse(0, half * 0.08, size * 0.18, size * 0.13, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.fillRect(-size * 0.06, half * 0.02, size * 0.06, size * 0.08);
        ctx.fillRect(0, half * 0.02, size * 0.06, size * 0.08);
      } else if (variant === 'blep') {
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-half * 0.28, -half * 0.38, size * 0.065, 0, Math.PI * 2);
        ctx.arc(half * 0.28, -half * 0.38, size * 0.065, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f472b6';
        ctx.beginPath();
        ctx.ellipse(0, half * 0.18, size * 0.08, size * 0.1, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();
    }

    function drawHeart(ctx, x, y, size, fill) {
      ctx.save();
      ctx.fillStyle = fill;
      ctx.beginPath();
      const topCurveHeight = size * 0.3;
      ctx.moveTo(x, y + topCurveHeight);
      ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
      ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 1.2, x, y + size);
      ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 1.2, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
      ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    const memes = {
      GRONK_BEAUTY: {
        id: 'GRONK_BEAUTY', name: 'Baddie Gronk (💅)', icon: '💅', sfx: 'anime_sparkle', category: 'gronk',
        draw(ctx, w, h, d) {
          drawGronkCreature(ctx, w * 0.75, h * 0.55, Math.min(w * 0.4, 270), 'beauty', d.time);
          drawFloatingBanner(ctx, w * 0.5, 55, '💅 SERVING MATERIAL GWORL 💅', '#f472b6', '#fff');
        }
      },
      GRONK_NERD: {
        id: 'GRONK_NERD', name: 'Nerd Gronk (🤓)', icon: '🤓', sfx: 'galaxy_brain', category: 'gronk',
        draw(ctx, w, h, d) {
          drawGronkCreature(ctx, w * 0.25, h * 0.55, Math.min(w * 0.38, 260), 'nerd', d.time);
          drawFloatingBanner(ctx, w * 0.5, 55, '🤓 "UMM ACTUALLY..." 🤓', '#38bdf8', '#000');
        }
      },
      GRONK_STARE: {
        id: 'GRONK_STARE', name: 'NPC Gronk (😐)', icon: '😐', sfx: 'bruh', category: 'gronk',
        draw(ctx, w, h, d) {
          drawGronkCreature(ctx, w * 0.5, h * 0.5, Math.min(w * 0.44, 300), 'stare', d.time);
          drawFloatingBanner(ctx, w * 0.5, h - 50, '😐 ... 😐', '#64748b', '#fff');
        }
      },
      GRONK_SMUG: {
        id: 'GRONK_SMUG', name: 'Smug Gronk (🤨)', icon: '🤨', sfx: 'mewing', category: 'gronk',
        draw(ctx, w, h, d) {
          drawGronkCreature(ctx, w * 0.75, h * 0.6, Math.min(w * 0.4, 270), 'smug', d.time);
          drawFloatingBanner(ctx, w * 0.5, 50, '🤨 *VINE BOOM* SUS 🤨', '#f59e0b', '#000');
        }
      },
      GRONK_SCREAM: {
        id: 'GRONK_SCREAM', name: 'Scream Gronk (😫)', icon: '😫', sfx: 'scream', category: 'gronk',
        draw(ctx, w, h, d) {
          drawGronkCreature(ctx, w * 0.5, h * 0.5, Math.min(w * 0.42, 280), 'scream', d.time);
          drawFloatingBanner(ctx, w * 0.5, h - 45, '😫 GAAAAHHH! 😫', '#ef4444', '#fff');
        }
      },
      GRONK_LOLLIPOP: {
        id: 'GRONK_LOLLIPOP', name: 'Beanie Gronk (🍭)', icon: '🍭', sfx: 'heart_pop', category: 'gronk',
        draw(ctx, w, h, d) {
          drawGronkCreature(ctx, w * 0.25, h * 0.6, Math.min(w * 0.4, 260), 'lollipop', d.time);
          drawFloatingBanner(ctx, w * 0.5, 50, '🍭 NO THOUGHTS 🍭', '#ec4899', '#fff');
        }
      },
      GRONK_LAUGH: {
        id: 'GRONK_LAUGH', name: 'Laugh Gronk (😄)', icon: '😄', sfx: 'anime_sparkle', category: 'gronk',
        draw(ctx, w, h, d) {
          drawGronkCreature(ctx, w * 0.78, h * 0.65, Math.min(w * 0.38, 260), 'laugh', d.time);
          drawFloatingBanner(ctx, w * 0.5, 50, '😄 HAHAHAHA 😄', '#10b981', '#fff');
        }
      },
      GRONK_BLEP: {
        id: 'GRONK_BLEP', name: 'Blep Gronk (😛)', icon: '😛', sfx: 'pew', category: 'gronk',
        draw(ctx, w, h, d) {
          drawGronkCreature(ctx, w * 0.22, h * 0.65, Math.min(w * 0.36, 250), 'blep', d.time);
          drawFloatingBanner(ctx, w * 0.5, 50, '😛 BLEP 😛', '#8b5cf6', '#fff');
        }
      },
      PEACE_SIGN: {
        id: 'PEACE_SIGN', name: 'Anime Kawaii (✌️)', icon: '✌️', sfx: 'anime_sparkle', category: 'gestures',
        draw(ctx, w, h, d) {
          drawFloatingBanner(ctx, w * 0.5, 50, '✨ SUGOI KAWAII! ✨', '#ff3388', '#fff');
        }
      },
      THUMBS_UP: {
        id: 'THUMBS_UP', name: 'Gigachad (👍)', icon: '👍', sfx: 'gigachad', category: 'gestures',
        draw(ctx, w, h, d) {
          drawFloatingBanner(ctx, w * 0.5, 50, 'APPROVED ✅', '#22c55e', '#fff');
        }
      },
      THUMBS_DOWN: {
        id: 'THUMBS_DOWN', name: 'Skill Issue (👎)', icon: '👎', sfx: 'bruh', category: 'gestures',
        draw(ctx, w, h, d) {
          drawFloatingBanner(ctx, w * 0.5, h - 50, '❌ SKILL ISSUE / REJECTED ❌', '#ef4444', '#fff');
        }
      },
      MEWING: {
        id: 'MEWING', name: 'Mewing Mogger (🤫)', icon: '🤫', sfx: 'mewing', category: 'gestures',
        draw(ctx, w, h, d) {
          drawFloatingBanner(ctx, w * 0.5, 50, '🤫 BYE BYE... MOGGED!', '#06b6d4', '#fff');
        }
      },
      SCREAM: {
        id: 'SCREAM', name: 'Shock Scream (😱)', icon: '😱', sfx: 'scream', category: 'reactions',
        draw(ctx, w, h, d) {
          drawFloatingBanner(ctx, w * 0.5, 50, '😱 AAAAAAAHHHHHH! 😱', '#ef4444', '#fff');
        }
      },
      FACEPALM: {
        id: 'FACEPALM', name: 'Bruh Facepalm (🤦)', icon: '🤦', sfx: 'bruh', category: 'reactions',
        draw(ctx, w, h, d) {
          drawFloatingBanner(ctx, w * 0.5, h - 45, '🤦 BRUH MOMENT #420 🤦', '#ffffff', '#000');
        }
      },
      FLEX: {
        id: 'FLEX', name: 'Super Saiyan (💪)', icon: '💪', sfx: 'super_saiyan', category: 'gestures',
        draw(ctx, w, h, d) {
          drawFloatingBanner(ctx, w * 0.5, 50, '⚡ OVER 9000! ⚡', '#eab308', '#000');
        }
      },
      HEART: {
        id: 'HEART', name: 'Heart Love (🫶)', icon: '🫶', sfx: 'heart_pop', category: 'gestures',
        draw(ctx, w, h, d) {
          const t = d.time || 0;
          for (let i = 0; i < 8; i++) {
            const hx = (w * 0.5) + Math.cos(t * 3 + i) * (w * 0.3);
            const hy = (h * 0.5) + Math.sin(t * 3 + i) * (h * 0.25);
            drawHeart(ctx, hx, hy, 28, 'rgba(236,72,153,0.85)');
          }
          drawFloatingBanner(ctx, w * 0.5, 50, '💖 WHOLESOME 💖', '#ec4899', '#fff');
        }
      },
      FINGER_GUN: {
        id: 'FINGER_GUN', name: 'Finger Gun POW (👉)', icon: '👉', sfx: 'pew', category: 'gestures',
        draw(ctx, w, h, d) {
          drawFloatingBanner(ctx, w * 0.5, h - 50, '👉 BANG! YOU ARE AWESOME! 👉', '#38bdf8', '#000');
        }
      },
      GALAXY_BRAIN: {
        id: 'GALAXY_BRAIN', name: 'Galaxy Brain (🧠)', icon: '🧠', sfx: 'galaxy_brain', category: 'reactions',
        draw(ctx, w, h, d) {
          drawFloatingBanner(ctx, w * 0.5, 50, '🌌 500 IQ GALAXY BRAIN 🌌', '#8b5cf6', '#fff');
        }
      },
      SALUTE: {
        id: 'SALUTE', name: 'Press F Salute (🫡)', icon: '🫡', sfx: 'salute', category: 'reactions',
        draw(ctx, w, h, d) {
          drawFloatingBanner(ctx, w * 0.5, h - 50, '🫡 PRESS [F] TO PAY RESPECTS 🫡', '#fbbf24', '#000');
        }
      }
    };

    return {
      getMemes() { return memes; },
      getMeme(id) { return memes[id] || null; }
    };
  })();

  // ==========================================
  // 3. Pose & Gesture Classifier
  // ==========================================
  window.MemePoseDetector = (function () {
    let procCanvas = null, procCtx = null;
    const PROC_W = 140, PROC_H = 100;
    let sensitivity = 0.65;

    return {
      setSensitivity(s) { sensitivity = s; },
      detect(video, rW, rH) {
        if (!procCanvas) {
          procCanvas = document.createElement('canvas');
          procCanvas.width = PROC_W; procCanvas.height = PROC_H;
          procCtx = procCanvas.getContext('2d', { willReadFrequently: true });
        }
        procCtx.drawImage(video, 0, 0, PROC_W, PROC_H);
        const data = procCtx.getImageData(0, 0, PROC_W, PROC_H).data;
        let skin = 0, sumX = 0, sumY = 0;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i + 1], b = data[i + 2];
          if (r > 70 && g > 35 && b > 20 && r > g && r > b) {
            skin++;
            const idx = i / 4;
            sumX += idx % PROC_W;
            sumY += Math.floor(idx / PROC_W);
          }
        }
        if (skin < 40) return null;
        return {
          face: { x: (sumX / skin) / PROC_W * rW, y: (sumY / skin) / PROC_H * rH, w: rW * 0.35, h: rH * 0.45 },
          pose: null
        };
      }
    };
  })();

  // ==========================================
  // 4. Compositor & Animation Renderer
  // ==========================================
  window.MemeRenderer = (function () {
    let activeMeme = null, memeStartTime = 0;
    const memeDuration = 2800;

    return {
      triggerMeme(id) {
        if (!id) return;
        activeMeme = id;
        memeStartTime = performance.now();
        const m = window.MemeAssets.getMeme(id);
        if (m && m.sfx && window.MemeAudioEngine) window.MemeAudioEngine.play(m.sfx);
        window.dispatchEvent(new CustomEvent('memecall:pose_triggered', { detail: { poseId: id, memeDef: m } }));
      },
      renderFrame(ctx, video, w, h, det) {
        ctx.save();
        ctx.translate(w, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, w, h);
        ctx.restore();

        const now = performance.now();
        if (activeMeme) {
          const elapsed = now - memeStartTime;
          if (elapsed > memeDuration) {
            activeMeme = null;
          } else {
            const m = window.MemeAssets.getMeme(activeMeme);
            if (m && typeof m.draw === 'function') {
              m.draw(ctx, w, h, {
                time: now / 1000,
                elapsed: elapsed / 1000,
                progress: elapsed / memeDuration,
                face: det ? det.face : { x: w * 0.5, y: h * 0.45, w: w * 0.35, h: h * 0.45 }
              });
            }
          }
        }
      }
    };
  })();

  // ==========================================
  // 5. WebRTC getUserMedia Stream Interceptor
  // ==========================================
  const origGetUserMedia = navigator.mediaDevices ? navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices) : null;
  if (navigator.mediaDevices && origGetUserMedia) {
    navigator.mediaDevices.getUserMedia = async function (constraints) {
      if (!constraints || !constraints.video) return origGetUserMedia(constraints);
      try {
        const stream = await origGetUserMedia(constraints);
        const vTrack = stream.getVideoTracks()[0];
        if (!vTrack) return stream;

        const hiddenVid = document.createElement('video');
        hiddenVid.autoplay = true; hiddenVid.muted = true; hiddenVid.playsInline = true;
        hiddenVid.srcObject = new MediaStream([vTrack]);
        await hiddenVid.play().catch(() => { });

        const settings = vTrack.getSettings ? vTrack.getSettings() : {};
        const width = settings.width || 640;
        const height = settings.height || 480;

        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');

        function loop() {
          if (hiddenVid.readyState >= 2) {
            const det = window.MemePoseDetector.detect(hiddenVid, width, height);
            window.MemeRenderer.renderFrame(ctx, hiddenVid, width, height, det);
          }
          requestAnimationFrame(loop);
        }
        loop();

        const pStream = canvas.captureStream(30);
        return new MediaStream([pStream.getVideoTracks()[0], ...stream.getAudioTracks()]);
      } catch (err) {
        return origGetUserMedia(constraints);
      }
    };
  }

  // ==========================================
  // 6. Mobile & Desktop In-Call Floating HUD
  // ==========================================
  function mountMobileHUD() {
    if (document.getElementById('memecall-hud-root')) return;
    const hud = document.createElement('div');
    hud.id = 'memecall-hud-root';
    hud.style.cssText = 'position:fixed;top:16px;right:16px;z-index:9999999;font-family:system-ui,-apple-system,sans-serif;user-select:none;';
    hud.innerHTML = `
      <div id="m-pill" style="background:rgba(15,23,42,0.92);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,0.22);border-radius:30px;padding:6px 14px;display:flex;align-items:center;gap:10px;color:#fff;box-shadow:0 10px 30px rgba(0,0,0,0.6);touch-action:none;cursor:pointer;transition:transform 0.15s ease;">
        <span style="font-size:18px;">🎭</span>
        <span style="font-size:13px;font-weight:800;background:linear-gradient(135deg,#c084fc,#f472b6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">MemeCall</span>
        <button id="m-btn-sound" style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);color:#fff;border-radius:12px;padding:3px 7px;font-size:12px;cursor:pointer;">🔊</button>
        <button id="m-btn" style="background:linear-gradient(135deg,#8b5cf6,#ec4899);border:none;color:#fff;border-radius:14px;padding:4px 10px;font-size:12px;font-weight:800;cursor:pointer;">⚡ Memes</button>
      </div>
      <div id="m-drawer" style="display:none;position:absolute;top:50px;right:0;width:300px;max-height:440px;background:rgba(15,23,42,0.96);backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,0.18);border-radius:20px;padding:12px;box-shadow:0 16px 40px rgba(0,0,0,0.7);flex-direction:column;gap:8px;">
        <div style="display:flex;align-items:center;gap:6px;">
          <input id="m-search" type="text" placeholder="🔍 Search meme..." style="flex:1;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:10px;padding:6px 10px;color:#fff;font-size:12px;outline:none;" />
        </div>
        <div id="m-categories" style="display:flex;gap:4px;overflow-x:auto;padding-bottom:2px;">
          <button class="m-cat-btn active" data-cat="all" style="background:#8b5cf6;border:none;color:#fff;border-radius:8px;padding:3px 8px;font-size:11px;font-weight:700;cursor:pointer;">All</button>
          <button class="m-cat-btn" data-cat="gronk" style="background:rgba(255,255,255,0.08);border:none;color:#94a3b8;border-radius:8px;padding:3px 8px;font-size:11px;font-weight:700;cursor:pointer;">🎭 Gronk</button>
          <button class="m-cat-btn" data-cat="gestures" style="background:rgba(255,255,255,0.08);border:none;color:#94a3b8;border-radius:8px;padding:3px 8px;font-size:11px;font-weight:700;cursor:pointer;">✌️ Poses</button>
          <button class="m-cat-btn" data-cat="reactions" style="background:rgba(255,255,255,0.08);border:none;color:#94a3b8;border-radius:8px;padding:3px 8px;font-size:11px;font-weight:700;cursor:pointer;">😱 Reactions</button>
        </div>
        <div id="m-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;max-height:300px;overflow-y:auto;">
        </div>
      </div>
    `;
    document.body.appendChild(hud);

    const drawer = hud.querySelector('#m-drawer');
    const grid = hud.querySelector('#m-grid');
    const searchInput = hud.querySelector('#m-search');
    const soundBtn = hud.querySelector('#m-btn-sound');
    const catBtns = hud.querySelectorAll('.m-cat-btn');
    const memes = window.MemeAssets.getMemes();

    let activeCategory = 'all';
    let searchQuery = '';

    function renderMemes() {
      grid.innerHTML = '';
      Object.values(memes).forEach(m => {
        if (activeCategory !== 'all' && m.category !== activeCategory) return;
        if (searchQuery && !m.name.toLowerCase().includes(searchQuery) && !m.id.toLowerCase().includes(searchQuery)) return;

        const chip = document.createElement('div');
        chip.style.cssText = 'background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:10px 4px;text-align:center;font-size:22px;cursor:pointer;transition:transform 0.1s ease, background 0.15s ease;display:flex;flex-direction:column;align-items:center;gap:2px;';
        chip.title = m.name;
        chip.innerHTML = `<span>${m.icon}</span><span style="font-size:9px;font-weight:600;color:#94a3b8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:55px;">${m.name.split(' ')[0]}</span>`;

        chip.addEventListener('click', () => {
          chip.style.transform = 'scale(1.25)';
          setTimeout(() => chip.style.transform = 'scale(1)', 150);
          window.MemeRenderer.triggerMeme(m.id);
        });
        grid.appendChild(chip);
      });
    }

    renderMemes();

    // Search filter
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderMemes();
    });

    // Category filter
    catBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        catBtns.forEach(b => {
          b.style.background = 'rgba(255,255,255,0.08)';
          b.style.color = '#94a3b8';
        });
        btn.style.background = '#8b5cf6';
        btn.style.color = '#fff';
        activeCategory = btn.getAttribute('data-cat');
        renderMemes();
      });
    });

    // Sound toggle
    let soundOn = true;
    soundBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      soundOn = !soundOn;
      soundBtn.textContent = soundOn ? '🔊' : '🔇';
      window.MemeAudioEngine.setEnabled(soundOn);
    });

    // Drawer toggle
    hud.querySelector('#m-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      drawer.style.display = drawer.style.display === 'flex' ? 'none' : 'flex';
    });

    // Touch & Mouse Dragging
    const pill = hud.querySelector('#m-pill');
    let isDragging = false, startX, startY, initL, initT;

    pill.addEventListener('touchstart', (e) => {
      isDragging = true;
      startX = e.touches[0].clientX; startY = e.touches[0].clientY;
      const rect = hud.getBoundingClientRect();
      initL = rect.left; initT = rect.top;
      hud.style.right = 'auto'; hud.style.left = `${initL}px`; hud.style.top = `${initT}px`;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      hud.style.left = `${Math.max(8, Math.min(window.innerWidth - 140, initL + (e.touches[0].clientX - startX)))}px`;
      hud.style.top = `${Math.max(8, Math.min(window.innerHeight - 60, initT + (e.touches[0].clientY - startY)))}px`;
    }, { passive: true });

    window.addEventListener('touchend', () => { isDragging = false; });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountMobileHUD);
  } else {
    mountMobileHUD();
  }
})();
