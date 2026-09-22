/**
 * MemeCall WebRTC Camera Interceptor (MAIN World)
 * Hooks into navigator.mediaDevices.getUserMedia to dynamically filter camera feeds.
 */
(function () {
  if (window.__MEMECALL_INITIALIZED__) return;
  window.__MEMECALL_INITIALIZED__ = true;

  console.log('🚀 [MemeCall] AI Meme Camera Filter initialized in Main World.');

  // Global state
  const state = {
    enabled: true,
    sfxEnabled: true,
    sensitivity: 0.65,
    activeStream: null,
    activeCanvas: null,
    activeVideo: null,
    animFrameId: null,
    listeners: new Set()
  };

  window.__MEMECALL__ = {
    state,
    toggle(val) {
      state.enabled = (typeof val === 'boolean') ? val : !state.enabled;
      window.dispatchEvent(new CustomEvent('memecall:state_changed', { detail: { enabled: state.enabled } }));
      return state.enabled;
    },
    setSensitivity(val) {
      state.sensitivity = val;
      if (window.MemePoseDetector) window.MemePoseDetector.setSensitivity(val);
    },
    setSfxEnabled(val) {
      state.sfxEnabled = val;
      if (window.MemeAudioEngine) window.MemeAudioEngine.setEnabled(val);
    },
    trigger(poseId) {
      if (window.MemeRenderer) {
        window.MemeRenderer.triggerMeme(poseId, true);
      }
    }
  };

  // Store original getUserMedia
  const originalGetUserMedia = navigator.mediaDevices ? navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices) : null;

  if (navigator.mediaDevices && originalGetUserMedia) {
    navigator.mediaDevices.getUserMedia = async function (constraints) {
      // If user media does not request video or MemeCall is disabled, return normal stream
      if (!constraints || !constraints.video || !state.enabled) {
        return originalGetUserMedia(constraints);
      }

      console.log('📹 [MemeCall] Intercepting video call getUserMedia stream with constraints:', constraints);

      try {
        // 1. Get raw webcam stream from user
        const realStream = await originalGetUserMedia(constraints);
        const realVideoTrack = realStream.getVideoTracks()[0];
        const audioTracks = realStream.getAudioTracks();

        if (!realVideoTrack) {
          return realStream;
        }

        // 2. Setup internal offscreen video playback
        const hiddenVideo = document.createElement('video');
        hiddenVideo.autoplay = true;
        hiddenVideo.muted = true;
        hiddenVideo.playsInline = true;
        hiddenVideo.style.display = 'none';
        hiddenVideo.srcObject = new MediaStream([realVideoTrack]);
        await hiddenVideo.play().catch(e => console.warn('[MemeCall] Auto-play warning:', e));

        // 3. Setup canvas matching video stream dimensions
        const settings = realVideoTrack.getSettings ? realVideoTrack.getSettings() : {};
        const width = settings.width || 1280;
        const height = settings.height || 720;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d', { alpha: false });

        state.activeCanvas = canvas;
        state.activeVideo = hiddenVideo;

        // 4. Start render and AI detection loop
        let isRunning = true;

        function processLoop() {
          if (!isRunning) return;

          try {
            if (hiddenVideo.readyState >= 2) {
              // Run AI pose detection
              const detection = window.MemePoseDetector ? window.MemePoseDetector.detect(hiddenVideo, width, height) : null;

              // Render composited frame with meme animations
              if (window.MemeRenderer) {
                window.MemeRenderer.renderFrame(ctx, hiddenVideo, width, height, detection);
              } else {
                ctx.drawImage(hiddenVideo, 0, 0, width, height);
              }

              // Notify HUD of live pose state
              if (detection && detection.pose) {
                window.dispatchEvent(new CustomEvent('memecall:pose_detected', { detail: detection }));
              }
            }
          } catch (err) {
            console.error('[MemeCall] Frame processing error:', err);
          }

          state.animFrameId = requestAnimationFrame(processLoop);
        }

        processLoop();

        // 5. Capture processed canvas stream at 30 FPS
        const processedStream = canvas.captureStream(30);
        const processedVideoTrack = processedStream.getVideoTracks()[0];

        // 6. Forward track stop / cleanup handling
        const originalTrackStop = processedVideoTrack.stop.bind(processedVideoTrack);
        processedVideoTrack.stop = function () {
          isRunning = false;
          if (state.animFrameId) cancelAnimationFrame(state.animFrameId);
          realVideoTrack.stop();
          hiddenVideo.srcObject = null;
          originalTrackStop();
        };

        // Combine augmented video track + real audio tracks
        const finalTracks = [processedVideoTrack, ...audioTracks];
        const compositeStream = new MediaStream(finalTracks);

        state.activeStream = compositeStream;
        return compositeStream;
      } catch (err) {
        console.error('[MemeCall] Failed to intercept camera stream:', err);
        // Fallback to real stream in case of any failure
        return originalGetUserMedia(constraints);
      }
    };
  }
})();
