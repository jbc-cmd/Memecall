/**
 * MemeCall Popup Controller & Live Camera Test Lab
 */
document.addEventListener('DOMContentLoaded', async () => {
  // Elements
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  const masterToggle = document.getElementById('master-toggle');
  const sfxToggle = document.getElementById('sfx-toggle');
  const sensitivitySlider = document.getElementById('sensitivity-slider');
  const sensitivityVal = document.getElementById('sensitivity-val');
  const labVideo = document.getElementById('lab-video');
  const labCanvas = document.getElementById('lab-canvas');
  const labCtx = labCanvas.getContext('2d');
  const labBadgeText = document.getElementById('lab-badge-text');
  const btnStartCamera = document.getElementById('btn-start-camera');
  const btnToggleDebug = document.getElementById('btn-toggle-debug');
  const quickTestGrid = document.getElementById('quick-test-grid');
  const poseList = document.getElementById('pose-list');

  let cameraStream = null;
  let isCameraActive = false;
  let isDebugActive = false;
  let animId = null;

  const memes = window.MemeAssets ? window.MemeAssets.getMemes() : {};

  // Tab switching
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const targetId = `tab-${btn.getAttribute('data-tab')}`;
      const target = document.getElementById(targetId);
      if (target) target.classList.add('active');
    });
  });

  // Load Saved Settings from chrome.storage
  let settings = {
    enabled: true,
    sfx: true,
    sensitivity: 65,
    poses: {}
  };

  Object.keys(memes).forEach(k => {
    settings.poses[k] = true;
  });

  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    try {
      const stored = await chrome.storage.local.get(['memecall_settings']);
      if (stored.memecall_settings) {
        settings = { ...settings, ...stored.memecall_settings };
      }
    } catch (e) {
      console.warn('Could not read chrome.storage:', e);
    }
  }

  // Sync UI to Settings
  masterToggle.checked = settings.enabled;
  sfxToggle.checked = settings.sfx;
  sensitivitySlider.value = settings.sensitivity;
  sensitivityVal.textContent = `${settings.sensitivity}%`;

  if (window.MemePoseDetector) {
    window.MemePoseDetector.setSensitivity(settings.sensitivity / 100);
    window.MemePoseDetector.setEnabledMemes(settings.poses);
  }
  if (window.MemeAudioEngine) {
    window.MemeAudioEngine.setEnabled(settings.sfx);
  }

  function saveSettings() {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ memecall_settings: settings });
    }
  }

  // Master Toggle Event
  masterToggle.addEventListener('change', () => {
    settings.enabled = masterToggle.checked;
    saveSettings();
  });

  // SFX Toggle Event
  sfxToggle.addEventListener('change', () => {
    settings.sfx = sfxToggle.checked;
    if (window.MemeAudioEngine) {
      window.MemeAudioEngine.setEnabled(settings.sfx);
    }
    saveSettings();
  });

  // Sensitivity Slider Event
  sensitivitySlider.addEventListener('input', () => {
    settings.sensitivity = parseInt(sensitivitySlider.value, 10);
    sensitivityVal.textContent = `${settings.sensitivity}%`;
    if (window.MemePoseDetector) {
      window.MemePoseDetector.setSensitivity(settings.sensitivity / 100);
    }
    saveSettings();
  });

  // Populate Quick Test Grid & Poses Tab
  Object.values(memes).forEach(m => {
    // Quick test icon in Lab tab
    const qBtn = document.createElement('button');
    qBtn.className = 'quick-icon-btn';
    qBtn.textContent = m.icon;
    qBtn.title = `Trigger ${m.name}`;
    qBtn.addEventListener('click', () => {
      if (window.MemeRenderer) {
        window.MemeRenderer.triggerMeme(m.id, settings.sfx);
      }
    });
    quickTestGrid.appendChild(qBtn);

    // Row in Poses tab
    const item = document.createElement('div');
    item.className = 'meme-item';
    item.innerHTML = `
      <div class="meme-item-left">
        <div class="meme-item-icon">${m.icon}</div>
        <div class="meme-item-info">
          <div class="meme-item-title">${m.name}</div>
          <div class="meme-item-desc">${m.description}</div>
        </div>
      </div>
      <div class="meme-item-right">
        <label class="switch">
          <input type="checkbox" data-pose-id="${m.id}" ${settings.poses[m.id] !== false ? 'checked' : ''}>
          <span class="slider"></span>
        </label>
      </div>
    `;

    const poseCheck = item.querySelector('input[type="checkbox"]');
    poseCheck.addEventListener('change', () => {
      settings.poses[m.id] = poseCheck.checked;
      if (window.MemePoseDetector) {
        window.MemePoseDetector.setEnabledMemes(settings.poses);
      }
      saveSettings();
    });

    poseList.appendChild(item);
  });

  // Live Camera Sandbox
  async function startCamera() {
    try {
      labBadgeText.textContent = 'Starting camera...';
      cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 360, frameRate: 30 }
      });
      labVideo.srcObject = cameraStream;
      await labVideo.play();
      isCameraActive = true;
      btnStartCamera.textContent = '⏹️ Stop Camera';
      labBadgeText.textContent = 'Live AI Sandbox';

      runLabLoop();
    } catch (err) {
      console.error('Camera access error:', err);
      labBadgeText.textContent = 'Camera permission needed';
      alert('Please allow camera access to test gestures in the lab!');
    }
  }

  function stopCamera() {
    if (cameraStream) {
      cameraStream.getTracks().forEach(t => t.stop());
      cameraStream = null;
    }
    if (animId) cancelAnimationFrame(animId);
    isCameraActive = false;
    btnStartCamera.textContent = '▶️ Start Camera Test';
    labBadgeText.textContent = 'Camera Offline';

    // Clear canvas
    labCtx.fillStyle = '#020617';
    labCtx.fillRect(0, 0, labCanvas.width, labCanvas.height);
  }

  btnStartCamera.addEventListener('click', () => {
    if (isCameraActive) {
      stopCamera();
    } else {
      startCamera();
    }
  });

  btnToggleDebug.addEventListener('click', () => {
    isDebugActive = !isDebugActive;
    if (window.MemeRenderer) {
      window.MemeRenderer.setDebugOverlay(isDebugActive);
    }
    btnToggleDebug.style.borderColor = isDebugActive ? 'var(--accent)' : 'var(--border)';
  });

  function runLabLoop() {
    if (!isCameraActive) return;

    if (labVideo.readyState >= 2) {
      const detection = window.MemePoseDetector ? window.MemePoseDetector.detect(labVideo, labCanvas.width, labCanvas.height) : null;
      if (window.MemeRenderer) {
        window.MemeRenderer.renderFrame(labCtx, labVideo, labCanvas.width, labCanvas.height, detection);
      } else {
        labCtx.drawImage(labVideo, 0, 0, labCanvas.width, labCanvas.height);
      }

      if (detection && detection.pose) {
        const found = memes[detection.pose];
        if (found) {
          labBadgeText.textContent = `Detected: ${found.icon} ${found.name}`;
        }
      }
    }

    animId = requestAnimationFrame(runLabLoop);
  }

  // Handle triggered events
  window.addEventListener('memecall:pose_triggered', (e) => {
    const poseId = e.detail.poseId;
    const found = memes[poseId];
    if (found) {
      labBadgeText.textContent = `Active: ${found.icon} ${found.name}`;
    }
  });

  // Initial canvas state
  labCtx.fillStyle = '#020617';
  labCtx.fillRect(0, 0, labCanvas.width, labCanvas.height);
  labCtx.font = '600 14px sans-serif';
  labCtx.fillStyle = '#64748b';
  labCtx.textAlign = 'center';
  labCtx.fillText('Click "Start Camera Test" to preview', labCanvas.width / 2, labCanvas.height / 2);
});
