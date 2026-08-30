# Moodify System Architecture Document

## Overview

Moodify follows a decoupled modern full-stack web application architecture:

```
[ Client: React + Vite + Tailwind + Zustand ]
        │                       │
        ▼                       ▼
[ HTML5 Audio Engine ]    [ Browser AI Face-API ]
        │                       │
        ▼                       ▼
[ Express API Server ] ◄──► [ Supabase DB & Auth ]
```

## Component Breakdown

1. **Presentation Layer (React 19)**:
   - `MainLayout`: Desktop sidebar & mobile bottom bar (`MobileNav.jsx`).
   - `MiniPlayer`: Persistent player docked at screen bottom.
   - `MoodScanner`: Browser camera opt-in expression analyzer.
   - `Relief`: Emotional transition dashboard.

2. **State & Audio Layer (Zustand + HTML5 Audio)**:
   - `playerStore.js`: Global player state (current track, queue, playback state).
   - `audioService.js`: HTML5 Audio singleton wrapping play, pause, seek, volume, preloading.
   - `moodStore.js`: Active mood state, confidence score, recommendation playlist.

3. **Service & API Layer**:
   - `songService.js`: Handles API calls with automatic dual-mode fallback to local mock data.
   - `adService.js`: Tracks continuous listening duration (~30 min limit) for ad eligibility.

4. **Data Layer (Supabase / Express)**:
   - Supabase Auth for identity management.
   - PostgreSQL schema with Row Level Security for user profiles, playlists, favorites, and history.
