import { doc, setDoc, deleteDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { db, auth } from "../config/firebase";

const LOCAL_STORAGE_KEY = "vibyfy_favorite_song_ids";

const getLocalFavorites = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
};

const setLocalFavorites = (ids) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(ids));
  } catch (err) {
    console.error("LocalStorage save error:", err);
  }
};

export const likeSong = async (songId) => {
  if (!songId) return;

  const localIds = getLocalFavorites();
  if (!localIds.includes(songId)) {
    setLocalFavorites([...localIds, songId]);
  }

  const user = auth.currentUser;
  if (user) {
    try {
      const docRef = doc(db, "users", user.uid, "favorites", songId);
      await setDoc(docRef, { songId, likedAt: new Date().toISOString() }, { merge: true });
    } catch (err) {
      console.warn("Firestore favorite insert warning:", err.message);
    }
  }

  return true;
};

export const unlikeSong = async (songId) => {
  if (!songId) return;

  const localIds = getLocalFavorites();
  setLocalFavorites(localIds.filter((id) => id !== songId));

  const user = auth.currentUser;
  if (user) {
    try {
      const docRef = doc(db, "users", user.uid, "favorites", songId);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn("Firestore favorite delete warning:", err.message);
    }
  }

  return true;
};

export const isLiked = async (songId) => {
  if (!songId) return false;

  const localIds = getLocalFavorites();
  if (localIds.includes(songId)) return true;

  const user = auth.currentUser;
  if (user) {
    try {
      const docRef = doc(db, "users", user.uid, "favorites", songId);
      const snap = await getDoc(docRef);
      return snap.exists();
    } catch (err) {}
  }

  return false;
};

export const getLikedSongs = async () => {
  const localIds = getLocalFavorites();
  const user = auth.currentUser;

  if (user) {
    try {
      const favsRef = collection(db, "users", user.uid, "favorites");
      const snap = await getDocs(favsRef);
      const list = [];
      snap.forEach((d) => list.push(d.data()));
      if (list.length > 0) return list;
    } catch (err) {
      console.warn("Firestore favorites fetch warning:", err.message);
    }
  }

  return localIds.map((id) => ({ id, spotifyId: id, title: `Track ${id}`, artist: "Spotify Artist" }));
};