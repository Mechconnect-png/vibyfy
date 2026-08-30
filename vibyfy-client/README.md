# Moodify (moodify-client)

A mood-aware music streaming web app built with React 19 + Vite, styled with
Tailwind CSS, and backed directly by [Supabase](https://supabase.com)
(Postgres + Auth + Storage). It includes webcam-based mood detection
(`face-api.js`), AI playlist/recommendation features, an artist dashboard,
and a basic admin panel.

## Tech Stack

- **Frontend:** React 19, React Router 7, Vite 8 (rolldown-vite), Tailwind CSS 4
- **State:** Zustand
- **Backend:** Supabase (Postgres, Auth, Storage) — accessed directly from the client via `@supabase/supabase-js`
- **Audio:** Howler.js
- **AI / ML:** face-api.js (in-browser face/expression detection for mood scanning)
- **Charts:** Recharts
- **Notifications:** react-hot-toast

> **Note:** The `moodify-server` folder in this repo is an empty Express
> scaffold (no routes, no DB connection) and is **not used** by the client.
> All data access happens directly from the browser against Supabase. You
> can safely ignore or delete `moodify-server` unless you plan to build a
> real backend for privileged operations (see "Known Limitations" below).

## Getting Started

```bash
npm install
cp .env.example .env   # fill in your Supabase project URL + anon key
npm run dev
```

- `npm run dev` — start the Vite dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — preview the production build locally
- `npm run lint` — run oxlint

### Environment Variables

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public API key |

These are safe to expose in the browser (the anon key relies on Supabase
Row Level Security policies for protection), but `.env` is still gitignored
by default — don't commit real project credentials.

## Supabase Schema (tables referenced by the app)

`profiles`, `user_stats`, `songs`, `artists`, `artist_followers`, `playlists`,
`playlist_songs`, `favorites`, `liked_songs`, `lyrics`, `notifications`,
`play_history`, `recently_played`, `song_plays`, `avatars` (storage bucket),
`covers` (storage bucket).

This app does not include SQL migrations — schema must be provisioned in
your Supabase project directly (see Known Limitations).

## Known Limitations / Backlog

- **No SQL schema/migrations included.** The tables above are inferred from
  the service layer; without access to the live Supabase project we could
  not verify column names or RLS policies. Recommend exporting the schema
  (`supabase db dump`) and committing it to the repo.
- **⚠️ Verify this before relying on the Follow feature:** `profileService.js`,
  `Profile.jsx`, and `Users.jsx` all read/write a `profiles.name` column, but
  `followService.js`'s joins select `profiles.full_name` and
  `profiles.avatar_url`. These can't both be right — check your actual
  Supabase schema and make the naming consistent (rename the column or fix
  `followService.js`'s select statements).
- **Account deletion** is UI-only (shows a message) because deleting an
  Auth user requires the Supabase **service role key**, which must never be
  exposed to the browser. This needs a small server-side function
  (Supabase Edge Function or the `moodify-server` backend) if you want
  self-serve account deletion.
- **Settings toggles** (dark mode, notifications, high-quality audio,
  autoplay) and the **language/accent color pickers** are functional as UI
  state (they update immediately and show a confirmation toast) but are not
  yet persisted to the user's profile, and the language/accent pickers don't
  drive real i18n or theming yet — wire these to `profiles` columns and a
  theming/i18n layer once you decide on the design.
- **Admin management pages** (bulk song/artist/user management beyond the
  dashboard stats view) are not yet built out. Several scaffold files
  hinting at this (`admin/Sidebar`, `admin/Topbar`, table components) were
  empty and unused, so they were removed during cleanup — recreate them if
  this becomes a priority.
- Route-level **role gating** now exists for `/admin/*` (requires
  `role: "admin"`) and `/artist`, `/artist/analytics` (requires `role:
  "artist"` or `"admin"`), reading from `profiles.role`. New signups are
  given `role: "user"` by default via `ensureProfile()`. Promote a user to
  `artist`/`admin` directly in Supabase for now — there's no admin UI for
  role management yet.
- The `songService` build chunk is large (~650KB / ~157KB gzip) primarily
  due to `face-api.js`'s bundled ML models code powering the mood scanner;
  this is expected for that feature, not a bug.
