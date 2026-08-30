import axios from "axios";

// User Token Store in-memory for dev sessions
const userTokens = new Map();

/**
 * Generate Spotify OAuth User Authorization Login URL
 */
export const getAuthUrl = (req, res) => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI || "http://localhost:5173/spotify-callback";
  
  if (!clientId) {
    return res.status(400).json({ success: false, error: "SPOTIFY_CLIENT_ID missing in backend .env" });
  }

  const scopes = [
    "user-modify-playback-state",
    "user-read-playback-state",
    "user-read-currently-playing",
    "streaming"
  ].join(" ");

  const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}`;

  return res.json({
    success: true,
    authUrl,
    redirectUri,
  });
};

/**
 * Exchange Authorization Code for User Tokens
 */
export const handleCallback = async (req, res) => {
  const { code, userId = "default-user", redirectUri: clientRedirectUri } = req.body;
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = clientRedirectUri || process.env.SPOTIFY_REDIRECT_URI || "http://localhost:5173/spotify-callback";

  if (!code) {
    return res.status(400).json({ success: false, error: "Authorization code required" });
  }

  try {
    const authString = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${authString}`,
        },
      }
    );

    const { access_token, refresh_token, expires_in } = response.data;
    
    // Save user token state
    userTokens.set(userId, {
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresAt: Date.now() + expires_in * 1000,
    });

    console.log("✅ Spotify User Authorization Token Acquired for user:", userId);

    return res.json({
      success: true,
      userAccessToken: access_token,
      expiresIn: expires_in,
    });
  } catch (error) {
    console.error("Spotify OAuth Callback Error:", error?.response?.data || error.message);
    return res.status(500).json({
      success: false,
      error: error?.response?.data?.error_description || "Failed to exchange authorization code",
    });
  }
};

/**
 * Get Spotify User Authorization Connection Status
 */
export const getUserStatus = (req, res) => {
  const { userId = "default-user" } = req.query;
  const userTokenData = userTokens.get(userId);

  if (userTokenData && userTokenData.accessToken && Date.now() < userTokenData.expiresAt) {
    return res.json({
      success: true,
      playbackConnected: true,
      userAccessToken: userTokenData.accessToken,
    });
  }

  return res.json({
    success: true,
    playbackConnected: false,
    message: "Spotify metadata discovery active. User playback token not connected.",
  });
};

/**
 * Execute Authorized Spotify Playback (PUT /v1/me/player/play)
 */
export const startUserPlayback = async (req, res) => {
  const { spotifyUri, userAccessToken, userId = "default-user" } = req.body;

  let token = userAccessToken;
  if (!token) {
    const stored = userTokens.get(userId);
    if (stored && stored.accessToken) token = stored.accessToken;
  }

  if (!spotifyUri) {
    return res.status(400).json({ success: false, error: "spotifyUri is required" });
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      code: "NO_USER_TOKEN",
      error: "Spotify user playback is not connected. User authorization token required.",
    });
  }

  try {
    await axios.put(
      "https://api.spotify.com/v1/me/player/play",
      { uris: [spotifyUri] },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("▶️ Spotify API Playback Started:", spotifyUri);

    return res.json({
      success: true,
      playbackStarted: true,
      spotifyUri,
    });
  } catch (error) {
    const status = error?.response?.status;
    const details = error?.response?.data?.error;
    console.warn("Spotify Playback API notice:", status, details?.message || error.message);

    if (status === 404) {
      return res.status(404).json({
        success: false,
        code: "NO_ACTIVE_DEVICE",
        error: "No active Spotify playback device found. Open Spotify app once and try again.",
      });
    }

    if (status === 403) {
      return res.status(403).json({
        success: false,
        code: "PREMIUM_REQUIRED",
        error: "Spotify Premium is required for direct remote Web API playback control.",
      });
    }

    return res.status(500).json({
      success: false,
      code: "PLAYBACK_API_ERROR",
      error: details?.message || "Failed to trigger Spotify Web API playback",
    });
  }
};
