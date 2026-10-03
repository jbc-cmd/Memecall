# 🎭 MemeCall - AI Pose-Activated Meme Filter Chrome Extension

(Day 17).....

> Turn your webcam into a hilarious meme generator! Strike a pose during a **Google Meet**, **Zoom**, **Microsoft Teams**, **Discord**, or **Google Classroom** call, and MemeCall will instantly project animated meme stickers, sound effects, and comic overlays onto your live camera feed in real time.

---

## ✨ Features

- 📹 **Seamless WebRTC Interception**: Hooks directly into `navigator.mediaDevices.getUserMedia`. All meeting attendees will see your meme filters directly on your camera without requiring any third-party virtual webcam software like OBS!
- 🤖 **Real-Time AI Pose & Gesture Tracking**: Ultra-low latency visual recognition runs at 60 FPS directly on your device.
- 🎨 **19+ Animated Meme Stickers & Overlays**:
  - 🎭 **Gronk Meme Universe**:
    - 💅 **Baddie Gronk**: Mascara Wand & Fluttery Eyelashes
    - 🤓 **Nerd Gronk**: Thick Glasses & *"Umm Actually..."* ☝️
    - 😐 **NPC Gronk**: 1000-Yard Stare & Deadpan Stare
    - 🤨 **Smug Gronk**: Eyebrow / Chin Tilt (*Vine Boom / Sus*)
    - 😫 **Scream Gronk**: Gaping Wojak Scream & Shock Eyes
    - 🍭 **Beanie Gronk**: Spinning Propeller Hat & Rainbow Lollipop
    - 😄 **Laugh Gronk**: Buck Teeth Laughing Creature
    - 😛 **Blep Gronk**: Derp Blep with Tongue Out
  - ✌️ **Peace Sign**: Anime Kawaii Sparkles, Anime Eyes & "SUGOI!" Speech Bubble
  - 👍 **Thumbs Up**: Gigachad Sunglasses & Golden "APPROVED" Rubber Stamp
  - 👎 **Thumbs Down**: Sad Cat Tears & Red "SKILL ISSUE / REJECTED" Stamp
  - 🤫 **Mewing / Shhh**: Laser Jawline Contour & "🤫🧏 BYE BYE MOGGED" Banner
  - 😱 **Scream (Hands on Cheeks)**: Dramatic Manga Shock Lines & Wojak Scream
  - 🤦 **Facepalm**: Sweat Drop & Bold "BRUH MOMENT" Subtitle
  - 💪 **Muscle Flex**: Super Saiyan Golden Fire Aura & Lightning Sparks
  - 🫶 **Heart Hands**: Exploding Floating Hearts Burst
  - 👉 **Finger Guns**: Comic "POW! / BANG!" Explosion & Laser Pointer
  - 🧠 **Hand on Chin (Thinking)**: 500 IQ Glowing Galaxy Brain & Orbiting Math Formulas
  - 🫡 **Salute**: Military Commander Cap & "PRESS [F] TO PAY RESPECTS"
- 🔊 **Synthesized Web Audio SFX**: Instant zero-latency sound effects synced to each meme (can be muted or customized).
- 💊 **Floating In-Call Control Pill**: Minimalist draggable glassmorphism HUD injected into Google Meet and Zoom calls to toggle filters or trigger memes on demand.
- 🧪 **Live Camera Lab & Settings**: Extension popup includes a live test sandbox, sensitivity sliders, and gesture toggles.

---

## 📦 How to Install in Chrome / Edge / Brave

1. Open **Google Chrome** (or any Chromium browser like Brave, Edge, Opera).
2. Navigate to `chrome://extensions` in the address bar.
3. Toggle on **"Developer mode"** in the top-right corner.
4. Click the **"Load unpacked"** button in the top-left.
5. Select the `Memecall` project folder:
   ```
   c:\PlatformIO\Projects\Memecall
   ```
6. The **MemeCall** extension icon (🎭) is now active and ready to use!

---

## 📱 How to Use on Mobile (Android & iOS)

MemeCall fully supports mobile browsers with **touch drag gestures**, **compact responsive HUDs**, and **front-facing camera tracking**:

1. **On Android (Kiwi Browser / Lemur Browser)**:
   - Install **Kiwi Browser** or **Lemur Browser** from the Play Store (they support desktop Chrome extensions on mobile).
   - Go to `chrome://extensions`, enable **Developer mode**, tap **Load unpacked**, and select the `Memecall` folder!
2. **On iPhone / iPad (Safari) or Android (Firefox / Chrome)**:
   - Install a free userscript manager (e.g. **Userscripts** or **Stay** app for iOS Safari, **Violentmonkey** for Android).
   - Load [`mobile/memecall.user.js`](./mobile/memecall.user.js) to activate MemeCall with 1 tap in mobile Google Meet & Zoom calls!
   - Full guide: [`mobile/MOBILE_GUIDE.md`](./mobile/MOBILE_GUIDE.md).

---

## 🚀 How to Use in Video Calls

### 1. In Google Meet / Zoom / Microsoft Teams
1. Join your meeting as usual at [meet.google.com](https://meet.google.com) or [zoom.us](https://zoom.us).
2. Turn ON your webcam.
3. You will notice the sleek **MemeCall Floating Pill (🎭)** in the top-right corner.
4. Strike any pose in front of your camera (e.g. flash a Peace Sign ✌️ or Thumbs Up 👍) to trigger the meme!

### 2. Immediate Local Testing (Simulator)
- Double-click and open [`test-call-room.html`](./test-call-room.html) in your browser.
- Click **"Turn On Camera"** to test your poses and memes instantly in a simulated meeting room!

---

## 📂 Project Architecture

```
Memecall/
├── manifest.json              # Chrome Manifest V3 configuration
├── icons/                     # Generated extension icons (16, 48, 128)
├── popup/
│   ├── popup.html             # Extension popup UI
│   ├── popup.css              # Dark mode glassmorphism styles
│   └── popup.js               # Camera lab & settings manager
├── content/
│   ├── hud-bridge.js          # In-call draggable floating control pill
│   └── hud-overlay.css        # In-call HUD styling
├── engine/
│   ├── camera-interceptor.js  # WebRTC getUserMedia hook & stream compositor
│   ├── pose-detector.js       # Fast AI gesture & landmark classifier
│   ├── meme-renderer.js       # Dynamic spring animations & canvas renderer
│   ├── meme-assets.js         # Vector sticker graphics & overlay designs
│   └── audio-sfx.js           # Web Audio API sound effect synthesizer
├── mobile/
│   ├── MOBILE_GUIDE.md        # Complete mobile setup instructions
│   ├── bookmarklet.txt        # One-tap mobile browser loader
│   └── memecall.user.js       # Tampermonkey / Safari Userscript
└── test-call-room.html        # Interactive video call simulation room
```

---

## 📄 License

MIT License © 2026 [jbc-cmd](https://github.com/jbc-cmd)

