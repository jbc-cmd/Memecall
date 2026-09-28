// ==UserScript==
// @name         MemeCall - AI Pose Meme Filter for Mobile & Desktop
// @namespace    https://github.com/jbc-cmd/Memecall
// @version      1.0.1
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

  console.log('📱 [MemeCall Mobile] Starting Mobile/Desktop Userscript engine...');

  // --- 1. Audio SFX Engine ---
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
          if (soundType === 'anime_sparkle') {
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
          } else if (soundType === 'gigachad') {
            [130.81, 164.81, 196.0, 261.63].forEach(f => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'sawtooth';
              osc.frequency.setValueAtTime(f, now);
              gain.gain.setValueAtTime(0.18, now);
              gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
              osc.connect(gain); gain.connect(ctx.destination);
              osc.start(now); osc.stop(now + 0.95);
            });
          } else if (soundType === 'bruh') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(140, now);
            osc.frequency.exponentialRampToValueAtTime(45, now + 0.45);
            gain.gain.setValueAtTime(0.35, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
            osc.connect(gain); gain.connect(ctx.destination);
            osc.start(now); osc.stop(now + 0.55);
          } else {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            osc.connect(gain); gain.connect(ctx.destination);
            osc.start(now); osc.stop(now + 0.22);
          }
        } catch (e) {
          console.warn('[MemeCall Audio Error]', e);
        }
      }
    };
  })();

  // --- 2. Assets & Drawing Library ---
  window.MemeAssets = (function () {
    function drawFloatingBanner(ctx, cx, cy, text, bgCol, textCol) {
      ctx.save();
      ctx.font = '900 22px sans-serif';
      const metrics = ctx.measureText(text);
      const bw = metrics.width + 36;
      const bh = 44;
      ctx.fillStyle = bgCol;
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.roundRect(cx - bw / 2, cy - bh / 2, bw, bh, 22);
      ctx.fill();
      ctx.fillStyle = textCol;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, cx, cy);
      ctx.restore();
    }

    function drawGronk(ctx, cx, cy, size, variant, t) {
      ctx.save();
      ctx.translate(cx, cy);
      const half = size * 0.5;
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#111111';
      ctx.lineWidth = Math.max(3, size * 0.02);
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
        // Smug eyebrow
        ctx.beginPath();
        ctx.moveTo(half * 0.15, -half * 0.6);
        ctx.bezierCurveTo(half * 0.32, -half * 0.72, half * 0.48, -half * 0.68, half * 0.55, -half * 0.5);
        ctx.stroke();
        // Smirk
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
        ctx.fillStyle = '#000';
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
        // Tongue
        ctx.fillStyle = '#fb7185';
        ctx.beginPath();
        ctx.roundRect(-half * 0.15, half * 0.14, size * 0.16, size * 0.18, 12);
        ctx.fill();
        ctx.stroke();
        // Propeller
        ctx.save();
        ctx.translate(0, -half * 0.85 - size * 0.1);
        ctx.rotate(t * 12);
        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        ctx.ellipse(0, 0, size * 0.22, size * 0.04, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else {
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-half * 0.28, -half * 0.38, size * 0.065, 0, Math.PI * 2);
        ctx.arc(half * 0.28, -half * 0.38, size * 0.065, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    const memes = {
      GRONK_SMUG: {
        id: 'GRONK_SMUG', name: 'Smug Gronk', icon: '🤨', sfx: 'mewing',
        draw(ctx, w, h, d) {
          drawGronk(ctx, w * 0.75, h * 0.6, Math.min(w * 0.4, 260), 'smug', d.time);
          drawFloatingBanner(ctx, w * 0.5, 50, '🤨 SUS GRONK 🤨', '#f59e0b', '#000');
        }
      },
      GRONK_SCREAM: {
        id: 'GRONK_SCREAM', name: 'Scream Gronk', icon: '😫', sfx: 'scream',
        draw(ctx, w, h, d) {
          drawGronk(ctx, w * 0.5, h * 0.5, Math.min(w * 0.42, 280), 'scream', d.time);
          drawFloatingBanner(ctx, w * 0.5, h - 45, '😫 GAAAAHHH! 😫', '#ef4444', '#fff');
        }
      },
      GRONK_LOLLIPOP: {
        id: 'GRONK_LOLLIPOP', name: 'Beanie Gronk', icon: '🍭', sfx: 'heart_pop',
        draw(ctx, w, h, d) {
          drawGronk(ctx, w * 0.25, h * 0.6, Math.min(w * 0.4, 260), 'lollipop', d.time);
          drawFloatingBanner(ctx, w * 0.5, 50, '🍭 NO THOUGHTS 🍭', '#ec4899', '#fff');
        }
      },
      PEACE_SIGN: {
        id: 'PEACE_SIGN', name: 'Kawaii', icon: '✌️', sfx: 'anime_sparkle',
        draw(ctx, w, h, d) {
          drawFloatingBanner(ctx, w * 0.5, 50, '✨ SUGOI! ✨', '#ff3388', '#fff');
        }
      },
      THUMBS_UP: {
        id: 'THUMBS_UP', name: 'Gigachad', icon: '👍', sfx: 'gigachad',
        draw(ctx, w, h, d) {
          drawFloatingBanner(ctx, w * 0.5, 50, 'APPROVED ✅', '#22c55e', '#fff');
        }
      },
      MEWING: {
        id: 'MEWING', name: 'Mewing', icon: '🤫', sfx: 'mewing',
        draw(ctx, w, h, d) {
          drawFloatingBanner(ctx, w * 0.5, 50, '🤫 BYE BYE MOGGED', '#06b6d4', '#fff');
        }
      },
      SCREAM: {
        id: 'SCREAM', name: 'Scream', icon: '😱', sfx: 'scream',
        draw(ctx, w, h, d) {
          drawFloatingBanner(ctx, w * 0.5, 50, '😱 AAAAAHHH! 😱', '#ef4444', '#fff');
        }
      },
      FACEPALM: {
        id: 'FACEPALM', name: 'Bruh', icon: '🤦', sfx: 'bruh',
        draw(ctx, w, h, d) {
          drawFloatingBanner(ctx, w * 0.5, h - 45, 'BRUH MOMENT', '#ffffff', '#000');
        }
      },
      FLEX: {
        id: 'FLEX', name: 'Saiyan', icon: '💪', sfx: 'super_saiyan',
        draw(ctx, w, h, d) {
          drawFloatingBanner(ctx, w * 0.5, 50, '⚡ OVER 9000! ⚡', '#eab308', '#000');
        }
      },
      HEART: {
        id: 'HEART', name: 'Heart', icon: '🫶', sfx: 'heart_pop',
        draw(ctx, w, h, d) {
          drawFloatingBanner(ctx, w * 0.5, 50, '💖 WHOLESOME 💖', '#ec4899', '#fff');
        }
      }
    };

    return {
      getMemes() { return memes; },
      getMeme(id) { return memes[id] || null; }
    };
  })();

  // --- 3. Pose Detector ---
  window.MemePoseDetector = (function () {
    let procCanvas = null, procCtx = null;
    const PROC_W = 120, PROC_H = 90;

    return {
      setSensitivity() {},
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
          const r = data[i], g = data[i+1], b = data[i+2];
          if (r > 70 && g > 35 && b > 20 && r > g && r > b) {
            skin++;
            const idx = i / 4;
            sumX += idx % PROC_W;
            sumY += Math.floor(idx / PROC_W);
          }
        }
        if (skin < 50) return null;
        return {
          face: { x: (sumX / skin) / PROC_W * rW, y: (sumY / skin) / PROC_H * rH, w: rW * 0.35, h: rH * 0.45 },
          pose: null
        };
      }
    };
  })();

  // --- 4. Renderer & Compositor ---
  window.MemeRenderer = (function () {
    let activeMeme = null, memeStartTime = 0;
    return {
      triggerMeme(id) {
        activeMeme = id;
        memeStartTime = performance.now();
        const m = window.MemeAssets.getMeme(id);
        if (m && m.sfx && window.MemeAudioEngine) window.MemeAudioEngine.play(m.sfx);
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
          if (elapsed > 2800) {
            activeMeme = null;
          } else {
            const m = window.MemeAssets.getMeme(activeMeme);
            if (m) m.draw(ctx, w, h, { time: now / 1000, face: det ? det.face : null });
          }
        }
      }
    };
  })();

  // --- 5. getUserMedia Interceptor ---
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
        await hiddenVid.play().catch(() => {});

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

  // --- 6. Mobile In-Call Floating HUD Mount ---
  function mountMobileHUD() {
    if (document.getElementById('memecall-hud-root')) return;
    const hud = document.createElement('div');
    hud.id = 'memecall-hud-root';
    hud.style.cssText = 'position:fixed;top:16px;right:16px;z-index:9999999;font-family:sans-serif;user-select:none;';
    hud.innerHTML = `
      <div id="m-pill" style="background:rgba(15,23,42,0.92);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.2);border-radius:30px;padding:6px 12px;display:flex;align-items:center;gap:8px;color:#fff;box-shadow:0 8px 24px rgba(0,0,0,0.5);touch-action:none;cursor:pointer;">
        <span style="font-size:16px;">🎭</span>
        <span style="font-size:12px;font-weight:700;color:#c084fc;">MemeCall</span>
        <button id="m-btn" style="background:#8b5cf6;border:none;color:#fff;border-radius:14px;padding:2px 8px;font-size:11px;font-weight:700;">⚡ Memes</button>
      </div>
      <div id="m-drawer" style="display:none;position:absolute;top:44px;right:0;width:240px;background:rgba(15,23,42,0.95);border:1px solid rgba(255,255,255,0.15);border-radius:16px;padding:10px;box-shadow:0 12px 30px rgba(0,0,0,0.6);grid-template-columns:repeat(3,1fr);gap:6px;">
      </div>
    `;
    document.body.appendChild(hud);

    const drawer = hud.querySelector('#m-drawer');
    const memes = window.MemeAssets.getMemes();
    Object.values(memes).forEach(m => {
      const chip = document.createElement('div');
      chip.style.cssText = 'background:rgba(255,255,255,0.08);border-radius:10px;padding:8px 4px;text-align:center;font-size:20px;cursor:pointer;';
      chip.textContent = m.icon;
      chip.addEventListener('click', () => {
        window.MemeRenderer.triggerMeme(m.id);
        drawer.style.display = 'none';
      });
      drawer.appendChild(chip);
    });

    hud.querySelector('#m-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      drawer.style.display = drawer.style.display === 'grid' ? 'none' : 'grid';
    });

    // Touch Dragging
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
      hud.style.left = `${Math.max(8, Math.min(window.innerWidth - 130, initL + (e.touches[0].clientX - startX)))}px`;
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
