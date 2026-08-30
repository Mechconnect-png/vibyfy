# Moodify Database Schema & ER Model

## Entity Relationship Overview

- **profiles** (1) ─── (N) **playlists**
- **playlists** (1) ─── (N) **playlist_songs** (N) ─── (1) **songs**
- **profiles** (1) ─── (N) **favorites** (N) ─── (1) **songs**
- **profiles** (1) ─── (N) **recently_played** (N) ─── (1) **songs**
- **artists** (1) ─── (N) **albums** (1) ─── (N) **songs**

## Schema Definitions

Refer to [`moodify-server/schema.sql`](../moodify-server/schema.sql) for full DDL and Row Level Security (RLS) policies.
