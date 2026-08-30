# VIBYFY (vibyfy-client)

A mood-aware music streaming web app built with React 19 + Vite, styled with
Tailwind CSS, backed by Firebase (Authentication & Firestore) and Spotify API backend (`https://vibyfy-server.onrender.com`).
It includes webcam-based mood detection (`face-api.js`), AI music discovery, Relief Zone soundscapes, and Spotify playback integration.

## Tech Stack

- **Frontend:** React 19, React Router 7, Vite 8, Tailwind CSS 4
- **State:** Zustand
- **Authentication & Database:** Firebase Authentication (Email/Password) & Firestore
- **Music & Spotify Backend:** Node.js Express server (`https://vibyfy-server.onrender.com`)
- **AI / ML:** face-api.js (in-browser face/expression detection for mood scanning)

## Getting Started

```bash
npm install
npm run build
```
