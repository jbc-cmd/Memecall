/**
 * MemeCall Vector Sticker & Overlay Library
 * Rich vector stickers with crisp graphics and animation parameters.
 */
window.MemeAssets = (function () {
  const memes = {
    PEACE_SIGN: {
      id: 'PEACE_SIGN',
      name: 'Anime Sparkles & Kawaii',
      icon: '✌️',
      sfx: 'anime_sparkle',
      category: 'anime',
      description: 'Big anime eyes, blush cheeks, and shiny starburst particles.',
      draw(ctx, width, height, data) {
        const t = data.time || 0;
        const face = data.face || { x: width * 0.5, y: height * 0.45, w: width * 0.35, h: height * 0.45 };
        
        // 1. Anime Blush on cheeks
        const blushW = face.w * 0.22;
        const blushH = face.h * 0.12;
        const leftCheek = { x: face.x - face.w * 0.28, y: face.y + face.h * 0.1 };
        const rightCheek = { x: face.x + face.w * 0.28, y: face.y + face.h * 0.1 };

        [leftCheek, rightCheek].forEach(pos => {
          ctx.save();
          const grad = ctx.createRadialGradient(pos.x, pos.y, 2, pos.x, pos.y, blushW);
          grad.addColorStop(0, 'rgba(255, 105, 180, 0.85)');
          grad.addColorStop(0.7, 'rgba(255, 105, 180, 0.4)');
          grad.addColorStop(1, 'rgba(255, 105, 180, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.ellipse(pos.x, pos.y, blushW, blushH, 0, 0, Math.PI * 2);
          ctx.fill();

          // Cute blush slash lines
          ctx.strokeStyle = '#ff1493';
          ctx.lineWidth = 2.5;
          ctx.lineCap = 'round';
          for (let i = -1; i <= 1; i++) {
            ctx.beginPath();
            ctx.moveTo(pos.x + i * 8 - 4, pos.y - 6);
            ctx.lineTo(pos.x + i * 8 + 4, pos.y + 6);
            ctx.stroke();
          }
          ctx.restore();
        });

        // 2. Shiny Anime Starbursts floating around
        const starCount = 8;
        for (let i = 0; i < starCount; i++) {
          const angle = (i / starCount) * Math.PI * 2 + t * 2;
          const radius = face.w * 0.7 + Math.sin(t * 4 + i) * 20;
          const sx = face.x + Math.cos(angle) * radius;
          const sy = face.y + Math.sin(angle) * radius * 0.8;
          const starSize = 14 + Math.sin(t * 6 + i) * 6;

          drawStar(ctx, sx, sy, starSize, '#FFDF00', '#FFF');
        }

        // 3. Manga/Anime Speech Bubble
        const bubbleX = Math.min(width - 160, Math.max(160, face.x + face.w * 0.5));
        const bubbleY = Math.max(60, face.y - face.h * 0.45);
        drawSpeechBubble(ctx, bubbleX, bubbleY, '✨ SUGOI! ✨', '#ff3388', '#fff');
      }
    },

    THUMBS_UP: {
      id: 'THUMBS_UP',
      name: 'Gigachad Approved',
      icon: '👍',
      sfx: 'gigachad',
      category: 'chad',
      description: 'Gigachad sunglasses, golden jawline shine, and APPROVED stamp.',
      draw(ctx, width, height, data) {
        const t = data.time || 0;
        const face = data.face || { x: width * 0.5, y: height * 0.45, w: width * 0.35, h: height * 0.45 };
        
        // 1. Pixel/Cool Thug Life / Gigachad Sunglasses falling down onto eyes
        const eyeY = face.y - face.h * 0.08;
        const glassesW = face.w * 0.75;
        const glassesH = glassesW * 0.32;
        const dropOffset = Math.max(0, (1 - Math.min(1, data.elapsed * 3)) * -200);

        ctx.save();
        ctx.translate(face.x, eyeY + dropOffset);

        // Frame
        ctx.fillStyle = '#111';
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 3;
        ctx.beginPath();
        // Left lens
        ctx.roundRect(-glassesW * 0.48, -glassesH * 0.5, glassesW * 0.42, glassesH, 6);
        // Right lens
        ctx.roundRect(glassesW * 0.06, -glassesH * 0.5, glassesW * 0.42, glassesH, 6);
        // Bridge
        ctx.rect(-glassesW * 0.1, -glassesH * 0.15, glassesW * 0.2, glassesH * 0.2);
        ctx.fill();
        ctx.stroke();

        // White reflective glint stripes
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-glassesW * 0.42, -glassesH * 0.25);
        ctx.lineTo(-glassesW * 0.25, glassesH * 0.35);
        ctx.moveTo(glassesW * 0.12, -glassesH * 0.25);
        ctx.lineTo(glassesW * 0.29, glassesH * 0.35);
        ctx.stroke();
        ctx.restore();

        // 2. Giant Golden "APPROVED" Rubber Stamp on top right
        ctx.save();
        const stampScale = Math.min(1.0, 0.4 + data.elapsed * 4);
        ctx.translate(width * 0.8, height * 0.22);
        ctx.rotate(-0.18);
        ctx.scale(stampScale, stampScale);

        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 6;
        ctx.fillStyle = 'rgba(34, 197, 94, 0.15)';
        ctx.beginPath();
        ctx.roundRect(-120, -40, 240, 80, 12);
        ctx.fill();
        ctx.stroke();

        ctx.font = '900 34px sans-serif';
        ctx.fillStyle = '#22c55e';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('APPROVED ✅', 0, 0);
        ctx.restore();
      }
    },

    THUMBS_DOWN: {
      id: 'THUMBS_DOWN',
      name: 'Skill Issue / Rejected',
      icon: '👎',
      sfx: 'bruh',
      category: 'reaction',
      description: 'Red REJECTED stamp, raining tear drops, and sad violin aura.',
      draw(ctx, width, height, data) {
        const t = data.time || 0;
        const face = data.face || { x: width * 0.5, y: height * 0.45, w: width * 0.35, h: height * 0.45 };

        // 1. Crying waterfall tears from eyes
        const eyeY = face.y - face.h * 0.05;
        const leftEyeX = face.x - face.w * 0.25;
        const rightEyeX = face.x + face.w * 0.25;

        [leftEyeX, rightEyeX].forEach(ex => {
          ctx.save();
          ctx.fillStyle = 'rgba(56, 189, 248, 0.85)';
          const streamH = height - eyeY;
          ctx.beginPath();
          ctx.rect(ex - 8, eyeY, 16, streamH);
          ctx.fill();

          // Animated splash puddles
          for (let k = 0; k < 4; k++) {
            const dropY = eyeY + ((t * 400 + k * 120) % (streamH + 50));
            ctx.fillStyle = '#bae6fd';
            ctx.beginPath();
            ctx.arc(ex + (k % 2 === 0 ? 6 : -6), dropY, 6, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        });

        // 2. Red "SKILL ISSUE / REJECTED" stamp
        ctx.save();
        ctx.translate(width * 0.5, height * 0.82);
        ctx.rotate(0.05 * Math.sin(t * 6));
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 7;
        ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
        ctx.beginPath();
        ctx.roundRect(-160, -35, 320, 70, 10);
        ctx.fill();
        ctx.stroke();

        ctx.font = '900 32px sans-serif';
        ctx.fillStyle = '#ef4444';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('❌ SKILL ISSUE ❌', 0, 0);
        ctx.restore();
      }
    },

    MEWING: {
      id: 'MEWING',
      name: 'Mewing & Mogging (🤫🧏)',
      icon: '🤫',
      sfx: 'mewing',
      category: 'chad',
      description: 'Chiseled laser jawline highlight and Sigma Chad Mogging emoji aura.',
      draw(ctx, width, height, data) {
        const t = data.time || 0;
        const face = data.face || { x: width * 0.5, y: height * 0.45, w: width * 0.35, h: height * 0.45 };

        // 1. Sharp glowing neon cyan jawline contour
        const chinY = face.y + face.h * 0.48;
        const jawL = { x: face.x - face.w * 0.4, y: face.y + face.h * 0.2 };
        const jawR = { x: face.x + face.w * 0.4, y: face.y + face.h * 0.2 };
        const chin = { x: face.x, y: chinY };

        ctx.save();
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 20;
        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(jawL.x, jawL.y);
        ctx.lineTo(chin.x - 20, chin.y);
        ctx.lineTo(chin.x + 20, chin.y);
        ctx.lineTo(jawR.x, jawR.y);
        ctx.stroke();

        // 2. Chiseled cheekbone cuts
        ctx.strokeStyle = '#67e8f9';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(face.x - face.w * 0.35, face.y);
        ctx.lineTo(face.x - face.w * 0.15, face.y + face.h * 0.18);
        ctx.moveTo(face.x + face.w * 0.35, face.y);
        ctx.lineTo(face.x + face.w * 0.15, face.y + face.h * 0.18);
        ctx.stroke();
        ctx.restore();

        // 3. Top Banner: "🤫🧏 BYE BYE (MOGGING)"
        drawFloatingBanner(ctx, width * 0.5, 60, '🤫 🧏 BYE BYE... MOGGED!', '#06b6d4', '#fff');
      }
    },

    SCREAM: {
      id: 'SCREAM',
      name: 'The Scream / Wojak Shock',
      icon: '😱',
      sfx: 'scream',
      category: 'reaction',
      description: 'Munch swirl distortion, dramatic red shock lines, and Wojak scream.',
      draw(ctx, width, height, data) {
        const t = data.time || 0;
        const face = data.face || { x: width * 0.5, y: height * 0.45, w: width * 0.35, h: height * 0.45 };

        // 1. Dramatic Anime/Manga Shock Action Lines from edges inward
        ctx.save();
        const lineCount = 36;
        ctx.strokeStyle = 'rgba(255, 230, 0, 0.75)';
        ctx.lineWidth = 3;
        for (let i = 0; i < lineCount; i++) {
          const ang = (i / lineCount) * Math.PI * 2 + (Math.sin(t * 30 + i) * 0.05);
          const outerR = Math.max(width, height) * 0.75;
          const innerR = face.w * (0.6 + Math.sin(t * 20 + i) * 0.1);
          const x1 = face.x + Math.cos(ang) * outerR;
          const y1 = face.y + Math.sin(ang) * outerR;
          const x2 = face.x + Math.cos(ang) * innerR;
          const y2 = face.y + Math.sin(ang) * innerR;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
        ctx.restore();

        // 2. Comic Screaming Text
        const shakeX = (Math.random() - 0.5) * 16;
        const shakeY = (Math.random() - 0.5) * 16;
        ctx.save();
        ctx.translate(width * 0.5 + shakeX, height * 0.18 + shakeY);
        ctx.font = '900 48px Impact, sans-serif';
        ctx.fillStyle = '#ff0033';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 8;
        ctx.textAlign = 'center';
        ctx.strokeText('😱 AAAAAAAHHHHHH! 😱', 0, 0);
        ctx.fillText('😱 AAAAAAAHHHHHH! 😱', 0, 0);
        ctx.restore();
      }
    },

    FACEPALM: {
      id: 'FACEPALM',
      name: 'Bruh Moment / Picard Facepalm',
      icon: '🤦',
      sfx: 'bruh',
      category: 'reaction',
      description: 'Classic bold BRUH MOMENT subtitle and giant sweat drop.',
      draw(ctx, width, height, data) {
        const t = data.time || 0;
        const face = data.face || { x: width * 0.5, y: height * 0.45, w: width * 0.35, h: height * 0.45 };

        // 1. Anime Sweat Drop on top corner of forehead
        const dropX = face.x + face.w * 0.38;
        const dropY = face.y - face.h * 0.28 + Math.sin(t * 5) * 4;
        drawSweatDrop(ctx, dropX, dropY, 32);

        // 2. Bottom Impact Meme Subtitle: "BRUH MOMENT"
        ctx.save();
        ctx.font = '900 44px Impact, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 9;
        ctx.strokeText('BRUH MOMENT #420', width * 0.5, height - 50);
        ctx.fillText('BRUH MOMENT #420', width * 0.5, height - 50);
        ctx.restore();
      }
    },

    FLEX: {
      id: 'FLEX',
      name: 'Super Saiyan / Buff Doge',
      icon: '💪',
      sfx: 'super_saiyan',
      category: 'chad',
      description: 'Golden flaming Super Saiyan aura, lightning bolts, and POWER level.',
      draw(ctx, width, height, data) {
        const t = data.time || 0;
        const face = data.face || { x: width * 0.5, y: height * 0.45, w: width * 0.35, h: height * 0.45 };

        // 1. Fiery Golden Super Saiyan Aura radiating outwards
        ctx.save();
        const auraCount = 20;
        for (let i = 0; i < auraCount; i++) {
          const angle = (i / auraCount) * Math.PI * 2 + t;
          const flameLength = face.w * 0.9 + Math.sin(t * 12 + i * 2) * 35;
          const fx = face.x + Math.cos(angle) * (face.w * 0.5);
          const fy = face.y + Math.sin(angle) * (face.h * 0.5);
          const endX = face.x + Math.cos(angle) * flameLength;
          const endY = face.y + Math.sin(angle) * flameLength;

          const grad = ctx.createLinearGradient(fx, fy, endX, endY);
          grad.addColorStop(0, 'rgba(255, 230, 0, 0.8)');
          grad.addColorStop(0.5, 'rgba(255, 120, 0, 0.5)');
          grad.addColorStop(1, 'rgba(255, 0, 0, 0)');

          ctx.strokeStyle = grad;
          ctx.lineWidth = 14 + Math.sin(t * 8 + i) * 6;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(fx, fy);
          ctx.lineTo(endX, endY);
          ctx.stroke();
        }

        // 2. Cyan Lightning Sparks
        ctx.strokeStyle = '#67e8f9';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 15;
        for (let j = 0; j < 4; j++) {
          const lx = face.x + (Math.sin(t * 15 + j) * face.w * 0.7);
          const ly = face.y + (Math.cos(t * 10 + j) * face.h * 0.6);
          drawLightning(ctx, lx, ly, 45, t + j);
        }
        ctx.restore();

        // 3. Power Level Banner
        drawFloatingBanner(ctx, width * 0.5, 60, '⚡ POWER LEVEL: OVER 9000! ⚡', '#eab308', '#000');
      }
    },

    HEART: {
      id: 'HEART',
      name: 'Heart Explosion & Cupid Love',
      icon: '🫶',
      sfx: 'heart_pop',
      category: 'cute',
      description: 'Flying pink hearts burst, love sparkles, and Cupid aura.',
      draw(ctx, width, height, data) {
        const t = data.time || 0;
        const face = data.face || { x: width * 0.5, y: height * 0.45, w: width * 0.35, h: height * 0.45 };

        // 1. Floating sparkling hearts
        const heartCount = 12;
        for (let i = 0; i < heartCount; i++) {
          const progress = ((t * 0.8 + i / heartCount) % 1);
          const angle = (i / heartCount) * Math.PI * 2 + Math.sin(t * 2 + i) * 0.5;
          const dist = progress * (face.w * 1.2);
          const hx = face.x + Math.cos(angle) * dist;
          const hy = face.y + Math.sin(angle) * dist - (progress * 60);
          const size = (1 - progress * 0.5) * 24;
          const alpha = 1 - progress;

          drawHeart(ctx, hx, hy, size, `rgba(244, 63, 94, ${alpha})`);
        }

        // 2. Center Love Heart Frame
        const pulse = 1 + Math.sin(t * 10) * 0.15;
        ctx.save();
        ctx.translate(face.x, face.y - face.h * 0.35);
        ctx.scale(pulse, pulse);
        drawHeart(ctx, 0, 0, 36, '#ec4899');
        ctx.restore();

        // 3. Top Banner
        drawFloatingBanner(ctx, width * 0.5, 55, '💖 MAXIMUM WHOLESOME 💖', '#ec4899', '#fff');
      }
    },

    FINGER_GUN: {
      id: 'FINGER_GUN',
      name: 'Comic POW! & Spider-Man',
      icon: '👉',
      sfx: 'pew',
      category: 'meme',
      description: 'Comic pop-art POW! explosion bubble & laser beam pointer.',
      draw(ctx, width, height, data) {
        const t = data.time || 0;
        const hand = data.hand || { x: width * 0.7, y: height * 0.5 };

        // 1. Laser Beam or Comic Starburst from finger
        ctx.save();
        ctx.translate(hand.x, hand.y);
        const burstSize = 65 + Math.sin(t * 15) * 12;
        drawStarburst(ctx, 0, 0, burstSize, 12, '#f59e0b', '#dc2626');

        // Text inside burst: "POW!" or "BANG!"
        ctx.font = '900 28px Impact, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 5;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeText('BANG! 💥', 0, 0);
        ctx.fillText('BANG! 💥', 0, 0);
        ctx.restore();

        // 2. Spider-Man Pointing subtitle
        ctx.save();
        ctx.font = '900 36px Impact, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#38bdf8';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 7;
        ctx.strokeText('👉 YOU ARE AWESOME! 👉', width * 0.5, height - 55);
        ctx.fillText('👉 YOU ARE AWESOME! 👉', width * 0.5, height - 55);
        ctx.restore();
      }
    },

    GALAXY_BRAIN: {
      id: 'GALAXY_BRAIN',
      name: 'Galaxy Brain & 500 IQ',
      icon: '🧠',
      sfx: 'galaxy_brain',
      category: 'meme',
      description: 'Glowing celestial galaxy brain aura with orbiting math equations.',
      draw(ctx, width, height, data) {
        const t = data.time || 0;
        const face = data.face || { x: width * 0.5, y: height * 0.45, w: width * 0.35, h: height * 0.45 };

        // 1. Radiant Cosmic Brain Halo above head
        const brainX = face.x;
        const brainY = face.y - face.h * 0.45;
        
        ctx.save();
        const grad = ctx.createRadialGradient(brainX, brainY, 10, brainX, brainY, face.w * 0.7);
        grad.addColorStop(0, 'rgba(192, 132, 252, 0.95)');
        grad.addColorStop(0.4, 'rgba(99, 102, 241, 0.6)');
        grad.addColorStop(1, 'rgba(15, 23, 42, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(brainX, brainY, face.w * 0.7, 0, Math.PI * 2);
        ctx.fill();

        // 2. Orbiting Math & Physics Formulas
        const formulas = ['E=mc²', '∫f(x)dx', 'e^(iπ)+1=0', '500 IQ', '🧠 ∞', '∇ × B = μ₀J'];
        ctx.font = '700 20px monospace';
        ctx.fillStyle = '#f0abfc';
        ctx.shadowColor = '#d946ef';
        ctx.shadowBlur = 10;
        ctx.textAlign = 'center';

        formulas.forEach((formula, idx) => {
          const ang = (idx / formulas.length) * Math.PI * 2 + t * 1.5;
          const rx = face.w * 0.65;
          const ry = face.h * 0.35;
          const fx = brainX + Math.cos(ang) * rx;
          const fy = brainY + Math.sin(ang) * ry;
          ctx.fillText(formula, fx, fy);
        });
        ctx.restore();

        // 3. Header Banner
        drawFloatingBanner(ctx, width * 0.5, 55, '🌌 500 IQ GALAXY BRAIN 🌌', '#8b5cf6', '#fff');
      }
    },

    SALUTE: {
      id: 'SALUTE',
      name: 'Press F to Pay Respects',
      icon: '🫡',
      sfx: 'salute',
      category: 'reaction',
      description: 'Military salute cap, medal of honor, and Press F in chat tribute.',
      draw(ctx, width, height, data) {
        const t = data.time || 0;
        const face = data.face || { x: width * 0.5, y: height * 0.45, w: width * 0.35, h: height * 0.45 };

        // 1. Military Commander Beret / Cap on top of head
        const capX = face.x;
        const capY = face.y - face.h * 0.42;
        const capW = face.w * 0.8;
        const capH = face.h * 0.32;

        ctx.save();
        ctx.translate(capX, capY);
        // Beret body
        ctx.fillStyle = '#1e3a8a';
        ctx.beginPath();
        ctx.ellipse(0, 0, capW * 0.5, capH * 0.5, -0.1, 0, Math.PI * 2);
        ctx.fill();

        // Golden Badge
        ctx.fillStyle = '#eab308';
        ctx.beginPath();
        ctx.arc(-capW * 0.2, 0, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 2. Giant Banner: "PRESS F TO PAY RESPECTS"
        ctx.save();
        ctx.font = '900 42px Impact, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fbbf24';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 8;
        ctx.strokeText('🫡 PRESS [F] TO PAY RESPECTS 🫡', width * 0.5, height - 55);
        ctx.fillText('🫡 PRESS [F] TO PAY RESPECTS 🫡', width * 0.5, height - 55);
        ctx.restore();
      }
    },

    GRONK_SMUG: {
      id: 'GRONK_SMUG',
      name: 'Smug Gronk (Eyebrow)',
      icon: '🤨',
      sfx: 'mewing',
      category: 'gronk',
      description: 'The viral Smug Gronk meme with raised eyebrow and sly smirk.',
      draw(ctx, width, height, data) {
        const t = data.time || 0;
        const face = data.face || { x: width * 0.5, y: height * 0.45, w: width * 0.35, h: height * 0.45 };
        const bounce = Math.sin(t * 8) * 8;
        const size = Math.min(width * 0.38, 280);
        const gx = Math.min(width - size * 0.6, Math.max(size * 0.6, face.x + face.w * 0.65));
        const gy = Math.max(size * 0.6, face.y + bounce);

        drawGronkCreature(ctx, gx, gy, size, 'smug', t);
        drawFloatingBanner(ctx, width * 0.5, 60, '🤨 *VINE BOOM* SUS GRONK 🤨', '#f59e0b', '#000');
      }
    },

    GRONK_SCREAM: {
      id: 'GRONK_SCREAM',
      name: 'Screaming Gronk',
      icon: '😫',
      sfx: 'scream',
      category: 'gronk',
      description: 'Gaping open mouth Gronk with dark dilated eyes and buck teeth.',
      draw(ctx, width, height, data) {
        const t = data.time || 0;
        const face = data.face || { x: width * 0.5, y: height * 0.45, w: width * 0.35, h: height * 0.45 };
        const shakeX = (Math.random() - 0.5) * 12;
        const shakeY = (Math.random() - 0.5) * 12;
        const size = Math.min(width * 0.42, 300);

        ctx.save();
        ctx.translate(shakeX, shakeY);
        drawGronkCreature(ctx, face.x, face.y, size, 'scream', t);
        ctx.restore();

        // Screaming subtitles
        ctx.save();
        ctx.font = '900 42px Impact, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ef4444';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 7;
        ctx.strokeText('😫 GAAAAHHH! 😫', width * 0.5, height - 55);
        ctx.fillText('😫 GAAAAHHH! 😫', width * 0.5, height - 55);
        ctx.restore();
      }
    },

    GRONK_LOLLIPOP: {
      id: 'GRONK_LOLLIPOP',
      name: 'Propeller Hat Gronk',
      icon: '🍭',
      sfx: 'heart_pop',
      category: 'gronk',
      description: 'Silly Gronk wearing a spinning propeller hat and licking a rainbow lollipop.',
      draw(ctx, width, height, data) {
        const t = data.time || 0;
        const face = data.face || { x: width * 0.5, y: height * 0.45, w: width * 0.35, h: height * 0.45 };
        const size = Math.min(width * 0.38, 280);
        const gx = Math.min(width - size * 0.6, Math.max(size * 0.6, face.x - face.w * 0.65));
        const gy = Math.max(size * 0.6, face.y + Math.sin(t * 6) * 10);

        drawGronkCreature(ctx, gx, gy, size, 'lollipop', t);
        drawFloatingBanner(ctx, width * 0.5, 55, '🍭 NO THOUGHTS, JUST VIBES 🍭', '#ec4899', '#fff');
      }
    },

    GRONK_LAUGH: {
      id: 'GRONK_LAUGH',
      name: 'Laughing Gronk',
      icon: '😄',
      sfx: 'anime_sparkle',
      category: 'gronk',
      description: 'Happy laughing Gronk creature with top buck teeth.',
      draw(ctx, width, height, data) {
        const t = data.time || 0;
        const face = data.face || { x: width * 0.5, y: height * 0.45, w: width * 0.35, h: height * 0.45 };
        const size = Math.min(width * 0.38, 280);
        const gx = width * 0.78;
        const gy = height * 0.65 + Math.sin(t * 10) * 12;

        drawGronkCreature(ctx, gx, gy, size, 'laugh', t);
      }
    },

    GRONK_BLEP: {
      id: 'GRONK_BLEP',
      name: 'Derp Blep Gronk',
      icon: '😛',
      sfx: 'pew',
      category: 'gronk',
      description: 'Cute silly derp Gronk sticking its tongue out.',
      draw(ctx, width, height, data) {
        const t = data.time || 0;
        const face = data.face || { x: width * 0.5, y: height * 0.45, w: width * 0.35, h: height * 0.45 };
        const size = Math.min(width * 0.36, 260);
        const gx = width * 0.22;
        const gy = height * 0.65 + Math.cos(t * 7) * 10;

        drawGronkCreature(ctx, gx, gy, size, 'blep', t);
      }
    },

    GRONK_BEAUTY: {
      id: 'GRONK_BEAUTY',
      name: 'Mascara & Lashes Gronk',
      icon: '💅',
      sfx: 'anime_sparkle',
      category: 'gronk',
      description: 'Gronk putting on mascara with giant fluttery eyelashes & duck lips kiss.',
      draw(ctx, width, height, data) {
        const t = data.time || 0;
        const face = data.face || { x: width * 0.5, y: height * 0.45, w: width * 0.35, h: height * 0.45 };
        const size = Math.min(width * 0.4, 280);
        const gx = Math.min(width - size * 0.6, Math.max(size * 0.6, face.x + face.w * 0.6));
        const gy = Math.max(size * 0.6, face.y + Math.sin(t * 5) * 8);

        drawGronkCreature(ctx, gx, gy, size, 'beauty', t);
        drawFloatingBanner(ctx, width * 0.5, 55, '💅 SERVING MATERIAL GWORL 💅', '#f472b6', '#fff');
      }
    },

    GRONK_NERD: {
      id: 'GRONK_NERD',
      name: 'Nerd Glasses Gronk (🤓)',
      icon: '🤓',
      sfx: 'galaxy_brain',
      category: 'gronk',
      description: 'Geeky Gronk with thick black glasses and pointing finger.',
      draw(ctx, width, height, data) {
        const t = data.time || 0;
        const face = data.face || { x: width * 0.5, y: height * 0.45, w: width * 0.35, h: height * 0.45 };
        const size = Math.min(width * 0.38, 270);
        const gx = Math.min(width - size * 0.6, Math.max(size * 0.6, face.x - face.w * 0.6));
        const gy = Math.max(size * 0.6, face.y + Math.sin(t * 7) * 6);

        drawGronkCreature(ctx, gx, gy, size, 'nerd', t);
        drawFloatingBanner(ctx, width * 0.5, 55, '🤓 "UMM ACTUALLY..." 🤓', '#38bdf8', '#000');
      }
    },

    GRONK_STARE: {
      id: 'GRONK_STARE',
      name: '1000-Yard Stare Gronk',
      icon: '😐',
      sfx: 'bruh',
      category: 'gronk',
      description: 'Wide flat-headed Gronk staring deadpan into your soul.',
      draw(ctx, width, height, data) {
        const t = data.time || 0;
        const face = data.face || { x: width * 0.5, y: height * 0.45, w: width * 0.35, h: height * 0.45 };
        const size = Math.min(width * 0.44, 310);

        drawGronkCreature(ctx, face.x, face.y, size, 'stare', t);
        drawFloatingBanner(ctx, width * 0.5, height - 50, '😐 ... 😐', '#64748b', '#fff');
      }
    }
  };

  // --- Gronk Meme Character Vector Generator ---
  function drawGronkCreature(ctx, cx, cy, size, variant, time) {
    ctx.save();
    ctx.translate(cx, cy);

    const half = size * 0.5;

    // 1. Triangular White Body with organic doodle contour
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#111111';
    ctx.lineWidth = Math.max(3, size * 0.02);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    ctx.beginPath();
    // Top rounded head tip
    ctx.moveTo(0, -half * 0.9);
    // Right slope down to shoulder
    ctx.bezierCurveTo(half * 0.3, -half * 0.5, half * 0.75, 0, half * 0.88, half * 0.85);
    // Bottom chest/belly
    ctx.bezierCurveTo(half * 0.4, half * 0.95, -half * 0.4, half * 0.95, -half * 0.88, half * 0.85);
    // Left slope back to top
    ctx.bezierCurveTo(-half * 0.75, 0, -half * 0.3, -half * 0.5, 0, -half * 0.9);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Subtle doodle chest nips
    ctx.lineWidth = Math.max(2, size * 0.015);
    ctx.beginPath();
    ctx.arc(-half * 0.32, half * 0.65, size * 0.025, 0.4, 2.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(half * 0.32, half * 0.65, size * 0.025, 0.6, 2.7);
    ctx.stroke();

    // 2. Pink Nose (Characteristic of Gronk)
    const noseY = variant === 'smug' ? -half * 0.05 : -half * 0.15;
    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.ellipse(0, noseY, size * 0.09, size * 0.07, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 3. Expressions & Eyes / Mouth variants
    if (variant === 'smug') {
      // --- SMUG / THE ROCK EYEBROW ---
      // Left normal eye
      ctx.lineWidth = Math.max(2.5, size * 0.018);
      ctx.beginPath();
      ctx.arc(-half * 0.3, -half * 0.35, size * 0.04, 0, Math.PI * 2);
      ctx.fillStyle = '#000';
      ctx.fill();
      // Left eyebrow
      ctx.beginPath();
      ctx.moveTo(-half * 0.45, -half * 0.45);
      ctx.lineTo(-half * 0.18, -half * 0.42);
      ctx.stroke();

      // Right arched THE ROCK eyebrow
      ctx.beginPath();
      ctx.moveTo(half * 0.15, -half * 0.6);
      ctx.bezierCurveTo(half * 0.32, -half * 0.72, half * 0.48, -half * 0.68, half * 0.55, -half * 0.5);
      ctx.stroke();
      // Right eye looking sideways
      ctx.beginPath();
      ctx.arc(half * 0.35, -half * 0.38, size * 0.045, 0, Math.PI * 2);
      ctx.fill();

      // Sly Smirk Mouth
      ctx.beginPath();
      ctx.moveTo(-half * 0.55, half * 0.1);
      ctx.bezierCurveTo(-half * 0.2, half * 0.25, half * 0.3, half * 0.25, half * 0.58, half * 0.05);
      ctx.stroke();
      // Smirk cheek crease
      ctx.beginPath();
      ctx.moveTo(half * 0.58, 0);
      ctx.lineTo(half * 0.62, half * 0.12);
      ctx.stroke();

    } else if (variant === 'scream') {
      // --- SCREAM / GAPING OPEN MOUTH ---
      // Giant dark spiral shock eyes
      [-half * 0.32, half * 0.32].forEach(ex => {
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(ex, -half * 0.5, size * 0.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(ex, -half * 0.5, size * 0.06, 0, Math.PI * 1.5);
        ctx.stroke();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = Math.max(2.5, size * 0.018);
      });

      // Long vertical gaping screaming mouth
      const mw = size * 0.26;
      const mh = size * 0.42;
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.roundRect(-mw * 0.5, -half * 0.05, mw, mh, 16);
      ctx.fill();
      ctx.stroke();

      // Top Buck Teeth
      ctx.fillStyle = '#fff';
      ctx.fillRect(-mw * 0.28, -half * 0.05, mw * 0.26, mh * 0.28);
      ctx.fillRect(mw * 0.02, -half * 0.05, mw * 0.26, mh * 0.28);
      ctx.strokeRect(-mw * 0.28, -half * 0.05, mw * 0.26, mh * 0.28);
      ctx.strokeRect(mw * 0.02, -half * 0.05, mw * 0.26, mh * 0.28);

      // Bottom Buck Teeth
      ctx.fillRect(-mw * 0.24, -half * 0.05 + mh * 0.72, mw * 0.22, mh * 0.28);
      ctx.fillRect(mw * 0.02, -half * 0.05 + mh * 0.72, mw * 0.22, mh * 0.28);
      ctx.strokeRect(-mw * 0.24, -half * 0.05 + mh * 0.72, mw * 0.22, mh * 0.28);
      ctx.strokeRect(mw * 0.02, -half * 0.05 + mh * 0.72, mw * 0.22, mh * 0.28);

      // Pink Tongue inside
      ctx.fillStyle = '#f472b6';
      ctx.beginPath();
      ctx.ellipse(0, -half * 0.05 + mh * 0.55, mw * 0.25, mh * 0.16, 0, 0, Math.PI * 2);
      ctx.fill();

    } else if (variant === 'lollipop') {
      // --- PROPELLER BEANIE & LOLLIPOP ---
      // Silly smiling eyes
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(-half * 0.28, -half * 0.38, size * 0.065, 0, Math.PI * 2);
      ctx.arc(half * 0.28, -half * 0.38, size * 0.065, 0, Math.PI * 2);
      ctx.fill();

      // Silly smile with tongue sticking out
      ctx.beginPath();
      ctx.moveTo(-half * 0.35, half * 0.08);
      ctx.bezierCurveTo(-half * 0.1, half * 0.3, half * 0.2, half * 0.3, half * 0.38, half * 0.05);
      ctx.stroke();

      // Big pink tongue sticking out (Blep)
      ctx.fillStyle = '#fb7185';
      ctx.beginPath();
      ctx.roundRect(-half * 0.15, half * 0.14, size * 0.16, size * 0.18, 12);
      ctx.fill();
      ctx.stroke();

      // Propeller Hat on top
      const hatY = -half * 0.85;
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(0, hatY, size * 0.18, Math.PI, 0);
      ctx.fill();
      ctx.stroke();

      // Yellow beanie brim
      ctx.fillStyle = '#eab308';
      ctx.fillRect(-size * 0.2, hatY, size * 0.4, size * 0.05);
      ctx.strokeRect(-size * 0.2, hatY, size * 0.4, size * 0.05);

      // Spinning propeller
      const propAngle = time * 12;
      ctx.save();
      ctx.translate(0, hatY - size * 0.12);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-2, 0, 4, size * 0.12);
      ctx.rotate(propAngle);
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 0.22, size * 0.04, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Rainbow Swirl Lollipop in hand
      ctx.save();
      ctx.translate(-half * 0.6, half * 0.35);
      // Stick
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(size * 0.1, size * 0.25);
      ctx.stroke();
      // Candy spiral circle
      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.14, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.09, 0, Math.PI * 1.5);
      ctx.stroke();
      ctx.strokeStyle = '#06b6d4';
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.04, 0, Math.PI * 1.5);
      ctx.stroke();
      ctx.restore();

    } else if (variant === 'laugh') {
      // --- LAUGHING / HAPPY BUCK TEETH ---
      // Squinting happy arch eyes
      ctx.lineWidth = Math.max(3, size * 0.02);
      ctx.beginPath();
      ctx.arc(-half * 0.3, -half * 0.4, size * 0.07, Math.PI * 1.1, Math.PI * 1.9);
      ctx.arc(half * 0.3, -half * 0.4, size * 0.07, Math.PI * 1.1, Math.PI * 1.9);
      ctx.stroke();

      // Wide open laughing mouth
      const mw = size * 0.35;
      const mh = size * 0.26;
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.ellipse(0, half * 0.08, mw * 0.5, mh * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Top Buck Teeth
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-mw * 0.22, -mh * 0.25 + half * 0.08, mw * 0.2, mh * 0.4);
      ctx.fillRect(0.02 * mw, -mh * 0.25 + half * 0.08, mw * 0.2, mh * 0.4);
      ctx.strokeRect(-mw * 0.22, -mh * 0.25 + half * 0.08, mw * 0.2, mh * 0.4);
      ctx.strokeRect(0.02 * mw, -mh * 0.25 + half * 0.08, mw * 0.2, mh * 0.4);

      // Pink Tongue
      ctx.fillStyle = '#f472b6';
      ctx.beginPath();
      ctx.arc(0, half * 0.18, mw * 0.2, 0, Math.PI);
      ctx.fill();

    } else if (variant === 'blep') {
      // --- BLEP / DERP ---
      // Wide circular derp eyes
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(-half * 0.28, -half * 0.38, size * 0.065, 0, Math.PI * 2);
      ctx.arc(half * 0.28, -half * 0.38, size * 0.065, 0, Math.PI * 2);
      ctx.fill();

      // Cute tiny tongue sticking out
      ctx.fillStyle = '#f472b6';
      ctx.beginPath();
      ctx.ellipse(0, half * 0.18, size * 0.08, size * 0.1, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Smile curve
      ctx.beginPath();
      ctx.arc(0, half * 0.04, size * 0.16, 0.2, Math.PI - 0.2);
      ctx.stroke();

    } else if (variant === 'beauty') {
      // --- BEAUTY / MASCARA & FLUTTERY LASHES ---
      // Giant dramatic eyelashes
      [-half * 0.28, half * 0.28].forEach((ex, idx) => {
        // Eye
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(ex, -half * 0.4, size * 0.08, 0, Math.PI * 2);
        ctx.fill();

        // Long fluttery mascara eyelashes
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2.5;
        for (let l = -3; l <= 3; l++) {
          const lashAngle = -Math.PI / 2 + (l * 0.22);
          const lashLen = size * (0.12 + Math.abs(l) * 0.03);
          const lx = ex + Math.cos(lashAngle) * (size * 0.08);
          const ly = -half * 0.4 + Math.sin(lashAngle) * (size * 0.08);
          ctx.beginPath();
          ctx.moveTo(lx, ly);
          ctx.lineTo(lx + Math.cos(lashAngle) * lashLen, ly + Math.sin(lashAngle) * lashLen);
          ctx.stroke();
        }
      });

      // Puckered Duck Lips / Kiss mouth
      ctx.fillStyle = '#f472b6';
      ctx.strokeStyle = '#be185d';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, half * 0.16, size * 0.09, size * 0.06, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Lip crease
      ctx.beginPath();
      ctx.arc(0, half * 0.16, size * 0.03, 0, Math.PI * 2);
      ctx.stroke();

      // Hand holding Mascara Wand on right side
      ctx.save();
      ctx.translate(half * 0.65, -half * 0.4 + Math.sin(time * 8) * 6);
      ctx.strokeStyle = '#111';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, size * 0.15);
      ctx.lineTo(0, -size * 0.12);
      ctx.stroke();
      // Mascara brush tip
      ctx.fillStyle = '#000';
      ctx.fillRect(-3, -size * 0.12, 6, size * 0.08);
      ctx.restore();

    } else if (variant === 'nerd') {
      // --- NERD / THICK GLASSES & GEEK SMILE ---
      // Thick black rectangular nerd glasses
      const gw = size * 0.32;
      const gh = size * 0.22;
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = Math.max(4, size * 0.025);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';

      // Left lens
      ctx.beginPath();
      ctx.roundRect(-half * 0.45 - gw * 0.5, -half * 0.48, gw, gh, 6);
      ctx.fill();
      ctx.stroke();

      // Right lens
      ctx.beginPath();
      ctx.roundRect(half * 0.45 - gw * 0.5, -half * 0.48, gw, gh, 6);
      ctx.fill();
      ctx.stroke();

      // Bridge & side frames
      ctx.beginPath();
      ctx.moveTo(-half * 0.45 + gw * 0.5, -half * 0.38);
      ctx.lineTo(half * 0.45 - gw * 0.5, -half * 0.38);
      ctx.moveTo(-half * 0.45 - gw * 0.5, -half * 0.38);
      ctx.lineTo(-half * 0.85, -half * 0.32);
      ctx.moveTo(half * 0.45 + gw * 0.5, -half * 0.38);
      ctx.lineTo(half * 0.85, -half * 0.32);
      ctx.stroke();

      // Big nerdy buck teeth smile
      ctx.lineWidth = 2.5;
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(0, half * 0.1, size * 0.15, 0.1, Math.PI - 0.1);
      ctx.stroke();

      // Top Buck Teeth
      ctx.fillStyle = '#fff';
      ctx.fillRect(-size * 0.05, half * 0.1, size * 0.05, size * 0.08);
      ctx.fillRect(0, half * 0.1, size * 0.05, size * 0.08);
      ctx.strokeRect(-size * 0.05, half * 0.1, size * 0.05, size * 0.08);
      ctx.strokeRect(0, half * 0.1, size * 0.05, size * 0.08);

      // Pointing "Umm Actually" finger (☝️) on bottom left
      ctx.save();
      ctx.translate(-half * 0.65, half * 0.35);
      ctx.fillStyle = '#fff';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(-size * 0.04, -size * 0.14, size * 0.08, size * 0.14, 6);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

    } else if (variant === 'stare') {
      // --- 1000-YARD STARE / FLAT NPC HEAD ---
      // Tiny deadpan black dot eyes
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(-half * 0.38, -half * 0.32, size * 0.045, 0, Math.PI * 2);
      ctx.arc(half * 0.38, -half * 0.32, size * 0.045, 0, Math.PI * 2);
      ctx.fill();

      // Completely flat, expressionless line mouth
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-size * 0.1, half * 0.12);
      ctx.lineTo(size * 0.1, half * 0.12);
      ctx.stroke();
    }

    ctx.restore();
  }


  // --- Helper Drawing Primitives ---

  function drawStar(ctx, cx, cy, radius, fill, stroke) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      ctx.rotate(Math.PI / 2);
      ctx.lineTo(radius, 0);
      ctx.lineTo(radius * 0.25, radius * 0.25);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function drawSpeechBubble(ctx, x, y, text, border, textCol) {
    ctx.save();
    ctx.font = '900 22px sans-serif';
    const textMetrics = ctx.measureText(text);
    const padX = 20;
    const padY = 12;
    const bw = textMetrics.width + padX * 2;
    const bh = 44;

    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = border;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(x - bw / 2, y - bh / 2, bw, bh, 14);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = textCol || border;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  function drawFloatingBanner(ctx, cx, cy, text, bgCol, textCol) {
    ctx.save();
    ctx.font = '900 24px sans-serif';
    const metrics = ctx.measureText(text);
    const bw = metrics.width + 48;
    const bh = 50;

    ctx.fillStyle = bgCol;
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.roundRect(cx - bw / 2, cy - bh / 2, bw, bh, 25);
    ctx.fill();

    ctx.fillStyle = textCol;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, cx, cy);
    ctx.restore();
  }

  function drawSweatDrop(ctx, x, y, size) {
    ctx.save();
    ctx.fillStyle = '#38bdf8';
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.bezierCurveTo(x + size * 0.8, y, x + size * 0.6, y + size, x, y + size);
    ctx.bezierCurveTo(x - size * 0.6, y + size, x - size * 0.8, y, x, y - size);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function drawHeart(ctx, x, y, size, fill) {
    ctx.save();
    ctx.fillStyle = fill;
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    // top left curve
    ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
    // bottom left curve
    ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 1.2, x, y + size);
    // bottom right curve
    ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 1.2, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
    // top right curve
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawStarburst(ctx, x, y, radius, points, fill, stroke) {
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 4;
    ctx.beginPath();
    const innerRadius = radius * 0.5;
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? radius : innerRadius;
      const angle = (i * Math.PI) / points;
      const px = x + Math.cos(angle) * r;
      const py = y + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  function drawLightning(ctx, x, y, len, seed) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    let curX = x;
    let curY = y;
    const steps = 4;
    for (let i = 0; i < steps; i++) {
      curX += (Math.sin(seed * 20 + i) * 16);
      curY += (len / steps);
      ctx.lineTo(curX, curY);
    }
    ctx.stroke();
  }

  return {
    getMemes() {
      return memes;
    },
    getMeme(id) {
      return memes[id] || null;
    }
  };
})();
