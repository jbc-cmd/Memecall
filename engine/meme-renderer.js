/**
 * MemeCall Compositing & Animation Renderer
 * Handles canvas video blending, spring physics, sticker scaling, and sound sync.
 */
window.MemeRenderer = (function () {
  let activeMeme = null;
  let memeStartTime = 0;
  let memeDuration = 2800; // ms
  let customStickers = {}; // Map of poseId -> base64/Image
  let showDebugOverlay = false;

  return {
    setCustomStickers(stickers) {
      customStickers = stickers || {};
    },
    getCustomStickers() {
      return customStickers;
    },
    setDebugOverlay(show) {
      showDebugOverlay = show;
    },
    triggerMeme(poseId, playSfx = true) {
      if (!poseId) return;
      
      const memeDef = window.MemeAssets ? window.MemeAssets.getMeme(poseId) : null;
      if (!memeDef && !customStickers[poseId]) return;

      activeMeme = poseId;
      memeStartTime = performance.now();

      if (playSfx && window.MemeAudioEngine && memeDef && memeDef.sfx) {
        window.MemeAudioEngine.play(memeDef.sfx);
      }

      // Dispatch event for HUD and popup synchronization
      window.dispatchEvent(new CustomEvent('memecall:pose_triggered', {
        detail: { poseId, memeDef }
      }));
    },

    getActiveMeme() {
      if (!activeMeme) return null;
      const now = performance.now();
      if (now - memeStartTime > memeDuration) {
        activeMeme = null;
        return null;
      }
      return activeMeme;
    },

    /**
     * Render a frame to canvas
     */
    renderFrame(ctx, video, width, height, detectionResult) {
      // 1. Draw camera base feed
      ctx.save();
      // Mirror feed horizontally for natural webcam feel
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, width, height);
      ctx.restore();

      const now = performance.now();
      const timeSec = now / 1000;

      // 2. Check if a new pose was detected
      if (detectionResult && detectionResult.pose) {
        // If no meme is currently active or different meme detected with high confidence
        if (!activeMeme || (now - memeStartTime > 1200 && activeMeme !== detectionResult.pose)) {
          this.triggerMeme(detectionResult.pose, true);
        }
      }

      // 3. Render Active Meme Sticker & Overlays
      if (activeMeme) {
        const elapsed = now - memeStartTime;
        if (elapsed > memeDuration) {
          activeMeme = null;
        } else {
          const progress = elapsed / memeDuration;
          const memeDef = window.MemeAssets ? window.MemeAssets.getMeme(activeMeme) : null;
          const customImg = customStickers[activeMeme];

          // Compute spring scale effect on appearance
          let scale = 1.0;
          if (progress < 0.15) {
            // Pop in
            scale = 0.4 + (progress / 0.15) * 0.75;
          } else if (progress < 0.25) {
            // Elastic bounce
            scale = 1.15 - ((progress - 0.15) / 0.1) * 0.15;
          }

          // Fade out at end
          let alpha = 1.0;
          if (progress > 0.85) {
            alpha = (1.0 - progress) / 0.15;
          }

          ctx.save();
          ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

          // Draw custom image if uploaded, or default vector meme
          if (customImg && customImg.complete && customImg.naturalWidth > 0) {
            const face = (detectionResult && detectionResult.face) || { x: width * 0.5, y: height * 0.4, w: width * 0.35, h: height * 0.4 };
            const imgW = Math.min(width * 0.45, customImg.naturalWidth);
            const imgH = imgW * (customImg.naturalHeight / customImg.naturalWidth);
            const imgX = face.x - imgW * 0.5;
            const imgY = Math.max(20, face.y - face.h * 0.6 - imgH * 0.5);

            ctx.save();
            ctx.translate(face.x, face.y);
            ctx.scale(scale, scale);
            ctx.translate(-face.x, -face.y);
            ctx.drawImage(customImg, imgX, imgY, imgW, imgH);
            ctx.restore();
          } else if (memeDef && typeof memeDef.draw === 'function') {
            const renderData = {
              time: timeSec,
              elapsed: elapsed / 1000,
              progress: progress,
              scale: scale,
              face: detectionResult ? detectionResult.face : { x: width * 0.5, y: height * 0.45, w: width * 0.35, h: height * 0.45 },
              hand: detectionResult ? detectionResult.hand : { x: width * 0.7, y: height * 0.5 }
            };
            memeDef.draw(ctx, width, height, renderData);
          }

          ctx.restore();
        }
      }

      // 4. Debug Landmarks Visualizer (if enabled)
      if (showDebugOverlay && detectionResult) {
        ctx.save();
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2;
        ctx.strokeRect(detectionResult.face.x - detectionResult.face.w * 0.5, detectionResult.face.y - detectionResult.face.h * 0.5, detectionResult.face.w, detectionResult.face.h);
        
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(detectionResult.hand.x, detectionResult.hand.y, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '600 14px monospace';
        ctx.fillStyle = '#22c55e';
        ctx.fillText(`Pose: ${detectionResult.pose || 'None'} (${(detectionResult.score * 100).toFixed(0)}%)`, 20, 30);
        ctx.restore();
      }
    }
  };
})();
