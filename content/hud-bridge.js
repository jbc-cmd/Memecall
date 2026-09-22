/**
 * MemeCall In-Call Floating Control Pill HUD
 * Injected into Google Meet, Zoom, Teams, and video calling tabs.
 */
(function () {
  if (document.getElementById('memecall-hud-root')) return;

  const memeList = [
    { id: 'GRONK_BEAUTY', icon: '💅', name: 'Baddie' },
    { id: 'GRONK_NERD', icon: '🤓', name: 'Nerd' },
    { id: 'GRONK_STARE', icon: '😐', name: 'NPC Stare' },
    { id: 'GRONK_SMUG', icon: '🤨', name: 'Smug Gronk' },
    { id: 'GRONK_SCREAM', icon: '😫', name: 'Scream Gronk' },
    { id: 'GRONK_LOLLIPOP', icon: '🍭', name: 'Beanie Gronk' },
    { id: 'GRONK_LAUGH', icon: '😄', name: 'Laugh Gronk' },
    { id: 'GRONK_BLEP', icon: '😛', name: 'Blep Gronk' },
    { id: 'PEACE_SIGN', icon: '✌️', name: 'Kawaii' },
    { id: 'THUMBS_UP', icon: '👍', name: 'Chad' },
    { id: 'THUMBS_DOWN', icon: '👎', name: 'Skill Issue' },
    { id: 'MEWING', icon: '🤫', name: 'Mewing' },
    { id: 'SCREAM', icon: '😱', name: 'Scream' },
    { id: 'FACEPALM', icon: '🤦', name: 'Bruh' },
    { id: 'FLEX', icon: '💪', name: 'Saiyan' },
    { id: 'HEART', icon: '🫶', name: 'Heart' },
    { id: 'FINGER_GUN', icon: '👉', name: 'POW!' },
    { id: 'GALAXY_BRAIN', icon: '🧠', name: '500 IQ' },
    { id: 'SALUTE', icon: '🫡', name: 'Salute' }
  ];

  function createHUD() {
    const root = document.createElement('div');
    root.id = 'memecall-hud-root';

    root.innerHTML = `
      <div class="memecall-hud-pill" id="memecall-pill">
        <div class="memecall-hud-brand">
          <div class="memecall-hud-logo">🎭</div>
          <span>MemeCall</span>
        </div>
        <div class="memecall-hud-status" id="memecall-status-badge">
          <div class="memecall-hud-dot" id="memecall-dot"></div>
          <span id="memecall-status-text">AI Ready</span>
        </div>
        <div class="memecall-hud-actions">
          <button class="memecall-hud-btn" id="memecall-toggle-panel" title="Meme Quick Triggers">⚡</button>
          <button class="memecall-hud-btn" id="memecall-toggle-sfx" title="Toggle Sound FX">🔊</button>
          <button class="memecall-hud-btn" id="memecall-toggle-power" title="Enable/Disable Meme Filter">🟢</button>
        </div>
      </div>
      <div class="memecall-hud-panel hidden" id="memecall-panel">
        <div class="memecall-panel-title">Strike a pose or click:</div>
        <div class="memecall-grid-memes" id="memecall-grid">
          ${memeList.map(m => `
            <div class="memecall-meme-chip" data-pose="${m.id}">
              <span>${m.icon}</span>
              <span class="memecall-meme-chip-name">${m.name}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    document.body.appendChild(root);

    // Draggable Logic (Supports both Mouse and Touch for Mobile)
    const pill = root.querySelector('#memecall-pill');
    let isDragging = false;
    let startX, startY, initLeft, initTop;

    function onDragStart(clientX, clientY) {
      isDragging = true;
      startX = clientX;
      startY = clientY;
      const rect = root.getBoundingClientRect();
      initLeft = rect.left;
      initTop = rect.top;
      root.style.right = 'auto';
      root.style.left = `${initLeft}px`;
      root.style.top = `${initTop}px`;
    }

    function onDragMove(clientX, clientY) {
      if (!isDragging) return;
      const dx = clientX - startX;
      const dy = clientY - startY;
      const maxW = window.innerWidth - (window.innerWidth < 480 ? 120 : 200);
      const maxH = window.innerHeight - 70;
      root.style.left = `${Math.max(8, Math.min(maxW, initLeft + dx))}px`;
      root.style.top = `${Math.max(8, Math.min(maxH, initTop + dy))}px`;
    }

    function onDragEnd() {
      isDragging = false;
    }

    // Mouse events
    pill.addEventListener('mousedown', (e) => {
      if (e.target.closest('.memecall-hud-btn')) return;
      onDragStart(e.clientX, e.clientY);
    });

    window.addEventListener('mousemove', (e) => {
      onDragMove(e.clientX, e.clientY);
    });

    window.addEventListener('mouseup', onDragEnd);

    // Touch events for Mobile (Android & iOS)
    pill.addEventListener('touchstart', (e) => {
      if (e.target.closest('.memecall-hud-btn')) return;
      const touch = e.touches[0];
      if (touch) {
        onDragStart(touch.clientX, touch.clientY);
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      if (touch) {
        onDragMove(touch.clientX, touch.clientY);
      }
    }, { passive: true });

    window.addEventListener('touchend', onDragEnd);
    window.addEventListener('touchcancel', onDragEnd);

    // Panel Toggle
    const togglePanelBtn = root.querySelector('#memecall-toggle-panel');
    const panel = root.querySelector('#memecall-panel');
    togglePanelBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      panel.classList.toggle('hidden');
    });

    // Meme Trigger Chips
    root.querySelectorAll('.memecall-meme-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const poseId = chip.getAttribute('data-pose');
        if (window.__MEMECALL__) {
          window.__MEMECALL__.trigger(poseId);
        }
      });
    });

    // SFX Toggle
    let sfxOn = true;
    const sfxBtn = root.querySelector('#memecall-toggle-sfx');
    sfxBtn.addEventListener('click', () => {
      sfxOn = !sfxOn;
      sfxBtn.textContent = sfxOn ? '🔊' : '🔇';
      if (window.__MEMECALL__) {
        window.__MEMECALL__.setSfxEnabled(sfxOn);
      }
    });

    // Power Toggle
    let isEnabled = true;
    const powerBtn = root.querySelector('#memecall-toggle-power');
    const statusDot = root.querySelector('#memecall-dot');
    const statusText = root.querySelector('#memecall-status-text');

    powerBtn.addEventListener('click', () => {
      if (window.__MEMECALL__) {
        isEnabled = window.__MEMECALL__.toggle();
        powerBtn.textContent = isEnabled ? '🟢' : '⚪';
        statusDot.className = `memecall-hud-dot ${isEnabled ? '' : 'inactive'}`;
        statusText.textContent = isEnabled ? 'AI Ready' : 'Disabled';
      }
    });

    // Real-time Event Listener for detected poses
    window.addEventListener('memecall:pose_detected', (e) => {
      if (!isEnabled) return;
      const detail = e.detail;
      if (detail && detail.pose) {
        const found = memeList.find(m => m.id === detail.pose);
        if (found) {
          statusText.textContent = `${found.icon} ${found.name}`;
          setTimeout(() => {
            if (isEnabled) statusText.textContent = 'AI Ready';
          }, 1800);
        }
      }
    });

    window.addEventListener('memecall:pose_triggered', (e) => {
      const poseId = e.detail.poseId;
      const found = memeList.find(m => m.id === poseId);
      if (found) {
        statusText.textContent = `✨ ${found.icon} ${found.name}!`;
        setTimeout(() => {
          if (isEnabled) statusText.textContent = 'AI Ready';
        }, 2200);
      }
    });
  }

  // Mount when page is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createHUD);
  } else {
    createHUD();
  }
})();
