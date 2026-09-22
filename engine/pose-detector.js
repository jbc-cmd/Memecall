/**
 * MemeCall Real-Time AI Pose & Gesture Classifier
 * Low-latency, high-performance visual pose and hand gesture tracker.
 */
window.MemePoseDetector = (function () {
  let sensitivity = 0.65; // 0.1 (strict) to 1.0 (very sensitive)
  let enabledMemes = {
    GRONK_BEAUTY: true,
    GRONK_NERD: true,
    GRONK_STARE: true,
    GRONK_SMUG: true,
    GRONK_SCREAM: true,
    GRONK_LOLLIPOP: true,
    GRONK_LAUGH: true,
    GRONK_BLEP: true,
    PEACE_SIGN: true,
    THUMBS_UP: true,
    THUMBS_DOWN: true,
    MEWING: true,
    SCREAM: true,
    FACEPALM: true,
    FLEX: true,
    HEART: true,
    FINGER_GUN: true,
    GALAXY_BRAIN: true,
    SALUTE: true
  };

  // Downscaled processing canvas for 60fps performance
  let procCanvas = null;
  let procCtx = null;
  const PROC_W = 160;
  const PROC_H = 120;

  // Temporal smoothing history
  let poseConfidenceHistory = {};
  const SMOOTH_FRAMES = 4;

  function initProcCanvas() {
    if (!procCanvas) {
      procCanvas = document.createElement('canvas');
      procCanvas.width = PROC_W;
      procCanvas.height = PROC_H;
      procCtx = procCanvas.getContext('2d', { willReadFrequently: true });
    }
  }

  // Fast Skin & Motion Pixel Filter in HSV/YCbCr color space
  function isSkinPixel(r, g, b) {
    // Standard robust skin color segmentation
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    return (
      r > 70 &&
      g > 35 &&
      b > 20 &&
      r > g &&
      r > b &&
      max - min > 15 &&
      Math.abs(r - g) > 12 &&
      r - b > 15
    );
  }

  return {
    setSensitivity(val) {
      sensitivity = Math.max(0.1, Math.min(1.0, val));
    },
    getSensitivity() {
      return sensitivity;
    },
    setEnabledMemes(map) {
      enabledMemes = { ...enabledMemes, ...map };
    },
    getEnabledMemes() {
      return { ...enabledMemes };
    },

    /**
     * Process a video frame and return detected pose + landmarks
     */
    detect(videoElement, renderWidth, renderHeight) {
      if (!videoElement || videoElement.readyState < 2) {
        return null;
      }

      initProcCanvas();
      procCtx.drawImage(videoElement, 0, 0, PROC_W, PROC_H);

      const frameData = procCtx.getImageData(0, 0, PROC_W, PROC_H);
      const pixels = frameData.data;

      // 1. Segment Skin Pixels & Compute Bounding Clusters
      let totalSkin = 0;
      let sumX = 0;
      let sumY = 0;

      // Grid clusters
      const gridCols = 8;
      const gridRows = 6;
      const cellW = PROC_W / gridCols;
      const cellH = PROC_H / gridRows;
      const grid = Array(gridRows).fill(0).map(() => Array(gridCols).fill(0));

      const skinMask = new Uint8Array(PROC_W * PROC_H);

      for (let y = 0; y < PROC_H; y++) {
        for (let x = 0; x < PROC_W; x++) {
          const idx = (y * PROC_W + x) * 4;
          const r = pixels[idx];
          const g = pixels[idx + 1];
          const b = pixels[idx + 2];

          if (isSkinPixel(r, g, b)) {
            skinMask[y * PROC_W + x] = 1;
            totalSkin++;
            sumX += x;
            sumY += y;

            const c = Math.min(gridCols - 1, Math.floor(x / cellW));
            const rIdx = Math.min(gridRows - 1, Math.floor(y / cellH));
            grid[rIdx][c]++;
          }
        }
      }

      if (totalSkin < 80) {
        // No prominent subject in camera
        return null;
      }

      // 2. Locate Primary Face Region
      const meanX = (sumX / totalSkin) / PROC_W * renderWidth;
      const meanY = (sumY / totalSkin) / PROC_H * renderHeight;

      // Approximate face box based on upper-central skin mass
      let faceSkinCount = 0;
      let faceSumX = 0;
      let faceSumY = 0;
      let minFaceX = PROC_W, maxFaceX = 0, minFaceY = PROC_H, maxFaceY = 0;

      for (let y = Math.floor(PROC_H * 0.1); y < Math.floor(PROC_H * 0.75); y++) {
        for (let x = Math.floor(PROC_W * 0.2); x < Math.floor(PROC_W * 0.8); x++) {
          if (skinMask[y * PROC_W + x]) {
            faceSkinCount++;
            faceSumX += x;
            faceSumY += y;
            if (x < minFaceX) minFaceX = x;
            if (x > maxFaceX) maxFaceX = x;
            if (y < minFaceY) minFaceY = y;
            if (y > maxFaceY) maxFaceY = y;
          }
        }
      }

      const face = {
        x: faceSkinCount > 30 ? (faceSumX / faceSkinCount) / PROC_W * renderWidth : renderWidth * 0.5,
        y: faceSkinCount > 30 ? (faceSumY / faceSkinCount) / PROC_H * renderHeight : renderHeight * 0.45,
        w: faceSkinCount > 30 ? Math.max(120, ((maxFaceX - minFaceX) / PROC_W) * renderWidth * 1.2) : renderWidth * 0.35,
        h: faceSkinCount > 30 ? Math.max(140, ((maxFaceY - minFaceY) / PROC_H) * renderHeight * 1.3) : renderHeight * 0.45
      };

      // 3. Find Peripheral Hand Blobs (Left Hand, Right Hand, Center-High Blobs)
      let leftHandCount = 0, leftHandX = 0, leftHandY = 0;
      let rightHandCount = 0, rightHandX = 0, rightHandY = 0;
      let topCenterCount = 0, topCenterX = 0, topCenterY = 0;
      let mouthAreaCount = 0;
      let cheekLeftCount = 0;
      let cheekRightCount = 0;
      let foreheadCount = 0;

      const normFaceX = (face.x / renderWidth) * PROC_W;
      const normFaceY = (face.y / renderHeight) * PROC_H;
      const normFaceW = (face.w / renderWidth) * PROC_W;
      const normFaceH = (face.h / renderHeight) * PROC_H;

      for (let y = 0; y < PROC_H; y++) {
        for (let x = 0; x < PROC_W; x++) {
          if (!skinMask[y * PROC_W + x]) continue;

          // Left Hand region (Screen Left)
          if (x < normFaceX - normFaceW * 0.35 && y < PROC_H * 0.85) {
            leftHandCount++;
            leftHandX += x;
            leftHandY += y;
          }
          // Right Hand region (Screen Right)
          else if (x > normFaceX + normFaceW * 0.35 && y < PROC_H * 0.85) {
            rightHandCount++;
            rightHandX += x;
            rightHandY += y;
          }

          // Hand near mouth / chin (Mewing / Thinking)
          if (
            Math.abs(x - normFaceX) < normFaceW * 0.25 &&
            y > normFaceY + normFaceH * 0.15 &&
            y < normFaceY + normFaceH * 0.55
          ) {
            mouthAreaCount++;
          }

          // Hands near cheeks (The Scream)
          if (Math.abs(y - normFaceY) < normFaceH * 0.3) {
            if (x >= normFaceX - normFaceW * 0.6 && x <= normFaceX - normFaceW * 0.25) {
              cheekLeftCount++;
            }
            if (x <= normFaceX + normFaceW * 0.6 && x >= normFaceX + normFaceW * 0.25) {
              cheekRightCount++;
            }
          }

          // Hand on forehead (Facepalm)
          if (
            Math.abs(x - normFaceX) < normFaceW * 0.3 &&
            y >= normFaceY - normFaceH * 0.5 &&
            y <= normFaceY - normFaceH * 0.05
          ) {
            foreheadCount++;
          }

          // Top center above head (Salute or Galaxy Brain)
          if (
            Math.abs(x - normFaceX) < normFaceW * 0.45 &&
            y < normFaceY - normFaceH * 0.35
          ) {
            topCenterCount++;
            topCenterX += x;
            topCenterY += y;
          }
        }
      }

      // Convert hand coordinates to render space
      const hand = {
        x: rightHandCount > 30 ? (rightHandX / rightHandCount) / PROC_W * renderWidth :
           leftHandCount > 30 ? (leftHandX / leftHandCount) / PROC_W * renderWidth :
           renderWidth * 0.75,
        y: rightHandCount > 30 ? (rightHandY / rightHandCount) / PROC_H * renderHeight :
           leftHandCount > 30 ? (leftHandY / leftHandCount) / PROC_H * renderHeight :
           renderHeight * 0.5
      };

      // 4. Feature Extraction & Contour Tips Analysis (Finger count & angles)
      let fingerTips = [];
      let isVerticalHand = false;
      let isHorizontalHand = false;
      let fingerSpan = 0;

      // Analyze right or left hand contour if raised
      const activeHandX = rightHandCount > leftHandCount ? rightHandX / Math.max(1, rightHandCount) : leftHandX / Math.max(1, leftHandCount);
      const activeHandY = rightHandCount > leftHandCount ? rightHandY / Math.max(1, rightHandCount) : leftHandY / Math.max(1, leftHandCount);
      const hasRaisedHand = (rightHandCount > 40 || leftHandCount > 40);

      if (hasRaisedHand) {
        // Sample vertical column density to detect fingers
        let tipPeaks = 0;
        const handBoxMinX = Math.max(0, Math.floor(activeHandX - 18));
        const handBoxMaxX = Math.min(PROC_W - 1, Math.floor(activeHandX + 18));
        const handBoxMinY = Math.max(0, Math.floor(activeHandY - 20));
        const handBoxMaxY = Math.min(PROC_H - 1, Math.floor(activeHandY + 20));

        let colExtremes = [];
        for (let col = handBoxMinX; col <= handBoxMaxX; col += 2) {
          let topSkinY = -1;
          for (let row = handBoxMinY; row <= handBoxMaxY; row++) {
            if (skinMask[row * PROC_W + col]) {
              topSkinY = row;
              break;
            }
          }
          if (topSkinY !== -1) {
            colExtremes.push({ x: col, y: topSkinY });
          }
        }

        // Count local minima in topSkinY (fingertips)
        for (let i = 1; i < colExtremes.length - 1; i++) {
          if (colExtremes[i].y < colExtremes[i - 1].y && colExtremes[i].y < colExtremes[i + 1].y) {
            tipPeaks++;
            fingerTips.push(colExtremes[i]);
          }
        }
        fingerSpan = colExtremes.length;
      }

      // 5. Pose Heuristics Scoring Engine
      let scores = {
        GRONK_BEAUTY: 0,
        GRONK_NERD: 0,
        GRONK_STARE: 0,
        GRONK_SMUG: 0,
        GRONK_SCREAM: 0,
        GRONK_LOLLIPOP: 0,
        GRONK_LAUGH: 0,
        GRONK_BLEP: 0,
        PEACE_SIGN: 0,
        THUMBS_UP: 0,
        THUMBS_DOWN: 0,
        MEWING: 0,
        SCREAM: 0,
        FACEPALM: 0,
        FLEX: 0,
        HEART: 0,
        FINGER_GUN: 0,
        GALAXY_BRAIN: 0,
        SALUTE: 0
      };

      // Heuristic 1: SCREAM (Hands on cheeks)
      if (cheekLeftCount > 25 && cheekRightCount > 25) {
        scores.SCREAM = 0.85 + (cheekLeftCount + cheekRightCount) / 150;
      }

      // Heuristic 2: FACEPALM (Hand covering forehead)
      if (foreheadCount > 40) {
        scores.FACEPALM = 0.8 + foreheadCount / 120;
      }

      // Heuristic 3: MEWING / SHHH (Hand or finger right over mouth/lips)
      if (mouthAreaCount > 35 && foreheadCount < 20 && cheekLeftCount < 20) {
        scores.MEWING = 0.82 + mouthAreaCount / 100;
      }

      // Heuristic 4: FLEX (Both arms raised high at shoulder sides)
      if (leftHandCount > 45 && rightHandCount > 45 && activeHandY < normFaceY + normFaceH * 0.4) {
        scores.FLEX = 0.88 + (leftHandCount + rightHandCount) / 200;
      }

      // Heuristic 5: HEART (Hands touching in front of chest/chin center)
      if (
        mouthAreaCount > 25 &&
        (leftHandCount > 25 || rightHandCount > 25) &&
        Math.abs((leftHandX / Math.max(1, leftHandCount)) - (rightHandX / Math.max(1, rightHandCount))) < normFaceW * 0.6
      ) {
        scores.HEART = 0.78;
      }

      // Heuristic 6: SALUTE (Hand raised flat near eyebrow/temple)
      if (topCenterCount > 30 || (activeHandY < normFaceY && Math.abs(activeHandX - normFaceX) < normFaceW * 0.6)) {
        scores.SALUTE = 0.8 + topCenterCount / 80;
      }

      // Heuristic 7: GALAXY BRAIN (Hand on temple / chin in deep thought)
      if (
        (mouthAreaCount > 20 && (leftHandCount > 20 || rightHandCount > 20)) ||
        (foreheadCount > 20 && foreheadCount < 40)
      ) {
        scores.GALAXY_BRAIN = 0.72;
      }

      // Heuristic 8: PEACE SIGN (2 distinct finger tips raised)
      if (hasRaisedHand && (fingerTips.length === 2 || (fingerSpan > 8 && fingerSpan < 22))) {
        scores.PEACE_SIGN = 0.85;
      }

      // Heuristic 9: THUMBS UP / DOWN
      if (hasRaisedHand && fingerTips.length <= 1) {
        if (activeHandY < normFaceY) {
          scores.THUMBS_UP = 0.84;
        } else if (activeHandY > normFaceY + normFaceH * 0.3) {
          scores.THUMBS_DOWN = 0.82;
        }
      }

      // Heuristic 10: FINGER GUN (Horizontal extended hand + pointing)
      if (hasRaisedHand && Math.abs(activeHandX - normFaceX) > normFaceW * 0.7 && activeHandY > normFaceY * 0.6) {
        scores.FINGER_GUN = 0.76;
      }

      // 6. Find Winning Candidate & Apply Confidence Threshold
      let bestPose = null;
      let highestScore = 0;
      const threshold = 1.0 - (sensitivity * 0.45); // e.g. 0.65 -> ~0.71 threshold

      for (const [poseId, score] of Object.entries(scores)) {
        if (!enabledMemes[poseId]) continue;
        if (score > highestScore && score >= threshold) {
          highestScore = score;
          bestPose = poseId;
        }
      }

      return {
        pose: bestPose,
        score: highestScore,
        face: face,
        hand: hand,
        rawScores: scores
      };
    }
  };
})();
