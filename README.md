# VIBYFY — "Feel the vibe. Find your sound." 🎵

VIBYFY Version 2.0 is an AI-powered Mood Intelligence and Music Discovery Platform designed to help users discover music based on how they currently feel and how they want to feel.

---

## 🌟 Key Product Features

1. **Phase 1 — Cinematic Splash Screen Experience**:
   - Dark glassmorphism intro with animated glowing VIBYFY logo, brand tagline *"Feel the vibe. Find your sound."*, and custom soundwave frequency indicator.

2. **Logo & Brand Identity System**:
   - Original VIBYFY logo system (`VibyfyLogo.jsx`) supporting multiple scale sizes (`small`, `medium`, `large`, `xlarge`) with ambient vector pulse effects.

3. **Phase 3 — Premium Home Screen**:
   - Hero Mood Scan CTA featuring an interactive circular glowing button **[ SCAN MY VIBE ]** with animated audio wave pulses.
   - Quick Manual Vibe Selector chips (`Happy`, `Sad`, `Calm`, `Angry`, `Stressed`, `Excited`, `Neutral`).
   - Interactive **Mood Journeys** section (*Sad → Calm*, *Stressed → Relaxed*, *Tired → Energized*, *Angry → Peaceful*).

4. **Phase 4 & 5 — Automatic Mood Lock System (Highest Priority)**:
   - Opt-in camera scanner with continuous expression analysis using local browser `face-api.js`.
   - **Automatic Mood Lock**: Automatically locks `lockedMood` after ~1.5s of consistent emotion detection (confidence threshold >= 75%).
   - **Resource Cleanup**: Instantly halts camera tracks, detection intervals, and animation frames upon locking.
   - **Session Immutability**: Once locked, `lockedMood` NEVER changes even if the user smiles or alters facial expression. `lockedMood` can ONLY be reset when the user explicitly clicks `[ Scan Again ]`.

5. **Phase 6 — Auto Lock Success Experience**:
   - Camera preview freezes with pulse micro-interaction, `🔒 VIBE LOCKED` badge, large mood icon, and direct `[ Discover Your Sound ]` call to action.

6. **Phase 7 & 8 — Provider-Independent Spotify Discovery Engine**:
   - Provider abstraction layer (`musicDiscoveryService.js`, `spotifyService.js`).
   - Normalizes songs with metadata and generates direct `[ Open in Spotify ]` app/web links. Zero unauthorized audio downloading or platform policy violations.

7. **Phase 10 — Relief Zone**:
   - Multi-step emotional transition engine: *Current Vibe* → *Target Goal Vibe* → *Transition Soundscape Playlist*.

8. **Phase 11 — Dynamic Mood Color System**:
   - Centralized design tokens in `src/theme/moods.js` providing custom gradients, accents, emojis, and styling per mood.

9. **Phase 13 & 16 — Responsive Design & Profile**:
   - Mobile bottom navigation bar (`MobileNav.jsx`) paired with desktop sidebar (`Sidebar.jsx`).
   - User profile with scan history, privacy preferences, and **VIBYFY Pro** tier architectural modal.

---

## 🏗️ Tech Stack

- **Frontend Client**: React 19, Vite 8, Tailwind CSS 4, Zustand 5, Framer Motion, Lucide React, Axios, React Router 7.
- **AI Emotion Engine**: Local browser face feature estimation via `face-api.js` with demo AI scan fallback.
- **Backend API**: Node.js, Express.js.
- **Database & Auth**: Supabase PostgreSQL / REST API schema.

---

## 🚀 Quick Start

### 1. Frontend Client
```bash
cd vibyfy-client
npm install
npm run dev
```

### 2. Backend Server
```bash
cd vibyfy-server
npm install
npm run dev
```

---

## 🔒 Privacy & Non-Medical Disclaimer

- **Local Execution**: All facial expression analysis executes locally inside the user's browser context. Facial images are never saved, recorded, or transmitted to any remote server.
- **Non-Medical Disclaimer**: VIBYFY is strictly an entertainment and music discovery personalization platform. It does not perform medical analysis, diagnosis, or clinical mental health treatment.
