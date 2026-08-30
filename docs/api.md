# Moodify REST API Specification

## Endpoints

### 1. Songs
- `GET /api/songs`: List songs. Query params: `mood`, `relief`.
- `GET /api/songs/:id`: Get single song metadata.

### 2. Artists & Albums
- `GET /api/artists`: List featured Tamil artists.
- `GET /api/albums`: List albums.

### 3. Search
- `GET /api/search?q=query`: Search songs, artists, and playlists.

### 4. Playlists & User Data
- `GET /api/playlists`: User playlists.
- `POST /api/playlists`: Create new playlist.
- `POST /api/favorites`: Add song to favorites.
- `DELETE /api/favorites/:songId`: Remove song from favorites.
- `POST /api/recently-played`: Record play history.
